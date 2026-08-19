# Legacy Progress

Legacy Progress is a browser-based incremental life simulator built around careers, skills, wealth, and prestige. Guide a heroes through a lifetime, improve their capabilities, make strategic economic choices, and turn each generation's progress into permanent meta-progression.

## Features

- **Life simulation:** Advance time through a hero's lifespan while balancing income, upkeep, housing, and progression.
- **Career progression:** Select jobs, earn experience, unlock higher roles, and improve wages over time.
- **Skill development:** Improve skills through work.
- **Housing and shop system:** Choose housing and purchase potions or accessories to shape each run.
- **Innate abilities:** After prestige, receive a newly rolled selection of run-specific innate bonuses and choose one for the next life.
- **Prestige progression:** End a life near the end of its lifespan to convert run progress into permanent meta points.
- **Meta research:** Hold a research action to invest meta points gradually into permanent upgrades that improves your runs.

## Gameplay overview

Each run begins with a new hero and a limited set of resources. Work to earn money and job experience, invest in skills, and make sure the hero's housing and upkeep remain affordable. As skills and job levels improve, additional careers become available.

Prestige is intentionally restricted until the hero reaches 90% of the configured lifespan. When prestige is performed, run-specific progress is reset, rounded-up meta points are awarded, and a new innate selection is rolled. The current run meta level and run meta XP reset, while permanent research and the best meta level remain available for future generations.

## Technology

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- CSS with a component-oriented React structure

## Requirements

- Node.js (LTS recommended)
- npm

## Getting started

```bash
npm install
npm run dev
```

Vite will print the local development URL in the terminal, usually `http://localhost:5173`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reload. |
| `npm run build` | Type-check and create a production build. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint across the project. |

## Project structure

```text
src/
├── components/       Reusable interface panels and tabs
├── hooks/             Simulation state and game loop logic
├── assets/            Static application assets
├── data.ts            Jobs, skills, items, innates, and research definitions
├── types.ts           Shared TypeScript domain types
├── utils.ts           Progression, multiplier, and calculation helpers
├── App.tsx            Application composition and tab navigation
└── main.tsx           React application entry point
```

## Persistence and data

The application stores the active game state in the browser's `localStorage`. The Settings tab provides controls to export a serialized save and import it later. Clearing site data or using the reset action permanently removes the local progress for that browser profile.

## Contributing

Contributions are welcome. For substantial changes, open an issue first to discuss the proposed gameplay or technical change. Keep changes focused, run `npm run lint` and `npm run build`, and update documentation when behavior changes.

## License

This project is distributed under the MIT License. See [LICENSE](LICENSE) for the license text.