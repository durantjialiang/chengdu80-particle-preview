# Global university network — September 2026

The homepage introduces the globe immediately after the short competition/host introduction. Featured projects, event photographs and team stories follow it. The existing particle80/SWUFE/FIC opening remains in place.

The homepage's six equal-size university cards use SWUFE, NUS, UC Berkeley, University of Toronto, ETH Zurich and UNSW. The directory retains every existing university record. Country-to-region mapping drives the same region filters and counts; the historical record count is derived from the data, not a fixed public number. The current registry contains 18 schools. 2026 participation remains separate and unannounced.

The first eligible viewport entry starts a 24-second tour through Chengdu, Singapore, Zurich, Toronto, Berkeley and Chengdu. Explicit URLs and prior interaction prevent automatic takeover. Drag, selection, typing, filters, keyboard navigation and browser Back interrupt it. Leaving the map or hiding the tab pauses it. Reduced-motion mode disables the tour; manual selection and the static fallback remain available. Tour steps replace URL state without adding browser-history entries.

Region, edition, keyword and selected school are represented by `region`, `year`, `query` and `university` URL parameters. Empty results never retain an unrelated selected profile. A direct manual school selection on mobile brings its updated profile into view. Hover changes emphasis but does not rotate the camera. An explicit focus revision lets Return to Chengdu and Locate reset a manually rotated globe even when its target school has not changed.

Profile cards show an official mark or text fallback, full name, location, participation years, a representative team photograph and one project or participation record. A representative photograph can come from another edition, and its caption states that photograph's year separately from the selected project's year. No new affiliations, school identities or award claims were added. Complete records and source links remain in the profile dialog.

Validation uses `npm test`, typecheck, lint, production build and `scripts/check-history-build.mjs`. Browser acceptance scripts:

- `qa/network-international.browser.mjs BASE_URL NON_PUBLIC_OUTPUT_DIR`: homepage order, six schools, combined filters, history, both languages, mobile widths, photographs and dialogs.
- `qa/network-tour.browser.mjs BASE_URL NON_PUBLIC_OUTPUT_DIR`: automatic tour, synchronized selection, no extra history, drag takeover, offscreen pause/resume, reduced motion and unavailable WebGL.

Existing photo albums and the unpublished-video configuration are retained. Deployment follows this repository's existing Git-to-Vercel workflow.
