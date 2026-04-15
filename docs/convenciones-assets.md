# Convenciones de assets para el blog

## Visor de diapositivas (`SlideViewer`)

Los posts de la colección `blog` pueden incluir en el frontmatter un bloque opcional `slides` (ver `src/content/config.ts`, esquema `blogSlidesSchema`).

### Campos

| Campo        | Rol                                                                                                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`        | Debe coincidir **exactamente** con el nombre de la carpeta bajo `src/assets/slides/<src>/`.                                                                                                                   |
| `alt`        | Texto accesible para el conjunto; cada imagen genera un `alt` del tipo «{alt} - pagina N de M».                                                                                                               |
| `sourceType` | Solo metadato editorial (`pdf` o `pptx`): indica de qué tipo de fuente se exportaron las imágenes. El sitio en runtime **no** sirve PDF ni PPTX; solo archivos **WebP** optimizados por el pipeline de Astro. |

### Convención de archivos

- Ruta: `src/assets/slides/<carpeta>/slide-01.webp`, `slide-02.webp`, …
- El orden de las diapositivas es **numérico** según el sufijo (`01`, `02`, …).
- El componente resuelve los módulos con `import.meta.glob('../assets/slides/**/slide-*.webp', { eager: true })` y filtra por `/slides/${src}/`.

### Relación con el frontmatter

Si `slides` está ausente, no se renderiza el visor. Si está presente pero la carpeta no tiene WebP, `SlideViewer` muestra el estado vacío definido en el componente.

### Otras claves de imagen del blog

`coverImageKey` en el esquema del blog referencia imágenes importadas en código (p. ej. `BlogCard`), no la carpeta `slides/`. No mezclar: portada ≠ carrusel de diapositivas.
