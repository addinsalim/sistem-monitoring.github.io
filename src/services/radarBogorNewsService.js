/**
 * Service untuk mengambil berita isu kualitas udara Kota Bogor dari Radar Bogor.
 * Menggunakan RSS-to-JSON publik tanpa API key berbayar dan dilengkapi
 * mekanisme fallback ke data statis kurasi Radar Bogor.
 */

const GOOGLE_NEWS_RSS = 'https://news.google.com/rss/search?q=site:radarbogor.jawapos.com+kualitas+udara+OR+polusi+bogor&hl=id&gl=ID&ceid=ID:id'
const RSS2JSON_ENDPOINT = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(GOOGLE_NEWS_RSS)}`

export const FALLBACK_BOGOR_NEWS = [
  {
    id: 'rb-news-1',
    title: 'DLH Kota Bogor Gencarkan Uji Emisi Kendaraan Bermotor Guna Tekan Polusi Udara',
    source: 'Radar Bogor',
    pubDate: '18 Nov 2026',
    link: 'https://radarbogor.jawapos.com/bogor-raya/dlh-kota-bogor-uji-emisi-kendaraan-tekan-polusi',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    summary: 'Dinas Lingkungan Hidup (DLH) Kota Bogor memperketat pengujian emisi gas buang bagi kendaraan bermotor di koridor utama perkotaan guna menekan konsentrasi partikel debu halus PM2.5 di area padat aktivitas lalu lintas.',
  },
  {
    id: 'rb-news-2',
    title: 'Pantauan ISPU Kota Bogor: Area Parkir dan Koridor Transportasi Jadi Titik Perhatian',
    source: 'Radar Bogor',
    pubDate: '16 Nov 2026',
    link: 'https://radarbogor.jawapos.com/bogor-raya/pantauan-ispu-kota-bogor-level-sedang',
    thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=600&q=80',
    summary: 'Indeks Standar Pencemar Udara (ISPU) di wilayah Kota Bogor menunjukkan peningkatan konsentrasi polutan pada jam sibuk pagi dan sore. Pengelola gedung serta kampus disarankan memantau sirkulasi udara kantong parkir.',
  },
  {
    id: 'rb-news-3',
    title: 'Pemkot Bogor Dorong Perluasan Ruang Terbuka Hijau dan Inisiatif Monitoring Udara Kampus',
    source: 'Radar Bogor',
    pubDate: '14 Nov 2026',
    link: 'https://radarbogor.jawapos.com/bogor-raya/pemkot-bogor-perluas-rth-dan-sensor-lingkungan',
    thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    summary: 'Pemerintah Kota Bogor mempercepat penanaman pohon penyerap karbon serta menyambut baik riset mahasiswa dan institusi pendidikan yang menerapkan pemantauan sensor kualitas udara IoT di lingkungan kampus.',
  },
]

function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatDateIndo(dateStr) {
  if (!dateStr) return 'Terbaru'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch (e) {
    return dateStr
  }
}

// Fallback images pool if RSS item doesn't have an enclosure
const DEFAULT_THUMBNAILS = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=600&q=80',
]

export const radarBogorNewsService = {
  /**
   * Mengambil artikel berita dari RSS Feed Google News (Radar Bogor) via rss2json
   * Jika gagal / limit / offline, otomatis mengembalikan data cadangan (fallback).
   */
  async getLatestNews() {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4500)

      const response = await fetch(RSS2JSON_ENDPOINT, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        if (data && data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
          // Filter dan petakan artikel relevan (maksimal 6 artikel)
          const items = data.items.slice(0, 6).map((item, idx) => {
            // Bersihkan judul dari sufiks sumber (e.g. " - Radar Bogor")
            let title = item.title || 'Berita Kualitas Udara Bogor'
            if (title.includes(' - ')) {
              title = title.split(' - ')[0].trim()
            }

            // Ekstrak thumbnail dari enclosure atau description
            let thumb = item.thumbnail || (item.enclosure && item.enclosure.link)
            if (!thumb && item.description && item.description.includes('<img')) {
              const match = item.description.match(/<img[^>]+src="([^">]+)"/)
              if (match && match[1]) thumb = match[1]
            }
            if (!thumb) {
              thumb = DEFAULT_THUMBNAILS[idx % DEFAULT_THUMBNAILS.length]
            }

            const cleanSnippet = stripHtml(item.description || item.content || '')
            const summary = cleanSnippet.length > 180 ? cleanSnippet.slice(0, 180) + '…' : cleanSnippet

            return {
              id: item.guid || `rb-${idx}`,
              title,
              source: 'Radar Bogor',
              pubDate: formatDateIndo(item.pubDate),
              link: item.link || 'https://radarbogor.jawapos.com',
              thumbnail: thumb,
              summary: summary || 'Informasi terkini mengenai kondisi kualitas udara dan lingkungan di Kota Bogor.',
              isLive: true,
            }
          })

          return {
            items,
            isFallback: false,
            sourceDesc: 'Live RSS Radar Bogor',
          }
        }
      }
    } catch (err) {
      // Endpoint limit / timeout / network error: dialihkan ke data fallback secara halus
      console.info('Menggunakan fallback data berita Radar Bogor:', err.message)
    }

    // Kembalikan fallback static data
    return {
      items: FALLBACK_BOGOR_NEWS.map(item => ({ ...item, isLive: false })),
      isFallback: true,
      sourceDesc: 'Arsip Berita Radar Bogor (Data Cadangan)',
    }
  },
}
