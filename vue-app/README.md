# Trinity Atlas — Vue 3 Refactor

This is the **isolated Vue 3 + TypeScript + SCSS** application. It lives under `vue-app/` on the `vue3-development` branch and does **not** replace the deployed vanilla JavaScript prototype in the repository root.

## Local development

```bash
cd vue-app
npm install
npm run dev
```

Run `npm run build` to typecheck and build the frontend. Backend integration is deliberately deferred.

## Structure

- `src/data/scriptures.ts`: typed passage and relationship models, with starter sample data
- `src/components/ScriptureMap.vue`: mobile-aware SVG graph component
- `src/App.vue`: application shell, search and filters
- `src/styles/main.scss`: SCSS styling

## Workflow

1. Prototype and validate ideas on `main`.
2. Refactor accepted features into Vue components on `vue3-development`.
3. Review and test the Vue app independently before any replacement of the production site.

**Status:** initial scaffold; no claim of production readiness. Data is intentionally a small sample and must be expanded and audited.
