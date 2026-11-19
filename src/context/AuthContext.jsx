import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured, DEMO_ADMIN } from '../services/supabaseClient'

const AuthContext = createContext({
  isAdmin: false,
  user: null,
  loginModalOpen: false,
  setLoginModalOpen: () => {},
  login: async () => {},
  logout: async () => {},
  isSupabaseActive: false,
})

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState(null)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Inisialisasi status sesi
  useEffect(() => {
    const initSession = async () => {
      // 1. Cek sesi lokal (demo atau fallback)
      try {
        const localSession = localStorage.getItem('airwatch_admin_session')
        if (localSession) {
          const parsed = JSON.parse(localSession)
          if (parsed && parsed.email) {
            setIsAdmin(true)
            setUser(parsed)
          }
        }
      } catch (e) {
        console.warn('Gagal membaca sesi lokal:', e)
      }

      // 2. Jika Supabase aktif, sinkronkan sesi Supabase
      if (supabase && isSupabaseConfigured()) {
        try {
          const { data } = await supabase.auth.getSession()
          if (data?.session?.user) {
            setIsAdmin(true)
            setUser({
              email: data.session.user.email,
              name: data.session.user.user_metadata?.name || data.session.user.email,
              role: 'Administrator (Supabase)',
            })
          }
        } catch (e) {
          console.warn('Supabase getSession error:', e)
        }

        // Listener perubahan auth Supabase
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            setIsAdmin(true)
            setUser({
              email: session.user.email,
              name: session.user.user_metadata?.name || session.user.email,
              role: 'Administrator (Supabase)',
            })
          }
        })

        return () => {
          authListener?.subscription?.unsubscribe()
        }
      }

      setLoading(false)
    }

    initSession()
  }, [])

  const login = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanPass = (password || '').trim()

    // 1. Coba login via Supabase jika konfigurasi valid
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        })

        if (!error && data?.user) {
          const userData = {
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email,
            role: 'Administrator',
            source: 'supabase',
          }
          setIsAdmin(true)
          setUser(userData)
          localStorage.setItem('airwatch_admin_session', JSON.stringify(userData))
          setLoginModalOpen(false)
          return { success: true, user: userData, source: 'supabase' }
        }
      } catch (e) {
        console.warn('Supabase signIn error, mencoba login fallback demo:', e)
      }
    }

    // 2. Fallback Demo Admin (admin@stikomelrahma.ac.id / admin123)
    if (cleanEmail === DEMO_ADMIN.email.toLowerCase() && cleanPass === DEMO_ADMIN.password) {
      const demoData = {
        email: DEMO_ADMIN.email,
        name: DEMO_ADMIN.name,
        role: DEMO_ADMIN.role,
        source: 'local-demo',
      }
      setIsAdmin(true)
      setUser(demoData)
      localStorage.setItem('airwatch_admin_session', JSON.stringify(demoData))
      setLoginModalOpen(false)
      return { success: true, user: demoData, source: 'local-demo' }
    }

    return {
      success: false,
      error: 'Kombinasi Email dan Kata Sandi tidak cocok.',
    }
  }

  const logout = async () => {
    try {
      if (supabase && isSupabaseConfigured()) {
        await supabase.auth.signOut()
      }
    } catch (e) {
      console.warn('Supabase signOut error:', e)
    }

    localStorage.removeItem('airwatch_admin_session')
    setIsAdmin(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        user,
        loginModalOpen,
        setLoginModalOpen,
        login,
        logout,
        isSupabaseActive: isSupabaseConfigured(),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
