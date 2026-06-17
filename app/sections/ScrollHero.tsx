'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Props = {
  numFrames?: number
  scrollHeight?: string
}

const FRAME_FOLDER = '/assets/videos/heroanim'

const getFrame = (index: number) => {
  return `${FRAME_FOLDER}/${String(index).padStart(4, '0')}.png`
}

export default function ImageSequenceCanvas({
  numFrames = 121,
  scrollHeight = '900vh',
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameRef = useRef({ frame: 0 })

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      const img = imagesRef.current[Math.round(frameRef.current.frame)]
      if (!img || !img.complete) return

      const vw = window.innerWidth
      const vh = window.innerHeight

      const scale = Math.max(vw / img.naturalWidth, vh / img.naturalHeight)
      const w = img.naturalWidth * scale
      const h = img.naturalHeight * scale
      const x = (vw - w) / 2
      const y = (vh - h) / 2

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

    imagesRef.current = []

    for (let i = 1; i <= numFrames; i++) {
      const img = new Image()
      img.src = getFrame(i)
      imagesRef.current.push(img)

      if (i === 1) {
        img.onload = () => {
          setCanvasSize()
          render()
        }
      }
    }

    setCanvasSize()

    const tween = gsap.to(frameRef.current, {
      frame: numFrames - 1,
      ease: 'none',
      snap: 'frame',
      onUpdate: render,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${scrollHeight}`,
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    window.addEventListener('resize', setCanvasSize)

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      tween.kill()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [numFrames, scrollHeight])

  return (
    <section ref={sectionRef} className="hero-sequence">
      <canvas ref={canvasRef} />

      <style jsx>{`
        .hero-sequence {
          width: 100%;
          height: 100vh;
          background: #000;
          position: relative;
          overflow: hidden;
        }

        canvas {
          display: block;
          width: 100vw;
          height: 100vh;
          background: #000;
        }
      `}</style>
    </section>
  )
}