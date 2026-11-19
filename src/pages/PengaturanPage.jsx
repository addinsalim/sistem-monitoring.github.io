import React, { useState, useEffect } from 'react'
import {
  Cpu, ShieldCheck, Info, Save, RotateCcw, CheckCircle2,
  Wifi, RadioTower, Flame, Zap, Sun, Moon, Monitor, Palette
} from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import StatusBadge from '../components/StatusBadge'
import { sysTones } from '../components/Panels'
import { systemStatus } from '../data/mockData'
import { useTheme } from '../context/ThemeContext'

// Map icon yang aman berdasarkan nama sistem
const sysIconMap = {
  'Koneksi Jaringan': Wifi,
  'Koneksi Internet': Wifi,
  'Sensor Sharp GP2Y': RadioTower,
  'Sensor MQ-2 & DHT': Flame,
  'Mikrokontroler ESP32': Cpu,
  'ESP32': Cpu,
  'Catu Daya Listrik': Zap,
  'Daya Listrik': Zap,
}

export default function PengaturanPage() {
  const { theme, themePreference, setThemePreference, isDark } = useTheme()

  const [config, setConfig] = useState({
    deviceId: 'parkir-esp32-01',
    lokasi: 'Area Parkir STIKOM El Rahma Bogor',
    interval: '10',
    mode: 'simulasi',
    apiUrl: 'http://localhost/stikom-air-quality-frontend/api',
    ssid: 'WIFI-KAMPUS-ELRAHMA',
  })

  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('airwatch_config')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') {
          setConfig(prev => ({ ...prev, ...parsed }))
        }
      } catch (e) {
        console.warn('Gagal membaca konfigurasi tersimpan:', e)
      }
    }
  }, [])

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = e => {
    e.preventDefault()
    localStorage.setItem('airwatch_config', JSON.stringify(config))
    setSavedMsg('Pengaturan berhasil disimpan ke penyimpanan lokal!')
    setTimeout(() => setSavedMsg(''), 3000)
  }

  const handleReset = () => {
    const defaultConfig = {
      deviceId: 'parkir-esp32-01',
      lokasi: 'Area Parkir STIKOM El Rahma Bogor',
      interval: '10',
      mode: 'simulasi',
      apiUrl: 'http://localhost/stikom-air-quality-frontend/api',
      ssid: 'WIFI-KAMPUS-ELRAHMA',
    }
    setConfig(defaultConfig)
    localStorage.removeItem('airwatch_config')
    setSavedMsg('Pengaturan telah dikembalikan ke bawaan pabrik.')
    setTimeout(() => setSavedMsg(''), 3000)
  }

  const themeOptions = [
    {
      id: 'dark',
      label: 'Mode Gelap (Dark)',
      desc: 'Tampilan biru navy gelap khas AirWatch, nyaman di mata saat minim cahaya.',
      icon: Moon,
      iconColor: '#38bdf8'
    },
    {
      id: 'light',
      label: 'Mode Terang (Light)',
      desc: 'Tampilan putih bersih dan cerah dengan kontras tinggi untuk siang hari.',
      icon: Sun,
      iconColor: '#f59e0b'
    },
    {
      id: 'system',
      label: 'Ikuti Sistem (Auto)',
      desc: 'Menyesuaikan otomatis dengan preferensi tema perangkat atau browser Anda.',
      icon: Monitor,
      iconColor: '#10b981'
    }
  ]

  return (
    <div className="page-content">
      <SectionTitle
        eyebrow="CONFIG / SETTINGS"
        title="Pengaturan"
        description="Konfigurasi preferensi tema tampilan, parameter perangkat, dan simulasi data."
      />

      {savedMsg && (
        <div className="export-toast" style={{ marginBottom: 16 }}>
          <CheckCircle2 size={14} /> {savedMsg}
        </div>
      )}

      {/* ── Panel Preferensi Tema (Fitur Terang / Gelap) ── */}
      <article className="panel" style={{ padding: 22, marginBottom: 16 }}>
        <div className="panel-heading">
          <h2>
            <Palette size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: '#38bdf8' }} />
            Preferensi Tampilan & Tema Website
          </h2>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 11, color: isDark ? '#8ca4c3' : '#64748b' }}>
          Pilih tema tampilan yang paling nyaman untuk Anda. Perubahan akan langsung diterapkan ke seluruh halaman sistem monitoring.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {themeOptions.map((opt) => {
            const Icon = opt.icon
            const isSelected = themePreference === opt.id

            return (
              <button
                key={opt.id}
                type="button"
                className={`theme-card-option ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  setThemePreference(opt.id)
                  setSavedMsg(`Tema tampilan berhasil diubah ke: ${opt.label}`)
                  setTimeout(() => setSavedMsg(''), 2500)
                }}
                style={{
                  textAlign: 'left',
                  padding: '16px',
                  borderRadius: 12,
                  border: isSelected
                    ? (isDark ? '2px solid #38bdf8' : '2px solid #0284c7')
                    : (isDark ? '1px solid #1c2f4a' : '1px solid #e2e8f0'),
                  background: isSelected
                    ? (isDark ? 'linear-gradient(135deg, #132e4e, #0e2038)' : 'linear-gradient(135deg, #f0f9ff, #e0f2fe)')
                    : (isDark ? '#0b182c' : '#ffffff'),
                  boxShadow: isSelected
                    ? (isDark ? '0 6px 20px rgba(56, 189, 248, 0.15)' : '0 6px 20px rgba(2, 132, 199, 0.12)')
                    : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    display: 'grid',
                    placeItems: 'center',
                    background: isDark ? '#142742' : '#f1f5f9',
                    color: opt.iconColor,
                    border: isDark ? '1px solid #1f3a5e' : '1px solid #e2e8f0'
                  }}>
                    <Icon size={18} />
                  </div>
                  {isSelected && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 20,
                      background: isDark ? '#134033' : '#dcfce7',
                      color: isDark ? '#4ade80' : '#15803d',
                      border: isDark ? '1px solid #1f6b55' : '1px solid #86efac'
                    }}>
                      <CheckCircle2 size={11} /> Aktif
                    </span>
                  )}
                </div>
                <b style={{
                  display: 'block',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: isDark ? '#f1f7ff' : '#0f172a',
                  marginBottom: 5
                }}>
                  {opt.label}
                </b>
                <span style={{
                  display: 'block',
                  fontSize: 10,
                  lineHeight: 1.5,
                  color: isDark ? '#7f96b5' : '#64748b'
                }}>
                  {opt.desc}
                </span>
              </button>
            )
          })}
        </div>
      </article>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 16 }}>
        {/* Panel Form Konfigurasi */}
        <article className="panel" style={{ padding: 22 }}>
          <div className="panel-heading">
            <h2>
              <Cpu size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              Konfigurasi Perangkat & Jaringan
            </h2>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="setting-label">
                ID Perangkat ESP32
              </label>
              <input
                type="text"
                className="setting-input"
                value={config.deviceId ?? ''}
                onChange={e => handleChange('deviceId', e.target.value)}
              />
            </div>

            <div>
              <label className="setting-label">
                Lokasi Penempatan
              </label>
              <input
                type="text"
                className="setting-input"
                value={config.lokasi ?? ''}
                onChange={e => handleChange('lokasi', e.target.value)}
              />
            </div>

            <div>
              <label className="setting-label">
                Interval Sampling Data
              </label>
              <select
                className="setting-input"
                value={config.interval ?? '10'}
                onChange={e => handleChange('interval', e.target.value)}
              >
                <option value="3">3 Detik (Demo Cepat)</option>
                <option value="5">5 Detik</option>
                <option value="10">10 Detik (Standar ESP32)</option>
                <option value="30">30 Detik (Hemat Daya)</option>
                <option value="60">1 Menit</option>
              </select>
            </div>

            <div>
              <label className="setting-label">
                Mode Sumber Data
              </label>
              <select
                className="setting-input"
                value={config.mode ?? 'simulasi'}
                onChange={e => handleChange('mode', e.target.value)}
              >
                <option value="simulasi">Simulasi Mock (Frontend Demo)</option>
                <option value="api">Live REST API / WebSocket Backend</option>
              </select>
            </div>

            <div>
              <label className="setting-label">
                Endpoint Server Backend (REST API)
              </label>
              <input
                type="text"
                className="setting-input"
                value={config.apiUrl ?? ''}
                onChange={e => handleChange('apiUrl', e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button
                type="submit"
                className="primary-button"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Save size={14} /> Simpan Pengaturan
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="reset-button"
                style={{
                  padding: '9px 14px',
                  borderRadius: 8,
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>
          </form>
        </article>

        {/* Panel Status Hardware & Koneksi */}
        <article className="panel" style={{ padding: 22 }}>
          <div className="panel-heading">
            <h2>
              <ShieldCheck size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              Status Diagnostik Sistem
            </h2>
          </div>
          <div className="system-list">
            {systemStatus.map((s) => {
              const Icon = sysIconMap[s.label] || Zap
              const tone = s.tone || sysTones[s.status] || 'green'
              return (
                <div className="system-row" key={s.label}>
                  <div className="system-left">
                    <div className="sys-ico"><Icon size={14} /></div>
                    <span>{s.label}</span>
                  </div>
                  <StatusBadge label={s.status} tone={tone} />
                </div>
              )
            })}
          </div>

          <div className="env-info-box">
            <span style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8', display: 'block', marginBottom: 6 }}>
              Informasi Environment
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 10, color: isDark ? '#7a92b2' : '#64748b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tema Aktif:</span>
                <span style={{ color: isDark ? '#d0e3fc' : '#0f172a', fontWeight: 600, textTransform: 'capitalize' }}>
                  {theme === 'dark' ? 'Gelap (Dark Mode)' : 'Terang (Light Mode)'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Build Mode:</span>
                <span style={{ color: isDark ? '#d0e3fc' : '#0f172a', fontWeight: 600 }}>{import.meta.env.MODE || 'development'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Frontend Engine:</span>
                <span style={{ color: isDark ? '#d0e3fc' : '#0f172a', fontWeight: 600 }}>Vite + React 18</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Data Storage:</span>
                <span style={{ color: isDark ? '#d0e3fc' : '#0f172a', fontWeight: 600 }}>Browser LocalStorage</span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="disclaimer">
        <Info size={14} />
        <span>Konfigurasi di atas tersimpan pada memori browser (Local Storage) dan dapat digunakan untuk integrasi ke backend API ketika fase backend dimulai.</span>
      </div>
    </div>
  )
}
