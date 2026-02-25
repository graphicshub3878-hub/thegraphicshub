'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const cards = [
  { i: -5, title: 'UI/UX Design', desc: 'Design intuitive & user-friendly interfaces that enhance digital experiences.', link: '#', img: '/assets/images/UI-UX.png' },
  { i: -4, title: 'Stationary', desc: 'Professional & cohesive business essentials like cards & letterheads.', link: '#', img: '/assets/images/Stationary-Kit.png' },
  { i: -3, title: 'Social Media', desc: 'Create engaging posts & templates to boost brand presence.', link: '#', img: '/assets/images/Social-Media-.png' },
  { i: -2, title: 'Logo Design', desc: 'Craft unique & impactful logos representing brand values.', link: '#', img: '/assets/images/Logo-Design.png' },
  { i: -1, title: 'Branding', desc: 'Develop color schemes, typography, & visual elements.', link: '#', img: '/assets/images/Branding.png' },
  { i: 0, title: 'View All', desc: '', link: '#', img: '/assets/images/All-Services-1.png' },
  { i: 1, title: 'Print Media', desc: 'Design visually compelling brochures & flyers.', link: '#', img: '/assets/images/Print-Media.png' },
  { i: 2, title: 'Video Editing / Animation', desc: 'Produce dynamic video content & animations.', link: '#', img: '/assets/images/Video-Editing-Animation.png' },
  { i: 3, title: 'Product Design / Packaging', desc: 'Innovative & appealing packaging designs.', link: '#', img: '/assets/images/Product-Designing-Packaging.png' },
  { i: 4, title: 'Interior / Exterior', desc: 'Design captivating spaces aligned with your brand.', link: '#', img: '/assets/images/Interior-Exterior.png' },
  { i: 5, title: 'Character Design', desc: 'Create custom characters for storytelling & branding.', link: '#', img: '/assets/images/Character-Design.png' },
]

export default function WondersSection() {
  const [hovered, setHovered] = useState<{ title: string; desc: string } | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [animate, setAnimate] = useState(false)
  const sectionRef = useRef<HTMLDivElement | null>(null)

  // 🎬 Trigger animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAnimate(true)
      },
      { threshold: 0.4 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className={`wonders ${animate ? 'animate' : ''}`}>
      <h2 className="title">
        Wonders <span>We Weave</span>
      </h2>
      <p className="subtitle">
        Dive into our array of mystical offerings – from web enchantments to branding spells &
        immersive 3D illusions.
      </p>

      <div className="card-container">
        {cards.map((card) => (
          <div
            key={card.i}
            className={`card ${animate ? 'visible' : ''} ${hoveredCard === card.i ? 'lifted' : ''}`}
            style={{ '--i': card.i } as React.CSSProperties}
            onMouseEnter={() => {
              setHovered({ title: card.title, desc: card.desc })
              setHoveredCard(card.i)
            }}
            onMouseLeave={() => {
              setHovered(null)
              setHoveredCard(null)
            }}
          >
            <Image
              src={card.img}
              alt={card.title}
              width={200}
              height={300}
              unoptimized
              priority
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '6px',
                objectFit: 'cover',
              }}
            />
          </div>
        ))}

        <div className={`title-display ${hovered ? 'show' : ''}`}>
          <div className="title-text">{hovered?.title || ''}</div>
          <div className="description">{hovered?.desc || ''}</div>
        </div>
      </div>

      <style jsx>{`
       .wonders {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #000;
  color: #fff;
  text-align: center;
  padding: 100px 5% 300px;
  background-image: url('/assets/images/cardsbg.png');
  background-size: 900px;
  background-repeat: repeat;
  background-position: center;
  margin-bottom: 100px;
  box-sizing: border-box;
}

/* TOP + BOTTOM BLACK FADES */
.wonders::before,
.wonders::after {
  content: "";
  position: absolute;
  left: 0;
  width: 100%;
  height: 120px;        /* adjust fade height */
  pointer-events: none;
  z-index: 2;
}

.wonders::before {
  top: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));
}

.wonders::after {
  bottom: 0;
  background: linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0));
}


        .title {
          font-size: 3rem;
          font-weight: 700;
          font-family: 'Arima', serif;
        }

        .title span {
              color: #ffd700;
          font-family: 'Corinthia' , serif;
       font-size: clamp(3rem, 7vw, 9rem);
          font-weight: 500;
          margin-left: -15px;
        }

        .subtitle {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 650px;
          margin: 20px auto 60px;
          font-family: 'Arima', sans-serif;
        }

        .card-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          position: relative;
          height: 400px;
          overflow: visible;
        }

        .card {
          position: absolute;
          width: 200px;
          height: 300px;
          border-radius: 10px;
          background: linear-gradient(to right, #77530a, #ffd277, #77530a);
          padding: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          opacity: 0;
          transform-origin: 50% 250%;
          transform: translateY(80px) scale(0.8);
          transition: all 0.4s ease;
        }

        /* 🎬 Animation after scroll */
        .animate .card.visible {
          opacity: 1;
          transform: rotate(calc(var(--i) * 12deg))
            translate(calc(var(--i) * -15px), 10px)
            scale(1);
        }

        /* ⬆️ Lifted hover state - only lift, no other transforms */
        .card.lifted {
          transform: rotate(calc(var(--i) * 12deg))
            translate(calc(var(--i) * -15px), -40px)
            scale(1) !important;
          background-position: right;
          background-size: 200%;
          filter: drop-shadow(0 20px 40px rgba(255, 215, 0, 0.4));
        }

        .title-display {
          position: absolute;
          bottom: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 800px;
          opacity: 0;
          transition: opacity 0.4s ease;
          font-family: 'Arima', sans-serif;
          color: #ecb73b;
          text-align: center;
          pointer-events: none;
        }

        .title-display.show {
          opacity: 1;
        }

        .description {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 8px;
        }

        @media (max-width: 768px) {
          .wonders {
            padding: 10px 5% 100px;
          }
          .card-container {
            height: 300px;
          }
          .animate .card.visible {
            transform: rotate(calc(var(--i) * 10deg)) translate(calc(var(--i) * -10px), 40px)
              scale(1);
          }
          .card.lifted {
            transform: rotate(calc(var(--i) * 10deg)) 
              translate(calc(var(--i) * -10px), -25px)
              scale(1) !important;
          }
          .card {
            width: 150px;
            height: 220px;
          }
          .title {
            font-size: 2.4rem;
          }
          .subtitle {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .card-container {
            height: 240px;
          }
          .card {
            width: 90px;
            height: 140px;
          }
          .animate .card.visible {
            transform: rotate(calc(var(--i) * 8deg)) translate(calc(var(--i) * -2px), 70px)
              scale(1);
          }
          .card.lifted {
            transform: rotate(calc(var(--i) * 8deg)) 
              translate(calc(var(--i) * -2px), 40px)
              scale(1) !important;
          }
          .title-display {
            bottom: -60px;
            max-width: 360px;
          }
          .title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </section>
  )
}