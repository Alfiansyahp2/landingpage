import * as THREE from 'three';
import { animate, createTimeline } from 'animejs';
import 'animejs/adapters/three';
import { createTracks } from './world-shared.js';
import { createFnbWorld } from './worlds/fnb.js';
import { createRetailWorld } from './worlds/retail.js';
import { createIndustryWorld } from './worlds/industry.js';
import { createProfileWorld } from './worlds/profile.js';

const factories = {
    fnb: createFnbWorld,
    retail: createRetailWorld,
    industry: createIndustryWorld,
    profile: createProfileWorld
};

const body = document.body;
const theme = body.dataset.preview;
const canvas = document.querySelector('#story-canvas');
const storyJourney = document.querySelector('[data-story-journey]');
const chapters = [...document.querySelectorAll('[data-story-step]')];
const chapterLinks = [...document.querySelectorAll('[data-chapter-link]')];
const progressBar = document.querySelector('[data-story-progress]');
const progressReadout = document.querySelector('[data-story-current]');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let chapterObserver = null;
let revealObserver = null;
let progressFrame = 0;

if (canvas && factories[theme]) {
    let renderer;
    let world;
    let retailFinishListener;
    let timeline;
    let duration = 0;
    let renderFrame = 0;
    let isVisible = true;
    let activeChapter = 0;

    try {
        world = factories[theme]();
        if (theme === 'retail') {
            const initialFinish = document.querySelector('[data-finish][aria-pressed="true"]')?.dataset.finish;
            if (initialFinish) world.setFinish?.(initialFinish);
            retailFinishListener = event => {
                if (world.setFinish?.(event.detail?.finish)) scheduleRender();
            };
            document.addEventListener('retail:finish-change', retailFinishListener);
        }
        renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: window.devicePixelRatio < 2,
            powerPreference: 'low-power',
            preserveDrawingBuffer: false
        });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        renderer.setClearColor(0x000000, 0);

        timeline = createTimeline({
            autoplay: false,
            defaults: { duration: 1050, ease: 'inOutSine' }
        });
        duration = createTracks(timeline, world, world.stops, world.actors, 1050);
        timeline.seek(0, true);
    } catch (error) {
        document.documentElement.dataset.world = 'fallback';
        body.dataset.worldReady = 'fallback';
        console.info(`Scene 3D ${theme} memakai fallback visual karena WebGL tidak tersedia.`, error?.message || '');
    }

    const clamp = (number, min, max) => Math.max(min, Math.min(max, number));

    function resizeWorld() {
        if (!renderer || !world) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const compact = width < 760;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.65));
        renderer.setSize(width, height, false);
        world.camera.aspect = width / Math.max(1, height);
        world.camera.fov = compact ? 43 : 36;
        world.camera.updateProjectionMatrix();
        world.root.position.x = compact ? 0 : world.desktopOffset;
        scheduleRender();
    }

    function journeyProgress() {
        if (!storyJourney) return 0;
        const pageTop = window.scrollY + storyJourney.getBoundingClientRect().top;
        const travel = Math.max(1, storyJourney.offsetHeight - window.innerHeight);
        return clamp((window.scrollY - pageTop + window.innerHeight * 0.16) / travel, 0, 1);
    }

    function draw() {
        renderFrame = 0;
        if (!renderer || !world || !isVisible || document.visibilityState !== 'visible') return;

        if (!reducedMotion.matches && timeline) {
            timeline.seek(duration * journeyProgress(), true);
        }
        world.camera.lookAt(world.focus);
        renderer.render(world.scene, world.camera);
        if (body.dataset.worldReady !== 'true') {
            document.documentElement.dataset.world = 'ready';
            body.dataset.worldReady = 'true';
        }
    }

    function scheduleRender() {
        if (!renderFrame) renderFrame = requestAnimationFrame(draw);
    }

    function updateProgressUI(index = activeChapter) {
        activeChapter = clamp(index, 0, Math.max(chapters.length - 1, 0));
        if (progressReadout) progressReadout.textContent = String(activeChapter + 1).padStart(2, '0');
        if (progressBar) progressBar.style.setProperty('--story-fill', `${chapters.length > 1 ? activeChapter / (chapters.length - 1) * 100 : 100}%`);
        chapterLinks.forEach((link, linkIndex) => {
            if (linkIndex === activeChapter) link.setAttribute('aria-current', 'step');
            else link.removeAttribute('aria-current');
        });
    }

    function animateChapter(element) {
        if (reducedMotion.matches) return;
        animate(element, {
            opacity: [0, 1],
            y: [34, 0],
            rotateX: [3, 0],
            duration: 760,
            ease: 'out(4)'
        });
    }

    function updateChapterFromScroll() {
        if (!chapters.length) return;
        const marker = window.innerHeight * 0.5;
        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;
        chapters.forEach((chapter, index) => {
            const rect = chapter.getBoundingClientRect();
            const distance = marker < rect.top ? rect.top - marker : marker > rect.bottom ? marker - rect.bottom : 0;
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestIndex = index;
            }
        });
        updateProgressUI(nearestIndex);
    }

    function scheduleChapterFromScroll() {
        if (progressFrame) return;
        progressFrame = requestAnimationFrame(() => {
            progressFrame = 0;
            updateChapterFromScroll();
        });
    }

    function observeStory() {
        updateProgressUI(0);
        if ('IntersectionObserver' in window && chapters.length) {
            chapterObserver = new IntersectionObserver(entries => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    const index = chapters.indexOf(entry.target);
                    if (index >= 0) updateProgressUI(index);
                }
            }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
            chapters.forEach(chapter => chapterObserver.observe(chapter));
        } else if (chapters.length) {
            updateChapterFromScroll();
            window.addEventListener('scroll', scheduleChapterFromScroll, { passive: true });
            window.addEventListener('resize', scheduleChapterFromScroll, { passive: true });
        }

        if ('IntersectionObserver' in window) {
            revealObserver = new IntersectionObserver(entries => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    entry.target.classList.add('is-story-revealed');
                    if (entry.target.dataset.storyReveal !== 'static') animateChapter(entry.target);
                    revealObserver.unobserve(entry.target);
                }
            }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
            document.querySelectorAll('[data-story-reveal]').forEach(element => revealObserver.observe(element));
        } else {
            document.querySelectorAll('[data-story-reveal]').forEach(element => element.classList.add('is-story-revealed'));
        }

        window.addEventListener('pagehide', () => {
            chapterObserver?.disconnect();
            revealObserver?.disconnect();
        }, { once: true });
    }

    observeStory();

    if (renderer && world) {
        resizeWorld();

        window.addEventListener('scroll', scheduleRender, { passive: true });
        window.addEventListener('resize', resizeWorld, { passive: true });
        document.addEventListener('visibilitychange', () => {
            isVisible = document.visibilityState === 'visible';
            if (isVisible) scheduleRender();
        });

        if (window.ResizeObserver) {
            const observer = new ResizeObserver(resizeWorld);
            observer.observe(document.body);
        }

        reducedMotion.addEventListener?.('change', scheduleRender);
        scheduleRender();

        window.addEventListener('pagehide', () => {
            if (retailFinishListener) document.removeEventListener('retail:finish-change', retailFinishListener);
            if (timeline) timeline.cancel();
            renderer.dispose();
            world.scene.traverse(object => {
                object.geometry?.dispose?.();
                if (Array.isArray(object.material)) object.material.forEach(material => material.dispose());
                else object.material?.dispose?.();
            });
        }, { once: true });
    }
}
