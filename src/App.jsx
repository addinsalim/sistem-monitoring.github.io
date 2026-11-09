import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Beranda from './pages/Beranda'
import RealtimePage from './pages/RealtimePage'
import RiwayatPage from './pages/RiwayatPage'
import GrafikPage from './pages/GrafikPage'
import InfoSensorPage from './pages/InfoSensorPage'
import PengaturanPage from './pages/PengaturanPage'

export default function App() {
  const [page, setPage] = useState('Beranda')
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        setPage={setPage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <main className="main-area">
        <Header setMobileOpen={setMobileOpen} />
        {page === 'Beranda' ? <Beranda /> :
          page === 'Data Real-time' ? <RealtimePage /> :
            page === 'Riwayat Data' ? <RiwayatPage /> :
              page === 'Grafik Kualitas Udara' ? <GrafikPage /> :
                page === 'Info Sensor & Sistem' ? <InfoSensorPage /> :
                  <PengaturanPage />}
        <footer className="app-footer">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <img src="/logo-stikom.png" alt="STIKOM" style={{ width: 15, height: 15, objectFit: 'contain' }} />
            <span>AirWatch <b>·</b> STIKOM El Rahma Bogor</span>
          </span>
          <span>Bersih Udara, Sehat Bersama <i /></span>
        </footer>
      </main>
    </div>
  )
}
