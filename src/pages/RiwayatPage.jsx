import React, { useState, useEffect } from 'react'
import {
  Activity, AlertTriangle, CalendarDays, ChevronDown,
  ChevronRight, Download, Gauge, Info, Search,
  SlidersHorizontal, Wind, X, CheckCircle2, Printer,
  FileSpreadsheet, FileText, Clock, Filter
} from 'lucide-react'
import {
  LineChart, Line, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Legend
} from 'recharts'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import SectionTitle from '../components/SectionTitle'
import StatusBadge from '../components/StatusBadge'
import { HistoryStat } from '../components/SensorCards'
import RowDetailModal from '../components/RowDetailModal'
import { history as initialHistory, dailySummary as initialDailySummary } from '../data/mockData'
import { airQualityService } from '../services/airQualityService'
import { useTheme } from '../context/ThemeContext'

function getIspuCategory(pm25) {
  const val = Number(pm25) || 0
  if (val <= 50) return 'Baik'
  if (val <= 100) return 'Sedang'
  if (val <= 199) return 'Tidak Sehat'
  return 'Sangat Tidak Sehat'
}

function parseRowDateTime(timeStr) {
  // Format is typically "19 Nov 2026 · 07:30" or "07:30"
  if (!timeStr) return { dateStr: '-', timeClock: '-' }
  const parts = timeStr.split('·')
  if (parts.length === 2) {
    return {
      dateStr: parts[0].trim(),
      timeClock: parts[1].trim() + ' WIB'
    }
  }
  return { dateStr: '-', timeClock: timeStr + ' WIB' }
}

