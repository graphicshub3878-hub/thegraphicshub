'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

type Testimonial = {
  name: string
  review: string
  author: string
  project: string
  rating: number
  img: string
}

const testimonials: Testimonial[] = [
  { name: 'MCT Collection', review: "We've collaborated on multiple projects — always a pleasure. Their speed, creativity & professionalism are unmatched.", author: '– MCT', project: 'Logo Design', rating: 5, img: '/sample-card.jpg' },
  { name: 'Sweet VAJ', review: 'They understood my vision perfectly. Delivered exactly what I needed — polished, timely, and aesthetic.', author: '– Aajayi', project: 'Branding', rating: 5, img: '/sample-card.jpg' },
  { name: 'Travel Diva', review: 'Flawless communication & execution! They turned my idea into a brand identity that truly represents me.', author: '– Tomeka Gilmer', project: 'Logo Design', rating: 5, img: '/sample-card.jpg' },
  { name: 'The Luxe Edit', review: 'From logos to product shots — every detail was handled with perfection. You guys truly make design feel like magic.', author: '– Huda', project: 'Complete Branding Kit', rating: 5, img: '/sample-card.jpg' },
  { name: 'Bloom Studios', review: 'Highly professional & creative. Loved how they transformed our dull visuals into a premium brand identity!', author: '– Zara Malik', project: 'Rebranding & Print', rating: 5, img: '/sample-card.jpg' },
]

