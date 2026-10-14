const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const root = document.body;
const menu = $('[data-site-nav]');
const menuToggle = $('[data-menu-toggle]');
const toast = $('[data-preview-toast]');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

let toastTimer;
let cart = new Map();

function announce(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3100);
}

function setMenu(open) {
    if (!menu || !menuToggle) return;
    menu.classList.toggle('is-open', open);
    menu.inert = !open && matchMedia('(max-width: 720px)').matches;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Tutup navigasi' : 'Buka navigasi');
}

if (menu && menuToggle) {
    const viewport = matchMedia('(max-width: 720px)');
    menu.inert = viewport.matches;
    viewport.addEventListener('change', event => {
        menu.inert = event.matches;
        if (!event.matches) setMenu(false);
    });
    menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', event => {
        if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
            setMenu(false);
            menuToggle.focus();
        }
    });
}

function showArtFallback(image) {
    const frame = image.parentElement;
    const label = image.getAttribute('alt')?.trim();
    frame.classList.add('image-unavailable');
    if (label) {
        frame.setAttribute('role', 'img');
        frame.setAttribute('aria-label', label);
    }
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
}

$$('.food-hero-image img, .retail-hero-image img, .industry-hero-image img, .profile-hero-image img').forEach(image => {
    image.addEventListener('error', () => showArtFallback(image), { once: true });
    if (image.complete && image.naturalWidth === 0) showArtFallback(image);
});

$$('[data-demo-form]').forEach(form => {
    form.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const status = $('.form-status', form);
        const kind = form.dataset.demoForm;
        if (status) status.textContent = kind === 'reservasi'
            ? 'Simulasi reservasi selesai—data tidak dikirim atau disimpan.'
            : 'Demo selesai—pesan tidak dikirim atau disimpan.';
        form.reset();
    });
});

function cartSize() {
    return [...cart.values()].reduce((sum, count) => sum + count, 0);
}

function updateCart() {
    const count = cartSize();
    const countBadge = $('[data-cart-count]');
    const countButton = $('[data-open-cart]');
    if (countBadge) countBadge.textContent = String(count);
    if (countButton) countButton.setAttribute('aria-label', `Buka keranjang demo, ${count} item`);
    const list = $('[data-cart-items]');
    const empty = $('[data-cart-empty]');
    if (list) {
        list.replaceChildren(...[...cart.entries()].map(([name, quantity]) => {
            const line = document.createElement('li');
            line.textContent = `${name} — ${quantity} item`;
            return line;
        }));
    }
    if (empty) empty.hidden = count > 0;
    const clear = $('[data-clear-cart]');
    if (clear) clear.disabled = count === 0;
}

function openDialog(dialog) {
    if (dialog && !dialog.open) dialog.showModal();
}

$$('[data-add-cart]').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.dataset.product || 'Objek demo';
        cart.set(name, (cart.get(name) || 0) + 1);
        updateCart();
        announce(`${name} ditambahkan ke keranjang demo. Tidak ada pesanan atau pembayaran.`);
    });
});

$('[data-open-cart]')?.addEventListener('click', () => {
    updateCart();
    openDialog($('#cart-dialog'));
});

$('[data-clear-cart]')?.addEventListener('click', () => {
    cart.clear();
    updateCart();
    const status = $('.cart-status');
    if (status) status.textContent = 'Keranjang demo dikosongkan.';
});

$('[data-checkout]')?.addEventListener('click', () => {
    const status = $('.cart-status');
    if (status) status.textContent = 'Checkout tidak tersedia pada demo ini—tidak ada pembayaran.';
});

const finishLabels = { chalk: 'Chalk', moss: 'Moss', clay: 'Clay' };
$$('[data-finish]').forEach(button => {
    button.addEventListener('click', () => {
        const finish = button.dataset.finish;
        if (!(finish in finishLabels)) return;
        $$('[data-finish]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
        root.dataset.retailFinish = finish;
        document.dispatchEvent(new CustomEvent('retail:finish-change', { detail: { finish } }));
        announce(`${finishLabels[finish]} diterapkan pada objek 3D. Ini visual demo, bukan produk jualan.`);
    });
});

const solutionCopy = {
    design: {
        tab: 'tab-design', marker: '01 — SYSTEMS',
        title: 'Rekayasa untuk kebutuhan nyata.',
        copy: 'Contoh susunan kapabilitas: jelaskan keahlian teknis, standar kerja, dan konteks solusi tanpa memakai angka atau klaim yang belum diverifikasi.'
    },
    integrate: {
        tab: 'tab-integrate', marker: '02 — INTEGRATION',
        title: 'Hubungkan proses yang terpisah.',
        copy: 'Contoh narasi integrasi: gambarkan bagaimana peralatan, data, dan alur kerja dapat dirancang agar mudah dipahami dalam satu sistem.'
    },
    support: {
        tab: 'tab-support', marker: '03 — CONTINUITY',
        title: 'Dukung langkah selanjutnya.',
        copy: 'Contoh fokus dukungan: tunjukkan ruang kolaborasi, siklus pemeliharaan, dan bentuk pendampingan tanpa mengklaim layanan perusahaan tertentu.'
    }
};

const solutionTabs = $$('[data-solution-tab]');
function selectSolution(key, focus = false) {
    const detail = solutionCopy[key];
    if (!detail) return;
    solutionTabs.forEach(tab => {
        const selected = tab.dataset.solutionTab === key;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (selected && focus) tab.focus();
    });
    const panel = $('#capability-panel');
    const title = $('[data-solution-title]');
    const copy = $('[data-solution-copy]');
    const marker = $('.capability-mark');
    if (panel) panel.setAttribute('aria-labelledby', detail.tab);
    if (title) title.textContent = detail.title;
    if (copy) copy.textContent = detail.copy;
    if (marker) marker.textContent = detail.marker;
}

solutionTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectSolution(tab.dataset.solutionTab));
    tab.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? solutionTabs.length - 1
            : (index + (event.key === 'ArrowRight' ? 1 : -1) + solutionTabs.length) % solutionTabs.length;
        selectSolution(solutionTabs[next].dataset.solutionTab, true);
    });
});

$$('[data-open-work]').forEach(button => {
    button.addEventListener('click', () => {
        const dialog = $('#work-dialog');
        const title = $('#work-dialog-title');
        const copy = $('[data-work-dialog-copy]');
        if (!dialog || !title || !copy) return;
        title.textContent = button.dataset.workTitle || 'Project note';
        copy.textContent = button.dataset.workCopy || 'Detail karya contoh—materi asli belum disediakan.';
        openDialog(dialog);
    });
});

$$('[data-close-dialog]').forEach(button => {
    button.addEventListener('click', () => button.closest('dialog')?.close());
});

document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    if (reduceMotion.matches) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', link.getAttribute('href'));
});

updateCart();
