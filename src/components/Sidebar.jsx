import React from 'react'
import {
  Home, Activity, History as HistoryIcon, BarChart2,
  BookOpen, Settings2, Wind, X
} from 'lucide-react'
import logoStikom from '../assets/logo-stikom.png'

export const navItems = [
  { id: 'Beranda',               icon: Home        },
  { id: 'Data Real-time',        icon: Activity    },
  { id: 'Riwayat Data',          icon: HistoryIcon },
  { id: 'Grafik Kualitas Udara', icon: BarChart2  },
  { id: 'Info Sensor & Sistem',  icon: BookOpen    },
  { id: 'Pengaturan',            icon: Settings2   },
]

export default function Sidebar({ page, setPage, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <button
          className="mobile-scrim"
          aria-label="Tutup menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark" style={{ background: 'transparent', boxShadow: 'none' }}>
            <img src={logoStikom} alt="Logo STIKOM El Rahma" style={{ width: 38, height: 38, objectFit: 'contain' }} />
          </div>
          <div>
            <strong>Air Watch<span>•</span></strong>
            <small>STIKOM El Rahma</small>
          </div>
          <button
            className="icon-btn sidebar-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="nav-list">
          {navItems.map(({ id, icon: Icon, dot }) => (
            <button
              key={id}
              className={`nav-item ${page === id ? 'active' : ''}`}
              onClick={() => { setPage(id); setMobileOpen(false) }}
            >
              <Icon size={18} />
              <span>{id}</span>
              {dot && <i className="nav-notif-dot" />}
              {page === id && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-bottom-brand">
          <div className="bottom-brand-icon" style={{ background: '#0a172a' }}>
            <img src={logoStikom} alt="STIKOM" style={{ width: 22, height: 22, objectFit: 'contain' }} />
          </div>
          <div>
            <b>STIKOM El Rahma</b>
            <span>Bersih Udara, Sehat Bersama</span>
          </div>
        </div>
      </aside>
    </>
  )
}

