/**
 * ============================================
 * DIGITAL FORGE - Main JavaScript
 * Futuristic Portfolio Experience
 * ============================================
 */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  Preloader.init();
  SmoothScroll.init();
  CustomCursor.init();
  Particles.init();
  ScrollAnimations.init();
  Navigation.init();
  ProjectFilters.init();
  PageTransitions.init();
  MagneticButtons.init();
});

// ============================================
// PRELOADER
// ============================================

const Preloader = {
  progress: 0,
  preloader: null,
  progressBar: null,

  init() {
    this.preloader = document.querySelector('.preloader');
    this.progressBar = document.querySelector('.preloader-progress');

    if (!this.preloader) return;

    // Simulate loading progress
    this.simulateLoading();

    // Wait for all resources
    window.addEventListener('load', () => {
      this.complete();
    });
  },

  simulateLoading() {
    const interval = setInterval(() => {
      this.progress += Math.random() * 15;

      if (this.progress >= 90) {
        clearInterval(interval);
        this.progress = 90;
      }

      this.updateProgress();
    }, 100);
  },

  updateProgress() {
    if (this.progressBar) {
      this.progressBar.style.width = `${this.progress}%`;
    }
  },

  complete() {
    this.progress = 100;
    this.updateProgress();

    setTimeout(() => {
      this.preloader.classList.add('loaded');

      // Enable scroll after preloader
      document.body.style.overflow = '';

      // Trigger entrance animations
      setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => {
          el.classList.add('visible');
        });
        document.querySelectorAll('.stagger').forEach(el => {
          el.classList.add('visible');
        });
      }, 300);
    }, 500);
  }
};

// ============================================
// SMOOTH SCROLL (Lenis)
// ============================================

const SmoothScroll = {
  lenis: null,

  init() {
    // Check if Lenis is available
    if (typeof Lenis === 'undefined') {
      console.warn('Lenis not loaded');
      return;
    }

    // Initialize Lenis
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Integrate with GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      this.lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        this.lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      // Fallback animation frame
      const raf = (time) => {
        this.lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          this.lenis.scrollTo(target, {
            offset: -80,
            duration: 1.5,
          });
        }
      });
    });
  },

  stop() {
    if (this.lenis) this.lenis.stop();
  },

  start() {
    if (this.lenis) this.lenis.start();
  }
};

// ============================================
// CUSTOM CURSOR
// ============================================

const CustomCursor = {
  cursor: null,
  cursorDot: null,
  cursorOutline: null,
  mouseX: -100,
  mouseY: -100,
  outlineX: -100,
  outlineY: -100,
  dotX: -100,
  dotY: -100,
  isVisible: false,

  init() {
    // Check if touch device
    if ('ontouchstart' in window) return;

    this.cursor = document.querySelector('.cursor');
    this.cursorDot = document.querySelector('.cursor-dot');
    this.cursorOutline = document.querySelector('.cursor-outline');

    if (!this.cursor || !this.cursorDot || !this.cursorOutline) return;

    // Hide cursor initially until mouse moves
    this.cursor.style.opacity = '0';

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      // Show cursor on first mouse move
      if (!this.isVisible) {
        this.isVisible = true;
        this.cursor.style.opacity = '1';
        // Instantly position on first move
        this.dotX = e.clientX;
        this.dotY = e.clientY;
        this.outlineX = e.clientX;
        this.outlineY = e.clientY;
      }
    });

    // Add hover effect to interactive elements
    const hoverElements = document.querySelectorAll('a, button, [data-hover], input, textarea, .project-card');

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor.classList.add('hover');
      });

      el.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('hover');
      });
    });

    // Click effect
    document.addEventListener('mousedown', () => {
      this.cursor.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
      this.cursor.classList.remove('click');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      this.cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      this.cursor.style.opacity = '1';
    });

    // Start animation loop
    this.animate();
  },

  animate() {
    // Smooth follow for outline
    const ease = 0.15;

    this.outlineX += (this.mouseX - this.outlineX) * ease;
    this.outlineY += (this.mouseY - this.outlineY) * ease;

    // Faster follow for dot
    this.dotX += (this.mouseX - this.dotX) * 0.5;
    this.dotY += (this.mouseY - this.dotY) * 0.5;

    if (this.cursorDot) {
      this.cursorDot.style.left = `${this.dotX}px`;
      this.cursorDot.style.top = `${this.dotY}px`;
    }

    if (this.cursorOutline) {
      this.cursorOutline.style.left = `${this.outlineX}px`;
      this.cursorOutline.style.top = `${this.outlineY}px`;
    }

    requestAnimationFrame(() => this.animate());
  }
};

// ============================================
// PARTICLE SYSTEM
// ============================================

const Particles = {
  container: null,
  particleCount: 30,

  init() {
    this.container = document.getElementById('particles');
    if (!this.container) return;

    // Create particles
    for (let i = 0; i < this.particleCount; i++) {
      this.createParticle();
    }
  },

  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random position
    particle.style.left = `${Math.random() * 100}%`;

    // Random animation delay
    particle.style.animationDelay = `${Math.random() * 8}s`;

    // Random size variation
    const size = 1 + Math.random() * 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Random opacity
    particle.style.opacity = 0.3 + Math.random() * 0.7;

    this.container.appendChild(particle);
  }
};

// ============================================
// SCROLL ANIMATIONS (GSAP)
// ============================================

