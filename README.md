# Ruang Catatan

Aplikasi catatan personal berbasis React, Vite, Tailwind CSS 4, dan PWA. Antarmuka mengambil inspirasi dari prinsip desain One UI dan iOS: layout lapang, kontrol ramah sentuhan, kartu membulat, serta panel translucent.

## Fitur
- Buat, edit, hapus, dan sematkan catatan.
- Pencarian catatan.
- Pilihan warna.
- Penyimpanan otomatis pada LocalStorage.
- PWA dengan service worker dan cache offline.
- Tampilan responsif untuk desktop, tablet, dan ponsel.

## Persyaratan
- Node.js 22 LTS atau lebih baru.
- npm.

## Jalankan secara lokal
```bash
npm install
npm run dev
```

## Build dan uji hasil production
```bash
npm run build
npm run preview
```
Hasil build berada di folder `dist/`.

## Deploy ke GitHub Pages

1. Buat repository GitHub, misalnya `catatan-pwa`.
2. Unggah seluruh isi folder project ini ke branch `main` (folder `.github` juga harus ikut).
3. Buka **Settings → Pages** pada repository.
4. Pada **Build and deployment → Source**, pilih **GitHub Actions**.
5. Buka tab **Actions** dan tunggu workflow **Deploy Ruang Catatan to GitHub Pages** selesai.
6. Situs tersedia di `https://USERNAME.github.io/catatan-pwa/`.

Workflow membaca nama repository dari `GITHUB_REPOSITORY` sehingga base path menyesuaikan nama repository secara otomatis. Jika repository adalah `USERNAME.github.io` (user site), ubah `base` di `vite.config.js` menjadi `'/'`.

### Push perubahan berikutnya
```bash
git add .
git commit -m "Update Ruang Catatan"
git push origin main
```
Setiap push ke `main` akan menjalankan build dan deployment ulang.

## Catatan PWA dan data
- PWA memerlukan HTTPS (GitHub Pages menyediakan HTTPS) atau `localhost`.
- Service worker meng-cache aset aplikasi untuk penggunaan offline setelah kunjungan online pertama.
- Catatan tersimpan di LocalStorage browser/perangkat. Tidak ada akun, backend, atau sinkronisasi cloud.
- Ikon SVG disediakan dalam ukuran 192 dan 512. Untuk dukungan instalasi lintas browser yang paling luas, ikon PNG 192×192 dan 512×512 juga dapat ditambahkan kemudian.
