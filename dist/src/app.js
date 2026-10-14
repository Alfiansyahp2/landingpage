const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const flow = $('#project-flow');
const rail = $('#section-rail');
const progress = $('#reading-progress');
const dialog = $('#concept-dialog');
const dialogBody = $('#dialog-body');
const dialogCount = $('#dialog-count');
const mobileMenu = $('.mobile-menu');
const menuToggle = $('.menu-toggle');
const toast = $('#toast');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const hoverPointer = matchMedia('(hover: hover) and (pointer: fine)');

let projects = [];
let scenes = [];
let activeIndex = 0;
let scrollFrame = 0;
let toastTimer;

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);

const previewPaths = new Set(['/preview/fnb/', '/preview/retail/', '/preview/industry/', '/preview/profile/']);

function safeExternalUrl(value) {
    try {
        const url = new URL(String(value));
        return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
    } catch { return null; }
}

function safeCoverUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
        const url = new URL(value, window.location.origin);
        if (url.username || url.password || (url.protocol !== 'https:' && url.origin !== window.location.origin)) return null;
        return url.origin === window.location.origin ? `${url.pathname}${url.search}${url.hash}` : url.href;
    } catch { return null; }
}

function artMarkup(visual) {
    if (visual === 'food') return '<div class="art-food"><span class="plate plate-back"></span><span class="plate plate-main"><i></i></span><span class="food-leaf leaf-one"></span><span class="food-leaf leaf-two"></span><span class="steam steam-one"></span><span class="steam steam-two"></span></div>';
    if (visual === 'retail') return '<div class="art-retail"><span class="retail-plinth plinth-back"></span><span class="retail-product"></span><span class="retail-plinth plinth-front"></span><i class="retail-glint"></i></div>';
    if (visual === 'industry') return '<div class="art-industry"><span class="industry-orbit orbit-a"></span><span class="industry-orbit orbit-b"></span><span class="industry-core"></span><span class="industry-grid"></span></div>';
    return '<div class="art-profile"><span class="profile-orb"></span><span class="profile-tile tile-a"></span><span class="profile-tile tile-b"></span><span class="profile-tile tile-c"></span><span class="profile-index">01<br />—<br />04</span></div>';
}

function miniPage(project) {
    const coverUrl = safeCoverUrl(project.cover);
    if (coverUrl) {
        return `<div class="mock-cover-wrap"><img class="mock-cover" src="${escapeHtml(coverUrl)}" alt="Screenshot yang disediakan untuk konsep ${escapeHtml(project.category)}" loading="lazy" /></div>`;
    }

    const [lineOne, lineTwo] = project.headline.split('\n');
    return `<div class="mock-page-body mock-${escapeHtml(project.visual)}">
      <div class="mock-copy"><span class="mock-overline">${escapeHtml(project.category)} · LANDING PAGE CONCEPT</span><h3>${escapeHtml(lineOne)}<br /><em>${escapeHtml(lineTwo)}</em></h3><span class="mock-cta" aria-hidden="true">${escapeHtml(project.cta)} <b>↗</b></span></div>
      <div class="mock-art" aria-hidden="true">${artMarkup(project.visual)}</div>
      <span class="mock-corner-note" aria-hidden="true">AN EXPLORATION<br />OF DIGITAL FORM</span>
    </div>`;
}

