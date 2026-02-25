'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Failed')

      setStatus('✅ Message sent successfully!')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setStatus('❌ Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page">
      {/* ===== Top Headings ===== */}
      <header className="head">
        <h1 className="big">
          Contact <span>Us</span>
        </h1>
        <h2 className="sub">Reach Us Out</h2>
        <p className="subdesc">Let us know how to get back to you!</p>
      </header>

      {/* ===== Image + Form Row ===== */}
      <div className="container">
        {/* LEFT: Image — matches form height on desktop */}
        <div className="photoCard">
          <Image
            src="/assets/images/10-e1731652606915.png"
            alt="Graphics Hub Visual"
            fill
            priority
            style={{ objectFit: 'cover', borderRadius: '20px' }}
          />
        </div>

        {/* RIGHT: Form */}
        <div className="right">
          <div className="formBox">
            <h3>Get In Touch</h3>
            <p className="desc">Tell us a bit about your project — we’ll reply soon.</p>

            <form onSubmit={onSubmit}>
              <div className="row">
                <div className="field">
                  <label>Name</label>
                  <input type="text" name="name" value={form.name} onChange={onChange} required />
                </div>

                <div className="field">
                  <label>Email</label>
                  <input type="email" name="email" value={form.email} onChange={onChange} required />
                </div>
              </div>

              <div className="row">
                <div className="field">
                  <label>Phone</label>
                  <input type="tel" name="phone" value={form.phone} onChange={onChange} required />
                </div>
              </div>

              <div className="field">
                <label>Message</label>
                <textarea name="message" rows={4} value={form.message} onChange={onChange} required />
              </div>

              <div className="wpforms-submit-container">
                <button type="submit" className="wpforms-submit" disabled={loading}>
                  {loading ? 'Sending…' : 'Submit'}
                </button>
              </div>

              {status && <p className="status">{status}</p>}
            </form>
          </div>
        </div>
      </div>

      {/* === your styles unchanged === */}
      <style jsx>{`
        :root { --teal:#018175; --beige:#f0e1c0; --dark:#0a0a0a; }
        .page { background:var(--dark); color:#fff; font-family:'Arima',sans-serif; padding:150px 16px 110px; }
        .head { text-align:center; margin-bottom:28px; }
        .big { font-family:'Arima',serif; font-weight:700; font-size:clamp(2.6rem,6vw,4rem); color: #fff; margin:0 0 10px; }
        .big span { color:#ffd700; font-family:'Corinthia',serif; font-size:clamp(3rem,9vw,9rem); font-weight:500; margin-left:-38px; }
        .sub { font-family:'Arima',serif; color:#ffd700; font-size:clamp(1.4rem,2.6vw,2rem); margin:0 0 2px; }
        .subdesc { font-family:'Arima',serif; color:#cfd3db; opacity:.9; margin:0; }
        .container { width:92%; max-width:1220px; margin:30px auto 0; display:grid; grid-template-columns:1fr 1.05fr; gap:40px; align-items:stretch; }
        .photoCard { position:relative; width:100%; height:100%; min-height:420px; border-radius:20px; box-shadow:0 18px 40px rgba(0,0,0,.45); overflow:hidden; }
        .right { display:flex; align-items:stretch; justify-content:center; padding:0; }
        .formBox { width:100%; max-width:600px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); border-radius:20px; padding:50px 60px; box-shadow:0 8px 40px rgba(0,0,0,.4); height:100%; display:flex; flex-direction:column; }
        .formBox h3 { font-size:2rem; font-family:'Arima',sans-serif!important; font-weight:600; margin-bottom:8px; color:var(--beige); }
        .desc { font-size:.95rem; opacity:.8; margin-bottom:32px; }
        .row { display:flex; gap:20px; flex-wrap:wrap; }
        .field { flex:1; min-width:220px; display:flex; flex-direction:column; gap:6px; margin-bottom:18px; }
        label { font-size:.9rem; color:#ccc; }
        input, textarea { background:#141414; border:1px solid #2a2a2a; color:#fff; padding:14px; border-radius:10px; font-size:1rem; outline:none; transition:border-color .2s, box-shadow .2s; }
        input:focus, textarea:focus { border-color:var(--teal); box-shadow:0 0 0 3px rgba(1,129,117,.25); }
        textarea { resize:vertical; }
        .wpforms-submit-container { display:flex; justify-content:flex-end; margin-top:8px; }
        .wpforms-submit { width:150px; height:44px; border:none; font-family:'Arima',serif; border-radius:12px; background:linear-gradient(to right,#77530a,#ffd277,#77530a,#77530a,#ffd277,#77530a); background-size:200%; background-position:left; color:#ffd277; position:relative; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background-position 1s; overflow:hidden; }
        .wpforms-submit::before { position:absolute; content:'Submit'; color:#ffd700; display:flex; align-items:center; justify-content:center; width:97%; height:90%; border-radius:10px; background-color:rgba(0,0,0,.84); background-size:200%; background-position:left; transition:background-position 1s; }
        .wpforms-submit:hover, .wpforms-submit:hover::before { background-position:right; }
        .wpforms-submit:disabled { filter:grayscale(.6) brightness(.8); cursor:not-allowed; }
        .status { font-size:.95rem; margin-top:12px; opacity:.9; }
        @media (max-width:1200px){ .container{ gap:32px;} .formBox{ padding:44px 48px;} }
        @media (max-width:1024px){ .container{ grid-template-columns:1fr; gap:28px;} .right{ padding:0 6px;} .photoCard{ height:auto; min-height:unset; aspect-ratio:16/9;} .wpforms-submit-container{ justify-content:center;} }
        @media (max-width:768px){ .page{ padding:150px 14px 90px;} .formBox{ max-width:720px; padding:36px 28px; border-radius:16px;} .row{ gap:14px;} .field{ min-width:100%; } .wpforms-submit{ width:100%; } }
        @media (max-width:600px){ .page{ padding:100px 12px 70px;} .big{ margin-bottom:6px;} .subdesc{ font-size:.95rem;} input, textarea{ font-size:1rem; padding:13px 12px; border-radius:10px;} .photoCard{ aspect-ratio:4/3; border-radius:16px; box-shadow:0 12px 28px rgba(0,0,0,.42);} }
        @media (max-width:420px){ .formBox{ padding:28px 20px; border-radius:14px;} .wpforms-submit::before{ width:96%; height:88%; } }
      `}</style>
    </section>
  )
}
