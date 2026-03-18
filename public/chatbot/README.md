# 🤖 Chatbot Widget — Guía de implementación

## Setup en 5 minutos

### 1. Obtener API Key de Gemini (gratis, sin tarjeta)
- Ir a https://aistudio.google.com
- Crear cuenta o ingresar con Google
- Click en "Get API key" → "Create API key"
- Copiar la key

### 2. Poner la API key en el widget
Abrir `widget/chatbot.html` y reemplazar en la línea:
```js
const GEMINI_API_KEY = 'TU_API_KEY_AQUI';
```

### 3. Personalizar los datos
Editar los 3 archivos en `/data/`:
- `config.json` → Nombre, contacto, colores
- `services.json` → Servicios y precios
- `articles.json` → Artículos del blog

# Chatbot Widget — Documentación técnica

Chatbot inteligente integrado como iframe flotante en el sitio. Usa **Gemini 2.x** como modelo de lenguaje a través de una **Vercel Edge Function** que actúa de proxy seguro. Costo operativo cero para volúmenes normales de uso.

---

## Estructura del proyecto

```
portfolio/
│
├── api/
│   └── chat.js                   ← Vercel Edge Function (servidor)
│                                    Proxy seguro a Gemini. Lee la API key
│                                    desde variables de entorno de Vercel.
│                                    Nunca expuesta al browser.
│
├── public/
│   └── chatbot/
│       │
│       ├── widget/               ← El widget como unidad desplegable
│       │   ├── index.html        ← Estructura HTML pura (sin lógica)
│       │   ├── chat.css          ← Todos los estilos del widget
│       │   └── js/
│       │       ├── theme.js      ← Sincronización dark/light con el sitio
│       │       ├── session.js    ← Persistencia del historial
│       │       ├── api.js        ← Carga de datos + system prompt + fetch
│       │       ├── render.js     ← Todo lo que toca el DOM
│       │       └── main.js       ← Estado, eventos, orquestación (entry point)
│       │
│       └── data/                 ← Contenido que "entrena" al bot
│           ├── config.json       ← Identidad, contacto, branding
│           ├── services.json     ← Servicios ofrecidos
│           └── articles.json     ← Índice del blog
│
└── src/
    └── layouts/
        └── Layout.astro          ← Inyecta el iframe en todas las páginas
```

---

## Arquitectura y flujo de datos

```
Usuario escribe
      │
      ▼
  main.js (browser)
      │  construye historial
      ▼
  api.js → buildSystemPrompt()
      │  inyecta datos de los JSON como contexto
      │
      ▼
  fetch POST /api/chat
      │
      ▼
  api/chat.js (servidor Vercel Edge)
      │  lee GEMINI_API_KEY desde env
      │  lee GEMINI_MODEL desde env (fallback: gemini-2.0-flash)
      │
      ▼
  Gemini API
      │
      ▼
  { reply: "..." }
      │
      ▼
  render.js → appendStreamingMessage()
      │  efecto char a char
      ▼
  session.js → saveSession()
      │  persiste en sessionStorage
      ▼
  Usuario ve la respuesta
```

---

## Descripción de cada archivo

### `api/chat.js` — Edge Function (servidor)

**No modificar para cambios de contenido.**

Proxy seguro entre el browser y Gemini. Responsabilidades:
- Leer `GEMINI_API_KEY` y `GEMINI_MODEL` desde variables de entorno de Vercel
- Recibir `{ systemPrompt, history }` del browser
- Llamar a la API de Gemini con esos datos
- Devolver `{ reply }` al browser

Variables de entorno requeridas en Vercel:
```
GEMINI_API_KEY=tu_key_aqui
GEMINI_MODEL=gemini-2.0-flash   # opcional, tiene fallback
```

---

### `public/chatbot/widget/index.html` — Estructura HTML

Solo estructura semántica. No contiene lógica ni estilos inline.
Carga `chat.css` y los módulos JS como `type="module"`.
El orden de los scripts importa: `theme.js` debe ejecutarse primero
para que los tokens CSS estén disponibles antes de que el resto pinte.

---

### `public/chatbot/widget/chat.css` — Estilos

Todos los estilos visuales del widget. Usa los design tokens del sitio
(`--accent`, `--bg-primary`, `--text-primary`, `--radius-*`, etc.)
inyectados dinámicamente por `theme.js`.

Contiene fallbacks HSL completos para cada token, por si `theme.js`
falla (desarrollo sin iframe padre, cross-origin, etc.).

Define 5 variables propias para el efecto glassmorphism:
```css
--chat-blur    /* backdrop-filter */
--chat-shadow  /* sombra de la ventana */
--chat-glass   /* fondo semitransparente de la ventana */
--chat-bubble  /* fondo de burbujas del bot */
--chat-input   /* fondo del textarea */
```

Para cambiar colores del chatbot sin tocar el sistema de diseño del sitio,
modificar solo estas 5 variables en `:root` y `:root.light`.

---

### `public/chatbot/widget/js/theme.js` — Sincronización de tema

Responsabilidades:
1. Leer si el sitio padre está en modo `.light` y aplicarlo al iframe
2. Inyectar todos los tokens CSS del padre directamente como `<style>` inline

