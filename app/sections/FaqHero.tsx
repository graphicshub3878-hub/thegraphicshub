'use client'
import Image from 'next/image'

type Props = { artSrc?: string; note?: string }

export default function FaqHeroExact({
  artSrc = '/assets/images/FAQs.webp',
  note,
}: Props) {
  return (
    <section className="faq-hero">
      <div className="wrap">
        {/* Heading */}
        <h2 className="title">
          Frequently Asked
          <span className="highlight"> Questions</span>
        </h2>

        {/* Art */}
        <div className="art">
          <Image
            src={artSrc}
            alt="FAQ chat bubble and lamp"
            width={240}
            height={197}
            priority
            className="art-img"
            style={{ width: 'var(--imgW)', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Optional note (kept for parity with T&Cs) */}
        {note && <p className="note">{note}</p>}
      </div>

      <style jsx>{`
        /* ===== Tunables (match T&Cs) ===== */
        :root {
          --hero-min-h: clamp(460px, 80vh, 700px);
          --side-pad: 96px;
          --gap: 48px;
        }

        .faq-hero {
          background: #000;
          color: #fff;
          width: 100%;
          padding-block: 150px 100px; /* same vibe as T&Cs */
        }

        /* ===== Centered grid canvas ===== */
        .wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding-inline: var(--side-pad);
          min-height: var(--hero-min-h);

          display: grid;
          grid-template-columns: 1fr auto; /* title | art */
          align-items: center;
          justify-content: space-between;
          gap: var(--gap);
        }

        /* ===== Heading ===== */
        .title {
          margin: 0;
          font-family: 'Arima', serif;
          font-weight: 700;
          font-size: clamp(2.4rem, 5vw, 4rem);
          line-height: 1.05;
          letter-spacing: 0.5px;
          color: #fff;
          text-align: left;
          max-width: 18ch;
        }
        .highlight {
          color: #ffd700;
          font-family: 'Corinthia', serif;
          font-size: clamp(3rem, 7vw, 7rem);
          font-weight: 500;
          margin-left: -10px;
          display: inline-block;
        }

        /* ===== Art (same mechanism as T&Cs) ===== */
        .art {
          --imgW: 240px; /* desktop default */
          display: grid;
          place-items: center;
        }
        .art-img {
          display: block;
        }

        /* ===== Optional note ===== */
        .note {
          grid-column: 1 / -1;
          text-align: center;
          margin-top: 20px;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.72);
        }

        /* ===== Wide desktops ===== */
        @media (min-width: 1600px) {
          :root {
            --side-pad: 120px;
          }
        }

        /* ===== Large tablet ===== */
        @media (max-width: 1200px) {
          :root {
            --side-pad: 64px;
            --gap: 40px;
          }
          .art {
            --imgW: 210px;
          }
        }

        /* ===== Tablet & below (stacked, centered) ===== */
        @media (max-width: 900px) {
          :root {
            --side-pad: 24px;
            --gap: 28px;
          }
          .wrap {
            grid-template-columns: 1fr; /* stack */
            justify-items: center;
            text-align: center;
            padding-inline: max(16px, env(safe-area-inset-left))
              max(16px, env(safe-area-inset-right));
          }
          .title {
            text-align: center;
            max-width: 22ch;
          }
          .highlight {
            margin-left: -6px;
          }
          .art {
            --imgW: 140px;
          }
        }

        /* ===== Phones ===== */
        @media (max-width: 600px) {
          .faq-hero {
            padding-block: 120px 80px;
          }
          .title {
            font-size: clamp(2rem, 7vw, 2.6rem);
            line-height: 1.1;
          }
          .highlight {
            font-size: clamp(2.2rem, 8.2vw, 2.8rem);
            margin-left: -4px;
          }
          .art {
            --imgW: 110px;
          }
        }

        /* ===== Small phones ===== */
        @media (max-width: 400px) {
          .faq-hero {
            padding-block: 110px 70px;
          }
          .art {
            --imgW: 96px;
          }
        }
      `}</style>
    </section>
  )
}
