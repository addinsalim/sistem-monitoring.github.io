import React from 'react'
import { Wind } from 'lucide-react'
import StatusBadge from './StatusBadge'

export function QualityCard({ status = 'Baik', desc = 'Kondisi udara di area parkir masih dalam batas aman.' }) {
  const toneMap = {
    Baik: 'green',
    Sedang: 'amber',
    'Tidak Sehat': 'red',
  }
  const tone = toneMap[status] || 'green'

  return (
    <article className="sensor-card quality-main-card">
      <div className="quality-card-icon"><Wind size={28} /></div>
      <div className="quality-card-body">
        <div className="quality-label">Kualitas Udara</div>
        <div className="quality-value" style={{ color: tone === 'green' ? '#4ade80' : tone === 'amber' ? '#fbbf24' : '#f87171' }}>
          {status}
        </div>
        <p className="quality-desc">{desc}</p>
      </div>
    </article>
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

export function HistoryStat({ icon: Icon, label, value, unit, tone }) {
  const colors = {
    blue:   { bg: '#0e2240', border: '#1d4a72', icon: '#38bdf8', val: '#7dd3fc' },
    green:  { bg: '#0d2620', border: '#1a5940', icon: '#4ade80', val: '#86efac' },
    amber:  { bg: '#2a1f0e', border: '#5c3d18', icon: '#fbbf24', val: '#fcd34d' },
    purple: { bg: '#1c1040', border: '#3b2080', icon: '#a78bfa', val: '#c4b5fd' },
  }
  const c = colors[tone] || colors.blue

  return (
    <div className="hist-stat-card" style={{ background: c.bg, borderColor: c.border }}>
      <div className="hist-stat-icon" style={{ color: c.icon }}>
        <Icon size={16} />
      </div>
      <div className="hist-stat-body">
        <div className="hist-stat-label">{label}</div>
        <div className="hist-stat-value" style={{ color: c.val }}>
          {value}<span className="hist-stat-unit"> {unit}</span>
        </div>
      </div>
    </div>
  )
}

