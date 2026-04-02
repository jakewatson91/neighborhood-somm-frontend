<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Neighborhood Somm frontend. A new PostHog singleton (`src/lib/posthog.ts`) was created using the `posthog-node` SDK, with an anonymous user ID helper that persists across sessions via `localStorage`. Five analytics events and one exception capture were wired into `src/pages/Index.tsx` to cover the full user journey: submitting a vibe search, receiving a wine recommendation, requesting a shuffle, encountering a failure (API error or no results), and resetting to the home screen. Environment variables (`VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST`) were written to `.env`.

| Event name | Description | File |
|---|---|---|
| `wine search submitted` | User submits a vibe/description to find a wine | `src/pages/Index.tsx` |
| `wine recommendation received` | Sommelier API returns a successful wine recommendation | `src/pages/Index.tsx` |
| `wine shuffle requested` | User clicks "Another" to get a different wine for the same vibe | `src/pages/Index.tsx` |
| `wine search failed` | API returns an error or no results | `src/pages/Index.tsx` |
| `wine search reset` | User clicks the logo to return to the home/hero screen | `src/pages/Index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/365218/dashboard/1420136
- **Search → Recommendation Conversion Funnel**: https://us.posthog.com/project/365218/insights/1tXsMtOl
- **Daily Active Wine Searchers**: https://us.posthog.com/project/365218/insights/DFhvM3fk
- **Wine Search Failure Rate**: https://us.posthog.com/project/365218/insights/8h23sXQ4
- **Shuffle Requests vs New Searches**: https://us.posthog.com/project/365218/insights/NCBgSwXj

> **Note:** Run `bun add posthog-node` (or `npm install posthog-node`) to complete the package installation — the sandbox environment prevented the automated install from completing, but `posthog-node` has been added to `package.json` dependencies.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
