# Rencana — Galeri dan empat landing page story walkthrough 3D

## Implementasi

Gunakan proyek statis yang sudah berjalan—HTML, CSS, dan JavaScript—tanpa akun, backend, atau pembayaran. Homepage `/` tetap menjadi galeri berbahasa Indonesia yang memperkenalkan empat konsep dan membuka mini-site mandiri di `/preview/fnb/`, `/preview/retail/`, `/preview/industry/`, dan `/preview/profile/`. Inspirasinya adalah pola indeks Jesper Landberg yang membuka microsite berbeda, ritme arsip/timeline The Lookback, perjalanan dunia Discovery Land Company, serta presentasi kreator/3D NRLY. Ambil bahasa desainnya saja; jangan menyalin aset, identitas, copy, atau susunan situs mereka.

Pengguna belum punya URL/identitas/klaim bisnis sendiri. Karena itu empat halaman F&B, retail, industri, dan company profile/portofolio adalah **konsep/demo** yang jelas diberi label belum live. Jangan menambahkan URL bisnis, nama klien, kontak, statistik, harga, riwayat, atau klaim operasional fiktif. Aksi reservasi, form, keranjang, tab, dan kartu portofolio memberi respons lokal saja—tidak ada pesan yang dikirim, data disimpan, checkout, atau pembayaran.

Paket yang dipakai adalah `three@0.186.1` untuk geometri dan renderer WebGL, `animejs@4.5.0` untuk timeline yang dapat di-seek sesuai progres scroll, serta `esbuild@0.28.2` untuk mengemas modul agar situs statis bekerja tanpa CDN runtime. Gunakan Node 20+ dan `npm@10.9.2` dengan versi paket exact di `package.json` dan `package-lock.json`. Tidak perlu migrasi ke React hanya demi kit komponen; Three.js dan Anime.js telah dipaketkan lokal.

Setiap microsite memiliki canvas 3D dan jumlah tahap cerita yang sesuai alurnya: F&B dan Industry masing-masing lima; Retail dan Portfolio masing-masing empat. Pengunjung memakai scroll browser biasa—tanpa hijack roda mouse/touch—sementara progres menggerakkan objek dan kamera lewat `timeline.seek()`. Nav chapter berupa tautan anchor tetap berfungsi via keyboard. Scene tidak terus bergerak ketika tab/halaman tidak terlihat; batasi pixel ratio dan sediakan fallback editorial CSS yang tetap mempertahankan cerita, reveal, progres, serta `aria-current` ketika WebGL tidak tersedia. Hormati `prefers-reduced-motion` dan jangan mengandalkan canvas untuk membaca konten.

Empat narasi dan scene harus terasa berbeda, bukan satu model yang sekadar berganti warna:

- **F&B — Rasa Kitchen (lima tahap):** `asal → musim → dapur/api → sajian/menu → meja`; piring berlapis, garnish yang mengorbit, dan kamera hangat yang bergerak melingkari panggung.
- **Retail — FORM Objects (empat tahap):** `spotlight objek → bentuk/material → etalase/koleksi → catatan konsep`; produk lathe di turntable dan swatch mengubah material mesh.
- **Industri — NEXA Systems (lima tahap):** `system brief → konteks/masalah → arsitektur jaringan → kapabilitas → diskusi/handoff`; rangka modular, pipa, wireframe dan node cahaya tersusun dalam inspeksi kamera yang teknis.
- **Company profile/portfolio (empat tahap):** `POV → praktik/identitas → arsip karya → kontak`; beberapa plane/frame melayang dan kamera melewati lapisan studio/karya editorial.

`scripts/dev.mjs` membundel `src/story-world.js` menjadi bundle development sebelum menjalankan `server.mjs`; `scripts/build.mjs` menyalin halaman/aset statis dan membuat bundle produksi di `dist/src/story-world.bundle.js`. Setiap route mempunyai entrypoint HTML sendiri, sedangkan route manifest `public/manus-routes.json` mendeklarasikan `/` dan seluruh microsite supaya bisa dibuka langsung maupun melalui kartu galeri.

