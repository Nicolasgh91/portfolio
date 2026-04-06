# Roadmap de rediseño visual — home, servicios, talento

*Última actualización: 2026-04-05*
*Prerrequisito: auditoría de diseño B2B completada (Silobreaker, SquareBlack, Wix Studio Academy)*

---

## Diagnóstico del estado actual

El sitio actual tiene tres problemas estructurales de diseño que lo alejan del nivel de vanguardia B2B:

1. **Ritmo visual uniforme.** Todas las secciones comparten el mismo fondo claro (`slate-50`/blanco) con padding estándar (`py-12`/`py-16`). No hay quiebres de color que renueven la atención del usuario.
2. **Iconografía genérica.** Las tarjetas de audiencia (empresas/reclutadores) y proyectos usan emojis/iconos que reducen la percepción de seniority. Los referentes analizados eliminan iconos decorativos y los reemplazan por imágenes reales o tipografía monumental.
3. **Escala tipográfica comprimida.** Los datos de impacto (+11 empresas, métricas del hero) están al mismo nivel jerárquico que el texto circundante. En los referentes, los números ocupan 72-96px y funcionan como elemento gráfico dominante.

---

## Principios rectores del rediseño

Extraídos del cruce de los tres referentes:

- **Dark bookend**: hero oscuro + CTA/footer oscuro, contenido claro en el medio.
- **Un CTA por sección**: eliminar botones secundarios que compiten.
- **Macro-whitespace**: `py-24 md:py-32` mínimo entre secciones (80-128px).
- **Tipografía como gráfica**: Outfit Variable en pesos extremos (400 body, 700-900 headlines).
- **Imágenes reales > iconos**: screenshots de proyectos, fotos profesionales, mockups con overlay.
- **Color blocking**: alternar fondos (`bg-slate-950` → `bg-white` → `bg-slate-50` → `bg-orange-50`) para romper la monotonía.

---

## Fase RD-0 — Infraestructura de diseño (tokens + config)

**Objetivo:** preparar el sistema de diseño para soportar las nuevas escalas, animaciones y componentes sin romper lo existente.

**Módulo afectado:** `tokens.css`, `tailwind.config.mjs`

| # | Tarea | Entregable | Detalle |
|---|---|---|---|
| RD-0.1 | Extender escala tipográfica en `tokens.css` | Variables `--text-4xl: 56px`, `--text-5xl: 72px`, `--text-6xl: 96px` | Para métricas monumentales y headlines de hero. Usar `clamp()` para responsividad: `--text-6xl: clamp(3rem, 6vw + 1rem, 6rem)` |
| RD-0.2 | Agregar tokens de spacing macro | `--sp-3xl: 128px`, `--sp-4xl: 160px` en `tokens.css` | Para padding entre secciones de alto impacto |
| RD-0.3 | Registrar animación `scroll` en tailwind config | Keyframe `scroll` para marquee de logos (`translateX(0)` → `translateX(-50%)`) | Agregar en `tailwind.config.mjs` → `theme.extend.animation` y `keyframes` |
| RD-0.4 | Agregar clases de scroll-reveal al safelist | `opacity-0`, `translate-y-4`, `translate-y-0` | Ya definido en la estrategia de animaciones (Alt B). Asegurar que el safelist los incluya |
| RD-0.5 | Crear clase `.section-dark` en `@layer components` | Wrapper que aplica `bg-[--bg-primary] text-[--text-primary]` con inversión de tokens para secciones oscuras dentro de modo claro | Permite color blocking sin duplicar lógica de dark mode |

**Validación:** `wsl npm run typecheck` → `wsl npx astro check` → `wsl npm run build` pasan sin errores.

---

## Fase RD-1 — Rediseño de home (`index.astro`)

**Objetivo:** transformar la landing de un panel administrativo estático a una presentación corporativa inmersiva.

### Descripción visual del resultado esperado

La página abre con un hero de fondo oscuro (`bg-slate-950`) que ocupa el viewport completo. El headline "Software a medida para multiplicar el ROI" aparece en Outfit Variable 700, ~56-72px, blanco, con "multiplicar" resaltado en `text-orange-400` usando `<strong>`. A la derecha, el mockup del dashboard actual se mantiene pero ahora flota sobre el fondo oscuro con una sombra sutil `shadow-2xl shadow-orange-500/10`. Un solo botón CTA naranja ("Diagnóstico gratis →") con flecha SVG inline. El subtítulo descriptivo en Inter regular, `text-lg text-slate-300`, debajo del headline.

