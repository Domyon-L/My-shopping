# 精品之城 maintenance

- Preserve the public Site identity in `.openai/hosting.json` and its existing audience.
- Publish each completed, validated update to the public URL, `https://shopping.ldomyon69.chatgpt.site`. The user requested the `shopping` URL label on 2026-10-12 and wants every update available on mobile and desktop without a separate publishing confirmation. Keep the same Site project ID; do not stop after local edits or a source push.
- Keep the page title `精品之城` and the product-link brand `Domyon · 好物引力`.
- Edit `catalog/index.template.html` and the stable application assets in `dist/`; run `npm run build` to generate the entry and fingerprinted assets, then `npm test` before packaging.
- Follow the Sites skill for source synchronization, packaging, publication and deployment verification. Report the actual publication result and any browser verification limit.
- Retain source dates and evidence. Do not invent product quality ratings, prices, purchase links, or physical testing claims.

- The supplied V6 HTML establishes an independent entrance: first load shows a centred search gate, not the storefront. The entrance settings allow 500–3000 ms in 100 ms increments, default 1500 ms, saved in the browser. Timer, canvas and progress use a single duration snapshot per passage. Cards open local product details; evidence websites open directly from details.
- Keep the draggable companion outside the shopping scene and visible only on the outer entrance. Do not put the passage button or companion back into the storefront.
- Keep all products consistently free of image previews and generic image placeholders. The latest request restores original products with historical numeric CNY reference prices: label them historical, preserve the original date, and never claim current verification or a matching SKU. Documented products still require sourced CNY prices within 30 days and matching product identity; unknown prices remain hidden. Cards show reference price/date and open local details; official links are optional evidence inside details, never the primary card action. Keep archived records without displaying or deleting them.
- Keep implementation descriptions out of visible UI: no transition-duration marketing captions, effect explanations or pet-drag instruction captions. The user-requested functional duration label and slider values are allowed. Preserve useful action labels, accessibility labels and product evidence.
- Use dark navy or light steel-blue Domyon themes with one blue accent, readable 18 px desktop / 16 px phone titles and prominent reference prices. Phones from 320 px upward show two card columns, collapsed optional filters and cumulative load-more when eligible inventory exceeds 24. Keep saved explicit theme preferences. Avoid multicolored card badges and headline background rectangles.
- Category counts and enabled taxonomy options must match the result of clicking them under the current search/scope/budget/scene. Hide empty navigation categories; home channel links start a fresh category browse.
- Editable Figma design: https://www.figma.com/design/S0oE0Xi71chU7RpN5MK78h . Preserve the PC and Mobile component families and five screens per device when updating.
- Keep the entrance passage full-screen with an unobstructed vanishing point, faint deep-space nebulae, layered stars and shared vector category icons travelling through it. The latest request removes aurora curtains from both entrance and passage. Put functional controls near the lower edge. No duration or effect-explanation captions inside the passage.
- Detail views use a price summary plus overview, full specifications, package/use information and price evidence sections. Preserve factual model, configuration, currency, source and date boundaries; do not fill gaps with invented claims.
- Keep the Big Dipper's seven-star bowl and handle, and Aries' principal-star arc, as subtle connected sky elements on the outer entrance and passage only. Use responsive placements away from the central gate. Preserve each outline as a group while drifting or zooming; avoid explanatory labels or a ram illustration.

- Generic discovery (phone dock / companion) and the shopping brand return the complete eligible catalog. Only explicitly labelled curated scopes apply the documented-only filter. Keep navigation active state aligned with the displayed scope.

## Update requested 2026-10-14
- Keep the whole eligible catalog. The default browser view sorts <=100 CNY upper-bound prices before the 100–120 band and the rest; evidence tiers remain intact inside each band. Historical entries are browsing references, not verified quality recommendations.
- Hard natural-language budget caps and the 100-yuan quick channel use the full price range upper bound, never its midpoint. The explicitly labelled upgrade channel allows only currently sourced documented 100–300 CNY records with an evidence-backed conditional purchase reason.
- Keep `catalog/purchase-evidence.json` authoritative for specific purchase reasons. Preserve quote/source dates; only update prices for actually revisited source pages.
- Daylight is a distinct warm-paper and ice-blue layout with small peach accents, rounded actions and playful celestial ornaments. Respect locally saved custom theme colors. Dark mode retains navy star fields. The latest request supersedes the previous light steel-blue-only restriction.
- Ambient sky and a drifting nebula curtain now remain in the shopping scene; retain the entrance-only constellation charts and companion. Do not restore green aurora curtains.
- Category navigation is a focus-contained drawer on every viewport. Keep search always visible with an explicit submit button and keyboard-operable suggestions.
- My Planet settings are browser-local: nickname, budget, interests, scene, theme color, star density, motion preferences and recent views. Keep generic discovery complete; restrict only explicit personal discovery.
- Internal browser QA is unavailable in this environment because control-browser is absent. Follow Sites guidance; do not start an improvised preview/browser.

## Night and passage update 2026-10-14 (version 18)
- The latest user direction supersedes the prior blue-only night palette: use a dark galactic cyberpunk theme with readable icy cyan / lavender highlights, restrained neon edges and optional crimson nebula energy.
- `dist/cyber.css` scopes the new interface to night. Preserve the established daylight layout and saved day/night, accent, budget, interest and motion preferences.
- The passage is a decorative black-hole approach that crossfades into a curved, helical wormhole mesh, using `dist/wormhole-core.mjs`. It is not a physical simulation; do not claim scientific rendering accuracy.
- Preserve passage duration, skip/cancel controls, navigation and source/price integrity. Snapshot duration once per passage; resize or visibility changes must never reset it.
- My Planet's `cosmicTone` preference allows `galaxy` (default) and `crimson`. Old saved preferences without that key migrate to galaxy. The user's ambiguous word “流血” is represented as an optional dark-red cosmic mood, alongside the retained stars and meteors.
- Motion-disabled and Canvas-unavailable passages keep a calm CSS black-hole silhouette and working controls. Stop drawing during background visibility and resume the same passage without adding concurrent frames.

## Catalogue and galactic update 2026-10-14 (version 19)
- `catalog/additions-*.json` holds this release's 154 independently sourced model additions. Preserve all old records; the 1000 visible count contains 840 historical pending records and 160 records with recent sourced prices. Never call the full 1000 quality-verified.
- `catalog/brand-picks.json` is the scoped comparison manifest; the UI uses four brands and six purpose-specific picks, not universal quality rankings. Only same-brand, same-category documented items with current CNY prices are eligible. Expired comparisons disappear. All other brands remain searchable without invented winners.
- Canonical brand aliases in `dist/brand-keys.mjs` join historical and current brand names. Keep brand browse, chips and category counts aligned.
- Preserve segmented wormhole energy arcs, orbital dust and an unobstructed black-hole core. The shopping galaxy is softly drifting; occasional meteors are separated by roughly12–20 seconds. Keep reduced-motion and disabled-effects behavior intact.
- Figma remains blocked by the Starter MCP quota; `design/figma-state-v19.json` accurately records no changes. Do not claim the external file was updated unless an actual subsequent tool run succeeds.
