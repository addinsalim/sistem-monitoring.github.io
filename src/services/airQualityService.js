import { chartData, history, dailySummary, parameters, systemStatus, notifications } from '../data/mockData'

const DEFAULT_API_BASE = 'http://localhost/stikom-air-quality-frontend/api'

export const airQualityService = {
  /**
   * Mengambil konfigurasi aktif dari localStorage atau default
   */
  getConfig() {
    try {
      const saved = localStorage.getItem('airwatch_config')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Gagal memuat konfigurasi dari storage:', e)
    }

    return {
      deviceId: 'parkir-esp32-01',
      lokasi: 'Area Parkir STIKOM El Rahma Bogor',
      interval: '10',
      mode: 'simulasi',
      apiUrl: DEFAULT_API_BASE,
    }
  },

  /**
   * Mengambil pembacaan sensor terbaru.
   * Mencoba fetch ke REST API MySQL XAMPP. Jika offline, fallback ke simulasi dinamis.
   */
  async getLatestTelemetry() {
    const config = this.getConfig()

    try {
      const baseUrl = config.apiUrl || DEFAULT_API_BASE
      const response = await fetch(`${baseUrl}/latest.php`, {
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(2500),
      })
      if (response.ok) {
        const json = await response.json()
        if (json.status === 'success' && json.data) {
          return { ...json.data, isLive: true }
        }
      }
    } catch (err) {
      // Backend belum aktif / offline, beralih ke simulasi
    }

    // Dynamic mock fallback
    const variation = Math.sin(Date.now() / 5000) * 6
    const pm25 = Math.max(10, Math.round(18 + variation + (Math.random() * 4 - 2)))
    const asapRokok = Math.max(2, Math.round(7 + (variation * 0.4) + (Math.random() * 2 - 1)))
    const asapKendaraan = Math.max(4, Math.round(12 + (variation * 0.6) + (Math.random() * 2.5 - 1.2)))
    const status = pm25 > 55 ? 'Tidak Sehat' : pm25 > 35 ? 'Sedang' : 'Baik'

    return {
      pm25,
      asapRokok,
      asapKendaraan,
      suhu: 28,
      kelembapan: 65,
      status,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      isLive: false,
    }
  },

  /**
   * Mengambil riwayat log data sensor
   */
  async getHistory(filters = {}) {
    const config = this.getConfig()
    try {
      const baseUrl = config.apiUrl || DEFAULT_API_BASE
      const queryParams = new URLSearchParams()
      if (filters.status && filters.status !== 'Semua') queryParams.append('status', filters.status)
      if (filters.date && filters.date !== 'Semua') queryParams.append('date', filters.date)
      if (filters.q) queryParams.append('q', filters.q)
      if (filters.limit) queryParams.append('limit', filters.limit)

      const url = `${baseUrl}/history.php${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) })
      if (response.ok) {
        const json = await response.json()
        if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
          return json.data
        }
      }
    } catch (err) {
      // Fallback ke mock
    }
    return history
  },

  /**
   * Mengambil ringkasan harian untuk grafik tren
   */
  async getDailySummary() {
    const config = this.getConfig()
    try {
      const baseUrl = config.apiUrl || DEFAULT_API_BASE
      const response = await fetch(`${baseUrl}/daily-summary.php`, { signal: AbortSignal.timeout(2500) })
      if (response.ok) {
        const json = await response.json()
        if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
          return json.data
        }
      }
    } catch (err) {
      // Fallback ke mock
    }
    return dailySummary
  },

  /**
   * Mengambil data chart 24 jam
   */
  async getChart24h() {
    return chartData
  },

  /**
   * Mengambil notifikasi sistem
   */
  async getNotifications() {
    return notifications
  },

  /**
   * Mengambil status diagnostik sistem
   */
  async getSystemStatus() {
    return systemStatus
  },
}
