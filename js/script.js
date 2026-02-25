/* ============================================
   CV WEBSITE - MAIN JAVASCRIPT
   ============================================
   Author: Your Name
   Description: Interactive features for Data Analyst CV
   ============================================ */

// ============================================
// INITIALIZATION - Wait for DOM to load
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initSmoothScroll();
    initActiveNavOnScroll();
    initScrollAnimations();
    initTypingEffect();
    initDownloadButton();
    initBackToTop();
    initSkillsAnimation();
    initCounterAnimation();
    initMobileMenu();
    initCopyEmail();
    initProjectFilter();
    initDarkMode();
    initLoadingScreen();
    initParallaxEffect();
    initTooltips();
    
    console.log('✅ CV Website initialized successfully!');
});

// ============================================
// 1. SMOOTH SCROLL NAVIGATION
// ============================================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link, a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only process internal links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href;
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Calculate offset for fixed navbar
                    const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
                    const targetPosition = targetSection.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

// ============================================
// 2. ACTIVE NAV LINK ON SCROLL
// ============================================
function initActiveNavOnScroll() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const nav = document.querySelector('.nav');
    
    if (!sections.length || !navLinks.length) return;
    
    // Throttle function for better performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY;
        const navHeight = nav?.offsetHeight || 0;
        
        // Add shadow to nav on scroll
        if (scrollPosition > 50) {
            nav?.classList.add('scrolled');
        } else {
            nav?.classList.remove('scrolled');
        }
        
        // Find current section
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update active class on nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', throttle(updateActiveLink, 100));
    updateActiveLink(); // Initial call
}

// ============================================
// 3. SCROLL REVEAL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section, .experience-item, .project-card, .skill-category, .cert-item, .education-item');
    
    if (!animatedElements.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for multiple items
                setTimeout(() => {
                    entry.target.classList.add('visible', 'animate-fadeInUp');
                }, index * 100);
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(element);
    });
}

// ============================================
// 4. TYPING EFFECT FOR HEADER
// ============================================
function initTypingEffect() {
    const typingElement = document.querySelector('.header-title');
    
    if (!typingElement) return;
    
    const roles = [
        'Data Analyst',
        'Banking Analytics Professional',
        'Power BI Developer',
        'Business Intelligence Analyst',
        'Financial Data Analyst'
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    const originalText = typingElement.textContent;
    
    // Create typing cursor
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '|';
    cursor.style.cssText = `
        animation: blink 1s infinite;
        margin-left: 2px;
        font-weight: 300;
    `;
    
    // Add cursor blink animation
    if (!document.querySelector('#typing-styles')) {
        const style = document.createElement('style');
        style.id = 'typing-styles';
        style.textContent = `
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    function type() {
        const currentRole = roles[roleIndex];
        
        if (isPaused) {
            setTimeout(type, 1500);
            isPaused = false;
            isDeleting = true;
            return;
        }
        
        if (isDeleting) {
            // Deleting
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        } else {
            // Typing
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentRole.length) {
                isPaused = true;
            }
        }
        
        // Append cursor
        typingElement.appendChild(cursor);
        
        // Speed control
        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(type, typingSpeed);
    }
    
    // Start typing after a delay
    setTimeout(() => {
        typingElement.textContent = '';
        type();
    }, 2000);
}

// ============================================
// 5. DOWNLOAD / PRINT BUTTON
// ============================================
function initDownloadButton() {
    const downloadBtn = document.querySelector('.download-btn');
    
    if (!downloadBtn) return;
    
    downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Show loading state
        const originalContent = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
        this.disabled = true;
        
        // Prepare for printing
        document.body.classList.add('printing');
        
        setTimeout(() => {
            window.print();
            
            // Reset button
            this.innerHTML = originalContent;
            this.disabled = false;
            document.body.classList.remove('printing');
        }, 500);
    });
    
    // Handle after print
    window.addEventListener('afterprint', function() {
        document.body.classList.remove('printing');
    });
}

// ============================================
// 6. BACK TO TOP BUTTON
// ============================================
function initBackToTop() {
    // Create button if it doesn't exist
    let backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 24px;
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 98;
        `;
        document.body.appendChild(backToTopBtn);
    }
    
    // Show/hide based on scroll position
    function toggleBackToTop() {
        if (window.scrollY > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
            backToTopBtn.style.transform = 'translateY(0)';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
            backToTopBtn.style.transform = 'translateY(20px)';
        }
    }
    
    window.addEventListener('scroll', toggleBackToTop);
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
    });
    
    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
}

