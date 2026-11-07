import React from 'react'
import {
  Activity, AlertTriangle, CheckCircle2, Clock3,
  Cpu, Droplets, Flame, Gauge, Info, MapPin,
  RadioTower, ShieldCheck, Thermometer, Wifi, Zap, Car
} from 'lucide-react'
import {
  LineChart, Line, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Legend
} from 'recharts'
import StatusBadge from './StatusBadge'
import { chartData, notifications, parameters, systemStatus } from '../data/mockData'

/* ─── Chart Panel (24 Jam) ─── */
export function ChartPanel() {
  return (
    <article className="panel chart-panel-new">
      <div className="panel-heading">
        <h2>Grafik Kualitas Udara (24 Jam Terakhir)</h2>
      </div>
      <div className="chart-wrap-new">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: 4, bottom: 0 }}>
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
              domain={[0, 200]}
              ticks={[0, 50, 100, 150, 200]}
              width={56}
              label={{
                value: 'Konsentrasi (μg/m³)',
                angle: -90,
                position: 'insideLeft',
                offset: 14,
                style: { fill: '#5a718f', fontSize: 9 }
              }}
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
                name === 'pm25' ? 'PM2.5 (Debu)' : name === 'asapRokok' ? 'Asap Rokok' : 'Asap Kendaraan'
              ]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={v => v === 'pm25' ? 'PM2.5 (Debu)' : v === 'asapRokok' ? 'Asap Rokok' : 'Asap Kendaraan'}
              wrapperStyle={{ fontSize: 10, color: '#8097b8', paddingTop: 6 }}
            />
            <Line type="monotone" dataKey="pm25" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3, fill: '#38bdf8', strokeWidth: 0 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="asapRokok" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3, fill: '#a78bfa', strokeWidth: 0 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="asapKendaraan" stroke="#34d399" strokeWidth={2} dot={{ r: 3, fill: '#34d399', strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

/* ─── Map Panel ─── */
export function MapPanel() {
  return (
    <article className="panel map-panel">
      <div className="panel-heading">
        <h2>
          <MapPin size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
          Lokasi Sensor
        </h2>
      </div>
      <div className="map-frame-wrap">
        <iframe
          title="Lokasi Sensor STIKOM El Rahma"
          src="https://www.openstreetmap.org/export/embed.html?bbox=106.7836329%2C-6.5922089%2C106.7876329%2C-6.5882089&layer=mapnik&marker=-6.5902089%2C106.7856329"
          className="map-iframe"
          loading="lazy"
        />
      </div>
      <div className="map-footer">
        <MapPin size={13} />
        <div>
          <b>Area Parkir STIKOM El Rahma Bogor</b>
          <span>-6.5902089, 106.7856329</span>
        </div>
      </div>
    </article>
  )
}

/* ─── Info Panel (Notifikasi Terbaru) ─── */
const notifIcons = { success: CheckCircle2, warning: AlertTriangle, info: Info }
const notifTones = { success: 'green', warning: 'amber', info: 'blue' }

export function InfoPanel() {
  return (
    <article className="panel bottom-panel info-panel">
      <div className="panel-heading">
        <h2>
          <Clock3 size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
          Informasi Terbaru
        </h2>
      </div>
      <div className="notif-list">
        {notifications.map((n, i) => {
          const Icon = notifIcons[n.type] || Info
          const tone = notifTones[n.type] || 'blue'
          return (
            <div className={`notif-item notif-${tone}`} key={i}>
              <div className={`notif-ico notif-ico-${tone}`}><Icon size={14} /></div>
              <div className="notif-body">
                <div className="notif-title-row">
                  <b>{n.title}</b>
                  <span className="notif-time">{n.time}</span>
                </div>
                <p>{n.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}

/* ─── Parameter Panel ─── */
const paramIcons = [Gauge, Flame, Car, Thermometer, Droplets]

export function ParamPanel({ telemetry }) {
  const list = telemetry ? [
    { label: 'PM2.5 (Debu)',   value: telemetry.pm25,          unit: 'μg/m³', status: telemetry.status },
    { label: 'Asap Rokok',     value: telemetry.asapRokok,     unit: 'μg/m³', status: telemetry.asapRokok > 15 ? 'Sedang' : 'Baik' },
    { label: 'Asap Kendaraan', value: telemetry.asapKendaraan, unit: 'μg/m³', status: telemetry.asapKendaraan > 20 ? 'Sedang' : 'Baik' },
    { label: 'Suhu',           value: telemetry.suhu ?? 28,    unit: '°C',     status: null },
    { label: 'Kelembapan',     value: telemetry.kelembapan ?? 65, unit: '%',   status: null },
  ] : parameters

  return (
    <article className="panel bottom-panel param-panel">
      <div className="panel-heading">
        <h2>
          <Activity size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
          Nilai Parameter Saat Ini
        </h2>
      </div>
      <div className="param-list">
        {list.map((p, i) => {
          const Icon = paramIcons[i] || Activity
          return (
            <div className="param-row" key={p.label}>
              <div className="param-left">
                <div className="param-ico"><Icon size={13} /></div>
                <span>{p.label}</span>
              </div>
              <div className="param-right">
                <span className="param-val">
                  <b>{p.value}</b>
                  <span className="param-unit"> {p.unit}</span>
                </span>
                {p.status
                  ? <StatusBadge label={p.status} tone={p.status === 'Baik' ? 'green' : p.status === 'Sedang' ? 'amber' : 'red'} />
                  : <span className="param-dash">—</span>
                }
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}

/* ─── System Status Panel ─── */
export const sysIcons = [Wifi, RadioTower, Cpu, Zap]
export const sysTones = { Terhubung: 'green', Aktif: 'blue', Normal: 'green' }

export function SystemPanel() {
  return (
    <article className="panel bottom-panel system-panel">
      <div className="panel-heading">
        <h2>
          <ShieldCheck size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
          Status Sistem
        </h2>
      </div>
      <div className="system-list">
        {systemStatus.map((s, i) => {
          const Icon = sysIcons[i] || Zap
          return (
            <div className="system-row" key={s.label}>
              <div className="system-left">
                <div className="sys-ico"><Icon size={15} /></div>
                <span>{s.label}</span>
              </div>
              <StatusBadge label={s.status} tone={sysTones[s.status] || 'green'} />
            </div>
          )
        })}
      </div>
    </article>
  )
}

