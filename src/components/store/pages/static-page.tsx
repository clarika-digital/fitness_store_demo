'use client'

import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_METHODS,
} from '@/data/commerce'
import { HERO_CATEGORY_SLUG } from '@/data/categories'
import { BREADCRUMB_COPY } from '@/data/copy/chrome'
import {
  ABOUT_PAGE_COPY,
  FAQ_COPY,
  PAGE_CHROME_COPY,
  PAGE_META,
  SHIPPING_PAGE_COPY,
} from '@/data/copy/pages'
import { useNavigate } from '@/hooks/use-nav'
import { useMoney } from '@/hooks/use-money'
import { BreadcrumbNav, Icon } from '@/core'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

/** Built per render so the amounts follow the shopper's selected locale. */
const shippingCostRows = (money: (value: number) => string) => [
  ...SHIPPING_METHODS.map((method) => ({
    label: method.label,
    cost: money(method.cost),
    delivery: method.description,
    isFree: false,
  })),
  {
    label: SHIPPING_PAGE_COPY.freeRowLabel(money(FREE_SHIPPING_THRESHOLD)),
    cost: SHIPPING_PAGE_COPY.freeLabel,
    delivery: SHIPPING_METHODS[0].description,
    isFree: true,
  },
]

/* ── Shipping & Returns ──────────────────────────────────────────────── */

function ShippingPageContent() {
  const money = useMoney()
  const rows = shippingCostRows(money)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-extrabold text-zinc-900">
            {SHIPPING_PAGE_COPY.costsTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table aria-label={SHIPPING_PAGE_COPY.tableAriaLabel}>
            <TableHeader>
              <TableRow>
                <TableHead>{SHIPPING_PAGE_COPY.columns.method}</TableHead>
                <TableHead>{SHIPPING_PAGE_COPY.columns.cost}</TableHead>
                <TableHead className="text-right">
                  {SHIPPING_PAGE_COPY.columns.delivery}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="font-medium text-zinc-900">{row.label}</TableCell>
                  <TableCell
                    className={row.isFree ? 'font-bold text-primary' : undefined}
                  >
                    {row.cost}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {row.delivery}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-extrabold text-zinc-900">
            {SHIPPING_PAGE_COPY.dispatchTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-zinc-600">
          {SHIPPING_PAGE_COPY.dispatchParagraphs(money).map((paragraph) => (
            <p key={paragraph.slice(0, PAGE_CHROME_COPY.paragraphKeyLength)}>
              {paragraph}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-extrabold text-zinc-900">
            {SHIPPING_PAGE_COPY.returnsTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-zinc-600">
          <p>{SHIPPING_PAGE_COPY.returnsIntro}</p>
          <div>
            <p className="mb-2 font-semibold text-zinc-900">
              {SHIPPING_PAGE_COPY.returnsHowTo}
            </p>
            <ol className="list-decimal space-y-1.5 pl-5">
              {SHIPPING_PAGE_COPY.returnsSteps.map((step) => (
                <li key={step.slice(0, PAGE_CHROME_COPY.paragraphKeyLength)}>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <p className="text-xs text-muted-foreground">
            {SHIPPING_PAGE_COPY.returnsNote}
          </p>
        </CardContent>
      </Card>
    </>
  )
}

/* ── About ───────────────────────────────────────────────────────────── */

function AboutPageContent() {
  const navigate = useNavigate()

  return (
    <>
      <div className="space-y-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
        {ABOUT_PAGE_COPY.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, PAGE_CHROME_COPY.paragraphKeyLength)}>
            {paragraph}
          </p>
        ))}
      </div>

      <blockquote className="border-l-2 border-primary pl-4 text-base font-semibold italic leading-relaxed text-zinc-900 sm:text-lg">
        {ABOUT_PAGE_COPY.quote}
      </blockquote>

      <ul className="space-y-4" aria-label={PAGE_CHROME_COPY.valuesAriaLabel}>
        {ABOUT_PAGE_COPY.values.map(({ icon, title, text }) => (
          <li key={title} className="flex items-start gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon name={icon} size={20} className="text-primary" />
            </span>
            <div>
              <p className="text-sm font-bold text-zinc-900">{title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-zinc-600">{text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-xl bg-zinc-900 p-6 sm:p-8">
        <h2 className="text-xl font-extrabold text-white">
          {ABOUT_PAGE_COPY.ctaTitle}
        </h2>
        <p className="mt-1.5 text-sm text-zinc-400">{ABOUT_PAGE_COPY.ctaBody}</p>
        <Button
          onClick={() => navigate({ name: 'category', slug: HERO_CATEGORY_SLUG })}
          className="mt-5 h-11 font-bold"
        >
          {ABOUT_PAGE_COPY.ctaLabel}
        </Button>
      </div>
    </>
  )
}

/* ── FAQ ─────────────────────────────────────────────────────────────── */

function FaqPageContent() {
  const money = useMoney()

  return (
    <Card>
      <CardContent className="px-6">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          aria-label={FAQ_COPY.ariaLabel}
        >
          {FAQ_COPY.items(money).map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`${FAQ_COPY.itemValuePrefix}${i}`}
            >
              <AccordionTrigger className="text-sm font-bold text-zinc-900 hover:text-primary sm:text-base">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-zinc-600">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

/* ── Shared chrome ───────────────────────────────────────────────────── */

export function StaticPage({ slug }: { slug: keyof typeof PAGE_META }) {
  const { title, subtitle } = PAGE_META[slug]

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <BreadcrumbNav
        items={[
          { label: BREADCRUMB_COPY.home, view: { name: 'home' } },
          { label: title },
        ]}
        className="mb-4"
      />

      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
        {subtitle}
      </p>

      <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
        {slug === 'shipping' && <ShippingPageContent />}
        {slug === 'about' && <AboutPageContent />}
        {slug === 'faq' && <FaqPageContent />}
      </div>
    </div>
  )
}
