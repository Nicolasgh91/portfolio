/**
 * Anclas alineadas con `Nav.astro` (#agentes-ia, #sitios-web, …).
 *
 * Antes se duplicaba en `Footer.astro` y `src/pages/servicios.astro`; cualquier
 * cambio debe aplicarse aquí (M-09).
 */
export const SERVICE_ANCHOR_MAP: Record<string, string> = {
  'chatbots-ia': 'agentes-ia',
  'landing-page': 'sitios-web',
  'ecommerce-platforms': 'ecommerce',
  'workflow-automation': 'automatizacion',
  'local-llms': 'local-llms',
};

export function serviceAnchorId(slug: string): string {
  return SERVICE_ANCHOR_MAP[slug] ?? `service-${slug}`;
}