export default function PraiseSection() {
  // --- Carousel state ---
  const [isHovering, setIsHovering] = useState(false)
  const prefersReduced = useRef(false)

  // progress is fractional index; 0..n-1, wrapped
  const [progress, setProgress] = useState(0)
  const n = testimonials.length
  const toIndex = (p: number) => {
    let x = p % n
    if (x < 0) x += n
    return x
  }
  const activeIndex = Math.round(toIndex(progress))

  // ==== Centering mode (unchanged visuals) ====
  const CENTER_TO_VIEWPORT = true

  // ---- Dynamic layout (computed) ----
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const [base, setBase] = useState(320)        // spacing between cards
  const [leftShift, setLeftShift] = useState(0) // x offset to land active at center
  const ACTIVE_EXTRA = 0

  // Motion feel
  const [parallax, setParallax] = useState(0) // -1..1
  const PARALLAX_X = 10
  const PARALLAX_TILT = 3

  // Drag (pointer) state
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const startProgress = useRef(0)
  const lastPointerId = useRef<number | null>(null)

  useEffect(() => {
    prefersReduced.current =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  }, [])

  // --- Measure to center perfectly and set spacing ---
  useEffect(() => {
    const calc = () => {
      const slider = sliderRef.current
      if (!slider) return

      const card =
        slider.querySelector<HTMLElement>('.card.center') ||
        slider.querySelector<HTMLElement>('.card')

      if (!card) return

      const rect = slider.getBoundingClientRect()
      const sliderW = rect.width
      const cardW = card.offsetWidth

      // where should the LEFT edge of the active card be (in slider's local coords)?
      let centerX: number
      if (CENTER_TO_VIEWPORT) {
        centerX = (window.innerWidth - cardW) / 2 - rect.left
      } else {
        centerX = (sliderW - cardW) / 2
      }

      setLeftShift(-centerX)

      const gap = Math.max(24, Math.round(cardW * 0.12))
      setBase(cardW + gap)
    }

    calc()
    const ro = new ResizeObserver(calc)
    if (sliderRef.current) ro.observe(sliderRef.current)
    window.addEventListener('resize', calc)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', calc)
    }
  }, [CENTER_TO_VIEWPORT])

  // Autoplay
  useEffect(() => {
    if (prefersReduced.current) return
    const t = setInterval(() => {
      if (!isHovering && !isDragging.current) snapTo(progress + 1)
    }, 5600)
    return () => clearInterval(t)
  }, [isHovering, progress])

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') snapTo(progress + 1)
      if (e.key === 'ArrowLeft') snapTo(progress - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [progress])

  const next = () => snapTo(progress + 1)
  const prev = () => snapTo(progress - 1)

  // --- POINTER EVENTS (works consistently on desktop + mobile) ---
  const onPointerDown = (e: React.PointerEvent) => {
    // capture to keep getting move/up even if cursor leaves element
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    lastPointerId.current = e.pointerId

    isDragging.current = true
    dragStartX.current = e.clientX
    startProgress.current = progress

    // visual cursor feedback
    ;(e.currentTarget as HTMLElement).classList.add('grabbing')
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - dragStartX.current
    const deltaSlides = base ? dx / base : 0
    // Follow finger exactly
    setProgress(startProgress.current - deltaSlides)
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    isDragging.current = false

    // release capture if we took it
    if (lastPointerId.current !== null) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(lastPointerId.current)
      } catch {}
      lastPointerId.current = null
    }
    ;(e.currentTarget as HTMLElement).classList.remove('grabbing')

    const dx = e.clientX - dragStartX.current
    const THRESHOLD = 12 // px — small mouse movement ignored

    // Decide direction strictly by pixel distance (robust on desktop)
    const startRound = Math.round(startProgress.current)

    if (Math.abs(dx) <= THRESHOLD) {
      // tap or tiny jiggle → snap back to nearest
      snapTo(startRound)
      return
    }

    // Left drag (dx < 0) → go to next; Right drag (dx > 0) → go to prev
    const target = dx < 0 ? startRound + 1 : startRound - 1
    snapTo(target)
  }

  // Mouse parallax
  const onMouseMoveParallax = (e: React.MouseEvent) => {
    if (prefersReduced.current || isDragging.current) return
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    setParallax((x - 0.5) * 2)
  }

  // Smooth snap (CSS transitions on .card handle easing)
  const snapTo = (target: number) => setProgress(target)

  // Shortest modular distance from slide i to current fractional progress
  const modDist = (i: number, p: number) => {
    let d = i - (p % n)
    if (d > n / 2) d -= n
    if (d <= -n / 2) d += n
    return d
  }

  // Render all slides with stable keys; position via modular distance
  const computed = useMemo(() => {
    return testimonials.map((item, i) => {
      const d = modDist(i, progress) // negative = left, positive = right
      const abs = Math.abs(d)
      const isCenter = Math.round(d) === 0
      const distClamp = Math.min(abs, 3)

      const scale = isCenter ? 1 : 0.94 - distClamp * 0.03
      const opacity = isCenter ? 1 : 0.6 - distClamp * 0.08
      const zIndex = 20 - Math.round(distClamp * 2)

      const x =
        d * base - leftShift - (isCenter ? ACTIVE_EXTRA : Math.floor(ACTIVE_EXTRA / 2))

      const tiltBase = isCenter ? 0 : d > 0 ? -8 : 8
      const tilt = tiltBase + parallax * PARALLAX_TILT

      const style = {
        transform: `translateX(${x}px) translateZ(0) scale(${scale}) rotateY(${tilt}deg)`,
        opacity: Math.max(0, Math.min(1, opacity)),
        zIndex,
        pointerEvents: abs <= 0.6 ? 'auto' : 'none',
      } as React.CSSProperties

      const className = 'card ' + (isCenter ? 'center' : abs < 1.5 ? 'near' : 'far')
      return { item, i, style, className, isCenter }
    })
  }, [progress, base, leftShift, parallax])

  return (
    <section className="praise">
      <h2 className="praise-title">
        Whispers of <span>Praise</span>
      </h2>
      <p className="praise-subtitle">
        Hear from those who’ve experienced our magic firsthand — real stories of transformation from happy clients.
      </p>

      <div
        className="slider-wrapper"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <button className="arrow left" onClick={prev} aria-label="Previous testimonial">‹</button>

        <div
          ref={sliderRef}
          className="slider"
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          // unified pointer events
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          // extras
          onMouseMove={onMouseMoveParallax}
          onDragStart={(e) => e.preventDefault()}
          style={{ transform: `translateX(${parallax * PARALLAX_X}px)` }}
        >
          <div className="fade fade-left" aria-hidden />
          <div className="fade fade-right" aria-hidden />

          {computed.map(({ item, i, style, className, isCenter }) => (
            <article
              key={i}
              className={className}
              style={style}
              aria-roledescription="slide"
              aria-label={`${item.name} — ${item.project}`}
              tabIndex={isCenter ? 0 : -1}
            >
              <div className="hexagon" aria-hidden>
                <Image
                  src={item.img}
                  alt=""
                  width={104}
                  height={104}
                  className="hex"
                  priority={isCenter}
                  draggable={false}
                />
              </div>

              <h3 className="card-title">{item.name}</h3>
              <p className="review">“{item.review}”</p>
              <p className="author">{item.author}</p>
              <p className="project">{item.project}</p>

              <div className="stars" aria-label={`${item.rating} star rating`} role="img">
                {'★'.repeat(item.rating)}
              </div>
            </article>
          ))}
        </div>

        <button className="arrow right" onClick={next} aria-label="Next testimonial">›</button>
      </div>

      <div className="dots" role="tablist" aria-label="Choose testimonial">
        {testimonials.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === activeIndex}
            className={`dot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => snapTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* === styles === */}
      <style jsx>{`
        .praise {
          width: 100%;
          background:
            radial-gradient(90rem 60rem at 55% 28%, #0b0b0b 0%, #000 100%),
            radial-gradient(60rem 34rem at 0% 60%, rgba(255, 215, 0, 0.05), transparent 70%);
          color: #fff;
          text-align: center;
          padding: 120px 5% 180px;
          overflow: hidden;
          position: relative;
          isolation: isolate;
        }

        .praise-title {
          font-size: 3rem;
          font-weight: 700;
          font-family: 'Arima', serif;
          letter-spacing: 0.5px;
        }
        .praise-title span {
           color: #ffd700;
          font-family: 'Corinthia' , serif;
       font-size: clamp(3rem, 8vw, 9rem);
          font-weight: 500;
          margin-left: 1px;
        }
        .praise-subtitle {
          color: rgba(255, 255, 255, 0.82);
font-family: 'Arima', sans-serif;
          max-width: 760px;
          margin: 18px auto 64px;
          font-size: 1.05rem;
        }

        .slider-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 100%;
        }

        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 215, 0, 0.45);
          color: #ffd700;
          font-size: 1.6rem;
          width: 48px;
          height: 48px;
          cursor: pointer;
          border-radius: 50%;
          transition: transform 220ms ease, box-shadow 220ms ease, background 220ms ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
          z-index: 20;
          display: grid;
          place-items: center;
        }
        .arrow:hover,
        .arrow:focus-visible {
          transform: translateY(-50%) scale(1.08);
          box-shadow: 0 6px 20px rgba(0,0,0,0.35);
          outline: none;
          background: rgba(0,0,0,0.55);
        }
        .arrow.left { left: 5%; }
        .arrow.right { right: 5%; }

        .slider {
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1200px;
          width: 100%;
          max-width: 1120px;
          height: 460px;
          position: relative;
          will-change: transform;
          transition: transform 180ms ease-out; /* subtle parallax sway */
          user-select: none;
          cursor: grab;
        }
        .slider.grabbing { cursor: grabbing; }

        .fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 10%;
          pointer-events: none;
          z-index: 6;
        }
        /* optional fades:
        .fade-left { left: 0; background: linear-gradient(to right, rgba(0,0,0,0.7), transparent 70%); }
        .fade-right { right: 0; background: linear-gradient(to left, rgba(0,0,0,0.7), transparent 70%); }
        */

        .card {
          position: absolute;
          left: 0;
          top: 0;
          width: 304px;
          background: rgba(255, 215, 0, 0.06);
          border: 1px solid rgba(255, 215, 0, 0.24);
          border-radius: 16px;
          padding: 28px 22px 48px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.25);
          transition:
            transform 560ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 320ms ease,
            background 180ms ease,
            border-color 180ms ease;
          will-change: transform, opacity;
        }
        .card.center {
          background: rgba(255, 215, 0, 0.1);
          border-color: rgba(255, 215, 0, 0.36);
          box-shadow: 0 10px 26px rgba(0,0,0,0.3);
        }

        .hexagon {
          width: 108px;
          height: 108px;
          background: linear-gradient(145deg, #77530a, #ffd277);
          clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
          margin: 0 auto 16px;
          display: grid;
          place-items: center;
          box-shadow: 0 0 18px rgba(255, 215, 0, 0.25);
        }
        .hex {
          clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
          width: 96px;
          height: 96px;
          object-fit: cover;
        }

        .card-title {
          font-size: 1.12rem;
          font-weight: 700;
          letter-spacing: 0.3px;
        }
        .review {
          font-size: 0.98rem;
          color: #e7e7e7;
          margin: 10px 0 8px;
          line-height: 1.6;
        }
        .author { color: #ffd700; font-weight: 600; margin-top: 8px; }
        .project { color: #b9b9b9; font-size: 0.92rem; }
        .stars { color: #ffd700; font-size: 1.02rem; margin-top: 8px; letter-spacing: 1px; }

        .dots {
          margin-top: 22px;
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: rgba(255, 215, 0, 0.26);
          border: 1px solid rgba(255, 215, 0, 0.46);
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease, width 0.2s ease;
        }
        .dot.active {
          width: 24px;
          background: rgba(255, 215, 0, 0.85);
        }
        .dot:hover, .dot:focus-visible { transform: scale(1.08); outline: none; }

        @media (max-width: 1100px) {
          .arrow.left { left: 3%; }
          .arrow.right { right: 3%; }
        }
        @media (max-width: 992px) {
          .praise { padding: 100px 5% 150px; }
          .praise-title { font-size: 2.6rem; }
          .card { width: 280px; padding: 24px 20px 44px; }
          .slider { height: 430px; }
        }
        @media (max-width: 768px) {
          .arrow { width: 42px; height: 42px; font-size: 1.25rem; }
          .card { width: 240px; padding: 22px 18px 40px; }
          .fade { width: 14%; }
          .slider { height: 410px; }
        }
        @media (max-width: 520px) {
          .praise-title { font-size: 2.05rem; }
          .arrow { width: 36px; height: 36px; font-size: 1.05rem; }
          .card { width: 208px; padding: 20px 16px 36px; }
          .slider { height: 380px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .slider { transition: none; }
          .card { transition: none; }
        }
      `}</style>
    </section>
  )
}
