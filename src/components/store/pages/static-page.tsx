'use client'

import {
  ChevronRight,
  HandHeart,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { useNavStore } from '@/store/nav-store'
import { formatEUR, EXPRESS_SHIPPING, STANDARD_SHIPPING } from '@/lib/format'
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

type PageSlug = 'shipping' | 'about' | 'faq'

const PAGE_META: Record<PageSlug, { title: string; subtitle: string }> = {
  shipping: {
    title: 'Shipping & Returns',
    subtitle:
      'Everything about dispatch times, shipping costs and returning an order — no fine print, no surprises.',
  },
  about: {
    title: 'About FUELD',
    subtitle:
      'A small, curated supplement store for people who train — built on products we actually use ourselves.',
  },
  faq: {
    title: 'FAQ',
    subtitle:
      'Quick answers on delivery, whey choice, mixing, creatine and returns. Anything else — just ask.',
  },
}

/* ── Shipping & Returns ──────────────────────────────────────────────── */

function ShippingPageContent() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-extrabold text-zinc-900">
            Shipping costs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="text-right">Delivery time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-zinc-900">Standard</TableCell>
                <TableCell>{formatEUR(STANDARD_SHIPPING)}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  2–4 business days
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-zinc-900">Express</TableCell>
                <TableCell>{formatEUR(EXPRESS_SHIPPING)}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  Next business day
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-zinc-900">
                  Standard, orders over {formatEUR(59)}
                </TableCell>
                <TableCell className="font-bold text-primary">FREE</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  2–4 business days
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-extrabold text-zinc-900">
            Dispatch
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-zinc-600">
          <p>
            Orders placed before 14:00 (Mon–Fri) leave our warehouse within 24
            hours. You&rsquo;ll receive a tracking link by email the moment your
            parcel is handed to the carrier — usually DHL, sometimes DPD for
            express shipments.
          </p>
          <p>
            Standard delivery takes 2–4 business days within Germany, Austria and
            Switzerland. Express orders placed before 14:00 arrive the next
            business day. Shipping is free on standard orders over {formatEUR(59)}.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-extrabold text-zinc-900">
            Returns &amp; Right of Withdrawal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-zinc-600">
          <p>
            You have 30 days from delivery to withdraw from your purchase — no
            questions asked. For hygiene reasons, food supplements must be
            unopened and sealed in their original packaging to be eligible for a
            full refund.
          </p>
          <div>
            <p className="mb-2 font-semibold text-zinc-900">How to return:</p>
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>
                Email{' '}
                <span className="font-medium text-zinc-900">
                  returns@fueld.store
                </span>{' '}
                with your order number (FD-XXXX) and the items you&rsquo;re
                sending back — we&rsquo;ll reply with a return label.
              </li>
              <li>
                Pack the products unused and sealed, ideally in their original
                shipping box.
              </li>
              <li>
                Drop the parcel at any carrier point — we refund the full purchase
                amount within 3–5 business days of it arriving back with us.
              </li>
            </ol>
          </div>
          <p className="text-xs text-muted-foreground">
            Note: exercising your Right of Withdrawal also cancels any loyalty
            points earned on the affected order.
          </p>
        </CardContent>
      </Card>
    </>
  )
}

/* ── About ───────────────────────────────────────────────────────────── */

const ABOUT_VALUES = [
  {
    icon: ShieldCheck,
    title: 'Lab-tested quality',
    text: 'Every batch we stock is third-party lab-tested for purity and label accuracy. Certificates on request.',
  },
  {
    icon: Zap,
    title: 'Fast dispatch',
    text: 'Orders before 14:00 ship within 24 hours — because your next session won\u2019t wait.',
  },
  {
    icon: HandHeart,
    title: 'Honest advice',
    text: 'We tell you what you need — and what you don\u2019t. No hype stacks, no upsell nonsense.',
  },
] as const

