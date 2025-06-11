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
        
        // Pause auto-slide on hover and resume on leave
        const heroSection = document.querySelector('#home');
        heroSection.addEventListener('mouseenter', () => this.stopAutoSlide());
        heroSection.addEventListener('mouseleave', () => this.startAutoSlide());
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
    
    // stopAutoSlide() {
    //     if (this.autoSlideInterval) {
    //         clearInterval(this.autoSlideInterval);
    //         this.autoSlideInterval = null;
    //     }
    // }
}

// Initialize hero slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroSlider();
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

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

// Shopping Cart Functionality
let cart = JSON.parse(localStorage.getItem('nurseryCart')) || [];

// Update cart count display
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Add to cart functionality
