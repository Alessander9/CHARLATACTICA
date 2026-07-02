document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       STICKY HEADER & SCROLL SPY
       ========================================================================== */
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        // Sticky class on header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active navigation highlight based on scroll position
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${currentSectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    });

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking a link
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    /* ==========================================================================
       YOUTUBE VIDEO DYNAMIC FEED & MODAL SYSTEM
       ========================================================================== */
    const videoModal = document.getElementById('video-modal');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');
    const youtubeIframe = document.getElementById('youtube-iframe');

    const videosContainer = document.getElementById('videos-container');
    const streamsContainer = document.getElementById('streams-container');

    // Static mapping for Fallback Placeholder Cards
    const staticVideoIds = {
        'VIDEO_ID_1': 'coYcKUpjCq4',
        'VIDEO_ID_2': '5k4kLlzc1fM',
        'VIDEO_ID_3': '8jFwtj4qFq8',
        'VIDEO_ID_4': 'GzN5b1G8c7E',
        'STREAM_ID_1': '8jFwtj4qFq8',
        'STREAM_ID_2': 'coYcKUpjCq4',
        'STREAM_ID_3': '5k4kLlzc1fM',
        'STREAM_ID_4': 'GzN5b1G8c7E'
    };

    // Helper: Categorize video matching titles for beautiful badges
    function getVideoBadge(title) {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('previa')) {
            return { text: 'Previa', css: 'previa' };
        } else if (lowerTitle.includes('post') || lowerTitle.includes('reac') || lowerTitle.includes('resumen')) {
            return { text: 'Post Partido', css: 'post' };
        } else if (lowerTitle.includes('fichaje') || lowerTitle.includes('mercado') || lowerTitle.includes('refuerz')) {
            return { text: 'Mercado Crema', css: 'mercado' };
        } else if (lowerTitle.includes('debate') || lowerTitle.includes('en vivo') || lowerTitle.includes('live')) {
            return { text: 'Debate', css: 'debate' };
        }
        return { text: 'Análisis Crema', css: 'previa' };
    }

    // Dynamic Card Generator
    function createVideoCardHTML(video, isStream = false) {
        const badge = getVideoBadge(video.title);
        const videoLink = video.link || `https://www.youtube.com/watch?v=${video.youtubeId}`;
        const thumbnail = video.thumbnail || `https://i3.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
        
        let badgeHTML = `<span class="video-badge badge-${badge.css}">${badge.text}</span>`;
        if (isStream) {
            const isCurrentlyLive = video.title.toLowerCase().includes('en vivo') || video.title.toLowerCase().includes('live');
            badgeHTML = isCurrentlyLive 
                ? `<span class="video-badge badge-post"><span class="pulse-dot"></span> EN VIVO</span>`
                : `<span class="video-badge badge-previa">Retransmisión</span>`;
        }

        return `
            <div class="video-card card-hover-effect">
                <div class="video-thumbnail-wrapper" data-youtube-id="${video.youtubeId}">
                    <div class="video-thumbnail-placeholder" style="background-image: linear-gradient(rgba(17,17,17,0.3), rgba(17,17,17,0.6)), url('${thumbnail}');">
                        <div class="play-button-overlay">
                            <div class="play-icon-circle">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                        </div>
                        ${badgeHTML}
                    </div>
                </div>
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p class="video-meta">${video.pubDateText || 'Publicado recientemente'} &bull; Charla Táctica</p>
                    <a href="${videoLink}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-xs btn-yt">
                        Ver en YouTube
                    </a>
                </div>
            </div>
        `;
    }

    // Main Dynamic Renderer
    function renderDynamicFeeds(feedItems) {
        if (!videosContainer || !streamsContainer) return;

        // Map raw items
        const mappedItems = feedItems.map(item => {
            // Extract Video ID
            let youtubeId = '';
            if (item.guid && item.guid.includes('yt:video:')) {
                youtubeId = item.guid.split('yt:video:')[1];
            } else if (item.link) {
                const urlParams = new URLSearchParams(new URL(item.link).search);
                youtubeId = urlParams.get('v');
            }

            // Format Pub Date
            let pubDateText = 'Publicado recientemente';
            if (item.pubDate) {
                const date = new Date(item.pubDate);
                pubDateText = date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
            }

            return {
                title: item.title || 'Análisis Táctico Crema',
                link: item.link || `https://www.youtube.com/watch?v=${youtubeId}`,
                youtubeId: youtubeId,
                thumbnail: item.thumbnail || `https://i3.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
                pubDateText: pubDateText
            };
        }).filter(item => item.youtubeId);

        if (mappedItems.length === 0) {
            console.log('No valid YouTube items parsed. Using offline fallback.');
            return; // Leave fallbacks active
        }

        // Categorize into Streams vs Videos
        const streamItems = [];
        const videoItems = [];

        mappedItems.forEach(item => {
            const titleLower = item.title.toLowerCase();
            const isStreamKeywords = titleLower.includes('vivo') || 
                                     titleLower.includes('live') || 
                                     titleLower.includes('directo') || 
                                     titleLower.includes('transmi') || 
                                     titleLower.includes('programa') || 
                                     titleLower.includes('programa completo') || 
                                     titleLower.includes('reacción');

            if (isStreamKeywords) {
                streamItems.push(item);
            } else {
                videoItems.push(item);
            }
        });

        // Top up lists if one is empty to ensure balanced section grids
        if (videoItems.length === 0) {
            videoItems.push(...mappedItems.slice(0, 4));
        }
        if (streamItems.length === 0) {
            // If no stream keywords matched, fallback to the next available videos so the section isn't left with placeholders
            streamItems.push(...mappedItems.filter(v => !videoItems.slice(0, 4).includes(v)).slice(0, 4));
        }

        // If still empty or sparse, use fallback placeholders for remaining cards (max 4 per grid)
        const videosToRender = videoItems.slice(0, 4);
        const streamsToRender = streamItems.slice(0, 4);

        // Update Videos UI
        if (videosToRender.length > 0) {
            videosContainer.innerHTML = videosToRender.map(v => createVideoCardHTML(v, false)).join('');
        }
        // Update Streams UI
        if (streamsToRender.length > 0) {
            streamsContainer.innerHTML = streamsToRender.map(s => createVideoCardHTML(s, true)).join('');
        }

        console.log(`Successfully populated ${videosToRender.length} videos and ${streamsToRender.length} streams dynamically!`);
    }

    // Dual-Layer Dynamic Feed Fetcher
    async function initializeYouTubeFeeds() {
        const channelId = 'UC-AlnHuvjACQM8SkPwQ9JQQ';
        const rssFeedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

        // Attempt 1: Direct JSON conversion API (rss2json.com)
        const rss2JsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssFeedUrl)}`;

        try {
            console.log('Fetching YouTube feeds via RSS-to-JSON API...');
            const response = await fetch(rss2JsonUrl);
            if (!response.ok) throw new Error('First RSS converter failed');
            const data = await response.json();
            
            if (data.status === 'ok' && data.items && data.items.length > 0) {
                renderDynamicFeeds(data.items);
                return;
            }
            throw new Error('Invalid feed status or items array');
        } catch (error) {
            console.warn('Attempt 1 failed. Trying CORS XML proxy...', error);

            // Attempt 2: CORS Proxy XML Parser (api.allorigins.win)
            const allOriginsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssFeedUrl)}`;
            try {
                const response = await fetch(allOriginsUrl);
                if (!response.ok) throw new Error('CORS XML proxy failed');
                const data = await response.json();
                
                if (data.contents) {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
                    const entries = xmlDoc.getElementsByTagName('entry');
                    
                    if (entries.length > 0) {
                        const items = Array.from(entries).map(entry => {
                            const title = entry.getElementsByTagName('title')[0]?.textContent || '';
                            const link = entry.getElementsByTagName('link')[0]?.getAttribute('href') || '';
                            const videoId = entry.getElementsByTagName('yt:videoId')[0]?.textContent || link.split('v=')[1] || '';
                            const published = entry.getElementsByTagName('published')[0]?.textContent || '';
                            
                            return {
                                title: title,
                                link: link,
                                guid: `yt:video:${videoId}`,
                                pubDate: published,
                                thumbnail: `https://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`
                            };
                        });
                        
                        renderDynamicFeeds(items);
                        return;
                    }
                }
                throw new Error('No entries found in parsed XML');
            } catch (proxyError) {
                console.warn('Attempt 2 failed. Displaying pre-designed fallbacks.', proxyError);
                // Fallbacks are already active in HTML
            }
        }
    }

    // Event Delegation: Open Video Modal (works for dynamic and static cards)
    document.body.addEventListener('click', (e) => {
        const card = e.target.closest('.video-thumbnail-wrapper');
        if (card) {
            e.preventDefault();
            // Try getting dynamic youtube-id first, then fallback static id
            const youtubeId = card.getAttribute('data-youtube-id') || 
                              staticVideoIds[card.getAttribute('data-video-id')] || 
                              'coYcKUpjCq4'; // Safe default fallback
            
            // Set source and open modal
            youtubeIframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
            videoModal.classList.add('open');
            document.body.style.overflow = 'hidden'; // Stop page scroll
        }
    });

    const closeModal = () => {
        videoModal.classList.remove('open');
        youtubeIframe.src = ''; // Clear source to stop playing
        document.body.style.overflow = 'auto'; // Restore scroll
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('open')) {
            closeModal();
        }
    });

    // Run dynamic feed fetch
    initializeYouTubeFeeds();

    /* ==========================================================================
       INTERACTIVE PIZARRA TÁCTICA
       ========================================================================== */
    const pitch = document.getElementById('interactive-pitch');
    const players = document.querySelectorAll('.player-node');
    const formationButtons = document.querySelectorAll('.formation-btn');
    const resetButton = document.getElementById('pitch-reset-btn');
    const canvas = document.getElementById('chalkboard-canvas');

    // Standard positions for the Universitario 11 players in different systems
    const formations = {
        '3-5-2': {
            'p-gk':  { top: '88%', left: '50%', name: 'Portero', shirt: '1' },
            'p-df1': { top: '72%', left: '25%', name: 'Stopper Izq', shirt: '3' },
            'p-df2': { top: '75%', left: '50%', name: 'Líbero', shirt: '2' },
            'p-df3': { top: '72%', left: '75%', name: 'Stopper Der', shirt: '4' },
            'p-mf1': { top: '50%', left: '15%', name: 'Carrilero Izq', shirt: '6' },
            'p-mf2': { top: '56%', left: '38%', name: 'Pivote', shirt: '5' },
            'p-mf3': { top: '56%', left: '62%', name: 'Interior Der', shirt: '8' },
            'p-mf4': { top: '50%', left: '85%', name: 'Carrilero Der', shirt: '7' },
            'p-mf5': { top: '40%', left: '50%', name: 'Volante U', shirt: '10' },
            'p-fw1': { top: '22%', left: '35%', name: 'Atacante', shirt: '11' },
            'p-fw2': { top: '22%', left: '65%', name: 'Punta Crema', shirt: '9' }
        },
        '4-3-3': {
            'p-gk':  { top: '88%', left: '50%', name: 'Portero', shirt: '1' },
            'p-df1': { top: '70%', left: '15%', name: 'Lateral Izq', shirt: '3' },
            'p-df2': { top: '74%', left: '35%', name: 'Zaguero Izq', shirt: '2' },
            'p-df3': { top: '74%', left: '65%', name: 'Zaguero Der', shirt: '4' },
            'p-mf1': { top: '70%', left: '85%', name: 'Lateral Der', shirt: '7' },
            'p-mf2': { top: '58%', left: '50%', name: 'Mediocentro', shirt: '5' },
            'p-mf3': { top: '45%', left: '30%', name: 'Interior Izq', shirt: '8' },
            'p-mf4': { top: '45%', left: '70%', name: 'Interior Der', shirt: '10' },
            'p-mf5': { top: '20%', left: '20%', name: 'Extremo Izq', shirt: '11' },
            'p-fw1': { top: '18%', left: '50%', name: 'Centrodelantero', shirt: '9' },
            'p-fw2': { top: '20%', left: '80%', name: 'Extremo Der', shirt: '6' }
        },
        '4-2-3-1': {
            'p-gk':  { top: '88%', left: '50%', name: 'Portero', shirt: '1' },
            'p-df1': { top: '70%', left: '15%', name: 'Lateral Izq', shirt: '3' },
            'p-df2': { top: '74%', left: '35%', name: 'Zaguero Izq', shirt: '2' },
            'p-df3': { top: '74%', left: '65%', name: 'Zaguero Der', shirt: '4' },
            'p-mf1': { top: '70%', left: '85%', name: 'Lateral Der', shirt: '7' },
            'p-mf2': { top: '58%', left: '35%', name: 'Pivote Izq', shirt: '5' },
            'p-mf3': { top: '58%', left: '65%', name: 'Pivote Der', shirt: '8' },
            'p-mf4': { top: '40%', left: '20%', name: 'Extremo Izq', shirt: '11' },
            'p-mf5': { top: '36%', left: '50%', name: 'Enganche', shirt: '10' },
            'p-fw1': { top: '40%', left: '80%', name: 'Extremo Der', shirt: '6' },
            'p-fw2': { top: '18%', left: '50%', name: 'Punta Única', shirt: '9' }
        }
    };

    let activeFormation = '3-5-2';

    // Apply specific formation positioning to all players
    function applyFormation(formationName) {
        const formationData = formations[formationName];
        if (!formationData) return;
        
        activeFormation = formationName;

        players.forEach(player => {
            const playerId = player.getAttribute('id');
            const playerConfig = formationData[playerId];
            if (playerConfig) {
                // Add transitional class for smooth slide animation on formation switch
                player.style.transition = 'top var(--transition-slow), left var(--transition-slow)';
                player.style.top = playerConfig.top;
                player.style.left = playerConfig.left;
                
                // Update player details (shirt number and position label)
                const nameNode = player.querySelector('.player-name');
                const shirtNode = player.querySelector('.player-shirt');
                
                if (nameNode) nameNode.textContent = playerConfig.name;
                if (shirtNode) shirtNode.textContent = playerConfig.shirt;
            }
        });

        // Trigger updating the SVG lines based on the new formation
        setTimeout(updateTacticalDrawings, 500);
    }

    // Dynamic chalkboard tactical arrows updating
    function updateTacticalDrawings() {
        if (!canvas) return;

        // Clear existing drawing paths
        canvas.innerHTML = `
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#007A3D" />
                </marker>
            </defs>
        `;

        const pitchRect = pitch.getBoundingClientRect();
        const w = pitchRect.width;
        const h = pitchRect.height;

        const p11 = document.getElementById('p-fw1').getBoundingClientRect();
        const p10 = document.getElementById('p-fw2').getBoundingClientRect();
        
        const pt11 = {
            x: p11.left - pitchRect.left + p11.width / 2,
            y: p11.top - pitchRect.top + p11.height / 2
        };
        const pt10 = {
            x: p10.left - pitchRect.left + p10.width / 2,
            y: p10.top - pitchRect.top + p10.height / 2
        };

        const strokeWidth = Math.max(1.5, w * 0.005);
        const strokeWidthDotted = Math.max(1, w * 0.004);

        if (activeFormation === '3-5-2') {
            // Draw run arrows for 3-5-2 wingbacks (relative to container dimensions)
            canvas.insertAdjacentHTML('beforeend', `
                <path d="M ${w * 0.08} ${h * 0.42} Q ${w * 0.05} ${h * 0.29} ${w * 0.08} ${h * 0.16}" stroke="#007A3D" stroke-width="${strokeWidth}" stroke-dasharray="5 3" fill="none" marker-end="url(#arrow)"/>
                <path d="M ${w - w * 0.08} ${h * 0.42} Q ${w - w * 0.05} ${h * 0.29} ${w - w * 0.08} ${h * 0.16}" stroke="#007A3D" stroke-width="${strokeWidth}" stroke-dasharray="5 3" fill="none" marker-end="url(#arrow)"/>
                <path d="M ${pt11.x} ${pt11.y} Q ${pt11.x - w * 0.08} ${pt11.y - h * 0.064} ${pt11.x - w * 0.06} ${pt11.y - h * 0.112}" stroke="white" stroke-width="${strokeWidthDotted}" stroke-dasharray="4 4" fill="none" marker-end="url(#arrow)"/>
            `);
        } else if (activeFormation === '4-3-3') {
            // Draw run arrows for 4-3-3 wingers (relative to container dimensions)
            const p9 = document.getElementById('p-mf5').getBoundingClientRect();
            const p6 = document.getElementById('p-fw2').getBoundingClientRect();
            const pt9 = { x: p9.left - pitchRect.left + p9.width/2, y: p9.top - pitchRect.top + p9.height/2 };
            const pt6 = { x: p6.left - pitchRect.left + p6.width/2, y: p6.top - pitchRect.top + p6.height/2 };

            canvas.insertAdjacentHTML('beforeend', `
                <path d="M ${pt9.x} ${pt9.y} Q ${pt9.x + w * 0.04} ${pt9.y - h * 0.032} ${pt9.x + w * 0.08} ${pt9.y - h * 0.016}" stroke="#007A3D" stroke-width="${strokeWidth}" stroke-dasharray="5 3" fill="none" marker-end="url(#arrow)"/>
                <path d="M ${pt6.x} ${pt6.y} Q ${pt6.x - w * 0.04} ${pt6.y - h * 0.032} ${pt6.x - w * 0.08} ${pt6.y - h * 0.016}" stroke="#007A3D" stroke-width="${strokeWidth}" stroke-dasharray="5 3" fill="none" marker-end="url(#arrow)"/>
            `);
        } else if (activeFormation === '4-2-3-1') {
            // Draw run arrows for 4-2-3-1 overlapping fullbacks (relative to container dimensions)
            canvas.insertAdjacentHTML('beforeend', `
                <path d="M ${w * 0.08} ${h * 0.512} L ${w * 0.08} ${h * 0.288}" stroke="#007A3D" stroke-width="${strokeWidth}" stroke-dasharray="5 3" fill="none" marker-end="url(#arrow)"/>
                <path d="M ${w - w * 0.08} ${h * 0.512} L ${w - w * 0.08} ${h * 0.288}" stroke="#007A3D" stroke-width="${strokeWidth}" stroke-dasharray="5 3" fill="none" marker-end="url(#arrow)"/>
            `);
        }
    }

    // Set active class on formation buttons and trigger positions shift
    formationButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            formationButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const selectedFormation = btn.getAttribute('data-formation');
            applyFormation(selectedFormation);
        });
    });

    // Reset button functionality
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Reset to default button
            formationButtons.forEach(b => b.classList.remove('active'));
            const defaultBtn = document.querySelector('[data-formation="3-5-2"]');
            if (defaultBtn) defaultBtn.classList.add('active');
            
            applyFormation('3-5-2');
        });
    }

    // Initialize formation positioning
    applyFormation(activeFormation);

    // Re-adjust SVG tactical overlay on window resizing
    window.addEventListener('resize', updateTacticalDrawings);

    /* ==========================================================================
       DRAG & DROP SYSTEM (MOUSE AND TOUCH EVENTS)
       ========================================================================== */
    players.forEach(player => {
        let isDragging = false;
        let startX, startY;
        let originalLeft, originalTop;

        const startDrag = (clientX, clientY) => {
            isDragging = true;
            // Disable transitions during manual dragging for immediate tracking response
            player.style.transition = 'none';

            // Calculate current coordinates in pixels from percentages
            const pitchRect = pitch.getBoundingClientRect();
            
            originalLeft = player.offsetLeft;
            originalTop = player.offsetTop;
            
            startX = clientX;
            startY = clientY;

            player.style.zIndex = '100'; // Bring active player to the front
        };

        const doDrag = (clientX, clientY) => {
            if (!isDragging) return;

            const dx = clientX - startX;
            const dy = clientY - startY;

            const newLeftPx = originalLeft + dx;
            const newTopPx = originalTop + dy;

            const pitchRect = pitch.getBoundingClientRect();

            // Boundaries constrain (prevent players from flying off the chalkboard)
            const padding = 20; // px
            const minX = padding;
            const maxX = pitchRect.width - padding;
            const minY = padding;
            const maxY = pitchRect.height - padding;

            // Constrain
            const finalLeftPx = Math.max(minX, Math.min(newLeftPx, maxX));
            const finalTopPx = Math.max(minY, Math.min(newTopPx, maxY));

            // Convert back to percentage for layout responsiveness
            const leftPct = (finalLeftPx / pitchRect.width) * 100;
            const topPct = (finalTopPx / pitchRect.height) * 100;

            player.style.left = `${leftPct}%`;
            player.style.top = `${topPct}%`;

            // Keep updating chalkboard arrows matching player positions
            updateTacticalDrawings();
        };

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            player.style.zIndex = '5';
            
            // Re-apply hover state transitions
            player.style.transition = 'transform var(--transition-fast)';
        };

        // Desktop Mouse Listeners
        player.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startDrag(e.clientX, e.clientY);

            const onMouseMove = (moveEvent) => {
                doDrag(moveEvent.clientX, moveEvent.clientY);
            };

            const onMouseUp = () => {
                endDrag();
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // Touch Listeners (Mobile Responsive support)
        player.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                // Prevent scrolling when playing with players on mobile
                e.preventDefault();
                startDrag(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: false });

        player.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches.length > 0) {
                e.preventDefault();
                doDrag(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: false });

        player.addEventListener('touchend', (e) => {
            endDrag();
        });
    });

    // Run initial drawings update
    setTimeout(updateTacticalDrawings, 1000);
});
