# ContactForm

**Ruta:** `src/components/ContactForm.astro`

**Usado en:** `src/pages/servicios.astro`, `src/pages/oferta/menu-digital.astro`

## Props

| Prop | Tipo | Requerida | Descripción |
|------|------|-----------|-------------|
| — | — | — | Sin `Props`; usa `import.meta.env.PUBLIC_WEB3FORMS_KEY` (fallback placeholder si falta). |

## Comportamiento

- Formulario Web3Forms: campos nombre, email, mensaje, honeypot `botcheck`, `access_key` oculto.
- Validación en cliente (`validateForm`): mensajes ES/EN según `document.documentElement.lang`.
- Envío `fetch` POST a `https://api.web3forms.com/submit`; éxito/error vía snackbar fijo con `aria-hidden` y cierre manual.
- Botón enviar con estado deshabilitado durante la petición.

## Decisiones de diseño

- Botón enviar: texto por defecto **“Enviar consulta”** / **“Send inquiry”** (`data-es` / `data-en`); tras envío, el script restaura el label desde esos atributos.
- Clases: `btn-primary btn-primary--lg w-full` (sistema en `tokens.css`); margen superior vía `#submit-btn` en scoped.
- Snackbar y grid del formulario estilizados con `<style>` scoped + variables CSS del sitio.
- Campos con `data-en` / `data-es` para el toggle de idioma global.

## Deuda técnica conocida

- Script del componente usa `getElementById` fijos (`contact-form`, etc.): **no montar más de una instancia por página** sin duplicar IDs.
- Mezcla importante de CSS clásico en `<style>` frente a la regla “solo Tailwind” del proyecto.

## Estado

Documentado
