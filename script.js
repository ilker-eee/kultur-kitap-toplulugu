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

        showToast(newTheme === 'dark' ? '🌙 Karanlık tema etkinleştirildi' : '☀️ Aydınlık tema etkinleştirildi', newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun');

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

        // Scroll Progress Bar
        const progressBar = document.getElementById('scrollProgressBar');
        if (progressBar) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
            progressBar.style.width = `${progress}%`;
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
            showToast('✨ Yeni bir edebiyat sözü yüklendi', 'fas fa-feather-alt');
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

            // Save applicant to local storage for Admin Panel
            try {
                const raw = localStorage.getItem('sdu_topluluk_data');
                const data = raw ? JSON.parse(raw) : { applications: [] };
                if (!data.applications) data.applications = [];
                data.applications.unshift({
                    id: Date.now(),
                    fullName,
                    department,
                    grade,
                    phone,
                    interest,
                    date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    status: 'Beklemede'
                });
                localStorage.setItem('sdu_topluluk_data', JSON.stringify(data));
            } catch (err) {
                console.warn('Başvuru kaydetme hatası:', err);
            }

            // Hide form and show success message
            joinForm.style.display = 'none';
            if (formSuccessMessage) {
                formSuccessMessage.style.display = 'block';
                formSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            showToast('🎉 Başvurunuz alındı! Aramıza hoş geldiniz.', 'fas fa-check-circle');
        });
    }

    // === SUGGEST AN EVENT FORM SUBMISSION ===
    const suggestEventForm = document.getElementById('suggestEventForm');
    if (suggestEventForm) {
        suggestEventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('suggName').value.trim();
            const department = document.getElementById('suggDept').value.trim();
            const title = document.getElementById('suggTitle').value.trim();
            const desc = document.getElementById('suggDesc').value.trim();

            try {
                const raw = localStorage.getItem('sdu_topluluk_data');
                const data = raw ? JSON.parse(raw) : { suggestions: [] };
                if (!data.suggestions) data.suggestions = [];
                data.suggestions.unshift({
                    id: Date.now(),
                    name,
                    department,
                    title,
                    desc,
                    date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
                    status: 'Değerlendiriliyor'
                });
                localStorage.setItem('sdu_topluluk_data', JSON.stringify(data));
            } catch (err) {
                console.warn('Öneri kaydetme hatası:', err);
            }

            suggestEventForm.reset();
            showToast('💡 Harika fikriniz için teşekkürler! Öneriniz yönetim kurulumuza iletildi.', 'fas fa-lightbulb');
        });
    }

    // === TOAST NOTIFICATION HELPER ===
    const toastContainer = document.getElementById('toastContainer');
    function showToast(message, icon = 'fas fa-info-circle') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 320);
        }, 3200);
    }

    // === 3D BOOK INTERACTIVE MOUSE TILT ===
    const bookShowcase = document.querySelector('.book-showcase');
    const book3d = document.querySelector('.book-3d');

    if (bookShowcase && book3d) {
        bookShowcase.addEventListener('mousemove', (e) => {
            const rect = bookShowcase.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate tilt angle (-14deg to +14deg)
            const rotateY = ((x - centerX) / centerX) * 15;
            const rotateX = -((y - centerY) / centerY) * 12;

            book3d.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.04)`;
        });

        bookShowcase.addEventListener('mouseleave', () => {
            book3d.style.transform = 'rotateY(-18deg) rotateX(6deg) scale(1)';
        });
    }

    // === ANIMATED READING PROGRESS BAR ===
    const readingBar = document.getElementById('readingProgressBar');
    const readingPercent = document.getElementById('readingProgressPercent');

    if (readingBar) {
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(readingBar.dataset.target || 75);
                    readingBar.style.width = `${target}%`;

                    // Counter animation for percentage
                    let current = 0;
                    const duration = 1200;
                    const stepTime = Math.max(Math.floor(duration / target), 10);

                    const interval = setInterval(() => {
                        current++;
                        if (readingPercent) readingPercent.textContent = `%${current}`;
                        if (current >= target) clearInterval(interval);
                    }, stepTime);

                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        progressObserver.observe(readingBar);
    }

    // === EVENT CALENDAR BUTTONS ===
    function bindEventCalButtons() {
        const calBtns = document.querySelectorAll('.event-cal-btn');
        calBtns.forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const title = btn.dataset.title || 'Etkinlik';
                const date = btn.dataset.date || '';
                showToast(`📅 "${title}" (${date}) hatırlatıcınız kaydedildi!`, 'fas fa-calendar-check');

                btn.style.transform = 'scale(1.25) rotate(15deg)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 300);
            };
        });
    }
    bindEventCalButtons();

    // ==========================================
    // ETKİNLİK TAKVİMİ BİLEŞENİ
    // ==========================================
    const btnViewCards = document.getElementById('btnViewCards');
    const btnViewCalendar = document.getElementById('btnViewCalendar');
    const eventsGrid = document.getElementById('eventsGrid');
    const eventsCalendarView = document.getElementById('eventsCalendarView');
    const eventFilters = document.getElementById('eventFilters');

    let currentCalMonth = 9; // 9 = Ekim 2026 (0-indexed)
    const currentCalYear = 2026;

    if (btnViewCards && btnViewCalendar) {
        btnViewCards.addEventListener('click', () => {
            btnViewCards.classList.add('active');
            btnViewCalendar.classList.remove('active');
            eventsGrid.style.display = 'grid';
            eventsCalendarView.style.display = 'none';
            if (eventFilters) eventFilters.style.display = 'flex';
        });

        btnViewCalendar.addEventListener('click', () => {
            btnViewCalendar.classList.add('active');
            btnViewCards.classList.remove('active');
            eventsGrid.style.display = 'none';
            eventsCalendarView.style.display = 'grid';
            if (eventFilters) eventFilters.style.display = 'none';
            renderCalendar(currentCalMonth, currentCalYear);
        });
    }

    const calMonthTitle = document.getElementById('calMonthTitle');
    const calPrevMonthBtn = document.getElementById('calPrevMonthBtn');
    const calNextMonthBtn = document.getElementById('calNextMonthBtn');
    const calendarDaysGrid = document.getElementById('calendarDaysGrid');
    const calPanelDateTitle = document.getElementById('calPanelDateTitle');
    const calPanelBody = document.getElementById('calPanelBody');

    const MONTH_NAMES_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

    if (calPrevMonthBtn && calNextMonthBtn) {
        calPrevMonthBtn.addEventListener('click', () => {
            if (currentCalMonth > 0) {
                currentCalMonth--;
                renderCalendar(currentCalMonth, currentCalYear);
            }
        });

        calNextMonthBtn.addEventListener('click', () => {
            if (currentCalMonth < 11) {
                currentCalMonth++;
                renderCalendar(currentCalMonth, currentCalYear);
            }
        });
    }

    function getAllEventsList() {
        try {
            const raw = localStorage.getItem('sdu_topluluk_data');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.events && parsed.events.length > 0) return parsed.events;
            }
        } catch (e) {}

        // Varsayılan etkinlik listesi
        return [
            { id: 1, title: "Kitap Okuma Kulübü", category: "kitap", date: "15 Ekim 2026", time: "14:00", place: "Merkez Kütüphane", desc: "Bu ayki kitabımızı birlikte tartışacağımız okuma grubu buluşması." },
            { id: 2, title: "Yazar Söyleşisi", category: "soylesi", date: "22 Ekim 2026", time: "15:30", place: "Konferans Salonu", desc: "Ünlü yazarımız ile edebiyat ve yaratıcı yazarlık üzerine keyifli bir söyleşi." },
            { id: 3, title: "Şiir Dinletisi", category: "soylesi", date: "5 Kasım 2026", time: "18:00", place: "Amfi Tiyatro", desc: "Öğrencilerimizin kendi şiirlerini seslendireceği özel bir akşam etkinliği." },
            { id: 4, title: "Kültür Gezisi", category: "gezi", date: "12 Kasım 2026", time: "09:00", place: "Şehir Merkezi", desc: "Tarihi ve kültürel mekanları keşfedeceğimiz bir günlük gezi programı." }
        ];
    }

    function renderCalendar(month, year) {
        if (!calendarDaysGrid || !calMonthTitle) return;
        calMonthTitle.textContent = `${MONTH_NAMES_TR[month]} ${year}`;

        calendarDaysGrid.innerHTML = '';
        const allEvents = getAllEventsList();

        // Ayın ilk gününün haftanın hangi günü olduğu (Pazartesi=0, Salı=1, ... Pazar=6)
        const firstDay = new Date(year, month, 1).getDay();
        const startOffset = (firstDay + 6) % 7; // TR takvim pazartesi başlar
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Boş hücreler
        for (let i = 0; i < startOffset; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'cal-day-cell empty';
            calendarDaysGrid.appendChild(emptyCell);
        }

        // Gün hücreleri
        for (let d = 1; d <= daysInMonth; d++) {
            const cell = document.createElement('div');
            cell.className = 'cal-day-cell';
            cell.textContent = d;

            // Bu günde etkinlik var mı?
            const currentMonthName = MONTH_NAMES_TR[month].toLowerCase();
            const matchingEvents = allEvents.filter(ev => {
                const lowerDate = ev.date.toLowerCase();
                const dayMatch = lowerDate.includes(String(d) + ' ') || lowerDate.includes('0' + String(d) + ' ');
                const monthMatch = lowerDate.includes(currentMonthName);
                return dayMatch && monthMatch;
            });

            if (matchingEvents.length > 0) {
                cell.classList.add('has-event');
                const dot = document.createElement('span');
                dot.className = 'event-dot';
                cell.appendChild(dot);
            }

            cell.addEventListener('click', () => {
                document.querySelectorAll('.cal-day-cell').forEach(c => c.classList.remove('selected'));
                cell.classList.add('selected');
                showDayEvents(d, MONTH_NAMES_TR[month], year, matchingEvents);
            });

            calendarDaysGrid.appendChild(cell);
        }
    }

    function showDayEvents(day, monthName, year, events) {
        if (!calPanelDateTitle || !calPanelBody) return;
        calPanelDateTitle.textContent = `${day} ${monthName} ${year}`;
        calPanelBody.innerHTML = '';

        if (!events || events.length === 0) {
            calPanelBody.innerHTML = `<p class="cal-empty-msg"><i class="far fa-calendar"></i> Bu tarihte planlanmış bir etkinlik bulunmuyor.</p>`;
            return;
        }

        events.forEach(ev => {
            const item = document.createElement('div');
            item.className = 'cal-event-item-card';
            item.innerHTML = `
                <h5>${ev.title}</h5>
                <p>${ev.desc || ''}</p>
                <div class="cal-event-item-meta">
                    <span><i class="far fa-clock"></i> ${ev.time || '14:00'}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${ev.place || 'Kampüs'}</span>
                    <span><i class="fas fa-tag"></i> ${ev.category || 'Etkinlik'}</span>
                </div>
            `;
            calPanelBody.appendChild(item);
        });
    }

    // ==========================================
    // DİNAMİK VERİ SENKRONİZASYONU (LOCALSTORAGE)
    // ==========================================
    function syncDynamicSiteContent() {
        try {
            const raw = localStorage.getItem('sdu_topluluk_data');
            if (!raw) return;
            const data = JSON.parse(raw);

            // Ayın Kitabı Senkronizasyonu
            if (data.book) {
                const b = data.book;
                const bookTag = document.querySelector('.book-tag');
                if (bookTag && b.monthTag) bookTag.textContent = b.monthTag;

                const bookTitle = document.querySelector('.book-title');
                if (bookTitle && b.title) bookTitle.textContent = b.title;

                const bookAuthor = document.querySelector('.book-author');
                if (bookAuthor && b.author) bookAuthor.textContent = b.author;

                const bookHeading = document.querySelector('.book-heading');
                if (bookHeading && b.title) bookHeading.textContent = b.title;

                const bookWriter = document.querySelector('.book-writer');
                if (bookWriter && b.author) bookWriter.textContent = b.author;

                const bookSynopsis = document.querySelector('.book-synopsis');
                if (bookSynopsis && (b.quote || b.synopsis)) {
                    let html = '';
                    if (b.quote) html += `"${b.quote}"<br><br>`;
                    if (b.synopsis) html += b.synopsis;
                    bookSynopsis.innerHTML = html;
                }

                const badges = document.querySelectorAll('.book-meta-badges .badge');
                if (badges.length >= 3) {
                    if (b.genre) badges[0].innerHTML = `<i class="fas fa-bookmark"></i> ${b.genre}`;
                    if (b.pages) badges[1].innerHTML = `<i class="fas fa-file-alt"></i> ${b.pages} Sayfa`;
                    if (b.readers) badges[2].innerHTML = `<i class="fas fa-users"></i> ${b.readers}`;
                }

                const meetingItems = document.querySelectorAll('.book-meeting-card .meeting-item span');
                if (meetingItems.length >= 2) {
                    if (b.meetingDate) meetingItems[0].textContent = b.meetingDate;
                    if (b.meetingPlace) meetingItems[1].textContent = b.meetingPlace;
                }

                const readingBar = document.getElementById('readingProgressBar');
                if (readingBar && b.progress !== undefined) {
                    readingBar.dataset.target = b.progress;
                }
            }

            // Etkinlikler Senkronizasyonu
            if (data.events && Array.isArray(data.events) && data.events.length > 0) {
                const grid = document.getElementById('eventsGrid');
                if (grid) {
                    grid.innerHTML = '';
                    data.events.forEach(ev => {
                        const card = document.createElement('div');
                        card.className = 'event-card';
                        card.dataset.category = ev.category;
                        card.innerHTML = `
                            <div class="event-image">
                                <div class="event-placeholder">
                                    <i class="${ev.icon || 'fas fa-calendar-day'}"></i>
                                </div>
                                <span class="event-badge ${ev.badge === 'Önümüzdeki Ay' ? 'upcoming' : ''}">${ev.badge || 'Yaklaşan'}</span>
                            </div>
                            <div class="event-content">
                                <div class="event-date">
                                    <i class="fas fa-calendar-alt"></i>
                                    ${ev.date}
                                </div>
                                <h3>${ev.title}</h3>
                                <p>${ev.desc || ''}</p>
                                <div class="event-footer">
                                    <span><i class="fas fa-map-marker-alt"></i> ${ev.place}</span>
                                    <span><i class="fas fa-clock"></i> ${ev.time || '14:00'}</span>
                                    <button class="event-cal-btn" data-title="${ev.title}" data-date="${ev.date}" aria-label="Takvime Ekle" title="Takvime Ekle / Hatırlatıcı"><i class="far fa-calendar-plus"></i></button>
                                </div>
                            </div>
                        `;
                        grid.appendChild(card);
                    });
                    bindEventCalButtons();
                }
            }
        } catch (e) {
            console.warn('Dinamik senkronizasyon hatası:', e);
        }
    }

    // Oturum Açmış Yönetici Varsa Nav'da Göster
    try {
        const loggedUserRaw = sessionStorage.getItem('sdu_admin_user');
        if (loggedUserRaw) {
            const user = JSON.parse(loggedUserRaw);
            const navAdminBtn = document.querySelector('.nav-admin-btn');
            if (navAdminBtn) {
                navAdminBtn.innerHTML = `<i class="fas fa-shield-alt"></i> <span>${user.name.split(' ')[0]} (Panel)</span>`;
                navAdminBtn.style.background = 'var(--primary-light)';
                navAdminBtn.style.color = 'var(--primary)';
            }
        }
    } catch (e) {}

    // Dinamik İçerik Yükle
    syncDynamicSiteContent();

    // Initial scroll call
    handleScroll();
});

