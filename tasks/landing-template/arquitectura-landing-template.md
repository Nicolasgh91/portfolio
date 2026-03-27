# Arquitectura — Sistema de landing templates replicables

*Proyecto: escalatunegocioconia.com*
*Última actualización: 2026-03-26*

---

## Visión general

El sistema permite ofrecer y demostrar templates de landing pages como servicio comercial. Cada template es una aplicación Vite + React independiente, desplegada como proyecto Vercel separado. El sitio principal (Astro SSG) actúa como vitrina y punto de entrada; los templates viven en subdominios o dominios propios.

```
escalatunegocioconia.com (Astro SSG — vitrina)
│
├── /servicios
│     └── Tarjeta "Landing page y menú digital"
│           └── href → /catalogo-de-landings
│
├── /catalogo-de-landings (Astro SSG — índice)
│     └── Enlace → demo.escalatunegocioconia.com
│
demo.escalatunegocioconia.com (Vite SPA — demo del template)
│
└── [cliente-N].com (Vite SPA — instancia de producción por cliente)
```

---

## Componentes y responsabilidades

### 1. Sitio principal — `escalatunegocioconia.com`

| Componente | Responsabilidad |
|---|---|
| `ServiceCard.astro` | Renderiza tarjeta de servicio. Cuando `href` está presente en el frontmatter, la tarjeta completa se convierte en enlace |
| `landing-page.mdx` | Fuente de datos del servicio. El campo `href: "/catalogo-de-landings"` conecta la tarjeta con la página de catálogo |
| `catalogo-de-landings.astro` | Página índice de templates disponibles. Lee `PUBLIC_DEMO_LANDING_URL` del entorno para apuntar al template correcto según el contexto (desarrollo o producción) |

### 2. Página de catálogo — `catalogo-de-landings.astro`

Página Astro estática mínima. Su única responsabilidad es listar los templates disponibles con enlace al deploy correspondiente. No contiene lógica de negocio.

Spec del archivo:

```astro
---
import Layout from '../layouts/Layout.astro';

// La URL se resuelve por entorno: local → localhost:5173, prod → subdominio
const demoUrl = import.meta.env.PUBLIC_DEMO_LANDING_URL
  ?? "https://demo.escalatunegocioconia.com";

const templates = [
  {
    slug: "menu-digital-viandas",
    title: "Menú digital para viandas",
    description: "Catálogo visual, WhatsApp directo, chatbot de pedidos.",
    url: demoUrl,
    tags: ["alimentos", "delivery", "WhatsApp"],
  }
  // Agregar nuevos templates aquí como objetos del array
];
---
<Layout
  title="Catálogo de landings — escalatunegocioconia.com"
  description="Templates de landing pages disponibles para tu negocio."
>
  <main>
    <h1>Catálogo de landings</h1>
    {templates.map(t => (
      <article>
        <h2>{t.title}</h2>
        <p>{t.description}</p>
        <a href={t.url} target="_blank" rel="noopener noreferrer">
          Ver demo →
        </a>
      </article>
    ))}
  </main>
</Layout>
```

**Regla de escalabilidad:** para agregar un nuevo template al catálogo, solo se agrega un objeto al array `templates`. No se crea una nueva página ni se modifica el layout.

### 3. Template — `remix-of-personal-blog`

Aplicación Vite + React independiente. Stack completo:

| Capa | Tecnología |
|---|---|
| Build | Vite 5 |
| UI | React 18 + React Router DOM v6 |
| Componentes | shadcn/ui (Radix primitivos) |
| Estilos | Tailwind CSS v3 |
| Estado servidor | TanStack Query |
| Formularios | React Hook Form + Zod |
| Deploy | Vercel (proyecto separado) |

Límites del template: es una SPA client-side. No hay SSR ni SSG. No aporta beneficio SEO propio — ver sección de SEO más abajo.

---

## Variables de personalización por cliente

Cuando se replica el template para un cliente, los únicos archivos que se modifican son los de datos. El código de componentes no se toca.

| Variable | Archivo | Descripción |
|---|---|---|
| Nombre del negocio | `src/config/business.ts` (crear si no existe) o constantes en `App.tsx` | Razón social o nombre comercial |
| Paleta de colores | `tailwind.config.ts` → `theme.extend.colors` | Colores de marca del cliente |
| Contenido del catálogo | `src/data/products.ts` o equivalente | Ítems del menú/catálogo |
| Logo e imágenes | `public/` | Assets estáticos del cliente |
| WhatsApp número | Constante de configuración | Número de destino del carrito |
| `robots.txt` | `public/robots.txt` | `Disallow: /` en demo, `Allow: /` en producción del cliente |

