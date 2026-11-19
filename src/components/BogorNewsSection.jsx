import React, { useState, useEffect } from 'react'
import {
  Newspaper, ExternalLink, RotateCw, Calendar,
  Sparkles, CheckCircle2, AlertCircle, Bookmark
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { radarBogorNewsService, FALLBACK_BOGOR_NEWS } from '../services/radarBogorNewsService'

export default function BogorNewsSection() {
  const { isDark } = useTheme()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)
  const [sourceDesc, setSourceDesc] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')

  const fetchNews = async () => {
    setLoading(true)
    try {
      const result = await radarBogorNewsService.getLatestNews()
      setArticles(result.items || [])
      setIsFallback(result.isFallback)
      setSourceDesc(result.sourceDesc)
      setLastUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB')
    } catch (e) {
      setArticles(FALLBACK_BOGOR_NEWS)
      setIsFallback(true)
      setSourceDesc('Arsip Berita Radar Bogor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  // Fallback placeholder image jika gambar eksternal gagal dimuat
  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  }

  return (
    <article className="panel bogor-news-panel" style={{ padding: '24px', marginTop: '20px', marginBottom: '24px' }}>
      {/* ── Section Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
        <div>
          <div style={{
            fontSize: '9.5px',
            fontWeight: 700,
            letterSpacing: '1.2px',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 6,
            textTransform: 'uppercase'
          }}>
            <Newspaper size={13} />
            <span>Kabar Daerah / Lingkungan Hidup</span>
          </div>
          <h2 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 750,
            color: isDark ? '#f1f6ff' : '#0f172a',
            letterSpacing: '-0.4px',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            Berita & Isu Kualitas Udara Kota Bogor
          </h2>
          <p style={{
            margin: '6px 0 0',
            fontSize: '11px',
            color: isDark ? '#8ca4c3' : '#64748b',
            lineHeight: 1.5
          }}>
            Rangkuman artikel terkini seputar uji emisi, polusi kendaraan, dan kebijakan lingkungan dari <b>Radar Bogor</b>.
          </p>
        </div>

        {/* ── Action: Reload Button & Source Status ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: '10px',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '20px',
            background: isDark ? (isFallback ? '#1e293b' : '#0c2e24') : (isFallback ? '#f1f5f9' : '#dcfce7'),
            color: isDark ? (isFallback ? '#94a3b8' : '#4ade80') : (isFallback ? '#475569' : '#15803d'),
            border: isDark ? (isFallback ? '1px solid #334155' : '1px solid #166534') : (isFallback ? '1px solid #cbd5e1' : '1px solid #86efac'),
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: isFallback ? '#f59e0b' : '#22c55e'
            }} />
            {sourceDesc || 'Radar Bogor'}
          </span>

          <button
            type="button"
            className="primary-button"
            onClick={fetchNews}
            disabled={loading}
            title="Perbarui daftar artikel berita terbaru"
            style={{
              padding: '6px 12px',
              fontSize: '10.5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <RotateCw size={12} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Memuat...' : 'Muat Ulang Berita'}</span>
          </button>
        </div>
      </div>

      {/* ── Loading Skeleton Indicator ── */}
      {loading ? (
        <div className="news-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="news-card news-skeleton" style={{
              background: isDark ? '#0b192e' : '#f8fafc',
              border: isDark ? '1px solid #1c3252' : '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{
                height: 160,
                borderRadius: '8px',
                background: isDark ? 'linear-gradient(90deg, #13243d 25%, #1a3254 50%, #13243d 75%)' : 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-pulse 1.5s infinite ease-in-out'
              }} />
              <div style={{ width: '40%', height: 16, borderRadius: 4, background: isDark ? '#1a304e' : '#cbd5e1' }} />
              <div style={{ width: '90%', height: 20, borderRadius: 4, background: isDark ? '#1a304e' : '#cbd5e1' }} />
              <div style={{ width: '70%', height: 20, borderRadius: 4, background: isDark ? '#1a304e' : '#cbd5e1' }} />
              <div style={{ width: '100%', height: 36, borderRadius: 4, background: isDark ? '#122238' : '#e2e8f0', marginTop: 'auto' }} />
            </div>
          ))}
        </div>
      ) : (
        /* ── 3-Column Responsive News Grid ── */
        <div className="news-grid">
          {articles.map((item) => (
            <div
              key={item.id}
              className="news-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                overflow: 'hidden',
                background: isDark ? '#0b182d' : '#ffffff',
                border: isDark ? '1px solid #1a2f4d' : '1px solid #e2e8f0',
                boxShadow: isDark ? '0 4px 18px rgba(3, 10, 24, 0.4)' : '0 4px 18px rgba(15, 23, 42, 0.05)',
                transition: 'all 0.22s ease',
              }}
            >
              {/* Thumbnail Image */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: 168,
                overflow: 'hidden',
                background: isDark ? '#10223b' : '#f1f5f9'
              }}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  onError={handleImageError}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.35s ease'
                  }}
                  className="news-thumb-img"
                />
                <span style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: '9.5px',
                  fontWeight: 700,
                  background: 'rgba(11, 24, 45, 0.88)',
                  backdropFilter: 'blur(8px)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <Bookmark size={10} /> {item.source}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Meta: Date */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: '10px',
                  color: isDark ? '#7a94b4' : '#64748b',
                  marginBottom: 8
                }}>
                  <Calendar size={12} style={{ color: '#38bdf8' }} />
                  <span>{item.pubDate}</span>
                </div>

                {/* Title (Line Clamp 2) */}
                <h3
                  title={item.title}
                  style={{
                    margin: '0 0 10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    lineHeight: 1.4,
                    color: isDark ? '#f1f7ff' : '#0f172a',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '36px'
                  }}
                >
                  {item.title}
                </h3>

                {/* Summary (Line Clamp 3) */}
                <p
                  style={{
                    margin: '0 0 16px',
                    fontSize: '11px',
                    lineHeight: 1.55,
                    color: isDark ? '#8ca4c3' : '#475569',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1
                  }}
                >
                  {item.summary}
                </p>

                {/* Read More Button */}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-read-more-btn"
                  style={{
                    marginTop: 'auto',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    background: isDark ? '#11253e' : '#f0f9ff',
                    color: isDark ? '#7dd3fc' : '#0284c7',
                    border: isDark ? '1px solid #1c3c62' : '1px solid #bae6fd',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>Baca Selengkapnya</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info / Note */}
      <div style={{
        marginTop: 18,
        paddingTop: 12,
        borderTop: isDark ? '1px solid #162a45' : '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        fontSize: '10px',
        color: isDark ? '#6b86a8' : '#64748b'
      }}>
        <span>
          Data disinkronkan secara otomatis melalui RSS Google News Domain <b>Radar Bogor</b> (radarbogor.jawapos.com).
        </span>
        {lastUpdated && <span>Pembaruan: {lastUpdated}</span>}
      </div>
    </article>
  )
}
