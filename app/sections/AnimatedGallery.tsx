'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

type GalleryProps = {
  buttonText?: string
  onButtonClick?: () => void
}

export default function InfiniteGallery({
  buttonText = 'View All',
  onButtonClick,
}: GalleryProps) {
  const router = useRouter()

  const COL_IMAGES: string[][] = [
    ['/assets/images/col1-1.png', '/assets/images/col1-2.png', '/assets/images/col1-3.png', '/assets/images/col1-4.png', '/assets/images/col1-5.png'],
    ['/assets/images/col2-1.png', '/assets/images/col2-2.png', '/assets/images/col2-3.png', '/assets/images/col2-4.png', '/assets/images/col2-5.png'],
    ['/assets/images/col3-1.png', '/assets/images/col3-2.png', '/assets/images/col3-3.png', '/assets/images/col3-4.png', '/assets/images/col3-5.png'],
    ['/assets/images/col4-1.png', '/assets/images/col4-2.png', '/assets/images/col4-3.png', '/assets/images/col4-4.png', '/assets/images/col4-5.png'],
    ['/assets/images/col5-1.png', '/assets/images/col5-2.png', '/assets/images/col5-3.png', '/assets/images/col5-4.png', '/assets/images/col5-5.png'],
  ]

  const columns = useMemo(() => COL_IMAGES.map((col) => [...col, ...col]), [])

  const handleClick = onButtonClick ?? (() => router.push('/services'))

  return (
    <section className="wrap">
      <h2 className="title">
        Design<span>Sorcery</span>
      </h2>

      <div className="gallery" aria-label="Design gallery">
        {columns.map((col, idx) => {
          const dir = idx % 2 === 0 ? 'up' : 'down'
          const dur = 26 + idx * 2

          return (
            <div
              key={idx}
              className={`col ${dir}`}
              style={{ ['--dur' as any]: `${dur}s` }}
            >
              <div className="stack">
                {col.map((src, i) => (
                  <figure key={`${src}-${i}`} className="card">
                    <img src={src} alt="" loading="lazy" />
                  </figure>
                ))}
              </div>
            </div>
          )
        })}

        <div className="fade fade-top" aria-hidden />
        <div className="fade fade-bottom" aria-hidden />
      </div>

      <div className="wpforms-submit-container center">
        <button
          type="button"
          className="wpforms-submit"
          data-label={buttonText}
          aria-label={buttonText}
          onClick={handleClick}
        />
      </div>

      <style jsx>{`
        .wrap {
          background: #000;
          color: #fff;
          padding: 150px 16px 80px;
          min-height: 100vh;
          overflow: hidden;
        }

        .title {
          text-align: center;
          font-size: 3rem;
          font-weight: 700;
          font-family: 'Arima', serif;
          color: #fff;
          margin-bottom: 10px;
        }

        .title span {
          color: #ffd700;
          font-family: 'Corinthia', serif;
          font-size: clamp(3rem, 8vw, 9rem);
          font-weight: 500;
          margin-left: max(-16px, -2vw);
        }

        .gallery {
          position: relative;
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 18px;
          padding: 6px;
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            #000 10%,
            #000 90%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            #000 10%,
            #000 90%,
            transparent 100%
          );
        }

        .col {
          display: grid;
          gap: 18px;
          height: 800px;
          overflow: hidden;
          position: relative;
          min-width: 0;
        }

        .stack {
          display: grid;
          gap: 18px;
          animation-duration: var(--dur, 28s);
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-name: scrollUp;
          will-change: transform;
        }

        .col.down .stack {
          animation-name: scrollDown;
        }

        .gallery:hover .stack {
          animation-play-state: paused;
        }

        .card {
          margin: 0;
          border-radius: 12px;
          background: #0b0b0b;
          box-shadow:
            0 10px 24px rgba(0, 0, 0, 0.45),
            inset 0 0 0 1px rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }

        .card img {
          display: block;
          width: 100%;
          height: auto;
          aspect-ratio: 3 / 4;
          object-fit: cover;
        }

        .fade {
          pointer-events: none;
          position: absolute;
          left: 0;
          right: 0;
          height: 80px;
          z-index: 2;
        }

        .fade-top {
          top: 0;
          background: linear-gradient(to bottom, #000, transparent);
        }

        .fade-bottom {
          bottom: 0;
          background: linear-gradient(to top, #000, transparent);
        }

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

        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes scrollDown {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }

        @media (max-width: 1100px) {
          .gallery {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .gallery .col:nth-child(5) {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .gallery {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .gallery .col:nth-child(4),
          .gallery .col:nth-child(5) {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .wrap {
            padding: 120px 14px 60px;
          }

          .title {
            font-size: 2.2rem;
          }

          .title span {
            font-size: 4.5rem;
          }

          .gallery {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
            padding: 0;
          }

          .gallery .col:nth-child(3),
          .gallery .col:nth-child(4),
          .gallery .col:nth-child(5) {
            display: none;
          }

          .col {
            height: 620px;
            gap: 14px;
          }

          .stack {
            gap: 14px;
          }

          .card {
            border-radius: 14px;
          }
        }
      `}</style>
    </section>
  )
}