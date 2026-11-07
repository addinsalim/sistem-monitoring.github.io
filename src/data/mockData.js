// Data simulasi untuk review UI. Bukan pembacaan sensor nyata.

export const chartData = [
  { time: '00:00', pm25: 15, asapRokok: 5,  asapKendaraan: 8  },
  { time: '03:00', pm25: 12, asapRokok: 4,  asapKendaraan: 6  },
  { time: '06:00', pm25: 18, asapRokok: 6,  asapKendaraan: 10 },
  { time: '09:00', pm25: 28, asapRokok: 8,  asapKendaraan: 15 },
  { time: '12:00', pm25: 38, asapRokok: 10, asapKendaraan: 20 },
  { time: '15:00', pm25: 55, asapRokok: 14, asapKendaraan: 28 },
  { time: '18:00', pm25: 40, asapRokok: 10, asapKendaraan: 22 },
  { time: '21:00', pm25: 18, asapRokok: 7,  asapKendaraan: 12 },
]

// ─── History (35+ rekaman simulasi — 7 hari) ───
export const history = [
  // 1 Nov 2025
  { date: '01 Nov 2025', time: '01 Nov 2025 · 07:00', pm25: 14, asapRokok: 4,  asapKendaraan: 7,  suhu: 27, kelembapan: 68, status: 'Baik'   },
  { date: '01 Nov 2025', time: '01 Nov 2025 · 09:30', pm25: 25, asapRokok: 7,  asapKendaraan: 13, suhu: 29, kelembapan: 64, status: 'Baik'   },
  { date: '01 Nov 2025', time: '01 Nov 2025 · 12:00', pm25: 42, asapRokok: 11, asapKendaraan: 21, suhu: 33, kelembapan: 58, status: 'Sedang' },
  { date: '01 Nov 2025', time: '01 Nov 2025 · 14:30', pm25: 37, asapRokok: 9,  asapKendaraan: 19, suhu: 32, kelembapan: 60, status: 'Baik'   },
  { date: '01 Nov 2025', time: '01 Nov 2025 · 17:00', pm25: 58, asapRokok: 15, asapKendaraan: 30, suhu: 30, kelembapan: 63, status: 'Sedang' },
  { date: '01 Nov 2025', time: '01 Nov 2025 · 19:30', pm25: 22, asapRokok: 6,  asapKendaraan: 11, suhu: 28, kelembapan: 70, status: 'Baik'   },
  // 31 Okt 2025
  { date: '31 Okt 2025', time: '31 Okt 2025 · 08:00', pm25: 18, asapRokok: 5,  asapKendaraan: 9,  suhu: 28, kelembapan: 67, status: 'Baik'   },
  { date: '31 Okt 2025', time: '31 Okt 2025 · 10:30', pm25: 31, asapRokok: 8,  asapKendaraan: 16, suhu: 30, kelembapan: 62, status: 'Baik'   },
  { date: '31 Okt 2025', time: '31 Okt 2025 · 13:00', pm25: 47, asapRokok: 12, asapKendaraan: 24, suhu: 34, kelembapan: 55, status: 'Sedang' },
  { date: '31 Okt 2025', time: '31 Okt 2025 · 15:30', pm25: 35, asapRokok: 9,  asapKendaraan: 18, suhu: 32, kelembapan: 59, status: 'Baik'   },
  { date: '31 Okt 2025', time: '31 Okt 2025 · 18:00', pm25: 20, asapRokok: 6,  asapKendaraan: 10, suhu: 29, kelembapan: 65, status: 'Baik'   },
  // 30 Okt 2025
  { date: '30 Okt 2025', time: '30 Okt 2025 · 07:30', pm25: 16, asapRokok: 4,  asapKendaraan: 8,  suhu: 27, kelembapan: 69, status: 'Baik'   },
  { date: '30 Okt 2025', time: '30 Okt 2025 · 10:00', pm25: 29, asapRokok: 8,  asapKendaraan: 14, suhu: 31, kelembapan: 61, status: 'Baik'   },
  { date: '30 Okt 2025', time: '30 Okt 2025 · 12:30', pm25: 52, asapRokok: 13, asapKendaraan: 26, suhu: 34, kelembapan: 54, status: 'Sedang' },
  { date: '30 Okt 2025', time: '30 Okt 2025 · 15:00', pm25: 39, asapRokok: 10, asapKendaraan: 20, suhu: 32, kelembapan: 58, status: 'Baik'   },
  { date: '30 Okt 2025', time: '30 Okt 2025 · 17:30', pm25: 61, asapRokok: 16, asapKendaraan: 32, suhu: 30, kelembapan: 62, status: 'Sedang' },
  // 29 Okt 2025
  { date: '29 Okt 2025', time: '29 Okt 2025 · 07:00', pm25: 13, asapRokok: 4,  asapKendaraan: 7,  suhu: 26, kelembapan: 71, status: 'Baik'   },
  { date: '29 Okt 2025', time: '29 Okt 2025 · 09:30', pm25: 24, asapRokok: 7,  asapKendaraan: 12, suhu: 29, kelembapan: 64, status: 'Baik'   },
  { date: '29 Okt 2025', time: '29 Okt 2025 · 12:00', pm25: 44, asapRokok: 11, asapKendaraan: 22, suhu: 33, kelembapan: 56, status: 'Sedang' },
  { date: '29 Okt 2025', time: '29 Okt 2025 · 14:30', pm25: 33, asapRokok: 9,  asapKendaraan: 17, suhu: 31, kelembapan: 60, status: 'Baik'   },
  { date: '29 Okt 2025', time: '29 Okt 2025 · 17:00', pm25: 19, asapRokok: 5,  asapKendaraan: 10, suhu: 28, kelembapan: 67, status: 'Baik'   },
  // 28 Okt 2025
  { date: '28 Okt 2025', time: '28 Okt 2025 · 08:00', pm25: 21, asapRokok: 6,  asapKendaraan: 11, suhu: 28, kelembapan: 66, status: 'Baik'   },
  { date: '28 Okt 2025', time: '28 Okt 2025 · 10:30', pm25: 36, asapRokok: 9,  asapKendaraan: 18, suhu: 31, kelembapan: 60, status: 'Baik'   },
  { date: '28 Okt 2025', time: '28 Okt 2025 · 13:00', pm25: 55, asapRokok: 14, asapKendaraan: 28, suhu: 35, kelembapan: 53, status: 'Sedang' },
  { date: '28 Okt 2025', time: '28 Okt 2025 · 15:30', pm25: 41, asapRokok: 10, asapKendaraan: 21, suhu: 32, kelembapan: 57, status: 'Sedang' },
  { date: '28 Okt 2025', time: '28 Okt 2025 · 18:00', pm25: 17, asapRokok: 5,  asapKendaraan: 9,  suhu: 29, kelembapan: 64, status: 'Baik'   },
  // 27 Okt 2025
  { date: '27 Okt 2025', time: '27 Okt 2025 · 07:30', pm25: 12, asapRokok: 3,  asapKendaraan: 6,  suhu: 27, kelembapan: 70, status: 'Baik'   },
  { date: '27 Okt 2025', time: '27 Okt 2025 · 10:00', pm25: 23, asapRokok: 7,  asapKendaraan: 12, suhu: 30, kelembapan: 63, status: 'Baik'   },
  { date: '27 Okt 2025', time: '27 Okt 2025 · 12:30', pm25: 48, asapRokok: 12, asapKendaraan: 24, suhu: 33, kelembapan: 56, status: 'Sedang' },
  { date: '27 Okt 2025', time: '27 Okt 2025 · 15:00', pm25: 38, asapRokok: 10, asapKendaraan: 19, suhu: 31, kelembapan: 59, status: 'Baik'   },
  { date: '27 Okt 2025', time: '27 Okt 2025 · 17:30', pm25: 16, asapRokok: 5,  asapKendaraan: 8,  suhu: 28, kelembapan: 66, status: 'Baik'   },
  // 26 Okt 2025
  { date: '26 Okt 2025', time: '26 Okt 2025 · 07:00', pm25: 15, asapRokok: 4,  asapKendaraan: 8,  suhu: 27, kelembapan: 68, status: 'Baik'   },
  { date: '26 Okt 2025', time: '26 Okt 2025 · 11:00', pm25: 27, asapRokok: 8,  asapKendaraan: 14, suhu: 30, kelembapan: 62, status: 'Baik'   },
  { date: '26 Okt 2025', time: '26 Okt 2025 · 14:00', pm25: 43, asapRokok: 11, asapKendaraan: 22, suhu: 33, kelembapan: 56, status: 'Sedang' },
  { date: '26 Okt 2025', time: '26 Okt 2025 · 17:00', pm25: 30, asapRokok: 8,  asapKendaraan: 15, suhu: 31, kelembapan: 61, status: 'Baik'   },
]