Scrolleando, se entra en una sección blanca (`bg-white`) con las dos tarjetas de audiencia (empresas / reclutadores). Los emojis/iconos actuales se eliminan. En su lugar, cada tarjeta ocupa más espacio vertical y el título "Para empresas y pymes" se muestra en Outfit 600, `text-2xl`. El CTA de cada tarjeta mantiene la flecha → pero sin icono decorativo.

La siguiente sección ("Trabajo reciente") se envuelve en un contenedor de ancho completo `bg-slate-950`. Las tarjetas de proyecto dejan de ser cajas blancas con icono+texto: se transforman en contenedores inmersivos. Cada tarjeta usa una imagen real del proyecto (screenshot del sitio en producción) como fondo con `object-cover`, un overlay gradiente `bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent`, y el título + descripción en texto blanco superpuesto en la parte inferior. La tarjeta de "Huella del fuego en Argentina" ocupa `col-span-2` (el doble de ancho), creando asimetría visual. El badge "En progreso" de Double Click se mantiene como chip.

Después aparece una sección nueva: "Métricas de impacto" sobre `bg-slate-50`. Tres columnas con números monumentales en Outfit 900, `text-7xl md:text-8xl text-orange-500`: "+11" (empresas), un porcentaje de reducción de costos, y "24/7" (disponibilidad IA). Debajo de cada número, un descriptor en `text-sm text-slate-500 uppercase tracking-wider`.

La sección de cierre (CTA) usa `bg-orange-600` con texto blanco en lugar del `bg-slate-800` actual, creando un quiebre cromático final. Un solo botón: "Agenda una reunión →" en variante inversa (blanco sobre naranja).

El footer se mantiene en `bg-slate-950`.

### Tareas técnicas

| # | Tarea | Capa | Detalle |
|---|---|---|---|
| RD-1.1 | Hero dark con headline de énfasis selectivo | UI | Envolver hero en `bg-slate-950 min-h-screen`. Headline en Outfit 700 blanco con `<strong class="text-orange-400">` para "multiplicar". Subtítulo en `text-slate-300`. Un solo CTA naranja. Mockup dashboard con `shadow-2xl` |
| RD-1.2 | Eliminar iconos de tarjetas de audiencia | UI | Remover emojis de "Para empresas" y "Para reclutadores". Título en Outfit 600 `text-2xl`. Mantener texto descriptivo y CTA con flecha |
| RD-1.3 | Color block en sección "Trabajo reciente" | UI | Wrapper `w-full bg-slate-950 py-24 md:py-32`. Label "Proyectos" en `text-orange-400 uppercase tracking-widest`. Título "Trabajo reciente" en `text-white` |
| RD-1.4 | Tarjetas de proyecto inmersivas | UI | Reemplazar tarjetas planas por contenedores con imagen de fondo + overlay gradiente + texto blanco superpuesto. Grid `grid-cols-1 md:grid-cols-3` con primera tarjeta en `md:col-span-2`. Eliminar iconos |
| RD-1.5 | Sección de métricas monumentales | UI | Nueva sección `bg-slate-50 py-24 md:py-32`. Tres columnas con números en Outfit 900 `text-7xl md:text-8xl text-orange-500`. Descriptores en `text-sm text-slate-500 uppercase` |
| RD-1.6 | CTA de cierre en naranja | UI | Cambiar fondo del CTA final a `bg-orange-600 rounded-3xl`. Texto blanco. Un solo botón con flecha |
| RD-1.7 | Macro-whitespace global | UI | Reemplazar `py-12`/`py-16` por `py-24 md:py-32` en todas las secciones de la home |

### Obtención de imágenes

| Imagen necesaria | Búsqueda sugerida en Pinterest | Especificaciones |
|---|---|---|
| Background hero (si se opta por foto en lugar de pattern) | "dark office technology abstract background" | Tonal, atmosférica, sin elementos reconocibles. Resolución mínima 1920×1080. Formato: procesar con `<Image>` de Astro a AVIF/WebP |
| Screenshot "Huella del fuego" | Captura real del sitio `huelladeluego.com.ar` en producción | Usar herramienta de captura como GoFullPage o Puppeteer. Resolución 1200×800 mínimo |
| Screenshot "Double Click" | Captura real del panel o demo del sistema | Si no hay captura disponible aún (en progreso), usar mockup placeholder con texto "Coming soon" |
| Imagen profesional para hero alternativo | "saas dashboard dark mode mockup" | Solo si se prefiere un mockup genérico en lugar del dashboard actual |

