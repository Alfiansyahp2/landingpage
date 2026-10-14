# Website outcomes

- [x] **Galeri utama** — Beranda menampilkan empat kategori landing page dan menjadi indeks ke microsite yang berdiri sendiri.
- [x] **Arah visual konsep** — Kategori yang ditampilkan adalah F&B, retail, industri, dan company profile/portofolio pribadi. Belum ada URL/materi bisnis asli; identitas dan copy demo harus dilabeli sebagai konsep.
- [x] **WebGL lokal** — Scene Three.js berjalan dari bundle lokal pada setiap microsite; tidak bergantung pada CDN untuk library inti.
- [x] **Microsite F&B yang khusus** — Gunakan perjalanan kuliner, dari asal/bahan melalui dapur dan sajian menuju pengalaman di meja. Komposisi, nav, dan cara bab terbuka harus terasa editorial, sensual, dan berhubungan dengan makanan—not template bab umum.
- [x] **Microsite retail yang khusus** — Sajikan pengalaman e-commerce berbasis satu objek/produk: spotlight produk, detail material, interaksi memilih varian, koleksi/etalase, dan tas demo. Gerak model serta urutan pengalaman harus berpusat pada produk, berbeda dari perjalanan F&B.
- [x] **Microsite industri yang khusus** — Buat alur B2B/engineering yang menjelaskan masalah/konteks, struktur sistem, kapabilitas/integrasi, dan langkah diskusi dengan diagram modular berperspektif teknis; hindari pola hero dan kartu editorial yang sama.
- [x] **Microsite profile/portfolio yang khusus** — Bangun struktur personal/creative-practice dengan pernyataan POV, tentang/proses, indeks karya, dan kontak demo. Gunakan komposisi tipografis serta navigasi arsip/portofolio, bukan alur produk atau diagram industri.
- [x] **Identitas dan flow sungguh berbeda** — Keempat situs tidak boleh lagi memiliki susunan hero + rail progres + empat chapter kiri/kanan yang identik. Variasikan hierarki, komposisi layout, jumlah/ukuran/ritme section, navigasi chapter, dan cara pengunjung berinteraksi; identitas tidak cukup dibedakan oleh warna atau objek 3D.
- [x] **3D bercerita, bukan ornamen** — Setiap tahap narasi yang memakai Three.js harus cocok dengan camera stop/object pose khusus; world harus masih berubah saat memasuki bab terakhir, bukan berhenti sebelum ending. Komposisi dan jalur gerak setiap theme tetap berbeda.
- [x] **Interaksi fisik scene** — Swatch retail harus mengubah material mesh produk secara langsung; gerak food, komponen sistem industri, dan frame profile harus menyampaikan perubahan yang dijelaskan teks saat halaman digulir.
- [x] **Interaksi aman** — Kontrol yang sudah ada tetap berfungsi; form bersifat simulasi tanpa pengiriman/penyimpanan, keranjang tidak memproses pesanan atau pembayaran, dan halaman konsep tidak menampilkan URL bisnis fiktif.
- [x] **Aksesibilitas dan fallback** — Hormati `prefers-reduced-motion`; konten, navigasi, dan fallback tetap dapat dipakai tanpa WebGL.
- [x] **Route langsung** — Manifes memuat beranda dan empat route microsite; setiap route dapat dimuat langsung.
