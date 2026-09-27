'use client'

import { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { View } from '@/lib/types'
import { HOME_VIEW, pathSegments, pathView, viewPath } from '@/data/navigation'

/**
 * Navigation.
 *
 * The path is the single source of truth for the current view — there is no
 * store to lose on refresh, so reloads, deep links, the browser back button and
 * shared URLs all land on the right page. `app/[[...slug]]/page.tsx` reads the
 * same path, which keeps the server render and the client in agreement.
 */

/** The view the current path resolves to, or `null` for an unknown path. */
export function useView(): View | null {
  const pathname = usePathname()
  return pathView(pathSegments(pathname))
}

/**
 * Navigate to a view. `push` by default so Back returns to the previous page;
 * pass `{ replace: true }` to avoid stacking an entry.
 */
export function useNavigate() {
  const router = useRouter()
  return useCallback(
    (view: View, options?: { replace?: boolean }) => {
      const path = viewPath(view)
      if (options?.replace) router.replace(path)
      else router.push(path)
    },
    [router]
  )
}

/** Go back one entry in the browser history, falling back to the home page. */
export function useBack() {
  const router = useRouter()
  return useCallback(() => {
    if (window.history.length > 1) router.back()
    else router.replace(viewPath(HOME_VIEW))
  }, [router])
}