---

## Fase RD-2 — Rediseño de servicios (`servicios.astro`)

**Objetivo:** transformar el listado plano de servicios en una experiencia de progressive disclosure con color blocking y tarjetas image-dominant.

### Descripción visual del resultado esperado

La página abre con un hero en `bg-white` con layout split: título a la izquierda en Outfit 800, ~48-72px, tracking tight, con acento naranja en la palabra clave ("Soluciones que escalan"). A la derecha, un párrafo descriptivo corto alineado al baseline del título (patrón Silobreaker de asimetría heading/descriptor).

Las tarjetas de servicio abandonan el formato de bento grid con iconos Material Symbols. Se transforman en tiles verticales de ratio ~4:5, estilo Wix Studio Academy: cada tarjeta tiene una imagen/ilustración que ocupa ~60% superior, seguida de un label en `text-xs uppercase tracking-widest text-orange-400`, título en Outfit 600 `text-2xl`, y un CTA "Ver servicio →" con flecha SVG. Las tarjetas no tienen borde visible — la separación se logra con gap en el grid y el contraste de fondo.

La sección de tarjetas alterna fondos: primera fila sobre `bg-white`, segunda fila sobre `bg-slate-50`. Cada servicio que actualmente tiene un icono Material Symbols lo pierde; en su lugar, cada tarjeta muestra una imagen representativa del resultado del servicio (ej: para "Chatbot IA", un screenshot del widget en acción; para "Landing page", un mockup del template-pyme).

Una sección intermedia de "Cómo trabajamos" usa `bg-slate-950 text-white` con tres pasos numerados en tipografía monumental: "01", "02", "03" en Outfit 900 `text-6xl text-orange-500/30` como fondo decorativo, con el título del paso en `text-xl font-bold text-white` superpuesto.

La sección de FAQ usa `<details>` nativo con estilos Tailwind: pregunta como H3, icono "+" que rota a "×", separadores con `border-b border-slate-200`. Cada FAQ inyecta schema FAQPage en JSON-LD.

CTA de cierre idéntico al de home (`bg-orange-600`, un solo botón).

### Tareas técnicas

