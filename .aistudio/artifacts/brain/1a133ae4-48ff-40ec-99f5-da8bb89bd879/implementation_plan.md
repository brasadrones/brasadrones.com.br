# Adaptive Cross-Browser Favicon & Footer Commercial Contact

This update introduces the official BRASA symbol as an adaptive favicon that remains sharp and high-contrast across light and dark browser themes on all major browsers, and adds the commercial contact email (`comercial@brasadrones.com.br`) beneath the brand logo in the footer with both direct mail and one-click copy support.

### User Review & Critical Decisions

> [!IMPORTANT] All key design choices were confirmed during clarification. Review the summary below before proceeding to implementation.

- **Confirmed Decision 1 (Favicon Contrast Strategy)**: Adaptive light/dark icons powered by `prefers-color-scheme` for modern browsers, paired with reliable PNG fallbacks so the mark stays legible across Chrome, Firefox, Edge, Safari, and mobile browsers.
- **Confirmed Decision 2 (Footer Contact Placement)**: Placed directly beneath the BRASA logo in the left-hand brand column of the footer.
- **Confirmed Decision 3 (Email Interaction)**: Interactive `mailto:comercial@brasadrones.com.br` link paired with a discreet copy-to-clipboard button and visual confirmation feedback.

---

### 1. Overview & Core Concept

- **What It Does**:
  1. Converts the provided BRASA mark into a square-centered, theme-aware favicon suite (adaptive SVG + light/dark SVG & PNG variants + Apple Touch Icon fallback) linked in the document head.
  2. Adds `comercial@brasadrones.com.br` below the footer logo with a direct email link and a subtle copy button that confirms when the address is copied.
- **Target Audience / Persona**: Prospective partners, institutional clients, and visitors browsing the BRASA website across desktop and mobile browsers in either light or dark OS/browser modes.
- **Key Value**: Consistent brand recognition in browser tabs and bookmarks regardless of theme, combined with frictionless commercial contact access in the footer without cluttering the layout.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  - **Browser Tab & Bookmarks**: When a visitor opens the site on a light tab bar, the favicon displays in BRASA Deep Navy (`#071A4D`). When switched to a dark tab bar, it adapts automatically to Warm Cream (`#FFFAF4`). On browsers or surfaces that ignore SVG media queries (such as Safari/iOS bookmarks or legacy fallbacks), the PNG/touch fallback displays cleanly without turning black-on-dark or white-on-light.
  - **Footer Contact**: Scrolling to the footer reveals `comercial@brasadrones.com.br` positioned cleanly under the BRASA logo. Clicking the email opens the user's default mail client via `mailto:`. Clicking the adjacent discreet copy icon copies the address to the clipboard, briefly displaying a checkmark confirmation before resetting.
- **Visual Identity & Theme**:
  - *Color Palette & Mood*: Strictly adheres to existing BRASA tokens — Deep Navy (`#071A4D` / `#030C27`), Warm Cream (`#FFFAF4`), Muted Slate (`#8B99B5`), and BRASA Orange (`#FB9627`) on hover/feedback.
  - *Typography & Hierarchy*: Matches the footer's existing `font-brasa-body` `text-xs` styling so the email sits naturally alongside navigation and social links without competing with the brand lockup.
  - *Component Styling & Layout*: Left brand column shifts from a single flex logo wrapper to a clean vertical stack (`space-y-3`) holding the BRASA logo and the compact email + copy action row, preserving alignment across mobile, tablet, and desktop breakpoints.
- **Interactive Feedback & Motion**:
  - Subtle color transition (`hover:text-[#FB9627]`) on both the `mailto:` link and the copy button.
  - Accessible `aria-label` and `title` attributes on the copy button, transitioning from a copy icon to a subtle check icon for ~2 seconds upon copying.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual SVG Media Queries + Universal PNG Fallbacks**
  - *Chosen Approach*: Provide an adaptive SVG (with embedded `@media (prefers-color-scheme: dark)` CSS), explicit `media="(prefers-color-scheme: light|dark)"` icon links, and rasterized PNG fallbacks (`32x32` light/dark variants plus a high-contrast `180x180` Apple Touch Icon and universal fallback PNG on a `#071A4D` rounded badge).
  - *Why*: Browsers differ in how they handle SVG favicons—Chrome and Firefox honor embedded CSS media queries inside SVGs, whereas Safari historically favors `media` attributes on `<link>` tags or PNG icons and does not reliably recolor monochrome SVGs inside dark tabs. Including a contrasted fallback PNG guarantees visibility everywhere.
  - *Alternatives Considered*: A single monochrome SVG with embedded CSS (fails in Safari and legacy contexts) or a single fixed-badge icon everywhere (does not adapt to light/dark tab bars in modern browsers as requested).

- **Decision 2: Reusing Existing Footer Typography & Left-Column Stacking**
  - *Chosen Approach*: Place the email row directly below the footer logo inside the 5-column left area, using a small inline row (`inline-flex items-center gap-2`) with the `mailto:` link and icon-only copy button.
  - *Why*: Keeps the footer balanced after the earlier tagline removal without introducing an extra column or altering the existing `NAVEGAÇÃO` and `REDES SOCIAIS` columns.
  - *Alternatives Considered*: Adding a fourth column to the footer grid (would compress existing column proportions and deviate from the user's chosen placement).

---

### 4. Technical Architecture & Data Strategy

- **Architecture & Asset Flow**:

```
┌────────────────────────────────────────────────────────────────────┐
│                        Document Head Entry                         │
│                                                                    │
│  ┌──────────────────────────────┐  ┌────────────────────────────┐  │
│  │ Adaptive & Theme SVG Icons   │  │ Cross-Browser PNG Fallback │  │
│  │ • Light: #071A4D mark        │  │ • 32x32 light/dark PNGs    │  │
│  │ • Dark:  #FFFAF4 mark        │  │ • Universal badge PNG      │  │
│  │ • Embedded CSS media query   │  │ • 180x180 Apple Touch Icon │  │
│  └──────────────────────────────┘  └────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                      Centralized Site Content                      │
│  • footer.contactEmail: "comercial@brasadrones.com.br"             │
└─────────────────────────────────┬──────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────┐
│                          Footer Component                          │
│                                                                    │
│  ┌──────────────────────────────┐  ┌─────────────┐ ┌────────────┐  │
│  │ Left Brand Column            │  │ Navigation  │ │ Socials    │  │
│  │ • BRASA Logo (light)         │  │             │ │            │  │
│  │ • mailto link + Copy button  │  │             │ │            │  │
│  │   [copied state -> 2s reset] │  │             │ │            │  │
│  └──────────────────────────────┘  └─────────────┘ └────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - Static configuration holds the commercial email string (`comercial@brasadrones.com.br`).
  - Local boolean UI state (`copied`) in the footer component tracks clipboard confirmation with an automatic timer cleanup on unmount.
- **Interactive Component & State Mapping**:
  - **Copy Button Click**: Invokes `navigator.clipboard.writeText(email)` (with a safe textarea fallback if Clipboard API is restricted inside an iframe), sets `copied = true`, displays the check icon + screen-reader confirmation, and resets after 2 seconds.
  - **Email Link Click**: Triggers native `href="mailto:comercial@brasadrones.com.br"` action.