export default function RiwayatPage() {
  const { isDark } = useTheme()
  const ROWS_PER_PAGE = 8
  const [dataList, setDataList] = useState(initialHistory)
  const [dailyData, setDailyData] = useState(initialDailySummary)
  const [query, setQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('Semua')
  const [filterDate, setFilterDate] = useState('Semua')
  const [rangeFilter, setRangeFilter] = useState('Semua') // 'Semua' | 'Hari Ini' | '3 Hari Terakhir'
  const [page, setPage] = useState(1)
  const [detailRow, setDetailRow] = useState(null)
  const [exportMsg, setExportMsg] = useState('')
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  const gridStroke = isDark ? '#1e3152' : '#e2e8f0'
  const tickFill = isDark ? '#6b82a0' : '#64748b'
  const tooltipStyle = {
    borderRadius: 10,
    border: isDark ? '1px solid #1e3152' : '1px solid #e2e8f0',
    background: isDark ? '#0d1b31' : '#ffffff',
    color: isDark ? '#d0e4ff' : '#0f172a',
    boxShadow: isDark ? 'none' : '0 4px 16px rgba(15, 23, 42, 0.08)',
    fontSize: 12
  }
  const legendColor = isDark ? '#8097b8' : '#64748b'

  useEffect(() => {
    airQualityService.getHistory().then(res => {
      if (res && res.length > 0) setDataList(res)
    })
    airQualityService.getDailySummary().then(res => {
      if (res && res.length > 0) setDailyData(res)
    })
  }, [])

  // Unique dates for dropdown
  const uniqueDates = ['Semua', ...Array.from(new Set(dataList.map(r => r.date).filter(Boolean)))]

  // Calculate dates for relative range filter
  const todayDate = uniqueDates.length > 1 ? uniqueDates[1] : ''
  const last3Dates = uniqueDates.slice(1, 4)

  // Filtering
  const filtered = dataList.filter(r => {
    const matchQuery = (r.time || '').toLowerCase().includes(query.toLowerCase()) ||
                       String(r.pm25).includes(query) ||
                       String(r.asapRokok).includes(query)
    const matchStatus = filterStatus === 'Semua' || r.status === filterStatus
    const matchDate   = filterDate === 'Semua' || r.date === filterDate

    let matchRange = true
    if (rangeFilter === 'Hari Ini' && todayDate) {
      matchRange = r.date === todayDate
    } else if (rangeFilter === '3 Hari Terakhir' && last3Dates.length > 0) {
      matchRange = last3Dates.includes(r.date)
    }

    return matchQuery && matchStatus && matchDate && matchRange
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const pageRows   = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  // Summary stats (computed over filtered dataset for accurate reporting)
  const targetDataset = filtered.length > 0 ? filtered : dataList
  const pm25Values = targetDataset.map(r => r.pm25)
  const avgPm25    = pm25Values.length > 0 ? Math.round(pm25Values.reduce((a, b) => a + b, 0) / pm25Values.length) : 0
  const maxPm25    = pm25Values.length > 0 ? Math.max(...pm25Values) : 0
  const minPm25    = pm25Values.length > 0 ? Math.min(...pm25Values) : 0
  const sedangCount= targetDataset.filter(r => r.status === 'Sedang' || r.pm25 > 50).length

  // Find peak record
  const peakRecord = targetDataset.reduce((max, r) => (r.pm25 > (max?.pm25 || 0) ? r : max), targetDataset[0])
  const peakTimeStr = peakRecord?.time || 'Tidak ada data'

  // Export CSV
  const handleExportCSV = () => {
    try {
      const header = 'No,Tanggal,Waktu (WIB),Konsentrasi Debu (ug/m3),Asap Rokok (ug/m3),Asap Kendaraan (ug/m3),Kategori ISPU,Status Perangkat\n'
      const rows = filtered.map((r, idx) => {
        const { dateStr, timeClock } = parseRowDateTime(r.time)
        const ispu = getIspuCategory(r.pm25)
        const deviceStatus = 'ESP32 + Sharp GP2Y Normal'
        return `${idx + 1},"${r.date || dateStr}","${timeClock}",${r.pm25},${r.asapRokok},${r.asapKendaraan},"${ispu}","${deviceStatus}"`
      }).join('\n')

      // Prepend UTF-8 BOM so Excel opens indonesian characters properly
      const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      const dateTag = new Date().toISOString().slice(0, 10)
      a.href     = url
      a.download = `Laporan_Pengujian_Kualitas_Udara_STIKOM_${rangeFilter.replace(/\s+/g, '_')}_${dateTag}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExportMsg(`Data riwayat (${filtered.length} rekaman) berhasil diekspor ke CSV!`)
      setTimeout(() => setExportMsg(''), 4000)
    } catch (err) {
      console.error('Gagal export CSV:', err)
      setExportMsg('Gagal mengekspor data CSV.')
      setTimeout(() => setExportMsg(''), 3000)
    }
  }

  // Export PDF with jsPDF and autoTable
  const handleExportPDF = () => {
    try {
      setIsExportingPdf(true)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const now = new Date()
      const formattedDateNow = now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
      const formattedTimeNow = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'

      // ─── Kop Surat Resmi STIKOM El Rahma ───
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.setTextColor(15, 43, 72) // Primary Navy
      doc.text('SEKOLAH TINGGI ILMU KOMPUTER (STIKOM) EL RAHMA BOGOR', 105, 18, { align: 'center' })

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10.5)
      doc.setTextColor(30, 41, 59)
      doc.text('PROGRAM STUDI INFORMATIKA / SISTEM INFORMASI', 105, 23.5, { align: 'center' })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(100, 116, 139)
      doc.text('Jl. Raya Cifor, Bubulak, Kec. Bogor Barat, Kota Bogor, Jawa Barat 16115 | Telp: (0251) 8422771', 105, 28, { align: 'center' })
      doc.text('Laman: stikomelrahma.ac.id | Email: info@stikomelrahma.ac.id', 105, 32, { align: 'center' })

      // Double line separator kop
      doc.setDrawColor(15, 43, 72)
      doc.setLineWidth(0.8)
      doc.line(14, 35, 196, 35)
      doc.setLineWidth(0.2)
      doc.line(14, 36.2, 196, 36.2)

      // ─── Judul Dokumen & Subtitle ───
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(15, 43, 72)
      doc.text('LAPORAN HASIL PENGUJIAN KUALITAS UDARA AREA PARKIR', 105, 43, { align: 'center' })

      doc.setFont('helvetica', 'italic')
      doc.setFontSize(9)
      doc.setTextColor(71, 85, 105)
      doc.text('Sistem Monitoring IoT Berbasis ESP32 dan Sensor Sharp GP2Y1010AU0F', 105, 48, { align: 'center' })

      // ─── Metadata Laporan ───
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(30, 41, 59)

      // Left column metadata
      doc.text(`Lokasi Pengujian : Area Parkir STIKOM El Rahma Bogor`, 14, 56)
      doc.text(`Periode Filter  : ${rangeFilter} (${filtered.length} Sampel Data)`, 14, 61)

      // Right column metadata
      doc.text(`Tanggal Cetak   : ${formattedDateNow}, ${formattedTimeNow}`, 120, 56)
      doc.text(`Status Operator : Administrator Sistem AirWatch`, 120, 61)

      // ─── Ringkasan Statistik Pengujian (Stats Box) ───
      doc.setFillColor(241, 245, 249) // Light slate fill
      doc.setDrawColor(203, 213, 225)
      doc.roundedRect(14, 66, 182, 19, 2, 2, 'FD')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(15, 43, 72)
      doc.text('RINGKASAN STATISTIK PM2.5 (KONSENTRASI DEBU):', 18, 71)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(51, 65, 85)
      doc.text(`• Rata-rata: ${avgPm25} ug/m3`, 18, 77)
      doc.text(`• Maksimum : ${maxPm25} ug/m3`, 62, 77)
      doc.text(`• Minimum  : ${minPm25} ug/m3`, 106, 77)
      doc.text(`• Waktu Puncak: ${peakTimeStr.length > 20 ? peakTimeStr.slice(0, 20) + '…' : peakTimeStr}`, 148, 77)

      doc.setFont('helvetica', 'italic')
      doc.setFontSize(7.5)
      doc.setTextColor(100, 116, 139)
      doc.text(`Kategori Indeks Standar Pencemar Udara (ISPU): Baik (0-50 ug/m3), Sedang (51-100 ug/m3), Tidak Sehat (>100 ug/m3)`, 18, 82)

      // ─── Tabel Data Pengujian (autoTable) ───
      const tableHead = [['No', 'Tanggal', 'Waktu (WIB)', 'PM2.5 (ug/m3)', 'Asap Rokok', 'Kendaraan', 'Kategori ISPU', 'Status Sensor']]
      const tableBody = filtered.map((r, idx) => {
        const { dateStr, timeClock } = parseRowDateTime(r.time)
        const ispu = getIspuCategory(r.pm25)
        return [
          String(idx + 1),
          r.date || dateStr,
          timeClock,
          `${r.pm25} ug/m3`,
          `${r.asapRokok} ug/m3`,
          `${r.asapKendaraan} ug/m3`,
          ispu,
          'Normal'
        ]
      })

      autoTable(doc, {
        startY: 89,
        head: tableHead,
        body: tableBody,
        theme: 'striped',
        margin: { left: 14, right: 14, bottom: 20 },
        headStyles: {
          fillColor: [15, 43, 72], // Brand navy
          textColor: [255, 255, 255],
          fontSize: 7.5,
          fontStyle: 'bold',
          halign: 'center',
          cellPadding: 2.2,
        },
        bodyStyles: {
          fontSize: 7.2,
          textColor: [30, 41, 59],
          cellPadding: 2,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          1: { halign: 'center', cellWidth: 26 },
          2: { halign: 'center', cellWidth: 24 },
          3: { halign: 'right', fontStyle: 'bold', cellWidth: 26 },
          4: { halign: 'right', cellWidth: 22 },
          5: { halign: 'right', cellWidth: 22 },
          6: { halign: 'center', fontStyle: 'bold', cellWidth: 28 },
          7: { halign: 'center', cellWidth: 24 },
        },
        didDrawPage: function (data) {
          // Footer on every page
          const pageCount = doc.getNumberOfPages()
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(7)
          doc.setTextColor(148, 163, 184)
          doc.text(
            'Laporan resmi hasil monitoring kualitas udara Kampus STIKOM El Rahma Bogor | Dihasilkan secara otomatis oleh AirWatch IoT',
            14,
            290
          )
          doc.text(
            `Halaman ${data.pageNumber} dari ${pageCount}`,
            196,
            290,
            { align: 'right' }
          )
        }
      })

      const dateTag = new Date().toISOString().slice(0, 10)
      doc.save(`Laporan_Kualitas_Udara_STIKOM_${rangeFilter.replace(/\s+/g, '_')}_${dateTag}.pdf`)
      setExportMsg(`Laporan PDF resmi (${filtered.length} rekaman) berhasil diunduh!`)
      setTimeout(() => setExportMsg(''), 4500)
    } catch (err) {
      console.error('Gagal generate PDF:', err)
      setExportMsg('Terjadi kendala saat menyusun dokumen PDF. Silakan gunakan opsi Cetak Laporan.')
      setTimeout(() => setExportMsg(''), 4000)
    } finally {
      setIsExportingPdf(false)
    }
  }

  return (
    <div className="page-content">
      <SectionTitle
        eyebrow="DATA / HISTORY"
        title="Riwayat Data & Ekspor Laporan"
        description="Telusuri rekaman sensor kualitas udara area parkir STIKOM El Rahma dan unduh laporan resmi."
        action={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              className="primary-button"
              onClick={handleExportCSV}
              title="Unduh rekaman data dalam format CSV untuk Microsoft Excel / SPSS"
              style={{ background: isDark ? '#142a44' : '#f1f5f9', color: isDark ? '#93c5fd' : '#0369a1', borderColor: isDark ? '#1e4068' : '#bae6fd' }}
            >
              <FileSpreadsheet size={15} /> Export CSV
            </button>
            <button
              className="primary-button"
              onClick={handleExportPDF}
              disabled={isExportingPdf}
              title="Unduh dokumen laporan resmi berformat PDF lengkap dengan kop surat STIKOM"
              style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#ffffff', borderColor: '#38bdf8' }}
            >
              <FileText size={15} /> {isExportingPdf ? 'Menyusun PDF...' : 'Export PDF'}
            </button>
            <button
              className="primary-button print-report-btn"
              onClick={() => window.print()}
              title="Cetak langsung atau simpan halaman menggunakan dialog browser"
            >
              <Printer size={15} /> Cetak
            </button>
          </div>
        }
      />

      {/* ── Export feedback toast ── */}
      {exportMsg && (
        <div className="export-toast">
          <CheckCircle2 size={14} /> {exportMsg}
        </div>
      )}

      {/* ── Summary stats ── */}
      <div className="hist-stats-row">
        <HistoryStat icon={Gauge}         label="Rata-rata PM2.5"   value={avgPm25}    unit="μg/m³" tone="blue"   />
        <HistoryStat icon={Activity}      label="PM2.5 Tertinggi"  value={maxPm25}    unit="μg/m³" tone="amber"  />
        <HistoryStat icon={Wind}          label="PM2.5 Terendah"   value={minPm25}    unit="μg/m³" tone="green"  />
        <HistoryStat icon={AlertTriangle} label="Status Diwaspadai" value={sedangCount} unit="rekaman" tone="purple" />
      </div>

      {/* ── 7-day trend chart ── */}
      <article className="panel hist-chart-panel">
        <div className="panel-heading">
          <h2>
            <Activity size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
            Tren Rata-rata Harian (7 Hari Terakhir)
          </h2>
        </div>
        <div className="hist-chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData} margin={{ top: 8, right: 16, left: 4, bottom: 0 }}>
              <CartesianGrid stroke={gridStroke} strokeDasharray="4 6" vertical={false} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: tickFill, fontSize: 11 }} dy={8} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: tickFill, fontSize: 11 }}
                domain={[0, 80]}
                width={44}
                label={{ value: 'μg/m³', angle: -90, position: 'insideLeft', offset: 14, style: { fill: tickFill, fontSize: 9 } }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v, name) => [
                  `${v} μg/m³`,
                  name === 'pm25Avg' ? 'Rata-rata PM2.5' : name === 'asapRokokAvg' ? 'Rata-rata Asap Rokok' : name === 'asapKendaraanAvg' ? 'Rata-rata Asap Kendaraan' : 'Maks PM2.5'
                ]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={v => v === 'pm25Avg' ? 'PM2.5 Avg' : v === 'asapRokokAvg' ? 'Asap Rokok Avg' : v === 'asapKendaraanAvg' ? 'Asap Kendaraan Avg' : 'PM2.5 Maks'}
                wrapperStyle={{ fontSize: 10, color: legendColor, paddingTop: 6 }}
              />
              <Line type="monotone" dataKey="pm25Avg" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4, fill: '#38bdf8', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="asapRokokAvg" stroke="#a78bfa" strokeWidth={2} dot={{ r: 4, fill: '#a78bfa', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="asapKendaraanAvg" stroke="#34d399" strokeWidth={2} dot={{ r: 4, fill: '#34d399', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="maxPm25" stroke="#fb923c" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      {/* ── Table section ── */}
      <article className="panel" style={{ padding: 20 }}>
        <div className="panel-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <h2>Log Pembacaan Sensor Area Parkir</h2>

          {/* Quick Date Range Filter Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: isDark ? '#7a96b6' : '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} /> Rentang:
            </span>
            {['Semua', 'Hari Ini', '3 Hari Terakhir'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => { setRangeFilter(r); setPage(1) }}
                style={{
                  fontSize: 10.5,
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: rangeFilter === r
                    ? (isDark ? '1px solid #38bdf8' : '1px solid #0284c7')
                    : (isDark ? '1px solid #1c2e47' : '1px solid #e2e8f0'),
                  background: rangeFilter === r
                    ? (isDark ? '#143859' : '#e0f2fe')
                    : (isDark ? '#0b1626' : '#ffffff'),
                  color: rangeFilter === r
                    ? (isDark ? '#e0f2fe' : '#0369a1')
                    : (isDark ? '#8ca4c3' : '#64748b'),
                  transition: 'all 0.15s ease'
                }}
              >
                {r === 'Semua' ? 'Semua Data' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="table-tools hist-filters">
          <label className="searchbox table-search">
            <Search size={15} />
            <input value={query} onChange={e => { setQuery(e.target.value); setPage(1) }} placeholder="Cari waktu, nilai PM2.5…" />
          </label>
          <div className="hist-filter-group">
            {/* Specific Date filter */}
            <div className="filter-select">
              <CalendarDays size={14} />
              <select value={filterDate} onChange={e => { setFilterDate(e.target.value); setPage(1) }}>
                {uniqueDates.map(d => <option key={d}>{d}</option>)}
              </select>
              <ChevronDown size={13} />
            </div>
            {/* Status filter */}
            <div className="filter-select">
              <SlidersHorizontal size={14} />
              <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
                <option>Semua</option><option>Baik</option><option>Sedang</option>
              </select>
              <ChevronDown size={13} />
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {(filterStatus !== 'Semua' || filterDate !== 'Semua' || rangeFilter !== 'Semua' || query) && (
          <div className="filter-chips">
            {rangeFilter !== 'Semua' && (
              <span className="filter-chip">
                Rentang: {rangeFilter} <button onClick={() => setRangeFilter('Semua')}><X size={10} /></button>
              </span>
            )}
            {query && (
              <span className="filter-chip">
                Cari: "{query}" <button onClick={() => setQuery('')}><X size={10} /></button>
              </span>
            )}
            {filterDate !== 'Semua' && (
              <span className="filter-chip">
                Tanggal: {filterDate} <button onClick={() => setFilterDate('Semua')}><X size={10} /></button>
              </span>
            )}
            {filterStatus !== 'Semua' && (
              <span className="filter-chip">
                Status: {filterStatus} <button onClick={() => setFilterStatus('Semua')}><X size={10} /></button>
              </span>
            )}
            <button
              className="chip-clear-all"
              onClick={() => {
                setQuery('')
                setFilterDate('Semua')
                setFilterStatus('Semua')
                setRangeFilter('Semua')
                setPage(1)
              }}
            >
              Hapus semua
            </button>
          </div>
        )}

        {/* Table */}
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Waktu</th>
                <th>PM2.5 (Debu)</th>
                <th>Asap Rokok</th>
                <th>Asap Kendaraan</th>
                <th>Suhu</th>
                <th>Kelembapan</th>
                <th>Kategori ISPU</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, i) => (
                <tr key={r.time + i} className="hist-table-row" onClick={() => setDetailRow(r)}>
                  <td><span className="table-time">{r.time}</span></td>
                  <td><b className="raw-number">{r.pm25}</b> <span className="unit-small">μg/m³</span></td>
                  <td><b className="raw-number">{r.asapRokok}</b> <span className="unit-small">μg/m³</span></td>
                  <td><b className="raw-number">{r.asapKendaraan}</b> <span className="unit-small">μg/m³</span></td>
                  <td><b className="raw-number">{r.suhu ?? '—'}</b>{r.suhu && <span className="unit-small"> °C</span>}</td>
                  <td><b className="raw-number">{r.kelembapan ?? '—'}</b>{r.kelembapan && <span className="unit-small"> %</span>}</td>
                  <td>
                    <StatusBadge
                      label={getIspuCategory(r.pm25)}
                      tone={r.pm25 <= 50 ? 'green' : r.pm25 <= 100 ? 'amber' : 'red'}
                    />
                  </td>
                  <td>
                    <button className="row-detail-btn" onClick={e => { e.stopPropagation(); setDetailRow(r) }} aria-label="Lihat detail">
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <Search size={22} /><b>Data tidak ditemukan</b><span>Coba ubah filter atau kata kunci pencarian.</span>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <span>
            Menampilkan {filtered.length === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, filtered.length)} dari <b>{filtered.length}</b> rekaman
          </span>
          <div>
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={p === page ? 'current-page' : ''}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
          </div>
        </div>
      </article>

      <div className="disclaimer" style={{ marginTop: 14 }}>
        <Info size={14} />
        <span>Laporan pengujian dapat digunakan untuk lampiran skripsi, analisis dampak lingkungan kampus, dan evaluasi sirkulasi area parkir STIKOM El Rahma.</span>
      </div>

      {/* Row detail modal */}
      {detailRow && <RowDetailModal row={detailRow} onClose={() => setDetailRow(null)} />}
    </div>
  )
}