// ============================================
// 7. SKILLS ANIMATION
// ============================================
function initSkillsAnimation() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    if (!skillTags.length) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillTags.forEach(tag => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(10px) scale(0.9)';
        tag.style.transition = 'all 0.3s ease';
        observer.observe(tag);
    });
}

// ============================================
// 8. COUNTER ANIMATION (For Statistics)
// ============================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter, [data-count]');
    
    if (!counters.length) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count') || element.textContent);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
                // Add suffix if exists
                const suffix = element.getAttribute('data-suffix') || '';
                element.textContent = target + suffix;
            }
        };
        
        updateCounter();
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// ============================================
// 9. MOBILE MENU TOGGLE
// ============================================
function initMobileMenu() {
    const nav = document.querySelector('.nav');
    const navContent = document.querySelector('.nav-content');
    
    if (!nav || !navContent) return;
    
    // Create mobile menu button if it doesn't exist
    let menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!menuBtn && window.innerWidth <= 768) {
        menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.setAttribute('aria-label', 'Toggle menu');
        menuBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 1.25rem;
            color: var(--text-primary);
            cursor: pointer;
            padding: 12px;
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
        `;
        nav.style.position = 'relative';
        nav.appendChild(menuBtn);
    }
    
    // Show/hide menu button based on screen size
    function handleResize() {
        if (window.innerWidth <= 768) {
            if (menuBtn) menuBtn.style.display = 'block';
            navContent.style.display = 'none';
        } else {
            if (menuBtn) menuBtn.style.display = 'none';
            navContent.style.display = 'flex';
        }
    }
    
    // Toggle menu
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            const isOpen = navContent.style.display === 'flex';
            
            if (isOpen) {
                navContent.style.display = 'none';
                this.innerHTML = '<i class="fas fa-bars"></i>';
            } else {
                navContent.style.display = 'flex';
                navContent.style.flexDirection = 'column';
                navContent.style.position = 'absolute';
                navContent.style.top = '100%';
                navContent.style.left = '0';
                navContent.style.right = '0';
                navContent.style.background = 'white';
                navContent.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                navContent.style.padding = '16px';
                this.innerHTML = '<i class="fas fa-times"></i>';
            }
        });
    }
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && menuBtn) {
                navContent.style.display = 'none';
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
}

// ============================================
// 10. COPY EMAIL TO CLIPBOARD
// ============================================
function initCopyEmail() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default - allow email client to open
            // But also copy to clipboard
            const email = this.href.replace('mailto:', '');
            
            navigator.clipboard.writeText(email).then(() => {
                showToast('Email copied to clipboard!', 'success');
            }).catch(err => {
                console.log('Could not copy email:', err);
            });
        });
        
        // Add tooltip
        link.setAttribute('title', 'Click to email / Right-click to copy');
    });
}

// Toast notification helper
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    toast.style.cssText = `
        position: fixed;
        bottom: 150px;
        right: 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
    `;
    
    // Add animation styles
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => toast.remove(), 3000);
}

// ============================================
// 11. PROJECT FILTER (Optional)
// ============================================
function initProjectFilter() {
    const filterContainer = document.querySelector('.project-filters');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!filterContainer || !projectCards.length) return;
    
    const filterButtons = filterContainer.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category')?.split(',') || [];
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ============================================
// 12. DARK MODE TOGGLE
// ============================================
function initDarkMode() {
    // Create toggle button
    let darkModeBtn = document.querySelector('.dark-mode-toggle');
    
    if (!darkModeBtn) {
        darkModeBtn = document.createElement('button');
        darkModeBtn.className = 'dark-mode-toggle';
        darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        darkModeBtn.setAttribute('aria-label', 'Toggle dark mode');
        darkModeBtn.style.cssText = `
            position: fixed;
            bottom: 150px;
            right: 24px;
            width: 44px;
            height: 44px;
            background: var(--bg-primary, white);
            color: var(--text-primary, #1e293b);
            border: 1px solid var(--border, #e2e8f0);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            z-index: 98;
        `;
        document.body.appendChild(darkModeBtn);
    }
    
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Add dark mode styles
    if (!document.querySelector('#dark-mode-styles')) {
        const style = document.createElement('style');
        style.id = 'dark-mode-styles';
        style.textContent = `
            body.dark-mode {
                --text-primary: #e2e8f0;
                --text-secondary: #94a3b8;
                --text-light: #64748b;
                --bg-primary: #1e293b;
                --bg-secondary: #0f172a;
                --bg-tertiary: #334155;
                --border: #475569;
            }
            
            body.dark-mode .header {
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1d4ed8 100%);
            }
            
            body.dark-mode .nav {
                background: #1e293b;
                border-color: #475569;
            }
            
            body.dark-mode .section {
                background: #1e293b;
                border-color: #475569;
            }
            
            body.dark-mode .skill-category,
            body.dark-mode .project-card,
            body.dark-mode .cert-item,
            body.dark-mode .education-item,
            body.dark-mode .language-item {
                background: #0f172a;
                border-color: #475569;
            }
            
            body.dark-mode .skill-tag,
            body.dark-mode .tool-tag {
                background: #334155;
                border-color: #475569;
                color: #e2e8f0;
            }
            
            body.dark-mode .dark-mode-toggle {
                background: #334155;
                color: #e2e8f0;
                border-color: #475569;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Toggle dark mode
    darkModeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled', 'info');
    });
    
    // Hover effect
    darkModeBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    darkModeBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// ============================================
// 13. LOADING SCREEN
// ============================================
function initLoadingScreen() {
    // Create loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>Loading CV...</p>
        </div>
    `;
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1d4ed8 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease, visibility 0.5s ease;
    `;
    
    // Add loading spinner styles
    if (!document.querySelector('#loading-styles')) {
        const style = document.createElement('style');
        style.id = 'loading-styles';
        style.textContent = `
            .loading-content {
                text-align: center;
                color: white;
            }
            
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(255,255,255,0.3);
                border-top-color: #06b6d4;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
            }
            
            .loading-content p {
                font-size: 1rem;
                opacity: 0.8;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loadingScreen);
    
    // Hide loading screen after page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
            
            setTimeout(() => loadingScreen.remove(), 500);
        }, 500);
    });
}

// ============================================
// 14. PARALLAX EFFECT FOR HEADER
// ============================================
function initParallaxEffect() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    function handleParallax() {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.3;
        
        if (scrolled < header.offsetHeight) {
            header.style.backgroundPositionY = `${rate}px`;
        }
    }
    
    window.addEventListener('scroll', handleParallax);
}

// ============================================
// 15. TOOLTIPS
// ============================================
function initTooltips() {
    const elementsWithTitle = document.querySelectorAll('[data-tooltip]');
    
    elementsWithTitle.forEach(element => {
        const tooltipText = element.getAttribute('data-tooltip');
        
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: #1e293b;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 0.75rem;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            z-index: 100;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(tooltip);
        
        element.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
            tooltip.style.bottom = 'calc(100% + 8px)';
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
            tooltip.style.bottom = '100%';
        });
    });
}

// ============================================
// 16. EXPERIENCE TIMELINE ANIMATION
// ============================================
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.experience-item');
    
    if (!timelineItems.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                    
                    // Animate the timeline line
                    const line = entry.target.querySelector('::before');
                    entry.target.style.setProperty('--line-height', '100%');
                }, index * 200);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// ============================================
// 17. CONTACT FORM VALIDATION (If Added)
// ============================================
function initContactForm() {
    const contactForm = document.querySelector('#contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const errors = [];
        
        // Get form fields
        const name = this.querySelector('[name="name"]');
        const email = this.querySelector('[name="email"]');
        const message = this.querySelector('[name="message"]');
        
        // Validate name
        if (name && name.value.trim().length < 2) {
            isValid = false;
            errors.push('Name must be at least 2 characters');
            name.classList.add('error');
        } else if (name) {
            name.classList.remove('error');
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email.value)) {
            isValid = false;
            errors.push('Please enter a valid email address');
            email.classList.add('error');
        } else if (email) {
            email.classList.remove('error');
        }
        
        // Validate message
        if (message && message.value.trim().length < 10) {
            isValid = false;
            errors.push('Message must be at least 10 characters');
            message.classList.add('error');
        } else if (message) {
            message.classList.remove('error');
        }
        
        if (isValid) {
            // Show success message
            showToast('Message sent successfully!', 'success');
            this.reset();
        } else {
            // Show errors
            showToast(errors[0], 'error');
        }
    });
}

// ============================================
// 18. KEYBOARD NAVIGATION
// ============================================
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Press 'T' to toggle dark mode
        if (e.key === 't' || e.key === 'T') {
            if (!e.target.matches('input, textarea')) {
                const darkModeBtn = document.querySelector('.dark-mode-toggle');
                if (darkModeBtn) darkModeBtn.click();
            }
        }
        
        // Press 'Home' to go to top
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Press 'End' to go to bottom
        if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
        
        // Press 'P' to print/download
        if ((e.key === 'p' || e.key === 'P') && (e.ctrlKey || e.metaKey)) {
            // Let browser handle print
        }
        
        // Escape to close mobile menu
        if (e.key === 'Escape') {
            const navContent = document.querySelector('.nav-content');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            if (navContent && menuBtn && window.innerWidth <= 768) {
                navContent.style.display = 'none';
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
}

// ============================================
// 19. PRINT OPTIMIZATION
// ============================================
function initPrintOptimization() {
    window.addEventListener('beforeprint', function() {
        // Expand all sections
        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'none';
        });
        
        // Remove animations
        document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', function() {
        document.body.classList.remove('printing');
    });
}

// ============================================
// 20. ANALYTICS TRACKING (Optional)
// ============================================
function initAnalytics() {
    // Track page views
    function trackPageView(page) {
        console.log(`📊 Page View: ${page}`);
        // Add your analytics code here (Google Analytics, etc.)
    }
    
    // Track clicks on important elements
    function trackClick(element, action) {
        console.log(`📊 Click: ${action}`);
        // Add your analytics code here
    }
    
    // Track download clicks
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            trackClick(downloadBtn, 'CV Download');
        });
    }
    
    // Track social link clicks
    document.querySelectorAll('.contact-item, .footer-link').forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.querySelector('i')?.className || 'unknown';
            trackClick(this, `Social: ${platform}`);
        });
    });
    
    // Track section visibility
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackPageView(`Section: ${entry.target.id}`);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.section[id]').forEach(section => {
        sectionObserver.observe(section);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get scroll percentage
function getScrollPercentage() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return (scrollTop / docHeight) * 100;
}

// ============================================
// SCROLL PROGRESS BAR (Bonus Feature)
// ============================================
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #2563eb, #06b6d4);
        width: 0%;
        z-index: 1000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const percentage = getScrollPercentage();
        progressBar.style.width = `${percentage}%`;
    });
}

// Initialize scroll progress
initScrollProgress();

// ============================================
// EASTER EGG (Fun Addition!)
// ============================================
function initEasterEgg() {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                showToast('🎮 Konami Code Activated! You found the easter egg!', 'success');
                
                // Fun animation
                document.body.style.animation = 'rainbow 2s ease';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 2000);
                
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    // Add rainbow animation
    if (!document.querySelector('#easter-egg-styles')) {
        const style = document.createElement('style');
        style.id = 'easter-egg-styles';
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                50% { filter: hue-rotate(180deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

initEasterEgg();

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log(`
%c╔════════════════════════════════════════════╗
%c║                                            ║
%c║   👋 Hello, fellow developer!              ║
%c║                                            ║
%c║   Thanks for checking out my CV website!  ║
%c║                                            ║
%c║   🔧 Built with: HTML, CSS, JavaScript    ║
%c║   📊 Role: Data Analyst                   ║
%c║   📍 Location: Nepal                      ║
%c║                                            ║
%c║   Let's connect! 🤝                       ║
%c║                                            ║
%c╚════════════════════════════════════════════╝
`, 
'color: #2563eb; font-weight: bold;',
'color: #2563eb;',
'color: #06b6d4; font-weight: bold;',
'color: #2563eb;',
'color: #64748b;',
'color: #2563eb;',
'color: #10b981;',
'color: #10b981;',
'color: #10b981;',
'color: #2563eb;',
'color: #f59e0b; font-weight: bold;',
'color: #2563eb;',
'color: #2563eb; font-weight: bold;'
);
