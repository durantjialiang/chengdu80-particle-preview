# Global university network — September 2026

The homepage introduces the globe immediately after the short competition/host introduction. Featured projects, event photographs and team stories follow it. The existing particle80/SWUFE/FIC opening remains in place.

The homepage's six equal-size university cards use SWUFE, NUS, UC Berkeley, University of Toronto, ETH Zurich and UNSW. The directory retains every existing university record. Country-to-region mapping drives the same region filters and counts; the historical record count is derived from the data, not a fixed public number. The current registry contains 20 schools: 18 with competition records and two connected through academic exchange. 2026 participation remains separate and unannounced.

The first eligible viewport entry starts a 24-second tour through Chengdu, Singapore, Zurich, Toronto, Berkeley and Chengdu. Explicit URLs and prior interaction prevent automatic takeover. Drag, selection, typing, filters, keyboard navigation and browser Back interrupt it. Leaving the map or hiding the tab pauses it. Reduced-motion mode disables the tour; manual selection and the static fallback remain available. Tour steps replace URL state without adding browser-history entries.

Region, year, keyword and selected school are represented by `region`, `year`, `query` and `university` URL parameters. Empty results never retain an unrelated selected profile. A direct manual school selection on mobile brings its updated profile into view. Hover changes emphasis but does not rotate the camera. An explicit focus revision lets Return to Chengdu and Locate reset a manually rotated globe even when its target school has not changed.

Profile cards show an official mark or text fallback, full name, location, participation years, a representative team photograph and one project or participation record. A representative photograph can come from another edition, and its caption states that photograph's year separately from the selected project's year. University of Chicago and UC San Diego were added following the owner’s request to place the three academic collaborators’ universities on the globe. Berkeley keeps its existing ID, team participation and awards, and also links to Anderson/CDAR exchange information. Complete records and source links remain in the profile dialog.

Validation uses `npm test`, typecheck, lint, production build and `scripts/check-history-build.mjs`. Browser acceptance scripts:

- `qa/network-international.browser.mjs BASE_URL NON_PUBLIC_OUTPUT_DIR`: homepage order, six schools, combined filters, history, both languages, mobile widths, photographs and dialogs.
- `qa/network-tour.browser.mjs BASE_URL NON_PUBLIC_OUTPUT_DIR`: automatic tour, synchronized selection, no extra history, drag takeover, offscreen pause/resume, reduced motion and unavailable WebGL.

Existing photo albums and the unpublished-video configuration are retained. Deployment follows this repository's existing Git-to-Vercel workflow.

## Academic cooperation globe extension

Chicago and San Diego use separate campus pins, Chinese names and city labels. Their academic-exchange years are held in `content/academic-institutions.ts`; competition participation, award and project arrays stay empty. Year filters include documented exchanges, while participation totals remain unchanged. The 2019 filter includes Hansen and Sobel’s visits; Berkeley’s 2021 forum connection is discoverable without adding a 2021 team entry.

The globe, region counts, search results and static fallback share the same registry. New academic routes use the exchange route style and remain visible in the low-power view. The selected-school spotlight and detail panel link to the existing collaborator photographs and cooperation-unit cards. The homepage’s six featured directory cards and automatic tour retain their existing selection.

The three cooperation-unit cards also link directly to the corresponding selected globe node. Chicago uses an approximate Hyde Park campus representative point (41.7897, -87.5997), guided by the official UChicago campus map and address. UCSD uses the Central Campus Station landmark (32.878353, -117.231842) linked by its official directions page. Both are illustrative campus pins, not building boundaries or faculty office locations.
