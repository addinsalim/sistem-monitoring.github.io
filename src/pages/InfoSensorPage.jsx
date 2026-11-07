import React from 'react'
import {
  BookOpen, CircuitBoard, Code2, Cpu as CpuIcon,
  FlaskConical, Flame, Layers, Server, Thermometer, Info
} from 'lucide-react'
import SectionTitle from '../components/SectionTitle'

export default function InfoSensorPage() {
  const sensors = [
    {
      id: 'sharp-gp2y',
      name: 'Sharp GP2Y1010AU0F',
      category: 'Sensor Debu / Partikel',
      icon: FlaskConical,
      color: '#38bdf8',
      colorBg: '#0e2240',
      colorBorder: '#1d4a72',
      badge: 'PM2.5',
      specs: [
        { label: 'Tipe',             val: 'Optical Dust Sensor' },
        { label: 'Tegangan Operasi', val: '5V DC' },
        { label: 'Arus Konsumsi',    val: '±20 mA' },
        { label: 'Range Deteksi',    val: '0 – 500 μg/m³' },
        { label: 'Output',           val: 'Analog Voltage' },
        { label: 'Interface',        val: 'Analog (ADC)' },
      ],
      desc: 'Sensor optis berbasis prinsip hamburan cahaya inframerah (light scattering) untuk mendeteksi partikel debu halus di udara (PM2.5). LED inframerah memancarkan cahaya ke ruang deteksi; fototransistor mengukur intensitas cahaya yang dihamburkan oleh partikel. Semakin tinggi konsentrasi partikel, semakin besar tegangan output analog yang dihasilkan.',
      fungsi: 'Mengukur konsentrasi partikel PM2.5 (debu halus berdiameter ≤2,5 μm) yang menjadi indikator utama kualitas udara di area parkir STIKOM El Rahma Bogor.',
    },
    {
      id: 'mq2',
      name: 'MQ-2',
      category: 'Sensor Gas / Asap',
      icon: Flame,
      color: '#a78bfa',
      colorBg: '#1c1040',
      colorBorder: '#3b2080',
      badge: 'Asap & Gas',
      specs: [
        { label: 'Tipe',             val: 'Semiconductor Gas Sensor' },
        { label: 'Tegangan Operasi', val: '5V DC' },
        { label: 'Gas yang Dideteksi', val: 'LPG, Propana, H₂, Alkohol, Asap' },
        { label: 'Range Konsentrasi', val: '200 – 10.000 ppm' },
        { label: 'Output',           val: 'Analog + Digital' },
        { label: 'Interface',        val: 'Analog (ADC) / Digital (GPIO)' },
      ],
      desc: 'Sensor gas semikonduktor yang menggunakan bahan SnO₂ (timah dioksida) sebagai elemen sensitif. Ketika gas/asap bersentuhan dengan permukaan SnO₂ yang dipanaskan, resistansi sensor berubah dan menghasilkan sinyal analog yang sebanding dengan konsentrasi gas. Sangat efektif mendeteksi asap rokok dan emisi kendaraan bermotor.',
      fungsi: 'Mendeteksi keberadaan asap rokok dan asap kendaraan bermotor di area parkir. Output dikonversi menjadi nilai konsentrasi relatif untuk ditampilkan pada dashboard monitoring.',
    },
    {
      id: 'dht22',
      name: 'DHT22 (AM2302)',
      category: 'Sensor Suhu & Kelembapan',
      icon: Thermometer,
      color: '#34d399',
      colorBg: '#0d2620',
      colorBorder: '#1a5940',
      badge: 'Suhu & RH',
      specs: [
        { label: 'Tipe',             val: 'Capacitive Humidity + NTC Thermistor' },
        { label: 'Tegangan Operasi', val: '3.3 – 5.5V DC' },
        { label: 'Range Suhu',       val: '-40°C hingga +80°C (±0.5°C)' },
        { label: 'Range Kelembapan', val: '0 – 100% RH (±2-5% RH)' },
        { label: 'Sampling Rate',    val: '0.5 Hz (maks 1 pembacaan per 2 detik)' },
        { label: 'Interface',        val: 'Single-Wire Digital (1-Wire)' },
      ],
      desc: 'Sensor digital suhu dan kelembapan udara relatif yang menggunakan kapasitor sensitif kelembapan dan termistor NTC. Data dikomunikasikan melalui protokol 1-Wire serial 40-bit (16-bit kelembapan + 16-bit suhu + 8-bit checksum). Presisi lebih tinggi dibanding DHT11.',
      fungsi: 'Mengukur suhu dan kelembapan udara di area parkir sebagai parameter lingkungan pendukung. Data ini membantu menginterpretasi kondisi penyebaran polutan — suhu tinggi dan kelembapan rendah cenderung mempengaruhi konsentrasi partikel.',
    },
    {
      id: 'esp32',
      name: 'ESP32 (WROOM-32)',
      category: 'Mikrokontroler / Gateway',
      icon: CircuitBoard,
      color: '#fbbf24',
      colorBg: '#2a1f0e',
      colorBorder: '#5c3d18',
      badge: 'MCU & WiFi',
      specs: [
        { label: 'Prosesor',         val: 'Xtensa LX6 Dual-Core 240 MHz' },
        { label: 'Flash Memory',     val: '4 MB' },
        { label: 'SRAM',             val: '520 KB' },
        { label: 'Koneksi',          val: 'Wi-Fi 802.11 b/g/n + Bluetooth 4.2' },
        { label: 'ADC',              val: '18-ch 12-bit SAR ADC' },
        { label: 'GPIO',             val: '34 GPIO pins' },
      ],
      desc: 'Modul mikrokontroler System-on-Chip (SoC) produksi Espressif dengan kemampuan Wi-Fi dan Bluetooth terintegrasi. Bertindak sebagai otak dari sistem monitoring — membaca data semua sensor secara bersamaan melalui pin ADC dan GPIO, kemudian mengirimkan data ke server/dashboard melalui koneksi Wi-Fi.',
      fungsi: 'Pusat pengolahan data (data acquisition unit): membaca sensor Sharp GP2Y1010, MQ-2, dan DHT22; melakukan konversi ADC; memformat data menjadi JSON; lalu mengirimkannya ke sistem backend via HTTP/MQTT melalui jaringan Wi-Fi kampus.',
    },
  ]

  const techStack = [
    {
      category: 'Frontend (Dashboard)',
      icon: Layers,
      color: '#38bdf8',
      items: [
        { name: 'React 18',      desc: 'Library UI berbasis komponen untuk antarmuka interaktif.',      lang: 'JavaScript' },
        { name: 'Vite 6',        desc: 'Build tool & dev server modern berbasis ESM native yang cepat.', lang: 'Config' },
        { name: 'Tailwind CSS',  desc: 'Framework styling untuk antarmuka yang responsif dan konsisten.', lang: 'CSS' },
        { name: 'Recharts',      desc: 'Library visualisasi chart berbasis SVG & React.',                lang: 'JavaScript' },
        { name: 'Lucide React',  desc: 'Kumpulan ikon SVG modern dan ringan.',                           lang: 'SVG' },
      ]
    },
    {
      category: 'Firmware (ESP32)',
      icon: CpuIcon,
      color: '#fbbf24',
      items: [
        { name: 'C++ (Arduino)', desc: 'Bahasa pemrograman firmware ESP32 via Arduino framework.',      lang: 'C++' },
        { name: 'Arduino IDE',   desc: 'Lingkungan penulisan, kompilasi, dan flashing firmware.',        lang: 'IDE' },
        { name: 'WiFi.h',        desc: 'Library pengelolaan koneksi Wi-Fi ESP32.',                       lang: 'C++' },
        { name: 'HTTPClient.h',  desc: 'Pengiriman data sensor ke REST API endpoint.',                   lang: 'C++' },
        { name: 'DHT.h',         desc: 'Library pembacaan sensor suhu & kelembapan DHT22.',              lang: 'C++' },
      ]
    },
    {
      category: 'Backend & Infrastruktur',
      icon: Server,
      color: '#34d399',
      items: [
        { name: 'Node.js / Express', desc: 'Server REST API untuk ingestion data telemetry sensor.',    lang: 'JavaScript' },
        { name: 'MySQL / SQLite',    desc: 'Database relasional untuk menyimpan histori sensor.',        lang: 'SQL' },
        { name: 'MQTT / WebSocket',  desc: 'Protokol transmisi data real-time latensi rendah.',          lang: 'Protocol' },
        { name: 'JSON Payload',      desc: 'Format pertukaran data standar antara hardware dan server.', lang: 'Format' },
      ]
    },
  ]

  const langColors = {
    'JavaScript': { bg: '#2e2200', color: '#fbbf24', border: '#5c3d00' },
    'C++':        { bg: '#1c0e40', color: '#a78bfa', border: '#3b2080' },
    'CSS':        { bg: '#0e2240', color: '#38bdf8', border: '#1d4a72' },
    'SQL':        { bg: '#0d2620', color: '#34d399', border: '#1a5940' },
    'Config':     { bg: '#1a2035', color: '#94a3b8', border: '#2e3e56' },
    'SVG':        { bg: '#2a1818', color: '#fb7185', border: '#5a2a2a' },
    'Protocol':   { bg: '#1a2035', color: '#818cf8', border: '#2e3e56' },
    'Format':     { bg: '#1a2035', color: '#94a3b8', border: '#2e3e56' },
    'IDE':        { bg: '#1a2035', color: '#94a3b8', border: '#2e3e56' },
  }

  return (
    <div className="page-content">
      <SectionTitle
        eyebrow="DOCS / ABOUT"
        title="Info Sensor & Sistem"
        description="Dokumentasi lengkap perangkat keras yang digunakan dan tumpukan teknologi sistem monitoring kualitas udara."
      />

      {/* ── Sensor Section ── */}
      <div className="info-section-label">
        <FlaskConical size={14} />
        <span>Perangkat Keras & Sensor</span>
      </div>

      <div className="sensor-info-grid">
        {sensors.map(s => {
          const Icon = s.icon
          return (
            <article key={s.id} className="sensor-info-card" style={{ borderColor: s.colorBorder }}>
              {/* Card header */}
              <div className="sic-header" style={{ background: s.colorBg }}>
                <div className="sic-icon" style={{ color: s.color, border: `1px solid ${s.colorBorder}` }}>
                  <Icon size={22} />
                </div>
                <div>
                  <div className="sic-category">{s.category}</div>
                  <div className="sic-name">{s.name}</div>
                </div>
                <span className="sic-badge" style={{ color: s.color, background: s.colorBg, borderColor: s.colorBorder }}>
                  {s.badge}
                </span>
              </div>

              {/* Description */}
              <div className="sic-body">
                <div className="sic-section-title">Cara Kerja</div>
                <p className="sic-desc">{s.desc}</p>

                <div className="sic-section-title" style={{ marginTop: 14 }}>Fungsi dalam Sistem</div>
                <p className="sic-desc sic-fungsi" style={{ borderLeftColor: s.color }}>{s.fungsi}</p>

                {/* Specs table */}
                <div className="sic-section-title" style={{ marginTop: 14 }}>Spesifikasi</div>
                <div className="sic-specs">
                  {s.specs.map(sp => (
                    <div className="sic-spec-row" key={sp.label}>
                      <span className="sic-spec-key">{sp.label}</span>
                      <span className="sic-spec-val">{sp.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* ── Tech Stack Section ── */}
      <div className="info-section-label" style={{ marginTop: 28 }}>
        <Code2 size={14} />
        <span>Bahasa Pemrograman & Teknologi</span>
      </div>

      <div className="tech-stack-grid">
        {techStack.map(cat => {
          const Icon = cat.icon
          return (
            <article key={cat.category} className="tech-stack-card">
              <div className="tsc-header">
                <div className="tsc-icon" style={{ color: cat.color }}><Icon size={16} /></div>
                <h3 className="tsc-title">{cat.category}</h3>
              </div>
              <div className="tsc-items">
                {cat.items.map(item => {
                  const lc = langColors[item.lang] || langColors['Config']
                  return (
                    <div className="tsc-item" key={item.name}>
                      <div className="tsc-item-top">
                        <span className="tsc-item-name">{item.name}</span>
                        <span className="tsc-lang-badge" style={{ background: lc.bg, color: lc.color, borderColor: lc.border }}>
                          {item.lang}
                        </span>
                      </div>
                      <p className="tsc-item-desc">{item.desc}</p>
                    </div>
                  )
                })}
              </div>
            </article>
          )
        })}
      </div>

      {/* ── Project Info ── */}
      <div className="info-section-label" style={{ marginTop: 28 }}>
        <BookOpen size={14} />
        <span>Informasi Proyek</span>
      </div>

      <article className="panel project-info-panel">
        <div className="project-info-grid">
          {[
            { label: 'Nama Sistem',       val: 'AirWatch — Sistem Monitoring Kualitas Udara' },
            { label: 'Institusi',         val: 'STIKOM El Rahma Bogor' },
            { label: 'Lokasi Sensor',     val: 'Area Parkir STIKOM El Rahma, Bogor, Jawa Barat' },
            { label: 'Koordinat',         val: '-6.5902089°, 106.7856329°' },
            { label: 'Parameter Diukur',  val: 'PM2.5, Asap Rokok, Asap Kendaraan, Suhu, Kelembapan' },
            { label: 'ID Perangkat',      val: 'parkir-esp32-01' },
            { label: 'Interval Sampling', val: 'Setiap 10 detik (konfigurasi firmware)' },
            { label: 'Status Proyek',     val: 'Dalam Pengembangan (Frontend Prototype)' },
          ].map(item => (
            <div className="proj-row" key={item.label}>
              <span className="proj-key">{item.label}</span>
              <span className="proj-val">{item.val}</span>
            </div>
          ))}
        </div>
      </article>

      <div className="disclaimer" style={{ marginTop: 14 }}>
        <Info size={14} />
        <span>Informasi sensor dan spesifikasi mengacu pada datasheet resmi masing-masing komponen. Nilai aktual pembacaan di lapangan dapat disesuaikan melalui kalibrasi firmware ESP32.</span>
      </div>
    </div>
  )
}

