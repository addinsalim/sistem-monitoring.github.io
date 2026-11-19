import React from 'react'
import {
  Wind, CheckCircle2, Info, AlertTriangle, AlertOctagon, ShieldCheck
} from 'lucide-react'
import StatusBadge from './StatusBadge'
import { useTheme } from '../context/ThemeContext'

export const getContextualRecommendation = (pm25OrStatus) => {
  let cat = 'Baik'
  let val = typeof pm25OrStatus === 'number' ? pm25OrStatus : null

  if (typeof pm25OrStatus === 'string') {
    cat = pm25OrStatus
  } else if (val !== null) {
    if (val >= 200) cat = 'Sangat Tidak Sehat'
    else if (val >= 101) cat = 'Tidak Sehat'
    else if (val >= 51) cat = 'Sedang'
    else cat = 'Baik'
  }

  switch (cat) {
    case 'Baik':
      return {
        category: 'Baik (0 – 50 μg/m³)',
        text: 'Kualitas udara area parkir bersih dan aman. Aktivitas keluar-masuk kendaraan berjalan normal.',
        tone: 'green',
        icon: ShieldCheck,
        color: '#4ade80',
        lightColor: '#16a34a',
        bg: '#0d2620',
        lightBg: '#f0fdf4',
        border: '#1a5940',
        lightBorder: '#bbf7d0',
      }
    case 'Sedang':
      return {
        category: 'Sedang (51 – 100 μg/m³)',
        text: 'Kualitas udara masih dapat diterima. Pastikan sirkulasi udara area parkir tetap terbuka.',
        tone: 'amber',
        icon: Info,
        color: '#fbbf24',
        lightColor: '#d97706',
        bg: '#2a1f0e',
        lightBg: '#fffbeb',
        border: '#5c3d18',
        lightBorder: '#fde68a',
      }
    case 'Tidak Sehat':
      return {
        category: 'Tidak Sehat (101 – 199 μg/m³)',
        text: 'Peringatan: Konsentrasi debu meningkat. Disarankan menggunakan masker di area parkir & matikan mesin kendaraan saat menunggu.',
        tone: 'orange',
        icon: AlertTriangle,
        color: '#fb923c',
        lightColor: '#ea580c',
        bg: '#31160e',
        lightBg: '#fff7ed',
        border: '#7c2d12',
        lightBorder: '#fdba74',
      }
    case 'Sangat Tidak Sehat':
    case 'Berbahaya':
    default:
      return {
        category: 'Sangat Tidak Sehat (≥ 200 μg/m³)',
        text: 'Bahaya: Polusi partikel tinggi! Hindari berada terlalu lama di area parkir, wajib gunakan masker, dan kurangi kepadatan kendaraan.',
        tone: 'red',
        icon: AlertOctagon,
        color: '#f87171',
        lightColor: '#dc2626',
        bg: '#2e1215',
        lightBg: '#fef2f2',
        border: '#7f1d1d',
        lightBorder: '#fca5a5',
      }
  }
}

export function QualityCard({ status = 'Baik', pm25 = 18, desc }) {
  const { isDark } = useTheme()
  const rec = getContextualRecommendation(pm25 || status)
  const Icon = rec.icon

  return (
    <article className="sensor-card quality-main-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="quality-card-icon"><Wind size={26} /></div>
        <div className="quality-card-body">
          <div className="quality-label">Kategori ISPU Saat Ini</div>
          <div className="quality-value" style={{ color: isDark ? rec.color : rec.lightColor, fontSize: 20 }}>
            {status}
          </div>
          <p className="quality-desc" style={{ fontSize: 9.5 }}>{desc || rec.category}</p>
        </div>
      </div>

      {/* Kotak Rekomendasi Tindakan Kontekstual */}
      <div
        className="action-recommendation-box"
        style={{
          marginTop: 12,
          padding: '8px 10px',
          borderRadius: 8,
          background: isDark ? rec.bg : rec.lightBg,
          border: `1px solid ${isDark ? rec.border : rec.lightBorder}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
        }}
      >
        <Icon size={14} style={{ color: isDark ? rec.color : rec.lightColor, flexShrink: 0, marginTop: 2 }} />
        <p style={{
          margin: 0,
          fontSize: 9.5,
          lineHeight: 1.45,
          color: isDark ? '#e6f2ff' : '#0f172a',
          fontWeight: 500,
        }}>
          <b>Tindakan:</b> {rec.text}
        </p>
      </div>
    </article>
  )
}

export function ActionRecommendationBanner({ pm25 = 18, status = 'Baik' }) {
  const { isDark } = useTheme()
  const rec = getContextualRecommendation(pm25 || status)
  const Icon = rec.icon

  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: 10,
        background: isDark ? rec.bg : rec.lightBg,
        border: `1px solid ${isDark ? rec.border : rec.lightBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          display: 'grid',
          placeItems: 'center',
          background: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.7)',
          color: isDark ? rec.color : rec.lightColor,
          flexShrink: 0,
        }}>
          <Icon size={18} />
        </div>
        <div>
          <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: isDark ? rec.color : rec.lightColor, display: 'block' }}>
            Rekomendasi Tindakan Cepat (Area Parkir)
          </span>
          <span style={{ fontSize: 11, color: isDark ? '#f0f7ff' : '#0f172a', fontWeight: 500 }}>
            {rec.text}
          </span>
        </div>
      </div>
      <span className={`status-badge badge-${rec.tone}`}>
        {status} ({rec.category})
      </span>
    </div>
  )
}

export function MetricSensorCard({ label, icon: Icon, value, unit, status, tone = 'green' }) {
  return (
    <article className="sensor-card metric-sensor-card">
      <div className="mscard-icon"><Icon size={22} /></div>
      <div className="mscard-label">{label}</div>
      <div className="mscard-value">{value}<span className="mscard-unit"> {unit}</span></div>
      {status && <StatusBadge label={status} tone={tone} />}
    </article>
  )
}

export function HistoryStat({ icon: Icon, label, value, unit, tone = 'blue' }) {
  return (
    <div className={`hist-stat-card hist-stat-${tone}`}>
      <div className="hist-stat-icon">
        <Icon size={16} />
      </div>
      <div className="hist-stat-body">
        <div className="hist-stat-label">{label}</div>
        <div className="hist-stat-value">
          {value}<span className="hist-stat-unit"> {unit}</span>
        </div>
      </div>
    </div>
  )
}
