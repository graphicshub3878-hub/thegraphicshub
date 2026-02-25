'use client'
import Image from 'next/image'

type Props = {
  artSrc?: string
  note?: string // e.g., "Effective Date: December 1st, 2024."
}

export default function PrivacyPolicyHeroExact({
  artSrc = '/assets/images/Privacy-Policy.webp',
  note,
}: Props) {
  return (
    <section className="privacy-hero">
      <div className="wrap">
        {/* Heading */}
        <h2 className="title">
          Privacy<span className="highlight"> Policy</span>
        </h2>

        {/* Right art */}
        <div className="art">
          <Image
            src={artSrc}
            alt="Privacy Policy illustration"
            width={200}
            height={90}
            priority
            className="art-img"
            style={{ width: 'var(--imgW)', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Optional bottom-right note */}
        {note && <p className="note">{note}</p>}
      </div>

      <style jsx>{`
        /* ===== Tunables (shared system) ===== */
        :root {
          --hero-min-h: clamp(460px, 80vh, 700px);
          --side-pad: 96px;
          --gap: 48px;
        }

        .privacy-hero {
          background: #000;
          color: #fff;
          width: 100%;
          padding-block: 150px 100px;
        }

        /* ===== Grid canvas ===== */
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
          position: relative;
        }

        /* ===== Heading ===== */
        .title {
          margin: 0;
          text-align: left;
          font-family: 'Arima', serif;
          font-weight: 700;
          font-size: clamp(2.6rem, 6vw, 4rem);
          line-height: 1.05;
          letter-spacing: 0.5px;
          color: #fff;
          max-width: 18ch;
        }
        .highlight {
          color: #ffd700;
          font-family: 'Corinthia', serif;
          font-size: clamp(3rem, 7vw, 7rem);
          font-weight: 500;
          margin-left: 2px;
          display: inline-block;
        }

        /* ===== Art with CSS var width ===== */
        .art {
          --imgW: 200px; /* desktop default */
          display: grid;
          place-items: center;
        }
        .art-img { display: block; }

        /* ===== Note sits under art on the right ===== */
        .note {
          grid-column: 2 / -1;
          justify-self: end;
          align-self: end;
          margin: 0;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.72);
        }

        /* ===== Wide desktops ===== */
        @media (min-width: 1600px) {
          :root { --side-pad: 120px; }
        }

        /* ===== Large tablet ===== */
        @media (max-width: 1200px) {
          :root { --side-pad: 64px; --gap: 40px; }
          .art { --imgW: 180px; }
          .note { font-size: 14px; }
        }

        /* ===== Tablet & below (stacked, centered) ===== */
        @media (max-width: 900px) {
          :root { --side-pad: 24px; --gap: 28px; }
          .wrap {
            grid-template-columns: 1fr; /* stack */
            justify-items: center;
            text-align: center;
            padding-inline: max(16px, env(safe-area-inset-left))
                            max(16px, env(safe-area-inset-right));
          }
          .title { text-align: center; max-width: 22ch; }
          .highlight { margin-left: -4px; }
          .art { --imgW: 150px; }

          /* Note remains “bottom-right” conceptually */
          .note {
            grid-column: 1 / -1;
            justify-self: end; /* right-align within single column */
            margin-top: 24px;
          }
        }

        /* ===== Phones ===== */
        @media (max-width: 600px) {
          .privacy-hero { padding-block: 120px 80px; }
          .title {
            font-size: clamp(2rem, 7vw, 2.6rem);
            line-height: 1.1;
          }
          .highlight { font-size: clamp(2.2rem, 8.2vw, 2.8rem); }
          .art { --imgW: 120px; }
          .note { font-size: 13px; }
        }

        /* ===== Small phones ===== */
        @media (max-width: 400px) {
          .privacy-hero { padding-block: 110px 70px; }
          .art { --imgW: 104px; }
        }
      `}</style>
    </section>
  )
}
