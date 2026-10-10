document.addEventListener('DOMContentLoaded', () => {
    const starsContainer = document.getElementById('stars');
    const cursorGlow = document.getElementById('cursorGlow');
    const cursorStar = document.getElementById('cursorStar');
    const card = document.querySelector('.card');

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (starsContainer) {
        const count = window.innerWidth < 600 ? 40 : 80;
        for (let i = 0; i < count; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            const size = Math.random() * 2 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 4 + 's';
            star.style.animationDuration = (Math.random() * 3 + 3) + 's';
            star.style.opacity = Math.random() * 0.6 + 0.2;

            if (Math.random() > 0.8) {
                const hue = [270, 290, 220][Math.floor(Math.random() * 3)];
                star.style.background = `hsl(${hue}, 90%, 82%)`;
                star.style.boxShadow = `0 0 8px hsl(${hue}, 90%, 78%)`;
            }

            starsContainer.appendChild(star);
        }
    }

    if (!isTouch && cursorGlow && cursorStar) {
        let mouseX = -100;
        let mouseY = -100;
        let glowX = -100;
        let glowY = -100;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            document.body.classList.add('cursor-active');

            cursorStar.style.left = mouseX + 'px';
            cursorStar.style.top = mouseY + 'px';

            if (card) {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (mouseX - cx) / rect.width;
                const dy = (mouseY - cy) / rect.height;
                card.style.transform = `perspective(1500px) rotateY(${dx * 1}deg) rotateX(${-dy * 1}deg)`;
            }
        });

        document.querySelectorAll('a, button, .link').forEach(el => {
            el.addEventListener('mouseenter', () => cursorStar.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorStar.classList.remove('hover'));
        });

        document.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-active');
            if (card) card.style.transform = 'perspective(1500px) rotateY(0) rotateX(0)';
        });

        const loop = () => {
            glowX += (mouseX - glowX) * 0.15;
            glowY += (mouseY - glowY) * 0.15;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(loop);
        };
        loop();
    }
});