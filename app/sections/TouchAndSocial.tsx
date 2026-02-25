'use client'
import React from 'react'

export default function TouchAndSocial() {
  // --- actions ---
  const makeCall = () => {
    window.location.href = 'tel:+923255855580'
  }
  const redirectToWhatsApp = () => {
    const el = document.querySelector<HTMLButtonElement>('.whatsapp-btn')
    if (el) el.classList.add('redirecting')
    window.location.href = 'https://wa.me/923255855580'
  }

  return (
    <section className="wrap">
      <div className="stack">
        {/* ===================== Get in Touch ===================== */}
        <h3 className="title">Get in Touch</h3>
        <div className="row">
          {/* Call */}
          <button className="Btn call-btn" onClick={makeCall} aria-label="Make a Call">
            <div className="sign">
              {/* phone svg */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" aria-hidden>
                <path
                  fill="currentColor"
                  d="M141 209.38c17.22 31.02 37.04 60.82 62.81 88.02 25.83 27.33 57.94 52.21 99.56 73.45 3.08 1.51 6.01 1.51 8.61.47 3.97-1.51 7.99-4.78 11.97-8.75 3.07-3.07 6.9-7.99 10.92-13.38 15.99-21.05 35.81-47.16 63.76-34.1.61.28 1.09.61 1.7.89l93.27 53.64c.28.14.61.47.9.61 12.3 8.47 17.36 21.52 17.5 36.28 0 15.04-5.53 31.97-13.67 46.26-10.74 18.87-26.58 31.35-44.84 39.63-17.35 7.99-36.7 12.3-55.29 15.04-29.18 4.3-56.51 1.56-84.47-7.05-27.34-8.46-54.86-22.42-84.94-41l-2.23-1.42c-13.81-8.61-28.71-17.83-43.32-28.71-53.59-40.44-108.12-98.8-143.64-163.03C9.81 212.31-6.47 154.09 2.43 98.61 7.34 68.2 20.4 40.53 43.15 22.27 62.97 6.28 89.69-2.46 124.26.61c3.98.28 7.52 2.6 9.37 6.01l59.78 101.07c8.75 11.35 9.37 29.31-2.13 44.54-13.09 17.64-28.99 37.18-50.28 57.15z"
                />
              </svg>
            </div>
            <div className="text">Call</div>
          </button>

          {/* WhatsApp */}
          <button
            className="Btn whatsapp-btn"
            onClick={redirectToWhatsApp}
            aria-label="Chat on WhatsApp"
          >
            <div className="sign">
              {/* whatsapp svg */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 509 511.514" width="20" height="20" aria-hidden>
                <path
                  fill="currentColor"
                  d="M434.762 74.334C387.553 26.81 323.245 0 256.236 0h-.768C115.795.001 2.121 113.696 2.121 253.456l.001.015a253.516 253.516 0 0033.942 126.671L0 511.514l134.373-35.269a253.416 253.416 0 00121.052 30.9h.003.053C395.472 507.145 509 393.616 509 253.626c0-67.225-26.742-131.727-74.252-179.237l.014-.055zM255.555 464.453c-37.753 0-74.861-10.22-107.293-29.479l-7.72-4.602-79.741 20.889 21.207-77.726-4.984-7.975c-21.147-33.606-32.415-72.584-32.415-112.308 0-116.371 94.372-210.743 210.741-210.743 56.011 0 109.758 22.307 149.277 61.98a210.93 210.93 0 0161.744 149.095c0 116.44-94.403 210.869-210.844 210.869h.028zm115.583-157.914c-6.363-3.202-37.474-18.472-43.243-20.593-5.769-2.121-10.01-3.202-14.315 3.203-4.305 6.404-16.373 20.593-20.063 24.855-3.69 4.263-7.401 4.815-13.679 1.612-6.278-3.202-26.786-9.883-50.899-31.472a192.748 192.748 0 01-35.411-43.867c-3.712-6.363-.404-9.777 2.82-12.873 3.224-3.096 6.363-7.381 9.48-11.092a41.58 41.58 0 006.357-10.597 11.678 11.678 0 00-.508-11.09c-1.718-3.18-14.444-34.357-19.534-47.06-5.09-12.703-10.37-10.603-14.272-10.901-3.902-.297-7.911-.19-12.089-.19a23.322 23.322 0 00-16.964 7.911c-5.707 6.298-22.1 21.673-22.1 52.849s22.671 61.249 25.852 65.532c3.182 4.284 44.663 68.227 108.288 95.649 15.099 6.489 26.891 10.392 36.053 13.403a87.504 87.504 0 0025.216 3.718c4.905 0 9.82-.416 14.65-1.237 12.174-1.782 37.453-15.291 42.776-30.073s5.303-27.57 3.711-30.093c-1.591-2.524-5.704-4.369-12.088-7.615l-.038.021z"
                />
              </svg>
            </div>
            <div className="text">WhatsApp</div>
          </button>
        </div>

        {/* ===================== Stay Connected ===================== */}
        <h3 className="title spaced">Stay Connected</h3>
        <div className="row">
          {/* Facebook */}
          <a
            className="actionBtn3"
            href="https://www.facebook.com/graphicshub3878"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <span className="iconContainer">
              <svg viewBox="0 0 320 512" height="1.3em" fill="white" aria-hidden>
                <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"></path>
              </svg>
            </span>
            <span className="backgroundEffect" />
          </a>

          {/* Instagram */}
          <a
            className="actionBtn3 instagramBtn"
            href="https://www.instagram.com/graphics___hub/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <span className="iconContainer">
              <svg viewBox="0 0 448 512" height="1.5em" fill="white" aria-hidden>
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
              </svg>
            </span>
            <span className="backgroundEffect" />
          </a>
        </div>
      </div>

      {/* ===================== Styles ===================== */}
      <style jsx>{`
        .wrap{
          --btn-collapsed: 60px;
          --btn-expanded: 160px; /* change this once, both buttons match on hover */
          padding: 24px 0 8px;
          color:#fff; text-align:center;
          background: #000;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
        }

        /* keeps titles + rows perfectly centered as a column */
        .stack{
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .title{
          color: #e9c572;
          font-weight: 800;
          font-size: 28px;
          margin: 18px 0 12px;
          font-family: 'Arima', serif;
        }
        .title.spaced{ margin-top: 28px; }

        /* shared row layout for both button groups */
        .row{
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-top: 6px;
          margin-bottom: 10px;
          flex-wrap: wrap;
          min-height: 60px; 
        }

        /* ====== Get in Touch buttons ====== */
        .Btn {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--btn-collapsed);
          height: var(--btn-collapsed);
          border: none;
          border-radius: 50px;
          cursor: pointer;
          overflow: hidden;
          position: relative;
          background: linear-gradient(to right, #77530a, #ffd277, #77530a, #77530a, #ffd277, #77530a);
          background-size: 250%;
          background-position: left;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
          transition: background-position 0.3s ease, width 0.3s ease;
        }

        .Btn::before {
          position: absolute;
          content: "";
          color: #ffd277;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 95%;
          height: 95%;
          border-radius: 30px;
          transition: all 0.5s ease;
          background-color: rgba(0, 0, 0, 0.842);
          background-size: 200%;
          background-position: center;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .sign {
          display: flex;
          color: #ffd277;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .sign svg { 
  width: 25px; 
  height: 25px; 
  fill: #fff; 
}

        .text {
          opacity: 0;
          font-family: 'Arima', sans-serif !important;
          color: #ffd277;
          font-size: 1em;
          font-weight: 600;
          margin-left: 20px;
          transition: opacity 0.3s ease, transform 0.3s ease;
          white-space: nowrap;
          transform: translateX(-20px);
        }

        .Btn:hover,
        .Btn:focus-visible {
          background-position: center;
          justify-content: center;
          width: var(--btn-expanded);
        }
        .Btn:hover .text,
        .Btn:focus-visible .text {
          opacity: 1;
          transform: translateX(0);
          align-self: center;
          margin-left: 30px;
        }
        .Btn:hover .sign,
        .Btn:focus-visible .sign {
          left: 25px;
          transform: translate(0, -50%);
        }
        .Btn:active { transform: translate(2px, 2px); }

        /* remove per-button hover widths so both are equal */
        /* .call-btn:hover { width: 125px; }
           .whatsapp-btn:hover { width: 175px; } */

        .Btn.redirecting {
          background: #4caf50;
          color: white;
        }
        .Btn.redirecting::before {
          content: "Redirecting to WhatsApp...";
          background-color: rgba(0, 0, 0, 0.5);
        }

        /* ====== Social buttons (fixed stacking) ====== */
        .actionBtn3 {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          position: relative;   /* stacking context */
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none; /* anchors */
        }
        .iconContainer {
          position: relative;   /* keep above backgroundEffect */
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          backdrop-filter: blur(10px);
          letter-spacing: 0.8px;
          border-radius: 10px;
          transition: all 0.3s;
          width: 100%;
          height: 100%;
        }
        .backgroundEffect {
          position: absolute;
          inset: 0;             /* top/right/bottom/left: 0 */
          background: #1877f2;  /* FB default */
          z-index: 0;           /* not negative */
          border-radius: 10px;
          pointer-events: none;
          transition: transform 0.3s;
        }
        .actionBtn3:hover .backgroundEffect {
          transform: rotate(35deg);
          transform-origin: bottom;
        }
        .actionBtn3:hover .iconContainer {
          border: 0.5px solid #FFFFFF;
          background: transparent;
          backdrop-filter: blur(4px);
        }
        .instagramBtn .backgroundEffect {
          background: linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5);
        }
      `}</style>
    </section>
  )
}