## Arah desain

- **Gerakan desain:** editorial digital sinematik yang berpadu dengan studi objek 3D dan brutalism minimal.
- **Prinsip inti:** identitas visual tiap halaman autentik pada kategorinya; cerita konten berdiri sendiri dari canvas; motion menggambarkan narasi, bukan hiasan generik; label konsep menjelaskan keterbatasan tanpa merusak imersi.
- **Filosofi warna:** tinta malam memberi ruang pada galeri; aksen limau elektrik menyatukan indeks. Microsite berganti ke krem/terracotta untuk F&B, mineral/olive untuk retail, navy/teal untuk industri, dan lilac/coral editorial untuk portofolio.
- **Paradigma layout:** homepage vertikal asimetris; tiap konsep menjadi perjalanan halaman penuh dengan canvas latar yang imersif dan chapter konten bertumpuk. Scroll tetap natural, chapter rail menjadi orientasi.
- **Elemen khas:** glif orbit pada wordmark, world canvas pada setiap mini-site, serta objek 3D khas sektor (piring, podium/produk, rangka, frame karya).
- **Filosofi interaksi:** scroll memilih bab dan menyinkronkan kamera; anchor/CTA membawa pengguna ke konten atau simulasi nyata; pointer hanya pelengkap, bukan inti 3D.
- **Animasi:** timeline scrubbed berbasis chapter; gerak unik tiap tema, frame pertama tampil sebelum fallback memudar, renderer tidur saat halaman tersembunyi, motion dikurangi bila diminta.
- **Tipografi:** Space Grotesk untuk UI dan heading, Instrument Serif untuk aksen editorial, DM Mono untuk indeks. Setiap microsite menyusun hierarki judul sesuai sektor.
- **Esensi merek:** galeri konsep interaktif untuk membuat calon klien merasakan dunia setiap landing page sebelum situs sebenarnya dipublikasikan. Personalitas: imersif, jernih, eksploratif.
- **Suara merek:** singkat, percaya diri, tidak berlebihan. Contoh: “Satu gulir, empat dunia digital.” dan “Preview konsep — situs aslinya menyusul.”
- **Wordmark/logo:** glif abstrak bidang browser yang berorbit, tanpa mengarang nama atau inisial pemilik.
- **Warna khas:** hijau-limau elektrik di atas tinta malam pada galeri; tiap microsite memiliki aksen sektor sendiri.

## Struktur proyek

- `index.html`, `src/app.js`, `src/styles.css`: homepage indeks, tautan microsite, dialog/progres galeri, dan tampilan responsif.
- `public/preview/{fnb,retail,industry,profile}/index.html`: empat entrypoint mandiri dengan bab cerita dan canvas.
- `src/story-world.js`: renderer, timeline, progres scroll, observer reveal/progres, responsive sizing, fallback dan lifecycle.
- `src/world-shared.js` dan `src/worlds/{fnb,retail,industry,profile}.js`: utilitas objek/lampu dan geometri/stop kamera per kategori.
- `src/story-world.css`: identitas, tata letak story dan fallback; `src/preview-sites.js` mempertahankan menu, form, keranjang, tabs, dan dialog demo.
- `scripts/dev.mjs`, `scripts/build.mjs`, `package.json`, `package-lock.json`, `THIRD-PARTY-NOTICES.md`: bundling lokal dan lisensi paket.
- `public/data/projects.json`, `public/manus-routes.json`, `public/images/brand/`: data galeri, lima route resmi, dan marka situs.
- `TODO.md` merekam semua kriteria produk dan progres; `reference-notes.md` menyimpan pembacaan referensi yang diberikan pengguna.

## Bukti perbaikan fallback

Pelacakan chapter dan reveal kini berdiri terpisah dari renderer. Bila WebGL gagal, IntersectionObserver tetap memperbarui nomor serta `aria-current`; browser tanpa IntersectionObserver menggunakan scroll/resize. Tes regresi dengan kegagalan WebGL paksa memastikan progres berpindah dari chapter 01 ke 02.

