import React, { useState, useEffect } from 'react'
import { Gauge, Flame, Car, Info } from 'lucide-react'
import {
  LineChart, Line, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Legend
} from 'recharts'
import SectionTitle from '../components/SectionTitle'
import { QualityCard, MetricSensorCard } from '../components/SensorCards'

export default function RealtimePage() {
  const [tick, setTick] = useState(0)
  const [streamData, setStreamData] = useState([
    { time: '15:58:30', pm25: 18, asapRokok: 7,  asapKendaraan: 12 },
    { time: '15:58:45', pm25: 19, asapRokok: 8,  asapKendaraan: 13 },
    { time: '15:59:00', pm25: 22, asapRokok: 7,  asapKendaraan: 14 },
    { time: '15:59:15', pm25: 20, asapRokok: 9,  asapKendaraan: 12 },
    { time: '15:59:30', pm25: 17, asapRokok: 8,  asapKendaraan: 11 },
    { time: '15:59:45', pm25: 21, asapRokok: 7,  asapKendaraan: 13 },
    { time: '16:00:00', pm25: 18, asapRokok: 7,  asapKendaraan: 12 },
  ])

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
              <CartesianGrid stroke="#1e3152" strokeDasharray="4 6" vertical={false} />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b82a0', fontSize: 11 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b82a0', fontSize: 11 }}
                domain={[0, 100]}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: '1px solid #1e3152',
                  background: '#0d1b31',
                  color: '#d0e4ff',
                  fontSize: 12
                }}
                formatter={(v, name) => [
                  `${v} μg/m³`,
                  name === 'pm25' ? 'PM2.5' : name === 'asapRokok' ? 'Asap Rokok' : 'Asap Kendaraan'
                ]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={v => v === 'pm25' ? 'PM2.5 (Debu)' : v === 'asapRokok' ? 'Asap Rokok' : 'Asap Kendaraan'}
                wrapperStyle={{ fontSize: 10, color: '#8097b8', paddingTop: 6 }}
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

