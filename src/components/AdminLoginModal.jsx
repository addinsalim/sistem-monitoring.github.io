import React, { useState } from 'react'
import { X, Lock, Mail, Shield, AlertCircle, CheckCircle2, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { DEMO_ADMIN } from '../services/supabaseClient'

export default function AdminLoginModal() {
  const { loginModalOpen, setLoginModalOpen, login, isSupabaseActive } = useAuth()
  const [email, setEmail] = useState(DEMO_ADMIN.email)
  const [password, setPassword] = useState(DEMO_ADMIN.password)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  if (!loginModalOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    try {
      const res = await login(email, password)
      if (res.success) {
        setSuccessMsg(`Selamat datang, ${res.user.name}!`)
        setTimeout(() => {
          setSuccessMsg('')
        }, 1200)
      } else {
        setErrorMsg(res.error || 'Gagal masuk. Periksa kembali email dan password.')
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi sistem.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setEmail(DEMO_ADMIN.email)
    setPassword(DEMO_ADMIN.password)
    setErrorMsg('')
  }

  return (
    <div className="modal-scrim" onClick={() => setLoginModalOpen(false)}>
      <div className="modal-card admin-login-card" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="admin-login-icon">
              <Shield size={20} />
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 3 }}>AUTENTIKASI SISTEM</div>
              <h2 style={{ margin: 0, font: '700 15px Manrope,sans-serif' }}>
                Login Admin & Pengelola
              </h2>
            </div>
          </div>
          <button
            className="icon-btn"
            onClick={() => setLoginModalOpen(false)}
            aria-label="Tutup modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '20px 22px 10px' }}>
          {/* Quick Demo Info Pill */}
          <div className="login-demo-pill" onClick={fillDemo} title="Klik untuk mengisi data demo otomatis">
            <Sparkles size={13} style={{ color: '#38bdf8', flexShrink: 0 }} />
            <span>
              Akun Demo Siap Pakai: <b>{DEMO_ADMIN.email}</b> (Pass: <b>{DEMO_ADMIN.password}</b>)
            </span>
          </div>

          {errorMsg && (
            <div className="login-alert-error">
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="login-alert-success">
              <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="setting-label">Email Admin</label>
              <div className="login-input-wrap">
                <Mail size={15} className="login-field-icon" />
                <input
                  type="email"
                  required
                  placeholder="admin@stikomelrahma.ac.id"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="login-input"
                />
              </div>
            </div>

            <div>
              <label className="setting-label">Kata Sandi (Password)</label>
              <div className="login-input-wrap">
                <Lock size={15} className="login-field-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="login-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-eye-btn"
                  aria-label="Lihat kata sandi"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: '#7a92b2' }}>
              <span>Backend Auth: <b>{isSupabaseActive ? 'Supabase Active' : 'Fallback Demo'}</b></span>
              <span style={{ color: '#38bdf8', cursor: 'pointer' }} onClick={fillDemo}>Isi Demo Otomatis</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="primary-button"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '11px',
                marginTop: 6,
                fontSize: 11,
              }}
            >
              <Lock size={14} />
              {loading ? 'Memverifikasi...' : 'Masuk ke Panel Admin'}
            </button>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ padding: '12px 22px 18px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 9.5, color: '#6882a4' }}>
            Halaman publik monitoring tetap dapat diakses bebas tanpa login. Mode Admin hanya untuk konfigurasi perangkat & gateway.
          </p>
        </div>
      </div>
    </div>
  )
}
