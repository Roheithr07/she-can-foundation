/* ==========================================================================
   SHE CAN FOUNDATION - CORE INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbarScroll();
    initMobileNav();
    initScrollReveal();
    initStatsCountUp();
    initFaqAccordion();
    initTestimonialSlider();
    initVolunteerForm();
    initApplicantsDb();
    initActiveNavObserver();
});

/* ==========================================================================
   1. THEME MANAGER (LIGHT / DARK THEME)
   ========================================================================== */
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // Toggle click listener
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Minor micro-animation on click
        themeToggle.style.transform = 'scale(0.85)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 150);
    });
}

/* ==========================================================================
   2. NAVBAR SCROLL EFFECT
   ========================================================================== */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const handleScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initially in case of refreshed state
}

/* ==========================================================================
   3. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    if (!hamburgerBtn || !mobileNav) return;

    hamburgerBtn.addEventListener('click', () => {
        toggleMobileMenu();
    });
}

function toggleMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    if (!hamburgerBtn || !mobileNav) return;

    hamburgerBtn.classList.toggle('open');
    mobileNav.classList.toggle('open');
    
    // Prevent background scrolling when menu is open
    if (mobileNav.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

/* ==========================================================================
   4. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add minor stagger effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index % 3 * 60);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   5. IMPACT STATS COUNT-UP
   ========================================================================== */
function initStatsCountUp() {
    const statsSection = document.getElementById('statsSection');
    if (!statsSection) return;

    const countUp = (element, target) => {
        let current = 0;
        const duration = 1500; // 1.5 seconds animation
        const steps = 50;
        const stepValue = target / steps;
        const intervalTime = duration / steps;
        
        const counterInterval = setInterval(() => {
            current += stepValue;
            if (current >= target) {
                element.textContent = target.toLocaleString() + '+';
                clearInterval(counterInterval);
            } else {
                element.textContent = Math.ceil(current).toLocaleString() + '+';
            }
        }, intervalTime);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numbers = entry.target.querySelectorAll('.stat-number');
                numbers.forEach(numEl => {
                    const target = parseInt(numEl.getAttribute('data-target'), 10);
                    if (!isNaN(target)) countUp(numEl, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    statsObserver.observe(statsSection);
}

/* ==========================================================================
   6. FAQ ACCORDIONS
   ========================================================================== */
function initFaqAccordion() {
    // FAQ accordion states are managed through CSS max-height transitions.
    // The heights are calculated dynamically to support various text lengths.
}

function toggleFaq(itemId) {
    const selectedItem = document.getElementById(itemId);
    if (!selectedItem) return;

    const answer = selectedItem.querySelector('.faq-answer');
    const button = selectedItem.querySelector('.faq-question-btn');
    const isAlreadyActive = selectedItem.classList.contains('active');

    // Close any other open FAQ items first for cleaner UX
    const activeItems = document.querySelectorAll('.faq-item.active');
    activeItems.forEach(item => {
        if (item.id !== itemId) {
            item.classList.remove('active');
            item.querySelector('.faq-answer').style.maxHeight = '0';
            item.querySelector('.faq-question-btn').setAttribute('aria-expanded', 'false');
        }
    });

    if (isAlreadyActive) {
        selectedItem.classList.remove('active');
        answer.style.maxHeight = '0';
        button.setAttribute('aria-expanded', 'false');
    } else {
        selectedItem.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        button.setAttribute('aria-expanded', 'true');
    }
}

/* ==========================================================================
   7. TESTIMONIAL SLIDER
   ========================================================================== */
let currentSlideIndex = 0;
let carouselTimer = null;

function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.getElementById('carouselPrevBtn');
    const nextBtn = document.getElementById('carouselNextBtn');
    
    if (slides.length === 0) return;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlideIndex = (index + slides.length) % slides.length;
        
        slides[currentSlideIndex].classList.add('active');
        if (dots[currentSlideIndex]) {
            dots[currentSlideIndex].classList.add('active');
        }
    };

    const nextSlide = () => showSlide(currentSlideIndex + 1);
    const prevSlide = () => showSlide(currentSlideIndex - 1);

    // Auto-scroll handler
    const startAutoScroll = () => {
        stopAutoScroll();
        carouselTimer = setInterval(nextSlide, 7000); // Shift every 7 seconds
    };

    const stopAutoScroll = () => {
        if (carouselTimer) clearInterval(carouselTimer);
    };

    // Button Listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoScroll();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoScroll();
        });
    }

    // Expose dot click navigate function globally
    window.gotoSlide = (index) => {
        showSlide(index);
        startAutoScroll();
    };

    // Pause on hover
    const carousel = document.getElementById('carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoScroll);
        carousel.addEventListener('mouseleave', startAutoScroll);
    }

    startAutoScroll();
}

/* ==========================================================================
   8. ACTIVE NAVIGATION LINK INDICATOR (SCROLL OVERLAY)
   ========================================================================== */
function initActiveNavObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (sections.length === 0 || navLinks.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger activation mid-screen
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   9. VOLUNTEER FORM INTERACTIVE SUBMISSION
   ========================================================================== */
function initVolunteerForm() {
    // Form views are toggled by switching element visibility classes.
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('fname');
    const emailInput = document.getElementById('femail');
    const cityInput = document.getElementById('fcity');
    const roleInput = document.getElementById('frole');
    const msgInput = document.getElementById('fmessage');

    if (!nameInput || !emailInput || !cityInput || !roleInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const city = cityInput.value.trim();
    const role = roleInput.value;
    const msg = msgInput ? msgInput.value.trim() : '';

    if (!name || !email || !city || !role) {
        alert('Please fill out all required fields.');
        return;
    }

    // Capture applicant entry
    const newApplicant = {
        id: Date.now(),
        name,
        email,
        city,
        role,
        message: msg,
        date: new Date().toLocaleDateString()
    };

    // Save to localStorage DB
    saveApplicant(newApplicant);

    // Toggle form view to success card state
    const formBox = document.getElementById('volunteerFormBox');
    const successBox = document.getElementById('formSuccessBox');
    
    if (formBox && successBox) {
        formBox.style.display = 'none';
        successBox.classList.add('active');
    }
}

function resetFormState() {
    const formBox = document.getElementById('volunteerFormBox');
    const successBox = document.getElementById('formSuccessBox');
    const form = document.getElementById('volunteerForm');
    
    if (form) form.reset();
    
    if (formBox && successBox) {
        successBox.classList.remove('active');
        formBox.style.display = 'block';
    }
}

/* ==========================================================================
   10. APPLICANTS SIMULATED LOCALSTORAGE DATABASE
   ========================================================================== */
const DEFAULT_APPLICANTS = [
    { id: 1, name: "Riya Sharma", email: "riya.sharma@example.com", city: "Chennai, India", role: "Online Mentor", date: "2026-06-01" },
    { id: 2, name: "Sarah Connor", email: "sarah.c@example.com", city: "Austin, USA", role: "Digital Instructor", date: "2026-06-03" },
    { id: 3, name: "Kunal Kapoor", email: "kunal.k@example.com", city: "Mumbai, India", role: "On-Ground Support", date: "2026-06-04" }
];

function initApplicantsDb() {
    const saved = localStorage.getItem('she_can_applicants');
    if (!saved) {
        localStorage.setItem('she_can_applicants', JSON.stringify(DEFAULT_APPLICANTS));
    }
    renderApplicantsTable();
}

function getApplicants() {
    try {
        return JSON.parse(localStorage.getItem('she_can_applicants')) || [];
    } catch (e) {
        return [];
    }
}

function saveApplicant(applicant) {
    const list = getApplicants();
    list.unshift(applicant); // Add new entry at top
    localStorage.setItem('she_can_applicants', JSON.stringify(list));
    renderApplicantsTable();
}

function deleteApplicant(id) {
    const list = getApplicants();
    const updated = list.filter(item => item.id !== id);
    localStorage.setItem('she_can_applicants', JSON.stringify(updated));
    renderApplicantsTable();
}

function clearApplicants() {
    if (confirm("Are you sure you want to clear all applicants?")) {
        localStorage.setItem('she_can_applicants', JSON.stringify([]));
        renderApplicantsTable();
    }
}

function renderApplicantsTable() {
    const listEl = document.getElementById('applicantsList');
    if (!listEl) return;

    const list = getApplicants();
    listEl.innerHTML = '';

    if (list.length === 0) {
        listEl.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No applications found. Fill out the volunteer form above to add your application!</td></tr>`;
        return;
    }

    list.forEach(applicant => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight: 700; color: var(--text-main);">${escapeHtml(applicant.name)}</td>
            <td>${escapeHtml(applicant.email)}</td>
            <td>${escapeHtml(applicant.city)}</td>
            <td><span style="background-color: var(--rose-light); color: var(--rose); font-weight:700; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem;">${escapeHtml(applicant.role)}</span></td>
            <td>
                <button class="delete-btn" onclick="deleteApplicant(${applicant.id})">Delete</button>
            </td>
        `;
        listEl.appendChild(row);
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Modal Toggle Handlers
function openAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderApplicantsTable(); // Refresh table contents
    }
}

function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.classList.remove('active');
        // Restore overlay scrolling if mobile menu drawer is not open
        const mobileNav = document.getElementById('mobileNav');
        if (!mobileNav || !mobileNav.classList.contains('open')) {
            document.body.style.overflow = '';
        }
    }
}

// Make globally accessible since we use inline HTML onclick attributes
window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;
window.deleteApplicant = deleteApplicant;
window.clearApplicants = clearApplicants;
window.handleFormSubmit = handleFormSubmit;
window.resetFormState = resetFormState;
window.toggleFaq = toggleFaq;