function renderProject(project, index) {
    const liveUrl = safeExternalUrl(project.url);
    const previewPath = previewPaths.has(project.previewPath) ? project.previewPath : null;
    const detailButton = `<button class="project-detail-action" type="button" data-open-concept="${escapeHtml(project.slug)}">RINGKASAN KONSEP ↗</button>`;
    const previewAction = previewPath ? `<a class="project-action" href="${escapeHtml(previewPath)}">BUKA LIVE PREVIEW <span>↗</span></a>` : '';
    const liveAction = liveUrl ? `<a class="project-action" href="${escapeHtml(liveUrl)}" target="_blank" rel="noopener noreferrer">BUKA SITUS ASLI <span>↗</span></a>` : '';
    const action = `${previewAction}${liveAction}${detailButton}`;

    return `<section class="project-scene theme-${escapeHtml(project.visual)}${index === 0 ? ' is-active' : ''}" id="scene-${escapeHtml(project.slug)}" data-scene-index="${index}" data-theme="${escapeHtml(project.visual)}" style="--project-accent:${escapeHtml(project.accent)}" aria-labelledby="title-${escapeHtml(project.slug)}">
    <div class="scene-topline"><span>${escapeHtml(project.label)} / ${String(index + 1).padStart(2, '0')}—${String(projects.length).padStart(2, '0')}</span><span class="concept-status"><i></i>${escapeHtml(project.status)}</span></div>
    <div class="scene-layout">
      <div class="scene-copy">
        <p class="scene-category"><span class="category-index">${String(index + 1).padStart(2, '0')}</span>${escapeHtml(project.category)}</p>
        <h2 id="title-${escapeHtml(project.slug)}">${escapeHtml(project.title)}</h2>
        <p class="scene-description">${escapeHtml(project.description)}</p>
        <div class="scene-actions">${action}<span class="scene-scroll-hint">SCROLL UNTUK MELANJUTKAN <b>↓</b></span></div>
      </div>
      <div class="scene-visual" data-visual-index="${index}" aria-label="Preview konseptual kategori ${escapeHtml(project.category)}">
        <div class="scene-aura" aria-hidden="true"></div>
        <div class="scene-orbit orbit-a" aria-hidden="true"></div><div class="scene-orbit orbit-b" aria-hidden="true"></div>
        <div class="floating-label label-top" aria-hidden="true"><i></i> VISUAL STUDY <span>0${index + 1}</span></div>
        <div class="browser-shell">
          <div class="mock-browser-bar"><div class="browser-dots"><i></i><i></i><i></i></div><span class="browser-url"><i></i>${escapeHtml(project.slug)}.concept</span><span class="browser-menu" aria-hidden="true">•••</span></div>
          <div class="mock-site-nav"><b>${escapeHtml(project.brand)}</b><span>${escapeHtml(project.category)}</span><span class="mock-nav-cta" aria-hidden="true">${escapeHtml(project.cta)} ↗</span></div>
          ${miniPage(project)}
          <div class="mock-browser-footer"><span>${escapeHtml(project.label)} · PREVIEW ILUSTRATIF</span><span>01 / 01</span></div>
        </div>
        <div class="floating-label label-bottom" aria-hidden="true"><span>CSS 3D · SCROLL STUDY</span><i>✳</i></div>
        <span class="scene-index-watermark" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
      </div>
    </div>
    <div class="scene-bottomline"><span>ARAH VISUAL — ${escapeHtml(project.category)}</span><span>${escapeHtml(project.status)} <i aria-hidden="true">·</i> LINK LIVE MENYUSUL</span></div>
  </section>`;
}

function renderRail() {
    rail.innerHTML = projects.map((project, index) => `<a class="rail-step${index === 0 ? ' is-active' : ''}" href="#scene-${escapeHtml(project.slug)}" aria-label="Ke konsep ${escapeHtml(project.category)}" aria-current="${index === 0 ? 'step' : 'false'}"><span>${String(index + 1).padStart(2, '0')}</span><i></i></a>`).join('');
    rail.hidden = projects.length === 0;
}

