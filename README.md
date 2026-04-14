# escalatunegocioconia.com — Full Stack SaaS Architecture

Plataforma SaaS-ready diseñada para la integración de servicios digitales y automatización mediante inteligencia artificial. Este portfolio técnico sirve para mostrar los proyectos en los cuales trabajé.

**Sitio web:** [escalatunegocioconia.com](https://escalatunegocioconia.com)

---

## Stack tecnológico

![Astro](https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

---

## Arquitectura de software

El proyecto implementa un modelo híbrido estático-dinámico para maximizar el rendimiento y la seguridad:

1. **Static Site Generation (SSG):** Pre-renderizado completo de rutas para optimizar el SEO y garantizar tiempos de carga inferiores a 1 segundo.
2. **Edge-side api proxy:** Capa de seguridad en el servidor (Vercel Edge) que protege las claves de API, evitando su exposición en el cliente.
3. **Persistencia de sesión:** Sistema de gestión de estado asíncrono mediante `sessionStorage` para mantener el contexto de la conversación durante la navegación.

---

## Producto destacado: Chatbot widget inteligente

Desarrollo de un motor de chatbot agnóstico al framework capaz de integrarse en cualquier plataforma web.

* **Context discovery (RAG):** El sistema consume dinámicamente archivos JSON para adquirir contexto sobre servicios y contenidos sin requerir re-entrenamiento del modelo.
* **Optimización de carga:** Inyección mediante iframe con carga diferida para no penalizar el hilo principal de procesamiento de la página anfitriona.
* **Branding adaptativo:** Lógica que hereda automáticamente los tokens de diseño (CSS variables) del sitio padre para garantizar una integración visual coherente.

---

## Desafíos técnicos y soluciones de ingeniería

Durante el desarrollo de la plataforma, se resolvieron problemas complejos de arquitectura y rendimiento que demuestran un dominio avanzado del entorno web moderno:

### Optimización del renderizado y UX

* **Persistencia de tema sin parpadeo (FOUT):** En un entorno puramente estático (SSG), se implementó un script síncrono bloqueante en el `head` para procesar la preferencia del usuario antes del primer renderizado. Esto garantiza una experiencia visual fluida sin destellos de color incorrectos.
* **Sincronización de UI en micro-frontends (Iframes):** Para mantener la coherencia visual del chatbot (que reside en un documento aislado), se desarrolló un sistema de inyección dinámica de tokens CSS. Mediante un `MutationObserver`, el widget replica en tiempo real los cambios de estilo del sitio padre, asegurando una identidad visual unificada.

### Seguridad y resiliencia en arquitecturas Serverless

* **Protección de activos sensibles en sitios estáticos:** Ante la ausencia de un backend tradicional, se diseñó una arquitectura de intermediación mediante **Vercel Edge Functions**. Esto permite consumir servicios de inteligencia artificial (Gemini API) manteniendo las llaves de acceso cifradas en el servidor, sin exposición alguna en el cliente.
* **Gestión de errores y degradación controlada:** Se implementó un patrón de **Circuit Breaker** en el cliente para gestionar límites de cuota (Rate Limiting). Ante respuestas de saturación de la API, el sistema redirige automáticamente al usuario hacia canales de contacto tradicionales, preservando la usabilidad.

### Ingeniería de componentes y rendimiento de scroll

* **Visualización de datos de altura indeterminada:** Se resolvió la limitación del `IntersectionObserver` en contenedores extensos mediante el uso de `rootMargin` y un ajuste de umbral de activación (`threshold`). Esto garantiza que las animaciones y eventos de carga se disparen con precisión quirúrgica independientemente del tamaño del contenido.
* **Adaptación a bundlers modernos (Astro):** Se corrigió la pérdida de referencia en scripts modulizados reemplazando patrones obsoletos por una arquitectura basada en identificadores únicos y definición de variables en tiempo de compilación.

### Arquitectura CSS y escalabilidad del diseño

* **Sistema de diseño basado en tokens:** Se optó por una gestión de temas centralizada en variables CSS puras en lugar de utilidades de framework. Esto simplifica el mantenimiento y permite que componentes externos (como el chatbot) consuman el sistema de diseño de forma agnóstica.
* **Auditoría de colapso de márgenes:** Se estableció una regla estricta de control de espaciado vertical para evitar la acumulación de márgenes en componentes anidados, garantizando una grilla visual perfectamente balanceada.
---

## Formación y enfoque profesional

Como estudiante de la Licenciatura en Gestión de Tecnología de la Información (UADE), aplico una visión que combina la ingeniería de software con el análisis funcional:

* **Arquitectura de datos:** Diseño de estructuras eficientes y tipado fuerte utilizando TypeScript y Zod.
* **Gestión de proyectos IT:** Aplicación de ciclos de vida de software (SDLC) profesionales, desde el relevamiento funcional hasta el despliegue continuo.
* **Capacidad full stack:** Desarrollo equilibrado entre interfaces optimizadas y arquitecturas de software escalable, segura y eficiente.

---

## Estructura del repositorio

```text
├── api/             # Backend: Edge Functions (Node.js/Edge runtime)
├── src/
│   ├── content/     # CMS: MDX con validación de esquemas vía Zod
│   ├── layouts/     # SEO: Metadatos dinámicos y JSON-LD
│   └── styles/      # Design system: Tokens basados en HSL
└── public/chatbot/  # Producto: Widget modular en Vanilla JavaScript
