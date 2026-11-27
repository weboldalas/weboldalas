import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// The CRM can run on its own subdomain (e.g. crm.weboldalas.hu). Set CRM_HOST in Vercel to enable it.
const CRM_HOST = process.env.CRM_HOST?.trim().toLowerCase() || null
const CRM_PATHS = ['/dashboard', '/leads', '/customers', '/partners', '/invoices', '/projects', '/payments', '/subscriptions', '/tasks', '/settings', '/offers', '/contracts', '/portal', '/login']

function crmHostRedirect(request: NextRequest) {
  if (!CRM_HOST) return null
  const host = (request.headers.get('host') ?? '').toLowerCase().split(':')[0]
  const { pathname, search } = request.nextUrl
  if (host === CRM_HOST) {
    // The bare CRM domain opens the app, not the marketing homepage.
    if (pathname === '/') return NextResponse.redirect(new URL('/dashboard', request.url))
    return null
  }
  // On the marketing domain, send CRM pages to the CRM domain. Share links (/offers/view, /contracts/view)
  // keep working on both, so links already sent to partners never break. Preview deployments are left alone.
  const isMarketingHost = host === 'weboldalas.hu' || host === 'www.weboldalas.hu'
  const isShareLink = pathname.startsWith('/offers/view/') || pathname.startsWith('/contracts/view/')
  if (isMarketingHost && !isShareLink && CRM_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.redirect(`https://${CRM_HOST}${pathname}${search}`, 308)
  }
  return null
}

export async function updateSession(request: NextRequest) {
  const hostRedirect = crmHostRedirect(request)
  if (hostRedirect) return hostRedirect

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect admin routes
  const pathname = request.nextUrl.pathname
  const isAdminRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/leads') ||
    pathname.startsWith('/customers') ||
    pathname.startsWith('/partners') ||
    pathname.startsWith('/invoices') ||
    pathname.startsWith('/projects') ||
    pathname.startsWith('/portal') ||
    pathname.startsWith('/payments') ||
    pathname.startsWith('/subscriptions') ||
    pathname.startsWith('/tasks') ||
    pathname.startsWith('/settings') ||
    (pathname.startsWith('/offers') && !pathname.startsWith('/offers/view/')) ||
    // public share links (/offers/view/…, /contracts/view/…) open without login; they are token-protected
    (pathname.startsWith('/contracts') && !pathname.startsWith('/contracts/view/'))
  const isPublic = !isAdminRoute

  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in, and tries to go to login page, redirect to dashboard
  if (user && request.nextUrl.pathname.startsWith('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