Esto elimina la dependencia de `tokens.css` como archivo externo,
evitando el 404 en desarrollo y el flash de color incorrecto al cargar.

Se ejecuta sincrónicamente antes de que el DOM pinte. También observa
cambios en tiempo real via `MutationObserver`, por lo que el tema
del chatbot responde instantáneamente cuando el usuario usa el toggle
dark/light del sitio.

**No requiere modificaciones salvo que cambies el nombre de las variables
en `tokens.css` del sitio principal.**

---

### `public/chatbot/widget/js/session.js` — Persistencia

Guarda y restaura el historial de conversación en `sessionStorage`.
Al navegar entre páginas, el iframe se recarga pero la sesión del
browser se mantiene — el usuario no pierde la conversación.

La sesión se limpia automáticamente al cerrar el tab o el browser.

Exporta tres funciones:
```js
saveSession(history)  // guarda el array de mensajes
loadSession()         // devuelve el array o [] si no hay nada
clearSession()        // borra el historial (útil para "nueva conversación")
```

---

### `public/chatbot/widget/js/api.js` — Datos y llamada a la API

Responsabilidades:
1. **Cargar los JSON** de `public/chatbot/data/` en paralelo
2. **Construir el system prompt** con esos datos (función `buildSystemPrompt`)
3. **Llamar a `/api/chat`** con el prompt y el historial

`buildSystemPrompt` toma los datos de los tres JSON y los convierte
en un prompt estructurado con secciones: SOBRE, SERVICIOS, ARTÍCULOS,
CONTACTO e INSTRUCCIONES. El modelo lee esto como su "conocimiento base".

**Este archivo es el punto de extensión principal** para agregar nuevas
fuentes de contenido al bot (ver sección "Cómo entrenar el bot").

---

### `public/chatbot/widget/js/render.js` — Capa de presentación

Toda la lógica de DOM. No contiene lógica de negocio ni llamadas a API.
Recibe datos, los muestra y devuelve referencias al DOM cuando es necesario.

Exporta:
```js
appendMessage(role, text, extras)    // burbuja estática (user o bot)
appendStreamingMessage(text)         // burbuja con efecto char a char → Promise<bubbleWrap>
showTyping()                         // indicador de tres puntos animados
removeTyping()                       // elimina el indicador
makeCTAs(config)                     // botones WhatsApp / email
markdownToHtml(text)                 // convierte **bold**, *italic*, `code`
```

El efecto streaming simula velocidad de escritura variable (1-3 chars cada
10-18ms) para una experiencia más natural.

---

### `public/chatbot/widget/js/main.js` — Orquestador (entry point)

Estado global y coordinación entre módulos. Es el único archivo que
importa de todos los demás. No debería contener lógica de render ni fetch.

Estado que maneja:
```js
appData   // datos cargados de los JSON
history   // historial de mensajes (formato Gemini)
isOpen    // ventana abierta o cerrada
isLoading // esperando respuesta de la API
```

Comportamiento del toggle:
- **Cruz (✕)**: cierra la ventana, el ícono flotante queda visible
- **Click en ícono**: abre la ventana restaurando exactamente donde estaba
- No hay estado "minimizado" separado — cerrar y abrir es todo

---

### `src/layouts/Layout.astro` — Integración en el sitio

Inyecta el iframe en todas las páginas via un script al final del `<body>`:

```js
const iframe = document.createElement('iframe');
iframe.src = '/chatbot/widget/index.html';
iframe.setAttribute('allowtransparency', 'true');
iframe.setAttribute('allow', 'clipboard-write');
iframe.style.cssText = 'position:fixed;bottom:0;right:0;width:420px;height:680px;border:none;z-index:9999;background:transparent;pointer-events:none';
document.body.appendChild(iframe);
iframe.addEventListener('load', () => { iframe.style.pointerEvents = 'all'; });
```

`allowtransparency="true"` es necesario para que el glassmorphism
funcione — sin esto el browser pone un fondo blanco en el iframe.

---

## Cómo entrenar el bot (agregar / actualizar contenido)

El bot no usa fine-tuning ni embeddings. Su "conocimiento" son los tres
archivos JSON que se inyectan como contexto en cada conversación.
Para actualizar lo que sabe el bot, editá los JSON y hacé redeploy.

### `public/chatbot/data/config.json` — Identidad y configuración

```json
{
  "owner": {
    "name": "Nicolás Hruszczak",
    "role": "Analista Funcional y Desarrollador Full Stack",
    "bio": "Descripción profesional que el bot usará para presentarte.",
    "location": "Buenos Aires, Argentina",
    "languages": ["Español", "Inglés"],
    "availability": "Disponible para nuevos proyectos",
    "contact": {
      "whatsapp": "+54 9 11 XXXX-XXXX",
      "email": "tu@email.com",
      "website": "https://tusitio.com"
    }
  },
  "chatbot": {
    "name": "Asistente de Nicolás",
    "greeting": "Mensaje de bienvenida que aparece al abrir el chat.",
    "cta_whatsapp": "Texto del botón de WhatsApp",
    "cta_email": "Texto del botón de email",
    "persona": "Instrucción de rol para el modelo. Ej: 'Sos un asistente
                 profesional que representa a Nicolás. Respondés en el
                 idioma del usuario. Sos conciso y útil.'"
  },
  "branding": {
    "accent_color": ""   // opcional: sobreescribe --accent del sitio
  }
}
```

