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

