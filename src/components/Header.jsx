import React, { useState, useEffect } from 'react'
import {
  Menu, CalendarDays, Clock3, Sun, Moon,
  Lock, LogOut, ShieldCheck, UserCheck
} from 'lucide-react'
import logoStikom from '../assets/logo-stikom.png'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

export default function Header({ setMobileOpen }) {
  const [now, setNow] = useState(new Date())
  const { theme, toggleTheme } = useTheme()
  const { isAdmin, user, setLoginModalOpen, logout } = useAuth()

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
          src={logoStikom}
          alt="Logo STIKOM El Rahma"
          style={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }}
        />
        <div className="topbar-title">
          <div className="topbar-main-title">Sistem Monitoring Kualitas Udara</div>
          <span>Area Parkir STIKOM El Rahma Bogor</span>
        </div>
      </div>
      <div className="topbar-right">
        {/* Toggle Mode Terang / Gelap */}
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
          aria-label="Ubah tema terang/gelap"
        >
          {theme === 'dark' ? (
            <>
              <Sun size={15} className="theme-toggle-icon sun-icon" />
              <span className="theme-toggle-text">Mode Terang</span>
            </>
          ) : (
            <>
              <Moon size={15} className="theme-toggle-icon moon-icon" />
              <span className="theme-toggle-text">Mode Gelap</span>
            </>
          )}
        </button>

        {/* Tombol Login / Status Admin Hybrid */}
        {!isAdmin ? (
          <button
            className="admin-login-btn"
            onClick={() => setLoginModalOpen(true)}
            title="Masuk sebagai Administrator / Pengelola Kampus"
          >
            <Lock size={13} />
            <span className="admin-btn-text">Login Admin</span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="admin-active-badge" title={`Login sebagai: ${user?.name || user?.email}`}>
              <ShieldCheck size={13} />
              <span className="admin-badge-text">Admin Aktif</span>
            </span>
            <button
              className="admin-logout-btn"
              onClick={logout}
              title="Keluar dari sesi Administrator"
              aria-label="Keluar"
            >
              <LogOut size={13} />
              <span className="admin-btn-text">Keluar</span>
            </button>
          </div>
        )}

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

