import { pricingPlansSchema, type PricingPlan } from "../schemas";

const rawPricingPlans = [
  {
    id: "basico" as const,
    name: "Básico",
    nameEn: "Basic",
    subtitle: "Una landing page lista para vender",
    subtitleEn: "A landing page ready to sell",
    pitch:
      "Ideal para validar una idea o tener presencia online en una semana.",
    pitchEn:
      "Ideal to validate an idea or have an online presence in one week.",
    price: 30_000,
    priceDetail: "pago único por página",
    features: [
      "Diseño one-page responsive",
      "Formulario de contacto + WhatsApp",
      "SEO básico (title, meta, OG)",
      "Deploy en Vercel (hosting incluido)",
      "1 ronda de revisión",
    ],
    featuresEn: [
      "Responsive one-page design",
      "Contact form + WhatsApp",
      "Basic SEO (title, meta, OG)",
      "Deploy on Vercel (hosting included)",
      "1 revision round",
    ],
    recommended: false,
    ctaText: "Coordinar llamada",
    ctaTextEn: "Book a call",
    ctaHref: "/servicios#contacto",
  },
  {
    id: "plantilla" as const,
    name: "Plantilla disponible",
    nameEn: "Available template",
    subtitle: "Diseño listo para personalizar tu rubro",
    subtitleEn: "Design ready to customize for your industry",
    pitch:
      "Para quien necesita salir rápido con una base profesional ya probada.",
    pitchEn:
      "For those who need to launch fast with a proven professional base.",
    price: 70_000,
    priceDetail: "por única vez — primer mes de mantenimiento incluido",
    features: [
      "Todo lo del plan básico",
      "Catálogo visual por categorías",
      "Chatbot IA integrado",
      "JSON-LD para fragmentos enriquecidos",
      "Google Business optimizado",
      "3 rondas de revisión",
    ],
    featuresEn: [
      "Everything in the basic plan",
      "Visual catalog by categories",
      "Integrated AI chatbot",
      "JSON-LD for rich snippets",
      "Optimized Google Business",
      "3 revision rounds",
    ],
    recommended: true,
    recommendedLabel: "Más elegido",
    recommendedLabelEn: "Most chosen",
    ctaText: "Coordinar llamada",
    ctaTextEn: "Book a call",
    ctaHref: "/servicios#contacto",
  },
  {
    id: "full" as const,
    name: "Full",
    nameEn: "Full",
    subtitle: "Sitio a medida con soporte continuo",
    subtitleEn: "Custom site with ongoing support",
    pitch:
      "Para negocios que necesitan un sitio a medida con mantenimiento continuo.",
    pitchEn: "For businesses that need a custom site with ongoing maintenance.",
    price: 85_000,
    priceDetail: "mensual",
    features: [
      "Sitio a medida completo",
      "Mantenimiento mensual incluido",
      "Carga de pack de imágenes",
      "Contenido y copywriting",
      "Mejoras y funcionalidades extra",
      "Soporte prioritario",
    ],
    featuresEn: [
      "Full custom site",
      "Monthly maintenance included",
      "Image pack upload",
      "Content and copywriting",
      "Ongoing improvements and extra features",
      "Priority support",
    ],
    recommended: false,
    ctaText: "Coordinar llamada",
    ctaTextEn: "Book a call",
    ctaHref: "/servicios#contacto",
  },
] as const;

export const pricingPlans: PricingPlan[] =
  pricingPlansSchema.parse(rawPricingPlans);
