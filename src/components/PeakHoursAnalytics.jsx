import React from 'react'
import {
  Clock, TrendingUp, AlertTriangle, CheckCircle2,
  Car, Users, Sparkles, Flame, ShieldAlert
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, ReferenceLine
} from 'recharts'
import { useTheme } from '../context/ThemeContext'

// Data pola jam sibuk aktivitas kampus STIKOM El Rahma
export const PEAK_HOURS_DATA = [
  {
    id: 'pagi',
    segment: 'Masuk Pagi',
    hours: '07.30 – 08.30 WIB',
    pm25: 48,
    asapKendaraan: 24,
    status: 'Baik',
    tone: 'green',
    desc: 'Kedatangan mahasiswa & dosen sesi kuliah pagi. Arus kendaraan padat teratur.',
  },
  {
    id: 'siang',
    segment: 'Istirahat Siang',
    hours: '12.00 – 13.00 WIB',
    pm25: 36,
    asapKendaraan: 16,
    status: 'Baik',
    tone: 'green',
    desc: 'Perpindahan kendaraan untuk sholat dan makan siang di sekitar kampus.',
  },
  {
    id: 'sore',
    segment: 'Pulang Sore',
    hours: '16.00 – 17.30 WIB',
    pm25: 72,
    asapKendaraan: 42,
    status: 'Sedang',
    tone: 'amber',
    desc: 'Puncak mobilitas bubar kelas reguler. Mesin kendaraan memanas bersamaan di area parkir.',
  },
  {
    id: 'malam',
    segment: 'Kuliah Malam',
    hours: '18.30 – 21.00 WIB',
    pm25: 54,
    asapKendaraan: 28,
    status: 'Sedang',
    tone: 'amber',
    desc: 'Kedatangan mahasiswa kelas karyawan & kepulangan sesi malam. Suhu udara dingin menahan partikel.',
  },
]

