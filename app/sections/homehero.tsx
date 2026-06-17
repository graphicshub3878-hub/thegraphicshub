'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const FRAME_FOLDER = '/assets/videos/heroanim'
const TOTAL_FRAMES = 121

const getFrame = (index: number) => {
  return `${FRAME_FOLDER}/${String(index).padStart(4, '0')}.webp`
}

const HomeHero = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameRef = useRef({ frame: 0 })
  const lastImageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkScreen()
    window.addEventListener('resize', checkScreen)

    return () => {
      window.removeEventListener('resize', checkScreen)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (isMobile) return

    gsap.registerPlugin(ScrollTrigger)

    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      const currentIndex = Math.round(frameRef.current.frame)
      const currentImg = imagesRef.current[currentIndex]

      const img =
        currentImg && currentImg.complete && currentImg.naturalWidth
          ? currentImg
          : lastImageRef.current

      if (!img) return

      lastImageRef.current = img

      const vw = window.innerWidth
      const vh = window.innerHeight
      const imgRatio = img.naturalWidth / img.naturalHeight
      const screenRatio = vw / vh

      let w = vw
      let h = vh
      let x = 0
      let y = 0

      if (imgRatio > screenRatio) {
        h = vh
        w = vh * imgRatio
        x = (vw - w) / 2
      } else {
        w = vw
        h = vw / imgRatio
        y = (vh - h) / 2
      }

      ctx.clearRect(0, 0, vw, vh)
      ctx.drawImage(img, x, y, w, h)
    }

    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      render()
    }

    imagesRef.current = new Array(TOTAL_FRAMES)

    const loadFrame = (frameNumber: number) => {
      const index = frameNumber - 1

      if (imagesRef.current[index]) return

      const img = new Image()
      img.src = getFrame(frameNumber)
      imagesRef.current[index] = img

      img.onload = () => {
        if (frameNumber === 1) {
          lastImageRef.current = img
          setCanvasSize()
          render()
        }
      }
    }

    const idle =
      window.requestIdleCallback ||
      function (cb: IdleRequestCallback) {
        return window.setTimeout(cb, 1)
      }

    loadFrame(1)

    for (let i = 2; i <= 20; i++) {
      loadFrame(i)
    }

    idle(() => {
      for (let i = 21; i <= TOTAL_FRAMES; i++) {
        loadFrame(i)
      }
    })

    const tween = gsap.to(frameRef.current, {
      frame: TOTAL_FRAMES - 1,
      ease: 'none',
      snap: 'frame',
      onUpdate: render,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=600vh',
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
      },
    })

    window.addEventListener('resize', setCanvasSize)

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      tween.kill()
    }
  }, [isMobile])

  if (isMobile) {
    return (
      <section className="hero mobile-hero">
        <div className="frame">
          <video
            className="vid"
            src="/assets/videos/tghh.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </div>

        <style jsx>{`
          .hero {
            position: relative;
            width: 100%;
            min-height: 55vh;
            overflow: hidden;
            background: black;
            display: flex;
            justify-content: center;
          }

          .frame {
            position: relative;
            width: 100vw;
            aspect-ratio: 4 / 3;
            overflow: hidden;
          }

          .vid {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: center bottom;
            transform: scale(1.02) translateY(-3%);
            transform-origin: center bottom;
          }
        `}</style>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="hero-sequence">
      <canvas ref={canvasRef} />

      <div className={`scroll-indicator ${hasScrolled ? 'hide' : ''}`}>
        <span>Scroll</span>
        <div className="mouse">
          <div className="wheel" />
        </div>
      </div>

      <style jsx>{`
        .hero-sequence {
          width: 100%;
          height: 100vh;
          background: #000;
          overflow: hidden;
          position: relative;
        }

        canvas {
          display: block;
          width: 100vw;
          height: 100vh;
          background: #000;
        }

        .scroll-indicator {
          position: absolute;
          left: 50%;
          bottom: 34px;
          transform: translateX(-50%);
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: rgba(255, 255, 255, 0.75);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          pointer-events: none;
          animation: fadeUpDown 1.8s ease-in-out infinite;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }

        .scroll-indicator.hide {
          opacity: 0;
          transform: translateX(-50%) translateY(20px);
          animation: none;
        }

        .mouse {
          width: 24px;
          height: 38px;
          border: 1.5px solid rgba(255, 255, 255, 0.65);
          border-radius: 999px;
          display: flex;
          justify-content: center;
          padding-top: 7px;
        }

        .wheel {
          width: 4px;
          height: 7px;
          background: var(--accent-orange);
          border-radius: 99px;
          animation: wheelMove 1.3s ease-in-out infinite;
        }

        @keyframes wheelMove {
          0% {
            opacity: 0;
            transform: translateY(0);
          }
          35% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(12px);
          }
        }

        @keyframes fadeUpDown {
          0%,
          100% {
            opacity: 0.55;
            transform: translateX(-50%) translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) translateY(-6px);
          }
        }
      `}</style>
    </section>
  )
}

export default HomeHero