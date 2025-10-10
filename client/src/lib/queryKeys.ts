export const qk = {
  me: ['me'] as const,
  events: (params?: unknown) => ['events', params] as const,
  event: (id: string) => ['event', id] as const,
  demos: (params?: unknown) => ['demos', params] as const,
  reviews: (params?: unknown) => ['reviews', params] as const,
  adminStats: (params?: unknown) => ['admin-stats', params] as const,
}


