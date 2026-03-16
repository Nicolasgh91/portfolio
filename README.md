# Portfolio — Nicolás Hruszczak

Stack: Astro 4 · Tailwind CSS · MDX · Web3Forms · Vercel

---

## Setup rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Variables de entorno
Crear un archivo `.env` en la raíz del proyecto:
```env
PUBLIC_WEB3FORMS_KEY=tu_clave_de_web3forms
```
Para obtener la clave: ir a https://web3forms.com → ingresar tu email → copiar el Access Key.

### 3. Correr en desarrollo
```bash
npm run dev
# → http://localhost:4321
```

### 4. Build de producción
```bash
npm run build
npm run preview   # preview local del build
```

---

## Deplegar en Vercel (costo cero)

1. Subir el proyecto a GitHub
2. Ir a https://vercel.com → New Project → importar el repo
3. En **Environment Variables**, agregar `PUBLIC_WEB3FORMS_KEY`
4. Click en Deploy — Vercel detecta Astro automáticamente

### Dominio personalizado
Una vez comprado el dominio:
1. En Vercel: Settings → Domains → Add Domain
2. Actualizar el campo `site` en `astro.config.mjs` con el dominio real
3. Actualizar las URLs en los JSON-LD de `src/layouts/Layout.astro`

---

## Estructura del proyecto

```
portfolio/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro        # Layout base + SEO + theme/lang/a11y scripts
│   ├── components/
│   │   ├── Nav.astro           # Navbar sticky con controles
│   │   └── ContactForm.astro   # Formulario Web3Forms con validación
│   ├── pages/
│   │   ├── index.astro         # Home — bifurcación empresa/reclutador
│   │   ├── servicios.astro     # Ruta B2B
│   │   └── talento.astro       # Ruta reclutadores
│   └── styles/
│       └── tokens.css          # 🎨 FUENTE ÚNICA DE VERDAD para colores y tokens
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

---

## Cambiar la paleta de colores

Todo el sistema visual vive en `src/styles/tokens.css`.
Para cambiar el color de acento de amber a otro:

```css
/* Ejemplo: cambiar a azul */
:root {
  --color-accent-400: #378ADD;   /* main accent */
  --color-accent-300: #85B7EB;   /* hover */
  --accent-bg:        #378ADD12;
  --accent-border:    #378ADD40;
}
```

---

## Checklist antes de lanzar

- [ ] Reemplazar `YOUR_WEB3FORMS_ACCESS_KEY` en `.env` o en `ContactForm.astro`
- [ ] Actualizar `CV_URL` en `talento.astro` con el link real de Google Drive
- [ ] Actualizar `GITHUB_URL` en `talento.astro` con el usuario de GitHub real
- [ ] Actualizar `tu-usuario` en los links de LinkedIn de `Layout.astro` e `index.astro`
- [ ] Actualizar `site` en `astro.config.mjs` con el dominio real
- [ ] Actualizar las URLs en los bloques JSON-LD de `Layout.astro`
- [ ] Reemplazar el lorem ipsum de los proyectos con descripciones reales
- [ ] Agregar el diagrama/screenshot real de Huella del Fuego
- [ ] Agregar `og-default.png` en `/public` para el Open Graph (1200×630px)
- [ ] Reemplazar `apple-touch-icon.png` en `/public` (180×180px)
- [ ] Correr `npx astro check` para verificar tipos antes del deploy
- [ ] Auditoría Lighthouse (objetivo: 100/100 Performance, Accessibility, SEO)
