# escalatunegocioconia.com — Sitio Web de Software as a Service

Sitio web personal de Nicolás Hruszczak. Portfolio profesional con chatbot IA integrado, construido sobre Astro con deploy en Vercel. Costo operativo mensual: $0.

---

## Tabla de contenidos

1. [Stack tecnológico](#1-stack-tecnológico)
2. [Estructura del proyecto](#2-estructura-del-proyecto)
3. [Arquitectura general](#3-arquitectura-general)
4. [Sistema de diseño y tokens](#4-sistema-de-diseño-y-tokens)
5. [Páginas y secciones](#5-páginas-y-secciones)
6. [Chatbot — arquitectura detallada](#6-chatbot--arquitectura-detallada)
7. [Variables de entorno](#7-variables-de-entorno)
8. [Desarrollo local](#8-desarrollo-local)
9. [Deploy](#9-deploy)
10. [SEO y metadatos](#10-seo-y-metadatos)
11. [Accesibilidad](#11-accesibilidad)
12. [Cómo actualizar contenido](#12-cómo-actualizar-contenido)
13. [Replicar el chatbot para un cliente](#13-replicar-el-chatbot-para-un-cliente)

---

## 1. Stack tecnológico

| Capa | Tecnología | Versión | Rol |
|------|-----------|---------|-----|
| Framework | Astro | 4.x | SSG — genera HTML estático en build time |
| Estilos | CSS puro + tokens | — | Sistema de diseño con variables HSL |
| Fuentes | Inter + Outfit + JetBrains Mono | — | Cargadas desde Google Fonts |
| IA | Gemini API (Google) | 2.x | Modelo de lenguaje del chatbot |
| Proxy | Vercel Edge Functions | — | Protege la API key en el servidor |
| Analytics | Vercel Analytics + Speed Insights | — | Métricas de uso y performance |
| Deploy | Vercel | — | CDN global, preview branches, env vars |
| CI/CD | Git → Vercel (automático) | — | Push a main = deploy en producción |

---

## 2. Estructura del proyecto

```
portfolio/
│
├── api/
│   └── chat.js                        ← Vercel Edge Function
│                                         Proxy seguro a Gemini API
│
├── public/
│   ├── chatbot/
│   │   ├── widget/
│   │   │   ├── index.html             ← Entry point del widget (iframe)
│   │   │   ├── chat.css               ← Estilos del chatbot
│   │   │   └── js/
│   │   │       ├── api.js             ← Datos + system prompt + fetch
│   │   │       ├── render.js          ← Capa de presentación DOM
│   │   │       ├── session.js         ← Persistencia sessionStorage
│   │   │       └── main.js            ← Estado, eventos, orquestación
│   │   └── data/
│   │       ├── config.json            ← Identidad, contacto, branding
│   │       ├── services.json          ← Servicios ofrecidos
│   │       └── articles.json          ← Índice del blog
│   │
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   └── og-desktop.png                 ← Imagen Open Graph por defecto
│
├── src/
│   ├── assets/                        ← Imágenes procesadas por Astro
│   │
│   ├── components/
│   │   └── Nav.astro                  ← Barra de navegación global
│   │       (logo nh., links, toggle
│   │        dark/light, toggle idioma,
│   │        panel de accesibilidad)
│   │
│   ├── content/                       ← Colección de artículos del blog
│   │   └── blog/
│   │       └── *.md                   ← Artículos en Markdown
│   │
│   ├── layouts/
│   │   └── Layout.astro               ← Layout base de todas las páginas
│   │       (head, SEO, JSON-LD,
│   │        fuentes, tema, idioma,
│   │        accesibilidad, chatbot)
│   │
│   ├── pages/
│   │   ├── index.astro                ← Home / landing principal
│   │   ├── servicios.astro            ← Página de servicios
│   │   ├── talento.astro              ← Página de perfil / CV
│   │   ├── blog/
│   │   │   └── index.astro            ← Listado del blog
│   │   └── sitemap.xml.ts             ← Sitemap dinámico
│   │
│   ├── styles/
│   │   └── tokens.css                 ← Sistema de tokens CSS (fuente de verdad)
│   │
│   └── env.d.ts                       ← Tipado de variables de entorno
│
├── tasks/                             ← Notas y tareas del proyecto
├── .env                               ← Variables locales (no commitear)
├── .env.example                       ← Plantilla de variables requeridas
├── .gitignore
├── astro.config.mjs                   ← Configuración de Astro
├── package.json
├── tailwind.config.mjs                ← Config de Tailwind (si aplica)
└── README.md                          ← Este archivo
```

---

## 3. Arquitectura general

### Modelo de renderizado

El sitio usa **SSG (Static Site Generation)**. Astro genera HTML puro en tiempo de build y lo sirve desde el CDN de Vercel. No hay servidor Node.js en producción para las páginas.

```
Build time (Vercel)
    │
    ├── Astro compila .astro → HTML + CSS + JS mínimo
    ├── Genera sitemap.xml
    └── Despliega archivos estáticos al CDN

Request time (usuario)
    │
    ├── Browser recibe HTML puro desde CDN (< 50ms)
    ├── Carga assets (fuentes, imágenes) en paralelo
    ├── Inyecta iframe del chatbot vía script en Layout.astro
    └── Iframe carga widget desde public/chatbot/widget/
```

### Flujo del chatbot

```
Usuario escribe un mensaje
        │
        ▼
main.js — valida input, agrega al historial
        │
        ▼
api.js — buildSystemPrompt()
  Lee los tres JSON y construye el contexto:
  [persona] + [bio] + [servicios] + [artículos] + [contacto]
        │
        ▼
fetch POST /api/chat
  body: { systemPrompt: "...", history: [...] }
        │
        ▼
api/chat.js (Vercel Edge — SERVIDOR)
  Lee GEMINI_API_KEY desde process.env
  Lee GEMINI_MODEL desde process.env (fallback: gemini-2.0-flash)
  Llama a Gemini API con system_instruction + contents + generationConfig
        │
        ▼
Gemini API responde { candidates[0].content.parts[0].text }
        │
        ▼
api/chat.js devuelve { reply: "..." }
        │
        ▼
render.js — appendStreamingMessage()
  Efecto char a char (1–3 chars cada 10–18ms)
  Agrega botón copiar al terminar
        │
        ▼
session.js — saveSession()
  Persiste historial en sessionStorage
  El usuario conserva la conversación al navegar entre páginas
```

### Seguridad de la API key

```
Browser                    Servidor (Vercel Edge)
   │                              │
   │  POST /api/chat              │
   │  { systemPrompt, history }   │
   │ ────────────────────────── → │
   │                              │  process.env.GEMINI_API_KEY
   │                              │  → Gemini API
   │                              │  ← { reply }
   │  { reply: "..." }            │
   │ ← ────────────────────────── │
   │                              │
```

La API key **nunca llega al browser**. No aparece en el código fuente,
en las DevTools ni en ningún archivo de `public/`.

---

## 4. Sistema de diseño y tokens

Todos los valores visuales del sitio viven en `src/styles/tokens.css`.
Es la única fuente de verdad para colores, tipografía, espaciado y radios.

### Paleta de colores (HSL)

```css
/* Accent — amarillo dorado (la identidad visual del sitio) */
--accent-h: 43;
--accent-s: 96%;
--color-accent-400: hsl(43, 96%, 56%);   /* dark mode: color principal */
--color-accent-600: hsl(32, 94%, 44%);   /* light mode: más saturado */

/* Fondos dark mode */
--bg-primary:   hsl(240, 10%, 6%);       /* fondo de página */
--bg-secondary: hsl(240,  9%, 9%);       /* superficies */
--bg-tertiary:  hsl(240, 11%, 12%);      /* hover, terciarlos */
--bg-card:      hsla(240, 13%, 10%, 0.6);/* tarjetas con blur */

/* Textos dark mode */
--text-primary:   hsl(240, 11%, 96%);    /* títulos, body */
--text-secondary: hsl(240,  9%, 60%);    /* subtítulos */
--text-muted:     hsl(240,  6%, 35%);    /* placeholders, meta */

/* Bordes dark mode */
--border-subtle: hsla(0, 0%, 100%, 0.06);
--border-normal: hsla(0, 0%, 100%, 0.11);
--border-strong: hsla(0, 0%, 100%, 0.19);
```

### Tipografía

```css
--font-display: 'Outfit', system-ui;     /* títulos H1–H4 */
--font-body:    'Inter', system-ui;      /* párrafos, UI */
--font-mono:    'JetBrains Mono';        /* código */

--text-xs:   11px   --text-sm:  13px
--text-base: 15px   --text-lg:  18px
--text-xl:   24px   --text-2xl: 32px
--text-3xl:  46px
```

### Escala de espaciado

```css
--sp-xs: 4px    --sp-sm:  8px
--sp-md: 16px   --sp-lg:  24px
--sp-xl: 48px   --sp-2xl: 80px
```

### Radios de borde

```css
--radius-sm:   6px    --radius-md:   10px
--radius-lg:   14px   --radius-xl:   20px
--radius-pill: 9999px
```

### Modo claro

La clase `.light` en `<html>` activa el tema claro. El JS de Layout.astro
detecta la preferencia guardada en `localStorage` antes del primer paint
para evitar el flash de tema incorrecto:

```js
(function() {
  const stored = localStorage.getItem('nh-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = stored ? stored === 'dark' : prefersDark;
  document.documentElement.classList.toggle('light', !isDark);
})();
```

### Cómo usa los tokens el chatbot

El widget vive en un iframe con su propio documento. No tiene acceso
directo a `tokens.css`. En cambio, `index.html` incluye un script síncrono
en `<head>` que lee los valores computados del padre con `getComputedStyle`
y los inyecta como variables CSS inline **antes** de que `chat.css` pinte.
Esto garantiza cero flash de color al cargar o navegar entre páginas.

---

## 5. Páginas y secciones

### `pages/index.astro` — Home

Página principal del portfolio. Secciones:

- **Hero** — nombre, rol, descripción y CTA principal
- **Servicios destacados** — cards de los servicios principales con links
- **Proyectos** — casos de estudio con tecnologías usadas
- **FAQ** — preguntas frecuentes con acordeón
- **Contacto** — formulario de diagnóstico con campos: nombre, email, empresa, métrica de éxito y descripción del desafío

### `pages/servicios.astro` — Servicios

Detalle completo de todos los servicios. Cada servicio tiene:
descripción extendida, qué incluye, stack tecnológico, precio orientativo
y perfil del cliente ideal.

### `pages/talento.astro` — Perfil

Perfil profesional / CV interactivo. Stack de tecnologías, experiencia,
educación y proyectos anteriores.

### `pages/blog/index.astro` — Blog

Listado de artículos técnicos. Los artículos viven en `src/content/blog/`
como archivos Markdown con frontmatter.

### `components/Nav.astro` — Navegación

Barra de navegación presente en todas las páginas. Incluye:

- Logo `nh.` con link al home
- Links de navegación con estado activo
- **Toggle dark/light** — usa `window.nhTheme.toggle()`, persiste en `localStorage`
- **Toggle idioma ES/EN** — usa `window.nhLang.toggle()`, cambia elementos con `data-es` y `data-en`
- **Panel de accesibilidad** — escala tipográfica (3 tamaños), alto contraste, reducción de movimiento

---

## 6. Chatbot — arquitectura detallada

### Estructura de archivos

```
api/
└── chat.js                  ← SERVIDOR: proxy a Gemini, maneja la API key

public/chatbot/
├── widget/
│   ├── index.html           ← HTML puro sin lógica inline
│   ├── chat.css             ← Todos los estilos del widget
│   └── js/
│       ├── api.js           ← loadData() + buildSystemPrompt() + callChatAPI()
│       ├── render.js        ← appendMessage() + streaming + typing + CTAs
│       ├── session.js       ← saveSession() + loadSession() + clearSession()
│       └── main.js          ← Estado + eventos + init() [entry point]
└── data/
    ├── config.json          ← Identidad del propietario + config del bot
    ├── services.json        ← Array de servicios ofrecidos
    └── articles.json        ← Índice del blog para el bot
```

### `api/chat.js` — Edge Function (servidor)

**Runtime:** `edge` (Vercel Edge Network — sin cold starts)

**Endpoint:** `POST /api/chat`

**Request body:**
```json
{
  "systemPrompt": "string — contexto completo construido por api.js",
  "history": [
    { "role": "user",  "parts": [{ "text": "mensaje del usuario" }] },
    { "role": "model", "parts": [{ "text": "respuesta anterior" }] }
  ]
}
```

**Response body:**
```json
{ "reply": "respuesta del modelo" }
```

**Variables de entorno leídas:**
- `GEMINI_API_KEY` — requerida, lanza error 500 si no está
- `GEMINI_MODEL` — opcional, fallback: `gemini-2.0-flash`

**Manejo de errores:** devuelve JSON con campo `error` en todos los casos
de fallo (400 body inválido, 405 método incorrecto, 500 key faltante o
error interno). Nunca expone stack traces.

**CORS:** headers permisivos para permitir llamadas desde el iframe
(`Access-Control-Allow-Origin: *`). Seguro porque la key está en el
servidor — no hay nada sensible que proteger en el cliente.

---

### `public/chatbot/widget/index.html` — Estructura

HTML semántico puro. No contiene lógica ni estilos inline.
Su responsabilidad es declarar la estructura y orquestar la carga
en el orden correcto para evitar flashes visuales.

**Orden de carga crítico en `<head>`:**

```
1. <script> síncrono — inyecta tokens del padre
   (getComputedStyle → style inline en :root)

2. <link> chat.css — carga cuando tokens ya existen
   (las variables CSS se resuelven correctamente desde el inicio)

3. <script> síncrono — MutationObserver para cambios de tema
   (re-inyecta tokens cuando el usuario cambia dark/light)
```

Los módulos JS (`type="module"`) van al final del `<body>` — son diferidos
por defecto y no bloquean el render.

---

### `public/chatbot/widget/js/api.js`

Responsabilidades: carga de datos, construcción del system prompt y llamada al proxy.

**Exports:**
```js
loadData()                      // → Promise<{ config, services, articles }>
buildSystemPrompt(appData)      // → string (el prompt completo)
callChatAPI({ systemPrompt, history }) // → Promise<string> (la respuesta)
```

**`loadData()`** hace tres fetches en paralelo:
```js
Promise.all([
  fetch('/chatbot/data/config.json'),
  fetch('/chatbot/data/services.json'),
  fetch('/chatbot/data/articles.json'),
])
```
Si cualquier fetch falla, retorna `FALLBACK_CONFIG` con arrays vacíos.

**`buildSystemPrompt()`** construye el contexto que el modelo recibe
en cada mensaje. Estructura del prompt:
```
[persona del chatbot]

## SOBRE [NOMBRE]
[bio, ubicación, idiomas, disponibilidad]

## SERVICIOS
### [emoji] [título] — desde [precio]
[descripción]
Incluye: [lista]
Stack: [tecnologías]
Entrega: [tiempo] | Ideal para: [perfil]

## ARTÍCULOS DEL BLOG
- "[título]" ([tiempo lectura]): [resumen] → [url]

## CONTACTO
WhatsApp: [...] | Email: [...] | Web: [...]

## INSTRUCCIONES
- Respondé en el idioma del usuario
- Sé concreto y útil, sin rodeos
- Si preguntan precios, dá el precio base y aclará que depende del proyecto
- Si hay interés en contratar, mencioná WhatsApp o email
- No inventes información fuera de este contexto
- Máximo 3-4 párrafos por respuesta
```

---

### `public/chatbot/widget/js/render.js`

Capa de presentación pura. No contiene lógica de negocio ni fetch.
Recibe datos y los convierte en nodos DOM.

**Exports:**
```js
appendMessage(role, text, extras)
// role: 'user' | 'bot'
// extras: { quickReplies[], onQuickReply(), showContact, config }
// Crea burbuja estática con avatar, texto, quick replies y/o CTAs

appendStreamingMessage(text)
// → Promise<bubbleWrap (HTMLElement)>
// Crea burbuja con efecto char a char (1–3 chars, 10–18ms)
// Agrega botón copiar al terminar

showTyping()
// Indicador de tres puntos animados mientras espera la API

removeTyping()
// Elimina el indicador

makeCTAs(config)
// → HTMLElement con botones WhatsApp y/o email
// Generados a partir de config.owner.contact

markdownToHtml(text)
// Convierte **bold**, *italic*, `code` y \n → HTML seguro (escapa XSS)
```

**Avatares:**
- Bot: `nh.` con el punto en `var(--accent)` — replica el logo del sitio
- Usuario: texto `tú` en 9px — minimalista, no compite con el contenido

**Botón copiar:**
Aparece al hacer hover sobre cualquier burbuja del bot.
Usa `navigator.clipboard.writeText()`. Muestra `✓ Copiado` por 2 segundos.

---

### `public/chatbot/widget/js/session.js`

Persiste el historial en `sessionStorage` bajo la clave `chat_history`.
La sesión se limpia automáticamente al cerrar el tab.

**Exports:**
```js
saveSession(history)   // serializa y guarda el array
loadSession()          // deserializa y devuelve el array, o [] si no hay nada
clearSession()         // elimina la clave (para "nueva conversación")
```

**Por qué sessionStorage y no localStorage:**
- `localStorage` persiste indefinidamente → el usuario vería conversaciones
  viejas al volver días después, lo que puede ser confuso
- `sessionStorage` dura exactamente mientras el tab está abierto → comportamiento
  esperado para un chat de soporte

---

### `public/chatbot/widget/js/main.js`

Orquestador. Único archivo que importa de todos los demás.
Contiene el estado global y la lógica de coordinación.

**Estado:**
```js
appData   // Object — datos cargados de los JSON
history   // Array  — mensajes { role, parts }
isOpen    // Boolean — ventana visible o no
isLoading // Boolean — esperando respuesta de la API
```

**Comportamiento del toggle:**
```
Click en ícono flotante (cerrado) → abre la ventana
Click en ícono flotante (abierto) → cierra la ventana
Click en cruz (✕) del header     → cierra la ventana
```
No hay estado "minimizado" — el ícono flotante siempre está visible
cuando la ventana está cerrada, preservando la sesión intacta.

**Init:**
1. `loadData()` — carga los tres JSON en paralelo
2. `loadSession()` — restaura historial de sessionStorage
3. Si hay historial → renderiza los mensajes anteriores sin delay
4. Si no hay historial → muestra el greeting con delay de 2.5s y quick replies
5. Si el chat está cerrado → muestra badge rojo en el ícono

---

### `public/chatbot/data/config.json` — Schema

```jsonc
{
  "owner": {
    "name": "string",              // Nombre completo
    "role": "string",              // Título profesional
    "bio": "string",               // Descripción en 1-3 oraciones
    "location": "string",          // Ciudad, País
    "languages": ["string"],       // Idiomas hablados
    "availability": "string",      // Estado de disponibilidad
    "contact": {
      "whatsapp": "string",        // Formato: +54 9 11 XXXX-XXXX
      "email": "string",           // Email de contacto
      "website": "string"          // URL del sitio
    }
  },
  "chatbot": {
    "name": "string",              // Nombre en el header del chat
    "greeting": "string",          // Mensaje de bienvenida
    "cta_whatsapp": "string",      // Texto del botón WhatsApp
    "cta_email": "string",         // Texto del botón Email
    "persona": "string"            // Instrucción de rol para el modelo
                                   // Define tono, idioma y comportamiento
  },
  "branding": {
    "accent_color": "string"       // Opcional: sobreescribe --accent del sitio
  }
}
```

---

### `public/chatbot/data/services.json` — Schema

Array de objetos. Cada objeto es un servicio:

```jsonc
[
  {
    "id": "string",                // Identificador único (slug)
    "title": "string",             // Nombre del servicio
    "emoji": "string",             // Ícono visual (1 emoji)
    "tagline": "string",           // Frase corta de una línea
    "description": "string",       // Descripción de 2-3 oraciones
    "includes": ["string"],        // Lista de entregables
    "stack": ["string"],           // Tecnologías usadas
    "price_from": "string",        // Precio base orientativo
    "delivery": "string",          // Tiempo estimado de entrega
    "ideal_for": "string"          // Descripción del cliente ideal
  }
]
```

---

### `public/chatbot/data/articles.json` — Schema

Array de objetos. Índice del blog — el bot puede recomendar artículos:

```jsonc
[
  {
    "id": "string",                // Identificador único (slug)
    "title": "string",             // Título del artículo
    "summary": "string",           // Resumen de 2-3 oraciones para el bot
    "tags": ["string"],            // Tags para búsqueda
    "url": "string",               // Ruta relativa: /blog/slug
    "published": "string",         // Fecha ISO: YYYY-MM-DD
    "reading_time": "string"       // Ej: "8 min"
  }
]
```

---

### Integración en el sitio — `src/layouts/Layout.astro`

El chatbot se inyecta en todas las páginas mediante un script al final
del `<body>` en `Layout.astro`:

```js
const iframe = document.createElement('iframe');
iframe.src = '/chatbot/widget/index.html';
iframe.setAttribute('allowtransparency', 'true');  // necesario para glassmorphism
iframe.setAttribute('allow', 'clipboard-write');   // necesario para botón copiar
iframe.style.cssText = [
  'position:fixed',
  'bottom:0', 'right:0',
  'width:420px', 'height:680px',
  'border:none', 'z-index:9999',
  'background:transparent',
  'pointer-events:none',
  'border-radius:22px',   // redondea el iframe a nivel browser
  'overflow:hidden',
].join(';');
document.body.appendChild(iframe);
iframe.addEventListener('load', () => {
  iframe.style.pointerEvents = 'all';
});
```

El `pointer-events:none` inicial evita que el iframe bloquee clicks
en el sitio mientras carga. Se habilita en el evento `load`.

---

## 7. Variables de entorno

Todas las variables van en `.env` para desarrollo y en el dashboard
de Vercel para producción.

```bash
# .env (desarrollo local)
GEMINI_API_KEY=AIza...          # Requerida. Obtenida en aistudio.google.com
GEMINI_MODEL=gemini-2.0-flash   # Opcional. Permite cambiar el modelo sin redeploy
```

**Cómo agregar una variable en Vercel:**
Settings → Environment Variables → Add → seleccionar entornos
(Production, Preview, Development).

**Importante:** después de agregar o cambiar variables en Vercel,
hacer un redeploy manual para que el Edge Function las tome.

---

## 8. Desarrollo local

### Prerrequisitos

```bash
node --version   # >= 18
npm --version    # >= 9
vercel --version # Vercel CLI instalado globalmente
```

**Instalar Vercel CLI (primera vez):**
```bash
# En WSL/Linux: instalar globalmente en el home del usuario
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g vercel
```

### Setup inicial del proyecto

```bash
# 1. Clonar el repo
git clone <repo-url>
cd portfolio

# 2. Instalar dependencias
npm install

# 3. Linkear con el proyecto de Vercel
vercel link

# 4. Bajar las variables de entorno del proyecto
vercel env pull .env.local
# Esto descarga GEMINI_API_KEY y GEMINI_MODEL al archivo .env.local

# 5. Levantar el entorno completo
vercel dev
# → http://localhost:3000
```

### ¿Por qué `vercel dev` y no `npm run dev`?

`npm run dev` levanta el servidor de desarrollo de Astro pero **no levanta
las Edge Functions**. El chatbot llamaría a `/api/chat` y obtendría 404.

`vercel dev` levanta ambos: el sitio Astro y las Edge Functions. Es el
único comando correcto para desarrollo con chatbot.

### Estructura de ramas recomendada

```
main          → producción (escalatunegocioconia.com)
dev           → staging (preview URL de Vercel)
feature/*     → ramas de feature, generan preview automático
```

---

## 9. Deploy

El deploy es completamente automático:

```
git push origin main
       │
       ▼
Vercel detecta el push
       │
       ▼
Build: astro build
       │
       ├── Genera HTML/CSS/JS estático en dist/
       ├── Compila las Edge Functions en api/
       └── Sube todo al CDN global de Vercel
       │
       ▼
Producción actualizada en ~30 segundos
```

**Preview deploys:** cada push a cualquier rama que no sea `main` genera
una URL de preview única (`*.vercel.app`) con su propio entorno.

**Rollback:** desde el dashboard de Vercel → Deployments → seleccionar
un deploy anterior → Promote to Production.

---

## 10. SEO y metadatos

### JSON-LD estructurado

`Layout.astro` incluye dos bloques JSON-LD en todas las páginas:

**Person:**
```json
{
  "@type": "Person",
  "name": "Nicolás Hruszczak",
  "jobTitle": "Analista Funcional y Desarrollador Full Stack",
  "url": "https://escalatunegocioconia.com",
  "knowsAbout": ["Python", "Astro", "Next.js", "IA", "Agentes de IA"]
}
```

**ProfessionalService:**
```json
{
  "@type": "ProfessionalService",
  "name": "Nicolás Hruszczak — Desarrollo de Software",
  "areaServed": ["Argentina", "United States"],
  "availableLanguage": ["Spanish", "English"],
  "serviceType": ["Desarrollo de software", "Automatización con IA", "SEO/GEO"]
}
```

### Open Graph y Twitter Card

Todas las páginas incluyen metadatos completos para previsualización
en redes sociales. La imagen OG por defecto es `/og-desktop.png`.
Cada página puede sobreescribir con `<slot name="head" />`.

### Sitemap

Generado automáticamente en build time por `pages/sitemap.xml.ts`.
Referenciado en el `<head>` y en `robots.txt`.

### hreflang

Configurado para ES/EN con `x-default` apuntando a la URL canónica.

---

## 11. Accesibilidad

El sitio implementa WCAG 2.1 AA. Características:

- **Skip link** — "Saltar al contenido principal" visible al focus
- **Escala tipográfica** — 3 tamaños desde el panel de accesibilidad (persistido en localStorage)
- **Alto contraste** — clase `.hc` que maximiza contrastes de texto y bordes
- **Reducción de movimiento** — deshabilita todas las animaciones y transiciones
- **Focus visible** — outline de 2px en `var(--accent)` en todos los elementos interactivos
- **ARIA labels** — en todos los botones icon-only y elementos dinámicos
- **aria-live** — en `#chat-messages` para lectores de pantalla

---

## 12. Cómo actualizar contenido

### Agregar un servicio nuevo al chatbot

1. Abrir `public/chatbot/data/services.json`
2. Agregar un objeto al array siguiendo el schema de la sección 6
3. Hacer commit y push — el bot lo conocerá en el próximo request

### Agregar un artículo del blog

1. Crear el archivo Markdown en `src/content/blog/nuevo-articulo.md`
   con el frontmatter requerido
2. Agregar la entrada al índice en `public/chatbot/data/articles.json`
3. Hacer commit y push

### Actualizar información de contacto

Editar `public/chatbot/data/config.json` → campo `owner.contact`.
El header del chatbot actualiza el link `mailto:` automáticamente.

### Cambiar el modelo de Gemini

Actualizar la variable `GEMINI_MODEL` en Vercel → hacer redeploy.
No se toca ningún archivo de código.

### Cambiar el tono del chatbot

Editar el campo `chatbot.persona` en `config.json`. Es el prompt de rol
del modelo — controla idioma, tono, qué decir y qué no decir.

---

## 13. Replicar el chatbot para un cliente

Tiempo estimado: **30–45 minutos por cliente.**

### Paso a paso

**1. Clonar los archivos del chatbot**
```bash
cp -r public/chatbot/ cliente-nombre/chatbot/
cp api/chat.js cliente-nombre/api/chat.js
```

**2. Personalizar los datos**
- `data/config.json` → nombre, bio, contacto, persona del bot
- `data/services.json` → servicios del cliente
- `data/articles.json` → blog del cliente (puede estar vacío: `[]`)

**3. El cliente obtiene su API key de Gemini**
- Ir a [aistudio.google.com](https://aistudio.google.com)
- Crear cuenta con Google
- Click en "Get API key" → "Create API key"
- Sin tarjeta de crédito, sin costo

**4. Cargar la API key en Vercel del cliente**
- Dashboard de Vercel → proyecto del cliente
- Settings → Environment Variables
- Agregar `GEMINI_API_KEY`

**5. Integrar el iframe en el layout del cliente**

Si el sitio es Astro, agregar antes del `</body>`:
```js
const iframe = document.createElement('iframe');
iframe.src = '/chatbot/widget/index.html';
iframe.setAttribute('allowtransparency', 'true');
iframe.setAttribute('allow', 'clipboard-write');
iframe.style.cssText = 'position:fixed;bottom:0;right:0;width:420px;height:680px;border:none;z-index:9999;background:transparent;pointer-events:none;border-radius:22px;overflow:hidden';
document.body.appendChild(iframe);
iframe.addEventListener('load', () => { iframe.style.pointerEvents = 'all'; });
```

Si el sitio es WordPress/Webflow/otro: mismo script en el footer global.

**6. Personalizar el color de acento (opcional)**

En `data/config.json`:
```json
"branding": {
  "accent_color": "hsl(220, 90%, 56%)"
}
```

**7. Verificar**
- Abrir el sitio
- Confirmar que el bot carga y responde
- Abrir DevTools → Network → confirmar que no hay ninguna API key visible
- Navegar entre páginas → confirmar que la conversación persiste

### Qué NO cambia entre clientes

- `api/chat.js` — lógica del proxy (no tocar)
- `widget/index.html` — estructura HTML (no tocar)
- `widget/chat.css` — estilos (no tocar, salvo branding extremo)
- `widget/js/*.js` — lógica del widget (no tocar)

**Solo se modifican los tres JSON de `data/`.**

---

## Límites del free tier de Gemini

| Métrica              | Límite gratuito |
|----------------------|-----------------|
| Requests por minuto  | 15              |
| Requests por día     | 1.500           |
| Tokens por minuto    | 1.000.000       |
| Contexto máximo      | 1.000.000 tokens|

1.500 requests/día equivalen a ~60 conversaciones de 25 mensajes.
Para un portfolio personal o un negocio pequeño, más que suficiente.

Si un cliente supera el límite: plan pago de Gemini desde
**USD 0.075 por millón de tokens de entrada**.

---

*Última actualización: Marzo 2026*
