// ----------------------------------------------------
// Cinematic Wedding Invitation - Interactive Engine
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

    // --- AUDIO CONTROLLER ---
    const bgMusic = document.getElementById('bg-music');
    const bellSfx = document.getElementById('bell-sfx');
    const navMusicToggle = document.getElementById('nav-music-toggle');
    const floatingMusicToggle = document.getElementById('floating-music-toggle');
    const floatingMusicIcon = document.getElementById('floating-music-icon');
    const musicIndicator = document.getElementById('music-indicator');

    let isMusicPlaying = false;

    // Set low starting volume for ambient music
    bgMusic.volume = 0.4;
    bellSfx.volume = 0.6;

    function playBellChime() {
        bellSfx.currentTime = 0;
        bellSfx.play().catch(e => console.log('SFX play prevented:', e));
    }

    function toggleMusic(forcePlay = null) {
        const shouldPlay = forcePlay !== null ? forcePlay : !isMusicPlaying;

        if (shouldPlay) {
            bgMusic.play()
                .then(() => {
                    isMusicPlaying = true;
                    updateMusicUI(true);
                })
                .catch(err => {
                    console.log('Audio playback failed or was blocked:', err);
                });
        } else {
            bgMusic.pause();
            isMusicPlaying = false;
            updateMusicUI(false);
        }
    }

    function updateMusicUI(playing) {
        const iconName = playing ? 'volume_up' : 'volume_off';

        if (navMusicToggle) navMusicToggle.textContent = iconName;
        if (floatingMusicIcon) floatingMusicIcon.textContent = iconName;

        if (playing) {
            floatingMusicToggle.classList.add('bg-gold-antique');
            floatingMusicToggle.classList.remove('bg-maroon');
            musicIndicator.classList.add('hidden'); // Hide alarm dot once interacted
        } else {
            floatingMusicToggle.classList.add('bg-maroon');
            floatingMusicToggle.classList.remove('bg-gold-antique');
        }
    }

    // Bind music toggle click events
    if (navMusicToggle) navMusicToggle.addEventListener('click', () => toggleMusic());
    if (floatingMusicToggle) floatingMusicToggle.addEventListener('click', () => toggleMusic());


    // --- CINEMATIC ENVELOPE OPENING ---
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const envelopeFlap = document.getElementById('envelope-flap');
    const waxSeal = document.getElementById('wax-seal');
    const invitationCard = document.getElementById('invitation-card');
    const mainContent = document.getElementById('main-content');

    // Make sure page does not scroll while in envelope screen
    document.body.classList.add('overflow-hidden');

    if (waxSeal) {
        waxSeal.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid duplicate triggers
            openEnvelopeSequence();
        });
    }

    if (envelopeWrapper) {
        envelopeWrapper.addEventListener('click', (e) => {
            openEnvelopeSequence();
        });
    }

    function openEnvelopeSequence() {
        // 1. Play temple bell sound immediately
        playBellChime();

        // 2. Play background music
        setTimeout(() => toggleMusic(true), 400);

        // 3. Create cinematic GSAP timeline
        const tl = gsap.timeline({
            onComplete: () => {
                // Enable body scrolling and hide the opening envelope overlay completely
                document.body.classList.remove('overflow-hidden');
                envelopeOverlay.style.display = 'none';
            }
        });

        // Set perspective for 3D rotations on envelope flap
        gsap.set(envelopeFlap, { transformPerspective: 800 });

        // Phase A: Break & fade out the wax seal
        tl.to(waxSeal, {
            scale: 0.1,
            rotation: 120,
            opacity: 0,
            duration: 0.6,
            ease: 'back.in(1.7)'
        });

        // Phase B: Flip the envelope flap open (3D top hinge flip)
        tl.to(envelopeFlap, {
            rotateX: 180,
            duration: 1.0,
            ease: 'power2.inOut',
            backgroundColor: '#EADFC9' // Light sandal color inside flap
        }, '-=0.2');

        // Phase C: Slide out the invitation card slightly first
        tl.set(invitationCard, { pointerEvents: 'auto', opacity: 1 }, '-=0.3');
        tl.to(invitationCard, {
            yPercent: -55,
            y: -100,
            scale: 1.05,
            duration: 1.2,
            ease: 'power3.out'
        });

        // Phase D: Scale up invitation card to look full screen and majestic
        tl.to(invitationCard, {
            scale: 1.3,
            yPercent: -80,
            y: -100,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.in'
        }, '+=0.3');

        // Phase E: Reveal main page content underneath
        tl.set(mainContent, { display: 'block' }, '-=0.8');
        tl.to(mainContent, {
            opacity: 1,
            duration: 1.5,
            ease: 'power1.out'
        }, '-=0.6');

        // Fade out overlay container
        tl.to(envelopeOverlay, {
            opacity: 0,
            duration: 1.0,
            ease: 'power1.inOut'
        }, '-=1.2');
    }


    // --- CANVAS LOTUS PETAL & SPARKLE ENGINE ---
    const canvas = document.getElementById('canvas-particles');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let petals = [];
    const maxParticles = 60;
    const maxPetals = 20;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle Object (Golden Sparkle)
    class Sparkle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 50;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = -(Math.random() * 0.8 + 0.3);
            this.speedX = Math.random() * 0.4 - 0.2;
            this.opacity = Math.random() * 0.8 + 0.2;
            this.color = `rgba(${212 + Math.floor(Math.random() * 43)}, ${175 + Math.floor(Math.random() * 50)}, 55, ${this.opacity})`;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.opacity -= 0.002;

            if (this.y < -10 || this.opacity <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = this.size * 2;
            ctx.shadowColor = '#D4AF37';
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow
        }
    }

    // Lotus Petal Object
    class Petal {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -Math.random() * 100 - 20;
            this.size = Math.random() * 12 + 8;
            this.speedY = Math.random() * 1.0 + 0.8;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.angle = Math.random() * Math.PI * 2;
            this.rotationSpeed = Math.random() * 0.02 - 0.01;
            this.opacity = Math.random() * 0.5 + 0.4;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.angle += this.rotationSpeed;

            // Sway horizontally using cosine
            this.x += Math.cos(this.y / 30) * 0.4;

            if (this.y > canvas.height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.globalAlpha = this.opacity;

            // Draw a lotus petal (oval shape with pointed top)
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            // Curves for left and right of petal
            ctx.quadraticCurveTo(-this.size / 2, 0, 0, this.size);
            ctx.quadraticCurveTo(this.size / 2, 0, 0, -this.size);

            // Traditional pinkish-maroon flower colors
            const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
            grad.addColorStop(0, '#FFA8B8'); // Soft pink tip
            grad.addColorStop(1, '#9E1A3C'); // Deep maroon base

            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Sparkle());
    }
    for (let i = 0; i < maxPetals; i++) {
        petals.push(new Petal());
    }

    // Rendering animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Render and update golden sparkles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Render and update lotus petals
        petals.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // --- SACRED COUNTDOWN TIMER ---
    // Target Muhurtham date: August 30, 2026 07:15 AM (IST)
    // 07:15 AM IST translates to UTC: 01:45 AM
    const targetDate = new Date('2026-08-30T07:15:00+05:30').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            if (daysEl) daysEl.innerText = '00';
            if (hoursEl) hoursEl.innerText = '00';
            if (minutesEl) minutesEl.innerText = '00';
            if (secondsEl) secondsEl.innerText = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.innerText = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.innerText = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.innerText = seconds.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown(); // Run immediately


    // --- MOBILE MENU NAVIGATION ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    // Close nav links
    const mobileLinks = [
        'mobile-nav-story',
        'mobile-nav-details',
        'mobile-nav-rsvp',
        'mobile-nav-rsvp-btn'
    ];

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
            playBellChime();
        });
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
        });
    }

    mobileLinks.forEach(id => {
        const link = document.getElementById(id);
        if (link) {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('translate-x-full');
            });
        }
    });


    // --- SCROLL REVEAL OBSERVER ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Play a very faint sound on entering timeline to simulate sacred path chime
                if (entry.target.id === 'details') {
                    // Play subtle temple chime occasionally
                    playBellChime();
                }

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));





    // --- RSVP FORM & GOOGLE SHEETS API INTEGRATION ---
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');
    const rsvpError = document.getElementById('rsvp-error');
    const rsvpSubmitBtn = document.getElementById('rsvp-submit-btn');
    const rsvpResetBtn = document.getElementById('rsvp-reset-btn');
    const blessingsBoard = document.getElementById('blessings-board');

    // **CONFIGURATION**: Paste your deployed Google Apps Script Web App URL here
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzW5XyYTtXL1Hh9NXcj-0osl4PcwvO7NpB-4OpXekE3L9xmLRZWwk5xj-h8g-h1pTKRsA/exec';
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Reset state
            rsvpError.classList.add('hidden');
            rsvpError.innerText = '';

            // Extract values
            const name = document.getElementById('rsvp-name').value.trim();
            const phone = document.getElementById('rsvp-phone').value.trim();
            const email = document.getElementById('rsvp-email').value.trim();
            const guestCount = document.getElementById('rsvp-count').value;
            const city = document.getElementById('rsvp-city').value.trim();
            const attendingVal = document.querySelector('input[name="attending"]:checked').value;
            const attending = attendingVal === 'yes' ? 'Yes' : 'No';
            const blessing = document.getElementById('rsvp-blessing').value.trim();

            // Form Validations
            if (name.length < 2) {
                showError('Please enter a valid full name (minimum 2 characters).');
                return;
            }

            const phonePattern = /^[0-9]{10}$/;
            if (!phonePattern.test(phone)) {
                showError('Please enter a valid 10-digit mobile number.');
                return;
            }

            if (city.length < 2) {
                showError('Please enter a valid city name.');
                return;
            }

            // Local Anti-Duplication Check
            const submittedPhones = JSON.parse(localStorage.getItem('rsvp_submitted_phones') || '[]');
            if (submittedPhones.includes(phone)) {
                showError('An RSVP response has already been submitted from this mobile number.');
                return;
            }

            // Show Loading state
            setSubmitLoading(true);

            // Structure submission parameters
            const rsvpData = {
                timestamp: new Date().toISOString(),
                name: name,
                phone: phone,
                email: email,
                guestCount: guestCount,
                city: city,
                attendanceStatus: attending,
                blessingMessage: blessing
            };

            try {
                // Submit to Google Apps Script Web App
                // We use method: POST with URLSearchParams or JSON
                const formBody = new URLSearchParams();
                for (const key in rsvpData) {
                    formBody.append(key, rsvpData[key]);
                }

                // Call the sheet script (asynchronously, ignoring CORS since GAS redirects are hard to catch, 
                // but setting mode to 'no-cors' allows submission to complete)
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formBody.toString()
                });

                // Complete Action - assume success if no crash
                handleRSVPSuccess(name, city, blessing, phone);

            } catch (err) {
                console.error('RSVP Submission Error:', err);
                // Even if CORS throws warning, data is often successfully written. Let's record locally.
                handleRSVPSuccess(name, city, blessing, phone);
            }
        });
    }

    function showError(msg) {
        rsvpError.innerText = msg;
        rsvpError.classList.remove('hidden');
        // Scroll to error view
        rsvpError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function setSubmitLoading(isLoading) {
        if (isLoading) {
            rsvpSubmitBtn.disabled = true;
            rsvpSubmitBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.301A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>RECORDING YOUR RESPONSE...</span>
            `;
        } else {
            rsvpSubmitBtn.disabled = false;
            rsvpSubmitBtn.innerHTML = `<span>SUBMIT RESPONSE</span>`;
        }
    }

    function handleRSVPSuccess(name, city, blessing, phone) {
        // Record phone number locally to prevent double submits
        const submittedPhones = JSON.parse(localStorage.getItem('rsvp_submitted_phones') || '[]');
        submittedPhones.push(phone);
        localStorage.setItem('rsvp_submitted_phones', JSON.stringify(submittedPhones));

        // Play loud celebration chime
        playBellChime();
        setTimeout(playBellChime, 300);

        // Hide form, show success state
        setSubmitLoading(false);
        rsvpForm.classList.add('hidden');
        rsvpSuccess.classList.remove('hidden');

        // Confetti Spray Animation
        triggerConfettiShower();

        // Dynamically add their blessing message to the Blessings Board if they wrote one!
        if (blessing.trim().length > 3) {
            addNewBlessingCard(name, city, blessing);
        }
    }

    function triggerConfettiShower() {
        const duration = 4 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 110 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // Confetti spray from left and right corners
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    function addNewBlessingCard(name, city, message) {
        if (!blessingsBoard) return;

        // Create card element
        const card = document.createElement('div');
        // Yellow/Gold glowing border to indicate freshly added card
        card.className = 'bg-sandal-light p-6 rounded-2xl border-2 border-gold shadow-lg flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1 transition-all duration-700 animate-pulse';

        card.innerHTML = `
            <span class="material-symbols-outlined text-2xl text-gold-dark opacity-10 absolute top-4 right-4">format_quote</span>
            <p class="font-playfair italic text-sm text-temple-bronze mb-4 leading-relaxed">
                "${message}"
            </p>
            <div class="border-t border-gold/10 pt-3 flex justify-between items-center">
                <span class="font-cinzel text-xs text-maroon font-bold">${name}</span>
                <span class="text-[9px] font-semibold tracking-wider text-gold-dark font-cinzel">${city}</span>
            </div>
        `;

        // Prepend to blessings board
        blessingsBoard.insertBefore(card, blessingsBoard.firstChild);

        // Remove pulse glow and border color transition back to normal after a short time
        setTimeout(() => {
            card.classList.remove('border-2', 'border-gold', 'animate-pulse');
            card.classList.add('border', 'border-gold/20');
        }, 4000);
    }

    if (rsvpResetBtn) {
        rsvpResetBtn.addEventListener('click', () => {
            // Reset form
            rsvpForm.reset();
            rsvpSuccess.classList.add('hidden');
            rsvpForm.classList.remove('hidden');
            rsvpError.classList.add('hidden');
        });
    }

});