export default function PeakHoursAnalytics() {
  const { isDark } = useTheme()

  // Cari segmen dengan polusi tertinggi secara dinamis
  const highestSegment = [...PEAK_HOURS_DATA].sort((a, b) => b.pm25 - a.pm25)[0]

  const gridStroke = isDark ? '#1e3152' : '#e2e8f0'
  const tickFill = isDark ? '#6b82a0' : '#64748b'
  const tooltipStyle = {
    borderRadius: 10,
    border: isDark ? '1px solid #1e3152' : '1px solid #e2e8f0',
    background: isDark ? '#0d1b31' : '#ffffff',
    color: isDark ? '#d0e4ff' : '#0f172a',
    boxShadow: isDark ? 'none' : '0 4px 16px rgba(15, 23, 42, 0.08)',
    fontSize: 12,
  }

  return (
    <article className="panel peak-hours-panel" style={{ padding: 22, marginBottom: 16 }}>
      {/* Heading Section */}
      <div className="panel-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>ANALISIS MOBILITAS KAMPUS</div>
          <h2 style={{ fontSize: 15 }}>
            <Clock size={15} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: '#38bdf8' }} />
            Analisis Pola Jam Sibuk Area Parkir
          </h2>
        </div>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 10,
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: 20,
          background: isDark ? '#122e4d' : '#e0f2fe',
          color: isDark ? '#7dd3fc' : '#0369a1',
          border: isDark ? '1px solid #1d4a72' : '1px solid #bae6fd',
        }}>
          <Sparkles size={12} /> 4 Segmen Aktivitas Harian
        </span>
      </div>

      <p style={{ margin: '0 0 16px', fontSize: 11, color: isDark ? '#8ca4c3' : '#64748b', lineHeight: 1.6 }}>
        Perbandingan rata-rata konsentrasi debu halus (PM2.5) berdasarkan 4 segmen waktu aktivitas utama sivitas akademika STIKOM El Rahma Bogor.
      </p>

      {/* Grid Grafik + Insight Box */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 16, marginBottom: 16 }}>
        {/* Kolom Kiri: Bar Chart Segmen */}
        <div style={{ background: isDark ? '#0c182c' : '#f8fafc', padding: 16, borderRadius: 10, border: isDark ? '1px solid #1b2f4c' : '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#e8f2ff' : '#0f172a' }}>
              Rata-rata Konsentrasi PM2.5 per Segmen
            </span>
            <span style={{ fontSize: 9.5, color: isDark ? '#7f96b5' : '#64748b' }}>Satuan: μg/m³</span>
          </div>

          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PEAK_HOURS_DATA} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="4 6" vertical={false} />
                <XAxis
                  dataKey="segment"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: tickFill, fontSize: 10.5 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: tickFill, fontSize: 10 }}
                  domain={[0, 90]}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(val, name) => [`${val} μg/m³`, name === 'pm25' ? 'Konsentrasi PM2.5' : name]}
                  labelFormatter={(seg) => {
                    const item = PEAK_HOURS_DATA.find(d => d.segment === seg)
                    return `${seg} (${item ? item.hours : ''})`
                  }}
                />
                <ReferenceLine
                  y={55}
                  stroke="#fbbf2499"
                  strokeDasharray="4 3"
                  label={{ value: 'Batas Sedang (55)', fill: '#fbbf24', fontSize: 8.5, position: 'insideTopRight' }}
                />
                <Bar dataKey="pm25" radius={[6, 6, 0, 0]} maxBarSize={38}>
                  {PEAK_HOURS_DATA.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={entry.id === highestSegment.id ? '#fb923c' : entry.pm25 > 50 ? '#38bdf8' : '#34d399'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kolom Kanan: Highlight Insight Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Box Puncak Polusi */}
          <div style={{
            padding: '16px',
            borderRadius: 10,
            background: isDark ? 'linear-gradient(145deg, #2a1610, #1b1218)' : 'linear-gradient(145deg, #fff7ed, #ffedd5)',
            border: isDark ? '1px solid #7c2d12' : '1px solid #fdba74',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                display: 'grid',
                placeItems: 'center',
                background: isDark ? '#431407' : '#fed7aa',
                color: isDark ? '#fb923c' : '#c2410c',
              }}>
                <TrendingUp size={16} />
              </div>
              <div>
                <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: isDark ? '#fdba74' : '#9a3412', display: 'block' }}>
                  Waktu Puncak Emisi Terdeteksi
                </span>
                <b style={{ fontSize: 13, color: isDark ? '#ffedd5' : '#7c2d12' }}>
                  {highestSegment.segment} ({highestSegment.hours})
                </b>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: 10.5, color: isDark ? '#fed7aa' : '#9a3412', lineHeight: 1.55 }}>
              Konsentrasi debu rata-rata mencapai <b>{highestSegment.pm25} μg/m³</b> (Status: <b>{highestSegment.status}</b>).
              Peningkatan signifikan disebabkan oleh akumulasi gas buang saat mahasiswa kelas reguler menyalakan kendaraan serentak di waktu kepulangan.
            </p>
          </div>

          {/* Rekomendasi Operasional Parkir */}
          <div style={{
            padding: '14px 16px',
            borderRadius: 10,
            background: isDark ? '#0c182c' : '#f8fafc',
            border: isDark ? '1px solid #1c3050' : '1px solid #e2e8f0',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
              <Car size={14} style={{ color: '#38bdf8' }} />
              <b style={{ fontSize: 11, color: isDark ? '#e0efff' : '#0f172a' }}>Rekomendasi Manajemen Area Parkir:</b>
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 10, color: isDark ? '#8da5c4' : '#475569', lineHeight: 1.6 }}>
              <li>Buka gerbang keluar ganda pada <b>16.00 – 17.30 WIB</b> untuk mencegah penumpukan kendaraan menyala.</li>
              <li>Arahkan kendaraan roda dua untuk langsung berjalan perlahan tanpa memanaskan mesin statis berlebih.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4 Kartu Rincian Segmen Waktu */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
        {PEAK_HOURS_DATA.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '12px 14px',
              borderRadius: 9,
              border: item.id === highestSegment.id
                ? (isDark ? '1px solid #ea580c' : '1px solid #f97316')
                : (isDark ? '1px solid #1a2c47' : '1px solid #e2e8f0'),
              background: item.id === highestSegment.id
                ? (isDark ? '#23120e' : '#fff7ed')
                : (isDark ? '#0b1628' : '#ffffff'),
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#7a96b6' }}>{item.hours}</span>
              <span className={`status-badge badge-${item.tone}`}>{item.status}</span>
            </div>
            <b style={{ fontSize: 12, display: 'block', color: isDark ? '#e6f1ff' : '#0f172a', marginBottom: 4 }}>
              {item.segment}
            </b>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 5 }}>
              <span style={{ font: '700 16px Manrope, sans-serif', color: item.id === highestSegment.id ? '#f97316' : '#38bdf8' }}>
                {item.pm25}
              </span>
              <span style={{ fontSize: 9.5, color: '#7a96b6' }}>μg/m³ PM2.5</span>
            </div>
            <p style={{ margin: 0, fontSize: 9, color: isDark ? '#7a92af' : '#64748b', lineHeight: 1.45 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </article>
  )
}