function openConcept(slug) {
    const index = projects.findIndex(project => project.slug === slug);
    const project = projects[index];
    if (!project) return;

    dialogCount.textContent = `KONSEP ${String(index + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
    const previewPath = previewPaths.has(project.previewPath) ? project.previewPath : null;
    const liveUrl = safeExternalUrl(project.url);
    const previewLink = previewPath ? `<a class="dialog-link" href="${escapeHtml(previewPath)}">BUKA LIVE PREVIEW <span>↗</span></a>` : '';
    const liveLink = liveUrl ? `<a class="dialog-link" href="${escapeHtml(liveUrl)}" target="_blank" rel="noopener noreferrer">BUKA SITUS ASLI <span>↗</span></a>` : '<p class="dialog-note">URL eksternal asli belum tersedia. Halaman yang bisa dijelajahi adalah preview konsep internal.</p>';
    const screenshotNote = safeCoverUrl(project.cover) ? '<p class="dialog-note">Preview memakai screenshot yang disediakan untuk halaman ini.</p>' : '<p class="dialog-note">Saat materi asli tersedia, copy dan visual konsep ini dapat disesuaikan.</p>';

    dialogBody.innerHTML = `<p class="eyebrow"><i></i>${escapeHtml(project.category)} · ${escapeHtml(project.status)}</p><h2 id="concept-dialog-title">${escapeHtml(project.title)}</h2><p>${escapeHtml(project.description)}</p><div class="dialog-actions">${liveLink}${screenshotNote}</div>`;
    dialog.showModal();
    document.body.classList.add('dialog-open');
}

function setActive(index) {
    if (index < 0 || index >= projects.length || index === activeIndex) return;
    activeIndex = index;
    scenes.forEach((scene, sceneIndex) => scene.classList.toggle('is-active', sceneIndex === index));
    $$('.rail-step', rail).forEach((step, stepIndex) => {
        step.classList.toggle('is-active', stepIndex === index);
        step.setAttribute('aria-current', stepIndex === index ? 'step' : 'false');
    });
}

function updateScroll() {
    scrollFrame = 0;
    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    progress.style.setProperty('--read-progress', `${(window.scrollY / maxScroll) * 100}%`);

    if (!reducedMotion.matches) {
        const viewportCenter = window.innerHeight * 0.52;
        let closest = { distance: Infinity, index: 0 };
        scenes.forEach((scene, index) => {
            const rect = scene.getBoundingClientRect();
            const sceneCenter = rect.top + rect.height * 0.5;
            const distance = Math.abs(viewportCenter - sceneCenter);
            if (distance < closest.distance) closest = { distance, index };
            const within = Math.max(0, Math.min(1, 1 - distance / (window.innerHeight * 0.98)));
            const tiltY = (0.5 - within) * 14;
            const tiltX = (1 - within) * 7;
            const shiftX = (0.5 - within) * 34;
            scene.style.setProperty('--scroll-progress', within.toFixed(3));
            scene.style.setProperty('--scroll-tilt-y', `${tiltY.toFixed(2)}deg`);
            scene.style.setProperty('--scroll-tilt-x', `${tiltX.toFixed(2)}deg`);
            scene.style.setProperty('--scroll-shift-x', `${shiftX.toFixed(2)}px`);
            scene.style.setProperty('--scroll-scale', (0.955 + within * 0.045).toFixed(3));
            scene.style.setProperty('--aura-opacity', (0.32 + within * 0.3).toFixed(3));
        });
        if (closest.distance < window.innerHeight * 0.7) setActive(closest.index);
        rail.classList.toggle('is-visible', closest.distance < window.innerHeight * 0.7);
    } else {
        const viewportCenter = window.innerHeight * 0.5;
        let nearest = { distance: Infinity, index: 0 };
        scenes.forEach((scene, index) => {
            const rect = scene.getBoundingClientRect();
            const distance = Math.abs(rect.top + rect.height * 0.5 - viewportCenter);
            if (distance < nearest.distance) nearest = { distance, index };
        });
        setActive(nearest.index);
        rail.classList.toggle('is-visible', nearest.distance < window.innerHeight * 0.7);
    }
}

function requestScrollUpdate() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
}

function setMenu(open) {
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.inert = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    document.body.classList.toggle('menu-open', open);
}

function bindPointerTilt() {
    if (!hoverPointer.matches || reducedMotion.matches) return;
    scenes.forEach(scene => {
        const visual = $('.scene-visual', scene);
        visual.addEventListener('pointermove', event => {
            const rect = visual.getBoundingClientRect();
            const nx = (event.clientX - rect.left) / rect.width - 0.5;
            const ny = (event.clientY - rect.top) / rect.height - 0.5;
            scene.style.setProperty('--pointer-tilt-x', `${(-ny * 5).toFixed(2)}deg`);
            scene.style.setProperty('--pointer-tilt-y', `${(nx * 7).toFixed(2)}deg`);
        });
        visual.addEventListener('pointerleave', () => {
            scene.style.setProperty('--pointer-tilt-x', '0deg');
            scene.style.setProperty('--pointer-tilt-y', '0deg');
        });
    });
}

function announce(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3600);
}

async function init() {
    try {
        let response = await fetch('/data/projects.json');
        if (!response.ok) {
            response = await fetch('/data/project.json');
        }
        if (!response.ok) throw new Error(`Project data returned ${response.status}`);
        projects = await response.json();
        flow.innerHTML = projects.map(renderProject).join('');
        scenes = $$('.project-scene', flow);
        renderRail();
        flow.setAttribute('aria-busy', 'false');
        bindPointerTilt();
        requestScrollUpdate();
    } catch (error) {
        console.error('Gagal memuat galeri konsep:', error);
        flow.innerHTML = '<p class="loading-state">Galeri belum bisa dimuat. Silakan segarkan halaman.</p>';
        flow.setAttribute('aria-busy', 'false');
    }

    flow.addEventListener('click', event => {
        const button = event.target.closest('[data-open-concept]');
        if (button) openConcept(button.dataset.openConcept);
    });

    rail.addEventListener('click', event => {
        const step = event.target.closest('.rail-step');
        if (!step) return;
        const target = document.querySelector(step.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
    });

    document.addEventListener('click', event => {
        if (event.target.closest('[data-close-dialog]')) dialog.close();
        if (event.target.closest('.concept-dialog .brand-lockup') && dialog.open) dialog.close();
        const internalLink = event.target.closest('a[href^="#"]');
        if (internalLink && mobileMenu.classList.contains('is-open')) setMenu(false);
    });

    dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
    dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
    });

    menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
    $$('.mobile-menu a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', requestScrollUpdate, { passive: true });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') setMenu(false);
        if (dialog.open || document.body.classList.contains('menu-open') || reducedMotion.matches) return;
        if (event.key === 'ArrowDown' && activeIndex < scenes.length - 1) scenes[activeIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (event.key === 'ArrowUp' && activeIndex > 0) scenes[activeIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    reducedMotion.addEventListener?.('change', () => {
        if (reducedMotion.matches) scenes.forEach(scene => {
            scene.style.setProperty('--scroll-tilt-x', '0deg');
            scene.style.setProperty('--scroll-tilt-y', '0deg');
            scene.style.setProperty('--scroll-shift-x', '0px');
            scene.style.setProperty('--pointer-tilt-x', '0deg');
            scene.style.setProperty('--pointer-tilt-y', '0deg');
        });
        requestScrollUpdate();
    });
}

init();
