import type { LandingTemplate } from "../schemas";

/**
 * Resuelve la URL pública de demo para una plantilla.
 * Rutas relativas `/` se resuelven con la base del template PYME (env en la página).
 */
export function resolveTemplateDemoUrl(
  template: LandingTemplate,
  templatePymeBase: string,
): string | null {
  if (template.demoUrl === undefined) return null;
  const { demoUrl } = template;

  if (demoUrl.startsWith("/")) {
    const base = templatePymeBase.endsWith("/")
      ? templatePymeBase
      : `${templatePymeBase}/`;
    return new URL(demoUrl.replace(/^\//, ""), base).href;
  }

  return demoUrl;
}
