import posthog from 'posthog-js';

const key = import.meta.env.VITE_POSTHOG_KEY as string;
const host = import.meta.env.VITE_POSTHOG_HOST as string;

console.log('[PostHog Debug]', { key: key ? 'SET' : 'MISSING', host: host ? 'SET' : 'MISSING' });

posthog.init(key, {
  host,
  enableExceptionAutocapture: true,
})

export { posthog }

export function getAnonymousId(): string {
  const key = 'posthog_anonymous_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}
