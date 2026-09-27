/** Copy for the three client-routed static pages: shipping, about and FAQ. */

import {
  EXPRESS_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING,
  type MoneyFormat,
} from '../commerce'
import { SITE } from '../site'
import type { StaticPageSlug } from '../navigation'

export const PAGE_META: Record<StaticPageSlug, { title: string; subtitle: string }> = {
  shipping: {
    title: 'Shipping & Returns',
    subtitle:
      'Everything about dispatch times, shipping costs and returning an order — no fine print, no surprises.',
  },
  about: {
    title: `About ${SITE.name}`,
    subtitle:
      'A small, curated supplement store for people who train — built on products we actually use ourselves.',
  },
  faq: {
    title: 'FAQ',
    subtitle:
      'Quick answers on delivery, whey choice, mixing, creatine and returns. Anything else — just ask.',
  },
}

export const PAGE_CHROME_COPY = {
  breadcrumbAriaLabel: 'Breadcrumb',
  breadcrumbHome: 'Home',
  valuesAriaLabel: `What ${SITE.name} stands for`,
  /** Long-enough slice used to build stable React keys from prose blocks. */
  paragraphKeyLength: 24,
} as const

export const SHIPPING_PAGE_COPY = {
  costsTitle: 'Shipping costs',
  tableAriaLabel: 'Shipping costs',
  columns: { method: 'Method', cost: 'Cost', delivery: 'Delivery time' },
  freeRowLabel: (threshold: string) => `Standard, orders over ${threshold}`,
  freeLabel: 'FREE',
  dispatchTitle: 'Dispatch',
  dispatchParagraphs: (money: MoneyFormat) => [
    'Orders placed before 14:00 (Mon–Fri) leave our warehouse within 24 hours. You’ll receive a tracking link by email the moment your parcel is handed to the carrier — usually DHL, sometimes DPD for express shipments.',
    `Standard delivery takes 2–4 business days within Germany, Austria and Switzerland. Express orders placed before 14:00 arrive the next business day. Shipping is free on standard orders over ${money(FREE_SHIPPING_THRESHOLD)}.`,
  ],
  returnsTitle: 'Returns & Right of Withdrawal',
  returnsIntro:
    'You have 30 days from delivery to withdraw from your purchase — no questions asked. For hygiene reasons, food supplements must be unopened and sealed in their original packaging to be eligible for a full refund.',
  returnsHowTo: 'How to return:',
  returnsSteps: [
    `Email ${SITE.returnsEmail} with your order number (FD-XXXX) and the items you’re sending back — we’ll reply with a return label.`,
    'Pack the products unused and sealed, ideally in their original shipping box.',
    'Drop the parcel at any carrier point — we refund the full purchase amount within 3–5 business days of it arriving back with us.',
  ],
  returnsNote:
    'Note: exercising your Right of Withdrawal also cancels any loyalty points earned on the affected order.',
} as const

export const ABOUT_PAGE_COPY = {
  paragraphs: [
    'FUELD started in a small gym basement with a simple frustration: supplement shops that stock 300 products and understand maybe five of them. We do the opposite. We curate a tight range of sports nutrition that we use ourselves, stand behind completely, and can actually advise on.',
    'We’re an official ESN dealer, which means every tub ships fresh from the German production facility — full batches, real best-before dates, no grey-market import guesswork. And we test what we sell: third-party lab analyses, our own mixability checks, and honest tasting notes from the team.',
    'Our assortment is whey-first by design. Protein is the foundation of every training goal, so that’s where we go deepest — flavors, sizes, isolates, vegan alternatives — with creatine, amino acids and accessories rounded out as sensible support.',
  ],
  quote: 'We’d rather do 11 products brilliantly than 300 mediocre ones.',
  values: [
    {
      icon: 'shield-check',
      title: 'Lab-tested quality',
      text: 'Every batch we stock is third-party lab-tested for purity and label accuracy. Certificates on request.',
    },
    {
      icon: 'zap',
      title: 'Fast dispatch',
      text: 'Orders before 14:00 ship within 24 hours — because your next session won’t wait.',
    },
    {
      icon: 'hand-heart',
      title: 'Honest advice',
      text: 'We tell you what you need — and what you don’t. No hype stacks, no upsell nonsense.',
    },
  ] as { icon: import('../icons').IconName; title: string; text: string }[],
  ctaTitle: 'Ready to fuel up?',
  ctaBody:
    'Start where every serious stack starts — with a whey you’ll actually enjoy drinking every day.',
  ctaLabel: 'Shop whey protein',
} as const

export const FAQ_COPY = {
  ariaLabel: 'Frequently asked questions',
  items: (money: MoneyFormat) => [
    {
      q: 'How long does delivery take?',
      a: 'Standard delivery takes 2–4 business days, express orders arrive the next business day if placed before 14:00. You get a tracking link by email as soon as your parcel ships.',
    },
    {
      q: 'When do I get free shipping?',
      a: `Standard shipping is free on orders over ${money(FREE_SHIPPING_THRESHOLD)} (after discounts) — below that it’s ${money(STANDARD_SHIPPING)}. Express is always ${money(EXPRESS_SHIPPING)} regardless of order value.`,
    },
    {
      q: 'Which whey is right for me — cutting or bulking?',
      a: 'For cutting, go with Isoclear: it’s an isolate with minimal carbs and fat and sits light on the stomach. For bulking, Designer Whey is our pick — richer taste, easy to mix into shakes, oats or porridge for extra calories.',
    },
    {
      q: 'There are so many flavors — how do I choose?',
      a: 'Start with the classics: Vanilla and Chocolate are the crowd favorites for a reason. If you’re torn, grab the Sample Box — it packs small sachets of the top flavors so you can test before committing to a full tub.',
    },
    {
      q: 'How do I mix whey properly?',
      a: 'One level scoop (30 g) with 300 ml of water or milk in a shaker, shake for 10–15 seconds and you’re done. Post-workout is ideal, but honestly, anytime you fall short on protein works.',
    },
    {
      q: 'Is creatine safe — and should I take it daily?',
      a: 'Yes, creatine monohydrate is one of the most researched supplements in sports nutrition. Take 3–5 g every day, rest days included — no loading phase needed, just stay hydrated.',
    },
    {
      q: 'Do you offer subscriptions?',
      a: 'It’s in the works! Subscribe to our newsletter and you’ll be the first to know when it launches. Until then, our bundles are the best way to save on your regular stack.',
    },
    {
      q: 'What’s your return policy?',
      a: `You have 30 days to return unopened, sealed products for a full refund — it’s your statutory Right of Withdrawal. Email ${SITE.returnsEmail} with your order number and we’ll sort you out; refunds land within 3–5 business days of arrival.`,
    },
  ] as { q: string; a: string }[],
  itemValuePrefix: 'faq-',
} as const
