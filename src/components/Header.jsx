import React, { useState, useEffect } from 'react'
import { Menu, CalendarDays, Clock3 } from 'lucide-react'

export default function Header({ setMobileOpen }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="icon-btn mobile-menu"
          aria-label="Buka menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} />
        </button>
        <img
          src="/logo-stikom.png"
          alt="Logo STIKOM El Rahma"
          style={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }}
        />
        <div className="topbar-title">
          <div className="topbar-main-title">Sistem Monitoring Kualitas Udara</div>
          <span>Area Parkir STIKOM El Rahma Bogor</span>
        </div>
      </div>
      <div className="topbar-right">
        <div className="online-badge">
          <i className="online-dot" /> Online
        </div>
        <div className="topbar-divider" />
        <div className="top-datetime">
          <CalendarDays size={14} />
          <span>{dateStr}</span>
          <span className="dt-sep" />
          <Clock3 size={14} />
          <span>{timeStr}</span>
        </div>
      </div>
    </header>
  )
}