**El campo `persona`** es el más importante — define el tono, idioma
y comportamiento del bot. Podés hacerlo más formal, más casual,
más técnico, o darle instrucciones específicas sobre qué decir o no decir.

---

### `public/chatbot/data/services.json` — Servicios

Array de objetos. Cada objeto es un servicio que el bot puede describir
y del que puede dar precios orientativos.

```json
[
  {
    "id": "identificador-unico",
    "title": "Nombre del servicio",
    "emoji": "🤖",
    "tagline": "Frase corta de una línea",
    "description": "Descripción detallada de 2-3 oraciones.",
    "includes": [
      "Item 1 incluido",
      "Item 2 incluido"
    ],
    "stack": ["Tecnología 1", "Tecnología 2"],
    "price_from": "USD 250",
    "delivery": "1-2 semanas",
    "ideal_for": "Descripción del cliente ideal"
  }
]
```

Para **agregar un servicio nuevo**: copiar un objeto existente, cambiar
el `id` y los campos, guardar y hacer redeploy.

Para **desactivar un servicio** sin borrarlo: eliminar el objeto del array
o agregar un campo `"active": false` (aunque actualmente el bot los muestra
todos — ver nota de extensibilidad más abajo).

---

### `public/chatbot/data/articles.json` — Artículos del blog

Índice del blog. El bot puede recomendar artículos y dar sus URLs.
No carga el contenido completo de los artículos (sería demasiado contexto),
solo el título, resumen y URL.

```json
[
  {
    "id": "identificador-unico",
    "title": "Título del artículo",
    "summary": "Resumen de 2-3 oraciones que el bot leerá.",
    "tags": ["tag1", "tag2"],
    "url": "/blog/slug-del-articulo",
    "published": "2025-01-01",
    "reading_time": "8 min"
  }
]
```

**Regla práctica**: agregar cada artículo nuevo aquí al mismo tiempo
que lo publicás. El bot podrá mencionarlo y linkearlo en respuestas.

---

## Límites del free tier de Gemini

| Métrica             | Límite gratuito |
|---------------------|-----------------|
| Requests por minuto | 15              |
| Requests por día    | 1.500           |
| Tokens por minuto   | 1.000.000       |
| Contexto máximo     | 1.000.000 tokens|

Para un portfolio personal, 1.500 req/día es más que suficiente.
Si un cliente necesita más: el plan pago de Gemini arranca en
USD 0.075 por millón de tokens de entrada.

---

## Extender el bot para un cliente nuevo

1. Copiar la carpeta `public/chatbot/data/` en el proyecto del cliente
2. Editar los tres JSON con los datos del cliente
3. Copiar la carpeta `public/chatbot/widget/` sin modificaciones
4. Copiar `api/chat.js` sin modificaciones
5. El cliente crea su propia API key en [aistudio.google.com](https://aistudio.google.com)
6. Cargar `GEMINI_API_KEY` en Vercel del proyecto del cliente
7. Agregar el script del iframe en el layout del cliente

**Tiempo estimado por cliente: 30-45 minutos.**

---

## Notas de extensibilidad

**Para agregar una nueva fuente de datos** (ej: FAQ, testimonios, proyectos):

1. Crear `public/chatbot/data/faq.json` con el contenido
2. En `api.js`, agregar el fetch al `Promise.all` de `loadData()`
3. En `api.js`, agregar la sección correspondiente en `buildSystemPrompt()`

El modelo la incorporará automáticamente en sus respuestas.

**Para filtrar servicios inactivos**, en `api.js` cambiar la línea:
```js
// antes
${services.map(s => ...)}

// después
${services.filter(s => s.active !== false).map(s => ...)}
```

**Para cambiar el modelo**, actualizar la variable de entorno `GEMINI_MODEL`
en Vercel sin tocar ningún archivo de código.

---

## Desarrollo local

```bash
# Requiere Vercel CLI instalado globalmente
npm install -g vercel

# Linkear el proyecto (solo la primera vez)
vercel link

# Bajar las variables de entorno del proyecto
vercel env pull .env.local

# Levantar el entorno (sitio + Edge Functions)
vercel dev
```

`vercel dev` es el único comando que levanta tanto el sitio Astro como
la Edge Function `/api/chat` localmente. `npm run dev` no levanta las
funciones y el chat no funcionará.

---

## Seguridad

La API key de Gemini **nunca toca el browser**. El flujo es:

```
Browser → POST /api/chat (sin key)
              ↓
         api/chat.js lee process.env.GEMINI_API_KEY (servidor)
              ↓
         Gemini API (con key)
              ↓
         { reply } → browser
```

Para protección adicional, se puede restringir la API key al dominio
del proyecto desde Google Cloud Console → APIs & Services → Credentials.