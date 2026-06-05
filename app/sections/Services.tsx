'use client'

import Image from 'next/image'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import {
  CATEGORY_LABELS,
  LABEL_TO_CODE,
  SUBCATEGORIES,
  type CategoryLabel,
} from '@/app/libs/categories'

type Img = {
  _id: string
  category: string
  subcategory?: string | null
  alt?: string
  width?: number
  height?: number
  url: string
  thumbUrl: string
}

type LazyGalleryVideoProps = {
  src: string
}

const PAGE_LIMIT = 18

const isVideoUrl = (url: string) => {
  return /\.(mp4|mov|webm)(\?.*)?$/i.test(url)
}

const getCategoryFromCode = (
  categoryCode: string | null
): CategoryLabel => {
  return (
    CATEGORY_LABELS.find(
      label => LABEL_TO_CODE[label] === categoryCode
    ) || CATEGORY_LABELS[0]
  )
}

const LazyGalleryVideo = ({
  src,
}: LazyGalleryVideoProps) => {
  const videoRef =
    useRef<HTMLVideoElement | null>(null)

  const wrapperRef =
    useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const video = videoRef.current

    if (!wrapper || !video) return

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]

        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      {
        rootMargin: '180px 0px',
        threshold: 0.05,
      }
    )

    observer.observe(wrapper)

    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="gallery-video-wrap"
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        className="gallery-video"
      />
    </div>
  )
}

