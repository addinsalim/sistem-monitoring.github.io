// Data simulasi dinamis tersinkronisasi dengan waktu nyata dunia nyata.

// Helper tanggal relatif berdasarkan jam & tanggal sistem lokal
function getRelativeDate(daysAgo = 0) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d
}

function formatDateID(d) {
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDayMonthID(d) {
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}

// ─── Chart Data 24 Jam Terakhir (8 interval 3 jam sampai jam sekarang) ───
export const getDynamicChartData = () => {
  const data = []
  const now = new Date()
  const currentHour = now.getHours()

  for (let i = 7; i >= 0; i--) {
    let targetHour = currentHour - (i * 3)
    let displayHour = (targetHour % 24 + 24) % 24
    const hourStr = String(displayHour).padStart(2, '0') + ':00'

    // Pola simulasi realistis: polutan lebih tinggi pada siang hari (11:00 - 15:00) saat parkir ramai
    const isPeak = displayHour >= 11 && displayHour <= 16
    const isMorningPeak = displayHour >= 7 && displayHour <= 9
    const factor = isPeak ? 1.6 : (isMorningPeak ? 1.2 : 0.8)

    const pm25 = Math.round(25 * factor + (Math.sin(displayHour) * 6))
    const asapRokok = Math.round(7 * factor + (Math.cos(displayHour) * 2))
    const asapKendaraan = Math.round(13 * factor + (Math.sin(displayHour * 1.5) * 3))

    data.push({
      time: hourStr,
      pm25: Math.max(10, pm25),
      asapRokok: Math.max(3, asapRokok),
      asapKendaraan: Math.max(5, asapKendaraan),
    })
  }
  return data
}

export const chartData = getDynamicChartData()

// ─── Riwayat Dinamis (7 Hari Terakhir sampai Hari Ini) ───
export const getDynamicHistory = () => {
  const records = []
  const timeSlots = [
    { time: '07:30', pmBase: 15, rBase: 4,  kBase: 7,  suhu: 27, rh: 69, status: 'Baik' },
    { time: '09:30', pmBase: 28, rBase: 8,  kBase: 14, suhu: 29, rh: 64, status: 'Baik' },
    { time: '12:00', pmBase: 48, rBase: 12, kBase: 24, suhu: 33, rh: 57, status: 'Sedang' },
    { time: '14:30', pmBase: 36, rBase: 9,  kBase: 18, suhu: 32, rh: 59, status: 'Baik' },
    { time: '17:00', pmBase: 56, rBase: 15, kBase: 29, suhu: 30, rh: 63, status: 'Sedang' },
    { time: '19:30', pmBase: 20, rBase: 5,  kBase: 10, suhu: 28, rh: 68, status: 'Baik' },
  ]

  // Dari hari ini (day 0) mundur sampai 6 hari yang lalu
  for (let day = 0; day <= 6; day++) {
    const d = getRelativeDate(day)
    const dateFormatted = formatDateID(d)

    timeSlots.forEach((slot, index) => {
      // Sedikit variasi acak deterministik per hari
      const variation = Math.sin(day * 2 + index) * 5
      const pm25 = Math.max(10, Math.round(slot.pmBase + variation))
      const asapRokok = Math.max(2, Math.round(slot.rBase + variation * 0.3))
      const asapKendaraan = Math.max(4, Math.round(slot.kBase + variation * 0.5))
      const status = pm25 > 55 ? 'Sedang' : (pm25 > 35 ? 'Sedang' : 'Baik')

      records.push({
        date: dateFormatted,
        time: `${dateFormatted} · ${slot.time}`,
        pm25,
        asapRokok,
        asapKendaraan,
        suhu: slot.suhu,
        kelembapan: slot.rh,
        status,
      })
    })
  }

  return records
}

export const history = getDynamicHistory()

// ─── Daily Summary Dinamis (7 Hari Terakhir) ───
export const getDynamicDailySummary = () => {
  const days = []
  for (let day = 6; day >= 0; day--) {
    const d = getRelativeDate(day)
    const variation = Math.sin(day * 1.5) * 6
    const pm25Avg = Math.round(30 + variation)
    const asapRokokAvg = Math.round(8 + variation * 0.25)
    const asapKendaraanAvg = Math.round(16 + variation * 0.45)
    const maxPm25 = Math.round(pm25Avg + 15 + Math.abs(variation))

    days.push({
      date: formatDayMonthID(d),
      pm25Avg,
      asapRokokAvg,
      asapKendaraanAvg,
      maxPm25,
    })
  }
  return days
}

export const dailySummary = getDynamicDailySummary()

// ─── Notifikasi Waktu Realistis ───
const nowTime = new Date()
const formatNotifTime = (minutesAgo) => {
  const d = new Date(Date.now() - minutesAgo * 60 * 1000)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export const notifications = [
  {
    type: 'success',
    title: 'Kondisi udara normal',
    desc: 'Semua parameter kualitas udara di area parkir dalam batas aman.',
    time: formatNotifTime(15),
  },
  {
    type: 'warning',
    title: 'Peningkatan PM2.5 terdeteksi',
    desc: 'Nilai PM2.5 meningkat sementara menjadi 45 μg/m³ saat jam sibuk.',
    time: formatNotifTime(120),
  },
  {
    type: 'info',
    title: 'Sistem monitoring aktif',
    desc: 'Monitoring telemetri sensor berjalan lancar dan terhubung.',
    time: formatNotifTime(360),
  },
]

export const parameters = [
  { label: 'PM2.5 (Debu)',   value: 18, unit: 'μg/m³', status: 'Baik' },
  { label: 'Asap Rokok',     value: 7,  unit: 'μg/m³', status: 'Baik' },
  { label: 'Asap Kendaraan', value: 12, unit: 'μg/m³', status: 'Baik' },
  { label: 'Suhu',           value: 28, unit: '°C',     status: null   },
  { label: 'Kelembapan',     value: 65, unit: '%',      status: null   },
]

export const systemStatus = [
  { label: 'Koneksi Jaringan',  status: 'Terhubung', tone: 'green' },
  { label: 'Sensor Sharp GP2Y', status: 'Terhubung', tone: 'green' },
  { label: 'Sensor MQ-2 & DHT', status: 'Terhubung', tone: 'green' },
  { label: 'Mikrokontroler ESP32', status: 'Aktif',  tone: 'blue'  },
  { label: 'Catu Daya Listrik', status: 'Normal',    tone: 'green' },
]
