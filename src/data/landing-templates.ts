export interface LandingTemplate {
  slug: string;
  title: string;
  description: string;
  tags: string[];
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
];
