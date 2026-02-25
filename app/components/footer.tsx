'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // --- INTERNAL ROUTES (edit these as needed)
  const routes = {
    faqs: '/faqs',
    contact: '/contact-us',
    terms: '/tncs',
    refund: '/refund-policy',
    privacy: '/privacy-policy',
    payment: '/payment-policy',
  }

  // --- SOCIALS (external)
  const socialLinks = [
    { label: 'Be', url: 'https://www.behance.net/your-handle', title: 'Behance' },
    { label: 'f', url: 'https://www.facebook.com/your-page', title: 'Facebook' },
    { label: 'in', url: 'https://www.linkedin.com/company/your-company', title: 'LinkedIn' },
    { label: '@', url: 'https://www.instagram.com/your-handle', title: 'Instagram' },
    { label: 'X', url: 'https://x.com/your-handle', title: 'X (Twitter)' },
  ]

  // is this link active?
  const isActive = (href: string) => {
    // strict match; if you want section-wide highlighting, use pathname.startsWith(href)
    return pathname === href
  }

  // Base style generator per-link
  const linkBaseStyle = (active: boolean, fontSize: string) =>
    ({
      color: active ? '#d4af37' : '#888',
      fontSize,
      textDecoration: 'none',
      transition: 'all 0.4s',
      display: 'inline-block',
    } as React.CSSProperties)

  // Hover handlers that respect active state
  const handleLinkHover = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    isEnter: boolean,
    active: boolean
  ) => {
    const target = e.currentTarget as HTMLAnchorElement
    if (isEnter) {
      target.style.color = '#d4af37'
      target.style.transform = 'translateX(8px)'
    } else {
      target.style.color = active ? '#d4af37' : '#888'
      target.style.transform = 'translateX(0)'
    }
  }

  // Keyboard focus should mirror hover, also respect active
  const onFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
    const t = e.currentTarget
    t.style.color = '#d4af37'
    t.style.transform = 'translateX(8px)'
  }
  const onBlur = (e: React.FocusEvent<HTMLAnchorElement>, active: boolean) => {
    const t = e.currentTarget
    t.style.color = active ? '#d4af37' : '#888'
    t.style.transform = 'translateX(0)'
  }

  return (
    <footer
      style={{
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: 'Arima, sans-serif',
        borderTop: '3px solid #d4af37',
        overflow: 'hidden',
        position: 'relative',
        margin: 0,
        padding: 0,
      }}
    >
      {/* Golden Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '45%',
          height: '100%',
          background:
            'radial-gradient(circle at top right, rgba(212,175,55,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Content */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isMobile ? '60px 24px 0' : '100px 80px 0',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Top Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: isMobile ? '80px' : '200px',
          }}
        >
          {/* Left Links */}
          <div style={{ display: 'flex', gap: isMobile ? '60px' : '180px' }}>
            {/* Quick Links */}
            <div>
              <h3
                style={{
                  color: '#d4af37',
                  fontSize: isMobile ? '15px' : '17px',
                  fontFamily: 'Arima, sans-serif',
                  fontWeight: 700,
                  marginBottom: '35px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  paddingBottom: '15px',
                  position: 'relative',
                }}
              >
                Quick Links
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '50px',
                    height: '2px',
                    background: 'linear-gradient(to right,#d4af37,transparent)',
                  }}
                />
              </h3>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                {[
                  { label: "FAQ's", href: routes.faqs },
                  { label: 'Contact Us', href: routes.contact },
                  { label: 'Terms & Conditions', href: routes.terms },
                ].map(({ label, href }) => {
                  const active = isActive(href)
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        style={linkBaseStyle(active, isMobile ? '13px' : '14px')}
                        onMouseEnter={(e) => handleLinkHover(e, true, active)}
                        onMouseLeave={(e) => handleLinkHover(e, false, active)}
                        onFocus={onFocus}
                        onBlur={(e) => onBlur(e, active)}
                      >
                        {label}
                      </Link>
                    </li>
                  )
                })}
              </ul>

              {/* Social Icons */}
              {!isMobile && (
                <div
                  style={{
                    marginTop: '50px',
                    display: 'flex',
                    gap: '16px',
                    paddingTop: '40px',
                    borderTop: '1px solid #222',
                  }}
                >
                  {socialLinks.map((social, i) => (
                    <a
                      key={i}
                      href={social.url}
                      title={social.title}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.4s',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#fff',
                        textDecoration: 'none',
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        border: '1.5px solid #333',
                        background: 'rgba(255,255,255,0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#d4af37'
                        e.currentTarget.style.borderColor = '#d4af37'
                        e.currentTarget.style.boxShadow =
                          '0 0 12px rgba(212,175,55,0.6), inset 0 0 12px rgba(212,175,55,0.1)'
                        e.currentTarget.style.background = 'rgba(212,175,55,0.08)'
                        e.currentTarget.style.transform = 'translateY(-4px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#fff'
                        e.currentTarget.style.borderColor = '#333'
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                        e.currentTarget.style.transform = 'none'
                      }}
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Policies */}
            <div>
              <h3
                style={{
                  color: '#d4af37',
                  fontFamily: 'Arima, sans-serif',
                  fontSize: isMobile ? '15px' : '17px',
                  fontWeight: 700,
                  marginBottom: '35px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  paddingBottom: '15px',
                  position: 'relative',
                }}
              >
                Policies
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '50px',
                    height: '2px',
                    background: 'linear-gradient(to right,#d4af37,transparent)',
                  }}
                />
              </h3>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                {[
                  { label: 'Refund Policy', href: routes.refund },
                  { label: 'Privacy Policy', href: routes.privacy },
                  { label: 'Payment Policy', href: routes.payment },
                ].map(({ label, href }) => {
                  const active = isActive(href)
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        style={linkBaseStyle(active, isMobile ? '13px' : '14px')}
                        onMouseEnter={(e) => handleLinkHover(e, true, active)}
                        onMouseLeave={(e) => handleLinkHover(e, false, active)}
                        onFocus={onFocus}
                        onBlur={(e) => onBlur(e, active)}
                      >
                        {label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Right GH */}
          <div
  style={{
    textAlign: isMobile ? 'left' : 'right',
    maxWidth: isMobile ? '100%' : '420px',
  }}
>
  <div
    style={{
      marginBottom: '25px',
      cursor: 'default',
      display: 'inline-block',
      filter: 'drop-shadow(0 0 40px rgba(212,175,55,0.25))',
    }}
  >
    <img
      src="/assets/images/Logo.png"
      alt="Graphics Hub Logo"
      style={{
        width: isMobile ? '160px' : '220px',
        height: 'auto',
        objectFit: 'contain',
      }}
    />
  </div>

  <p
  style={{
    color: '#999',
    fontSize: isMobile ? '12px' : '13.5px',
    lineHeight: '1.9',
    fontStyle: 'italic',
    fontWeight: 300,
  }}
>
  <span style={{ fontWeight: 700, color: '#999' }}>
    "Graphics Hub"
  </span>{' '}
  is your one-stop solution for stunning visual experiences. We specialize in
  creating captivating designs for social media, websites, branding, 3D, interiors, exteriors, & print
  materials. Let us elevate your brand with our expertise.
</p>
</div>

        </div>

        {/* Divider */}
        <div
          style={{
            width: '100%',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #333, transparent)',
            margin: isMobile ? '25px 0' : '40px 0',
          }}
        />

        {/* Copyright */}
        <div
          style={{
            color: '#666',
            fontSize: isMobile ? '11px' : '12px',
            textAlign: 'center',
            letterSpacing: '0.5px',
            fontWeight: 300,
            padding: isMobile ? '8px 0 12px' : '10px 0 15px',
            margin: 0,
            lineHeight: '1.6',
          }}
        >
          © 2026 – All Rights Reserved.{' '}
          <span style={{ color: '#d4af37', fontWeight: 600 }}>Graphics Hub.</span>
        </div>
      </div>
    </footer>
  )
}
