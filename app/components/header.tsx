'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

type NavItem = {
  label: string
  href: string
}

const Header = () => {
  const pathname = usePathname() || '/'
  const [menuOpen, setMenuOpen] = useState(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (!menuOpen) return

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const nav: NavItem[] = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about-us' },
      { label: 'Portfolio', href: '/gallery' },
      // { label: 'Services', href: '/services' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Contact Us', href: '/contact-us' },
    ],
    []
  )

  // Handles trailing slashes
  const normalize = (p: string) => {
    return p === '/' ? '/' : p.replace(/\/+$/, '') || '/'
  }

  const isActive = (href: string) => {
    const cur = normalize(pathname)
    const target = normalize(href)

    if (target === '/') {
      return cur === '/'
    }

    return cur === target || cur.startsWith(`${target}/`)
  }

  return (
    <>
      <header className="gh-header" role="banner">
        {/* Logo */}
        <Link
          href="/"
          className="gh-logo"
          aria-label="Graphics Hub — Home"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            className="gh-logo-image"
            src="/assets/images/Logo.png"
            alt="Graphics Hub Logo"
            width={220}
            height={64}
            priority
            style={{
              objectFit: 'contain',
              height: 'auto',
            }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="gh-nav-desktop" aria-label="Primary">
          {nav.map(({ label, href }) => {
            const active = isActive(href)

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`gh-link ${active ? 'active' : ''}`}
                style={active ? { color: '#ffd700' } : undefined}
              >
                <span className="gh-link-text">{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Hamburger */}
        <button
          className={`gh-hamburger ${menuOpen ? 'open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="gh-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <nav
        id="mobile-menu"
        className={`gh-mobile ${menuOpen ? 'show' : ''}`}
        aria-label="Mobile Primary"
        aria-hidden={!menuOpen}
      >
        {nav.map(({ label, href }) => {
          const active = isActive(href)

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`gh-mobile-link ${active ? 'active' : ''}`}
              style={active ? { color: '#ffd700' } : undefined}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Styles */}
      <style jsx>{`
        /* Active nav backstop */
        :global(.gh-link.active) {
          color: #ffd700 !important;
        }

        :global(.gh-mobile-link.active) {
          color: #ffd700 !important;
        }

        /* Move the actual PNG slightly upward */
        :global(.gh-logo-image) {
          transform: translateY(-5px);
          width: clamp(170px, 18vw, 220px);
        }

        /* ============ Shell ============ */
        .gh-header {
          position: fixed;
          top: max(12px, env(safe-area-inset-top));
          left: 50%;
          transform: translateX(-50%);
          width: min(1200px, calc(100% - 16px));
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 18px;
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.58);
          border: 1px solid rgba(255, 215, 0, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
          z-index: 10000;
        }

        .gh-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 8px;
          border-radius: 10px;
          transition: transform 0.2s ease;
        }

        .gh-logo:focus-visible {
          outline: 2px solid #ffd700;
          outline-offset: 4px;
        }

        .gh-logo:hover {
          transform: translateY(-1px);
        }

        /* ============ Desktop Nav ============ */
        .gh-nav-desktop {
          display: flex;
          align-items: center;
          gap: clamp(16px, 4vw, 36px);
        }

        .gh-link {
          position: relative;
          padding: 10px 6px;
          text-decoration: none;
          color: #fff;
          font-weight: 600;
          line-height: 1;
          letter-spacing: 0.2px;
          transition: color 0.25s ease;
          font-family: 'Arima', serif;
        }

        .gh-link:focus-visible {
          outline: 2px solid #ffd700;
          outline-offset: 6px;
          border-radius: 8px;
        }

        .gh-link.active,
        .gh-link:hover {
          color: #ffd700;
        }

        .gh-link::after {
          content: '';
          position: absolute;
          left: 8px;
          right: 8px;
          bottom: 4px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            transparent,
            #ffd700,
            transparent
          );
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.25s ease;
        }

        .gh-link:hover::after,
        .gh-link.active::after {
          transform: scaleX(1);
        }

        /* ============ Hamburger ============ */
        .gh-hamburger {
          display: none;
          width: 38px;
          height: 34px;
          border: none;
          background: transparent;
          padding: 0;
          cursor: pointer;
          position: relative;
        }

        .gh-hamburger span {
          position: absolute;
          left: 7px;
          right: 7px;
          height: 2px;
          background: #ffd700;
          border-radius: 2px;
          transition:
            transform 0.3s ease,
            opacity 0.3s ease,
            top 0.3s ease;
        }

        .gh-hamburger span:nth-child(1) {
          top: 9px;
        }

        .gh-hamburger span:nth-child(2) {
          top: 16px;
        }

        .gh-hamburger span:nth-child(3) {
          top: 23px;
        }

        .gh-hamburger.open span:nth-child(1) {
          top: 16px;
          transform: rotate(45deg);
        }

        .gh-hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .gh-hamburger.open span:nth-child(3) {
          top: 16px;
          transform: rotate(-45deg);
        }

        /* ============ Mobile ============ */
        .gh-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.68);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 9998;
        }

        .gh-mobile {
          position: fixed;
          top: calc(max(12px, env(safe-area-inset-top)) + 78px);
          left: 50%;
          transform: translateX(-50%) translateY(-12px) scale(0.98);
          width: min(420px, calc(100% - 24px));
          max-height: calc(100dvh - 104px - env(safe-area-inset-bottom));
          overflow-y: auto;
          background: rgba(8, 8, 8, 0.96);
          border: 1px solid rgba(255, 215, 0, 0.42);
          border-radius: 18px;
          box-shadow:
            0 24px 70px rgba(0, 0, 0, 0.72),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          display: grid;
          grid-template-columns: 1fr;
          gap: 4px;
          padding: 10px;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition:
            opacity 0.22s ease,
            transform 0.22s ease,
            visibility 0.22s ease;
          z-index: 10001;
        }

        .gh-mobile.show {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0) scale(1);
          pointer-events: auto;
        }

        .gh-mobile-link {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 52px;
          padding: 13px 16px;
          text-decoration: none;
          color: #fff;
          font-family: 'Arima', serif;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.3px;
          border: 1px solid transparent;
          border-radius: 12px;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .gh-mobile-link:hover {
          color: #ffd700;
          background: rgba(255, 215, 0, 0.07);
        }

        .gh-mobile-link.active {
          color: #ffd700;
          background: rgba(255, 215, 0, 0.1);
          border-color: rgba(255, 215, 0, 0.18);
          padding-left: 22px;
        }

        .gh-mobile-link.active::before {
          content: '';
          position: absolute;
          left: 10px;
          width: 3px;
          height: 22px;
          border-radius: 999px;
          background: #ffd700;
          box-shadow: 0 0 12px rgba(255, 215, 0, 0.55);
        }

        .gh-mobile-link:active {
          transform: translateY(1px);
        }

        .gh-mobile-link:focus-visible {
          outline: 2px solid #ffd700;
          outline-offset: -2px;
        }

        /* ============ Responsive ============ */
        @media (max-width: 980px) {
          .gh-nav-desktop {
            display: none;
          }

          .gh-hamburger {
            display: inline-block;
          }

          .gh-header {
            width: calc(100% - 12px);
            min-height: 66px;
            padding: 8px 12px;
          }

          :global(.gh-logo-image) {
            width: 160px;
          }
        }

        @media (max-width: 520px) {
          .gh-header {
            top: max(8px, env(safe-area-inset-top));
            width: calc(100% - 16px);
            min-height: 60px;
            padding: 7px 10px;
            border-radius: 14px;
          }

          :global(.gh-logo-image) {
            width: 142px;
            transform: translateY(-3px);
          }

          .gh-mobile {
            top: calc(max(8px, env(safe-area-inset-top)) + 68px);
            width: calc(100% - 16px);
            max-height: calc(100dvh - 88px - env(safe-area-inset-bottom));
            border-radius: 16px;
          }

          .gh-mobile-link {
            min-height: 50px;
            padding-block: 12px;
          }
        }
      `}</style>
    </>
  )
}

export default Header
