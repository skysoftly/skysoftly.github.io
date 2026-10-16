
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let height;

let stars = [];
let shootingStars = [];

const CELL_SIZE = 50;

let nextShootingStar = 0;

function random(seed) {
    const value = Math.sin(seed * 12) * 1000;
    return value - Math.floor(value);
}

function createStars() {
    stars = [];

    const columns = Math.ceil(width / CELL_SIZE);
    const rows = Math.ceil(height / CELL_SIZE);

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            const seed = x + y * 10000;

            if (random(seed + 1) > 0.75) continue;

            stars.push({
                x: x * CELL_SIZE + random(seed + 2) * CELL_SIZE,
                y: y * CELL_SIZE + random(seed + 3) * CELL_SIZE,
                size: 0.5 + random(seed + 4) * 1.5,
                phase: random(seed + 5) * Math.PI * 2,
                speed: 0.0004 + random(seed + 6) * 0.001
            });
        }
    }
}

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    createStars();
}

function createShootingStar() {
    shootingStars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.5,
        length: 50 + Math.random() * 70,
        speed: 3 + Math.random() * 3,
        life: 1
    });
}

function drawStars(time) {
    for (const star of stars) {
        const twinkle =
            (Math.sin(time * star.speed + star.phase) + 1) / 2;

        ctx.globalAlpha = 0.2 + twinkle * 0.8;
        ctx.fillStyle = "#d8c5ff";

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;
}

function drawShootingStars() {
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];

        const endX = star.x - star.length;
        const endY = star.y - star.length * 0.5;

        const gradient = ctx.createLinearGradient(
            endX, endY,
            star.x, star.y
        );

        gradient.addColorStop(0, "rgba(190, 160, 255, 0)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.95)");

        ctx.globalAlpha = star.life;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(star.x, star.y);
        ctx.stroke();

        star.x += star.speed;
        star.y += star.speed * 0.5;
        star.life -= 0.012;

        if (star.life <= 0 || star.x > width + 150 ||
            star.y > height + 150) {
            shootingStars.splice(i, 1);
        }
    }

    ctx.globalAlpha = 1;
}

// Главная анимация
function animate(time) {
    ctx.clearRect(0, 0, width, height);

    drawStars(time);
    drawShootingStars();

    if (time > nextShootingStar) {
        createShootingStar();
        nextShootingStar = time + 3000 + Math.random() * 4000;
    }

    requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
requestAnimationFrame(animate);
