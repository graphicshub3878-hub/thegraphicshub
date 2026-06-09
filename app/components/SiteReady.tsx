'use client'

import { useEffect } from 'react'

export default function SiteReady() {
  useEffect(() => {
    document.documentElement.classList.add('site-ready')
  }, [])

  return null
}