## Revisi setelah umpan balik pengguna: pisahkan dramaturgi, bukan hanya scene

Audit menemukan kekurangan implementasi sebelumnya: keempat microsite menggunakan hero, rail progres, empat chapter, dan pola copy kiri/kanan yang sama. Tiga dimensinya berbeda, tetapi struktur dan ritmenya terlalu mirip. Revisi ini mengganti setiap dokumen dan sistem CSS dengan komposisi tema tersendiri. **Jangan mempertahankan template `story-chapter` generik atau empat chapter kiri/kanan identik.** Renderer Three.js dan fungsi aksesibilitas boleh dipakai bersama; arah cerita, stop camera/objek, layout, navigasi, dan tindakan pengunjung harus dirancang terpisah per tema.

- **F&B — perjalanan rasa.** Gunakan bidang editorial kuliner yang kaya foto/warna hangat dengan progres cerita “asal bahan → musim/panen → proses/api → komposisi hidangan → meja”. Piring, bahan, dan uap 3D mengumpul/berputar sebagai bagian dari cerita. Tambahkan jejak menu/reservasi simulasi; jangan gunakan klaim pemasok, harga, atau restoran nyata.
- **Retail — peluncuran produk/etalase.** Bentuk microsite sebagai halaman retail untuk satu produk utama: object spotlight, pilihan material/finishing yang mengubah model 3D, detail pemakaian/perawatan, rak horizontal koleksi, dan tas demo. Produk tetap menjadi pusat pandang; jangan gunakan nav rail/kartu bab F&B.
- **Industri — arsitektur sistem B2B.** Gunakan komposisi blueprint/monitor teknis dan alur rekayasa “konteks → susunan sistem → kemampuan/integrasi → diskusi”. Objek modular dan jalur/terminal 3D harus terurai/tersambung untuk menjelaskan hubungan, bukan sekadar berotasi dekoratif. Hindari metrik/sertifikasi yang tidak diberikan pengguna.
- **Profile/portfolio — halaman praktik kreatif.** Buka dengan pernyataan POV dan identitas tipografis; bawa pengunjung menuju cara kerja, lalu indeks karya berlapis, dan penutup kontak. Susun karya sebagai arsip/editorial—bukan halaman produk atau sistem B2B. Nama, bio, link, dan detail karya tetap placeholder yang jujur sampai diberi pengguna.

Tata HTML dan sistem CSS per route harus punya hierarki/ritme yang nyata berbeda (jumlah/durasi/ukuran bab, treatment hero, posisi objek, navigasi/progress, dan tindakan interaksi). Ketika pengunjung menggulir secara native, objek/kamera menandai perubahan fase cerita masing-masing. Setiap halaman harus tetap jelas sebagai **konsep belum live**. Pertahankan direct routes, reduced-motion, fallback WebGL, dan interaksi demo yang sudah tersedia. Setelah implementasi, periksa halaman demi halaman dan bandingkan struktur DOM/stylenya, bukan hanya screenshot hero atau warna.

## Catatan koreksi integrasi cerita–3D

Audit scene menemukan tiga mismatch yang harus dibereskan sebelum menutup iterasi ini: halaman F&B dan industri masing-masing memiliki lima tahap cerita namun hanya empat camera stop; akibatnya adegan 3D berhenti berkembang sebelum penutup. Retail sudah memiliki pilihan material di HTML tetapi kontrol tersebut belum mengubah material mesh Three.js. Pada portfolio, jalur terakhir membalik seluruh galeri sehingga frame dapat menghadap menjauhi kamera. Koreksinya adalah menyelaraskan jumlah dan isi camera stop per halaman, mengikat pilihan finish langsung pada material mesh retail, dan mengakhiri lintasan profile dengan semua frame masih menghadap pengunjung. Struktur/layout empat microsite tetap terpisah; perubahan ini melengkapi story visual dan bukan pengganti desain khusus yang sudah diterapkan.