| # | Tarea | Capa | Detalle |
|---|---|---|---|
| RD-2.1 | Hero split con tipografía asimétrica | UI | Layout `flex justify-between items-end`. Título izquierda en Outfit 800, descriptor derecha alineado al baseline. Sin CTA en hero (el scroll guía al contenido) |
| RD-2.2 | Service cards image-dominant | UI | Reemplazar bento grid actual por grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`. Cada card: `aspect-[4/5] rounded-2xl overflow-hidden`. Imagen arriba, label + título + CTA abajo. Sin iconos Material Symbols |
| RD-2.3 | Sección "Cómo trabajamos" en dark | UI | `bg-slate-950 py-24 md:py-32`. Tres columnas con números `01/02/03` como elementos tipográficos decorativos. Títulos en blanco, descriptores en `text-slate-400` |
| RD-2.4 | FAQ accordion con schema | UI + SEO | Componente `<FAQAccordion>` con `<details>` nativo. Inyectar JSON-LD `FAQPage` vía `<slot name="head">` |
| RD-2.5 | Eliminar todos los iconos Material Symbols de las tarjetas de servicio | UI | Reemplazar por imágenes reales de los entregables de cada servicio |
| RD-2.6 | Color blocking entre secciones | UI | Secuencia: `bg-white` (hero) → `bg-slate-50` (cards fila 1) → `bg-white` (cards fila 2) → `bg-slate-950` (cómo trabajamos) → `bg-white` (FAQ) → `bg-orange-600` (CTA) |

### Obtención de imágenes

| Imagen necesaria | Búsqueda sugerida en Pinterest | Especificaciones |
|---|---|---|
| Card "Chatbot IA" | Captura real del widget de chatbot en `escalatunegocioconia.com` | Screenshot del chatbot abierto en desktop, recortado a ratio 4:5 |
| Card "Landing page" | Captura real de `template-pyme.escalatunegocioconia.com` | Mockup del template "Pérez & Asociados" o "La Miga" |
| Card "E-commerce" | "ecommerce dashboard dark mode ui" en Pinterest | Mockup de catálogo/carrito representativo |
| Card "Automatización" | "workflow automation diagram minimal" en Pinterest | Diagrama visual de flujo simplificado |
| Card "LLMs locales" | "ai neural network abstract dark" en Pinterest | Imagen abstracta técnica |
| Card "Diagnóstico" | "business analytics report dashboard" en Pinterest | Captura o mockup de un reporte de diagnóstico |

---

## Fase RD-3 — Rediseño de talento (`talento.astro`)

**Objetivo:** convertir la página de perfil profesional en una presentación editorial de alto impacto, eliminando iconos genéricos y usando tipografía + imágenes como vehículos de credibilidad.

### Descripción visual del resultado esperado

Hero con gradiente sutil: `bg-gradient-to-br from-slate-900 via-orange-900/10 to-slate-900`. Nombre "Nicolás Hruszczak" en Outfit 800, `text-5xl md:text-6xl text-white`. Debajo, título "Analista funcional · Desarrollador full-stack · Arquitecto de software" en Inter 400, `text-xl text-orange-300`. Sin foto de perfil genérica: el nombre y la tipografía son el elemento visual. Badges de skills principales como pills: `bg-slate-800 text-slate-200 border border-slate-700 rounded-full px-4 py-1.5 text-sm font-medium`.

La sección de "Capacidades técnicas" (actualmente un bento grid con iconos Material Symbols) se transforma radicalmente. Los iconos se eliminan. En su lugar, cada capacidad se presenta como un bloque tipográfico: título grande en Outfit 600 `text-3xl` + descripción corta en Inter `text-base text-slate-400`. Las capacidades se organizan en un grid de 2 columnas con generoso spacing (`gap-12`). Sin cajas, sin bordes, sin iconos — solo tipografía con jerarquía clara.

La sección de "Experiencia y stack" usa la misma base dark (`bg-slate-950`) con logos de tecnologías en versión monocromática blanca organizados en marquee horizontal (patrón SquareBlack). Los logos se muestran en `filter: grayscale(100%) brightness(200%)` sobre el fondo oscuro.

Los proyectos se presentan igual que en la home: tarjetas inmersivas con screenshot de fondo + overlay + texto superpuesto. Sin iconos.

CTA de cierre: "Descargar CV →" o "Contactar →" en `bg-orange-600`.

### Tareas técnicas

| # | Tarea | Capa | Detalle |
|---|---|---|---|
| RD-3.1 | Hero con gradiente y tipografía editorial | UI | `bg-gradient-to-br from-slate-900 via-orange-900/10 to-slate-900 min-h-[60vh]`. Nombre en Outfit 800 `text-5xl md:text-6xl text-white`. Título en Inter `text-xl text-orange-300` |
| RD-3.2 | Eliminar iconos de capacidades técnicas | UI | Remover todos los `material-symbols-outlined` del bento grid. Reemplazar por bloques tipográficos: título `text-3xl font-semibold` + descriptor `text-base text-slate-400`. Grid `grid-cols-1 md:grid-cols-2 gap-12` |
| RD-3.3 | Marquee de logos de tecnologías | UI | Componente `<LogoMarquee>` con animación CSS `@keyframes scroll`. Logos SVG monocromáticos de: Astro, React, TypeScript, Tailwind, Vercel, Supabase, Python, Node.js. Container `bg-slate-950 py-16 overflow-hidden` |
| RD-3.4 | Badges de skills como pills | UI | Pills `rounded-full bg-slate-800 text-slate-200 border border-slate-700 px-4 py-1.5 text-sm`. Agrupados por categoría con label `text-xs uppercase tracking-widest text-slate-500` |
| RD-3.5 | Tarjetas de proyecto inmersivas | UI | Reutilizar el mismo componente `<ProjectCard>` de la home (RD-1.4). Imágenes de fondo con overlay + texto superpuesto. Sin iconos |
| RD-3.6 | CTA de cierre | UI | `bg-orange-600 rounded-3xl py-16 text-center`. Botón "Contactar →" en blanco |

### Obtención de imágenes

| Imagen necesaria | Búsqueda sugerida en Pinterest | Especificaciones |
|---|---|---|
| Logos de tecnologías (SVG) | Descargar de `simpleicons.org` o `devicon.dev` | SVGs monocromáticos (blanco). Un archivo por tecnología. Procesar con `<Image>` de Astro |
| Screenshots de proyectos | Capturas reales (igual que home) | Reutilizar las mismas imágenes de RD-1.4 |

---

## Fase RD-4 — Animaciones y micro-interacciones

**Objetivo:** agregar scroll-reveal y hover effects que refuercen la percepción premium sin comprometer performance.

**Prerrequisito:** fases RD-1, RD-2 y RD-3 completadas.

| # | Tarea | Detalle |
|---|---|---|
| RD-4.1 | Scroll-reveal Alt B (slide alternado) en home y servicios | Implementar según la estrategia ya auditada. `is:inline` script. Intersection Observer nativo. Clases base: `opacity-0 translate-y-4` → `opacity-100 translate-y-0 transition-all duration-700`. Stagger cap: `Math.min(i * 100, 600)` |
| RD-4.2 | Hover en tarjetas de proyecto | `group-hover:scale-105 transition-transform duration-500` en la imagen interna. Overlay se aclara levemente: `group-hover:from-slate-950/80` |
| RD-4.3 | Hover en service cards | Imagen interna escala 1.03 (`group-hover:scale-[1.03]`). Label naranja intensifica opacidad |
| RD-4.4 | Fallback `prefers-reduced-motion` | `@media (prefers-reduced-motion: reduce)` deshabilita todas las transiciones. Clase `no-js` en `<html>` asegura visibilidad sin JS |
| RD-4.5 | Animación de marquee de logos | CSS puro: `animation: scroll 30s linear infinite`. Pausa en hover: `hover:animation-play-state: paused` (via Tailwind arbitrary) |

---

## Componentes reutilizables

Los siguientes componentes nuevos se crean durante el rediseño y quedan disponibles para reutilización en cualquier página del sitio actual o futuros sitios de clientes. Todos viven en `src/components/` y siguen las reglas del proyecto: Tailwind utilities only, sin `<style>` local, documentación pareada en `docs/componentes/`.

### 1. `<SectionWrapper>` — Contenedor de sección con color blocking

**Props:**
- `bg`: string — clase Tailwind de fondo (`"bg-slate-950"`, `"bg-white"`, `"bg-orange-600"`)
- `padding`: string — override de padding (default: `"py-24 md:py-32"`)
- `maxWidth`: string — ancho máximo (default: `"max-w-7xl"`)
- `dark`: boolean — si `true`, aplica `text-white` y ajusta colores de texto children
- `id`: string — para anclas de navegación

**Uso:**
```astro
<SectionWrapper bg="bg-slate-950" dark id="proyectos">
  <h2>Trabajo reciente</h2>
  <!-- contenido -->