const ScrollAnimations = {
  init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Fallback: use Intersection Observer
      this.initFallback();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Reveal animations
    this.initRevealAnimations();

    // Stagger animations
    this.initStaggerAnimations();

    // Parallax effects
    this.initParallax();

    // Header hide/show on scroll
    this.initHeaderScroll();
  },

  initRevealAnimations() {
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.fromTo(el,
        {
          opacity: 0,
          y: 50
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  },

  initStaggerAnimations() {
    gsap.utils.toArray('.stagger').forEach(container => {
      const children = container.children;

      gsap.fromTo(children,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  },

  initParallax() {
    gsap.utils.toArray('.project-card-image img').forEach(img => {
      gsap.to(img, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.project-card'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  },

  initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;

    ScrollTrigger.create({
      start: 'top top',
      end: 99999,
      onUpdate: (self) => {
        const scroll = self.scroll();
        const direction = scroll > lastScroll ? 'down' : 'up';

        if (scroll > 100) {
          if (direction === 'down' && !header.classList.contains('hidden')) {
            header.classList.add('hidden');
          } else if (direction === 'up' && header.classList.contains('hidden')) {
            header.classList.remove('hidden');
          }
        } else {
          header.classList.remove('hidden');
        }

        lastScroll = scroll;
      }
    });
  },

  // Fallback for when GSAP is not available
  initFallback() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal, .stagger').forEach(el => {
      observer.observe(el);
    });
  }
};

// ============================================
// NAVIGATION
// ============================================

const Navigation = {
  nav: null,
  menuToggle: null,
  isOpen: false,

  init() {
    this.nav = document.getElementById('nav');
    this.menuToggle = document.getElementById('menuToggle');

    if (!this.menuToggle) return;

    this.menuToggle.addEventListener('click', () => {
      this.toggle();
    });

    // Close menu when clicking on a link
    if (this.nav) {
      this.nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          if (this.isOpen) {
            this.close();
          }
        });
      });
    }

    // Close menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  },

  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  open() {
    this.isOpen = true;
    this.nav.classList.add('active');
    this.menuToggle.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (SmoothScroll.lenis) {
      SmoothScroll.stop();
    }
  },

  close() {
    this.isOpen = false;
    this.nav.classList.remove('active');
    this.menuToggle.classList.remove('active');
    document.body.style.overflow = '';

    if (SmoothScroll.lenis) {
      SmoothScroll.start();
    }
  }
};

// ============================================
// PROJECT FILTERS
// ============================================

const ProjectFilters = {
  filterButtons: null,
  projectCards: null,

  init() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.projectCards = document.querySelectorAll('.project-card[data-category]');

    if (!this.filterButtons.length || !this.projectCards.length) return;

    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filter(btn);
      });
    });
  },

  filter(clickedBtn) {
    const filter = clickedBtn.dataset.filter;

    // Update active button
    this.filterButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    clickedBtn.classList.add('active');

    // Filter cards with animation
    this.projectCards.forEach((card, index) => {
      const category = card.dataset.category;
      const shouldShow = filter === 'all' || category === filter;

      // Add stagger delay
      const delay = index * 0.05;

      if (shouldShow) {
        card.style.transitionDelay = `${delay}s`;
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
        card.style.pointerEvents = 'auto';
      } else {
        card.style.transitionDelay = '0s';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
        card.style.pointerEvents = 'none';
      }
    });

    // Update ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    }
  }
};

// ============================================
// PAGE TRANSITIONS
// ============================================

const PageTransitions = {
  transition: null,
  links: null,

  init() {
    this.transition = document.querySelector('.page-transition');
    this.links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="mailto"])');

    if (!this.transition || !this.links.length) return;

    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Only transition for internal links
        if (href && !href.startsWith('http') && !href.startsWith('//')) {
          e.preventDefault();
          this.navigateTo(href);
        }
      });
    });

    // Play exit animation on page load
    window.addEventListener('pageshow', () => {
      this.transition.classList.remove('active');
      this.transition.classList.add('exit');

      setTimeout(() => {
        this.transition.classList.remove('exit');
      }, 600);
    });
  },

  navigateTo(url) {
    // Stop smooth scroll
    if (SmoothScroll.lenis) {
      SmoothScroll.stop();
    }

    // Play entrance animation
    this.transition.classList.add('active');

    // Navigate after animation
    setTimeout(() => {
      window.location.href = url;
    }, 600);
  }
};

// ============================================
// MAGNETIC BUTTONS
// ============================================

const MagneticButtons = {
  init() {
    // Check if touch device
    if ('ontouchstart' in window) return;

    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }
};

// ============================================
// GLITCH TEXT EFFECT
// ============================================

const GlitchText = {
  init() {
    const glitchElements = document.querySelectorAll('.glitch');

    glitchElements.forEach(el => {
      el.setAttribute('data-text', el.textContent);
    });
  }
};

// Initialize glitch text
document.addEventListener('DOMContentLoaded', () => {
  GlitchText.init();
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function
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

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Linear interpolation
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

// Clamp value between min and max
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Map value from one range to another
function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// ============================================
// RESIZE HANDLER
// ============================================

window.addEventListener('resize', debounce(() => {
  // Refresh ScrollTrigger on resize
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
}, 250));

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log(
  '%c Ivo\'s Portfolio ',
  'background: linear-gradient(135deg, #a855f7, #7c3aed); color: white; font-size: 24px; padding: 10px 20px; border-radius: 8px; font-family: "Space Grotesk", sans-serif;'
);
console.log(
  '%c Software Developer // Netherlands ',
  'color: #a855f7; font-size: 14px; font-family: "JetBrains Mono", monospace;'
);
