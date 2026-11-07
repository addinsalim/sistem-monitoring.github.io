import React, { useState, useEffect } from 'react'
import {
  Activity, AlertTriangle, CalendarDays, ChevronDown,
  ChevronRight, Download, Gauge, Info, Search,
  SlidersHorizontal, Wind, X, CheckCircle2, Printer
} from 'lucide-react'
import {
  LineChart, Line, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Legend
} from 'recharts'
import SectionTitle from '../components/SectionTitle'
import StatusBadge from '../components/StatusBadge'
import { HistoryStat } from '../components/SensorCards'
import RowDetailModal from '../components/RowDetailModal'
import { history as initialHistory, dailySummary as initialDailySummary } from '../data/mockData'
import { airQualityService } from '../services/airQualityService'

export default function RiwayatPage() {
  const ROWS_PER_PAGE = 8
  const [dataList, setDataList] = useState(initialHistory)
  const [dailyData, setDailyData] = useState(initialDailySummary)
  const [query, setQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('Semua')
  const [filterDate, setFilterDate] = useState('Semua')
  const [page, setPage] = useState(1)
  const [detailRow, setDetailRow] = useState(null)
  const [exportMsg, setExportMsg] = useState('')

  useEffect(() => {
    airQualityService.getHistory().then(res => {
      if (res && res.length > 0) setDataList(res)
    })
    airQualityService.getDailySummary().then(res => {
      if (res && res.length > 0) setDailyData(res)
    })
  }, [])

  // Unique dates for filter dropdown
  const uniqueDates = ['Semua', ...Array.from(new Set(dataList.map(r => r.date)))]

  // Filtering
  const filtered = dataList.filter(r => {
    const matchQuery = (r.time || '').toLowerCase().includes(query.toLowerCase()) ||
                       String(r.pm25).includes(query) ||
                       String(r.asapRokok).includes(query)
    const matchStatus = filterStatus === 'Semua' || r.status === filterStatus
    const matchDate   = filterDate === 'Semua' || r.date === filterDate
    return matchQuery && matchStatus && matchDate
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const pageRows   = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  // Reset page when filters change
  const handleFilterStatus = v => { setFilterStatus(v); setPage(1) }
  const handleFilterDate   = v => { setFilterDate(v);   setPage(1) }
  const handleQuery        = v => { setQuery(v);        setPage(1) }

  // Summary stats (over all data, not filtered)
  const pm25Values = dataList.map(r => r.pm25)
  const avgPm25    = pm25Values.length > 0 ? Math.round(pm25Values.reduce((a, b) => a + b, 0) / pm25Values.length) : 0
  const maxPm25    = pm25Values.length > 0 ? Math.max(...pm25Values) : 0
  const minPm25    = pm25Values.length > 0 ? Math.min(...pm25Values) : 0
  const sedangCount= dataList.filter(r => r.status === 'Sedang').length

  // Export CSV
  const handleExport = () => {
    const header = 'Waktu,PM2.5 (ug/m3),Asap Rokok (ug/m3),Asap Kendaraan (ug/m3),Suhu (C),Kelembapan (%),Status\n'
    const rows   = filtered.map(r =>
      `"${r.time}",${r.pm25},${r.asapRokok},${r.asapKendaraan},${r.suhu ?? ''},${r.kelembapan ?? ''},"${r.status}"`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `riwayat-kualitas-udara-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setExportMsg('Data riwayat berhasil diekspor ke CSV!')
    setTimeout(() => setExportMsg(''), 3500)
  }

  return (
    <div className="page-content">
      <SectionTitle
        eyebrow="DATA / HISTORY"
        title="Riwayat Data"
        description="Telusuri dan analisis rekaman sensor kualitas udara area parkir."
        action={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              className="primary-button"
              onClick={() => window.print()}
              style={{ background: '#0e233d', borderColor: '#1d436b' }}
              title="Cetak atau simpan sebagai dokumen PDF"
            >
              <Printer size={15} /> Cetak Laporan
            </button>
            <button className="primary-button" onClick={handleExport}>
              <Download size={15} /> Export CSV
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
        <HistoryStat icon={AlertTriangle} label="Rekaman 'Sedang'" value={sedangCount} unit="rekaman" tone="purple" />
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
              <CartesianGrid stroke="#1e3152" strokeDasharray="4 6" vertical={false} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b82a0', fontSize: 11 }} dy={8} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b82a0', fontSize: 11 }}
                domain={[0, 80]}
                width={44}
                label={{ value: 'μg/m³', angle: -90, position: 'insideLeft', offset: 14, style: { fill: '#5a718f', fontSize: 9 } }}
              />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #1e3152', background: '#0d1b31', color: '#d0e4ff', fontSize: 12 }}
                formatter={(v, name) => [
                  `${v} μg/m³`,
                  name === 'pm25Avg' ? 'Rata-rata PM2.5' : name === 'asapRokokAvg' ? 'Rata-rata Asap Rokok' : name === 'asapKendaraanAvg' ? 'Rata-rata Asap Kendaraan' : 'Maks PM2.5'
                ]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={v => v === 'pm25Avg' ? 'PM2.5 Avg' : v === 'asapRokokAvg' ? 'Asap Rokok Avg' : v === 'asapKendaraanAvg' ? 'Asap Kendaraan Avg' : 'PM2.5 Maks'}
                wrapperStyle={{ fontSize: 10, color: '#8097b8', paddingTop: 6 }}
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
        <div className="panel-heading"><h2>Log Pembacaan Sensor</h2></div>

        {/* Filters */}
        <div className="table-tools hist-filters">
          <label className="searchbox table-search">
            <Search size={15} />
            <input value={query} onChange={e => handleQuery(e.target.value)} placeholder="Cari waktu, nilai PM2.5…" />
          </label>
          <div className="hist-filter-group">
            {/* Date filter */}
            <div className="filter-select">
              <CalendarDays size={14} />
              <select value={filterDate} onChange={e => handleFilterDate(e.target.value)}>
                {uniqueDates.map(d => <option key={d}>{d}</option>)}
              </select>
              <ChevronDown size={13} />
            </div>
            {/* Status filter */}
            <div className="filter-select">
              <SlidersHorizontal size={14} />
              <select value={filterStatus} onChange={e => handleFilterStatus(e.target.value)}>
                <option>Semua</option><option>Baik</option><option>Sedang</option>
              </select>
              <ChevronDown size={13} />
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {(filterStatus !== 'Semua' || filterDate !== 'Semua' || query) && (
          <div className="filter-chips">
            {query && (
              <span className="filter-chip">
                Cari: "{query}" <button onClick={() => handleQuery('')}><X size={10} /></button>
              </span>
            )}
            {filterDate !== 'Semua' && (
              <span className="filter-chip">
                Tanggal: {filterDate} <button onClick={() => handleFilterDate('Semua')}><X size={10} /></button>
              </span>
            )}
            {filterStatus !== 'Semua' && (
              <span className="filter-chip">
                Status: {filterStatus} <button onClick={() => handleFilterStatus('Semua')}><X size={10} /></button>
              </span>
            )}
            <button className="chip-clear-all" onClick={() => { handleQuery(''); handleFilterDate('Semua'); handleFilterStatus('Semua') }}>
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
                <th>Status</th>
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
                  <td><StatusBadge label={r.status} tone={r.status === 'Baik' ? 'green' : 'amber'} /></td>
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
        <span>Data ini merupakan <b>simulasi</b>. Nilai nyata akan tersedia setelah sensor dan backend terhubung.</span>
      </div>

      {/* Row detail modal */}
      {detailRow && <RowDetailModal row={detailRow} onClose={() => setDetailRow(null)} />}
    </div>
  )
}

