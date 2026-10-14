# Catatan referensi visual dan struktur

Dikumpulkan 14 Oktober 2026 dari halaman publik yang diberikan pengguna. Gunakan sebagai referensi pola interaksi dan ritme; jangan menyalin identitas, logo, copy, atau karya mereka.

- [Jesper Landberg](https://jesperlandberg.com/): editorial index yang menampilkan beberapa proyek; item proyek membuka halaman/proyek tersendiri. Hal ini mendukung pola **galeri utama → halaman preview mandiri**, bukan menjejalkan identitas semua konsep ke satu situs.
- [The Lookback / Better Off](https://tlb.betteroff.studio/): tampilan awal memiliki gerbang masuk dengan atau tanpa suara, judul tipografis yang besar, pilihan `Timeline`, `Surf`, `Index`, `About`, dan arsip inspirasi/showcase bernomor dengan media gambar. Setelah masuk, viewport memperlihatkan judul dan pita visual yang padat. Satu scroll browser bertumpu pada area galeri terpisah; percobaan scroll kedua sudah berada di ujung area itu, jadi kedalaman scroll keseluruhan belum terverifikasi melalui browser.
- [Discovery Land Company](https://discoverylandco.com/): naskah halaman mengatur cerita berurutan—`Our Worlds`, `Real Estate`, `Experiences`, dan `Discovery family`—dengan filter kawasan, kartu lokasi, carousel properti, cerita pengalaman, dan CTA. Pola yang relevan ialah perjalanan berbab dengan kontrol untuk mempersempit/menjelajahi koleksi, bukan hanya animasi objek.
- [NRLY / Nathan Riley](https://www.nrly.co/): halaman mengenalkan kreator dan fokus pada visual 3D, motion, serta pengalaman interaktif; identitas memakai nama berukuran besar dan tautan kontak/sosial sederhana. Pola yang relevan ialah identitas kreator menjadi pusat scene, dan karya 3D membawa interaksi.

## Arah revisi

Jaga galeri utama Jesper-style sebagai indeks. Ubah setiap route `/preview/.../` menjadi perjalanan pendek dengan chapter marker dan canvas WebGL yang sesungguhnya. Scroll halaman normal memperbarui komposisi kamera/objek pada canvas; jangan mengunci gulir. Tetapkan cerita, identitas, bentuk objek, dan mechanic berbeda untuk F&B, retail, industri, dan personal/kompro. Semua nama/klaim tetap berlabel sebagai demo konsep sampai data milik pengguna tersedia.

### Pemeriksaan browser: Discovery Land Company

Dua scroll browser memperlihatkan perpindahan ke `Our Worlds` lalu area `Real Estate`: header navigasi tetap mudah ditemukan, bagian `Our Worlds` memakai kontrol filter wilayah dan strip visual kartu lokasi, lalu bagian properti berpindah ke daftar/filter properti dengan indeks/kontrol berikutnya. Konten teks publik menyebut bagian `Experiences` serta tiga tema cerita Discovery family. Screenshot berikutnya menampilkan kartu lokasi/real-estate dalam komposisi lebar. Ada banner persetujuan cookie saat scroll; tidak dipilih atau dikirimkan.

**Referensi utama yang telah dibaca:**

- <https://jesperlandberg.com/>
- <https://tlb.betteroff.studio/>
- <https://discoverylandco.com/>
- <https://www.nrly.co/>

### Arahan pengguna

Pengguna menyebut ReactBits (reactbits.dev), anime.js, Skiper UI, Bklit, Kokonut UI, dan Motion.dev sebagai library yang mungkin dipertimbangkan. Karena project berjalan sebagai HTML/CSS/JavaScript tanpa React, evaluasi fokus pada pilihan yang dapat dipaketkan lokal dan berjalan pada halaman statis; komponen React-only tidak boleh memaksa rewrite stack.

### QA Three.js dan story walkthrough — 2026-10-14

- Preview publik `https://3000-i13vktdybkwo2q3i4uyay-b6c3459c.sg2.manus.computer/preview/fnb/` menampilkan scene WebGL asli: piring berlapis porselen, hidangan, cincin orbit, dan garis uap.
- Setelah satu viewport scroll, cerita berpindah ke bab 01 “Sebelum diolah, ada yang tumbuh.”; ritme scroll tetap native dan nav empat bab masih terlihat. Browser memperlihatkan object 3D piring di kanan teks, bukan hanya card tilt 2D.
- Bundle lokal dan rute bundle sudah merespons; ada jeda sebelum frame pertama, jadi kode sekarang menunda status `ready` sampai setelah `renderer.render` agar fallback tidak hilang sebelum canvas terlukis.

- Browser pada URL publik F&B sesudah scroll kedua beralih ke chapter `02 / 04 — MUSIM`; ring, angle, dan posisi piring 3D berubah bersama cerita.
- Live preview retail memperlihatkan vas 3D tinggi di atas podium dengan mini-objek mengorbit; gerak/mood retail berbeda dari piring F&B. Scroll pertama masuk ke chapter `01 — BENTUK`. Perlu cek chapter setelahnya untuk memastikan perubahan pose berikutnya, karena chapter pertama mempertahankan pose pembuka.

- Live preview [FORM / OBJECTS, Retail](https://3000-i13vktdybkwo2q3i4uyay-b6c3459c.sg2.manus.computer/preview/retail/) menampilkan beberapa bentuk 3D pada podium; setelah masuk chapter `02 / 04 — MATERIAL`, vas/podium lebih dekat dan cincin orbit bergeser, jadi perubahan bukan hanya perubahan judul.
- Live preview [FIELD / SYSTEMS, Industri](https://3000-i13vktdybkwo2q3i4uyay-b6c3459c.sg2.manus.computer/preview/industry/) memakai diorama geometris berbeda (kubus sistem, komponen modular, jalur pipa, dan ring pemindai) di atas latar navy/teal. Chapter pembuka masih pose dasar; perubahan kamera diharapkan pada chapter berikutnya.
