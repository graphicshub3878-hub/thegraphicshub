'use client'

import Image from 'next/image'
import React from 'react'

export default function Abouthero() {
  return (
    <section className="about-hero">
      <div className="container">
        {/* HEADING */}
        <h2 className="heading">
          About{' '}
          <span className="script">Us</span>
        </h2>

        {/* GRID LAYOUT */}
        <div className="grid">
          {/* LEFT TEXT SECTION */}
          <div className="left">
            <div className="left-inner">
              <p className="lead">Welcome to Graphics Hub, Where Creativity Meets Magic!</p>

              <p className="para">
                At Graphics Hub, we bring visions to life with a touch of enchantment. From mesmerizing interiors &amp; exteriors to captivating UI/UX
                designs &amp; iconic branding, we craft visuals that leave a lasting impression. Every pixel &amp; detail is meticulously designed to
                reflect your unique story &amp; make your ideas unforgettable.
              </p>

              <p className="para">
                With a passion for innovation &amp; an eye for precision, we transform imagination into reality. Whether it’s a striking logo, a seamless
                digital experience, or a brand identity that resonates, we ensure every creation shines with creativity &amp; purpose.
              </p>
            </div>
          </div>

          {/* RIGHT IMAGE SECTION */}
          <div className="right">
            <Image
              src="/assets/images/hm22.webp"
              alt="About Graphics Hub"
              width={720}
              height={560}
              priority
              className="hero-img"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-hero {
          // background-image: url('/assets/images/cardsbg.png');
          background-size: 1000px auto; /* zoom in your pattern */
          background-repeat: repeat;
          background-position: top left;
          image-rendering: pixelated;
          color: #fff;
          padding: 150px 0 100px;
        }

        .container {
          width: 92%;
          max-width: 1240px;
          margin: 0 auto;
        }

        .heading {
          font-family: 'Arima', serif;
          font-weight: 700;
          font-size: clamp(2.6rem, 6vw, 4rem);
          line-height: 1.05;
          text-align: center;
          margin: 0 0 60px;
          letter-spacing: 0.5px;
          color: #fff;
        }

        .script {
          color: #ffd700;
          font-family: 'Corinthia', serif;
          font-size: clamp(3rem, 9vw, 9rem);
          font-weight: 500;
          margin-left: -40px;
        }

        .grid {
          display: grid;
          grid-template-columns: minmax(300px, 1fr) minmax(360px, 560px);
          align-items: center;
          justify-content: center;
          gap: 40px;
        }

        .left {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          min-height: 500px;
        }

        .left-inner {
          max-width: 640px;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        .lead {
          font-family: 'Arima', sans-serif;
          line-height: 1.8;
          font-size: clamp(0.95rem, 1.1vw, 1.05rem);
          color: #ffd700;
          font-weight: 600;
          margin: 0;
        }

        .para {
          font-family: 'Arima', sans-serif;
          line-height: 1.9;
          font-size: clamp(0.95rem, 1.1vw, 1.05rem);
          color: #cfcfcf;
          margin: 0;
        }

        .right {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-img {
          width: 100%;
          height: auto;
          border-radius: 14px;
          object-fit: cover;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
        }

        /* ====== RESPONSIVE ====== */
        @media (max-width: 1024px) {
          .about-hero {
            padding: 120px 0 80px;
          }
          .grid {
            gap: 32px;
          }
        }

        @media (max-width: 900px) {
          .about-hero {
            background-size: 800px auto; /* slightly larger pattern for clarity */
            padding: 110px 0 70px;
          }
          .grid {
            grid-template-columns: 1fr; /* stack */
            gap: 28px;
          }
          .left {
            min-height: unset; /* avoid tall empty space */
          }
          .heading {
            margin-bottom: 40px;
          }
        }

        @media (max-width: 600px) {
          .about-hero {
            background-size: 640px auto; /* more zoom on small screens */
            padding: 150px 0 60px;
          }
          .container {
            width: 94%;
          }
          .heading {
            font-size: clamp(2.2rem, 7vw, 3rem);
          }
          .script {
            margin-left: -8px;
          }
          .left-inner {
            gap: 14px;
          }
          .lead,
          .para {
            font-size: clamp(0.98rem, 3.9vw, 1.05rem);
            line-height: 1.8;
          }
          .hero-img {
            border-radius: 12px;
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.42);
          }
        }
      `}</style>
    </section>
  )
}
