# Reference-based design specification

**Status** Proposed · Source of visual intent is the owner-supplied 1672 × 941 Coming Soon reference.

## Composition and interaction

The reference places the glowing mascot over a reflective pedestal to the left and the brand lockup above a right-aligned content column. Metallic “Coming” and sapphire-glass “Soon” sit inside a light orbit. A lit planet anchors the right edge, and light ribbons and reflections frame the horizon. Preserve the generous dark negative space around the title and controls. Use independent art layers so the composition can be reframed at each breakpoint.

- The desktop hero uses a viewport-aware two-column grid with the content aligned around the reference's right-center axis. Give the left artwork roughly 40% of frame width, allow a controlled overlap behind the outer content gutter, and keep the hand, helmet and eyes clear of text.
- Use an accessible H1 split visually into two text spans. Apply CSS gradients, embossing and controlled depth. Add a separate decorative orbital graphic. Use matching pre-rendered letter lighting only if it improves fidelity without duplicating readable text or consuming the main content load budget.
- Use a semantic list for the five feature cards. The display order is Marketplace, Jobs, Communication, Calls & Meetings and AI Assistant. Cards describe coming capabilities and have no faux buttons. Place the email form, consent and privacy link after the cards.
- Include only configured Instagram, LinkedIn, GitHub, YouTube and Telegram URLs, with accessible names and approved branding. Link the footer to privacy and the enrollment or support content it actually exposes. Show a scroll affordance only when linked content exists below the fold.
- Waitlist UI states are idle, pending, generic accepted, invalid field, consent required or changed, challenge retry, rate limited, unavailable and closed. Preserve entered email after recoverable errors. Announce completion via a polite live region and focus the first invalid field on submit. Label the email input visibly or accessibly even when the visual prompt is present.

| Width | Reflow and acceptance |
| --- | --- |
| 1920 / 1440 | Viewport composition with full mascot, pedestal, orbital title and right-edge planet. Inline form, five cards across where labels remain readable. |
| 1280 / 1024 | Compact header and title. Move to a 3+2 card grid when the right column has insufficient label width. Allow vertical scroll when viewport height is constrained. |
| 768 | Center brand and heading. Recompose mascot as compact centered art and keep a two- or three-column card grid by available space. |
| 430 / 390 | Brand → headline and intro → compact mascot → waitlist → cards → socials. Keep the CTA full width and preserve the mascot face and recognizable tentacles. |
| 360 / 320 | Two-column cards with wrapping labels, compact gutters, stacked social and footer as needed. Test 200% zoom, 320 CSS px reflow, landscape, soft keyboard and long validation text. |

DOM reading order uses brand, H1/intro, waitlist, capability list, socials and footer across sizes. Desktop visual placement may place the static cards above the form. Keep keyboard focus order consistent with actionable controls. Decorative art uses empty alt and no pointer events. Use tap targets of at least 44 CSS px where practical and no smaller than the applicable WCAG requirement. Focus indicators need distinct contrast, including over glass cards. Text contrast targets 4.5:1 for normal text, 3:1 for large text and interactive indicators. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## Tokens and layered assets

| Use | Proposed token |
| --- | --- |
| Frame and shadows | Midnight Black #020617, Deep Navy #04102B |
| Main accents | Sapphire #0648D9, Electric Blue #0066FF, Neon Cyan #00D4FF |
| Text | Ice White #F5F9FF, secondary #A9BEDD |
| UI typography | Self-hosted Inter variable WOFF2 subject to license/asset review. Evaluate Sora and Manrope by mobile widths and reference match. |
| Spacing and shape | 4 px base, 16–32 px content gutters, 16–24 px card radii and pill form. Use a solid deep-navy fallback behind all glass text. |

Use silver and sapphire contrast in the title, with a flat-color fallback in forced colors. Keep blur on small surfaces and reserve glow for focus areas. Build simple fine orbit rings, focus, icons, gradients and particles using CSS/SVG. Use raster art for the volumetric planet, reflective stage and mascot materials. Layer z-order is atmosphere → horizon/planet → stage → mascot → content → focus. Avoid art containing UI copy.

| Asset | Current evidence | Acquisition and acceptance |
| --- | --- | --- |
| MR mark, wordmark and lockup | Visible in reference. The existing Platform Marketplace image depicts a different jellyfish mark. | Request owner-supplied editable originals and brand usage sign-off. If missing, commission or manually reconstruct clean vector geometry from the reference and obtain explicit visual approval. Deliver SVG, transparent PNG and an approved favicon. |
| Mascot and pedestal | Single composite reference, with no editable model or isolated hero artwork supplied. | Request layered master or commission a transparent 3D render matching helmet, face, tentacles, MR details and welcoming gesture. Deliver separate large desktop and portrait crops with alpha and pedestal/reflection layers. Inspect edges over navy and blue. |
| Horizon, planet and reflections | Reference only. | Commission or obtain licensed high-resolution scene layers with a mobile crop and dark safe area behind copy. Preserve source licenses and color grade. |
| 3D model and optional rig | Unavailable. | Request GLB/glTF plus source meshes, PBR textures and rig if interactive 3D, blinking or articulated tentacles are approved. Validate logo placement, materials and mobile performance. Use pre-rendered assets for the baseline. |
| Title and orbit | Reference only. | Build live type, with a vector or CSS orbit. Compare letter silhouette, depth, optical kerning and material treatment in rendered QA. |
| Icons, socials and share image | Visual guide only. Social destinations unconfirmed. | Build or license accessible SVG icons, obtain real URLs and approved logos. Export original Open Graph artwork at 1200 × 630 from approved layers. Verify fonts, image licenses and credits. |

Asset sequence is owner source request → silhouette and composition proofs → brand and style approval → crop and compression derivatives → rendered visual QA. Use product-owned storage for source masters and a manifest with authorship, license, source, version, checksum and derivatives. Keep deployment assets separate from heavy masters. Owner approves the mascot's geometry, MR mark, wordmark, art rights and production export.

## Rendering and QA

Use static server components for the shell, header, features and scene. Client components handle form state and opt-in motion only. Provide reserved image dimensions, responsive source selection and a selectively prioritized visible LCP art or text element based on measurement. Proposed initial art budgets are 250 KB mobile and 450 KB desktop for the first view, subject to evidence and final artwork. Prefer opacity and transforms. Pause animation when hidden, reduce or remove animation under reduced-motion, and provide a pause control if decorative motion continues beyond five seconds. Provide equivalent content when WebGL, animation, JavaScript or images fail. Native form posts share server validation, and Turnstile still requires a valid challenge. If scripting or challenge service is unavailable, provide a clear retry and accessible support path with manual abuse review.

Capture approved-asset screenshots at 1920, 1440, 1280, 1024, 768, 430, 390, 360 and 320 CSS px. Check hierarchy, contrast, overflow, logo geometry, mascot visibility, orbit overlap, email affordance, focus, loading and error states. Check forced-colors, no GPU, hidden tab and reduced-motion. Owner approves reference fidelity before release. [Core Web Vitals](https://web.dev/articles/vitals)
