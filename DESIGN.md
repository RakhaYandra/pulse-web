# Pulse DESIGN.md — arah visual (ditulis dari brief owner, 2026-09-25)

## Identitas

Pulse adalah ops console klinis untuk developer yang mengecek kesehatan API.
Nada: dingin, presisi, tanpa basa-basi. Setiap piksel melayani satu
pertanyaan: monitor mana yang butuh perhatian sekarang.

## Dial: ENERGY 1 / RHYTHM 2 / MOTION 2

## Sistem yang mengikat

- Radius: hanya `--radius-s/m/l` (8/10/12). s = kontrol kecil,
  m = baris/kartu stat, l = kartu/form. Tanpa nilai mentah.
- Warna: hanya via token. Nol hex di JS/JSX (cek: `grep # src/`).
- Key list stabil (bukan index murni); sel waktu memuat tanggal.

## Palette (alasan per R-31)

- Base dark slate `#0f172a`, surface `#1e293b`: konsol ops memang gelap
  (alat developer, bukan tren); teks muted `#94a3b8` lolos AA di keduanya
  (6,96 / 5,71).
- Aksen biru dipertahankan dari identitas lama, digelapkan satu tingkat
  `#3b82f6` → `#2563eb` agar teks putih lolos AA (3,68 → 5,17). Biru =
  warna info/aksi; status kesehatan tetap hijau/merah/abu konvensional
  (konvensi ops, bukan dekorasi).
- Maksimal: 1 base + 1 surface + 1 aksen + warna status. Tanpa gradient.

## Tipografi

- Sans system stack untuk UI (alasan: konsol harus cepat, tanpa unduhan font).
- Mono (`ui-monospace`) + `tabular-nums` untuk semua angka dan latensi
  (alasan: angka tak bergeser saat polling 15 detik).
- Tanpa uppercase tracking-lebar, tanpa monospace raksasa.

## Gerak (MOTION 2)

- Transisi halus antar state/tab; tanpa loop tanpa akhir.
- Hormati `prefers-reduced-motion`.
