import { NextResponse } from 'next/server'
import { dbConnect } from '@/app/libs/mongoose'
import { ImageModel } from '@/app/libs/Image'
import { isValidCategoryCode } from '@/app/libs/categories'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

const DEFAULT_LIMIT = 18
const MAX_LIMIT = 48

// GET /api/images?cat=PRINT_MEDIA&sub=Magazine&page=1&limit=18
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const rawCat = searchParams.get('cat')?.trim() || ''
    const rawSub = searchParams.get('sub')?.trim() || ''

    const requestedPage = Number.parseInt(
      searchParams.get('page') || '1',
      10
    )

    const requestedLimit = Number.parseInt(
      searchParams.get('limit') || String(DEFAULT_LIMIT),
      10
    )

    // Prevent invalid pagination values such as:
    // page=0, page=-1, page=abc, limit=9999
    const page =
      Number.isFinite(requestedPage) && requestedPage > 0
        ? requestedPage
        : 1

    const limit =
      Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, MAX_LIMIT)
        : DEFAULT_LIMIT

    const skip = (page - 1) * limit

    const query: Record<string, string> = {}

    // CATEGORY VALIDATION
    if (rawCat) {
      if (!isValidCategoryCode(rawCat)) {
        return NextResponse.json(
          {
            ok: false,
            error: 'Invalid category',
            items: [],
            total: 0,
            page,
            limit,
            pages: 0,
            hasMore: false,
          },
          {
            status: 400,
            headers: {
              'Cache-Control': 'no-store, max-age=0',
            },
          }
        )
      }

      query.category = rawCat
    }

    // SUBCATEGORY FILTER
    if (rawSub) {
      query.subcategory = rawSub
    }

    await dbConnect()

    const [items, total] = await Promise.all([
      ImageModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      ImageModel.countDocuments(query),
    ])

    const pages = Math.ceil(total / limit)
    const hasMore = page < pages

    return NextResponse.json(
      {
        ok: true,
        items,
        total,
        page,
        limit,
        pages,
        hasMore,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (err: unknown) {
    console.error('Public images GET error:', err)

    return NextResponse.json(
      {
        ok: false,
        error: 'Gallery is currently unavailable. Please try again shortly.',
        items: [],
        total: 0,
        page: 1,
        limit: DEFAULT_LIMIT,
        pages: 0,
        hasMore: false,
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  }
}