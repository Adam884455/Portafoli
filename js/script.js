document.addEventListener('DOMContentLoaded', () => {

    // --- PAGE TRANSITION LOGIC ---
    // Inject overlay if missing (auto-fix)
    if (!document.querySelector('.page-transition-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        document.body.appendChild(overlay);
    }
    const transitionOverlay = document.querySelector('.page-transition-overlay');

    // --- ATMOSPHERIC ORBS ---
    if (!document.querySelector('.orb')) {
        const orb1 = document.createElement('div');
        orb1.className = 'orb orb-1';
        document.body.appendChild(orb1);

        const orb2 = document.createElement('div');
        orb2.className = 'orb orb-2';
        document.body.appendChild(orb2);
    }

    // Handle Link Clicks
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only Intercept internal links that are not anchors (#) or new tabs
            if (href.startsWith('#') || href.startsWith('mailto:') || this.target === '_blank') return;

            e.preventDefault();

            // Activate Overlay (Fade Out)
            transitionOverlay.classList.add('active');

            // Wait for animation then navigate
            setTimeout(() => {
                window.location.href = href;
            }, 500); // Slightly faster
        });
    });

    // --- SMOOTH ENTRANCE ---
    window.addEventListener('load', () => {
        if (transitionOverlay) {
            transitionOverlay.classList.remove('active');
        }

        // Defer observer to allow layout stability
        setTimeout(initRevealObserver, 100);
    });

    function initRevealObserver() {
        const revealElements = document.querySelectorAll('.reveal');

        const revealOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Use requestAnimationFrame for smoother class updates
                    requestAnimationFrame(() => {
                        entry.target.classList.add('active');
                    });
                    revealOnScroll.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: "0px 0px -20px 0px"
        });

        revealElements.forEach(el => {
            revealOnScroll.observe(el);
        });
    }

    // --- SIDEBAR INJECTION & LOGIC ---
    const injectSidebar = () => {
        const sidebarHTML = `
            <div class="top-nav-controls" style="position: fixed; top: 25px; right: 25px; z-index: 10001; display: flex; align-items: center; gap: 15px;">
                <a href="assets/activity6-instructions.pdf" target="_blank" class="btn btn-instr-top" style="padding: 10px 20px; font-size: 0.85rem; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); transition: 0.3s;">📄 Instruccions</a>
                <button class="menu-toggle-btn" id="menuToggle" style="position: static;">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            <nav class="sidebar" id="sidebar">
                <div class="sidebar-header" id="toggleNavHeader">
                    <span>🏠 NAVEGACIÓ</span>
                    <span class="chevron">▼</span>
                </div>
                
                <div class="collapsible-content" id="navContent">
                    <a href="index.html" class="sidebar-link">🏠 Inici</a>
                    <a href="activity1.html" class="sidebar-link">📅 Activitat 1</a>
                    <a href="activity2.html" class="sidebar-link">📺 Activitat 2</a>
                    <a href="activity3.html" class="sidebar-link">🎬 Activitat 3</a>
                    <a href="activity4.html" class="sidebar-link">🗣️ Activitat 4</a>
                    <a href="activity5.html" class="sidebar-link">💭 Activitat 5</a>
                    <a href="activity6.html" class="sidebar-link">📊 Activitat 6</a>
                </div>
                
                <div class="sidebar-header" id="toggleInstrHeader" style="margin-top: 15px;">
                    <span>📝 INSTRUCCIONS</span>
                    <span class="chevron">▼</span>
                </div>
                
                <div class="collapsible-content" id="instrContent">
                    <a href="assets/activity1.pdf" target="_blank" class="sidebar-link" style="font-size: 0.8rem;">📄 Act. 1: Línia del Temps</a>
                    <a href="assets/activity2.pdf" target="_blank" class="sidebar-link" style="font-size: 0.8rem;">📄 Act. 2: La Publicitat</a>
                    <a href="assets/activity3-instructions.pdf" target="_blank" class="sidebar-link" style="font-size: 0.8rem;">📄 Act. 3: Rols Invertits</a>
                    <a href="assets/activity4-instructions.pdf" target="_blank" class="sidebar-link" style="font-size: 0.8rem;">📄 Act. 4: Estereotips</a>
                    <a href="assets/activity6-instructions.pdf" target="_blank" class="sidebar-link" style="font-size: 0.8rem;">📄 Act. 6: Opinions</a>
                    <a href="#" id="act5TextBtn" class="sidebar-link" style="font-size: 0.8rem;">💭 Act. 5: Reflexió (Text)</a>
                </div>
                
            </nav>
        `;
        document.body.insertAdjacentHTML('beforeend', sidebarHTML);

        const toggleBtn = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');

        const navHeader = document.getElementById('toggleNavHeader');
        const navContent = document.getElementById('navContent');
        const instrHeader = document.getElementById('toggleInstrHeader');
        const instrContent = document.getElementById('instrContent');
        const act5Btn = document.getElementById('act5TextBtn');

        toggleBtn.addEventListener('click', () => {
            toggleBtn.classList.toggle('active');
            sidebar.classList.toggle('active');
        });

        // Unified Collapsible logic
        const setupToggle = (header, content) => {
            header.addEventListener('click', () => {
                header.classList.toggle('collapsed');
                content.classList.toggle('collapsed');
            });
        };

        setupToggle(navHeader, navContent);
        setupToggle(instrHeader, instrContent);

        // Activity 5 Text Window
        if (act5Btn) {
            act5Btn.addEventListener('click', (e) => {
                e.preventDefault();
                const text = `
                    <html>
                    <head>
                        <title>Instruccions Activitat 5</title>
                        <style>
                            body { font-family: 'Inter', sans-serif; background: #121212; color: #fff; padding: 40px; line-height: 1.6; max-width: 800px; margin: auto; }
                            h1 { color: #bb86fc; border-bottom: 2px solid #333; padding-bottom: 10px; }
                            p { margin-bottom: 20px; font-size: 1.1rem; }
                            .highlight { color: #03dac6; font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <h1>ACTIVITAT 5. REFLEXIÓ</h1>
                        <p>Sovint ens preguntem per què es parla tant de feminisme i no de “masculinisme”.</p>
                        <p>El feminisme va néixer perquè durant segles les dones no tenien drets bàsics: no podien votar, estudiar, tenir propietats ni decidir sobre la seva vida.</p>
                        <p>Els homes, com a grup, no han patit aquesta discriminació pel fet de ser homes.</p>
                        <p>Això no vol dir que els homes no tinguin problemes: tenen més suïcidis, més violència, més pressió social per ser forts i no mostrar emocions.</p>
                        <p>Però aquests problemes no venen de ser oprimits, sinó d’un model de masculinitat molt exigent.</p>
                        <p>Per això no existeix un “masculinisme” com a moviment d’alliberament, però sí que cal parlar de noves masculinitats.</p>
                        <p class="highlight">Si els homes també pateixen per culpa dels rols de gènere, per què alguns veuen el feminisme com una amenaça? Feu una reflexió.</p>
                    </body>
                    </html>
                `;
                const win = window.open("", "_blank");
                win.document.write(text);
                win.document.close();
            });
        }

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('active');
                toggleBtn.classList.remove('active');
            }
        });
    };

    injectSidebar();
});
