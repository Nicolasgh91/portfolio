# Procedimiento replicable por cliente — landing template

## Contrato operativo

- Un repositorio por cliente (`landing-[cliente]`), sin mezclar datos entre cuentas.
- Personalización limitada a datos/config/assets (`src/config`, `src/data`, `public/`).
- Componentes UI no se modifican durante onboarding comercial.

## Flujo validado

1. Clonar template base `remix-of-personal-blog`.
2. Ejecutar `npm install` y `npm run build` en WSL.
3. Confirmar guard de `lovable-tagger` en `vite.config.ts` para `development`.
4. Mantener demo con:
   - `public/robots.txt` -> `User-agent: *` + `Disallow: /`
   - `<meta name="robots" content="noindex, nofollow">` en `index.html`
5. Deploy en Vercel y alias de dominio.
6. Verificar HTTPS con `curl -I https://<dominio-demo>`.

## Evidencia de validación base

- Demo activa (hub editorial / SPA): `https://creador-contenido.escalatunegocioconia.com`
- Alias aplicado en Vercel al último deploy de producción.
- Build del template sin chunks > 500 KB (`index-*.js` ~392 KB).

## Gate de revisión de bundle

- Si aparece warning de chunk > 500 KB:
  - Diagnosticar módulo causante con `npx vite-bundle-visualizer` (o build verbose).
  - Registrar decisión técnica antes de continuar a deploy (aceptar temporalmente o refactorizar partición de bundle).
