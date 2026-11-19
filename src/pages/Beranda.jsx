import React, { useState, useEffect } from 'react'
import { Gauge, Flame, Car, Database, Sparkles } from 'lucide-react'
import { QualityCard, MetricSensorCard } from '../components/SensorCards'
import { ChartPanel, MapPanel, InfoPanel, ParamPanel, SystemPanel } from '../components/Panels'
import PeakHoursAnalytics from '../components/PeakHoursAnalytics'
import { airQualityService } from '../services/airQualityService'
import { evaluateAndAutoAlert } from '../services/whatsappService'

export default function Beranda() {
  const [telemetry, setTelemetry] = useState({
    pm25: 18,
    asapRokok: 7,
    asapKendaraan: 12,
    suhu: 28,
    kelembapan: 65,
    status: 'Baik',
    isLive: false,
  })

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const data = await airQualityService.getLatestTelemetry()
        if (isMounted && data) {
          setTelemetry(data)
          // Evaluasi ambang batas untuk notifikasi WhatsApp otomatis
          if (data.pm25) {
            evaluateAndAutoAlert(data.pm25)
          }
        }
      } catch (e) {
        console.warn('Gagal memuat telemetri Beranda:', e)
      }
    }

    loadData()
    const id = setInterval(loadData, 4000)
    return () => {
      isMounted = false
      clearInterval(id)
    }
  }, [])

  const toneMap = {
    Baik: 'green',
    Sedang: 'amber',
    'Tidak Sehat': 'red',
  }

  return (
    <div className="page-content">
      {/* Status sumber data */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <span className={`telemetry-source-badge ${telemetry.isLive ? 'source-live' : 'source-sim'}`}>
          {telemetry.isLive ? <Database size={12} /> : <Sparkles size={12} />}
          <span>{telemetry.isLive ? 'Terhubung Database MySQL XAMPP' : 'Mode Simulasi Telemetri'}</span>
        </span>
      </div>

      <div className="sensor-cards-grid">
        <QualityCard
          status={telemetry.status}
          pm25={telemetry.pm25}
          desc={telemetry.status === 'Baik' ? 'Kondisi udara di area parkir masih dalam batas aman.' : 'Terdeteksi peningkatan konsentrasi polutan udara.'}
        />
        <MetricSensorCard
          label="PM2.5 (Debu)"
          icon={Gauge}
          value={telemetry.pm25}
          unit="μg/m³"
          status={telemetry.status}
          tone={toneMap[telemetry.status] || 'green'}
        />
        <MetricSensorCard
          label="Asap Rokok"
          icon={Flame}
          value={telemetry.asapRokok}
          unit="μg/m³"
          status={telemetry.asapRokok > 15 ? 'Sedang' : 'Baik'}
          tone={telemetry.asapRokok > 15 ? 'amber' : 'green'}
        />
        <MetricSensorCard
          label="Asap Kendaraan"
          icon={Car}
          value={telemetry.asapKendaraan}
          unit="μg/m³"
          status={telemetry.asapKendaraan > 20 ? 'Sedang' : 'Baik'}
          tone={telemetry.asapKendaraan > 20 ? 'amber' : 'green'}
        />
      </div>

      <div className="chart-map-grid">
        <ChartPanel />
        <MapPanel />
      </div>

      {/* Komponen Baru: Analisis Pola Jam Sibuk Area Parkir */}
      <PeakHoursAnalytics />

      <div className="bottom-three-grid">
        <InfoPanel />
        <ParamPanel telemetry={telemetry} />
        <SystemPanel />
      </div>
    </div>
  )
}
