// Nursery Website JavaScript


// Hero Slider Functionality with Optimized Loading
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
        
        // Start auto-sliding after initial load
        setTimeout(() => this.startAutoSlide(), 500);
        
        
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
        }, 3000); // Auto-slide every 4 seconds
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
            <div class="bg-white rounded-xl shadow-lg overflow-hidden flex-shrink-0" style="width: 280px;">
                <div class="relative overflow-hidden cursor-pointer plant-image-container" 
                     data-image="${imageUrl}">
                    <img 
                        src="${imageUrl}" 
                        alt="Plant Image" 
                        class="w-full h-64 object-cover"
                        loading="lazy"
                        onerror="this.parentElement.parentElement.style.display='none'"
                    />
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
        // Show loading placeholder
        this.indoorContainer.innerHTML = '<div class="flex items-center justify-center py-8"><div class="text-gray-500">Loading plants...</div></div>';
        
        let cardsHTML = '';
        for (let i = 1; i <= 12; i++) {
            const imageUrl = i === 3 ? `images/indoor-plants/${i}.webp` : `images/indoor-plants/${i}.jpg`;
            cardsHTML += this.createPlantCard(imageUrl, '', 'Indoor Plant', i);
        }
        
        // Simulate progressive loading
        setTimeout(() => {
            this.indoorContainer.innerHTML = cardsHTML;
            // Add click handlers after content is loaded
            setTimeout(() => this.addClickHandlers(), 100);
        }, 300);
    }
    
    loadOutdoorPlants() {
        // Show loading placeholder
        this.outdoorContainer.innerHTML = '<div class="flex items-center justify-center py-8"><div class="text-gray-500">Loading plants...</div></div>';
        
        let cardsHTML = '';
        for (let i = 1; i <= 12; i++) {
            const imageUrl = `images/outdoor-plants/${i}.jpg`;
            cardsHTML += this.createPlantCard(imageUrl, '', 'Outdoor Plant', i);
        }
        
        // Simulate progressive loading with slight delay for outdoor
        setTimeout(() => {
            this.outdoorContainer.innerHTML = cardsHTML;
            // Add click handlers after content is loaded
            setTimeout(() => this.addClickHandlers(), 100);
        }, 600);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize hero slider first (critical)
    const heroSlider = new HeroSlider();
    
    // Initialize mobile menu (immediate)
    const mobileMenu = new MobileMenu();
    
    // Initialize image preview modal
    const imageModal = new ImagePreviewModal();
    
    // Delay plant loading to prioritize hero section
    setTimeout(() => {
        new PlantScrollLoader();
    }, 1500); // Wait 1.5 seconds for hero to settle
});



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

// Mobile Menu Functionality
class MobileMenu {
    constructor() {
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.line1 = document.getElementById('line1');
        this.line2 = document.getElementById('line2');
        this.line3 = document.getElementById('line3');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close menu when clicking on menu links
        if (this.mobileMenu) {
            const menuLinks = this.mobileMenu.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.mobileMenuToggle.contains(e.target) && !this.mobileMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Close menu on window resize if desktop view
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && this.isOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isOpen = true;
        this.mobileMenu.classList.remove('hidden');
        this.animateToX();
        document.body.style.overflow = 'hidden';
    }
    
    closeMenu() {
        this.isOpen = false;
        this.mobileMenu.classList.add('hidden');
        this.animateToHamburger();
        document.body.style.overflow = '';
    }
    
    animateToX() {
        // Transform hamburger to X
        this.line1.style.transform = 'rotate(45deg) translate(5px, 5px)';
        this.line2.style.opacity = '0';
        this.line3.style.transform = 'rotate(-45deg) translate(7px, -6px)';
    }
    
    animateToHamburger() {
        // Transform X back to hamburger
        this.line1.style.transform = 'rotate(0) translate(0, 0)';
        this.line2.style.opacity = '1';
        this.line3.style.transform = 'rotate(0) translate(0, 0)';
    }
}
