// Indoor Plants Page JavaScript - Fast Loading Version

// Image folder path
const IMAGE_FOLDER = 'images/indoor-plants/';

// Generate array of image numbers (1 to 20)
const indoorPlantImages = Array.from({length: 20}, (_, i) => (i + 1).toString());

// DOM Elements
const plantsContainer = document.getElementById('plantsContainer');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const imagePreviewModal = document.getElementById('imagePreviewModal');
const previewImage = document.getElementById('previewImage');
const previewTitle = document.getElementById('previewTitle');
const previewDescription = document.getElementById('previewDescription');
const closeModal = document.getElementById('closeModal');

// State
let currentPage = 1;
let imagesPerPage = 12;
let filteredImages = [...indoorPlantImages];
let isLoading = false;

// Get optimized image URL
function getOptimizedImageUrl(imageNumber) {
    return `${IMAGE_FOLDER}${imageNumber}.jpg`;
}

// Create plant card HTML with only photos
function createPlantCard(imageNumber, index, isAboveFold = false) {
    const imageUrl = getOptimizedImageUrl(imageNumber);
    
    // For above-the-fold images, load immediately. For others, use lazy loading.
    const loadingAttr = isAboveFold ? '' : 'loading="lazy"';
    const srcAttr = isAboveFold ? `src="${imageUrl}"` : `data-src="${imageUrl}"`;
    const imageClass = isAboveFold ? 'w-full h-64 object-cover hover:scale-110 transition-transform duration-300' : 'w-full h-64 object-cover hover:scale-110 transition-transform duration-300 lazy-image';
    
    return `
        <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
            <div class="relative overflow-hidden cursor-pointer plant-image" 
                 data-image="${imageUrl}"
                 data-title="Plant Image ${imageNumber}"
                 data-description="Indoor plant from our collection">
                <img 
                    ${srcAttr}
                    alt="Plant ${imageNumber}" 
                    class="${imageClass}"
                    ${loadingAttr}
                    decoding="async"
                    width="400"
                    height="256"
                    onload="this.style.opacity='1'"
                    onerror="this.parentElement.parentElement.style.display='none'"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
        </div>
    `;
}

// Fast Intersection Observer for lazy loading
const observerOptions = {
    root: null,
    rootMargin: '100px', // Start loading earlier
    threshold: 0.01
};

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            
            if (img.dataset.src && !img.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        }
    });
}, observerOptions);

// Display plants with fast loading
function displayPlants(reset = false) {
    if (isLoading) return;
    isLoading = true;

    if (reset) {
        currentPage = 1;
        plantsContainer.innerHTML = '';
    }

    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    const plantsToShow = filteredImages.slice(startIndex, endIndex);

    if (plantsToShow.length === 0 && currentPage === 1) {
        plantsContainer.innerHTML = '<div class="col-span-full text-center text-gray-600 text-xl">No plants found matching your search.</div>';
        loadMoreBtn.style.display = 'none';
        isLoading = false;
        return;
    }

    // First page images load immediately (above the fold)
    const plantsHTML = plantsToShow.map((imageNumber, index) => {
        const isAboveFold = currentPage === 1 && index < 8; // First 8 images load immediately
        return createPlantCard(imageNumber, startIndex + index, isAboveFold);
    }).join('');
    
    if (reset) {
        plantsContainer.innerHTML = plantsHTML;
    } else {
        plantsContainer.insertAdjacentHTML('beforeend', plantsHTML);
    }

    // Set up lazy loading only for images that need it
    const newLazyImages = plantsContainer.querySelectorAll('.lazy-image:not([data-observed])');
    newLazyImages.forEach(img => {
        img.setAttribute('data-observed', 'true');
        imageObserver.observe(img);
    });

    // Add click event listeners to new plant images
    const newPlantImages = plantsContainer.querySelectorAll('.plant-image:not([data-listener])');
    newPlantImages.forEach(image => {
        image.setAttribute('data-listener', 'true');
        image.addEventListener('click', () => {
            showImagePreview(
                image.dataset.image,
                image.dataset.title,
                image.dataset.description
            );
        });
    });

    // Update load more button visibility
    if (endIndex >= filteredImages.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }

    isLoading = false;
}

// Show image preview modal with only photo
function showImagePreview(imageUrl, title, description) {
    previewImage.src = imageUrl;
    
    // Hide all text elements in the modal
    if (previewTitle) previewTitle.style.display = 'none';
    if (previewDescription) previewDescription.style.display = 'none';
    
    // Hide the entire text container if it exists
    const textContainer = previewImage.parentElement.querySelector('.mt-4');
    if (textContainer) textContainer.style.display = 'none';
    
    imagePreviewModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Hide image preview modal
function hideImagePreview() {
    imagePreviewModal.classList.add('hidden');
    document.body.style.overflow = '';
    
    // Reset text elements visibility for next time (optional)
    if (previewTitle) previewTitle.style.display = 'block';
    if (previewDescription) previewDescription.style.display = 'block';
    const textContainer = previewImage.parentElement.querySelector('.mt-4');
    if (textContainer) textContainer.style.display = 'block';
}

// Load more plants
function loadMorePlants() {
    currentPage++;
    displayPlants();
}

// Aggressive preloading for faster experience
function preloadCriticalImages() {
    // Preload first 12 images immediately
    const criticalImages = indoorPlantImages.slice(0, 12);
    criticalImages.forEach(imageNumber => {
        const img = new Image();
        img.src = getOptimizedImageUrl(imageNumber);
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add minimal CSS for fast loading
    const style = document.createElement('style');
    style.textContent = `
        img {
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        
        img[src] {
            opacity: 1;
        }
        
        /* Remove slow animations */
        .lazy-image {
            opacity: 0;
        }
        
        .lazy-image[src] {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Only initialize if we're on the indoor plants page
    if (plantsContainer) {
        // Aggressively preload critical images
        preloadCriticalImages();
        
        // Display plants immediately
        displayPlants();
        
        // Event listeners
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMorePlants);
        }
    }

    // Modal event listeners - Set up immediately
    const modal = document.getElementById('imagePreviewModal');
    const closeBtn = document.getElementById('closeModal');
    
    if (closeBtn && modal) {
        // Close button click
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked'); // Debug log
            hideImagePreview();
        });
        
        // Click outside modal to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                console.log('Modal background clicked'); // Debug log
                hideImagePreview();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                console.log('Escape key pressed'); // Debug log
                hideImagePreview();
            }
        });
    } else {
        console.error('Modal elements not found:', { closeBtn, modal }); // Debug log
    }
}); 