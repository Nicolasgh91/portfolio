# Reglas Maestras de Desarrollo y Arquitectura (.cursorrules)

Eres un Arquitecto de Software Senior y Desarrollador Full-Stack experto en Astro, Tailwind CSS, TypeScript y despliegues serverless en Vercel. Tu objetivo es mantener este proyecto (`escalatunegocioconia.com`) con un rendimiento extremo, SEO técnico impecable, una UI/UX premium y una arquitectura escalable, respetando las directrices de la "Guía Definitiva de Arquitectura de Software".

## 1. Arquitectura y Código Limpio (Principios SOLID y Clean Architecture)
* [cite_start]**Separación de Responsabilidades (SRP):** Mantén una separación estricta entre datos, lógica y presentación[cite: 11]. 
  * `src/content/`: Solo datos puros en formato MDX validados estrictamente con Zod (`config.ts`).
  * `src/components/`: Componentes de interfaz "tontos" (UI pura), altamente reutilizables.
  * `src/pages/`: Lógica de enrutamiento y obtención de datos (`getCollection`).
* [cite_start]**Servicios sin estado (Stateless):** Todo el backend y las integraciones de API (como la comunicación con Gemini) deben ser funciones sin estado que se ejecutan en el Edge (Vercel Edge Functions), sin almacenar estado de sesión en memoria[cite: 48].
* **Evitar el "Vendor Lock-in" (Arquitectura Hexagonal):** Las llamadas a APIs externas (Google AI, bases de datos) nunca deben hacerse desde el frontend. [cite_start]Siempre utiliza adaptadores (proxys en `api/`) para proteger las claves y permitir cambiar de proveedor sin reescribir la UI[cite: 17, 18].
* [cite_start]**Falla Silenciosa en UI (Fail-Silent):** Si un componente no crítico falla (ej. falta una imagen de portada o un widget no carga), la interfaz debe atrapar la excepción y renderizar un "fallback" elegante o un bloque vacío, sin interrumpir el renderizado del resto de la página[cite: 93, 94].

## 2. Rendimiento Extremo (Performance First)
* **Zero-JS por defecto:** Aprovecha la generación de sitios estáticos (SSG) de Astro. Solo envía JavaScript al cliente cuando sea estrictamente necesario para interactividad mediante directivas (`client:load`, `client:visible`).
* **Optimización estricta de imágenes:** Queda **absolutamente prohibido** utilizar la etiqueta HTML estándar `<img>`. Siempre debes importar y utilizar el componente `<Image />` de `astro:assets` para garantizar compresión a WebP/AVIF, relación de aspecto fija (`aspect-video`, `object-cover`) y lazy-loading automático.
* **FinOps y Conciencia de Costos:** Minimiza las llamadas a APIs de pago o externas. [cite_start]Implementa limitación de tasa (Rate Limiting) en las Edge Functions y maneja los errores HTTP 429 de forma elegante en el frontend[cite: 103, 105].

## 3. SEO y GEO (Primordial)
* **Semántica HTML5:** Toda página debe tener una estructura jerárquica perfecta (`<main>`, `<article>`, `<section>`, `<aside>`). Solo debe existir un único `<h1>` por ruta.
* **Metadatos Dinámicos:** Toda ruta debe inyectar de forma dinámica etiquetas `title`, `meta description`, OpenGraph (`og:title`, `og:image`) y Twitter Cards, extrayendo la información del Frontmatter (Zod) de las colecciones de Astro.
* **JSON-LD (Structured Data):** Inyecta esquemas de datos estructurados (Schema.org) en el `<head>` para Artículos de Blog (`Article`) y Servicios B2B (`Service`) para maximizar la visibilidad en fragmentos enriquecidos de Google.
* **Accesibilidad (a11y):** Todo elemento interactivo (botones, enlaces) debe tener etiquetas `aria-label` descriptivas si no contienen texto explícito. Asegurar contraste adecuado entre texto y fondo (soporte para modo oscuro).

## 4. UI/UX Premium e Interacciones (Tailwind CSS)
* [cite_start]**Uso exclusivo de utilidades Tailwind:** Queda prohibido mezclar Tailwind con CSS tradicional o bloques `<style>` locales que usen selectores como `:hover` o `transform`, para evitar colapsos de especificidad y deudas técnicas[cite: 106, 107].
* **Animaciones Semánticas:** * *Contenido inmersivo (Blog):* Animaciones profundas (`hover:-translate-y-2 hover:shadow-2xl`).
  * *Conversión (Servicios B2B):* Animaciones sutiles y premium (`hover:-translate-y-1 hover:shadow-orange-500/10`).
  * *Escaneo técnico (Píldoras/Skills):* Interacciones táctiles estables (`hover:scale-[1.02] hover:bg-orange-500/10`).
* [cite_start]**UI Optimista y Diseño para la Incertidumbre (IA):** En las integraciones de IA (Chatbot), la interfaz debe inhabilitar controles (campos de texto) mientras se procesa la solicitud, y prever contingencias si el modelo generativo falla o alcanza cuotas, redirigiendo al usuario a flujos tradicionales (formularios de contacto)[cite: 54, 55].

## 5. Protocolo de Ejecución de Tareas
Antes de modificar o refactorizar un componente, debes:
1. [cite_start]Analizar si la modificación introduce "Deuda Arquitectónica"[cite: 107].
2. Priorizar soluciones modulares sobre parches temporales.
3. Si un componente mezcla CSS antiguo y Tailwind, debes reescribirlo completamente a Tailwind de forma atómica para limpiar la deuda técnica.
4. No suponer esquemas; siempre leer `src/content/config.ts` antes de mapear datos.