// ─── Daily summary untuk chart tren riwayat ───
export const dailySummary = [
  { date: '26 Okt', pm25Avg: 29, asapRokokAvg: 8,  asapKendaraanAvg: 15, maxPm25: 43 },
  { date: '27 Okt', pm25Avg: 27, asapRokokAvg: 7,  asapKendaraanAvg: 14, maxPm25: 48 },
  { date: '28 Okt', pm25Avg: 34, asapRokokAvg: 9,  asapKendaraanAvg: 17, maxPm25: 55 },
  { date: '29 Okt', pm25Avg: 27, asapRokokAvg: 7,  asapKendaraanAvg: 14, maxPm25: 44 },
  { date: '30 Okt', pm25Avg: 39, asapRokokAvg: 10, asapKendaraanAvg: 20, maxPm25: 61 },
  { date: '31 Okt', pm25Avg: 30, asapRokokAvg: 8,  asapKendaraanAvg: 15, maxPm25: 47 },
  { date: '01 Nov', pm25Avg: 33, asapRokokAvg: 9,  asapKendaraanAvg: 17, maxPm25: 58 },
]

export const notifications = [
  { type: 'success', title: 'Kondisi udara normal',          desc: 'Semua parameter dalam batas aman.',                                                  time: '14:20' },
  { type: 'warning', title: 'Peningkatan PM2.5 terdeteksi', desc: 'Nilai PM2.5 meningkat menjadi 45 μg/m³ (masih dalam batas aman).',                    time: '11:15' },
  { type: 'info',    title: 'Sistem aktif',                  desc: 'Monitoring berjalan normal.',                                                          time: '08:00' },
]

export const parameters = [
  { label: 'PM2.5 (Debu)',   value: 18, unit: 'μg/m³', status: 'Baik' },
  { label: 'Asap Rokok',     value: 7,  unit: 'μg/m³', status: 'Baik' },
  { label: 'Asap Kendaraan', value: 12, unit: 'μg/m³', status: 'Baik' },
  { label: 'Suhu',           value: 28, unit: '°C',     status: null   },
  { label: 'Kelembapan',     value: 65, unit: '%',      status: null   },
]

export const systemStatus = [
  { label: 'Koneksi Internet',  status: 'Terhubung', tone: 'green' },
  { label: 'Sensor Sharp GP2Y', status: 'Terhubung', tone: 'green' },
  { label: 'ESP32',             status: 'Aktif',     tone: 'blue'  },
  { label: 'Daya Listrik',      status: 'Normal',    tone: 'green' },
]
