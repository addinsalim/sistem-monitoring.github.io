# AirWatch — STIKOM El Rahma (Frontend Preview)

Frontend prototype for the Sistem Monitoring Kualitas Udara Area Parkir STIKOM El Rahma.

## Stack
- React + Vite
- Tailwind CSS
- Recharts
- Lucide React

## Jalankan secara lokal
Pastikan Node.js versi LTS terpasang, kemudian dari folder proyek:

```bash
npm install
npm run dev
```

Buka URL lokal yang ditampilkan Vite di terminal.

Build production preview:

```bash
npm run build
npm run preview
```

## Halaman
- **Beranda**: Ringkasan kualitas udara area parkir, status sensor, grafik 24 jam, dan peta lokasi.
- **Data Real-time**: Pembacaan sensor terkini secara berkala dan visualisasi grafik live.
- **Riwayat Data**: Log riwayat pembacaan sensor lengkap dengan filter tanggal/status, modal detail, dan fitur Export CSV.
- **Grafik Kualitas Udara**: Tren polutan, rata-rata harian, slider batas ambang interaktif, serta tabel kategori ISPU Indonesia (PP No.22/2021).
- **Info Sensor & Sistem**: Dokumentasi teknis sensor (Sharp GP2Y, MQ-2, DHT22, ESP32) dan arsitektur sistem.
- **Pengaturan**: Konfigurasi parameter perangkat dan monitoring.

## Penting
- Semua data saat ini adalah mock/simulasi.
- Belum ada backend, database, firmware ESP32, REST API, atau MQTT.
- Nilai `raw` bukan konsentrasi partikulat terkalibrasi dan bukan AQI.
- Angka sampel, timestamp, serta status koneksi pada UI hanya contoh untuk evaluasi frontend.
- Jangan mulai fase backend sebelum frontend mendapat persetujuan eksplisit.
