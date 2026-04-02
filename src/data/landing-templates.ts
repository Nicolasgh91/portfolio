export interface LandingTemplate {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  /**
   * URL absoluta del demo menú digital (remix) o ruta relativa (p. ej. `/servicios`)
   * resuelta contra `PUBLIC_TEMPLATE_PYME_URL` en `catalogo-de-landings.astro`.
   */
  demoUrl: string;
}

const defaultDemoUrl = 'https://demo.escalatunegocioconia.com';

export const landingTemplates: LandingTemplate[] = [
  {
    slug: 'menu-digital-viandas',
    title: 'Menú digital para viandas',
    description: 'Catálogo visual, WhatsApp directo, chatbot de pedidos.',
    tags: ['alimentos', 'delivery', 'WhatsApp'],
    demoUrl: defaultDemoUrl,
  },
  {
    slug: 'template-pyme-servicios',
    title: 'Sitio profesional — servicios',
    description:
      'Template editorial para estudios, consultoras y servicios profesionales. Branding azul, diseño editorial.',
    tags: ['servicios', 'b2b', 'editorial', 'estudio contable'],
    demoUrl: '/servicios',
  },
  {
    slug: 'template-pyme-productos',
    title: 'Sitio profesional — gastronomía',
    description:
      'Template cálido para panaderías, viandas y negocios de alimentos. Branding verde, tipografía orgánica.',
    tags: ['productos', 'gastronomía', 'alimentos', 'panadería'],
    demoUrl: '/productos',
  },
];
