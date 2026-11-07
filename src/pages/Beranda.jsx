import React from 'react'
import { Gauge, Flame, Car } from 'lucide-react'
import { QualityCard, MetricSensorCard } from '../components/SensorCards'
import { ChartPanel, MapPanel, InfoPanel, ParamPanel, SystemPanel } from '../components/Panels'

export default function Beranda() {
  return (
    <div className="page-content">
      <div className="sensor-cards-grid">
        <QualityCard status="Baik" desc="Kondisi udara di area parkir masih dalam batas aman." />
        <MetricSensorCard label="PM2.5 (Debu)"  icon={Gauge} value={18} unit="μg/m³" status="Baik" />
        <MetricSensorCard label="Asap Rokok"     icon={Flame} value={7}  unit="μg/m³" status="Baik" />
        <MetricSensorCard label="Asap Kendaraan" icon={Car}   value={12} unit="μg/m³" status="Baik" />
      </div>
      <div className="chart-map-grid">
        <ChartPanel />
        <MapPanel />
      </div>
      <div className="bottom-three-grid">
        <InfoPanel />
        <ParamPanel />
        <SystemPanel />
      </div>
    </div>
  )
}

