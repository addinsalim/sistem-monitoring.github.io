import React, { useState, useEffect } from 'react'
import {
  Cpu, ShieldCheck, Info, Save, RotateCcw, CheckCircle2,
  Wifi, RadioTower, Flame, Zap
} from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import StatusBadge from '../components/StatusBadge'
import { sysTones } from '../components/Panels'
import { systemStatus } from '../data/mockData'

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

  return (
    <div className="page-content">
      <SectionTitle
        eyebrow="CONFIG / SETTINGS"
        title="Pengaturan"
        description="Konfigurasi sistem monitoring, parameter perangkat, dan simulasi data."
      />

      {savedMsg && (
        <div className="export-toast" style={{ marginBottom: 16 }}>
          <CheckCircle2 size={14} /> {savedMsg}
        </div>
      )}

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
              <label style={{ display: 'block', fontSize: 10, color: '#7f96b5', marginBottom: 5 }}>
                ID Perangkat ESP32
              </label>
              <input
                type="text"
                value={config.deviceId ?? ''}
                onChange={e => handleChange('deviceId', e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #1e3553',
                  background: '#0d1a2d',
                  color: '#e8f2ff',
                  fontSize: 12
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, color: '#7f96b5', marginBottom: 5 }}>
                Lokasi Penempatan
              </label>
              <input
                type="text"
                value={config.lokasi ?? ''}
                onChange={e => handleChange('lokasi', e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #1e3553',
                  background: '#0d1a2d',
                  color: '#e8f2ff',
                  fontSize: 12
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, color: '#7f96b5', marginBottom: 5 }}>
                Interval Sampling Data
              </label>
              <select
                value={config.interval ?? '10'}
                onChange={e => handleChange('interval', e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #1e3553',
                  background: '#0d1a2d',
                  color: '#e8f2ff',
                  fontSize: 12
                }}
              >
                <option value="3" style={{ background: '#0d1a2d', color: '#e8f2ff' }}>3 Detik (Demo Cepat)</option>
                <option value="5" style={{ background: '#0d1a2d', color: '#e8f2ff' }}>5 Detik</option>
                <option value="10" style={{ background: '#0d1a2d', color: '#e8f2ff' }}>10 Detik (Standar ESP32)</option>
                <option value="30" style={{ background: '#0d1a2d', color: '#e8f2ff' }}>30 Detik (Hemat Daya)</option>
                <option value="60" style={{ background: '#0d1a2d', color: '#e8f2ff' }}>1 Menit</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, color: '#7f96b5', marginBottom: 5 }}>
                Mode Sumber Data
              </label>
              <select
                value={config.mode ?? 'simulasi'}
                onChange={e => handleChange('mode', e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #1e3553',
                  background: '#0d1a2d',
                  color: '#e8f2ff',
                  fontSize: 12
                }}
              >
                <option value="simulasi" style={{ background: '#0d1a2d', color: '#e8f2ff' }}>Simulasi Mock (Frontend Demo)</option>
                <option value="api" style={{ background: '#0d1a2d', color: '#e8f2ff' }}>Live REST API / WebSocket Backend</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, color: '#7f96b5', marginBottom: 5 }}>
                Endpoint Server Backend (REST API)
              </label>
              <input
                type="text"
                value={config.apiUrl ?? ''}
                onChange={e => handleChange('apiUrl', e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #1e3553',
                  background: '#0d1a2d',
                  color: '#e8f2ff',
                  fontSize: 12
                }}
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
                style={{
                  padding: '9px 14px',
                  borderRadius: 8,
                  border: '1px solid #213550',
                  background: '#101e33',
                  color: '#94a7c4',
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

          <div style={{ marginTop: 24, padding: 14, background: '#0a172a', borderRadius: 9, border: '1px solid #172a44' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8', display: 'block', marginBottom: 6 }}>
              Informasi Environment
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 10, color: '#7a92b2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Build Mode:</span>
                <span style={{ color: '#d0e3fc' }}>{import.meta.env.MODE || 'development'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Frontend Engine:</span>
                <span style={{ color: '#d0e3fc' }}>Vite + React 18</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Data Storage:</span>
                <span style={{ color: '#d0e3fc' }}>Browser LocalStorage</span>
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
