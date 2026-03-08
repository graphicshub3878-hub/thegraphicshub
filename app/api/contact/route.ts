export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const preferredRegion = 'home'

import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

type ContactBody = {
  name?: string
  email?: string
  phone?: string
  message?: string
  companyWebsite?: string
  formStartedAt?: number
}

/**
 * NOTE:
 * This in-memory rate limiter works only per running instance.
 * On serverless/multi-instance deployment, use Redis / Upstash / middleware-based rate limiting for real protection.
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 min
const RATE_LIMIT_MAX_REQUESTS = 5

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()

  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  return 'unknown'
}

function applyRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const existing = rateLimitStore.get(ip)

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })
    return { allowed: true }
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    }
  }

  existing.count += 1
  rateLimitStore.set(ip, existing)
  return { allowed: true }
}

function cleanString(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/\u0000/g, '').trim()
}

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function sanitizeName(name: string): string {
  return collapseWhitespace(name).replace(/[^a-zA-Z\s.'-]/g, '')
}

function sanitizeEmail(email: string): string {
  return collapseWhitespace(email).toLowerCase()
}

function sanitizePhone(phone: string): string {
  // Keep only digits and leading plus
  let cleaned = phone.replace(/[^\d+]/g, '')

  // Allow only one "+" and only at the start
  if (cleaned.includes('+')) {
    cleaned = cleaned.replace(/\+/g, '')
    cleaned = `+${cleaned}`
  }

  return cleaned
}

function sanitizeMessage(message: string): string {
  return message.replace(/\r\n/g, '\n').trim()
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function isValidEmail(email: string): boolean {
  // Good practical email regex for forms
  const emailRegex =
    /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,63}$/
  return emailRegex.test(email) && email.length <= 254
}

function isValidPhone(phone: string): boolean {
  /**
   * Accept:
   * +923001234567
   * 03001234567
   * 3001234567
   * +1xxxxxxxxxx etc.
   *
   * After sanitization, require 10 to 15 digits total
   */
  const digitsOnly = phone.replace(/\D/g, '')
  return digitsOnly.length >= 10 && digitsOnly.length <= 15
}

function hasSuspiciousContent(value: string): boolean {
  const suspiciousPatterns = [
    /https?:\/\//i,
    /<a\s/i,
    /<script/i,
    /viagra|casino|crypto|loan|betting|porn/i,
  ]
  return suspiciousPatterns.some((pattern) => pattern.test(value))
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rateLimit = applyRateLimit(ip)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: `Too many submissions. Please try again in ${rateLimit.retryAfter}s.`,
        },
        {
          status: 429,
          headers: rateLimit.retryAfter
            ? { 'Retry-After': String(rateLimit.retryAfter) }
            : undefined,
        }
      )
    }

    const body = (await req.json()) as ContactBody

    const rawName = cleanString(body.name)
    const rawEmail = cleanString(body.email)
    const rawPhone = cleanString(body.phone)
    const rawMessage = cleanString(body.message)
    const honeypot = cleanString(body.companyWebsite)
    const formStartedAt =
      typeof body.formStartedAt === 'number' ? body.formStartedAt : 0

    // Honeypot: real users won't fill this hidden field
    if (honeypot) {
      return NextResponse.json({ ok: true })
    }

    // Time trap: block ultra-fast bot submissions
    const now = Date.now()
    const elapsed = now - formStartedAt
    const minFillTimeMs = 4000
    const maxFormAgeMs = 2 * 60 * 60 * 1000 // 2 hours

    if (!formStartedAt || elapsed < minFillTimeMs || elapsed > maxFormAgeMs) {
      return NextResponse.json(
        { ok: false, error: 'Invalid form submission detected.' },
        { status: 400 }
      )
    }

    const name = sanitizeName(rawName)
    const email = sanitizeEmail(rawEmail)
    const phone = sanitizePhone(rawPhone)
    const message = sanitizeMessage(rawMessage)

    // Required checks
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { ok: false, error: 'All fields are required.' },
        { status: 400 }
      )
    }

    // Length checks
    if (name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid name.' },
        { status: 400 }
      )
    }

    if (email.length > 254 || !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid phone number.' },
        { status: 400 }
      )
    }

    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Message must be between 10 and 2000 characters.',
        },
        { status: 400 }
      )
    }

    // Soft spam detection
    const suspicious =
      hasSuspiciousContent(name) ||
      hasSuspiciousContent(email) ||
      hasSuspiciousContent(message)

    if (suspicious) {
      return NextResponse.json(
        { ok: false, error: 'Submission blocked as suspicious.' },
        { status: 400 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    const fromIdentity =
      process.env.MAIL_FROM || `Website <${process.env.GMAIL_USER}>`
    const ownerEmail = process.env.OWNER_EMAIL || process.env.GMAIL_USER

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safePhone = escapeHtml(phone)
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>')

    await transporter.sendMail({
      from: fromIdentity,
      to: ownerEmail,
      replyTo: email,
      subject: `New Contact: ${name} (${email})`,
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Message:</strong></p>
        <div style="white-space:pre-wrap;font-family:ui-monospace,monospace;">${safeMessage}</div>
        <hr/>
        <small>Sent from your website contact form.</small>
      `,
    })

    await transporter.sendMail({
      from: fromIdentity,
      to: email,
      subject: 'We received your message — Graphics Hub',
      html: `
        <p>Hi ${escapeHtml(name.split(' ')[0] || 'there')},</p>
        <p>Thanks for reaching out! We’ve received your message and will get back to you shortly.</p>
        <blockquote style="border-left:4px solid #ddd;padding-left:10px;margin:0;">
          ${safeMessage}
        </blockquote>
        <p style="margin-top:16px;">— Graphics Hub Team</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Mailer error:', err)
    return NextResponse.json(
      { ok: false, error: err?.message || 'Mail failed' },
      { status: 500 }
    )
  }
}