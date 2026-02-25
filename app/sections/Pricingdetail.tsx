'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

type Plan = {
  name: string
  tagline: string
  price: string
  badge?: string
  highlighted?: boolean
  features: string[]
}

const DEFAULT_PLANS: Plan[] = [
  {
    name: 'The Vision',
    tagline: 'Perfect for new businesses and startups',
    price: '$299',
    features: [
      '1 Logo Design Concept',
      '3 Revisions Included',
      'High-Resolution Files (PNG, JPG)',
      'Color & Black/White Versions',
      'Basic Brand Guidelines',
    ],
  },
  {
    name: 'The Manifest',
    tagline: 'Most popular for growing businesses',
    price: '$599',
    badge: 'Most Popular',
    highlighted: true,
    features: [
      '3 Logo Design Concepts',
      'Unlimited Revisions',
      'All File Formats (PNG, JPG, SVG, AI, EPS)',
      'Color Variations & Mockups',
      'Complete Brand Guidelines',
      'Social Media Kit',
      'Business Card Design',
    ],
  },
  {
    name: 'The Legacy',
    tagline: 'Complete branding solution for enterprises',
    price: '$1,299',
    features: [
      '5 Logo Design Concepts',
      'Unlimited Revisions',
      'All File Formats + Source Files',
      'Complete Brand Identity Package',
      'Comprehensive Brand Guidelines',
      'Social Media Kit & Templates',
      'Business Card & Letterhead Design',
      'Marketing Materials Design',
      'Website Design Mockup',
    ],
  },
]

