[![GTA 6 trophy guide bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/0xcharlo/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/0xcharlo/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Trophy Atlas — GTA VI Trophy Guide & Tracker

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI, built for the [make.fun bounty “Build the best GTA 6 trophy guide”](https://make.fun/bounty/gta6-trophy-guide-01).

Every trophy is shown with its official name, description and grade as PlayStation publishes them, plus a guide written for this page in our own words that cites its sources — what to do, where and how, and when it can be missed. The trophy data lives in `app/data/trophies.json`, including the hidden flags (28 of the 55 stay hidden on PS5 until earned), the counts PlayStation tracks (such as 42 Shooting Range challenges), the kind (story, collectibles, activities) and the roadmap stage.

## Features

- **Checklist tracker** — tick trophies off; progress is saved in the browser (localStorage) and survives reloads.
- **Export / import** — save your progress to a JSON file and import it back on any machine.
- **Filters** — by kind (story, missable, collectibles, activities, online), by grade, by earned state, plus text search.
- **Spoiler setting** — on by default: story trophies you have not earned yet stay hidden (name and description) until you earn them or turn spoilers off.
- **Roadmap to the platinum** — six stages built from the official descriptions: story first with manual saves, strangers and side characters, activities and challenges, collectibles and exploration, robberies and the wanted level, then money, the cryptic trophies and 100% completion.
- **Missable trophies flagged** — Positive Mental Attitude is the one trophy reported as possibly missable (do Lucia’s Chapter 1 balcony meditation before that chapter ends); everything else can be earned after the story.
- **Fully offline** — static files only, no build step, no network requests at runtime, no external fonts, images or scripts.

## Run it

```sh
node serve.ts
```

Then open <http://localhost:8080> in a desktop browser. `serve.ts` serves `app/` only; any static HTTP server with `app/` at its root works the same way.

## Layout

- `app/index.html` — the page shell: header and progress, filters, checklist and roadmap views.
- `app/app.js` — bootstrap: loads the trophy data, wires the controls, keeps the views in sync.
- `app/state.js` — progress state: localStorage, export and import.
- `app/filters.js` — filter, search and spoiler-masking logic.
- `app/render-list.js` — the checklist cards.
- `app/render-detail.js` — the guide panel beside the checklist.
- `app/render-roadmap.js` — the six-stage roadmap and the missable-trophy box.
- `app/data/trophies.json` — the 55 official trophies with guides and sources.
- `app/style.css` — the look: an original dusk palette, drawn in plain CSS.
- `main.ts` — the entry program: copies `app/` and `screenshots/` to the output folder and writes `dossier.json` with the vendored make.fun library.
- `screenshots/` — real renders of the app running in a desktop browser.

## Sources

The official trophy names, descriptions and grades are PlayStation’s published text, as listed by Exophase and PSNProfiles. Guide methods and counts follow EGamers.io’s trophy list (18 November 2026), GTABase, PowerPyx and Press-Start; where no source confirms a method, the guide says so instead of guessing. This is an unofficial, fan-made guide, not affiliated with Rockstar Games, Sony or PlayStation, and it shows no Rockstar logo or official artwork.

## License

MIT — see [LICENSE](LICENSE).