export default function ServicesPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialCategory = getCategoryFromCode(
    searchParams.get('cat')
  )

  const initialCode =
    LABEL_TO_CODE[initialCategory]

  const initialSubcategory =
    searchParams.get('sub')

  const [cat, setCat] =
    useState<CategoryLabel>(initialCategory)

  const [sub, setSub] = useState<string>(() => {
    const availableSubcategories =
      SUBCATEGORIES[initialCode] || []

    if (
      initialSubcategory &&
      availableSubcategories.includes(
        initialSubcategory
      )
    ) {
      return initialSubcategory
    }

    return 'ALL'
  })

  const [items, setItems] = useState<Img[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const [loading, setLoading] = useState(false)

  const [loadingMore, setLoadingMore] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const [fade, setFade] = useState(false)

  const [popup, setPopup] =
    useState<Img | null>(null)

  const railRef =
    useRef<HTMLDivElement | null>(null)

  const btnLeftRef =
    useRef<HTMLButtonElement | null>(null)

  const btnRightRef =
    useRef<HTMLButtonElement | null>(null)

  const itemRefs =
    useRef<(HTMLButtonElement | null)[]>([])

  const sentinelRef =
    useRef<HTMLDivElement | null>(null)

  const abortRef =
    useRef<AbortController | null>(null)

  const requestRunningRef = useRef(false)

  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollStart = useRef(0)

  const code = LABEL_TO_CODE[cat]

  const subcats =
    SUBCATEGORIES[code] || []

  // ==================================================
  // URL UPDATE
  // ==================================================
  const updateUrl = (
    nextCategory: CategoryLabel,
    nextSubcategory: string
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    )

    params.set(
      'cat',
      LABEL_TO_CODE[nextCategory]
    )

    if (nextSubcategory === 'ALL') {
      params.delete('sub')
    } else {
      params.set('sub', nextSubcategory)
    }

    const queryString = params.toString()

    router.push(
      queryString
        ? `${pathname}?${queryString}`
        : pathname,
      {
        scroll: false,
      }
    )
  }

  // Add default category to URL if missing
  useEffect(() => {
    if (searchParams.get('cat')) return

    const params = new URLSearchParams(
      searchParams.toString()
    )

    params.set('cat', LABEL_TO_CODE[cat])

    router.replace(
      `${pathname}?${params.toString()}`,
      {
        scroll: false,
      }
    )
  }, [cat, pathname, router, searchParams])

  // Sync tabs when navigating with browser back,
  // forward or shared URLs
  useEffect(() => {
    const urlCategory = getCategoryFromCode(
      searchParams.get('cat')
    )

    const urlCode =
      LABEL_TO_CODE[urlCategory]

    const availableSubcategories =
      SUBCATEGORIES[urlCode] || []

    const urlSubcategory =
      searchParams.get('sub')

    const validSubcategory =
      urlSubcategory &&
      availableSubcategories.includes(
        urlSubcategory
      )
        ? urlSubcategory
        : 'ALL'

    setCat(previousCategory =>
      previousCategory === urlCategory
        ? previousCategory
        : urlCategory
    )

    setSub(previousSubcategory =>
      previousSubcategory === validSubcategory
        ? previousSubcategory
        : validSubcategory
    )
  }, [searchParams])

  const handleCategoryChange = (
    category: CategoryLabel
  ) => {
    if (category === cat) return

    setCat(category)
    setSub('ALL')
    setPopup(null)

    updateUrl(category, 'ALL')
  }

  const handleSubcategoryChange = (
    subcategory: string
  ) => {
    if (subcategory === sub) return

    setSub(subcategory)
    setPopup(null)

    updateUrl(cat, subcategory)
  }

  // ==================================================
  // CATEGORY RAIL
  // ==================================================
  const updateArrows = () => {
    const el = railRef.current

    if (!el) return

    const atStart = el.scrollLeft <= 2

    const atEnd =
      el.scrollLeft + el.clientWidth >=
      el.scrollWidth - 2

    if (btnLeftRef.current) {
      btnLeftRef.current.disabled = atStart
    }

    if (btnRightRef.current) {
      btnRightRef.current.disabled = atEnd
    }
  }

  const scrollByAmount = (
    direction: 'left' | 'right'
  ) => {
    const el = railRef.current

    if (!el) return

    const amount = Math.round(
      el.clientWidth * 0.7
    )

    el.scrollBy({
      left:
        direction === 'left'
          ? -amount
          : amount,
      behavior: 'smooth',
    })
  }

  const centerActive = () => {
    const rail = railRef.current

    const active =
      itemRefs.current[
        CATEGORY_LABELS.indexOf(cat)
      ]

    if (!rail || !active) return

    const railRect =
      rail.getBoundingClientRect()

    const itemRect =
      active.getBoundingClientRect()

    const delta =
      (itemRect.left + itemRect.right) / 2 -
      (railRect.left + railRect.right) / 2

    rail.scrollBy({
      left: delta,
      behavior: 'smooth',
    })
  }

  // ==================================================
  // FETCH GALLERY PAGE
  // ==================================================
  const fetchGalleryPage = useCallback(
    async (
      requestedPage: number,
      replaceExistingItems: boolean
    ) => {
      if (requestRunningRef.current) return

      requestRunningRef.current = true

      if (replaceExistingItems) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      setError(null)

      const controller =
        new AbortController()

      abortRef.current = controller

      const qSub =
        sub === 'ALL'
          ? ''
          : `&sub=${encodeURIComponent(sub)}`

      try {
        const response = await fetch(
          `/api/images?cat=${encodeURIComponent(
            code
          )}${qSub}&page=${requestedPage}&limit=${PAGE_LIMIT}`,
          {
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        let json: any = null

        try {
          json = await response.json()
        } catch {
          throw new Error(
            'Gallery service returned an invalid response.'
          )
        }

        if (!response.ok) {
          throw new Error(
            json?.error ||
              'Gallery is currently unavailable.'
          )
        }

        const newItems: Img[] =
          Array.isArray(json?.items)
            ? json.items
            : []

        if (replaceExistingItems) {
          setItems(newItems)
        } else {
          setItems(previousItems => {
            const existingIds = new Set(
              previousItems.map(
                item => item._id
              )
            )

            const uniqueNewItems =
              newItems.filter(
                item =>
                  !existingIds.has(item._id)
              )

            return [
              ...previousItems,
              ...uniqueNewItems,
            ]
          })
        }

        setPage(requestedPage)

        // Stop safely when the last page is reached.
        // This also prevents loops when a successful
        // API response contains no items.
        if (
          typeof json?.hasMore === 'boolean'
        ) {
          setHasMore(json.hasMore)
        } else if (
          typeof json?.pagination?.hasMore ===
          'boolean'
        ) {
          setHasMore(
            json.pagination.hasMore
          )
        } else if (
          typeof json?.pagination
            ?.hasNextPage === 'boolean'
        ) {
          setHasMore(
            json.pagination.hasNextPage
          )
        } else {
          setHasMore(
            newItems.length === PAGE_LIMIT
          )
        }
      } catch (e: any) {
        if (e?.name !== 'AbortError') {
          // Important:
          // Stop infinite scrolling after an API
          // or database failure.
          setHasMore(false)

          setError(
            e?.message ||
              'Gallery is currently unavailable.'
          )
        }
      } finally {
        if (
          abortRef.current === controller
        ) {
          requestRunningRef.current = false
          setLoading(false)
          setLoadingMore(false)
        }
      }
    },
    [code, sub]
  )

  // Reload first page when category changes
  useEffect(() => {
    abortRef.current?.abort()
    requestRunningRef.current = false

    setFade(true)
    setError(null)
    setItems([])
    setPage(1)
    setHasMore(true)

    fetchGalleryPage(1, true).finally(() => {
      setFade(false)

      requestAnimationFrame(() => {
        centerActive()
        updateArrows()
      })
    })

    return () => {
      abortRef.current?.abort()
      requestRunningRef.current = false
    }
  }, [cat, sub, fetchGalleryPage])

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current

    if (
      !sentinel ||
      error ||
      !hasMore ||
      loading ||
      loadingMore
    ) {
      return
    }

    const observer =
      new IntersectionObserver(
        entries => {
          const entry = entries[0]

          if (
            entry.isIntersecting &&
            hasMore &&
            !error &&
            !loading &&
            !loadingMore &&
            !requestRunningRef.current
          ) {
            fetchGalleryPage(
              page + 1,
              false
            )
          }
        },
        {
          rootMargin: '500px 0px',
          threshold: 0,
        }
      )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [
    error,
    fetchGalleryPage,
    hasMore,
    loading,
    loadingMore,
    page,
  ])

  // Retry manually after database or API issue
  const retryGallery = () => {
    abortRef.current?.abort()
    requestRunningRef.current = false

    setItems([])
    setPage(1)
    setError(null)
    setHasMore(true)

    fetchGalleryPage(1, true)
  }

  // Category rail arrows
  useEffect(() => {
    const el = railRef.current

    if (!el) return

    const onScroll = () => updateArrows()
    const onResize = () => updateArrows()

    updateArrows()

    el.addEventListener('scroll', onScroll, {
      passive: true,
    })

    window.addEventListener(
      'resize',
      onResize
    )

    return () => {
      el.removeEventListener(
        'scroll',
        onScroll
      )

      window.removeEventListener(
        'resize',
        onResize
      )
    }
  }, [])

  // Category rail dragging
  useEffect(() => {
    const rail = railRef.current

    if (!rail) return

    const onDown = (
      e: MouseEvent | TouchEvent
    ) => {
      isDragging.current = true

      startX.current =
        'touches' in e
          ? e.touches[0].pageX
          : e.pageX

      scrollStart.current =
        rail.scrollLeft

      rail.classList.add('dragging')
    }

    const onMove = (
      e: MouseEvent | TouchEvent
    ) => {
      if (!isDragging.current) return

      const x =
        'touches' in e
          ? e.touches[0].pageX
          : e.pageX

      const walk = x - startX.current

      rail.scrollLeft =
        scrollStart.current - walk
    }

    const onUp = () => {
      isDragging.current = false
      rail.classList.remove('dragging')
    }

    rail.addEventListener(
      'mousedown',
      onDown
    )

    rail.addEventListener(
      'mousemove',
      onMove
    )

    rail.addEventListener(
      'mouseup',
      onUp
    )

    rail.addEventListener(
      'mouseleave',
      onUp
    )

    rail.addEventListener(
      'touchstart',
      onDown
    )

    rail.addEventListener(
      'touchmove',
      onMove
    )

    rail.addEventListener(
      'touchend',
      onUp
    )

    return () => {
      rail.removeEventListener(
        'mousedown',
        onDown
      )

      rail.removeEventListener(
        'mousemove',
        onMove
      )

      rail.removeEventListener(
        'mouseup',
        onUp
      )

      rail.removeEventListener(
        'mouseleave',
        onUp
      )

      rail.removeEventListener(
        'touchstart',
        onDown
      )

      rail.removeEventListener(
        'touchmove',
        onMove
      )

      rail.removeEventListener(
        'touchend',
        onUp
      )
    }
  }, [])

  // Close preview with Escape
  useEffect(() => {
    const handleKey = (
      e: KeyboardEvent
    ) => {
      if (e.key === 'Escape') {
        setPopup(null)
      }
    }

    window.addEventListener(
      'keydown',
      handleKey
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleKey
      )
    }
  }, [])

  return (
    <section className="wrap">
      <h1 className="title">
        Wonders We<span>Weave</span>
      </h1>

      {/* CATEGORY SLIDER */}
      <div className="catWrap">
        <button
          ref={btnLeftRef}
          className="arrow left"
          onClick={() =>
            scrollByAmount('left')
          }
          aria-label="Scroll categories left"
        >
          ‹
        </button>

        <div
          className="rail"
          ref={railRef}
        >
          <div className="track">
            {CATEGORY_LABELS.map(
              (category, index) => (
                <button
                  key={category}
                  ref={el => {
                    itemRefs.current[index] =
                      el
                  }}
                  className={`tab ${
                    category === cat
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    handleCategoryChange(
                      category
                    )
                  }
                >
                  {category}
                </button>
              )
            )}

            <span
              className="underline"
              style={{
                transform: `translateX(${(() => {
                  const index =
                    CATEGORY_LABELS.indexOf(
                      cat
                    )

                  const el =
                    itemRefs.current[index]

                  return el
                    ? el.offsetLeft
                    : 0
                })()}px)`,

                width: (() => {
                  const index =
                    CATEGORY_LABELS.indexOf(
                      cat
                    )

                  const el =
                    itemRefs.current[index]

                  return el
                    ? el.offsetWidth
                    : 0
                })(),
              }}
            />
          </div>
        </div>

        <button
          ref={btnRightRef}
          className="arrow right"
          onClick={() =>
            scrollByAmount('right')
          }
          aria-label="Scroll categories right"
        >
          ›
        </button>
      </div>

      {/* SUBCATEGORY TABS */}
      {subcats.length > 0 && (
        <div className="subTabs">
          <button
            className={`subtab ${
              sub === 'ALL'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              handleSubcategoryChange(
                'ALL'
              )
            }
          >
            All
          </button>

          {subcats.map(
            subcategory => (
              <button
                key={subcategory}
                className={`subtab ${
                  sub === subcategory
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleSubcategoryChange(
                    subcategory
                  )
                }
              >
                {subcategory}
              </button>
            )
          )}
        </div>
      )}

      {loading &&
        items.length === 0 &&
        !error && (
          <p className="status-text loading-text">
            Loading gallery...
          </p>
        )}

      {error && (
        <div className="gallery-status">
          <p className="status-title">
            Gallery is currently unavailable.
          </p>

          <p className="status-desc">
            We could not load the gallery
            right now. Please try again.
          </p>

          <button
            className="retry-button"
            onClick={retryGallery}
            disabled={loading}
          >
            {loading
              ? 'Retrying...'
              : 'Try Again'}
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        items.length === 0 && (
          <div className="gallery-status">
            <p className="status-title">
              No items found in this
              category.
            </p>

            <p className="status-desc">
              Please select another
              category to explore more
              work.
            </p>
          </div>
        )}

      {!error && (
        <>
          <div
            className={`masonry ${
              fade
                ? 'fade-out'
                : 'fade-in'
            }`}
          >
            {items.map(item => (
              <div
                key={`${item._id}-${item.url}`}
                className="card"
                onClick={() =>
                  setPopup(item)
                }
                aria-label={item.alt || ''}
              >
                {isVideoUrl(item.url) ? (
                  <LazyGalleryVideo
                    src={item.url}
                  />
                ) : (
                  <Image
                    src={item.thumbUrl}
                    alt={item.alt || ''}
                    width={
                      item.width || 800
                    }
                    height={
                      item.height || 600
                    }
                    sizes="(max-width: 699px) 100vw, (max-width: 1099px) 50vw, 33vw"
                    quality={70}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={`${item.thumbUrl}?q=1&blur=200`}
                  />
                )}
              </div>
            ))}
          </div>

          {hasMore && (
            <div
              ref={sentinelRef}
              className="load-sentinel"
              aria-hidden="true"
            />
          )}

          {loadingMore && (
            <p className="status-text loading-more">
              Loading more...
            </p>
          )}

          {!loading &&
            !loadingMore &&
            items.length > 0 &&
            !hasMore && (
              <p className="gallery-end">
                You have reached the end.
              </p>
            )}
        </>
      )}

      {popup && (
        <div
          className="popup"
          onClick={() =>
            setPopup(null)
          }
        >
          <div
            className="popup-inner"
            onClick={e =>
              e.stopPropagation()
            }
          >
            <button
              className="close"
              onClick={() =>
                setPopup(null)
              }
              aria-label="Close preview"
            >
              ×
            </button>

            {isVideoUrl(popup.url) ? (
              <video
                src={popup.url}
                controls
                autoPlay
                playsInline
                preload="metadata"
                style={{
                  maxWidth: '90vw',
                  maxHeight: '85vh',
                  borderRadius: '10px',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <Image
                src={popup.url}
                alt={popup.alt || ''}
                width={
                  popup.width || 1000
                }
                height={
                  popup.height || 800
                }
                sizes="90vw"
                quality={85}
                className="popup-img"
                style={{
                  maxWidth: '90vw',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                }}
              />
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .subTabs {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 12px 0 24px;
          flex-wrap: wrap;
        }

        .subtab {
          background: #111;
          border: 1px solid #333;
          padding: 6px 14px;
          border-radius: 8px;
          color: #dcdcdc;
          cursor: pointer;
          font-family: 'Arima', serif;
          transition: 0.25s ease;
        }

        .subtab:hover {
          background: #222;
          border-color: #555;
        }

        .subtab.active {
          background: #ffd700;
          color: #000;
          font-weight: 600;
          border-color: #ffd700;
        }

        .gallery-status {
          max-width: 560px;
          margin: 48px auto;
          padding: 28px 22px;
          border: 1px solid
            rgba(255, 215, 0, 0.22);
          background: rgba(
            255,
            215,
            0,
            0.04
          );
          border-radius: 12px;
          text-align: center;
          font-family: 'Arima', serif;
        }

        .status-title {
          margin: 0 0 8px;
          color: #ffda6b;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .status-desc {
          margin: 0;
          color: #bfbfbf;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .retry-button {
          margin-top: 18px;
          padding: 8px 18px;
          border-radius: 8px;
          border: 1px solid #ffd700;
          background: #ffd700;
          color: #000;
          font-family: 'Arima', serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            opacity 0.2s ease;
        }

        .retry-button:hover {
          transform: translateY(-1px);
        }

        .retry-button:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .status-text,
        .gallery-end {
          margin: 24px auto;
          text-align: center;
          font-family: 'Arima', serif;
          font-size: 0.95rem;
        }

        .loading-text,
        .loading-more {
          color: #ffda6b;
        }

        .gallery-end {
          color: #8f8f8f;
        }

        .load-sentinel {
          width: 100%;
          height: 1px;
        }

        :global(.gallery-video-wrap) {
          width: 100%;
          overflow: hidden;
          border-radius: 10px;
          background: #111;
        }

        :global(.gallery-video) {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 10px;
          background: #111;
        }
      `}</style>

      <style jsx>{`
        .wrap {
          padding: 150px 16px 40px;
          color: #fff;
          background: #000;
          min-height: 100vh;
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
          font-size: clamp(
            3rem,
            7vw,
            9rem
          );
          font-weight: 500;
          margin-left: max(
            -20px,
            -1vw
          );
        }

        .catWrap {
          position: relative;
          max-width: 1200px;
          margin: 6px auto 20px;
          height: 44px;
        }

        .rail {
          position: relative;
          overflow-x: auto;
          overflow-y: hidden;
          height: 44px;
          scrollbar-width: none;
          -ms-overflow-style: none;
          cursor: grab;
          user-select: none;
          padding: 0 50px;
          mask-image: linear-gradient(
            to right,
            transparent 0,
            #000 40px,
            #000
              calc(100% - 40px),
            transparent 100%
          );
        }

        .rail::-webkit-scrollbar {
          display: none;
        }

        .rail.dragging {
          cursor: grabbing;
        }

        .track {
          position: relative;
          display: flex;
          align-items: center;
          gap: clamp(
            14px,
            3vw,
            28px
          );
          height: 44px;
          white-space: nowrap;
          width: max-content;
        }

        .tab {
          background: transparent;
          border: 0;
          color: #d8d8d8;
          font-size: clamp(
            14px,
            2vw,
            16px
          );
          cursor: pointer;
          font-family: 'Arima', serif;
          padding: 6px 2px;
          transition:
            color 0.25s ease,
            transform 0.25s ease;
        }

        .tab:hover {
          color: #fff;
          transform: translateY(-1px);
        }

        .tab.active {
          color: #ffda6b;
        }

        .underline {
          position: absolute;
          height: 2px;
          background: #ffda6b;
          bottom: 0;
          left: 0;
          transition:
            transform 0.35s ease,
            width 0.35s ease;
        }

        .arrow {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 38px;
          font-family: 'Arima', serif;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(
            0,
            0,
            0,
            0.75
          );
          color: #e9c572;
          border: 1px solid
            #e9c57240;
          border-radius: 10px;
          z-index: 5;
          cursor: pointer;
          transition:
            background 0.2s ease,
            opacity 0.2s ease;
        }

        .arrow:hover {
          background: #111;
        }

        .arrow:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .arrow.left {
          left: 0;
        }

        .arrow.right {
          right: 0;
        }

        .masonry {
          column-count: 1;
          column-gap: 14px;
          max-width: 1200px;
          margin: 0 auto;
          opacity: 1;
          transition: opacity
            0.25s ease;
        }

        @media (min-width: 700px) {
          .masonry {
            column-count: 2;
          }
        }

        @media (min-width: 1100px) {
          .masonry {
            column-count: 3;
          }
        }

        .fade-out {
          opacity: 0;
        }

        .fade-in {
          opacity: 1;
        }

        .card {
          break-inside: avoid;
          display: block;
          margin: 0 0 14px;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          transition: transform
            0.25s ease;
          background: #111;
        }

        .card:hover {
          transform: scale(1.02);
        }

        .card :global(img) {
          width: 100%;
          height: auto;
          display: block;
          background: #111;
          border-radius: 10px;
        }

        .popup {
          position: fixed;
          inset: 0;
          background: rgba(
            0,
            0,
            0,
            0.8
          );
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .popup-inner {
          position: relative;
          max-width: 90vw;
          max-height: 85vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .popup-img {
          width: auto;
          height: auto;
          max-width: 90vw;
          max-height: 85vh;
          border-radius: 10px;
        }

        .close {
          position: absolute;
          top: -36px;
          right: -36px;
          font-size: 36px;
          color: #ffda6b;
          background: none;
          border: none;
          cursor: pointer;
          transition: transform
            0.2s ease;
        }

        .close:hover {
          transform: scale(1.2);
        }
      `}</style>
    </section>
  )
}