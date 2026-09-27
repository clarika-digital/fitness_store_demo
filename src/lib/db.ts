/**
 * Database-free data layer.
 *
 * When no Prisma client is available (e.g., static deployment without DB),
 * this module provides no-ops. API routes that previously used `db.*`
 * should now import static data from `@/data/products-data` or use
 * fallback values.
 *
 * In a fully static deployment, the API routes in `app/api/**` are
 * expected to return hardcoded or cached data instead of querying
 * Prisma.
 */
export const db = {
  product: {
    findMany: async () => [],
    findUnique: async () => null,
    aggregate: async () => ({ _avg: { rating: 0 }, _sum: { reviewCount: 0 }, _count: 0 }),
    count: async () => 0,
  },
  category: {
    findMany: async () => [],
  },
  size: {
    findMany: async () => [],
  },
  flavor: {
    findMany: async () => [],
  },
  review: {
    findMany: async () => [],
    count: async () => 0,
  },
  newsletterSubscriber: {
    upsert: async () => ({}),
  },
}