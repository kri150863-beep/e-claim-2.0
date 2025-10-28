# Client E-Claim (client-e-claim-2.0)

Lightweight Angular frontend for the Motor Claims application. This repository contains the single-page application used by claims users to create, view and manage motor insurance claims. The project follows a clean architecture split between core/domain logic and Angular presentation/infrastructure.

Key facts
- Angular 19 (CLI v19.2.9 generated)
- TypeScript
- TailwindCSS + Angular Material

Table of contents
- Quick start
- Development scripts
- Configuration
- Project layout (high level)
- Testing
- Troubleshooting
- Contributing
- License

## Quick start

Prerequisites
- Node.js (18.x or later recommended)
- npm (9.x or later) or pnpm/yarn
- Angular CLI (optional, installed globally is convenient): `npm i -g @angular/cli`

Install dependencies:

```bash
npm install
```

Start development server (default configuration):

```bash
npm start
# or with local config
npm run local
```

Open http://localhost:4200 in your browser. The app will hot-reload on changes.

## Development scripts

All commands are defined in `package.json`.

- `npm start` — ng serve (development)
- `npm run local` — ng serve with `local` configuration
- `npm run build` — build production artifacts (output: `dist/`)
- `npm run watch` — continuous build for development
- `npm test` — run unit tests (Karma)

If you prefer the Angular CLI directly, you can use `ng serve`, `ng build`, etc.

## Configuration

- Environment files: `src/environments` contains `environment.ts`, `environment.development.ts`, and `environment.local.ts`. Update these for API endpoints, feature flags, or mock-backend toggles.
- Proxy: `proxy.conf.json` (if present) can proxy API requests to the backend during development.

Secrets and credentials
- Do not commit secrets or private keys to this repo. Use environment variables or a local secrets file ignored by git.

## Project layout (high level)

Important folders (inside `src/app`):

- `core` — business logic and domain entities (entities, repositories, use-cases). Framework agnostic.
- `infrastructure` — Angular implementations: API clients, guards, interceptors, services, and a mock-backend useful for offline development.
- `presentation` — Angular views, feature modules, routes and components.
- `store` — application state (NgRx or other patterns).

Static assets: `public/assets` and `src/assets` (images, logos, svg, translations).

See the original README section for a detailed tree if you need to navigate the repository.

## Testing

- Unit tests: `npm test` (Karma + Jasmine). Tests live alongside services and components (e.g. `*.spec.ts`).
- E2E: Not included by default. Add a preferred e2e framework (Cypress, Playwright, or Protractor replacement) if you want end-to-end tests.

## Troubleshooting

- Port already in use: if `ng serve` fails because port 4200 is occupied, run `ng serve --port 4300` or stop the process using that port.
- Build errors after dependency changes: remove `node_modules` and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

- Type errors during compilation: ensure your TypeScript and Angular versions in `package.json` are compatible with Node version.

## Contributing

If you plan to contribute:

1. Create a branch named `feature/short-description` or `fix/short-description` from `main`.
2. Keep commits small and focused.
3. Run unit tests and linting before opening a pull request.

If you need to run the app locally against the real backend, update the appropriate environment file with the API base URL and any required tokens.

## Useful tips

- Mock backend: the project includes a `mock-backend` folder under `infrastructure` for local development and demos. Toggle it in the environment or use dependency injection to replace the real API service with the mock provider.
- Generators: use Angular CLI to generate components, services and modules. Follow the existing folder structure to keep code organized.

## License

This repository does not include a license file. Add an appropriate `LICENSE` (MIT, Apache-2.0, etc.) if you plan to open-source it.

