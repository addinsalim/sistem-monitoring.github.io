import React from 'react'
import { X } from 'lucide-react'
import StatusBadge from './StatusBadge'

export default function RowDetailModal({ row, onClose }) {
  if (!row) return null

  const fields = [
    { label: 'Waktu',          value: row.time,              unit: ''       },
    { label: 'PM2.5 (Debu)',  value: row.pm25,              unit: 'μg/m³'  },
    { label: 'Asap Rokok',    value: row.asapRokok,         unit: 'μg/m³'  },
    { label: 'Asap Kendaraan', value: row.asapKendaraan,     unit: 'μg/m³'  },
    { label: 'Suhu',           value: row.suhu ?? '—',       unit: row.suhu ? '°C' : '' },
    { label: 'Kelembapan',     value: row.kelembapan ?? '—',  unit: row.kelembapan ? '%' : '' },
    { label: 'Status',         value: row.status,            unit: ''       },
  ]

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>DETAIL REKAMAN</div>
            <h2 style={{ margin: 0, font: '700 15px Manrope,sans-serif', color: '#e8f2ff' }}>
              {row.time}
            </h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Tutup">
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          {fields.map(f => (
            <div className="modal-row" key={f.label}>
              <span className="modal-key">{f.label}</span>
              <span className="modal-val">
                {f.label === 'Status'
                  ? <StatusBadge label={f.value} tone={f.value === 'Baik' ? 'green' : 'amber'} />
                  : <><b>{f.value}</b>{f.unit && <span className="param-unit"> {f.unit}</span>}</>
                }
              </span>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button
            className="primary-button"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

