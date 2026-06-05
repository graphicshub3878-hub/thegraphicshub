

            'use client'

import Image from 'next/image'

const NarrativeSection = () => {
  return (
    <section id="narrative" className="narrative">
      <div className="narrative__content">
        {/* ✨ Left Text */}
        <div className="narrative__text">
          <h2 className="narrative__title">
            Narrative <span className="highlight">Unfolds</span>
          </h2>

          {/* ✨ Our Story Divider */}
          <div className="story-divider">
            <span className="story-divider__line"></span>
            <span className="story-divider__text">Our Story</span>
            <span className="story-divider__line"></span>
          </div>

          <p className="narrative__desc">
            The Graphics Hub is a versatile freelance design studio built to
            help brands look clear, creative & memorable. <br />
            <br />
            We specialize in  <b className="gold">Social Media Visuals, Web Design, Branding, Logo
            Design, UI/UX, Packaging, Print Media, 3D Design, Animation &
            AI-powered Creative Solutions</b>. From everyday content to complete
            brand experiences, we create designs that not only look captivating
            but also communicate with purpose. <br />
            <br />
            Our approach blends creativity, strategy, precision & emerging AI
            tools to bring every idea to life in a way that feels unique,
            professional & audience-focused. Whether you are launching a new
            brand, refreshing your visual identity, or building a stronger
            digital presence, Graphics Hub is here to turn your vision into
            design that stands out.
           
          </p>

          <p className="narrative__cta">
            Let’s create something extraordinary together!
          </p>
        </div>

        {/* 🖼️ Right Image */}
        <div className="narrative__image">
          <Image
            src="/assets/images/hm22.webp"
            alt="Graphics Hub Studio Interior"
            width={520}
            height={520}
            className="img"
          />
        </div>
      </div>

      <style jsx>{`
        /* 🧱 Global Safe Reset */
        .narrative {
          position: relative;
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
          background: #000;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 100px clamp(16px, 5vw, 80px);
          box-sizing: border-box;
        }

        .narrative__content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1200px;
          gap: clamp(24px, 6vw, 60px);
          flex-wrap: wrap;
        }

        /* ✨ Text Side */
        .narrative__text {
          flex: 1;
          min-width: 300px;
          text-align: left;
        }

        .narrative__title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          margin-bottom: 18px;
          font-family: 'Arima', serif;
          word-break: break-word;
        }

        .highlight {
          color: #ffd700;
          font-family: 'Corinthia', serif;
          font-size: clamp(3rem, 8vw, 9rem);
          font-weight: 500;
          margin-left: max(-35px, -3vw);
        }

        /* ✨ Our Story Divider */
        .story-divider {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 0 0 18px;
        }

        .story-divider__line {
          width: 24px;
          height: 1px;
          background: #fff;
          opacity: 0.9;
        }

        .story-divider__text {
          color: #fff;
          font-family: 'Arima', serif;
          font-size: clamp(1rem, 1.5vw, 1.25rem);
          font-style: italic;
          white-space: nowrap;
        }

        .narrative__desc {
          line-height: 1.8;
          font-size: clamp(0.9rem, 1.1vw, 1.05rem);
          color: #ccc;
          font-family: 'Arima', sans-serif;
          margin-bottom: 25px;
          text-align: justify;
          overflow-wrap: break-word;
        }

        .gold {
          color: #ffd700;
          font-weight: 600;
        }

        .narrative__cta {
          font-family: 'Arima', sans-serif;
          color: #ffd700;
          margin-top: 20px;
          font-size: clamp(0.9rem, 1vw, 1rem);
          text-align: center;
        }

        /* 🖼️ Image Side */
        .narrative__image {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: 280px;
          width: 100%;
          overflow: hidden;
        }

        .img {
          width: 100%;
          max-width: 480px;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 0 25px rgba(255, 215, 0, 0.25);
          object-fit: cover;
        }

        /* 📱 Mobile First */
        @media (max-width: 768px) {
          .narrative__content {
            flex-direction: column-reverse;
            text-align: center;
          }

          .narrative__text {
            text-align: center;
          }

          .narrative__title {
            margin-bottom: 12px;
          }

          .story-divider {
            margin-bottom: 16px;
          }

          .narrative__desc {
            text-align: center;
            line-height: 1.6;
          }

          .img {
            max-width: 90%;
          }
        }
      `}</style>
    </section>
  )
}

export default NarrativeSection