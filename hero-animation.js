import { animate, stagger } from "https://cdn.jsdelivr.net/npm/motion@11.11.17/+esm";

document.addEventListener('DOMContentLoaded', async () => {
    // Clear the FOUC prevention fallback timeout since JS is running successfully
    if (window.heroAnimFallback) {
        clearTimeout(window.heroAnimFallback);
    }

    // 1. Split the title text into words for the premium slide-up assembly effect
    const titleEl = document.getElementById('hero-main-title');
    if (titleEl) {
        const text = titleEl.innerText.trim();
        const words = text.split(/\s+/);
        titleEl.innerHTML = words.map(word => {
            return `<span class="word-wrapper"><span class="word">${word}</span></span>`;
        }).join(' ');
    }

    // 2. Prepare SVG paths for path-drawing animation
    const paths = [
        document.getElementById('tactical-path-1'),
        document.getElementById('tactical-path-2'),
        document.getElementById('tactical-path-3')
    ];
    
    paths.forEach(path => {
        if (path) {
            const length = path.getTotalLength();
            path.style.strokeDasharray = `${length} ${length}`;
            path.style.strokeDashoffset = length.toString();
        }
    });

    // Defender X path setup
    const xPath = document.querySelector('#tactical-node-3 path');
    if (xPath) {
        const length = xPath.getTotalLength();
        xPath.style.strokeDasharray = `${length} ${length}`;
        xPath.style.strokeDashoffset = length.toString();
        xPath.style.opacity = '0'; // Hide it initially
    }

    // 3. Set initial animation states inline to ensure smooth transition from opacity 0
    const selectors = [
        '.hero-content .tag-badge',
        '#hero-main-title',
        '#hero-main-title .word',
        '.hero-subtitle',
        '.hero-buttons .btn',
        '.hero-logo-img',
        '.circle-outer-wrapper',
        '.circle-inner-wrapper',
        '.tactical-grid',
        '.tactical-bracket',
        '.tactical-scanner',
        '.scroll-down',
        '.tactical-node'
    ];
    
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.style.opacity = '0';
        });
    });

    // 4. Remove the FOUC prevention style element from head
    const foucStyle = document.getElementById('hero-fouc-style');
    if (foucStyle) {
        foucStyle.remove();
    }

    // 5. RUN DYNAMIC ORCHESTRATION TIMELINE (Ultra Smooth Cinematic Adjustments)
    const smoothBezier = [0.16, 1, 0.3, 1]; // Premium easeOutExpo curve for buttery transitions

    // --- Phase 1: Technical Grid & Field Initialization ---
    // Start drawing the technical dot grid and tactical circles
    animate('.tactical-grid', 
        { opacity: [0, 0.45], scale: [1.08, 1] }, 
        { duration: 1.8, ease: smoothBezier }
    );
    
    animate('.circle-outer-wrapper', 
        { scale: [0.5, 1], opacity: [0, 1] }, 
        { duration: 2.0, ease: smoothBezier }
    );
    
    animate('.circle-inner-wrapper', 
        { scale: [0.6, 1], opacity: [0, 1] }, 
        { duration: 2.0, ease: smoothBezier }
    );

    // --- Phase 2: Target Locking Viewfinder Brackets ---
    // Target brackets slide inward from corners and focus on the logo area
    animate('.tactical-bracket.tl', { transform: ['translate(-20px, -20px)', 'translate(0px, 0px)'], opacity: [0, 0.75] }, { delay: 0.15, duration: 1.4, ease: smoothBezier });
    animate('.tactical-bracket.tr', { transform: ['translate(20px, -20px)', 'translate(0px, 0px)'], opacity: [0, 0.75] }, { delay: 0.15, duration: 1.4, ease: smoothBezier });
    animate('.tactical-bracket.bl', { transform: ['translate(-20px, 20px)', 'translate(0px, 0px)'], opacity: [0, 0.75] }, { delay: 0.15, duration: 1.4, ease: smoothBezier });
    animate('.tactical-bracket.br', { transform: ['translate(20px, 20px)', 'translate(0px, 0px)'], opacity: [0, 0.75] }, { delay: 0.15, duration: 1.4, ease: smoothBezier });

    // --- Phase 3: Left Column Content Assembly ---
    // Start this slightly delayed to stagger the left content with the right visual column
    
    // Tag badges slide in from left
    animate('.hero-content .tag-badge', 
        { x: [-20, 0], opacity: [0, 1], scale: [0.95, 1] }, 
        { delay: stagger(0.15, { startDelay: 0.4 }), duration: 1.1, ease: smoothBezier }
    );

    // Main title word-by-word reveal (words slide up from their hidden clip-containers)
    if (titleEl) {
        titleEl.style.opacity = '1'; // Ensure wrapper is visible
        animate('#hero-main-title .word', 
            { y: ['105%', '0%'], opacity: [0, 1] }, 
            { delay: stagger(0.08, { startDelay: 0.6 }), duration: 1.2, ease: smoothBezier }
        );
    }

    // Subtitle slides up gently
    animate('.hero-subtitle', 
        { y: [15, 0], opacity: [0, 1] }, 
        { delay: 1.15, duration: 1.2, ease: smoothBezier }
    );

    // Call-to-action buttons scale and slide up with a soft, highly damped spring
    animate('.hero-buttons .btn', 
        { y: [20, 0], scale: [0.96, 1], opacity: [0, 1] }, 
        { delay: stagger(0.12, { startDelay: 1.4 }), type: "spring", stiffness: 45, damping: 14 }
    );

    // --- Phase 4: Laser Target Scanning Sweep ---
    // Scanner sweep line sweeps slowly and elegantly
    await new Promise(r => setTimeout(r, 500));
    animate('.tactical-scanner', 
        { top: ['0%', '100%'], opacity: [0, 0.8, 0.8, 0] }, 
        { duration: 1.3, ease: "easeInOut" }
    );

    // --- Phase 5: The Logo (The Core) Locks in Place ---
    // Right as the scanner sweeps down, the logo scales in with a soft, elegant spring settle
    await new Promise(r => setTimeout(r, 600));
    const glowWrapper = document.querySelector('.logo-glow-wrapper');
    if (glowWrapper) {
        glowWrapper.classList.add('active');
    }
    
    animate('.hero-logo-img', 
        { scale: [0.85, 1.02, 1], opacity: [0, 1], rotate: [-6, 0] }, 
        { 
            duration: 1.4,
            type: "spring",
            stiffness: 45,
            damping: 15,
            mass: 0.9
        }
    );

    // --- Phase 6: Drawing the Tactical Plays & Dropping Players ---
    // Start drawing the coach whiteboard plays and dropping nodes sequentially
    
    // Play 1 (O6 Pass to O10)
    animate('#tactical-path-1', 
        { strokeDashoffset: 0 }, 
        { delay: 0.2, duration: 1.4, ease: "easeInOut" }
    );

    // Soft drop of player node 1 (O6) and node 2 (O10)
    await new Promise(r => setTimeout(r, 800));
    animate('#tactical-node-1', 
        { transform: ['translateY(-30px) scale(0.6)', 'translateY(0px) scale(1)'], opacity: [0, 1] }, 
        { type: "spring", stiffness: 50, damping: 13 }
    );
    animate('#tactical-node-2', 
        { transform: ['translateX(-20px) translateY(20px) scale(0.6)', 'translateX(0px) translateY(0px) scale(1)'], opacity: [0, 1] }, 
        { type: "spring", stiffness: 50, damping: 13 }
    );

    // Play 2 (U9 run)
    await new Promise(r => setTimeout(r, 400));
    animate('#tactical-path-2', 
        { strokeDashoffset: 0 }, 
        { duration: 1.5, ease: "easeInOut" }
    );

    // Soft drop of player node 4 (U9)
    await new Promise(r => setTimeout(r, 700));
    animate('#tactical-node-4', 
        { transform: ['translateY(-30px) scale(0.6)', 'translateY(0px) scale(1)'], opacity: [0, 1] }, 
        { type: "spring", stiffness: 50, damping: 13 }
    );

    // Play 3 (Cross path to Defender X area)
    await new Promise(r => setTimeout(r, 300));
    animate('#tactical-path-3', 
        { strokeDashoffset: 0 }, 
        { duration: 1.4, ease: "easeInOut" }
    );

    // Draw Defender X chalk cross
    await new Promise(r => setTimeout(r, 700));
    if (xPath) {
        xPath.style.opacity = '1';
        animate(xPath, 
            { strokeDashoffset: 0 }, 
            { duration: 0.85, ease: "easeInOut" }
        );
    }
    animate('#tactical-node-3', 
        { scale: [0.6, 1], opacity: [0, 0.75] }, 
        { duration: 0.6, ease: "easeOut" }
    );

    // --- Phase 7: Final touches (Floating Animation & Scroll Down) ---
    
    // Enable subtle floating movement once logo is assembled
    setTimeout(() => {
        const logoWrapper = document.querySelector('.hero-logo-wrapper');
        if (logoWrapper) {
            logoWrapper.classList.add('floating');
        }
    }, 600);

    // Fade in scroll-down indicator
    animate('.scroll-down', 
        { y: [12, 0], opacity: [0, 1] }, 
        { delay: 0.1, duration: 1.0, ease: "easeOut" }
    );
});