</SectionWrapper>
```

**Reutilización:** cualquier página que necesite secciones con fondos alternados. Elimina la repetición de padding/maxWidth/contenedor en cada `<section>`.

---

### 2. `<MetricDisplay>` — Número monumental con descriptor

**Props:**
- `value`: string — el número o dato (`"+11"`, `"24/7"`, `"-40%"`)
- `label`: string — descriptor corto (`"empresas"`, `"disponibilidad IA"`)
- `color`: string — clase de color del número (default: `"text-orange-500"`)

**Renderiza:** número en Outfit 900 `text-7xl md:text-8xl tracking-tighter` + label en `text-sm text-slate-500 uppercase tracking-wider mt-2`.

**Reutilización:** sección de métricas en cualquier landing page de cliente. Casos de estudio en blog. Dashboards estáticos.

---

### 3. `<ProjectCard>` — Tarjeta de proyecto inmersiva

**Props:**
- `title`: string
- `description`: string
- `image`: ImageMetadata — imagen importada de `src/assets/`
- `href`: string — link al detalle del proyecto
- `badge`: string | undefined — texto del chip ("En progreso", "Nuevo")
- `span`: number — `1` o `2` para controlar `col-span` en el grid

**Renderiza:** contenedor `rounded-2xl overflow-hidden relative` con `<Image>` como fondo + overlay gradiente `bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent` + título/descripción/badge superpuestos en blanco. Hover: imagen escala 1.05, overlay se aclara.

**Reutilización:** home, talento, cualquier página de portfolio. Plantillas de clientes con sección de proyectos.

---

### 4. `<LogoMarquee>` — Carrusel infinito de logos

**Props:**
- `logos`: array de `{ src: ImageMetadata, alt: string }`
- `speed`: number — duración de la animación en segundos (default: `30`)
- `direction`: `"left"` | `"right"` (default: `"left"`)

**Renderiza:** contenedor `overflow-hidden` con dos copias del strip de logos en `flex gap-16`, animadas con `animate-scroll`. Logos renderizados con `<Image>` en `h-8 w-auto filter grayscale brightness-200`.

**Reutilización:** social proof en landing pages de clientes. Sección de partners/tecnologías en cualquier sitio.

---

### 5. `<FAQAccordion>` — Acordeón con schema SEO

**Props:**
- `items`: array de `{ question: string, answer: string }`

**Renderiza:** cada item como `<details>` con `<summary>` estilizado (H3 + ícono +/×). Inyecta JSON-LD `FAQPage` automáticamente en `<slot name="head">`.

**Reutilización:** página de servicios, páginas individuales de servicio, landing pages de clientes, página de plantillas (ya planificada).

---

### 6. CTAs con flecha — patrón en tokens (sin componente dedicado)

**Implementación:** `docs/componentes/btn-bounce.md` + `.btn-primary` / `.btn-secondary` en `src/styles/tokens.css`. Los cierres en bloques `tone="accent"` (p. ej. `/talento`, `/servicios`) usan **`btn-secondary btn-bounce`** y `span.arrow`, no un componente Astro aparte.

---

### 7. `<SectionLabel>` — Etiqueta de sección

**Props:**
- `text`: string
- `color`: string (default: `"text-orange-400"`)

**Renderiza:** `<span>` en `text-xs uppercase tracking-widest font-bold` con el color indicado. Estandariza los labels "PROYECTOS", "SERVICIOS", etc.

**Reutilización:** todas las páginas con secciones etiquetadas. Garantiza consistencia tipográfica de los labels sin repetir clases.

---

## Mapa de reutilización por página

| Componente | Home | Servicios | Talento | Blog | Plantillas | Template-pyme | Cliente futuro |
|---|---|---|---|---|---|---|---|
| `<SectionWrapper>` | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ |
| `<MetricDisplay>` | ✅ | — | — | — | — | — | ✅ |
| `<ProjectCard>` | ✅ | — | ✅ | — | — | — | ✅ |
| `<LogoMarquee>` | — | — | ✅ | — | — | — | ✅ |
| `<FAQAccordion>` | — | ✅ | — | — | ✅ | — | ✅ |
| `<SectionLabel>` | ✅ | ✅ | ✅ | — | ✅ | — | ✅ |

---

## Orden de ejecución recomendado

```
RD-0 (tokens + config)          ← 1 sesión
  │
  ├── RD-1 (home)               ← 2-3 sesiones
  │     ├── RD-1.1 Hero dark
  │     ├── RD-1.2 Tarjetas audiencia (sin iconos)
  │     ├── RD-1.3 Color block proyectos
  │     ├── RD-1.4 ProjectCard inmersivo  ← componente reutilizable
  │     ├── RD-1.5 Métricas monumentales  ← componente reutilizable
  │     ├── RD-1.6 CTA naranja
  │     └── RD-1.7 Macro-whitespace
  │
  ├── RD-2 (servicios)          ← 2-3 sesiones
  │     ├── RD-2.1 Hero split
  │     ├── RD-2.2 Service cards image-dominant
  │     ├── RD-2.3 "Cómo trabajamos" dark
  │     ├── RD-2.4 FAQAccordion + schema  ← componente reutilizable
  │     ├── RD-2.5 Eliminar iconos
  │     └── RD-2.6 Color blocking
  │
  ├── RD-3 (talento)            ← 2 sesiones
  │     ├── RD-3.1 Hero gradiente
  │     ├── RD-3.2 Capacidades sin iconos
  │     ├── RD-3.3 LogoMarquee           ← componente reutilizable
  │     ├── RD-3.4 Badges pills
  │     ├── RD-3.5 ProjectCard (reutiliza)
  │     └── RD-3.6 CTA cierre
  │
  └── RD-4 (animaciones)        ← 1 sesión
        ├── RD-4.1 Scroll-reveal
        ├── RD-4.2 Hover proyectos
        ├── RD-4.3 Hover servicios
        ├── RD-4.4 Reduced-motion
        └── RD-4.5 Marquee animation
```

**Estimación total:** 8-10 sesiones de trabajo con el agente de código.

---

## Documentación requerida (por regla del proyecto)

Cada componente nuevo genera una entrada pareada en `docs/componentes/`:

- `docs/componentes/SectionWrapper.md`
- `docs/componentes/MetricDisplay.md`
- `docs/componentes/ProjectCard.md`
- `docs/componentes/LogoMarquee.md`
- `docs/componentes/FAQAccordion.md`
- `docs/componentes/btn-bounce.md` (patrón CTA con flecha)
- `docs/componentes/SectionLabel.md`

Cualquier componente entregado sin su markdown pareado se registra como deuda técnica en `docs/deuda-tecnica.md`.
