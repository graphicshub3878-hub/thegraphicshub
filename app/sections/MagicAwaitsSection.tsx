'use client'

import Image from 'next/image'
import React from 'react'

export default function MagicAwaitsSection() {
  return (
    <section
      style={{
        padding: '90px 0',
        color: '#fff',
      }}
    >
      <div
        style={{
          width: '92%',
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(520px, 1.1fr) minmax(420px, 0.9fr)',
          gap: 56,
          alignItems: 'center',
        }}
      >
        {/* LEFT: IMAGE */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/assets/images/Magic-Awaits.webp" // <-- replace with your image path
            alt="Futuristic table UI"
            width={960}
            height={540}
            priority
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: 20,
              objectFit: 'cover',
              boxShadow: '0 18px 40px rgba(0,0,0,0.45)',
            }}
          />
        </div>

        {/* RIGHT: HEADING + COPY */}
        <div style={{ textAlign: 'center' }}>
          <h3
            style={{
              fontFamily: 'Arima, serif',
              fontWeight: 700,
              color: '#ffd700',
              fontSize: 'clamp(2rem, 4vw, 2.6rem)',
              letterSpacing: '.3px',
              margin: '0 0 14px',
            }}
          >
            The Magic Awaits
          </h3>

          <p
            style={{
              maxWidth: 640,
              margin: '0 auto',
              fontFamily: 'Arima, sans-serif',
              fontSize: 'clamp(0.98rem, 1.05vw, 1.06rem)',
              lineHeight: 1.9,
              color: '#cfcfcf',
              textAlign: 'justify',
            }}
          >
            Whether you’re building from scratch or reimagining the familiar, <strong>Graphics Hub</strong> is your partner in crafting designs that
            resonate with your vision. With us, your concepts evolve into something truly remarkable, blending the perfect balance of artistry &amp;
            strategy. At <strong>Graphics Hub</strong>, we don’t just create designs—we craft experiences that <em>attract, endure &amp; inspire</em>.
          </p>
        </div>
      </div>

      {/* Mobile stacking + spacing */}
      <style jsx>{`
        @media (max-width: 1020px) {
          section > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  )
}
