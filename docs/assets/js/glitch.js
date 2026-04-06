// Glitch Effect for Text
class GlitchEffect {
    constructor() {
        this.glitchElements = document.querySelectorAll('.glitch');
        this.init();
    }

    init() {
        // Add random glitch effect every few seconds
        setInterval(() => {
            this.triggerGlitch();
        }, 5000 + Math.random() * 5000); // Random interval between 5-10 seconds
    }

    triggerGlitch() {
        this.glitchElements.forEach(element => {
            element.classList.add('glitching');
            setTimeout(() => {
                element.classList.remove('glitching');
            }, 300);
        });
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect on scroll
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    // Move the grid background at different speeds
    document.body.style.backgroundPosition = `${currentScrollY * 0.1}px ${currentScrollY * 0.1}px`;

    lastScrollY = currentScrollY;
});

// Initialize glitch effect
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GlitchEffect();
    });
} else {
    new GlitchEffect();
}

// Add keyboard interaction for fun
document.addEventListener('keydown', (e) => {
    // Easter egg: Press 'F' to add more memes
    if (e.key.toLowerCase() === 'f') {
        const event = new CustomEvent('addMoreMemes');
        document.dispatchEvent(event);
    }
});

// Console easter egg
console.log('%c🔊 Terminal Meme Error Sounds', 'font-size: 20px; color: #00f5ff; font-weight: bold; text-shadow: 0 0 10px #00f5ff;');
console.log('%cDetected a curious developer! 🕵️', 'font-size: 14px; color: #ff006e;');
console.log('%cPress "F" to add more floating memes!', 'font-size: 12px; color: #ffbe0b;');
console.log('%cRepository: https://github.com/0xasr-dev/terminal-meme-error-sounds', 'font-size: 10px; color: #00ff00;');
