// Floating Memes with Gravity Interaction
class Meme {
    constructor(canvas, emoji) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.emoji = emoji;
        this.size = Math.random() * 40 + 30; // Random size between 30-70px
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2; // Horizontal velocity
        this.vy = (Math.random() - 0.5) * 2; // Vertical velocity
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        this.opacity = Math.random() * 0.5 + 0.5; // 0.5 to 1.0

        // Physics properties
        this.mass = this.size / 10;
        this.gravity = 0.05;
        this.friction = 0.98;
        this.bounce = 0.7;
    }

    update(mouseX, mouseY, mouseRadius) {
        // Apply gravity
        this.vy += this.gravity;

        // Mouse interaction - gravity pull
        if (mouseX !== null && mouseY !== null) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseRadius) {
                // Pull towards mouse
                const force = (mouseRadius - distance) / mouseRadius;
                const angle = Math.atan2(dy, dx);
                this.vx += Math.cos(angle) * force * 0.5;
                this.vy += Math.sin(angle) * force * 0.5;
            }
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Apply friction
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Update rotation
        this.rotation += this.rotationSpeed;

        // Boundary collision detection
        // Bottom
        if (this.y + this.size > this.canvas.height) {
            this.y = this.canvas.height - this.size;
            this.vy *= -this.bounce;
            this.vx *= 0.95; // Slow down horizontal movement on bounce
        }

        // Top
        if (this.y - this.size < 0) {
            this.y = this.size;
            this.vy *= -this.bounce;
        }

        // Right
        if (this.x + this.size > this.canvas.width) {
            this.x = this.canvas.width - this.size;
            this.vx *= -this.bounce;
        }

        // Left
        if (this.x - this.size < 0) {
            this.x = this.size;
            this.vx *= -this.bounce;
        }
    }

    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.rotation);
        this.ctx.font = `${this.size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Add glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = 'rgba(0, 245, 255, 0.5)';

        this.ctx.fillText(this.emoji, 0, 0);
        this.ctx.restore();
    }
}

class MemeManager {
    constructor() {
        this.canvas = document.getElementById('meme-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.memes = [];
        this.mouseX = null;
        this.mouseY = null;
        this.mouseRadius = 150;

        // Meme emojis related to terminal errors and programming
        this.memeEmojis = [
            '😱', '💀', '🤦', '🤷', '😭', '🔥', '💥', '⚠️',
            '🐛', '🚨', '❌', '💩', '😤', '😵', '🤯', '😬',
            '🥴', '😩', '🤬', '💔', '⚡', '🌪️', '🎭', '🤡'
        ];

        this.init();
    }

    init() {
        this.resizeCanvas();
        this.createMemes(20); // Create 20 floating memes

        // Event listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        window.addEventListener('mouseleave', () => this.clearMouse());

        // Start animation loop
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createMemes(count) {
        for (let i = 0; i < count; i++) {
            const emoji = this.memeEmojis[Math.floor(Math.random() * this.memeEmojis.length)];
            this.memes.push(new Meme(this.canvas, emoji));
        }
    }

    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    handleTouchMove(e) {
        if (e.touches.length > 0) {
            this.mouseX = e.touches[0].clientX;
            this.mouseY = e.touches[0].clientY;
        }
    }

    clearMouse() {
        this.mouseX = null;
        this.mouseY = null;
    }

    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw all memes
        this.memes.forEach(meme => {
            meme.update(this.mouseX, this.mouseY, this.mouseRadius);
            meme.draw();
        });

        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MemeManager();
    });
} else {
    new MemeManager();
}
