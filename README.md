# Toastmasters Poster Generator

A local-first React application for producing a complete, timed weekly Toastmasters agenda and a fixed-format poster from one structured meeting form.

## Run locally

```bash
pnpm install
pnpm dev
```

Open the local URL shown by Vite. The editor starts blank; use **Load sample** when you want a complete example.

Other commands:

```bash
pnpm test       # Run the scheduling and agenda-generation tests
pnpm build      # Create a production build
pnpm lint       # Run ESLint
pnpm preview    # Preview the production build
```

## Architecture and data flow

```text
React editor
  → meeting specification
  → pure agenda generator
  → complete timed poster data
  → fixed HTML/CSS poster
  → PNG / JPEG / browser-print PDF
  → editable DOCX meeting minutes
```

The meeting specification in `src/data/defaultMeeting.js` is the only editable state shape. `src/services/generateAgenda.js` expands that specification using `src/config/agendaTemplate.js`, maps every prepared speech directly to one evaluation, and calculates every row start time with pure functions from `src/utils/calculateTimes.js`. Poster components receive generated data only and contain no scheduling rules.

Club identity, committee, colors, link, logo, and QR asset paths are isolated in `src/config/clubConfig.js`. Role definitions are also configured there, so new form roles can be added without changing the timing engine.

## Brand styling

The webpage and poster use the Toastmasters International brand system from the supplied brand manual:

- Loyal Blue `#004165` and True Maroon `#772432` are the dominant colors.
- Cool Gray `#A9B2B1` and Happy Yellow `#F2DF74` are supporting accents.
- Approved Loyal Blue and True Maroon gradient endpoints are used for large branded surfaces.
- Montserrat is used for headings and Source Sans 3 for body copy. Both approved free alternatives are bundled locally in `public/fonts` so preview and export do not depend on a network connection.
- The full-color Toastmasters International mark in `public/toastmasters-logo.png` was extracted from the supplied brand manual at high resolution and is displayed above the 72-pixel web minimum with protected white space.
- The application shell adapts layout techniques from CSS Zen Garden design 209 - a centered canvas, patterned sidebar, dark section bars, high-contrast content field, and compact accent symbols - without reusing its copyrighted artwork or copying its stylesheet.

## Saving, import, and export

- The current draft and initial club defaults are stored in `localStorage`.
- **Duplicate previous** advances the meeting number and date by one week.
- Meeting specifications can be imported from and exported to JSON.
- **Minutes DOCX** creates an editable, A4 meeting-minutes document from the same meeting JSON and generated agenda. It follows the supplied navy Toastmasters minutes template while omitting its logo, section 9, and signature blocks.
- PNG and JPEG are captured at 2.4× the 1000×1400 logical poster size using `html-to-image`.
- **Print / PDF** uses browser print CSS so text and table rules remain browser-rendered instead of being flattened into a JPEG.
- Exports are disabled when required data is invalid or the poster/sidebar still overflows in dense mode.

## Configuration

- `src/config/clubConfig.js`: club identity and static sidebar/footer content
- `src/config/agendaTemplate.js`: standard rows, order, role references, and durations
- `src/config/speechTypes.js`: speech type duration defaults
- `src/data/defaultMeeting.js`: editable sample meeting and default optional rows

## Current limitations

- There is one fixed portrait template and no direct poster manipulation.
- The included QR graphic is a clearly isolated placeholder; replace `public/qr-placeholder.svg` with the club's real QR asset before production use.
- PDF export opens the browser print dialog; the user selects **Save as PDF**.
- Client-side DOM capture is browser- and memory-dependent. A future Playwright export service can reuse the same deterministic poster markup.
- Static committee and club details are changed in configuration, not through the weekly editor.
- Minutes fields that are not known from the agenda—such as actual Table Topics responses, report comments, awards, and committee reports—are included as clearly marked completion prompts in the DOCX.
