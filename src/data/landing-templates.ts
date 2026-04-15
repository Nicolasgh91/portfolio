import { landingTemplatesSchema, type LandingTemplate } from "../schemas";

/** Orden estable para filtros y pills (misma codificación canónica que Zod). */
export const VERTICAL_ORDER = [
  "gastronomia",
  "profesionales",
  "contenido",
  "ecommerce",
  "salud",
  "inmobiliaria",
] as const satisfies ReadonlyArray<LandingTemplate["vertical"]>;

/** Labels de presentación: ningún componente debe hardcodear strings por vertical. */
export const VERTICAL_LABELS: Record<
  LandingTemplate["vertical"],
  { es: string; en: string }
> = {
  gastronomia: { es: "Gastronomía", en: "Food & beverage" },
  profesionales: { es: "Profesionales", en: "Professionals" },
  contenido: { es: "Contenido", en: "Content" },
  ecommerce: { es: "E-commerce", en: "E-commerce" },
  salud: { es: "Salud", en: "Health" },
  inmobiliaria: { es: "Inmobiliaria", en: "Real estate" },
};

const rawLandingTemplates = [
  {
    slug: "menu-digital-viandas",
    title: "Menú digital para viandas",
    titleEn: "Digital menu for meal prep",
    description:
      "Pensado para cocinas y delivery: carta por categorías y pedidos por WhatsApp. Ideal si vendés comida lista o por encargo.",
    descriptionEn:
      "Built for kitchens and delivery: menu by category and WhatsApp orders. Ideal if you sell ready meals or on-demand food.",
    vertical: "gastronomia" as const,
    type: "menu-digital" as const,
    status: "coming_soon" as const,
    features: ["Catálogo por categorías", "CTA a WhatsApp", "SEO local"],
    cardBackground: "dark" as const,
    priceGroup: "basico" as const,
    priceLabel: "Desde ARS 20.000",
    priority: 0.95,
    tags: ["alimentos", "delivery", "WhatsApp"],
  },
  {
    slug: "menu-digital-congelados",
    title: "Menú digital — congelados",
    titleEn: "Digital menu — frozen goods",
    description:
      "Público que vende productos freezer o mayorista: fichas claras, stock y pedidos sin fricción. Próximamente plantilla dedicada.",
    descriptionEn:
      "For frozen or wholesale sellers: clear cards, stock and low-friction orders. Dedicated template coming soon.",
    vertical: "gastronomia" as const,
    type: "menu-digital" as const,
    status: "coming_soon" as const,
    features: ["Grid responsive", "Badges de stock", "Branding cálido"],
    cardBackground: "warm",
    priceGroup: "basico" as const,
    priceLabel: "Desde ARS 20.000",
    priority: 0.85,
    tags: ["congelados", "gastronomía"],
  },
  {
    slug: "portfolio-profesional",
    title: "Portfolio profesional",
    titleEn: "Professional portfolio",
    description: "Estudio, consultora o servicios B2B con tono editorial.",
    descriptionEn: "Studio, consultancy or B2B services with editorial tone.",
    vertical: "profesionales" as const,
    type: "landing" as const,
    status: "available" as const,
    features: ["Hero claro", "Casos y testimonios", "Formulario de contacto"],
    cardBackground: "light",
    demoUrl: "/servicios",
    priceGroup: "plantilla" as const,
    priceLabel: "Desde ARS 35.000",
    priority: 0.9,
    tags: ["servicios", "b2b", "editorial"],
  },
  {
    slug: "hub-creador-contenido",
    title: "Hub para creador de contenido",
    titleEn: "Content creator hub",
    description: "Links, destacados y newsletter en una sola página.",
    descriptionEn: "Links, highlights and newsletter on one page.",
    vertical: "contenido" as const,
    type: "hub-contenido" as const,
    status: "available" as const,
    features: ["Bloques modulares", "Newsletter", "Redes enlazadas"],
    cardBackground: "dark",
    demoUrl: "https://creador-contenido.escalatunegocioconia.com/",
    priceGroup: "plantilla" as const,
    priceLabel: "Desde ARS 35.000",
    priority: 0.88,
    tags: ["creadores", "newsletter"],
  },
  {
    slug: "catalogo-productos",
    title: "Catálogo de productos",
    titleEn: "Product catalog",
    description: "Listado por categorías con fichas y CTA a compra o consulta.",
    descriptionEn: "Category listing with cards and CTA to buy or inquire.",
    vertical: "ecommerce" as const,
    type: "catalogo" as const,
    status: "available" as const,
    features: ["Categorías", "Ficha de producto", "SEO de catálogo"],
    cardBackground: "light",
    demoUrl: "/productos",
    priceGroup: "plantilla" as const,
    priceLabel: "Desde ARS 35.000",
    priority: 0.82,
    tags: ["productos", "ecommerce"],
  },
  {
    slug: "landing-inmobiliaria",
    title: "Landing inmobiliaria",
    titleEn: "Real estate landing",
    description:
      "Para inmobiliarias y corredores: destacar propiedades, generar consultas y confianza. Enfoque distinto al catálogo de productos de retail.",
    descriptionEn:
      "For agencies and brokers: showcase listings, inquiries and trust. A different focus than retail product catalogs.",
    vertical: "inmobiliaria" as const,
    type: "landing" as const,
    status: "coming_soon" as const,
    features: ["Listados", "Galería", "Lead capture"],
    cardBackground: "warm",
    priceGroup: "full" as const,
    priority: 0.8,
    tags: ["inmobiliaria", "leads"],
  },
  {
    slug: "landing-dietetica",
    title: "Landing dietética y bienestar",
    titleEn: "Dietetics and wellness landing",
    description:
      "Nutrición, bienestar o clínicas livianas: servicios, turnos y educación al paciente. Otro ritmo que el ecommerce de productos.",
    descriptionEn:
      "Nutrition, wellness or light clinics: services, bookings and patient education. A different pace than product ecommerce.",
    vertical: "salud" as const,
    type: "landing" as const,
    status: "coming_soon" as const,
    features: [
      "Secciones por servicio",
      "Confianza y credenciales",
      "Contacto",
    ],
    cardBackground: "dark",
    priceGroup: "basico" as const,
    priceLabel: "Consultar",
    priority: 0.78,
    tags: ["salud", "turnos"],
  },
  {
    slug: "landing-consultora",
    title: "Landing consultora",
    titleEn: "Consulting landing",
    description:
      "Propuesta, oferta y agenda en un solo flujo — útil para consultoras que no necesitan el mismo layout que un portfolio creativo.",
    descriptionEn:
      "Offer, proposal and booking in one flow — for consultants who do not need the same layout as a creative portfolio.",
    vertical: "profesionales" as const,
    type: "landing" as const,
    status: "coming_soon" as const,
    features: ["Secciones claras", "Prueba social", "CTA a contacto"],
    cardBackground: "light",
    priceGroup: "basico" as const,
    priceLabel: "Desde ARS 20.000",
    priority: 0.92,
    tags: ["consultora", "servicios"],
  },
] as const;

export const landingTemplates: LandingTemplate[] =
  landingTemplatesSchema.parse(rawLandingTemplates);
