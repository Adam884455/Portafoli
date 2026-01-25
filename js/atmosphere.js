/**
 * Seamless Ambient Atmosphere + Interactive Mouse Glow
 * Direct RGB interpolation + interactive vibrant cursors.
 */
(function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Background colors (Seamless Loop)
    const bgColors = [
        '#2e0000', '#00002e', '#2e0025', '#002d2e'
    ];

    // Interaction colors (Mouse Glow)
    const mouseColors = [
        '#00a5a8', // Teal
        '#a200a8', // Magenta
        '#d9feff'  // Bright Cyan
    ];

    class Atmosphere {
        constructor() {
            this.time = 0;
            this.currentIndex = 0;
            this.transition = 0;
            this.speed = 0.003;

            this.mouse = { x: -100, y: -100 };
            this.mouseBlobs = [];

            this.init();
        }

        init() {
            canvas.id = 'atmosphere-canvas';
            Object.assign(canvas.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                zIndex: '-1',
                pointerEvents: 'none',
                filter: 'blur(50px) brightness(130%) contrast(120%)',
                opacity: '1'
            });
            document.body.appendChild(canvas);

            this.width = 40;
            this.height = Math.round(40 * (window.innerHeight / window.innerWidth));
            canvas.width = this.width;
            canvas.height = this.height;

            // Initialize mouse blobs (one for each interactive color)
            mouseColors.forEach((color, i) => {
                this.mouseBlobs.push({
                    x: 0, y: 0,
                    targetX: 0, targetY: 0,
                    size: 2 + i * 1.5, // MUCH smaller (was 10+i*5)
                    color: color,
                    delay: 0.04 + i * 0.04 // Smoother lag
                });
            });

            window.addEventListener('mousemove', (e) => {
                this.mouse.x = (e.clientX / window.innerWidth) * this.width;
                this.mouse.y = (e.clientY / window.innerHeight) * this.height;
            });

            this.animate();
        }

        hexToRgb(hex) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return { r, g, b };
        }

        animate() {
            // 1. Background Seamless Loop
            this.transition += this.speed;
            if (this.transition >= 1) {
                this.transition = 0;
                this.currentIndex = (this.currentIndex + 1) % bgColors.length;
            }

            const nextIndex = (this.currentIndex + 1) % bgColors.length;
            const c1 = this.hexToRgb(bgColors[this.currentIndex]);
            const c2 = this.hexToRgb(bgColors[nextIndex]);

            const r = Math.round(c1.r + (c2.r - c1.r) * this.transition);
            const g = Math.round(c1.g + (c2.g - c1.g) * this.transition);
            const b = Math.round(c1.b + (c2.b - c1.b) * this.transition);

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(0, 0, this.width, this.height);

            // 2. Interactive Mouse Glow
            ctx.globalCompositeOperation = 'screen'; // Makes mouse colors vibrant on dark bg

            this.mouseBlobs.forEach(blob => {
                // Smoothly follow mouse with delay
                blob.x += (this.mouse.x - blob.x) * blob.delay;
                blob.y += (this.mouse.y - blob.y) * blob.delay;

                const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.size);
                grad.addColorStop(0, blob.color);
                grad.addColorStop(1, 'transparent');

                ctx.fillStyle = grad;
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.arc(blob.x, blob.y, blob.size, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalCompositeOperation = 'source-over';
            requestAnimationFrame(() => this.animate());
        }
    }

    if (document.readyState === 'complete') new Atmosphere();
    else window.addEventListener('load', () => new Atmosphere());
})();
