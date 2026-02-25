'use client'
import Image from 'next/image'

type Props = {
  artSrc?: string
  note?: string
}

export default function TermsConditionsHeroExact({
  artSrc = '/assets/images/Terms-Conditions.webp',
  note,
}: Props) {
  return (
    <section
      style={{
        background: '#000',
        color: '#fff',
        width: '100%',
        padding: '150px 0 100px',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 80px',
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'row', 
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px',
          flexWrap: 'wrap',
        }}
      >
        {/* Heading */}
        <h2
          style={{
            fontFamily: 'Arima, serif',
            fontWeight: 700,
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            lineHeight: 1.05,
            letterSpacing: '.5px',
            color: '#ffffff',
            margin: 0,
            flex: 1,
            textAlign: 'left',
          }}
        >
          Terms &{' '}
          <span
            style={{
              color: '#FFD700',
              fontFamily: "'Corinthia', serif",
              fontSize: 'clamp(3rem, 7vw, 7rem)',
              fontWeight: 500,
              marginLeft: '-10px',
            }}
          >
            Conditions
          </span>
        </h2>

        {/* Right art */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Image
            src={artSrc}
            alt="Terms and Conditions illustration"
            width={240}
            height={108}
            priority
            style={{
              width: 'min(38vw, 180px)', // scales down automatically
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Optional note */}
        {note && (
          <p
            style={{
              width: '100%',
              textAlign: 'center',
              marginTop: 20,
              fontSize: 15,
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            {note}
          </p>
        )}
      </div>

      {/* ✅ Responsive stacking on phones */}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style] {
            flex-direction: column !important; /* stack vertically */
            text-align: center !important;
            padding: 0 24px !important;
          }

          h2[style] {
            text-align: center !important;
          }

          img {
            width: 120px !important; /* smaller image on phones */
            height: auto !important;
          }
        }
      `}</style>
    </section>
  )
}