**Regla:** si para personalizar el template hace falta tocar un componente, eso es una deuda de arquitectura. El componente debe parametrizarse para aceptar la variación como prop o como dato de configuración.

---

## Flujo de deploy por cliente

```
1. Fork de github.com/Nicolasgh91/remix-of-personal-blog
      ↓
2. Clonar el fork localmente
      ↓
3. Modificar solo archivos de datos/config (ver tabla arriba)
      ↓
4. Push al repo del fork
      ↓
5. Vercel → "Add new project" → importar el fork
   Framework: Vite | Build: npm run build | Output: dist
      ↓
6. Asignar dominio:
   Opción A — subdominio propio: demo.[cliente].com → CNAME vercel-dns.com
   Opción B — subdominio de escalatunegocioconia: [cliente].escalatunegocioconia.com
      ↓
7. Cambiar robots.txt → Allow: / cuando el contenido sea real
      ↓
8. Documentar en src/content/projects/[slug-cliente].mdx
```

Tiempo estimado de replicación: 2–4 horas para personalización y deploy.

---

## Entorno de desarrollo local

Los dos proyectos corren en puertos separados. No hay proxy ni configuración especial.

```
Terminal 1 — sitio principal
  cd escalatunegocioconia/
  vercel dev → localhost:3000

Terminal 2 — template
  cd remix-of-personal-blog/
  npm run dev → localhost:5173
```

La variable `PUBLIC_DEMO_LANDING_URL` en `.env.local` del sitio principal apunta a `http://localhost:5173`. En producción (Vercel env vars), apunta a `https://demo.escalatunegocioconia.com`.

```
# .env.local (desarrollo — no commitear)
PUBLIC_DEMO_LANDING_URL=http://localhost:5173

# Vercel dashboard (producción)
PUBLIC_DEMO_LANDING_URL=https://demo.escalatunegocioconia.com
```

---

## SEO y visibilidad

| Contexto | Tratamiento | Justificación |
|---|---|---|
| `/catalogo-de-landings` (Astro) | Indexable. Metadatos propios. Incluida en sitemap | Es SSG: el HTML llega completo al crawler |
| `demo.escalatunegocioconia.com` | `noindex, nofollow`. `robots.txt: Disallow: /` | SPA sin SSR: el HTML inicial está vacío. El crawler no puede leer el contenido. Además es demo con datos ficticios |
| Instancia de producción de un cliente | `Allow: /` cuando el contenido sea real. Metadatos reales en `index.html` | El cliente puede querer indexación orgánica |

**Limitación conocida:** sin SSR, el template no puede aportar metadatos dinámicos por ruta. Si en el futuro se necesita SEO real para el template (por ejemplo, un cliente que quiera que su menú aparezca en Google), la solución es migrar a Astro SSG o agregar `vite-plugin-ssr`. Esto es trabajo de fase posterior, no ahora.

---

## Costos Vercel

| Proyecto | Plan | Costo |
|---|---|---|
| `escalatunegocioconia.com` | Hobby | $0 |
| `demo.escalatunegocioconia.com` | Hobby | $0 |
| Instancia cliente (fork en repo propio) | Hobby (cuenta del cliente) o Hobby propia | $0 |

El plan Hobby permite proyectos ilimitados. Cada proyecto tiene 100 GB de bandwidth y 6.000 minutos de build por mes. Una SPA estática con tráfico de demo no se acerca a esos límites.

**Único vector de costo:** si se escala a 10+ clientes activos con tráfico real, evaluar si conviene centralizar en una cuenta Vercel Pro ($20/mes) para tener analytics unificados y soporte prioritario.

---

## Restricciones y contratos de arquitectura

1. **Un repo por cliente.** Nunca reutilizar el mismo repo para múltiples clientes. Los datos de un cliente no deben estar en el mismo repositorio que los de otro.

2. **El código de componentes no se toca al personalizar.** Si hace falta modificar un componente para adaptarlo a un cliente, ese componente necesita ser refactorizado para aceptar la variación como configuración.

3. **La jerarquía de implementación siempre es Schema → Flow → API → UI.** Si el template necesita una fuente de datos externa en el futuro (Supabase, API propia), implementar primero el schema de los datos antes de tocar cualquier componente.

4. **`lovable-tagger` solo en desarrollo.** Si se actualiza el template desde Lovable, verificar que el plugin no esté activo en el build de producción.

5. **`robots.txt: Disallow` en demos, `Allow` en producción.** Esta regla se aplica sin excepciones. Una demo indexada con datos ficticios daña el SEO del dominio principal.
