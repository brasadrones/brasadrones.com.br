# UI/UX & Marketing Materials

This doc is meant to grow into the brand/style guide and marketing playbook for brasadrones. Right now it mostly records the *current* state and the decisions that need to be made — fill it in as those decisions happen.

## Current state: a brand seed inside a generic template

The codebase started as the [Astroship](https://web3templates.com) SaaS template. So far only two things have actually been customized for brasadrones:

1. **The homepage** (`/`, [src/pages/index.astro](../../src/pages/index.astro)) — a full-screen, black-background "link in bio" card with an Instagram-gradient icon, linking out to `instagram.com/brasadrones`. Copy is in **Portuguese** ("Clique para saber mais sobre a BRASA").
2. **The redirect system** ([features/redirects.md](../features/redirects.md)) — backs physical QR codes / printed material with stable links.

Everything else — `/about`, `/blog`, `/pricing`, `/contact`, the navbar — is still the template's generic English SaaS content (fake team members, fake pricing tiers, generic dev-blog posts, a "Pro Version" upsell link to web3templates.com). This is a real inconsistency worth resolving deliberately rather than by accretion: see [pages/overview.md](../pages/overview.md) for the full list.

## Brand elements already present (informal, undocumented)

- **Color**: the homepage's Instagram-style gradient (`#F58529 → #DD2A7B → #8134AF → #515BD4`) on a black background with translucent white accents. This is currently hardcoded inline in `index.astro` rather than defined as a reusable token — if this gradient is meant to represent the brand (not just "it's Instagram's colors because we're linking to Instagram"), it should move into Tailwind theme tokens/CSS variables so it's reused consistently instead of re-hardcoded per page.
- **Fonts**: Inter Variable and Bricolage Grotesque Variable are both loaded (`@fontsource-variable/*`, wired in `Layout.astro`), but the homepage doesn't visibly lean on a distinct display font. Bricolage Grotesque is a good candidate for headings/wordmark treatment if a more distinctive look is wanted.
- **Language**: homepage is Portuguese, every template page is English. Pick one primary language for the site (Portuguese seems right for a Brazilian drone business) and document it here, so new pages aren't written in the wrong one by default.

## Marketing materials & QR codes

The redirect system ([features/redirects.md](../features/redirects.md)) exists specifically so printed materials — flyers, drone case stickers, banners, business cards — can carry a **permanent** URL while its destination changes over time. Whoever produces physical/printed marketing assets should follow this checklist:

1. **Before designing/printing anything with a QR code or short link**, request (or create) a stable `OUTPUT` path + `ID` row in the redirects sheet.
2. **Confirm it resolves** (hit `/redirects/update`, then visit the path) before sending art to print — see "Testing a change" in [features/redirects.md](../features/redirects.md).
3. **Record where the material is deployed** (event, print run size, date) so future edits to that row don't break something already in circulation without anyone realizing.
4. **Never reuse an `OUTPUT` path for an unrelated destination** once it's been printed — only the `REDIRECT_URL` should change, not the path's meaning.

## Known issues affecting marketing/visitors today

- **Contact form is broken.** `src/components/contactform.astro` posts to Web3Forms with a placeholder access key (`YOUR_ACCESS_KEY_HERE`). Until a real key is set, `/contact` submissions go nowhere — any traffic driven to that page is a lost lead. Either fix this before linking to `/contact` anywhere, or remove the page/link until it's wired up.
- **Open Graph / link-preview image** (`public/opengraph.jpg`) is likely still the generic Astroship template image — when this site's link is shared (Instagram bio, WhatsApp, etc.), the preview card should show brasadrones branding, not template artwork. Worth a manual check and replacement.
- **`astro.config.mjs`'s `site` field and `public/robots.txt`** still point at the old template domain — affects canonical URLs and the generated sitemap that search engines/crawlers see. See [technical/architecture.md](../technical/architecture.md).

## Open decisions

- **Site structure**: the homepage's Instagram-first, single-link approach suggests this might intentionally be a link-in-bio style site rather than a traditional multi-page marketing site. Decide whether `/about`, `/blog`, `/pricing`, `/contact` should be:
  - customized into real brasadrones content (services, team, pricing for drone work), or
  - removed/hidden from the navbar until they are, so the public site doesn't expose unrelated template filler.
- **Navbar/footer**: currently disabled on the homepage entirely. If more pages become real, decide what persistent navigation (if any) should look like, and replace the navbar's placeholder menu items (`src/components/navbar/navbar.astro`) accordingly.
- **Unused marketing components** (`hero.astro`, `cta.astro`, `features.astro`, `logos.astro` — see [components/overview.md](../components/overview.md)) are dead code today. Either repurpose them for a future marketing page or remove them so the component directory reflects what's actually in use.

Update this document as these decisions get made — it should describe the brand and information architecture that's actually intended, not just what's currently rendered.
