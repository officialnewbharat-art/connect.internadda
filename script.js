// Internadda Connect - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Initialize all functionality
    initNavbar();
    initSmoothScrolling();
    initFormValidation();
    initTiltEffects();
    initScrollAnimations();
    initHeroBackground();
    initButtons();
});

// Initialize Navbar Functionality
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Navbar shadow on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Navbar CTA button click
    document.getElementById('navCta').addEventListener('click', function() {
        scrollToSection('lead-form');
    });
}

// Initialize Smooth Scrolling
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') return;
            
            e.preventDefault();
            scrollToSection(href.substring(1));
        });
    });
}

// Scroll to a specific section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.navbar').offsetHeight;
        const sectionPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: sectionPosition,
            behavior: 'smooth'
        });
    }
}

// Initialize Form Validation and Submission
function initFormValidation() {
    const form = document.getElementById('leadForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitLoader = document.getElementById('submitLoader');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Hide loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Show success modal
                showSuccessModal();
                
                // Reset form
                form.reset();
            }, 1500);
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
}

// Validate the entire form
function validateForm() {
    const form = document.getElementById('leadForm');
    const inputs = form.querySelectorAll('input, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate a single field
function validateField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.id}Error`);
    
    // Clear previous error
    clearError(field);
    
    // Check if field is required
    if (field.hasAttribute('required') && !value) {
        showError(field, 'This field is required');
        return false;
    }
    
    // Field-specific validation
    switch(field.id) {
        case 'name':
            if (value.length < 2) {
                showError(field, 'Name must be at least 2 characters');
                return false;
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(value)) {
                showError(field, 'Please enter a valid 10-digit phone number');
                return false;
            }
            break;
            
        case 'businessType':
            if (!value) {
                showError(field, 'Please select a business type');
                return false;
            }
            break;
            
        case 'area':
            if (value.length < 3) {
                showError(field, 'Please enter a valid area/location');
                return false;
            }
            break;
    }
    
    return true;
}

// Show error for a field
function showError(field, message) {
    const errorElement = document.getElementById(`${field.id}Error`);
    errorElement.textContent = message;
    field.style.borderColor = '#FF6B6B';
}

// Clear error for a field
function clearError(field) {
    const errorElement = document.getElementById(`${field.id}Error`);
    errorElement.textContent = '';
    field.style.borderColor = '';
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
    
    // Close modal when clicking the close button
    document.getElementById('modalCloseBtn').addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Initialize Tilt Effects for Cards
function initTiltEffects() {
    // Simple tilt effect for cards with data-tilt attribute
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const cardRect = this.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            const rotateX = (mouseY / cardRect.height) * -10;
            const rotateY = (mouseX / cardRect.width) * 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Initialize Scroll Animations
function initScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.step-card, .business-card, .feature-card, .testimonial-card');
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe each element
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize Hero Background Animation
function initHeroBackground() {
    const heroBg = document.getElementById('heroBg');
    if (!heroBg) return;
    
    // Create floating particles for hero background
    for (let i = 0; i < 15; i++) {
        createFloatingParticle(heroBg);
    }
    
    // Animate the existing floating elements
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((el, index) => {
        // Set random initial animation delay
        el.style.animationDelay = `${index * 0.5}s`;
    });
}

// Create floating particle for hero background
function createFloatingParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    
    // Random size and position
    const size = Math.random() * 10 + 5;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Random color (blue or teal)
    const colors = ['rgba(108, 99, 255, 0.2)', 'rgba(0, 212, 170, 0.2)'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Apply styles
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        top: ${posY}%;
        left: ${posX}%;
        animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
        z-index: 1;
    `;
    
    container.appendChild(particle);
}

// Initialize Button Functionality
function initButtons() {
    // Hero buttons
    document.getElementById('becomePartnerBtn').addEventListener('click', function() {
        scrollToSection('lead-form');
    });
    
    document.getElementById('getStudentsBtn').addEventListener('click', function() {
        scrollToSection('how-it-works');
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            
            // Calculate position
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            // Style ripple
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            // Add to button
            this.appendChild(ripple);
            
            // Remove after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add CSS for ripple animation
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(rippleStyles);
