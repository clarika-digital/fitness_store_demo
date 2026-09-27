/**
 * Seed script for the FUELD fitness supplement store.
 * Run: bun prisma/seed.ts
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  // wipe in FK-safe order
  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.newsletterSubscriber.deleteMany()
  await db.review.deleteMany()
  await db.flavor.deleteMany()
  await db.size.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()

  const cat = (
    slug: string,
    name: string,
    description: string,
    order: number,
    isHero = false,
    icon?: string,
    image?: string
  ) =>
    db.category.create({
      data: { slug, name, description, order, isHero, icon, image },
    })

  const protein = await cat(
    'protein',
    'Protein',
    'Whey protein, isolates & vegan blends — the foundation of every training goal. Highest quality, fully soluble, insane flavor range.',
    0,
    true,
    'Dumbbell',
    '/images/products/designer-whey.png'
  )
  const preworkout = await cat(
    'pre-workout',
    'Pre-Workout',
    'Booster and pump supplements for maximum focus, energy and training performance.',
    1,
    false,
    'Zap',
    '/images/products/ultra-booster.png'
  )
  const creatine = await cat(
    'creatine',
    'Creatine',
    'Creapure® creatine monohydrate — the most researched supplement in sports nutrition.',
    2,
    false,
    'Dumbbell',
    '/images/products/creatine.png'
  )
  const amino = await cat(
    'amino',
    'Amino Acids',
    'EAAs, citrulline and more — for recovery, pump and muscle protection.',
    3,
    false,
    'Activity',
    '/images/products/eaa.png'
  )
  const vitamins = await cat(
    'vitamins',
    'Vitamins & Health',
    'ZMA, minerals and micronutrients to cover your daily basics.',
    4,
    false,
    'ShieldCheck',
    '/images/products/zma.png'
  )
  const accessories = await cat(
    'accessories',
    'Accessories',
    'Shakers and everything around your shaker cup.',
    5,
    false,
    'GlassWater',
    '/images/products/shaker.png'
  )
  const bundles = await cat(
    'bundles',
    'Bundles & Sets',
    'Curated stacks at a better price — the easy way to start.',
    6,
    false,
    'Package',
    '/images/products/starter-bundle.png'
  )
  const equipment = await cat(
    'equipment',
    'Equipment',
    'Training gear that earns its place in the rack — bands, belts, sleeves and ropes.',
    7,
    false,
    'Dumbbell',
    '/images/products/resistance-bands.png'
  )

  type FlavorSeed = { name: string; color: string; inStock?: boolean; rating?: number; reviewCount?: number }
  type SizeSeed = { label: string; sublabel?: string; price: number; comparePrice?: number; servings?: number; popular?: boolean }
  type ReviewSeed = { author: string; rating: number; flavor?: string; title: string; text: string }

  const product = async (data: {
    slug: string
    name: string
    brand: string
    categoryId: string
    tagline: string
    description: string
    usage?: string
    image: string
    badges?: string[]
    nutrition?: { label: string; value: string }[]
    rating: number
    reviewCount: number
    isBestseller?: boolean
    isFeatured?: boolean
    sortOrder: number
    flavors?: FlavorSeed[]
    sizes: SizeSeed[]
    reviews?: ReviewSeed[]
  }) => {
    const { flavors, sizes, reviews, badges, nutrition, ...rest } = data
    const p = await db.product.create({
      data: {
        ...rest,
        badges: JSON.stringify(badges ?? []),
        nutrition: nutrition ? JSON.stringify({ rows: nutrition }) : null,
        flavors: { create: (flavors ?? []).map((f, i) => ({ ...f, sortOrder: i })) },
        sizes: { create: sizes.map((s, i) => ({ ...s, sortOrder: i })) },
      },
    })
    if (reviews?.length) {
      await db.review.createMany({
        data: reviews.map((r) => ({ ...r, productId: p.id })),
      })
    }
    return p
  }

  // ─────────────────────────── PROTEIN ───────────────────────────

  await product({
    slug: 'esn-designer-whey',
    name: 'Designer Whey',
    brand: 'ESN',
    categoryId: protein.id,
    tagline: 'The #1 whey protein — 76% protein, perfectly soluble, legendary flavor range.',
    description:
      'Designer Whey is ESN\u2019s flagship whey concentrate and one of the best-selling protein powders in Europe. It delivers 76% high-quality whey protein per serving, mixes instantly with water or low-fat milk without clumping, and comes in one of the widest flavor ranges on the market \u2014 from classic Chocolate Shake to Cinnamon Cereal. Every batch is produced in Germany under strict quality standards and regularly lab-tested. If you want one protein that covers muscle building, recovery and everyday protein needs, this is it.',
    usage:
      'Mix one 30 g scoop with 300 ml water or low-fat milk. Ideal after training or any time of day when you need extra protein.',
    image: '/images/products/designer-whey.png',
    badges: ['Bestseller', '#1 Whey'],
    rating: 4.8,
    reviewCount: 2841,
    isBestseller: true,
    isFeatured: true,
    sortOrder: 0,
    flavors: [
      { name: 'Vanilla Shake', color: '#f0e3c0', rating: 4.8, reviewCount: 604 },
      { name: 'Chocolate Shake', color: '#5a3a26', rating: 4.9, reviewCount: 812 },
      { name: 'Strawberry Shake', color: '#e86a75', rating: 4.7, reviewCount: 388 },
      { name: 'Cookies & Cream', color: '#4a4038', rating: 4.8, reviewCount: 521 },
      { name: 'Banana Shake', color: '#f0c95c', rating: 4.6, reviewCount: 214 },
      { name: 'Salted Caramel', color: '#c68a3f', rating: 4.8, reviewCount: 297 },
      { name: 'Hazelnut', color: '#7a5230', rating: 4.7, reviewCount: 186 },
      { name: 'Mango', color: '#f5a04a', inStock: false, rating: 4.5, reviewCount: 98 },
    ],
    sizes: [
      { label: '1 kg', sublabel: '33 servings', price: 29.9, comparePrice: 34.9, servings: 33 },
      { label: '2.5 kg', sublabel: '83 servings', price: 64.9, comparePrice: 74.9, servings: 83, popular: true },
    ],
    nutrition: [
      { label: 'Energy', value: '1531 kJ / 366 kcal' },
      { label: 'Fat', value: '5.5 g' },
      { label: 'of which saturates', value: '2.1 g' },
      { label: 'Carbohydrates', value: '4.5 g' },
      { label: 'of which sugars', value: '3.2 g' },
      { label: 'Protein', value: '76 g' },
      { label: 'Salt', value: '0.48 g' },
    ],
    reviews: [
      {
        author: 'Jonas M.',
        rating: 5,
        flavor: 'Chocolate Shake',
        title: 'Mixes perfectly, tastes incredible',
        text: 'Been ordering this for two years now. Zero clumps in a shaker, even with just water. Chocolate is rich but not too sweet \u2014 my benchmark for every other whey.',
      },
      {
        author: 'Lisa K.',
        rating: 5,
        flavor: 'Vanilla Shake',
        title: 'Best vanilla on the market',
        text: 'I\u2019ve tried six brands and always come back to Designer Whey. Vanilla tastes like actual vanilla, not like sweetener. Also easy on my stomach.',
      },
      {
        author: 'Markus T.',
        rating: 5,
        flavor: 'Cookies & Cream',
        title: 'Dangerously good',
        text: 'Cookies & Cream is a dessert in a shaker. Macros are on point and the 2.5 kg bag lasts me almost two months.',
      },
      {
        author: 'Sandra B.',
        rating: 4,
        flavor: 'Salted Caramel',
        title: 'Great, slightly sweet',
        text: 'Flavor and solubility are excellent. Salted Caramel is a touch too sweet for me personally, but quality is unbeatable for the price.',
      },
      {
        author: 'Daniel R.',
        rating: 5,
        flavor: 'Chocolate Shake',
        title: 'My daily driver since 2021',
        text: '76g protein per 100g at this price \u2014 no competitor comes close. Digestion is great, no bloating, and delivery is always fast.',
      },
      {
        author: 'Anna W.',
        rating: 5,
        flavor: 'Strawberry Shake',
        title: 'Actually tastes like strawberries',
        text: 'Not that artificial bubblegum taste you get elsewhere. Mixes clean with milk and water. Will reorder.',
      },
      {
        author: 'Tobias H.',
        rating: 5,
        flavor: 'Banana Shake',
        title: 'Reliable quality',
        text: 'Third bag in a row. Same taste every time \u2014 consistency is what keeps me here.',
      },
      {
        author: 'Elena S.',
        rating: 4,
        flavor: 'Hazelnut',
        title: 'Solid, great value',
        text: 'Hazelnut is subtle and nice with milk. I wish there were smaller trial sizes, but the sample box solved that.',
      },
    ],
  })

  await product({
    slug: 'esn-isoclear',
    name: 'Isoclear',
    brand: 'ESN',
    categoryId: protein.id,
    tagline: 'Crystal-clear whey isolate — refreshes like juice, 82% protein, lactose-free.',
    description:
      'Isoclear turns whey isolate into a refreshing, crystal-clear drink instead of a creamy shake. With 82% protein, virtually no fat or sugar and no lactose, it\u2019s the leanest way to hit your protein target \u2014 perfect post-workout or on hot training days. Fruity flavors like Pineapple and Orange dissolve crystal-clear in water within seconds.',
    usage:
      'Mix one 30 g scoop with 500 ml cold water and shake briefly. Best enjoyed ice-cold after training.',
    image: '/images/products/isoclear.png',
    badges: ['Lactose-free', 'Low sugar'],
    rating: 4.7,
    reviewCount: 962,
    isBestseller: true,
    isFeatured: true,
    sortOrder: 1,
    flavors: [
      { name: 'Pineapple', color: '#f2d24b', rating: 4.8, reviewCount: 341 },
      { name: 'Orange', color: '#f28c28', rating: 4.7, reviewCount: 265 },
      { name: 'Cherry', color: '#b3324d', rating: 4.6, reviewCount: 184 },
      { name: 'Cola-Lime', color: '#5c6b3c', rating: 4.7, reviewCount: 121 },
      { name: 'Elderflower', color: '#dbe4c9', rating: 4.6, reviewCount: 51 },
    ],
    sizes: [{ label: '1 kg', sublabel: '33 servings', price: 34.9, comparePrice: 39.9, servings: 33 }],
    nutrition: [
      { label: 'Energy', value: '1442 kJ / 344 kcal' },
      { label: 'Fat', value: '0.9 g' },
      { label: 'of which saturates', value: '0.3 g' },
      { label: 'Carbohydrates', value: '1.2 g' },
      { label: 'of which sugars', value: '1.0 g' },
      { label: 'Protein', value: '82 g' },
      { label: 'Salt', value: '0.35 g' },
    ],
    reviews: [
      {
        author: 'Patrick L.',
        rating: 5,
        flavor: 'Pineapple',
        title: 'No more thick shakes in summer',
        text: 'Drinks like fruit juice with 25 g protein. Pineapple is my summer staple \u2014 genuinely refreshing.',
      },
      {
        author: 'Nina F.',
        rating: 4,
        flavor: 'Orange',
        title: 'Great alternative to creamy whey',
        text: 'Took a sip to get used to \u2014 it really is clear! Now I love it for post-workout. Slightly pricier than Designer Whey but worth it.',
      },
      {
        author: 'Kevin D.',
        rating: 5,
        flavor: 'Cola-Lime',
        title: 'Lactose-free finally',
        text: 'My stomach can\u2019t handle regular whey. Isoclear works perfectly and tastes like a soft drink without the sugar.',
      },
    ],
  })

  await product({
    slug: 'esn-vegan-protein',
    name: 'Vegan Protein',
    brand: 'ESN',
    categoryId: protein.id,
    tagline: '100% plant-based pea & rice blend — smooth texture, complete amino profile.',
    description:
      'ESN Vegan Protein combines pea and rice protein into a complete amino acid profile with a genuinely smooth texture \u2014 no chalky mouthfeel. Free from soy, lactose and gluten, sweetened naturally, and surprisingly close to whey in taste.',
    usage: 'Mix one 30 g scoop with 300 ml water or plant-based drink.',
    image: '/images/products/vegan-protein.png',
    badges: ['Vegan', 'Soy-free'],
    rating: 4.6,
    reviewCount: 431,
    isFeatured: false,
    sortOrder: 2,
    flavors: [
      { name: 'Vanilla', color: '#f0e6c8', rating: 4.6, reviewCount: 154 },
      { name: 'Chocolate', color: '#4e3320', rating: 4.7, reviewCount: 168 },
      { name: 'Berry', color: '#a34a5e', rating: 4.5, reviewCount: 109 },
    ],
    sizes: [{ label: '1 kg', sublabel: '33 servings', price: 32.9, servings: 33 }],
    nutrition: [
      { label: 'Energy', value: '1615 kJ / 385 kcal' },
      { label: 'Fat', value: '7.1 g' },
      { label: 'of which saturates', value: '2.4 g' },
      { label: 'Carbohydrates', value: '8.5 g' },
      { label: 'of which sugars', value: '2.1 g' },
      { label: 'Protein', value: '68 g' },
      { label: 'Salt', value: '1.10 g' },
    ],
    reviews: [
      {
        author: 'Marta J.',
        rating: 5,
        flavor: 'Chocolate',
        title: 'Best vegan protein I\u2019ve had',
        text: 'Usually vegan proteins are chalky. This one mixes smooth and actually tastes good. finally a brand that gets it right.',
      },
      {
        author: 'Felix N.',
        rating: 4,
        flavor: 'Berry',
        title: 'Solid plant option',
        text: 'Not quite whey level, but for a plant protein it\u2019s excellent. Berry works great with oat milk.',
      },
    ],
  })

  // ───────────────────────── PRE-WORKOUT ─────────────────────────

  await product({
    slug: 'esn-ultra-booster',
    name: 'Ultra Booster',
    brand: 'ESN',
    categoryId: preworkout.id,
    tagline: 'High-dose pre-workout with 250 mg caffeine, citrulline and beta-alanine.',
    description:
      'Ultra Booster is the strong pre-workout for hard training sessions: 250 mg caffeine per serving, 6 g citrulline malate for pump, 3.2 g beta-alanine for endurance and choline for focus. One scoop 20\u201330 minutes before training and you\u2019re locked in.',
    usage:
      'Mix one 12.5 g scoop with 400 ml water, 20\u201330 minutes before training. Do not exceed one serving per day.',
    image: '/images/products/ultra-booster.png',
    badges: ['High caffeine'],
    rating: 4.7,
    reviewCount: 1120,
    isBestseller: true,
    sortOrder: 0,
    flavors: [
      { name: 'Fruit Punch', color: '#d94f4f', rating: 4.7, reviewCount: 486 },
      { name: 'Watermelon', color: '#e86a8a', rating: 4.8, reviewCount: 402 },
      { name: 'Green Apple', color: '#7aa843', rating: 4.6, reviewCount: 232 },
    ],
    sizes: [{ label: '350 g', sublabel: '28 servings', price: 34.9, servings: 28 }],
    nutrition: [
      { label: 'Energy', value: '295 kJ / 70 kcal' },
      { label: 'Carbohydrates', value: '16 g' },
      { label: 'of which sugars', value: '0.4 g' },
      { label: 'Caffeine (per 12.5 g serving)', value: '250 mg' },
      { label: 'Citrulline malate (per serving)', value: '6.0 g' },
      { label: 'Beta-alanine (per serving)', value: '3.2 g' },
    ],
    reviews: [
      {
        author: 'Ben O.',
        rating: 5,
        flavor: 'Fruit Punch',
        title: 'Clean energy, no crash',
        text: 'Kick-in after ~20 min, smooth focus without jitters. Fruit Punch tastes strong but good.',
      },
      {
        author: 'Jana P.',
        rating: 5,
        flavor: 'Watermelon',
        title: 'My PR booster',
        text: 'Hit a 5 kg bench PR the first week. The tingles from beta-alanine take getting used to \u2014 totally normal and harmless.',
      },
      {
        author: 'Chris V.',
        rating: 4,
        flavor: 'Green Apple',
        title: 'Strong stuff',
        text: 'Half a scoop is enough for me for evening sessions. Full scoop = not sleeping before 1 am. Works as advertised.',
      },
    ],
  })

  // ─────────────────────────── CREATINE ──────────────────────────

  await product({
    slug: 'esn-creatine-monohydrate',
    name: 'Creatine Monohydrate Creapure®',
    brand: 'ESN',
    categoryId: creatine.id,
    tagline: '100% Creapure® creatine monohydrate — the most researched supplement there is.',
    description:
      'ESN Creatine Monohydrate is made exclusively with Creapure® \u2014 the worldwide gold standard for creatine, produced in Germany. 5 g per day supports strength, power and muscle volume. Micronized for easy mixing, unflavored and versatile.',
    usage:
      'Take 5 g daily with plenty of fluid \u2014 timing doesn\u2019t matter, consistency does. Optional loading phase: 20 g/day for 5 days.',
    image: '/images/products/creatine.png',
    badges: ['Creapure®'],
    rating: 4.9,
    reviewCount: 1876,
    isBestseller: true,
    sortOrder: 0,
    flavors: [{ name: 'Neutral', color: '#d8d5d0', rating: 4.9, reviewCount: 1876 }],
    sizes: [{ label: '500 g', sublabel: '100 servings', price: 24.9, comparePrice: 27.9, servings: 100 }],
    nutrition: [{ label: 'Creatine monohydrate', value: '100 g' }],
    reviews: [
      {
        author: 'Marek S.',
        rating: 5,
        title: 'Creapure, no compromises',
        text: 'Dissolves fine in my post-workout shake, no grit. Strength gains after 4 weeks are noticeable. Creapure is worth the small premium.',
      },
      {
        author: 'Tom G.',
        rating: 5,
        title: 'Staple supplement',
        text: 'Cheapest effective supplement per performance gain. 500 g lasts forever at 5 g/day.',
      },
      {
        author: 'Ines R.',
        rating: 5,
        title: 'No bloating',
        text: 'Was skeptical about water retention \u2014 totally fine with this one. Great quality.',
      },
    ],
  })

  // ────────────────────────── AMINO ACIDS ────────────────────────

  await product({
    slug: 'esn-eaa-essentials',
    name: 'EAA Essentials',
    brand: 'ESN',
    categoryId: amino.id,
    tagline: 'All 9 essential amino acids — intra-workout fuel for recovery and muscle protection.',
    description:
      'EAA Essentials delivers all nine essential amino acids your body can\u2019t produce itself \u2014 including 8 g leucine-rich BCAAs per serving. Ideal as an intra-workout drink or between meals on training days.',
    usage: 'Mix one 10 g scoop with 500 ml water. Drink during training or throughout the day.',
    image: '/images/products/eaa.png',
    badges: ['Intra-workout'],
    rating: 4.7,
    reviewCount: 834,
    isBestseller: true,
    sortOrder: 0,
    flavors: [
      { name: 'Rainbow Candy', color: '#c05fd6', rating: 4.8, reviewCount: 366 },
      { name: 'Watermelon', color: '#ef6a8b', rating: 4.7, reviewCount: 271 },
      { name: 'Ice Tea Peach', color: '#f0a56b', rating: 4.6, reviewCount: 197 },
    ],
    sizes: [{ label: '500 g', sublabel: '50 servings', price: 29.9, servings: 50 }],
    nutrition: [
      { label: 'Energy (per 100 g)', value: '669 kJ / 158 kcal' },
      { label: 'L-Leucine (per 10 g serving)', value: '2.5 g' },
      { label: 'Total EAAs (per serving)', value: '9.4 g' },
      { label: 'Protein', value: '78 g' },
    ],
    reviews: [
      {
        author: 'Lea M.',
        rating: 5,
        flavor: 'Rainbow Candy',
        title: 'Tastes like childhood',
        text: 'Rainbow Candy is unreal. I sip it through every session and recover noticeably faster.',
      },
      {
        author: 'Ali K.',
        rating: 4,
        flavor: 'Ice Tea Peach',
        title: 'Good during cutting',
        text: 'Keeps me sane during fasted cardio. Ice Tea Peach is subtle and refreshing.',
      },
    ],
  })

  await product({
    slug: 'esn-citrulline-malate',
    name: 'L-Citrulline Malate',
    brand: 'ESN',
    categoryId: amino.id,
    tagline: '8 g citrulline malate per serving for maximum pump and blood flow.',
    description:
      'L-Citrulline Malate 2:1 boosts nitric oxide production, blood flow and the skin-splitting pump during training. Stack it with Ultra Booster or take it solo on pump-focused days. Neutral taste, mixes clear.',
    usage: 'Mix 10 g with 400 ml water, ~30 minutes before training.',
    image: '/images/products/citrulline.png',
    rating: 4.7,
    reviewCount: 542,
    sortOrder: 1,
    flavors: [{ name: 'Neutral', color: '#d8d5d0', rating: 4.7, reviewCount: 542 }],
    sizes: [{ label: '500 g', sublabel: '50 servings', price: 27.9, servings: 50 }],
    nutrition: [{ label: 'L-Citrulline malate (per 10 g serving)', value: '8.0 g' }],
    reviews: [
      {
        author: 'Sven A.',
        rating: 5,
        title: 'Veins on veins',
        text: 'Noticeably better pump than arginine. Stacks perfectly with the Ultra Booster.',
      },
    ],
  })

  // ─────────────────────────── VITAMINS ──────────────────────────

  await product({
    slug: 'esn-zma',
    name: 'ZMA',
    brand: 'ESN',
    categoryId: vitamins.id,
    tagline: 'Zinc, magnesium & vitamin B6 — for recovery, sleep quality and testosterone levels.',
    description:
      'ZMA combines zinc, magnesium and vitamin B6 in the classic study-backed ratio. Supports normal muscle function, reduces tiredness and contributes to normal protein synthesis \u2014 ideal before bed on hard training blocks.',
    usage: 'Take 3 capsules ~30 minutes before bed, on an empty stomach.',
    image: '/images/products/zma.png',
    badges: ['Before bed'],
    rating: 4.6,
    reviewCount: 298,
    sortOrder: 0,
    sizes: [{ label: '90 capsules', sublabel: '30 servings', price: 16.9, servings: 30 }],
    nutrition: [
      { label: 'Magnesium (per 3 capsules)', value: '450 mg' },
      { label: 'Zinc', value: '10 mg' },
      { label: 'Vitamin B6', value: '5.6 mg' },
    ],
    reviews: [
      {
        author: 'Robert E.',
        rating: 5,
        title: 'Better deep sleep',
        text: 'Sleep noticeably deeper on training days. Part of my nightly routine for a year now.',
      },
    ],
  })

  // ────────────────────────── ACCESSORIES ────────────────────────

  await product({
    slug: 'fueld-shaker',
    name: 'Fuel\u2019d Shaker 700 ml',
    brand: 'FUELD',
    categoryId: accessories.id,
    tagline: 'Leak-proof shaker with steel mixing ball — dishwasher-safe, BPA-free.',
    description:
      'The Fuel\u2019d Shaker holds 700 ml, seals absolutely leak-proof and comes with a stainless steel mixing ball for lump-free shakes. Matte black, BPA-free, dishwasher-safe \u2014 the last shaker you\u2019ll need this year.',
    image: '/images/products/shaker.png',
    badges: ['BPA-free'],
    rating: 4.8,
    reviewCount: 512,
    sortOrder: 0,
    sizes: [{ label: '700 ml', price: 9.9 }],
    reviews: [
      {
        author: 'Pia L.',
        rating: 5,
        title: 'Actually leak-proof',
        text: 'Tossed it in my gym bag sideways. Zero leaks. The steel ball mixes Designer Whey perfectly.',
      },
    ],
  })

  await product({
    slug: 'whey-sample-box',
    name: 'Whey Sample Box',
    brand: 'ESN',
    categoryId: accessories.id,
    tagline: '10 × 30 g sachets of our top Designer Whey flavors — find your flavor before committing.',
    description:
      'Can\u2019t decide on a flavor? The Whey Sample Box contains 10 single-serve sachets of the most popular Designer Whey flavors, including Chocolate Shake, Vanilla and Cookies & Cream. Perfect for finding your favorite \u2014 or for travel.',
    image: '/images/products/sample-box.png',
    badges: ['Perfect to start'],
    rating: 4.9,
    reviewCount: 1240,
    isBestseller: true,
    sortOrder: 1,
    sizes: [{ label: '10 × 30 g', sublabel: '10 flavors', price: 9.9, comparePrice: 14.9, servings: 10 }],
    reviews: [
      {
        author: 'Hannah D.',
        rating: 5,
        title: 'The smart way to start',
        text: 'Tested 10 flavors for under 10 bucks, then ordered 2.5 kg of my favorite. This box should be everyone\u2019s first purchase.',
      },
      {
        author: 'Yusuf B.',
        rating: 5,
        title: 'Great for travel too',
        text: 'Sachets fit perfectly in my carry-on. Genius idea.',
      },
    ],
  })

  // ─────────────────────────── BUNDLES ───────────────────────────

  await product({
    slug: 'whey-starter-bundle',
    name: 'Whey Starter Bundle',
    brand: 'ESN',
    categoryId: bundles.id,
    tagline: 'Designer Whey 1 kg + Fuel\u2019d Shaker — everything you need to start, €4.90 cheaper.',
    description:
      'The complete starter kit: 1 kg of ESN Designer Whey in your chosen flavor plus the leak-proof Fuel\u2019d Shaker. Everything a beginner needs \u2014 bundled €4.90 cheaper than buying separately.',
    usage: 'Mix one 30 g scoop with 300 ml water or milk in your new shaker.',
    image: '/images/products/starter-bundle.png',
    badges: ['Save €4.90', 'Bundle'],
    rating: 4.8,
    reviewCount: 356,
    isFeatured: true,
    isBestseller: true,
    sortOrder: 0,
    flavors: [
      { name: 'Chocolate Shake', color: '#5a3a26', rating: 4.9, reviewCount: 141 },
      { name: 'Vanilla Shake', color: '#f0e3c0', rating: 4.8, reviewCount: 122 },
      { name: 'Strawberry Shake', color: '#e86a75', rating: 4.7, reviewCount: 93 },
    ],
    sizes: [{ label: '1 kg + Shaker', sublabel: '33 servings', price: 34.9, comparePrice: 39.8, servings: 33 }],
    reviews: [
      {
        author: 'Niklas F.',
        rating: 5,
        flavor: 'Chocolate Shake',
        title: 'Perfect gift for gym beginners',
        text: 'Bought this for my little brother when he started lifting. He\u2019s now on his third bag. Bundle price is a no-brainer.',
      },
      {
        author: 'Claudia V.',
        rating: 5,
        flavor: 'Vanilla Shake',
        title: 'Everything you need',
        text: 'Great whey, great shaker, great price. Shipping took two days.',
      },
    ],
  })

  // ────────────────────────── EQUIPMENT ───────────────────────

  await product({
    slug: 'resistance-band-set',
    name: 'Resistance Band Set',
    brand: 'FUELD',
    categoryId: equipment.id,
    tagline: 'Five latex-free loop bands — warm up, add load and stretch anywhere.',
    description:
      'A complete loop-band set for home or commercial gyms: five resistances that stack together, so one band covers a warm-up and five cover a heavy hip thrust. Latex-free and coated so they will not grip or flake, with the tension printed on every band. Comes in a carry bag that fits next to your shaker.',
    usage:
      'Anchor a loop band to a rack post, door anchor or sturdy table leg. Add bands together for heavier loads.',
    image: '/images/products/resistance-bands.png',
    badges: ['Latex-free', 'Travel size'],
    rating: 4.7,
    reviewCount: 268,
    sortOrder: 0,
    sizes: [
      { label: 'Light', sublabel: '5–15 kg', price: 19.9 },
      { label: 'Medium', sublabel: '10–30 kg', price: 24.9, popular: true },
      { label: 'Heavy', sublabel: '20–60 kg', price: 29.9 },
    ],
    reviews: [
      {
        author: 'Marek S.',
        rating: 5,
        title: 'Survives daily use',
        text: 'The coating is solid — no cracking after months of hip thrusts. Medium is the one I use for everything.',
      },
      {
        author: 'Ines B.',
        rating: 4,
        title: 'Great for travel',
        text: 'Bags down to nothing in a backpack. Wish the light set had been a bit heavier.',
      },
    ],
  })

  await product({
    slug: 'lifting-belt',
    name: 'Lifting Belt',
    brand: 'FUELD',
    categoryId: equipment.id,
    tagline: 'Competition-grade belt with a single quick-release buckle.',
    description:
      'Ten millimetre genuine leather with a single metal buckle that holds position through the hardest set of the session. Broken in from day one, so there is no frustrating break-in period. Stiff enough to take the load off your lower back on heavy squats, rows and presses without rolling up.',
    usage:
      'Wrap snug around the hips, not the stomach, and buckle over the navel. Tighten between sets.',
    image: '/images/products/lifting-belt.png',
    badges: ['Genuine leather'],
    rating: 4.9,
    reviewCount: 431,
    sortOrder: 1,
    sizes: [
      { label: 'S/M', sublabel: 'Up to 85 cm', price: 34.9 },
      { label: 'L/XL', sublabel: '85–110 cm', price: 34.9 },
    ],
    reviews: [
      {
        author: 'Tobias K.',
        rating: 5,
        title: 'No break-in period',
        text: 'Stiff out of the box like it should be. Squatted 180 kg with it in the first week.',
      },
      {
        author: 'Ruth A.',
        rating: 5,
        title: 'The buckle stays put',
        text: 'Single quick release instead of a double prong. I can adjust it between sets without taking it off.',
      },
    ],
  })

  await product({
    slug: 'knee-sleeves',
    name: 'Knee Sleeves',
    brand: 'FUELD',
    categoryId: equipment.id,
    tagline: '7 mm compression sleeves that keep warm-ups honest and knees quiet.',
    description:
      'Seven millimetres of compression that support the knee through warm-ups and heavy sets without cutting circulation. Reinforced stitching at the flex point means they do not blow out at the seam, and the ribbed cuff stops them sliding down mid-session. Sold as a pair.',
    usage:
      'Pull on before your first warm-up set and keep them on through your working sets.',
    image: '/images/products/knee-sleeves.png',
    badges: ['Sold as a pair'],
    rating: 4.8,
    reviewCount: 197,
    sortOrder: 2,
    sizes: [
      { label: 'S/M', sublabel: '33–38 cm', price: 22.9 },
      { label: 'L/XL', sublabel: '38–46 cm', price: 22.9 },
    ],
    reviews: [
      {
        author: 'Ola M.',
        rating: 5,
        title: 'Knees feel solid',
        text: 'Difference is obvious on heavy squats. No rolling down, even on leg day.',
      },
    ],
  })

  await product({
    slug: 'speed-jump-rope',
    name: 'Speed Jump Rope',
    brand: 'FUELD',
    categoryId: equipment.id,
    tagline: 'Ball-bearing speed rope with adjustable cable and coated handles.',
    description:
      'A ball-bearing speed rope that turns smoothly and adjusts in seconds: cut the cable to your height, twist-lock it and it stays put. Coated handles stop the cable from drilling into your palms, and the whole thing weighs almost nothing, so it lives in a gym bag or a desk drawer.',
    usage:
      'Step over the cable, keep elbows close to the ribs and turn from the wrists.',
    image: '/images/products/jump-rope.png',
    badges: ['Adjustable'],
    rating: 4.6,
    reviewCount: 143,
    sortOrder: 3,
    sizes: [{ label: 'One size', sublabel: 'Up to 2.5 m', price: 14.9 }],
    reviews: [
      {
        author: 'Janek P.',
        rating: 5,
        title: 'Fast and smooth',
        text: 'Ball bearings make a real difference on intervals. Adjusting the length took about a minute.',
      },
      {
        author: 'Sofia L.',
        rating: 4,
        title: 'Cable mark-free',
        text: 'Coating means it does not leave a black line on the floor. Handles could be a touch longer.',
      },
    ],
  })

  const stats = await db.product.count()
  const reviewStats = await db.review.count()
  console.log(`✅ Seed complete: ${stats} products, ${reviewStats} written reviews, 8 categories`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
