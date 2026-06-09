'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Slide = {
  id: number
  title: string
  desc: string
  img: string
  character: string
}

const slides: Slide[] = [
  { id: 1, title: 'Advertising Magician', desc: "Elevate your brand with our expert digital marketing solutions. From crafting compelling campaigns to optimizing your online presence, we're your go-to advertising magicians.", img: '/assets/images/advertising-bg.png', character: '/assets/images/advertising.png' },
  { id: 2, title: 'Amazon Elf', desc: 'Conquer the Amazon marketplace with our comprehensive e-commerce services. From product optimization to fulfillment & marketing, we are your trusted partner for Amazon success.', img: '/assets/images/Amazon-bg.png', character: '/assets/images/Amazon.png' },
  { id: 3, title: 'App Enchanter', desc: 'Transform your ideas into enchanting mobile & web apps. Our skilled developers specialize in designing & building innovative apps that engage & delight users.', img: '/assets/images/Appencharter-bg.png', character: '/assets/images/Appencharter.png' },
  { id: 4, title: 'Design Genie', desc: 'Unleash your creativity with our versatile design services. From stunning graphics to functional interiors, our genies bring your vision to life.', img: '/assets/images/Designgenie-bg.png', character: '/assets/images/Designgenie.png' },
  { id: 5, title: 'Scribbling Witch', desc: 'Cast a spell on your audience with our captivating content writing. From blog posts to product descriptions, we craft compelling narratives that resonate.', img: '/assets/images/Scribblingwitch-bg.jpg', character: '/assets/images/Scribblingwitch.png' },
  { id: 6, title: 'Web Wizard', desc: 'Weave a digital masterpiece with our expert web design & development. Whether you need a WordPress blog or a custom-coded e-commerce platform, we will create a website that exceeds your expectations.', img: '/assets/images/Webwizard-bg.png', character: '/assets/images/Webwizard.png' },
]

const CARD_AR = 470 / 300
const VIEWPORT_PAD_LEFT = 0

function calcDims(w: number) {
  if (w <= 480) {
    const cardW = Math.round(w * 0.72)
    const gap = 12
    const viewCards = 1.15
    return { cardW, cardH: Math.round(cardW * CARD_AR), gap, viewCards }
  }
  if (w <= 768) {
    const cardW = Math.round(w * 0.6)
    const gap = 14
    const viewCards = 1.35
    return { cardW, cardH: Math.round(cardW * CARD_AR), gap, viewCards }
  }
  if (w <= 1280) {
    const cardW = 260
    const gap = 24
    const viewCards = 2.5
    return { cardW, cardH: Math.round(cardW * CARD_AR), gap, viewCards }
  }
  return { cardW: 300, cardH: 470, gap: 20, viewCards: 3 }
}

