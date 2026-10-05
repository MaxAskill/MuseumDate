# A Day Around Manila

A responsive personal invitation for October 17, 2026, built with React, Vite, TypeScript, Tailwind CSS, Lucide React, and Framer Motion.

## Run

```sh
npm install
npm run dev
```

Production checks: `npm run build`. Interaction tests: `npm test`. Serve the production build with `npm run preview`.

## Open from a phone on the same network

Run `npm run dev:network`, then open the printed Network URL on a phone connected to the same Wi-Fi/LAN. The server uses port 5173 and listens on all network interfaces. This shares the preview within the local network; it does not publish it to the internet. Keep the terminal running. If a phone cannot connect, allow Node.js through Windows Firewall on the private network and check that the router does not isolate wireless clients. The PC's local IP can change. Use `npm run dev` for a localhost-only preview.

Mobile layouts include sticky navigation, single-column museum galleries, larger touch targets, inputs that avoid iOS focus zoom, and additional layouts for small phones.

The npm scripts include Node symlink-preservation flags and Vite's runner config loader to accommodate this OneDrive workspace. In this agent session, Vitest's internal realpath resolver was also blocked at the OneDrive parent; the same project and installed dependencies were copied to a temporary directory outside OneDrive and both interaction tests passed there. TypeScript and production builds pass in the original workspace. No connected preview browser was available, so visual desktop/mobile browser QA remains unverified.

## Edit the trip

The home page is now the itinerary overview, followed by individual trip pages navigated with fixed Next/Back controls or the page picker. URL hashes such as `#journey`, `#natural`, and `#rsvp` support direct links and browser Back/Forward. Only the current chapter is rendered; long content can scroll inside that chapter on small screens, while navigation stays visible. Museum pages split content into Top Highlight, Highlights, and Photo & Mission views. Each museum's highlights are swipeable slides on desktop and mobile.

The revised starting point is the condo at Exchange Regency in Ortigas. A 9:00 AM meetup and suggested 9:15 AM departure allow about 90 minutes for the ride, trains, transfers, and walk, aiming for a 10:45 AM museum arrival. These are estimates, not verified journey times. The boarding-station picker saves Ortigas or Shaw Boulevard locally. The route is MRT-3 southbound to Taft Avenue, transfer to LRT-1 EDSA northbound, get off at United Nations, then walk to Natural History. Museum visits use the shorter end of the recommended ranges, with lunch at 2:15 PM and San Agustin at 3:15 PM. Casa Manila and later stops retain their previous afternoon times.

Route references checked October 5, 2026: https://www.theexchangeregency.com/location, https://www.dotrmrt3.gov.ph/station-map.pdf, https://www.dotrmrt3.gov.ph/dotr-mrt3-brochure.pdf, and https://lrmc.ph/our-business/train-route/. Confirm service announcements before travelling.

- `src/data/itinerary.ts`: suggested times, locations, durations, and stop descriptions.
- `src/data/museums.ts`: highlights, photo spots, missions, source links, and optional image paths.
- `src/data/restaurants.ts`: configurable food options, meal examples, price sources, and budget notes. Options with `lunchEligible: false` are excluded from the picker; Surprise Me keeps the same stated budget.

Lunch targets approximately ₱500 per person (₱1,000 for two), with each full meal below ₱1,000. La Cathedral Café sample solo pasta prices come from a third-party uploaded 2026 menu, not a current official quote: https://www.scribd.com/document/1046957363/lcc-menu-2026-1. Ristorante delle Mitre's ₱400–₱600 range is a planning allowance informed by https://autoreserve.com/en/restaurants/Z92hUT8f3jH9CbxnXMMr, not verified menu pricing. Ilustrado café remains a conditional backup because current peso prices could not be verified; its menu page contains template prices that were not used. Barbara's advertised ₱1,650 buffet (https://www.barbaras.ph/service-page/buffet-with-cultural-show) is over budget and excluded from voting. Sources checked October 5, 2026; drinks, rice, service charges, and current prices must be checked before ordering.
- `src/data/tripDetails.ts`: date, meeting point, and packing details. Invitation date text is also present in the hero, pass, RSVP, and footer components.
- `src/data/chapters.ts`: page order, navigation titles, and supported URL hashes.

## Photos

Museum highlights now include visually reviewed Wikimedia Commons reference photos stored locally as compressed WebP files. `src/data/highlightPhotos.ts` maps each highlight to a photo, descriptive alt text, and an honest reference caption. General categories use examples, and the architecture card explicitly identifies its upper-hall photo rather than presenting it as the staircase. Photographs illustrate what to look for; they do not guarantee the current gallery arrangement.

`src/data/referencePhotos.json` retains each photo's source, author, and license. Credits and license links appear on the cards; local resized/converted versions retain the original stated license. `scripts/download-reference-photos.py` can regenerate the assets and metadata with Python and Pillow. The checked-in assets require no Python installation to run the website.

Put additional licensed images in `public/images/museums/` and update the reference mapping, or set `image` and `imageAlt` on a highlight without a reference mapping. `PhotoSlot` lazy-loads and decodes images asynchronously, reserves layout space, preserves the whole reference image without cropping, and falls back to a named placeholder if loading fails.

Museum chapter galleries use horizontal snap slides with swipe, arrow buttons, dots, keyboard arrow navigation, and a live position counter. The Top Highlight is a separate museum view; the Highlights and Photo & Mission buttons switch views without expanding a long section. Our Favorites retains a responsive grid. Reduced-motion preferences are respected; favorites work in the slides and in Our Favorites.

## Browser-local features

Each museum also has an **Our Photos** view for personal trip photographs. Add up to 12 JPG/PNG/WebP images per museum (15 MB maximum each), edit captions, remove with undo, and download a 1200×1450 PNG Polaroid keepsake. Photos are compressed to a maximum 1600px edge and stored as Blobs in IndexedDB, separately for each museum. No images are uploaded to the server. Browser storage is device- and origin-specific: localhost and LAN IP URLs have different albums, and clearing site data removes saved photos. Download Polaroids to retain copies. Convert HEIC to JPG before adding. This works without `crypto.randomUUID`, which is unavailable on insecure local-network HTTP origins; IDs use `crypto.getRandomValues` instead.

Favorites, lunch preference, museum missions, visit duration edits, and RSVP persist through localStorage. RSVP does not send a message or create a reservation. Lunch selection is a preference, not a booking. Storage denial/corruption is handled without crashing. Edited museum durations do not recalculate suggested itinerary times.

## Content checks

Official museum and restaurant sources checked October 5, 2026:

- https://www.nationalmuseum.gov.ph/our-museums/national-museum-of-natural-history/
- https://www.nationalmuseum.gov.ph/author/nationalmuseumgmail-com/page/5/ (Lolong Gallery 1 reference)
- https://www.nationalmuseum.gov.ph/our-collections/ethnology/
- https://weblinks.nationalmuseum.gov.ph/wp-content/uploads/2023/01/30111112/NMP-FY-2021-Annual-Report_compressed.pdf (historical maritime exhibition reference; current access unconfirmed)
- https://www.nationalmuseum.gov.ph/exhibitions/fine-arts/gallery-spoliarium-hall/
- https://ilustradorestaurant.ph/
- https://www.barbaras.ph/contact-us

Current access on October 17 is not guaranteed. Ristorante delle Mitre and Casa Nueva are included as requested possibilities with confirmation notes. No unverified admission prices or opening hours are presented. The day pass is decorative and is not an admission ticket. Golden hour is a suggested walk time, not a calculated sunset prediction.
