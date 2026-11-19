import React, { useState, useEffect } from 'react'
import { Gauge, Flame, Car, Info } from 'lucide-react'
import {
  LineChart, Line, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Legend
} from 'recharts'
import SectionTitle from '../components/SectionTitle'
import { QualityCard, MetricSensorCard } from '../components/SensorCards'
import { useTheme } from '../context/ThemeContext'

const getInitialLiveStream = () => {
  const points = []
  const now = Date.now()
  for (let i = 6; i >= 0; i--) {
    const timestamp = new Date(now - i * 3000)
    const timeStr = timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const variation = Math.sin((now - i * 3000) / 5000) * 5
    points.push({
      time: timeStr,
      pm25: Math.max(10, Math.round(18 + variation)),
      asapRokok: Math.max(3, Math.round(7 + variation * 0.4)),
      asapKendaraan: Math.max(5, Math.round(12 + variation * 0.6)),
    })
  }
  return points
}

export default function RealtimePage() {
  const { isDark } = useTheme()
  const [streamData, setStreamData] = useState(getInitialLiveStream)

  const gridStroke = isDark ? '#1e3152' : '#e2e8f0'
  const tickFill = isDark ? '#6b82a0' : '#64748b'
  const tooltipStyle = {
    borderRadius: 10,
    border: isDark ? '1px solid #1e3152' : '1px solid #e2e8f0',
    background: isDark ? '#0d1b31' : '#ffffff',
    color: isDark ? '#d0e4ff' : '#0f172a',
    boxShadow: isDark ? 'none' : '0 4px 16px rgba(15, 23, 42, 0.08)',
    fontSize: 12
  }
  const legendColor = isDark ? '#8097b8' : '#64748b'

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1)
      const now = new Date()
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      const variation = Math.sin(Date.now() / 5000) * 6
      const newPm25 = Math.max(10, Math.round(18 + variation + (Math.random() * 4 - 2)))
      const newAsapRokok = Math.max(2, Math.round(7 + (variation * 0.4) + (Math.random() * 2 - 1)))
      const newAsapKendaraan = Math.max(4, Math.round(12 + (variation * 0.6) + (Math.random() * 3 - 1.5)))

      setStreamData(prev => {
        const next = [...prev, { time: timeStr, pm25: newPm25, asapRokok: newAsapRokok, asapKendaraan: newAsapKendaraan }]
        return next.length > 10 ? next.slice(next.length - 10) : next
      })
    }, 3000)

    return () => clearInterval(id)
  }, [])

  const currentReading = streamData[streamData.length - 1] || { pm25: 18, asapRokok: 7, asapKendaraan: 12 }
  const currentStatus = currentReading.pm25 > 55 ? 'Tidak Sehat' : currentReading.pm25 > 35 ? 'Sedang' : 'Baik'

  return (
    <div className="page-content">
      <SectionTitle
        eyebrow="LIVE / SENSOR"
        title="Data Real-time"
        description="Pembacaan sensor langsung dari perangkat ESP32 (simulasi live stream)."
      />

      <div className="sensor-cards-grid" style={{ marginBottom: 16 }}>
        <QualityCard
          status={currentStatus}
          pm25={currentReading.pm25}
          desc={currentStatus === 'Baik' ? 'Kondisi udara di area parkir dalam batas aman.' : 'Terjadi peningkatan konsentrasi partikel.'}
        />
        <MetricSensorCard
          label="PM2.5 (Debu)"
          icon={Gauge}
          value={currentReading.pm25}
          unit="μg/m³"
          status={currentStatus}
          tone={currentStatus === 'Baik' ? 'green' : 'amber'}
        />
        <MetricSensorCard
          label="Asap Rokok"
          icon={Flame}
          value={currentReading.asapRokok}
          unit="μg/m³"
          status={currentReading.asapRokok > 15 ? 'Sedang' : 'Baik'}
          tone={currentReading.asapRokok > 15 ? 'amber' : 'green'}
        />
        <MetricSensorCard
          label="Asap Kendaraan"
          icon={Car}
          value={currentReading.asapKendaraan}
          unit="μg/m³"
          status={currentReading.asapKendaraan > 20 ? 'Sedang' : 'Baik'}
          tone={currentReading.asapKendaraan > 20 ? 'amber' : 'green'}
        />
      </div>

      <article className="panel chart-panel-new" style={{ marginBottom: 16 }}>
        <div className="panel-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Grafik Live Stream (Diperbarui tiap 3 detik)</h2>
          <span style={{ fontSize: 10, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="online-dot" style={{ width: 6, height: 6 }} /> Streaming Aktif
          </span>
        </div>
        <div className="chart-wrap-new">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={streamData} margin={{ top: 8, right: 16, left: 4, bottom: 0 }}>
              <CartesianGrid stroke={gridStroke} strokeDasharray="4 6" vertical={false} />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: tickFill, fontSize: 11 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: tickFill, fontSize: 11 }}
                domain={[0, 100]}
                width={40}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v, name) => [
                  `${v} μg/m³`,
                  name === 'pm25' ? 'PM2.5' : name === 'asapRokok' ? 'Asap Rokok' : 'Asap Kendaraan'
                ]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={v => v === 'pm25' ? 'PM2.5 (Debu)' : v === 'asapRokok' ? 'Asap Rokok' : 'Asap Kendaraan'}
                wrapperStyle={{ fontSize: 10, color: legendColor, paddingTop: 6 }}
              />
              <Line type="monotone" dataKey="pm25" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
              <Line type="monotone" dataKey="asapRokok" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
              <Line type="monotone" dataKey="asapKendaraan" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <div className="disclaimer">
        <Info size={14} />
        <span>Data live merupakan <b>simulasi real-time stream</b> — akan otomatis beralih ke pembacaan hardware ketika ESP32 terhubung.</span>
      </div>
    </div>
  )
}

