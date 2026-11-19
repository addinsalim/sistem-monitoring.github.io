import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({
  theme: 'dark',
  themePreference: 'dark',
  setThemePreference: () => {},
  toggleTheme: () => {},
  isDark: true,
})

export function ThemeProvider({ children }) {
  const [themePreference, setThemePreferenceState] = useState(() => {
    try {
      const saved = localStorage.getItem('airwatch_theme')
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved
      }
    } catch (e) {
      console.warn('Gagal membaca preferensi tema:', e)
    }
    return 'dark'
  })

  // Hitung resolvedTheme ('dark' atau 'light')
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (themePreference === 'system') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return themePreference
  })

  // Listener perubahan preferensi sistem jika mode 'system'
  useEffect(() => {
    if (themePreference !== 'system') {
      setResolvedTheme(themePreference)
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light')
    }

    handleChange()
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themePreference])

  // Sinkronkan ke DOM (html tag, body, data-theme attribute, meta theme-color)
  useEffect(() => {
    const root = document.documentElement
    if (resolvedTheme === 'light') {
      root.classList.add('theme-light')
      root.classList.remove('dark')
      root.classList.remove('theme-dark')
      root.setAttribute('data-theme', 'light')
      root.style.colorScheme = 'light'
    } else {
      root.classList.add('dark')
      root.classList.add('theme-dark')
      root.classList.remove('theme-light')
      root.setAttribute('data-theme', 'dark')
      root.style.colorScheme = 'dark'
    }

    // Perbarui meta theme-color di browser (terutama mobile status bar)
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', resolvedTheme === 'light' ? '#f8fafc' : '#081226')
    }
  }, [resolvedTheme])

  const setThemePreference = (pref) => {
    setThemePreferenceState(pref)
    try {
      localStorage.setItem('airwatch_theme', pref)
    } catch (e) {
      console.warn('Gagal menyimpan tema:', e)
    }
  }

  const toggleTheme = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark'
    setThemePreference(next)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: resolvedTheme,
        themePreference,
        setThemePreference,
        toggleTheme,
        isDark: resolvedTheme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