function AboutPageContent() {
  const navigate = useNavStore((s) => s.navigate)

  return (
    <>
      <div className="space-y-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
        <p>
          FUELD started in a small gym basement with a simple frustration:
          supplement shops that stock 300 products and understand maybe five of
          them. We do the opposite. We curate a tight range of sports nutrition
          that we use ourselves, stand behind completely, and can actually advise
          on.
        </p>
        <p>
          We&rsquo;re an official ESN dealer, which means every tub ships fresh
          from the German production facility — full batches, real best-before
          dates, no grey-market import guesswork. And we test what we sell:
          third-party lab analyses, our own mixability checks, and honest tasting
          notes from the team.
        </p>
        <p>
          Our assortment is whey-first by design. Protein is the foundation of
          every training goal, so that&rsquo;s where we go deepest — flavors,
          sizes, isolates, vegan alternatives — with creatine, amino acids and
          accessories rounded out as sensible support.
        </p>
      </div>

      <blockquote className="border-l-2 border-primary pl-4 text-base font-semibold italic leading-relaxed text-zinc-900 sm:text-lg">
        &ldquo;We&rsquo;d rather do 11 products brilliantly than 300 mediocre
        ones.&rdquo;
      </blockquote>

      <ul className="space-y-4" aria-label="What FUELD stands for">
        {ABOUT_VALUES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="size-5 text-primary" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold text-zinc-900">{title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-zinc-600">{text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-xl bg-zinc-900 p-6 sm:p-8">
        <h2 className="text-xl font-extrabold text-white">Ready to fuel up?</h2>
        <p className="mt-1.5 text-sm text-zinc-400">
          Start where every serious stack starts — with a whey you&rsquo;ll
          actually enjoy drinking every day.
        </p>
        <Button
          onClick={() => navigate({ name: 'category', slug: 'protein' })}
          className="mt-5 h-11 font-bold"
        >
          Shop whey protein
        </Button>
      </div>
    </>
  )
}

/* ── FAQ ─────────────────────────────────────────────────────────────── */

const FAQ_ITEMS = [
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 2–4 business days, express orders arrive the next business day if placed before 14:00. You get a tracking link by email as soon as your parcel ships.',
  },
  {
    q: 'When do I get free shipping?',
    a: 'Standard shipping is free on orders over €59 (after discounts) — below that it\u2019s €4.90. Express is always €9.90 regardless of order value.',
  },
  {
    q: 'Which whey is right for me — cutting or bulking?',
    a: 'For cutting, go with Isoclear: it\u2019s an isolate with minimal carbs and fat and sits light on the stomach. For bulking, Designer Whey is our pick — richer taste, easy to mix into shakes, oats or porridge for extra calories.',
  },
  {
    q: 'There are so many flavors — how do I choose?',
    a: 'Start with the classics: Vanilla and Chocolate are the crowd favorites for a reason. If you\u2019re torn, grab the Sample Box — it packs small sachets of the top flavors so you can test before committing to a full tub.',
  },
  {
    q: 'How do I mix whey properly?',
    a: 'One level scoop (30 g) with 300 ml of water or milk in a shaker, shake for 10–15 seconds and you\u2019re done. Post-workout is ideal, but honestly, anytime you fall short on protein works.',
  },
  {
    q: 'Is creatine safe — and should I take it daily?',
    a: 'Yes, creatine monohydrate is one of the most researched supplements in sports nutrition. Take 3–5 g every day, rest days included — no loading phase needed, just stay hydrated.',
  },
  {
    q: 'Do you offer subscriptions?',
    a: 'It\u2019s in the works! Subscribe to our newsletter and you\u2019ll be the first to know when it launches. Until then, our bundles are the best way to save on your regular stack.',
  },
  {
    q: 'What\u2019s your return policy?',
    a: 'You have 30 days to return unopened, sealed products for a full refund — it\u2019s your statutory Right of Withdrawal. Email returns@fueld.store with your order number and we\u2019ll sort you out; refunds land within 3–5 business days of arrival.',
  },
] as const

function FaqPageContent() {
  return (
    <Card>
      <CardContent className="px-6">
        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
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

export function StaticPage({ slug }: { slug: PageSlug }) {
  const navigate = useNavStore((s) => s.navigate)
  const { title, subtitle } = PAGE_META[slug]

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex items-center gap-1.5 text-xs"
      >
        <button
          type="button"
          onClick={() => navigate({ name: 'home' })}
          className="font-medium text-zinc-500 transition-colors hover:text-primary"
        >
          Home
        </button>
        <ChevronRight className="size-3 text-zinc-400" aria-hidden />
        <span className="font-semibold text-zinc-900" aria-current="page">
          {title}
        </span>
      </nav>

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
