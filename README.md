# NothingLost landing page

Static landing page for the NothingLost Android app (`com.nothinglost.app`), served by GitHub Pages:
**https://nothinglost.matrabhed.com/** (custom domain, CNAME; repo `AHAariyan/nothinglost_landing_page`).

- `index.html`, `styles.css`: the whole page. No build step, no frameworks, no web fonts, no trackers.
- `assets/`: real app screenshots (from NotiTrail `play/raw/phone/`, as WebP; `crop-*` are tight crops for the feature cards), icons, `og.png` share image.
- Google Play buttons carry `data-play`: the page copies any `utm_*` tags from its own URL into Play's
  `referrer`, so Play Console credits the post that sent the visit. Link to it as
  `https://nothinglost.matrabhed.com/?utm_source=facebook&utm_medium=social&utm_campaign=...`.
- Copy follows the Play listing (`NotiTrail/play/LISTING.md`): no chat-app brand names, and the
  "Good to know" limits stay on the page.
- Privacy policy lives in its own repo: https://ahaariyan.github.io/NothingLostPrivacyPolicy/
