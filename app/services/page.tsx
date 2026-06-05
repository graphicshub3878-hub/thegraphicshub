import { Suspense } from 'react'
import Header from '@/app/components/header'
import Footer from '../components/footer'
import ServicesPage from '@/app/sections/Services'

export default function Services() {
  return (
    <main>
      <Header />

      <Suspense
        fallback={
          <section
            style={{
              minHeight: '100vh',
              background: '#000',
              color: '#ffda6b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Arima', serif",
            }}
          >
            Loading gallery...
          </section>
        }
      >
        <ServicesPage />
      </Suspense>

      <Footer />
    </main>
  )
}