/* ==========================================
   Kültür ve Kitap Topluluğu — SDÜ
   JavaScript: Navigation, Animations, Counters
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // === DARK THEME TOGGLE ===
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);

        // Animate the button
        themeToggle.style.transform = 'rotate(360deg) scale(1.1)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 400);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background on scroll
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // === BACK TO TOP ===
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === MOBILE NAVIGATION ===
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // === ACTIVE NAV LINK ON SCROLL ===
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

    function setActiveLink() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveLink, { passive: true });

    // === ANIMATED COUNTER ===
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');

        counters.forEach(counter => {
            if (counter.dataset.animated) return;

            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                    counter.dataset.animated = 'true';
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // === SCROLL REVEAL ANIMATIONS ===
    function addScrollAnimations() {
        // Add fade-in class to elements
        const animatedElements = document.querySelectorAll(
            '.about-card, .team-card, .event-card, .gallery-item, .contact-card, .book-showcase, .past-book-card, .faq-item, .join-wrapper'
        );

        animatedElements.forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${index % 4 * 0.1}s`;
        });
    }

    addScrollAnimations();

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate counters when hero stats come into view
                if (entry.target.closest('.hero-stats') || entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Observe hero stats for counter animation
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }

    // === SMOOTH SCROLL FOR ANCHOR LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // === GALLERY LIGHTBOX (simple) ===
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // If item has a real image, show lightbox
            const img = item.querySelector('img');
            if (img) {
                showLightbox(img.src, img.alt);
            }
        });
    });

    function showLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.style.cssText = `
            position: fixed; inset: 0; z-index: 10000;
            background: rgba(0,0,0,0.9); display: flex;
            align-items: center; justify-content: center;
            cursor: pointer; animation: fadeIn 0.3s ease;
        `;
        lightbox.innerHTML = `
            <img src="${src}" alt="${alt}" style="max-width: 90%; max-height: 90%; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
            <button style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 2rem; cursor: pointer;">&times;</button>
        `;

        lightbox.addEventListener('click', () => lightbox.remove());
        document.body.appendChild(lightbox);
    }

    // === LITERARY QUOTES ROTATOR ===
    const quotes = [
        { text: "Kitapsız yaşamak; kör, sağır, dilsiz yaşamaktır.", author: "Mustafa Kemal Atatürk" },
        { text: "Bir kitap okudum ve bütün hayatım değişti.", author: "Orhan Pamuk" },
        { text: "Dünyayı güzellik kurtaracak, bir insanı sevmekle başlayacak her şey.", author: "Sait Faik Abasıyanık" },
        { text: "İnsan ancak anladığı şeyleri duyar.", author: "Ahmet Hamdi Tanpınar" },
        { text: "Kitaplar, soğuk ama güvenilir dostlardır.", author: "Victor Hugo" },
        { text: "Bizi ancak kitaplar ve samimi fikirler kurtarabilir.", author: "Sabahattin Ali" },
        { text: "İyi kitaplar okumak, geçmiş yüzyılların en iyi insanlarıyla sohbet etmektir.", author: "René Descartes" }
    ];

    let currentQuoteIndex = 0;
    const quoteTextEl = document.getElementById('quoteText');
    const quoteAuthorEl = document.getElementById('quoteAuthor');
    const nextQuoteBtn = document.getElementById('nextQuoteBtn');

    function showQuote(index) {
        if (!quoteTextEl || !quoteAuthorEl) return;
        quoteTextEl.style.opacity = '0';
        quoteAuthorEl.style.opacity = '0';
        setTimeout(() => {
            quoteTextEl.textContent = `"${quotes[index].text}"`;
            quoteAuthorEl.textContent = `— ${quotes[index].author}`;
            quoteTextEl.style.opacity = '1';
            quoteAuthorEl.style.opacity = '1';
        }, 250);
    }

    if (nextQuoteBtn) {
        nextQuoteBtn.addEventListener('click', () => {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            showQuote(currentQuoteIndex);
        });
    }

    // Auto rotate quotes every 12 seconds
    setInterval(() => {
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        showQuote(currentQuoteIndex);
    }, 12000);

    // === EVENT FILTERS ===
    const filterBtns = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card[data-category]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            eventCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });

    // === FAQ ACCORDION ===
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answerEl = item.querySelector('.faq-answer');

        if (questionBtn && answerEl) {
            questionBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Close other accordion items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) otherAnswer.style.maxHeight = null;
                    }
                });

                if (isOpen) {
                    item.classList.remove('active');
                    answerEl.style.maxHeight = null;
                } else {
                    item.classList.add('active');
                    answerEl.style.maxHeight = answerEl.scrollHeight + 'px';
                }
            });
        }
    });

    // === JOIN FORM SUBMISSION ===
    const joinForm = document.getElementById('joinForm');
    const formSuccessMessage = document.getElementById('formSuccessMessage');
    const waRedirectBtn = document.getElementById('waRedirectBtn');

    if (joinForm) {
        joinForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value.trim();
            const department = document.getElementById('facultyDepartment').value.trim();
            const grade = document.getElementById('studentGrade').value;
            const phone = document.getElementById('phoneNum').value.trim();
            const interest = document.getElementById('interest').value;

            // Generate WhatsApp message
            const message = `Merhaba! Ben ${fullName}. SDÜ ${department} (${grade}) öğrencisiyim. Kültür ve Kitap Topluluğu'na katılmak istiyorum.%0A%0Aİlgi Alanım: ${interest}%0ATelefon: ${phone}`;
            const waUrl = `https://wa.me/905XXXXXXXXX?text=${encodeURIComponent(message)}`;

            if (waRedirectBtn) {
                waRedirectBtn.href = waUrl;
            }

            // Hide form and show success message
            joinForm.style.display = 'none';
            if (formSuccessMessage) {
                formSuccessMessage.style.display = 'block';
                formSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Initial call
    handleScroll();
});