export default function PricingSection() {
  const router = useRouter()

  // ✅ route to /contact
  const handleClick = () => router.push('/contact-us')

  const handleDownloadPdf = () => {
    const pdfUrl = '/assets/PriceList.pdf'
    const fileName = 'GraphicsHubPriceList.pdf'

    const a = document.createElement('a')
    a.href = pdfUrl
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  // ✅ keyboard support (Enter/Space)
  const handlePillKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleDownloadPdf()
    }
  }

  return (
    <section className="pricing" id="pricing">
      <div className="glow" aria-hidden />

      <div className="wrap">
        {/* Top pill (downloads PDF) */}
        <div
          className="topPill"
          role="button"
          tabIndex={0}
          aria-label="Download the Mystic Manuscripts PDF"
          onClick={handleDownloadPdf}
          onKeyDown={handlePillKeyDown}
        >
          <span className="pillIcon" aria-hidden>
            ⭳
          </span>
          <span className="pillText">The Mystic Manuscripts</span>
        </div>

        {/* Headings */}
        <h2 className="heroTitle">
          Chronicles of<span className="heroGold">Craft</span>
        </h2>

        <p className="heroSub">
          Choose the perfect package for your business. From stunning logos to complete brand identities.
        </p>
        <p className="heroMini">
          All packages include professional design work by experienced designers, multiple revisions, and high-quality
          deliverables.
        </p>

        {/* Cards */}
        <div className="grid" aria-label="Pricing plans">
          {DEFAULT_PLANS.map((p) => (
            <article key={p.name} className={`card ${p.highlighted ? 'highlighted' : ''}`} aria-label={`${p.name} plan`}>
              {p.badge && (
                <div className="badge" aria-label={p.badge}>
                  <span className="spark" aria-hidden>
                    ✨
                  </span>
                  {p.badge}
                </div>
              )}

              <header className="cardHead">
                <h3 className="planName">{p.name}</h3>
                <p className="planTag">{p.tagline}</p>

                <div className="priceWrap">
                  <div className="price">{p.price}</div>
                  <div className="priceNote">One-time payment</div>
                </div>
              </header>

              <ul className="list">
                {p.features.map((f) => (
                  <li className="item" key={f}>
                    <span className="tick" aria-hidden>
                      ✓
                    </span>
                    <span className="txt">{f}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Button under cards */}
        <div className="wpforms-submit-container center">
          <button
            type="button"
            className="wpforms-submit"
            data-label="Get Started"
            aria-label="Get Started"
            onClick={handleClick}
          />
        </div>

        {/* Stats bar */}
        <div className="stats" aria-label="Company stats">
          <div className="stat">
            <div className="statNum">1000+</div>
            <div className="statLab">Projects Completed</div>
          </div>
          <div className="divider" aria-hidden />
          <div className="stat">
            <div className="statNum">98%</div>
            <div className="statLab">Client Satisfaction</div>
          </div>
          <div className="divider" aria-hidden />
          <div className="stat">
            <div className="statNum">24/7</div>
            <div className="statLab">Support Available</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pricing {
          position: relative;
          background: #000;
          color: #fff;
          width: 100%;
          overflow: hidden;
          padding: 140px 0 110px;
          font-family: 'Arima', sans-serif;
        }

        .glow {
          position: absolute;
          inset: -200px;
          background: radial-gradient(
              700px 700px at 50% 18%,
              rgba(255, 210, 119, 0.16),
              transparent 60%
            ),
            radial-gradient(900px 900px at 50% 85%, rgba(255, 215, 0, 0.08), transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .wrap {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(16px, 5vw, 80px);
          text-align: center;
        }

        /* ===== top pill ===== */
        .topPill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255, 210, 119, 0.45);
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 50px rgba(0, 0, 0, 0.55);
          cursor: pointer;
          user-select: none;
          margin: 0 auto 26px;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }
        .topPill:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 210, 119, 0.7);
        }
        .topPill:focus-visible {
          outline: 2px solid rgba(255, 210, 119, 0.65);
          outline-offset: 4px;
        }
        .pillIcon {
          color: #ffd277;
          font-weight: 800;
          opacity: 0.95;
        }
        .pillText {
          color: #ffd277;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 0.02em;
        }

        /* ===== headings ===== */
        .heroTitle {
          font-family: 'Arima', serif;
          font-weight: 700;
          font-size: clamp(2.6rem, 6vw, 4rem);
          line-height: 1.05;
          text-align: center;
          margin: 0 0 18px;
          letter-spacing: 0.5px;
          color: #fff;
        }

        .heroGold {
          color: #ffd700;
          font-family: 'Corinthia', serif;
          font-weight: 500;
          font-size: clamp(2.6rem, 7vw, 7rem);
          text-shadow: 0 0 18px rgba(255, 215, 0, 0.16);
          margin-left: -6px;
          display: inline-block;
        }

        .heroSub {
          margin: 10px auto 0;
          max-width: 68ch;
          color: rgba(255, 255, 255, 0.72);
          font-size: clamp(1rem, 1.2vw, 1.25rem);
          line-height: 1.55;
        }
        .heroMini {
          margin: 14px auto 0;
          max-width: 86ch;
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          line-height: 1.55;
        }

        /* ===== cards grid ===== */
        .grid {
          margin-top: 54px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 26px;
          align-items: stretch;
        }

        .card {
          position: relative;
          text-align: left;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          box-shadow: 0 22px 80px rgba(0, 0, 0, 0.55);
          padding: 26px 24px 26px;
          overflow: hidden;

          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
              120% 120% at 20% 20%,
              rgba(255, 210, 119, 0.08),
              transparent 55%
            ),
            radial-gradient(120% 120% at 80% 10%, rgba(255, 255, 255, 0.04), transparent 55%);
          pointer-events: none;
          opacity: 0.8;
        }

        /* ✅ Middle card: animated gradient stroke like your button */
        .highlighted {
          position: relative;
          border: 2px solid transparent;
          border-radius: 18px;
          background: radial-gradient(
              130% 130% at 50% 10%,
              rgba(255, 210, 119, 0.22),
              rgba(255, 255, 255, 0.03) 45%,
              rgba(0, 0, 0, 0.35) 75%
            ),
            rgba(255, 255, 255, 0.03);
          transform: translateY(-8px);
        }

        .highlighted::after {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          border-radius: 18px;
          background: linear-gradient(to right, #77530a, #ffd277, #77530a, #77530a, #ffd277, #77530a);
          background-size: 200%;
          background-position: left;

          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;

          pointer-events: none;
          transition: background-position 1s;
          z-index: 1;
        }

        .highlighted:hover::after {
          background-position: right;
        }

        .badge {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: #ffd700;
          color: #000;
          font-weight: 900;
          font-size: 12px;
          box-shadow: 0 16px 40px rgba(255, 215, 0, 0.22);
          z-index: 3;
        }
        .spark {
          font-size: 13px;
        }

        .cardHead {
          position: relative;
          z-index: 2;
          padding-top: 28px;
          text-align: center;
        }

        .planName {
          margin: 0;
          font-size: 24px;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.95);
          font-family: 'Arima', serif;
          text-align: center;
        }

        .planTag {
          margin: 10px 0 0;
          color: rgba(255, 255, 255, 0.62);
          font-size: 13px;
          line-height: 1.5;
          text-align: center;
        }

        .priceWrap {
          margin-top: 26px;
          text-align: center;
        }

        .price {
          font-weight: 1000;
          font-size: 46px;
          letter-spacing: 0.4px;
          color: #ffd700;
          text-shadow: 0 0 18px rgba(255, 215, 0, 0.14);
        }

        .priceNote {
          margin-top: 6px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.55);
          text-align: center;
        }

        .list {
          position: relative;
          z-index: 2;
          margin: 28px 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 14px;

          flex: 1;
          align-content: start;
        }

        .item {
          display: grid;
          grid-template-columns: 26px 1fr;
          align-items: start;
          gap: 10px;
          color: rgba(255, 255, 255, 0.86);
          font-size: 13.5px;
          line-height: 1.45;
        }

        .tick {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(255, 215, 0, 0.12);
          border: 1px solid rgba(255, 215, 0, 0.35);
          color: #ffd277;
          font-weight: 900;
          margin-top: 1px;
        }

        /* ✅ button styles */
        .wpforms-submit-container.center {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }
        .wpforms-submit {
          width: 160px;
          height: 44px;
          font-family: 'Arima', serif;
          border: none;
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

        /* ===== stats ===== */
        .stats {
          margin: 64px auto 0;
          max-width: 980px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          box-shadow: 0 22px 80px rgba(0, 0, 0, 0.55);
          padding: 34px 18px;
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          align-items: center;
          gap: 18px;
          text-align: center;
        }

        .statNum {
          font-size: clamp(2rem, 3vw, 3rem);
          font-weight: 1000;
          color: #ffd700;
          text-shadow: 0 0 18px rgba(255, 215, 0, 0.12);
        }
        .statLab {
          margin-top: 8px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }
        .divider {
          width: 1px;
          height: 42px;
          background: rgba(255, 255, 255, 0.12);
        }

        /* ===== responsive ===== */
        @media (max-width: 1100px) {
          .grid {
            grid-template-columns: 1fr;
            max-width: 560px;
            margin-left: auto;
            margin-right: auto;
          }
          .highlighted {
            transform: none;
          }
          .stats {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .divider {
            display: none;
          }
          .wpforms-submit {
            width: min(520px, 100%);
          }
        }

        @media (max-width: 600px) {
          .pricing {
            padding: 110px 0 80px;
          }
          .heroMini {
            font-size: 12.5px;
          }
          .grid {
            margin-top: 36px;
          }
          .card {
            padding: 22px 18px 22px;
            border-radius: 16px;
          }
          .highlighted,
          .highlighted::after {
            border-radius: 16px;
          }
          .price {
            font-size: 42px;
          }
          .item {
            font-size: 13px;
          }
          .stats {
            margin-top: 44px;
            padding: 26px 14px;
            border-radius: 16px;
          }
        }
      `}</style>
    </section>
  )
}