import React, { useState } from 'react'
import {
  Activity, BarChart2, Car, Flame, Gauge,
  Info, ShieldCheck, SlidersHorizontal
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, CartesianGrid,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
  ReferenceLine
} from 'recharts'
import SectionTitle from '../components/SectionTitle'
import StatusBadge from '../components/StatusBadge'
import { dailySummary } from '../data/mockData'

export default function GrafikPage() {
  // Ambang batas default (berdasarkan ISPU Indonesia kategori Baik/Sedang)
  const [batas, setBatas] = useState({
    pm25:          { baik: 35,  sedang: 75  },
    asapRokok:     { baik: 15,  sedang: 30  },
    asapKendaraan: { baik: 20,  sedang: 45  },
  })

  // Data grafik 24 jam terakhir yang dinamis mengikuti jam saat ini
  const generateHourlyData = () => {
    const data = []
    const now = new Date()
    const currentHour = now.getHours()

    for (let i = 23; i >= 0; i--) {
      const h = ((currentHour - i) % 24 + 24) % 24
      const timeStr = String(h).padStart(2, '0') + ':00'
      const isPeak = h >= 11 && h <= 16
      const isMorning = h >= 7 && h <= 9
      const factor = isPeak ? 1.6 : (isMorning ? 1.25 : 0.8)

      const pm25 = Math.max(8, Math.round(24 * factor + Math.sin(h * 0.8) * 8))
      const asapRokok = Math.max(2, Math.round(7 * factor + Math.cos(h * 0.8) * 3))
      const asapKendaraan = Math.max(4, Math.round(13 * factor + Math.sin(h * 1.2) * 5))

      data.push({ time: timeStr, pm25, asapRokok, asapKendaraan })
    }
    return data
  }

  const hourlyData = generateHourlyData()

  // Data bar chart per-hari (7 hari)
  const dailyBar = dailySummary

  // Tabel ISPU Indonesia (PM2.5 24-jam, berdasarkan PP No.22/2021 & PermenLHK 2021)
  const ispuTable = [
    { kategori: 'Baik',               range: '0 – 15.4',     pm25: '0–15.4',     warna: '#4ade80', textWarna: '#14532d', desc: 'Tingkat kualitas udara yang tidak memberikan efek bagi kesehatan manusia atau hewan dan tidak berpengaruh pada tumbuhan, bangunan, ataupun nilai estetika.' },
    { kategori: 'Sedang',             range: '15.5 – 55.4',  pm25: '15.5–55.4',  warna: '#fbbf24', textWarna: '#713f12', desc: 'Tingkat kualitas udara yang tidak berpengaruh pada kesehatan manusia ataupun hewan tetapi berpengaruh pada tumbuhan yang sensitif dan nilai estetika.' },
    { kategori: 'Tidak Sehat',        range: '55.5 – 150.4', pm25: '55.5–150.4', warna: '#fb923c', textWarna: '#7c2d12', desc: 'Tingkat kualitas udara yang bersifat merugikan pada manusia ataupun kelompok hewan yang sensitif atau dapat menimbulkan kerusakan pada tumbuhan ataupun nilai estetika.' },
    { kategori: 'Sangat Tidak Sehat', range: '150.5 – 250.4',pm25: '150.5–250.4',warna: '#f87171', textWarna: '#7f1d1d', desc: 'Tingkat kualitas udara yang dapat merugikan kesehatan pada sejumlah segmen populasi yang terpapar yaitu manusia dan hewan, atau dapat menimbulkan kerusakan pada tumbuhan.' },
    { kategori: 'Berbahaya',          range: '> 250.4',      pm25: '>250.4',     warna: '#a855f7', textWarna: '#3b0764', desc: 'Tingkat kualitas udara berbahaya yang secara umum dapat merugikan kesehatan yang serius pada populasi (manusia dan hewan).' },
  ]

  // Nilai sampel terkini untuk kartu status
  const live = { pm25: 18, asapRokok: 7, asapKendaraan: 12 }

  const paramDef = [
    { key: 'pm25',          label: 'PM2.5 (Debu)',   color: '#38bdf8', icon: Gauge, unit: 'μg/m³' },
    { key: 'asapRokok',     label: 'Asap Rokok',     color: '#a78bfa', icon: Flame, unit: 'μg/m³' },
    { key: 'asapKendaraan', label: 'Asap Kendaraan', color: '#34d399', icon: Car,   unit: 'μg/m³' },
  ]

  const getStatus = (val, key) => {
    if (val <= batas[key].baik)   return { label: 'Baik', tone: 'green' }
    if (val <= batas[key].sedang) return { label: 'Sedang', tone: 'amber' }
    return { label: 'Melebihi Batas', tone: 'red' }
  }

  const handleBatas = (param, level, val) => {
    const num = Math.max(0, Number(val))
    setBatas(prev => ({ ...prev, [param]: { ...prev[param], [level]: num } }))
  }

  const tooltipStyle = {
    borderRadius: 10,
    border: '1px solid #1e3152',
    background: '#0d1b31',
    color: '#d0e4ff',
    fontSize: 12
  }

  return (
    <div className="page-content">
      <SectionTitle
        eyebrow="CHARTS / THRESHOLDS"
        title="Grafik Kualitas Udara"
        description="Visualisasi tren polutan harian & per-jam beserta batasan ambang ISPU yang dapat dikonfigurasi."
      />

      {/* ── Status kartu per-parameter ── */}
      <div className="gkm-status-row">
        {paramDef.map(p => {
          const st = getStatus(live[p.key], p.key)
          const Icon = p.icon
          return (
            <div key={p.key} className="gkm-status-card" style={{ borderColor: p.color + '55' }}>
              <div className="gkm-sc-icon" style={{ color: p.color }}><Icon size={16} /></div>
              <div className="gkm-sc-body">
                <div className="gkm-sc-label">{p.label}</div>
                <div className="gkm-sc-val" style={{ color: p.color }}>
                  {live[p.key]} <span className="gkm-sc-unit">{p.unit}</span>
                </div>
              </div>
              <div className="gkm-sc-right">
                <StatusBadge label={st.label} tone={st.tone === 'red' ? 'amber' : st.tone} />
                <div className="gkm-sc-batas">Batas: {batas[p.key].baik}/{batas[p.key].sedang}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Konfigurasi Ambang Batas ── */}
      <article className="panel gkm-threshold-panel">
        <div className="panel-heading">
          <h2>
            <SlidersHorizontal size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
            Konfigurasi Ambang Batas Parameter
          </h2>
        </div>
        <div className="gkm-threshold-grid">
          {paramDef.map(p => (
            <div key={p.key} className="gkm-th-card" style={{ borderColor: p.color + '44' }}>
              <div className="gkm-th-header" style={{ color: p.color }}>
                <p.icon size={14} /><span>{p.label}</span>
              </div>
              <div className="gkm-th-inputs">
                <div className="gkm-th-field">
                  <label>Batas Baik (μg/m³)</label>
                  <div className="gkm-th-input-wrap" style={{ borderColor: '#4ade8055' }}>
                    <span className="gkm-th-dot" style={{ background: '#4ade80' }} />
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={batas[p.key].baik}
                      onChange={e => handleBatas(p.key, 'baik', e.target.value)}
                    />
                    <span className="gkm-th-unit">μg/m³</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={batas[p.key].baik}
                    onChange={e => handleBatas(p.key, 'baik', e.target.value)}
                    className="gkm-slider"
                    style={{ '--thumb-color': '#4ade80' }}
                  />
                </div>
                <div className="gkm-th-field">
                  <label>Batas Sedang (μg/m³)</label>
                  <div className="gkm-th-input-wrap" style={{ borderColor: '#fbbf2455' }}>
                    <span className="gkm-th-dot" style={{ background: '#fbbf24' }} />
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={batas[p.key].sedang}
                      onChange={e => handleBatas(p.key, 'sedang', e.target.value)}
                    />
                    <span className="gkm-th-unit">μg/m³</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={batas[p.key].sedang}
                    onChange={e => handleBatas(p.key, 'sedang', e.target.value)}
                    className="gkm-slider"
                    style={{ '--thumb-color': '#fbbf24' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* ── Grafik gabungan 24 jam ── */}
      <article className="panel gkm-chart-panel">
        <div className="panel-heading">
          <h2>
            <Activity size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
            Tren Konsentrasi Polutan (24 Jam Terakhir)
          </h2>
        </div>
        <div className="gkm-chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData} margin={{ top: 8, right: 20, left: 4, bottom: 0 }}>
              <CartesianGrid stroke="#1e3152" strokeDasharray="4 6" vertical={false} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6b82a0', fontSize: 10 }} dy={8} interval={2} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b82a0', fontSize: 10 }}
                domain={[0, 100]}
                width={44}
                label={{ value: 'μg/m³', angle: -90, position: 'insideLeft', offset: 14, style: { fill: '#5a718f', fontSize: 9 } }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v, name) => [`${v} μg/m³`, name === 'pm25' ? 'PM2.5' : name === 'asapRokok' ? 'Asap Rokok' : 'Asap Kendaraan']}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={v => v === 'pm25' ? 'PM2.5 (Debu)' : v === 'asapRokok' ? 'Asap Rokok' : 'Asap Kendaraan'}
                wrapperStyle={{ fontSize: 10, color: '#8097b8', paddingTop: 6 }}
              />
              <ReferenceLine
                y={batas.pm25.baik}
                stroke="#4ade8088"
                strokeDasharray="6 3"
                label={{ value: `PM2.5 Baik (${batas.pm25.baik})`, position: 'insideTopRight', fontSize: 8, fill: '#4ade80' }}
              />
              <ReferenceLine
                y={batas.pm25.sedang}
                stroke="#fbbf2488"
                strokeDasharray="6 3"
                label={{ value: `PM2.5 Sedang (${batas.pm25.sedang})`, position: 'insideTopRight', fontSize: 8, fill: '#fbbf24' }}
              />
              <Line type="monotone" dataKey="pm25"          stroke="#38bdf8" strokeWidth={2} dot={{ r: 2, fill: '#38bdf8', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="asapRokok"     stroke="#a78bfa" strokeWidth={2} dot={{ r: 2, fill: '#a78bfa', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="asapKendaraan" stroke="#34d399" strokeWidth={2} dot={{ r: 2, fill: '#34d399', strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="gkm-legend-note">
          <span style={{ color: '#4ade80' }}>┅</span> Batas Baik PM2.5 ({batas.pm25.baik} μg/m³)
          <span style={{ color: '#fbbf24', marginLeft: 16 }}>┅</span> Batas Sedang PM2.5 ({batas.pm25.sedang} μg/m³)
        </div>
      </article>

      {/* ── Bar chart rata-rata harian ── */}
      <article className="panel gkm-chart-panel" style={{ marginBottom: 15 }}>
        <div className="panel-heading">
          <h2>
            <BarChart2 size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
            Rata-rata PM2.5 Harian (7 Hari Terakhir)
          </h2>
        </div>
        <div className="gkm-chart-wrap" style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyBar} margin={{ top: 8, right: 20, left: 4, bottom: 0 }}>
              <CartesianGrid stroke="#1e3152" strokeDasharray="4 6" vertical={false} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b82a0', fontSize: 10 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b82a0', fontSize: 10 }} domain={[0, 80]} width={44} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v, name) => [`${v} μg/m³`, name === 'pm25Avg' ? 'PM2.5 Avg' : name === 'asapRokokAvg' ? 'Asap Rokok Avg' : 'Asap Kendaraan Avg']}
              />
              <Legend
                iconType="square"
                iconSize={8}
                formatter={v => v === 'pm25Avg' ? 'PM2.5 Avg' : v === 'asapRokokAvg' ? 'Asap Rokok Avg' : 'Asap Kendaraan Avg'}
                wrapperStyle={{ fontSize: 10, color: '#8097b8', paddingTop: 6 }}
              />
              <ReferenceLine y={batas.pm25.baik} stroke="#4ade8077" strokeDasharray="5 3" />
              <ReferenceLine y={batas.pm25.sedang} stroke="#fbbf2477" strokeDasharray="5 3" />
              <Bar dataKey="pm25Avg" fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="asapRokokAvg" fill="#a78bfa" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="asapKendaraanAvg" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      {/* ── Tabel ISPU Indonesia ── */}
      <div className="info-section-label">
        <ShieldCheck size={14} />
        <span>Standar Kualitas Udara — ISPU Indonesia (PP No.22/2021)</span>
      </div>
      <article className="panel" style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
        <div className="table-scroll">
          <table className="ispu-table">
            <thead>
              <tr>
                <th>Kategori ISPU</th>
                <th>Rentang Nilai ISPU</th>
                <th>PM2.5 24-jam (μg/m³)</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {ispuTable.map(row => (
                <tr key={row.kategori}>
                  <td>
                    <span className="ispu-badge" style={{ background: row.warna + '22', color: row.warna, border: `1px solid ${row.warna}55` }}>
                      <span className="ispu-dot" style={{ background: row.warna }} />
                      {row.kategori}
                    </span>
                  </td>
                  <td><b className="raw-number">{row.range}</b></td>
                  <td><b className="raw-number">{row.pm25}</b></td>
                  <td><span style={{ fontSize: 9.5, color: '#7a95b3', lineHeight: 1.55 }}>{row.desc}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <div className="disclaimer">
        <Info size={14} />
        <span>Ambang batas pada grafik dapat diubah secara interaktif melalui panel konfigurasi di atas. Standar ISPU mengacu pada <b>PP No.22 Tahun 2021</b> dan <b>PermenLHK No.14 Tahun 2020</b>.</span>
      </div>
    </div>
  )
}

