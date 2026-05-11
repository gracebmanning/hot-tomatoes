document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tomato = document.querySelector('#detachable-tomato');
    const bottleShape = document.querySelector('.bottle-shape');
    const thermometer = document.querySelector('.thermometer-shape');
    const fireworks = document.querySelectorAll('.firework');
    const punchHeading = document.querySelector('.vine-section__heading--punch');

    const stageFall = document.querySelector('.vine-section__stage--fall');
    const stageBottle = document.querySelector('.vine-section__stage--bottle');

    if (!tomato || !bottleShape || !thermometer || !punchHeading || !stageFall || !stageBottle) return;

    const FALL_DISTANCE_VH = 120;
    const MAX_ROTATION = 45;

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

    function remap(value, inMin, inMax) {
        return Math.max(0, Math.min(1, (value - inMin) / (inMax - inMin)));
    }

    function update() {
        // tomato falls
        const fallProgress = getStageProgress(stageFall);
        const easedFall = fallProgress * fallProgress;
        tomato.style.transform = `translateY(${easedFall * FALL_DISTANCE_VH}vh) rotate(${easedFall * MAX_ROTATION}deg)`;

        const bottleProgress = getStageProgress(stageBottle);

        // bottle color shifts during 0.0 -> 0.5 of stage
        const colorProgress = remap(bottleProgress, 0, 0.5);
        bottleShape.style.fill = lerpColor('2D4A30', '7A1414', colorProgress);

        // thermometer fades in during 0.4 -> 0.7 of stage
        const thermometerProgress = remap(bottleProgress, 0.4, 0.7);
        thermometer.style.opacity = thermometerProgress;

        // fireworks fade in during 0.4 -> 0.7 of stage
        fireworks.forEach((firework, index) => {
            const fireworkStart = 0.4 + index * 0.05;
            const fireworkEnd = fireworkStart + 0.15;
            const fireworkProgress = remap(bottleProgress, fireworkStart, fireworkEnd);
            firework.style.opacity = fireworkProgress;
        });

        // punch heading fades in during 0.6 -> 1.0 of stage
        const headingProgress = remap(bottleProgress, 0.6, 1.0);
        punchHeading.style.opacity = headingProgress;

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