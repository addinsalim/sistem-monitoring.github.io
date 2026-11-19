// Layanan Integrasi WhatsApp Gateway (Fonnte) untuk Sistem AirWatch STIKOM El Rahma

const DEFAULT_CONFIG = {
  token: '',
  target: '081298765432',
  threshold: 150, // μg/m³ (Batas Tidak Sehat)
  autoAlertEnabled: true,
  cooldownMinutes: 5,
}

export const getWhatsAppConfig = () => {
  try {
    const saved = localStorage.getItem('airwatch_wa_config')
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.warn('Gagal membaca konfigurasi WhatsApp:', e)
  }
  return DEFAULT_CONFIG
}

export const saveWhatsAppConfig = (cfg) => {
  try {
    localStorage.setItem('airwatch_wa_config', JSON.stringify(cfg))
  } catch (e) {
    console.warn('Gagal menyimpan konfigurasi WhatsApp:', e)
  }
}

export const getWhatsAppLogs = () => {
  try {
    const logs = localStorage.getItem('airwatch_wa_logs')
    if (logs) return JSON.parse(logs)
  } catch (e) {
    console.warn('Gagal membaca log WhatsApp:', e)
  }
  return []
}

export const addWhatsAppLog = (entry) => {
  try {
    const current = getWhatsAppLogs()
    const updated = [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' }),
        ...entry,
      },
      ...current,
    ].slice(0, 50) // Simpan 50 log terbaru
    localStorage.setItem('airwatch_wa_logs', JSON.stringify(updated))
    return updated
  } catch (e) {
    console.warn('Gagal menambahkan log WhatsApp:', e)
    return []
  }
}

export const clearWhatsAppLogs = () => {
  localStorage.removeItem('airwatch_wa_logs')
}

// Format template pesan peringatan dini standar
export const formatAlertMessage = ({ pm25, status, time, location = 'Area Parkir STIKOM El Rahma Bogor', isTest = false }) => {
  const header = isTest
    ? '🚨 *[TEST PERINGATAN AIRWATCH - STIKOM EL RAHMA]*'
    : '⚠️ *PERINGATAN DINI KUALITAS UDARA - STIKOM EL RAHMA*'

  return `${header}

📍 *Lokasi:* ${location}
⏰ *Waktu:* ${time || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'}
📊 *Konsentrasi Debu (PM2.5):* ${pm25} μg/m³
🏷️ *Kategori ISPU:* ${status || (pm25 > 150 ? 'Sangat Tidak Sehat' : pm25 > 100 ? 'Tidak Sehat' : 'Sedang')}

📋 *Saran Tindakan Cepat:*
1. Nyalakan sirkulasi / blower area parkir.
2. Himbau mahasiswa dan tamu untuk mematikan mesin kendaraan saat memarkir.
3. Petugas keamanan disarankan menggunakan masker standar respiratori.
4. Kurangi antrean kendaraan pada gerbang masuk/keluar parkir.

_Pesan otomatis dikirim oleh Sistem Monitoring AirWatch (ESP32 + Sharp GP2Y)._`
}

// Kirim pesan WhatsApp melalui Fonnte API
export const sendWhatsAppMessage = async ({ target, message, token }) => {
  const cfg = getWhatsAppConfig()
  const activeToken = token || cfg.token
  const activeTarget = target || cfg.target

  if (!activeTarget) {
    return { success: false, message: 'Nomor WhatsApp tujuan belum diisi.' }
  }

  // Jika token Fonnte asli diisi, kirim langsung ke endpoint resmi Fonnte
  if (activeToken && activeToken.trim() !== '' && activeToken !== 'WHATSAPP_API_TOKEN') {
    try {
      const formData = new FormData()
      formData.append('target', activeTarget)
      formData.append('message', message)
      formData.append('countryCode', '62') // Default kode negara Indonesia

      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          Authorization: activeToken,
        },
        body: formData,
      })

      const data = await response.json()

      if (data.status) {
        addWhatsAppLog({
          target: activeTarget,
          status: 'Terkirim (Fonnte API)',
          success: true,
          preview: message.slice(0, 90) + '...',
        })
        return { success: true, message: 'Pesan WhatsApp berhasil dikirim ke ' + activeTarget, data }
      } else {
        addWhatsAppLog({
          target: activeTarget,
          status: 'Gagal (' + (data.reason || 'Token / Kuota Fonnte Habis') + ')',
          success: false,
          preview: message.slice(0, 90) + '...',
        })
        return { success: false, message: data.reason || 'Gagal mengirim pesan melalui Fonnte.', data }
      }
    } catch (err) {
      console.warn('Fonnte fetch error:', err)
      // Fallback ke simulasi jika koneksi API gagal
      addWhatsAppLog({
        target: activeTarget,
        status: 'Gagal Koneksi API Fonnte',
        success: false,
        preview: message.slice(0, 90) + '...',
      })
      return { success: false, message: 'Gagal menghubungi server Fonnte (periksa koneksi internet).' }
    }
  }

  // Mode Simulasi (untuk demonstrasi / presentasi sebelum user memasukkan token riil)
  await new Promise(r => setTimeout(r, 600)) // delay realistis
  addWhatsAppLog({
    target: activeTarget,
    status: 'Simulasi Terkirim (Demo Gateway)',
    success: true,
    preview: message.slice(0, 90) + '...',
  })

  return {
    success: true,
    isSimulation: true,
    message: `[Simulasi Sukses] Peringatan berhasil diarahkan ke nomor ${activeTarget} (Silakan masukkan Fonnte Token riil untuk pengiriman langsung).`,
  }
}

// Logika pemantauan auto-alert dengan perlindungan anti-spam (cooldown)
let lastAlertTimestamp = 0

export const evaluateAndAutoAlert = async (currentPm25) => {
  const cfg = getWhatsAppConfig()
  if (!cfg.autoAlertEnabled) return null

  const threshold = Number(cfg.threshold) || 150
  if (currentPm25 <= threshold) return null

  const now = Date.now()
  const cooldownMs = (cfg.cooldownMinutes || 5) * 60 * 1000

  // Periksa apakah masih dalam masa cooldown
  if (now - lastAlertTimestamp < cooldownMs) {
    return null
  }

  lastAlertTimestamp = now
  const msg = formatAlertMessage({
    pm25: currentPm25,
    status: currentPm25 > 200 ? 'Sangat Tidak Sehat' : 'Tidak Sehat',
    isTest: false,
  })

  return await sendWhatsAppMessage({
    target: cfg.target,
    message: msg,
    token: cfg.token,
  })
}
