'use client'

import { NOT_FOUND_COPY } from '@/data/copy/states'
import { useNavigate } from '@/hooks/use-nav'
import { HOME_VIEW } from '@/data/navigation'
import { EmptyState } from '@/core/state-view'

/** Shown for a path that is not a storefront route, e.g. a stale bookmark. */
export function NotFoundView() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <EmptyState
        icon={NOT_FOUND_COPY.icon}
        title={NOT_FOUND_COPY.title}
        body={NOT_FOUND_COPY.body}
        actions={[
          { label: NOT_FOUND_COPY.backToHome, onSelect: () => navigate(HOME_VIEW) },
        ]}
      />
    </div>
  )
}
