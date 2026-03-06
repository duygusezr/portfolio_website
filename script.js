document.addEventListener('DOMContentLoaded', () => {

    /* --- Translations --- */
    const translations = {
        tr: {
            nav_about: "Hakkımda",
            nav_ai: "Yapay Zeka",
            nav_game: "Oyun & Simülasyon",
            nav_skills: "Yetenekler",
            nav_contact: "İletişim",
            hero_hi: "",
            hero_title: "Yapay Zeka ve Oyun Geliştirici",
            hero_desc: "Doğal Dil İşleme (NLP), RAG, Agentic Frameworks (LLM) alanlarında ve Unity & Unreal Engine ile Oyun/VR teknolojilerinde uçtan uca, yüksek performanslı ve yenilikçi yazılım sistemleri inşa ediyorum.",
            btn_projects: "Projeleri Gör",
            btn_cv: "Özgeçmiş (CV)",
            btn_contact: "İletişime Geç",
            title_ai: "Yapay Zeka & NLP",
            title_game: "Oyun & Simülasyon",
            filter_all: "Tümü",
            filter_ai: "Yapay Zeka & NLP",
            filter_game: "Oyun & Simülasyon",
            p_ela_title: "ELA — Gerçek Zamanlı 3D Avatar AI Asistan",
            p_ela_desc: "Sesli konuşma, duygu analizi ve 3D avatar animasyonlarını WebSocket üzerinden gerçek zamanlı birleştiren yapay zeka asistanı. Yüz ifadeleri duygu analizine göre dinamik olarak değişir. Web Audio API ile lip-sync entegrasyonu ve milisaniyeler seviyesinde yanıt süreleri (Semantic Cache) sağlandı.",
            p_rag_title: "Doğal Dil Tabanlı Doküman Analiz Sistemi (RAG)",
            p_rag_desc: "Türkçe PDF dokümanlar için Tesseract OCR ve yerel LLaMA modeli kullanan tam kapsamlı çevrimdışı (offline) asistan. ChromaDB vektör veritabanı ile hızlı anlamsal arama ve Docker ile güvenli bir ortam oluşturuldu.",
            link_source: "Kaynak Kodu",
            link_video: "Video",
            p_tekno_title: "TEKNOFEST 2025 - Otonom Müşteri Asistanı",
            p_tekno_desc: "Telekom sektörü için LLM ve Agentic Framework tabanlı, uçtan uca çalışabilen otonom asistan. Dinamik araç kullanımı (Dynamic Tool Use) ve gelişmiş durum yönetimi (State Management) ile karmaşık müşteri talepleri uçtan uca yönetilir.",
            p_vr_title: "VR Deprem Simülasyonu",
            p_vr_desc: "Unity ve Meta Quest SDK kullanılarak geliştirilen, etkileşimli eğitim simülasyonu. Spatial audio (uzamsal ses) ve fizik tabanlı nesne etkileşimleri ile bağımsız VR gözlükleri için gerçekçi ve optimize edilmiş bir deneyim sağlar.",
            p_zombi_title: "Zombi FPS - UE5 Survival Game",
            p_zombi_desc: "Unreal Engine 5 ve C++ kullanılarak geliştirilen hayatta kalma odaklı FPS oyunu. AI Behavior Trees ve Blackboards mantığı kullanılarak akıllı düşman navigasyonu, saldırı mekanikleri kurgulanmış ve oyun motoru içinde optimize edilmiştir.",
            p_brewing_title: "Brewing Bad – Ekonomik Simülasyon",
            p_brewing_desc: "Unity ve C# ile geliştirilen simülasyon oyunu. Karmaşık sipariş yönetimi, algoritmik ekonomik denge sistemleri, modüler UI bileşenleri ve durum odaklı (state-driven) oyun mantığı ile mükemmel bir denge kuruldu.",
            link_play: "Oyna",
            skills_title: "Teknik",
            skills_accent: "Yetenekler",
            s_lang_title: "Programlama Dilleri",
            s_game_title: "Oyun Motorları & VR",
            s_ai_title: "Yapay Zeka & NLP",
            s_web_title: "Web & Veritabanı",
            s_dev_title: "DevOps & Araçlar",
            contact_title: "Birlikte Çalışalım!",
            contact_desc: "Oyun geliştirme, Yapay Zeka (AI) projeleriniz için veya heyecan verici yenilikleri konuşmak için benimle iletişime geçebilirsiniz.",
            btn_mail: "E-Posta Gönder",
            btn_phone: "Beni Ara",
            footer_copy: "&copy; 2026 Duygu Sezer. Tüm hakları saklıdır."
        },
        en: {
            nav_about: "About",
            nav_ai: "AI & NLP",
            nav_game: "Game & Sim",
            nav_skills: "Skills",
            nav_contact: "Contact",
            hero_hi: "",
            hero_title: "AI & Game Developer",
            hero_desc: "I engineer end-to-end, high-performance, and innovative software systems focusing on NLP, RAG, Agentic Frameworks, and Game/VR technologies using Unity and Unreal Engine.",
            btn_projects: "View Projects",
            btn_cv: "Download CV",
            btn_contact: "Contact Me",
            title_ai: "AI & NLP",
            title_game: "Game & Simulation",
            filter_all: "All",
            filter_ai: "AI & NLP",
            filter_game: "Game & Simulation",
            p_ela_title: "ELA — Real-Time 3D Avatar AI Assistant",
            p_ela_desc: "AI assistant uniting voice, emotion analysis, and 3D avatar animations via WebSocket. Facial expressions dynamically change based on emotion. Achieved sub-second response times using Semantic Cache and lip-sync via Web Audio API.",
            p_rag_title: "Offline Natural Language Based Document Analyzer (RAG)",
            p_rag_desc: "Full offline assistant using Tesseract OCR and local LLaMA for PDF documents. Built a secure environment with Docker and fast semantic search via ChromaDB.",
            link_source: "Source Code",
            link_video: "Video",
            p_tekno_title: "TEKNOFEST 2025 - Autonomous Customer Assistant",
            p_tekno_desc: "End-to-end autonomous assistant for the telecom sector using LLM and Agentic Frameworks. Manages complex customer requests safely with Dynamic Tool Use and State Management.",
            p_vr_title: "VR Earthquake Simulation",
            p_vr_desc: "Interactive educational simulation built with Unity and Meta Quest SDK. Features spatial audio and physics-based object interactions for standalone VR headsets.",
            p_zombi_title: "Zombie FPS - UE5 Survival Game",
            p_zombi_desc: "Survival FPS game developed in Unreal Engine 5 with C++. Built intelligent enemy navigation and attack mechanics natively using AI Behavior Trees and Blackboards.",
            p_brewing_title: "Brewing Bad – Economic Simulation",
            p_brewing_desc: "Simulation game built with Unity and C#. Excellent balance established through complex order management, modular UI components, and state-driven game logic.",
            link_play: "Play",
            skills_title: "Technical",
            skills_accent: "Skills",
            s_lang_title: "Programming Languages",
            s_game_title: "Game Engines & VR",
            s_ai_title: "AI & NLP",
            s_web_title: "Web & Databases",
            s_dev_title: "DevOps & Tools",
            contact_title: "Let's Work Together!",
            contact_desc: "Feel free to reach out for game development, AI projects, or to discuss exciting innovations.",
            btn_mail: "Send Email",
            btn_phone: "Call Me",
            footer_copy: "&copy; 2026 Duygu Sezer. All rights reserved."
        }
    };

    let currentLang = 'tr';
    const langBtn = document.getElementById('lang-btn');

    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        langBtn.textContent = lang === 'tr' ? 'EN' : 'TR';

        const langElements = document.querySelectorAll('.lang');
        langElements.forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update CV link specifically according to language
        const cvBtn = document.getElementById('cv-download-btn');
        if (cvBtn) {
            cvBtn.href = lang === 'tr' ? 'assets/CV_TR.pdf' : 'assets/CV_EN.pdf';
        }
    }

    langBtn.addEventListener('click', () => {
        setLanguage(currentLang === 'tr' ? 'en' : 'tr');
    });

    /* --- Navbar Scroll Effect & Mobile Menu --- */
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
        });

        document.querySelectorAll('.nav-link-mobile').forEach(link => {
            link.addEventListener('click', () => mobileNav.classList.remove('open'));
        });
    }

    /* --- Intersection Observer for Scroll Animations --- */
    const revealElements = document.querySelectorAll('.reveal-up');

    // Setup observer
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it comes into full view
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Opted not to unobserve so effects happen every time you scroll past if wanted
                // Make it run once and keep it:
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => scrollObserver.observe(el));

    /* --- Project Filtering --- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('.filter-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            filterItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    // Show gracefully
                    item.classList.remove('hide');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        // Re-trigger the active class for the upward animation to replay
                        item.classList.add('active');
                        if (item.classList.contains('project-card')) {
                            item.style.transform = 'scale(1)';
                        } else {
                            item.style.transform = 'translateY(0)';
                        }
                    }, 50);
                } else {
                    // Hide gracefully
                    item.style.opacity = '0';
                    item.classList.remove('active');
                    if (item.classList.contains('project-card')) {
                        item.style.transform = 'scale(0.9)';
                    } else {
                        item.style.transform = 'translateY(20px)';
                    }
                    setTimeout(() => {
                        item.classList.add('hide');
                    }, 400); // match transition duration
                }
            });
        });
    });

    /* --- Navbar Interceptor for Split Categories --- */
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#projects-ai' || href === '#projects-game') {
                e.preventDefault();

                // Scroll to main projects section
                const targetSection = document.querySelector('#projects');
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }

                // Trigger the correct filter button automatically
                const filterTarget = href === '#projects-ai' ? 'ai' : 'game';
                const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterTarget}"]`);
                if (targetBtn) targetBtn.click();
            }
        });
    });

    /* --- Interactive Background Blobs --- */
    const blobs = document.querySelectorAll('.blob');

    document.addEventListener('mousemove', (e) => {
        // Reduced the lag to make it subtle
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        blobs.forEach((blob, index) => {
            const factor = (index + 1) * 20;
            const moveX = (x - 0.5) * factor;
            const moveY = (y - 0.5) * factor;

            blob.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    /* --- Chatbot Logic --- */
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');

    let initialMessageSent = false;

    // Toggle Chatbot
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
        if (!initialMessageSent) {
            setTimeout(() => {
                addMessage("bot", currentLang === 'tr' ?
                    "Merhaba! Ben Duygu-Bot. 🤖 Duygu hakkında ne öğrenmek istersiniz? (Örn: Yetenekleri neler, projeleri ne?)" :
                    "Hi! I'm Duygu-Bot. 🤖 What would you like to know about Duygu? (e.g. skills, projects?)");
            }, 300);
            initialMessageSent = true;
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    // Send Message
    const sendMessage = () => {
        const text = chatbotInput.value.trim();
        if (text === "") return;

        addMessage("user", text);
        chatbotInput.value = "";

        // Change input placeholder temporarily
        const oldPlaceholder = chatbotInput.placeholder;
        chatbotInput.placeholder = currentLang === 'tr' ? "Yazıyor..." : "Typing...";
        chatbotInput.disabled = true;

        // Simulate thinking and process response
        setTimeout(() => {
            const response = generateBotResponse(text);
            addMessage("bot", response);
            chatbotInput.placeholder = oldPlaceholder;
            chatbotInput.disabled = false;
            chatbotInput.focus();
        }, 800 + Math.random() * 700);
    };

    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function addMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;
        msgDiv.textContent = text;
        chatbotMessages.appendChild(msgDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function generateBotResponse(input) {
        const lowerInput = input.toLowerCase();

        if (currentLang === 'tr') {
            if (lowerInput.includes('yetenek') || lowerInput.includes('dil') || lowerInput.includes('ne biliyor')) {
                return "Duygu'nun teknik yelpazesi geniştir! Python, C#, C++, JavaScript kullanır. Unity ve Unreal Engine ile oyun/VR geliştirirken, yapay zekada LLaMA, RAG ve Agentic sistemlerle (LLM) ilgilenir. 🧠";
            } else if (lowerInput.includes('proje') || lowerInput.includes('oyun') || lowerInput.includes('neler yaptı')) {
                return "Birçok yenilikçi projesi var! En büyükleri: WebSocket'li 3D Avatar (ELA), Doğal Dil Tabanlı Analiz Sistemi, VR Deprem Simülasyonu ve 'Brewing Bad' adında oyun ekonomi simülasyonu bulunuyor. 🚀 (Daha fazlası yukarıdaki Projeler listesinde!)";
            } else if (lowerInput.includes('merhaba') || lowerInput.includes('selam') || lowerInput.includes('hi')) {
                return "Selam! 😄 Portfolyoda gezmek nasıl gidiyor? Duygu'nun yeteneklerini, projelerini merak ediyorsan hemen sorabilirsin.";
            } else if (lowerInput.includes('iletişim') || lowerInput.includes('ulaş') || lowerInput.includes('mail')) {
                return "Duygu'ya sezerduygu465@gmail.com adresinden veya LinkedIn (duygusezrr) üzerinden her zaman ulaşabilirsiniz! ✉️";
            } else {
                return "Hmm, buna cevap verecek kadar gelişmiş modellerim henüz eğitilmedi! 🤖 Lütfen projeler, yetenekler veya iletişim gibi konularda sorular sorar mısın?";
            }
        } else {
            if (lowerInput.includes('skill') || lowerInput.includes('language') || lowerInput.includes('know')) {
                return "Duygu has a broad technical stack! She uses Python, C#, C++, JavaScript. While she develops game/VR with Unity and Unreal Engine, she works with LLaMA, RAG and Agentic systems in AI. 🧠";
            } else if (lowerInput.includes('project') || lowerInput.includes('game') || lowerInput.includes('did')) {
                return "She actually has several innovative projects! Top ones: 3D Avatar with WebSocket (ELA), VR Earthquake Simulation, and a simulation game called 'Brewing Bad'. 🚀 (Check the section above for more!)";
            } else if (lowerInput.includes('hi') || lowerInput.includes('hello')) {
                return "Hello! 😄 How's your scrolling going? Feel free to ask me anything about Duygu's skills or projects.";
            } else if (lowerInput.includes('contact') || lowerInput.includes('reach') || lowerInput.includes('email')) {
                return "You can always reach Duygu at sezerduygu465@gmail.com or via LinkedIn (duygusezrr)! ✉️";
            } else {
                return "Hmm, my LLM weights haven't caught up to that yet! 🤖 Could you please ask about her projects, skills, or contact info?";
            }
        }
    }
});
