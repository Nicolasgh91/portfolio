# CI con GitHub Actions

Validación automática en cada push y cada pull request hacia `main`.

## Flujo del pipeline

Orden **fail-fast** (el paso más barato primero: si falla el formato, no se ejecutan typecheck ni build):

```text
push/PR → checkout → setup node + cache → npm ci → lint → check → build → ✓/✗
```

## Workflow

- **Archivo:** [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)
- **Job:** `build_and_test` en `ubuntu-latest`, `timeout-minutes: 15`
- **Permisos:** `contents: read` a nivel de workflow (mínimo privilegio; este job no despliega ni comenta en PRs).
- **Concurrencia:** `group: ci-${{ github.ref }}`, `cancel-in-progress: true`, para no acumular ejecuciones si llegan commits seguidos.
- **Disparadores:** `push` y `pull_request` restringidos a la rama `main`.
- **Secretos:** el workflow no define variables de entorno sensibles ni usa `secrets.*`.

## Node.js y dependencias

- Versión de Node: archivo [`.node-version`](../../.node-version) (actualmente `22`), consumido por `actions/setup-node@v4` con `node-version-file`.
- **Caché:** `cache: npm` en `setup-node` para acelerar `npm ci`.

## Pasos del job

1. **Checkout:** `actions/checkout@v4`
2. **Node:** `actions/setup-node@v4` con archivo de versión y caché npm
3. **`npm ci`:** instalación reproducible según `package-lock.json`
4. **`npm run lint`:** `prettier --check .` (formato; requiere [`.prettierrc`](../../.prettierrc) con `prettier-plugin-astro` para `.astro`)
5. **`npm run check`:** `astro sync && astro check && tsc --noEmit -p .` — sync antes del check de Astro para colecciones Zod; `tsc` cubre los paths del `tsconfig`. Equivale a `npm run typecheck` (alias en `package.json`).
6. **`npm run build`:** build de producción Astro (validación del bundle sin despliegue)

## Orden recomendado al introducir el CI en el repo

Para que la **primera** ejecución del workflow no falle en `lint`, conviene que el árbol ya esté formateado con Prettier **antes** de que el commit añada `.github/workflows/ci.yml` (o al menos en el mismo PR, con el commit de formato **antes** del commit del YAML en la historia hacia `main`).

## Scripts relacionados en `package.json`

| Script      | Comando resumido                            |
| ----------- | ------------------------------------------- |
| `lint`      | `prettier --check .`                        |
| `check`     | `astro sync && astro check && tsc --noEmit` |
| `typecheck` | `npm run check` (alias)                     |
