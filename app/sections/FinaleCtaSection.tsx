'use client'

import Image from 'next/image'
import React from 'react'

export default function FinaleCtaSection() {
  return (
    <section
      style={{
        padding: '80px 0 110px',
        color: '#fff',
      }}
    >
      <div style={{ width: '92%', maxWidth: 1240, margin: '0 auto' }}>
        {/* ===== Icons Row ===== */}
        <div
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 80,
            marginBottom: 28,
          }}
        >
          <Image src="/assets/images/Attract.webp" alt="Magnet Icon" width={140} height={140} style={{ width: 140, height: 'auto' }} priority />
          <Image src="/assets/images/Engage.webp" alt="Chat Icon" width={140} height={140} style={{ width: 140, height: 'auto' }} />
          <Image src="/assets/images/Inspire.webp" alt="Smile Icon" width={140} height={140} style={{ width: 140, height: 'auto' }} />
        </div>

        {/* ===== Copy ===== */}
        <p
          style={{
            maxWidth: 980,
            margin: '0 auto 34px',
            textAlign: 'center',
            fontFamily: 'Arima, sans-serif',
            fontSize: 'clamp(0.98rem, 1.05vw, 1.06rem)',
            lineHeight: 1.95,
            color: '#cfd3db',
          }}
        >
          As trusted design sorcerers, we blend &amp; approach every project with passion, care &amp; innovation with artistry, delivering results that
          not only meet your expectations but elevate them. From the first spark of an idea to the final masterpiece, we’re here to help your brand stand
          out &amp; thrive. Step into the realm of Graphics Hub &amp; let’s create something extraordinary together—a world where your imagination meets
          our artistry to craft designs that truly enchant creativity &amp; open the portal to endless creative possibilities. Let’s work together to turn
          your dreams into reality with a touch of <em>magic</em>.
        </p>

        {/* ===== CTA Button (same style as ContactUs) ===== */}
        <div className="wpforms-submit-container center">
          <button
            type="button"
            className="wpforms-submit"
            data-label="Let the Magic Begin!" // <- button text lives here
            onClick={() => (window.location.href = '/contact-us')}
          />
        </div>
      </div>

      {/* Button CSS copied from your ContactUs and generalized */}
      <style jsx>{`
        .wpforms-submit-container.center {
          display: flex;
          justify-content: center;
        }
        .wpforms-submit {
  width: 180px;
  height: 44px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(
    to right,
    #77530a,
    #ffd277,
    #77530a,
    #77530a,
    #ffd277,
    #77530a
  );
  background-size: 200%;
  background-position: left;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-position 1s;
  overflow: hidden;
  color: #ffd277;
  font-family: 'Arima', sans-serif; /* ✅ Added Arima font */
  font-weight: 600; /* optional, for better bold look */
  letter-spacing: 0.5px; /* optional, for cleaner text spacing */
}

        /* use data-label to control the inner text */
        .wpforms-submit::before {
          position: absolute;
          content: attr(data-label);
          color: #ffd277;
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
        .wpforms-submit:hover {
          background-position: right;
        }
        .wpforms-submit:hover::before {
          background-position: right;
        }
        .wpforms-submit:disabled {
          filter: grayscale(0.6) brightness(0.8);
          cursor: not-allowed;
        }

        /* Mobile icons in 1 row */
@media (max-width: 900px) {
  section > div > div:first-child {
    grid-auto-flow: column !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 14px !important;
    width: 100%;
  }

  section > div > div:first-child img {
    width: 88px !important;
    max-width: 100% !important;
    height: auto !important;
  }
}
  
      `}</style>
    </section>
  )
}
