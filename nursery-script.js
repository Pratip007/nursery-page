// Nursery Website JavaScript

// Hero Slider Functionality
class HeroSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.hero-slide');
        this.autoSlideInterval = null;
        this.leftClickArea = document.querySelector('.hero-click-left');
        this.rightClickArea = document.querySelector('.hero-click-right');
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        // Set initial positions
        this.updateSlider();
        
        // Add click listeners for manual navigation
        if (this.leftClickArea) {
            this.leftClickArea.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.rightClickArea) {
            this.rightClickArea.addEventListener('click', () => this.nextSlide());
        }
        
        // Start auto-sliding
        this.startAutoSlide();
        
       
    }
    
    updateSlider() {
        // Position slides to prevent white background showing
        this.slides.forEach((slide, index) => {
            const offset = index - this.currentSlide;
            slide.style.transform = `translateX(${offset * 100}%)`;
            slide.style.transition = 'transform 0.8s ease-in-out';
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.updateSlider();
    }
    
    startAutoSlide() {
        this.stopAutoSlide(); // Clear any existing interval
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 3000); // Change slide every 3 seconds
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
}

// Image Preview Modal
class ImagePreviewModal {
    constructor() {
        this.modal = document.getElementById('imagePreviewModal');
        this.previewImage = document.getElementById('previewImage');
        this.closeButton = document.getElementById('closeImageModal');
        
        this.init();
    }
    
    init() {
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.hideModal());
        }
        
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hideModal();
                }
            });
        }
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && !this.modal.classList.contains('hidden')) {
                this.hideModal();
            }
        });
    }
    
    showModal(imageUrl) {
        if (this.modal && this.previewImage) {
            this.previewImage.src = imageUrl;
            this.modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideModal() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            document.body.style.overflow = '';
            
            // Clear the image source to stop loading
            if (this.previewImage) {
                this.previewImage.src = '';
            }
        }
    }
}

// Plant Scroll Sections
class PlantScrollLoader {
    constructor() {
        this.indoorContainer = document.getElementById('indoorPlantsScroll');
        this.outdoorContainer = document.getElementById('outdoorPlantsScroll');
        this.imageModal = new ImagePreviewModal();
        this.init();
    }
    
    init() {
        if (this.indoorContainer) {
            this.loadIndoorPlants();
        }
        if (this.outdoorContainer) {
            this.loadOutdoorPlants();
        }
    }
    
    createPlantCard(imageUrl, plantName, category, index) {
        const cardId = `plant-card-${category.replace(' ', '-').toLowerCase()}-${index}`;
        return `
            <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex-shrink-0" style="width: 280px;">
                <div class="relative overflow-hidden cursor-pointer plant-image-container" 
                     data-image="${imageUrl}" 
                     data-title="${plantName}" 
                     data-description="${category}">
                    <img 
                        src="${imageUrl}" 
                        alt="${plantName}" 
                        class="w-full h-64 object-cover hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        onerror="this.parentElement.parentElement.style.display='none'"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div class="bg-white bg-opacity-90 rounded-full p-3">
                            <i class="fas fa-search-plus text-gray-800 text-lg"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    addClickHandlers() {
        const imageContainers = document.querySelectorAll('.plant-image-container');
        imageContainers.forEach(container => {
            if (!container.hasAttribute('data-click-handler-added')) {
                container.addEventListener('click', () => {
                    const imageUrl = container.getAttribute('data-image');
                    this.imageModal.showModal(imageUrl);
                });
                container.setAttribute('data-click-handler-added', 'true');
            }
        });
    }
    
    loadIndoorPlants() {
        const plantNames = [
            'Monstera Deliciosa', 'Snake Plant', 'Peace Lily', 'Fiddle Leaf Fig',
            'Rubber Plant', 'ZZ Plant', 'Pothos', 'Philodendron',
            'Spider Plant', 'Boston Fern', 'Aloe Vera', 'Chinese Evergreen'
        ];
        
        let cardsHTML = '';
        for (let i = 1; i <= 12; i++) {
            const imageUrl = i === 3 ? `images/indoor-plants/${i}.webp` : `images/indoor-plants/${i}.jpg`;
            const plantName = plantNames[i - 1] || `Indoor Plant ${i}`;
            cardsHTML += this.createPlantCard(imageUrl, plantName, 'Indoor Plant', i);
        }
        
        this.indoorContainer.innerHTML = cardsHTML;
        // Add click handlers after content is loaded
        setTimeout(() => this.addClickHandlers(), 100);
    }
    
    loadOutdoorPlants() {
        const plantNames = [
            'Rose Bush', 'Lavender', 'Hydrangea', 'Jasmine',
            'Bougainvillea', 'Marigold', 'Sunflower', 'Hibiscus',
            'Geranium', 'Petunia', 'Azalea', 'Begonia'
        ];
        
        let cardsHTML = '';
        for (let i = 1; i <= 12; i++) {
            const imageUrl = `images/outdoor-plants/${i}.jpg`;
            const plantName = plantNames[i - 1] || `Outdoor Plant ${i}`;
            cardsHTML += this.createPlantCard(imageUrl, plantName, 'Outdoor Plant', i);
        }
        
        this.outdoorContainer.innerHTML = cardsHTML;
        // Add click handlers after content is loaded
        setTimeout(() => this.addClickHandlers(), 100);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroSlider();
    new PlantScrollLoader();
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Shopping Cart Functionality
let cart = JSON.parse(localStorage.getItem('nurseryCart')) || [];

// Update cart count display
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Add scrollbar hide CSS
const style = document.createElement('style');
style.textContent = `
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
`;
document.head.appendChild(style);
