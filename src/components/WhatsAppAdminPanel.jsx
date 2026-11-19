import React, { useState, useEffect } from 'react'
import {
  MessageSquare, Send, ShieldCheck, CheckCircle2,
  AlertCircle, RefreshCw, Trash2, Key, Phone, BellRing
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import {
  getWhatsAppConfig, saveWhatsAppConfig, getWhatsAppLogs,
  sendWhatsAppMessage, formatAlertMessage, clearWhatsAppLogs
} from '../services/whatsappService'

export default function WhatsAppAdminPanel() {
  const { isDark } = useTheme()
  const [config, setConfig] = useState(getWhatsAppConfig)
  const [logs, setLogs] = useState([])
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  useEffect(() => {
    setLogs(getWhatsAppLogs())
  }, [])

  const handleChange = (field, value) => {
    const updated = { ...config, [field]: value }
    setConfig(updated)
    saveWhatsAppConfig(updated)
  }

  const handleTestSend = async () => {
    if (!config.target) {
      setFeedback({ type: 'error', message: 'Nomor WhatsApp tujuan wajib diisi.' })
      setTimeout(() => setFeedback({ type: '', message: '' }), 3500)
      return
    }

    setSending(true)
    setFeedback({ type: '', message: '' })

    const testMsg = formatAlertMessage({
      pm25: 168,
      status: 'Sangat Tidak Sehat',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      isTest: true,
    })

    try {
      const res = await sendWhatsAppMessage({
        target: config.target,
        message: testMsg,
        token: config.token,
      })

      if (res.success) {
        setFeedback({
          type: 'success',
          message: res.isSimulation
            ? `[Mode Simulasi Demo] Notifikasi berhasil disimulasikan ke nomor ${config.target}!`
            : `Pesan peringatan WhatsApp berhasil dikirim via Fonnte Gateway ke ${config.target}!`,
        })
      } else {
        setFeedback({ type: 'error', message: res.message || 'Gagal mengirim pesan WhatsApp.' })
      }
    } catch (e) {
      setFeedback({ type: 'error', message: 'Terjadi kesalahan jaringan saat memanggil Fonnte API.' })
    } finally {
      setSending(false)
      setLogs(getWhatsAppLogs())
      setTimeout(() => setFeedback({ type: '', message: '' }), 5000)
    }
  }

  const handleClearLogs = () => {
    clearWhatsAppLogs()
    setLogs([])
    setFeedback({ type: 'success', message: 'Riwayat log pengiriman notifikasi telah dibersihkan.' })
    setTimeout(() => setFeedback({ type: '', message: '' }), 3000)
  }

  return (
    <article className="panel wa-admin-panel" style={{ padding: 22, marginBottom: 16 }}>
      {/* Header */}
      <div className="panel-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <h2>
          <MessageSquare size={15} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: '#22c55e' }} />
          Pusat Peringatan Dini WhatsApp (Fonnte Gateway)
        </h2>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 9.5,
          fontWeight: 700,
          padding: '3px 9px',
          borderRadius: 20,
          background: isDark ? '#143825' : '#dcfce7',
          color: isDark ? '#4ade80' : '#15803d',
          border: isDark ? '1px solid #1a5937' : '1px solid #86efac',
        }}>
          <ShieldCheck size={12} /> Fitur Khusus Administrator
        </span>
      </div>

      <p style={{ margin: '0 0 16px', fontSize: 11, color: isDark ? '#8ca4c3' : '#64748b' }}>
        Sistem otomatis mengirimkan pesan darurat ke nomor WhatsApp petugas keamanan / pengelola jika konsentrasi debu melebihi batas aman secara berturut-turut.
      </p>

      {/* Feedback Toast */}
      {feedback.message && (
        <div
          className={feedback.type === 'success' ? 'export-toast' : 'login-alert-error'}
          style={{ marginBottom: 14 }}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Form Konfigurasi Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 16 }}>
        <div>
          <label className="setting-label">Nomor WhatsApp Tujuan (Penerima Alert)</label>
          <div className="login-input-wrap">
            <Phone size={14} className="login-field-icon" />
            <input
              type="text"
              placeholder="Contoh: 081234567890"
              value={config.target ?? ''}
              onChange={e => handleChange('target', e.target.value)}
              className="login-input"
            />
          </div>
          <small style={{ fontSize: 9, color: isDark ? '#6a85a4' : '#64748b', marginTop: 3, display: 'block' }}>
            Nomor ponsel petugas keamanan atau pengelola parkir STIKOM El Rahma.
          </small>
        </div>

        <div>
          <label className="setting-label">Token API Fonnte (Gateway)</label>
          <div className="login-input-wrap">
            <Key size={14} className="login-field-icon" />
            <input
              type="password"
              placeholder="Masukkan Token dari fonnte.com"
              value={config.token ?? ''}
              onChange={e => handleChange('token', e.target.value)}
              className="login-input"
            />
          </div>
          <small style={{ fontSize: 9, color: isDark ? '#6a85a4' : '#64748b', marginTop: 3, display: 'block' }}>
            Tersimpan aman di LocalStorage browser (tidak terekspos di source code).
          </small>
        </div>

        <div>
          <label className="setting-label">Ambang Batas Peringatan Darurat (μg/m³)</label>
          <input
            type="number"
            min="50"
            max="300"
            value={config.threshold ?? 150}
            onChange={e => handleChange('threshold', e.target.value)}
            className="setting-input"
          />
          <small style={{ fontSize: 9, color: isDark ? '#6a85a4' : '#64748b', marginTop: 3, display: 'block' }}>
            Bawaan: 150 μg/m³ (Kategori Sangat Tidak Sehat).
          </small>
        </div>

        <div>
          <label className="setting-label">Status Otomatisasi Alert</label>
          <select
            value={config.autoAlertEnabled ? 'true' : 'false'}
            onChange={e => handleChange('autoAlertEnabled', e.target.value === 'true')}
            className="setting-input"
          >
            <option value="true">Aktif (Kirim pesan saat debu tinggi)</option>
            <option value="false">Nonaktif (Hanya kirim saat tombol tes ditekan)</option>
          </select>
          <small style={{ fontSize: 9, color: isDark ? '#6a85a4' : '#64748b', marginTop: 3, display: 'block' }}>
            Interval cooldown: 5 menit (mencegah spam berulang).
          </small>
        </div>
      </div>

      {/* Action Buttons: Kirim Tes & Bersihkan Log */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <button
          type="button"
          onClick={handleTestSend}
          disabled={sending}
          className="primary-button"
          style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', borderColor: '#22c55e' }}
        >
          {sending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
          {sending ? 'Mengirim Peringatan...' : 'Kirim Tes Peringatan WhatsApp'}
        </button>

        {logs.length > 0 && (
          <button
            type="button"
            onClick={handleClearLogs}
            className="reset-button"
            style={{ padding: '8px 14px', borderRadius: 8, fontSize: 10.5, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Trash2 size={13} /> Bersihkan Log WhatsApp
          </button>
        )}
      </div>

      {/* Tabel Log Pengiriman WhatsApp */}
      <div style={{ borderTop: isDark ? '1px solid #1c2e47' : '1px solid #e2e8f0', paddingTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <b style={{ fontSize: 11, color: isDark ? '#e0eeff' : '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
            <BellRing size={13} style={{ color: '#38bdf8' }} /> Log Riwayat Notifikasi Terkirim ({logs.length})
          </b>
          <span style={{ fontSize: 9.5, color: '#7a96b6' }}>Pembaruan real-time</span>
        </div>

        {logs.length === 0 ? (
          <div style={{
            padding: '24px',
            textAlign: 'center',
            fontSize: 10.5,
            color: isDark ? '#6c85a4' : '#64748b',
            background: isDark ? '#0b1627' : '#f8fafc',
            borderRadius: 8,
            border: isDark ? '1px dashed #1d3350' : '1px dashed #cbd5e1',
          }}>
            Belum ada riwayat notifikasi WhatsApp yang dikirim. Klik tombol <b>"Kirim Tes Peringatan WhatsApp"</b> di atas untuk mencoba.
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Waktu Pengiriman</th>
                  <th>Nomor Tujuan</th>
                  <th>Status Gateway</th>
                  <th>Ringkasan Pesan</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 5).map(l => (
                  <tr key={l.id}>
                    <td className="table-time" style={{ fontSize: 10 }}>{l.timestamp}</td>
                    <td style={{ fontSize: 10, fontWeight: 600 }}>{l.target}</td>
                    <td>
                      <span className={`status-badge ${l.success ? 'badge-green' : 'badge-amber'}`}>
                        {l.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 9.5, color: isDark ? '#9db5d0' : '#475569', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {l.preview}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </article>
  )
}
