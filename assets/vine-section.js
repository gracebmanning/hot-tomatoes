document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tomato = document.querySelector('#detachable-tomato');
    const bottleShape = document.querySelector('.bottle-shape');
    const fireworks = document.querySelectorAll('.firework');

    const stageFall = document.querySelector('.vine-section__stage--fall');
    const stageBottle = document.querySelector('.vine-section__stage--bottle');
    const stagePunch = document.querySelector('.vine-section__stage--punch');

    if (!tomato || !bottleShape || !stageFall || !stageBottle || !stagePunch) return;

    let ticking = false;

    function getStageProgress(stage) {
        const rect = stage.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const stageHeight = rect.height;
        const totalRange = stageHeight - viewportHeight;
        const scrolled = -rect.top;
        return Math.max(0, Math.min(1, scrolled / totalRange));
    }

    function lerpColor(hex1, hex2, t) {
        const c1 = hex1.match(/\w\w/g).map(h => parseInt(h, 16));
        const c2 = hex2.match(/\w\w/g).map(h => parseInt(h, 16));
        const result = c1.map((channel, i) =>
            Math.round(channel + (c2[i] - channel) * t)
        );
        return `rgb(${result.join(',')})`;
    }

    function update() {
        // tomato falls
        const fallProgress = getStageProgress(stageFall);
        const easedFall = fallProgress * fallProgress;
        tomato.style.transform = `translateY(${easedFall * 100}vh) rotate(${easedFall * 45}deg)`;

        // bottle color shift (botanical green → dark wine)
        const bottleProgress = getStageProgress(stageBottle);
        bottleShape.style.fill = lerpColor('2D4A30', '7A1414', bottleProgress);

        // fireworks fade in with stagger
        const punchProgress = getStageProgress(stagePunch);
        fireworks.forEach((firework, index) => {
            const delay = index * 0.15;
            const fireworkProgress = Math.max(0, Math.min(1, (punchProgress - delay) * 2));
            firework.style.opacity = fireworkProgress;
    });

    ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }

    update();

    // Listen to scroll
    window.addEventListener('scroll', onScroll, { passive: true });
});