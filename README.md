# Birthday Bucin — Indah Kusuma Atmaja 💕

Website ulang tahun digital, vanilla HTML/CSS/JS, mobile-first, siap deploy ke GitHub Pages.

## Struktur File

```
index.html          → markup semua section
css/style.css        → semua styling & animasi
js/config.js          → SEMUA data personal (edit di sini aja)
js/engine.js          → logic interaktif (jangan diedit kecuali ngerti)
assets/img/           → foto galeri (placeholder, ganti dengan nama file sama)
assets/music/         → drop song.mp3 di sini
```

## Cara Update Konten (zero-code)

Edit `js/config.js` aja, sisanya otomatis ke-render. Yang sering perlu diganti:

- **Ganti foto**: replace file `assets/img/photo1.jpg` s/d `photo6.jpg` dengan foto asli (nama file sama, gak perlu ubah config). Mau nambah/kurang foto? edit array `gallery` di config.js.
- **Tambah musik**: drop file MP3 sebagai `assets/music/song.mp3`. Sebelum file ada, tombol musik otomatis nonaktif (gak error).
- **Ganti gate code**: kalau tanggal jadian beda, edit `gate.code` (format DDMMYYYY, 8 digit) dan `relationship.startDate` (format `YYYY-MM-DDT00:00:00`) — dua field ini harus konsisten.
- **Surat cinta / reasons / easter egg**: edit array/teks terkait langsung di config.js, support emoji bebas.

## Catatan Teknis

- Sound effects (tick, pop, chime) di-generate via Web Audio API — gak butuh file audio eksternal.
- Music player pakai try/catch graceful fallback kalau file belum diupload.
- Vibration feedback (`navigator.vibrate`) otomatis no-op di device yang gak support.
- Font (Caveat, Baloo 2, Quicksand) load dari Google Fonts via CDN — butuh koneksi internet saat dibuka.
- Gate code disimpan plain di config.js (client-side) — ini cuma buat fun/romantic gate, bukan security beneran.

## Deploy ke GitHub Pages

1. Push semua file ini ke repo (root atau folder tertentu).
2. Settings → Pages → pilih branch & folder.
3. Buka link yang muncul, done.