export default function MysticPortalExact() {
  const router = useRouter()

  // dims (responsive)
  const [dims, setDims] = useState(() => ({ cardW: 300, cardH: 470, gap: 20, viewCards: 3 }))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const update = () => setDims(calcDims(window.innerWidth))
    update()
    setMounted(true)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const { cardW, cardH, gap, viewCards } = dims
  const STEP = cardW + gap

  // 👇 Clone count depends on visible cards to avoid edge gaps
  const cloneCount = useMemo(() => Math.max(2, Math.ceil(viewCards) + 1), [viewCards])

  // build extended list with adequate clones on both ends
  const extended = useMemo(() => {
    const head = slides.slice(-cloneCount)
    const tail = slides.slice(0, cloneCount)
    return [...head, ...slides, ...tail]
  }, [cloneCount])

  // indices
  const firstReal = cloneCount
  const lastReal = cloneCount + slides.length - 1

  // carousel state
  const [pos, setPos] = useState(firstReal)
  useEffect(() => {
    // whenever cloneCount changes (viewport change), re-center to first real
    setPos(cloneCount)
  }, [cloneCount])

  const [transitionMs, setTransitionMs] = useState(450)
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [velocity, setVelocity] = useState(0)

  const autoRef = useRef<NodeJS.Timeout | null>(null)
  const lastX = useRef(0)
  const lastT = useRef(0)

  // auto-advance
  useEffect(() => {
    if (!mounted) return
    if (autoRef.current) clearTimeout(autoRef.current)
    autoRef.current = setTimeout(() => {
      setTransitionMs(450)
      setPos((current) => current + 1)
    }, 6000) as unknown as NodeJS.Timeout
    return () => { if (autoRef.current) clearTimeout(autoRef.current) }
  }, [pos, mounted])

  const go = (delta: number) => {
    setTransitionMs(450)
    setPos(p => p + delta)
  }
  const next = () => go(1)
  const prev = () => go(-1)

  // ✅ seamless wrap using dynamic cloneCount (prevents empties at edges)
  const onTransitionEnd = () => {
    if (pos > lastReal) {
      setTransitionMs(0)
      requestAnimationFrame(() => {
        setPos(pos - slides.length)
        requestAnimationFrame(() => setTransitionMs(450))
      })
    } else if (pos < firstReal) {
      setTransitionMs(0)
      requestAnimationFrame(() => {
        setPos(pos + slides.length)
        requestAnimationFrame(() => setTransitionMs(450))
      })
    }
  }

  // drag
  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    setDragging(true); setTransitionMs(0); setStartX(x)
    lastX.current = x; lastT.current = performance.now()
    if (autoRef.current) clearTimeout(autoRef.current)
  }
  const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const now = performance.now()
    setDrag(x - startX)
    const dx = x - lastX.current
    const dt = now - lastT.current
    setVelocity(dx / Math.max(dt, 1))
    lastX.current = x; lastT.current = now
  }
  const onDragEnd = () => {
    if (!dragging) return
    const momentum = velocity * 200
    const total = drag + momentum
    const steps = Math.round(total / STEP)
    setDragging(false); setDrag(0); setTransitionMs(450)
    if (steps > 0) go(-1)
    else if (steps < 0) go(1)
  }

  // mapping helpers
  const norm = (i: number, len: number) => ((i % len) + len) % len
  const realIndex = norm(pos - cloneCount, slides.length)
  const active = slides[realIndex] ?? slides[0]
  const trackX = VIEWPORT_PAD_LEFT - (pos * STEP) + drag
  const [firstWord, secondWord = ''] = active.title.split(' ')

  if (!mounted) {
    return (
      <section
        aria-hidden="true"
        style={{ minHeight: '100vh', background: '#000' }}
      />
    )
  }

  return (
    <>
      <section className="portal-intro">
        <h2 className="portal-heading__title">
          Beyond the <span>Hub</span>
        </h2>
        <p className="portal-heading__description">
          Explore our extended creative universe at Wonder Works Digital, where
          more digital solutions come to life.
        </p>
      </section>

      <section
        className="portal"
        onDragStart={(e) => e.preventDefault()}
        style={
          {
            ['--card-w' as any]: `${cardW}px`,
            ['--card-h' as any]: `${cardH}px`,
            ['--gap' as any]: `${gap}px`,
            ['--view-cards' as any]: viewCards,
          } as React.CSSProperties
        }
      >
      {/* BG cross-fade */}
      <div className="bg-layer">
        {slides.map((s, i) => (
          <div key={s.id} className={`bg ${i === realIndex ? 'show' : ''}`} style={{ backgroundImage: `url(${s.img})` }} />
        ))}
      </div>
      <div className="overlay" />

      <div className="portal__content">
        {/* LEFT RAIL */}
        <aside className="rail">
          <div className="rail__line" aria-hidden />
          <div className="rail__dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`rail__dot ${i === realIndex ? 'is-active' : ''}`}
                onClick={() => { setTransitionMs(450); setPos(i + cloneCount) }}
                aria-label={`Go to ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </aside>

        {/* GLASS CONTENT */}
        <div className="glass">
          <h2 key={`title-${active.id}`} className="title animate-text">
            {firstWord}{' '}
            <span className="script animate-text delay-1">{secondWord}</span>
          </h2>
          <p key={`desc-${active.id}`} className="desc animate-text delay-2">
            {active.desc}
          </p>

          <div className="wpforms-submit-container">
            <button
              className="wpforms-submit"
              onClick={() => router.push('/services')}
            >
              Let’s Explore
            </button>
          </div>
        </div>

        {/* RIGHT CARDS */}
        <div className="cards">
          <div
            className="viewport"
            onMouseDown={onDragStart}
            onMouseMove={onDragMove}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
            onTouchStart={onDragStart}
            onTouchMove={onDragMove}
            onTouchEnd={onDragEnd}
            onTouchCancel={onDragEnd}
          >
            <div
              className="track"
              style={{
                transform: `translate(${trackX}px, -50%)`,
                transition: transitionMs ? `transform ${transitionMs}ms cubic-bezier(0.25,1,0.3,1)` : 'none',
              }}
              onTransitionEnd={onTransitionEnd}
            >
              {extended.map((s, i) => {
                const dist = Math.abs(i - pos)
                const isActive = dist === 0

                // stronger emphasis on active card
                const scale   = isActive ? 1.08 : dist === 1 ? 0.90 : 0.78
                const opacity = isActive ? 1    : dist === 1 ? 0.70 : 0.45
                const zIndex  = isActive ? 3    : dist === 1 ? 2    : 1
                const shadow  = isActive
                  ? '0 12px 28px rgba(255,204,0,.20), 0 2px 0 rgba(255,204,0,.25) inset'
                  : 'none'

                return (
                  <div
                    key={`${s.id}-${i}`}
                    className={`card ${isActive ? 'is-active' : ''}`}
                    style={{ transform: `scale(${scale})`, opacity, zIndex, boxShadow: shadow }}
                  >
                    <Image
                      src={s.character}
                      alt={s.title}
                      width={cardW}
                      height={cardH}
                      draggable={false}
                      unoptimized
                    />
                  </div>
                )
              })}
            </div>
          </div>
          <button className="arrow right" onClick={next} aria-label="Next">›</button>
        </div>
      </div>
      </section>

      {/* === FULL STYLE BLOCK === */}
      <style jsx>{`
        .portal-intro { width: 100%; padding: 56px 5% 42px; color: #fff; background: #000; text-align: center; }
        .portal { position: relative; width: 100%; min-height: 100vh; color: #fff; background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center; padding: 80px 40px; }
        .bg-layer { position: absolute; inset: 0; z-index: 0; }
        .bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transform: scale(1.04); transition: opacity .9s ease, transform 1.2s ease; }
        .bg.show { opacity: 1; transform: scale(1); }
        .overlay { position: absolute; inset: 0; background: rgba(0,0,0,.55); z-index: 1; }
        .portal-heading__title { margin: 0 0 18px; font-size: 3rem; font-weight: 700; font-family: 'Arima', serif; }
        .portal-heading__title span { color: #ffd700; font-family: 'Corinthia', serif; font-size: clamp(3rem, 7vw, 9rem); font-weight: 500; margin-left: -15px; }
        .portal-heading__description { max-width: 650px; margin: 0 auto; color: rgba(255,255,255,.8); font-family: 'Arima', sans-serif; font-size: 1rem; line-height: 1.7; }
        .portal__content { position: relative; z-index: 2; width: 100%; max-width: 1500px; display: grid; grid-template-columns: 56px 720px 1fr; column-gap: 40px; align-items: center; }

        .rail { position: relative; height: 100%; justify-self: start; }
        .rail__line { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, rgba(255,255,255,.2), rgba(255,255,255,.08)); transform: translateX(-50%); border-radius: 1px; }
        .rail__dots { position: relative; display: grid; justify-items: center; align-content: space-between; height: 560px; margin-left: 0; margin-right: auto; padding: 8px 0; }
        .rail__dot { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; border: 2px solid #ffcc00; color: #ffcc00; background: rgba(0,0,0,.35); font-weight: 600; cursor: pointer; transition: .2s; }
        .rail__dot.is-active { background: #ffcc00; color: #000; transform: scale(1.04); }

        .glass { position: relative; border-radius: 10px; padding: 32px 36px 28px; background: rgba(0,0,0,.35); border: 1px solid rgba(255,255,255,.12); backdrop-filter: blur(7px); -webkit-backdrop-filter: blur(7px); }

        .title { margin: 0 0 16px 0; font-family: 'arima', serif; font-weight: 700; font-size: clamp(32px, 5vw, 54px); }
        .script { font-family: 'Corinthia', cursive; color: #ffcc00; text-shadow: 0 0 24px rgba(255,204,0,.28); font-weight: 500; font-size: clamp(3rem, 6vw, 9rem); }
        .desc { margin: 0 0 20px 0; max-width: 560px; line-height: 1.7; color: #eaeaea; font-family: 'Arima', sans-serif; }

        /* === Text entrance animation === */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-text { opacity: 0; animation: fadeSlideUp .55s cubic-bezier(.22,.9,.24,1) forwards; }
        .animate-text.delay-1 { animation-delay: .08s; }
        .animate-text.delay-2 { animation-delay: .16s; }

        .cards { position: relative; display: grid; grid-template-columns: 1fr; align-items: center; overflow: visible; }

        /* ⬇️ Prevent top cutting: give extra room & no clipping */
        .viewport {
          position: relative;
          width: calc(var(--view-cards) * var(--card-w) + (var(--view-cards) - 1) * var(--gap));
          max-width: 100%;
          height: calc(var(--card-h) + 80px); /* extra headroom for 1.08 scale */
          overflow: visible;                 /* allow scaled card to overflow */
          border-radius: 8px;
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
          cursor: grab;
          clip-path: inset(0 0 0 -20px);
        }
        .viewport:active { cursor: grabbing; }

        .track { position: absolute; top: 50%; left: 0; display: flex; align-items: center; transform: translateY(-50%); will-change: transform; gap: var(--gap); }

        .card { width: var(--card-w); height: var(--card-h); border-radius: 12px; background: #111; display: grid; place-items: center; transition: transform .45s cubic-bezier(.25,1,.3,1), opacity .25s ease; overflow: visible; box-shadow: none !important; transform-origin: center bottom; }
        .card :global(img) { width: 100%; height: 100%; object-fit: contain; pointer-events: none; border-radius: 20px; will-change: transform; }
        .card.is-active { transform-origin: center bottom; }
        .viewport:active .card.is-active { transform: scale(1.08) translateY(-2px) rotateZ(-.2deg); }

        .arrow { display: none !important; }

        /* === Gold Button === */
        .wpforms-submit-container {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }
        .wpforms-submit {
          width: 150px;
          height: 40px;
          border: none;
          font-family: 'Arima', serif;
          border-radius: 10px;
          background: linear-gradient(to right, #77530a, #ffd277, #77530a, #77530a, #ffd277, #77530a);
          background-size: 200%;
          background-position: left;
          color: #ffd277;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-position 1s;
          overflow: hidden;
        }
        .wpforms-submit::before {
          position: absolute;
          content: 'Let’s Explore';
          color: #ffd700;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 97%;
          height: 90%;
          border-radius: 8px;
          background-color: rgba(0, 0, 0, 0.84);
          background-size: 200%;
          background-position: left;
          transition: background-position 1s;
        }
        .wpforms-submit:hover { background-position: right; }
        .wpforms-submit:hover::before { background-position: right; }
        .wpforms-submit:disabled {
          filter: grayscale(0.6) brightness(0.8);
          cursor: not-allowed;
        }

        @media (max-width: 1024px) {
          .portal__content { grid-template-columns: 1fr; row-gap: 28px; }
          .glass { order: 1; }
          .cards { order: 2; justify-items: start; }
          .viewport { width: 100%; }
        }
        @media (max-width: 768px) {
          .portal-intro { padding: 36px 5% 30px; }
          .portal { padding: 56px 20px; }
          .portal-heading__title { margin-bottom: 12px; font-size: 2.4rem; }
          .portal-heading__description { font-size: .9rem; }
          .rail { display: none !important; }
        }
        @media (max-width: 480px) {
          .portal-heading__title { font-size: 1.8rem; }
        }
      `}</style>
    </>
  )
}
