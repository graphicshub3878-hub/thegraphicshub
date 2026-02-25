'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  CATEGORY_LABELS,
  LABEL_TO_CODE,
  SUBCATEGORIES,
  type CategoryLabel,
} from '@/app/libs/categories'

type Img = {
  _id: string
  category: string
  subcategory?: string | null
  alt?: string
  width?: number
  height?: number
  url: string
  thumbUrl: string
}

export default function ServicesPage() {
  const [cat, setCat] = useState<CategoryLabel>(CATEGORY_LABELS[0])
  const [sub, setSub] = useState<string>('ALL')

  const [items, setItems] = useState<Img[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fade, setFade] = useState(false)
  const [popup, setPopup] = useState<Img | null>(null)

  const railRef = useRef<HTMLDivElement | null>(null)
  const btnLeftRef = useRef<HTMLButtonElement | null>(null)
  const btnRightRef = useRef<HTMLButtonElement | null>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const abortRef = useRef<AbortController | null>(null)

  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollStart = useRef(0)

  const code = LABEL_TO_CODE[cat]
  const subcats = SUBCATEGORIES[code] || []

  // reset subcategory on category change
  useEffect(() => {
    setSub('ALL')
  }, [cat])

  const updateArrows = () => {
    const el = railRef.current
    if (!el) return
    const atStart = el.scrollLeft <= 2
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
    if (btnLeftRef.current) btnLeftRef.current.disabled = atStart
    if (btnRightRef.current) btnRightRef.current.disabled = atEnd
  }

  const scrollByAmount = (dir: 'left' | 'right') => {
    const el = railRef.current
    if (!el) return
    const amt = Math.round(el.clientWidth * 0.7)
    el.scrollBy({ left: dir === 'left' ? -amt : amt, behavior: 'smooth' })
  }

  const centerActive = () => {
    const rail = railRef.current
    const active = itemRefs.current[CATEGORY_LABELS.indexOf(cat)]
    if (!rail || !active) return
    const railRect = rail.getBoundingClientRect()
    const itemRect = active.getBoundingClientRect()
    const delta =
      (itemRect.left + itemRect.right) / 2 - (railRect.left + railRect.right) / 2
    rail.scrollBy({ left: delta, behavior: 'smooth' })
  }

  // ⭐ LOAD IMAGES WITH SUBCATEGORY SUPPORT
  const load = async () => {
    setLoading(true)
    setError(null)

    const controller = new AbortController()
    abortRef.current?.abort()
    abortRef.current = controller

    const qSub = sub === 'ALL' ? '' : `&sub=${encodeURIComponent(sub)}`

    try {
      const res = await fetch(
        `/api/images?cat=${encodeURIComponent(code)}${qSub}&page=1&limit=9999`,
        { cache: 'no-store', signal: controller.signal }
      )
      const json = await res.json()

      if (!res.ok) {
        setError(json?.error || 'Failed to load images')
      } else {
        setItems(json.items || [])
      }
    } catch (e: any) {
      if (e?.name !== 'AbortError') setError(e?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setFade(true)
    const t = setTimeout(() => {
      load().finally(() => {
        setFade(false)
        centerActive()
        updateArrows()
      })
    }, 260)
    return () => {
      clearTimeout(t)
      abortRef.current?.abort()
    }
  }, [cat, sub])

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    const onScroll = () => updateArrows()
    const onResize = () => updateArrows()
    updateArrows()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDragging.current = true
      startX.current = 'touches' in e ? e.touches[0].pageX : e.pageX
      scrollStart.current = rail.scrollLeft
      rail.classList.add('dragging')
    }

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return
      const x = 'touches' in e ? e.touches[0].pageX : e.pageX
      const walk = x - startX.current
      rail.scrollLeft = scrollStart.current - walk
    }

    const onUp = () => {
      isDragging.current = false
      rail.classList.remove('dragging')
    }

    rail.addEventListener('mousedown', onDown)
    rail.addEventListener('mousemove', onMove)
    rail.addEventListener('mouseup', onUp)
    rail.addEventListener('mouseleave', onUp)
    rail.addEventListener('touchstart', onDown)
    rail.addEventListener('touchmove', onMove)
    rail.addEventListener('touchend', onUp)
    return () => {
      rail.removeEventListener('mousedown', onDown)
      rail.removeEventListener('mousemove', onMove)
      rail.removeEventListener('mouseup', onUp)
      rail.removeEventListener('mouseleave', onUp)
      rail.removeEventListener('touchstart', onDown)
      rail.removeEventListener('touchmove', onMove)
      rail.removeEventListener('touchend', onUp)
    }
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPopup(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <section className="wrap">
      <h1 className="title">
        Wonders We<span>Weave</span>
      </h1>

      {/* CATEGORY SLIDER */}
      <div className="catWrap">
        <button ref={btnLeftRef} className="arrow left" onClick={() => scrollByAmount('left')}>
          ‹
        </button>

        <div className="rail" ref={railRef}>
          <div className="track">
            {CATEGORY_LABELS.map((c, i) => (
              <button
                key={c}
                ref={(el: HTMLButtonElement | null) => {
                  itemRefs.current[i] = el
                }}
                className={`tab ${c === cat ? 'active' : ''}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
            <span
              className="underline"
              style={{
                transform: `translateX(${(() => {
                  const idx = CATEGORY_LABELS.indexOf(cat)
                  const el = itemRefs.current[idx]
                  return el ? el.offsetLeft : 0
                })()}px)`,
                width: (() => {
                  const idx = CATEGORY_LABELS.indexOf(cat)
                  const el = itemRefs.current[idx]
                  return el ? el.offsetWidth : 0
                })(),
              }}
            />
          </div>
        </div>

        <button ref={btnRightRef} className="arrow right" onClick={() => scrollByAmount('right')}>
          ›
        </button>
      </div>

      {/* SUBCATEGORY TABS */}
      {subcats.length > 0 && (
        <div className="subTabs">
          <button
            className={`subtab ${sub === 'ALL' ? 'active' : ''}`}
            onClick={() => setSub('ALL')}
          >
            All
          </button>

          {subcats.map(s => (
            <button
              key={s}
              className={`subtab ${sub === s ? 'active' : ''}`}
              onClick={() => setSub(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && <p className="err">{error}</p>}

      <div className={`masonry ${fade ? 'fade-out' : 'fade-in'}`}>
        {items.map(i => (
          <div
            key={i._id}
            className="card"
            onClick={() => setPopup(i)}
            aria-label={i.alt || ''}
          >
           {i.url.match(/\.(mp4|mov|webm)$/i) ? (
  <video
    src={i.url}
    muted
    loop
    autoPlay
    playsInline
    style={{ width: '100%', borderRadius: '10px', display: 'block' }}
  />
) : (
  <Image
    src={i.thumbUrl}
    alt={i.alt || ''}
    width={i.width || 800}
    height={i.height || 600}
    sizes="(max-width:900px) 50vw, 33vw"
    loading="lazy"
    placeholder="blur"
    blurDataURL={`${i.thumbUrl}?q=1&blur=200`}
  />
)}

          </div>
        ))}
      </div>

      {popup && (
        <div className="popup" onClick={() => setPopup(null)}>
          <div className="popup-inner" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setPopup(null)}>
              ×
            </button>
        {popup.url.match(/\.(mp4|mov|webm)$/i) ? (
  <video
    src={popup.url}
    controls
    autoPlay
    style={{
      maxWidth: '90vw',
      maxHeight: '85vh',
      borderRadius: '10px',
      objectFit: 'contain'
    }}
  />
) : (
  <Image
    src={popup.url}
    alt={popup.alt || ''}
    width={popup.width || 1000}
    height={popup.height || 800}
    sizes="90vw"
    className="popup-img"
    style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain' }}
  />
)}

          </div>
        </div>
      )}

      {/* SUBTAB UI STYLES */}
      <style jsx>{`
        .subTabs {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 12px 0 24px;
          flex-wrap: wrap;
        }
        .subtab {
          background: #111;
          border: 1px solid #333;
          padding: 6px 14px;
          border-radius: 8px;
          color: #dcdcdc;
          cursor: pointer;
          font-family: 'Arima', serif;
          transition: 0.25s ease;
        }
        .subtab:hover {
          background: #222;
          border-color: #555;
        }
        .subtab.active {
          background: #ffd700;
          color: #000;
          font-weight: 600;
          border-color: #ffd700;
        }
      `}</style>

      {/* ORIGINAL CSS — UNTOUCHED */}
      <style jsx>{`
        .wrap {
          padding: 150px 16px 40px;
          color: #fff;
          background: #000;
          min-height: 100vh;
        }
        .title {
          text-align: center;
          font-size: 3rem;
          font-weight: 700;
          font-family: 'Arima', serif;
          color: #fff;
          margin-bottom: 10px;
        }
        .title span {
          color: #ffd700;
          font-family: 'Corinthia', serif;
          font-size: clamp(3rem, 7vw, 9rem);
          font-weight: 500;
          // margin-left: -20px;
          margin-left: max(-20px, -1vw);
        }
        .catWrap {
          position: relative;
          max-width: 1200px;
          margin: 6px auto 20px;
          height: 44px;
        }
        .rail {
          position: relative;
          overflow-x: auto;
          overflow-y: hidden;
          height: 44px;
          scrollbar-width: none;
          -ms-overflow-style: none;
          cursor: grab;
          user-select: none;
          padding: 0 50px;
          mask-image: linear-gradient(
            to right,
            transparent 0,
            #000 40px,
            #000 calc(100% - 40px),
            transparent 100%
          );
        }
        .rail::-webkit-scrollbar {
          display: none;
        }
        .rail.dragging {
          cursor: grabbing;
        }
        .track {
          position: relative;
          display: flex;
          align-items: center;
          gap: clamp(14px, 3vw, 28px);
          height: 44px;
          white-space: nowrap;
          width: max-content;
        }
        .tab {
          background: transparent;
          border: 0;
          color: #d8d8d8;
          font-size: clamp(14px, 2vw, 16px);
          cursor: pointer;
          font-family: 'Arima', serif;
          padding: 6px 2px;
          transition: color 0.25s ease, transform 0.25s ease;
        }
        .tab:hover {
          color: #fff;
          transform: translateY(-1px);
        }
        .tab.active {
          color: #ffda6b;
        }
        .underline {
          position: absolute;
          height: 2px;
          background: #ffda6b;
          bottom: 0;
          left: 0;
          transition: transform 0.35s ease, width 0.35s ease;
        }
        .arrow {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 38px;
          font-family: 'Arima', serif;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.75);
          color: #e9c572;
          border: 1px solid #e9c57240;
          border-radius: 10px;
          z-index: 5;
          cursor: pointer;
          transition: background 0.2s ease, opacity 0.2s ease;
        }
        .arrow:hover {
          background: #111;
        }
        .arrow:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .arrow.left {
          left: 0;
        }
        .arrow.right {
          right: 0;
        }
        .masonry {
          column-count: 1;
          column-gap: 14px;
          max-width: 1200px;
          margin: 0 auto;
          opacity: 1;
          transition: opacity 0.4s ease;
        }
        @media (min-width: 700px) {
          .masonry {
            column-count: 2;
          }
        }
        @media (min-width: 1100px) {
          .masonry {
            column-count: 3;
          }
        }
        .fade-out {
          opacity: 0;
        }
        .fade-in {
          opacity: 1;
        }
        .card {
          break-inside: avoid;
          display: block;
          margin: 0 0 14px;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.25s ease;
        }
        .card:hover {
          transform: scale(1.02);
        }
        .card :global(img) {
          width: 100%;
          height: auto;
          display: block;
          background: #111;
          border-radius: 10px;
        }
        .popup {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .popup-inner {
          position: relative;
          max-width: 90vw;
          max-height: 85vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .popup-img {
          width: auto;
          height: auto;
          max-width: 90vw;
          max-height: 85vh;
          border-radius: 10px;
        }
        .close {
          position: absolute;
          top: -36px;
          right: -36px;
          font-size: 36px;
          color: #ffda6b;
          background: none;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .close:hover {
          transform: scale(1.2);
        }
      `}</style>
    </section>
  )
}
