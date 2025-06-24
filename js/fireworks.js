class Firework {
    constructor(x, y, targetX, targetY, color) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = color || `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.particles = [];
        this.speed = 2;
    }

    update() {
        // 烟花上升逻辑
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 5) {
            this.explode();
            return false; // 标记为可移除
        }
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
        return true;
    }

    explode() {
        // 爆炸粒子效果
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 1;
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color: this.color
            });
        }
    }

    draw(ctx) {
        // 绘制烟花
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // 绘制爆炸粒子
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 2, 2);
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.01;
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                i--;
            }
        }
        ctx.globalAlpha = 1;
    }
}

// 初始化画布
function initFireworks() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks = [];

    // 窗口大小调整时重设画布
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // 点击页面触发烟花
    document.addEventListener('click', (e) => {
        const startX = e.clientX;
        const startY = e.clientY;
        const targetX = Math.random() * canvas.width;
        const targetY = Math.random() * canvas.height / 2;
        fireworks.push(new Firework(startX, startY, targetX, targetY));
    });

    // 动画循环
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < fireworks.length; i++) {
            if (!fireworks[i].update()) {
                fireworks.splice(i, 1);
                i--;
            }
            fireworks[i].draw(ctx);
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// 页面加载后初始化
document.addEventListener('DOMContentLoaded', initFireworks);