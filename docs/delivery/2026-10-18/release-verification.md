# Evaluation release verification

The evaluation form now asks the adult contact for a broad athlete age group. Supported groups are 8–9, 10–13, 14–17, and 18+. The eligibility note preserves the approved group minimum of 8 and private-training minimum of 10. No date of birth is collected. The server rejects a training request without a supported age group, and the existing team notification includes that group in its notes.

Five campaign UTM labels and the landing pathname are captured on arrival and carried to the request. The first tagged campaign in the same tab wins. Session storage failures fall back to the current URL labels without blocking the form. Only those five bounded labels and a pathname are retained; the full URL, arbitrary query fields, and referrer are not stored.

Migration `20261018104059_booking_age_and_campaign_attribution.sql` was applied through the existing project's database connection. All seven added fields are nullable, preserving the older deployed form and historical records. Row policies and package/lock files were preserved.

Verification:

- Four Node regression tests pass: age validation and notification notes, bounded campaign parsing, first-touch retention across navigation, and restricted-storage/SSR fallback.
- TypeScript, scoped ESLint, and the production build pass using the existing lockfile-compatible TanStack Start 1.167.50, Router 1.168.25, and router plugin 1.167.28.
- A transaction inserted a synthetic `.invalid` request under the anonymous database role, verified the age and campaign fields as the database owner, and checked that the anonymous role could not read it. The transaction rolled back. The final count was eight historical requests and zero fixture rows. The table had no custom triggers; the application email handler was never invoked.
- Campaign copy still points to the published `/evaluation` destination. The shared campaign ZIP and DOCX persist in Drive with Ben's reader permission.
- Desktop production browser checks are performed after publishing. The available browser interface does not expose a supported viewport switch, so mobile layout has a source-level breakpoint review only; mobile visual verification remains open.

No live form submission, recipient email, customer confirmation, campaign launch, ad spend, payment, or downstream CRM conversion was tested or enabled. Dates/location, sender merge fields, consent/suppression, and a controlled recipient-approved delivery test remain campaign activation prerequisites.

Technical references reviewed: Supabase changelog, Supabase row-level security documentation, and PostgreSQL table modification documentation. No package API migration was needed.
