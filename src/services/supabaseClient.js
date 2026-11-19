import { createClient } from '@supabase/supabase-js'

// Ambil URL & Key dari environment Vite atau localStorage jika diatur oleh pengguna
const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const localUrl = localStorage.getItem('airwatch_supabase_url')
  const localKey = localStorage.getItem('airwatch_supabase_key')

  const url = localUrl || envUrl || ''
  const key = localKey || envKey || ''

  return { url, key, isConfigured: Boolean(url && key && url.startsWith('http')) }
}

const { url, key, isConfigured } = getSupabaseConfig()

export const supabase = isConfigured
  ? createClient(url, key)
  : null

export const isSupabaseConfigured = () => {
  const cfg = getSupabaseConfig()
  return cfg.isConfigured
}

export const getSupabaseSettings = () => getSupabaseConfig()

export const saveSupabaseSettings = (newUrl, newKey) => {
  if (newUrl) localStorage.setItem('airwatch_supabase_url', newUrl)
  else localStorage.removeItem('airwatch_supabase_url')

  if (newKey) localStorage.setItem('airwatch_supabase_key', newKey)
  else localStorage.removeItem('airwatch_supabase_key')
}

// Akun Demo Cadangan jika Supabase belum dikonfigurasi
export const DEMO_ADMIN = {
  email: 'admin@stikomelrahma.ac.id',
  password: 'admin123',
  name: 'Admin Pengelola Kampus',
  role: 'Administrator',
}
