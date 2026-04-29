import type { FaqItem } from "../lib/faq-taxonomy";

/** FAQ items for the templates catalog (/plantillas, /en/templates). */
export const templatesFaqEntries: FaqItem[] = [
  {
    order: 1,
    category: "comercial",
    question: "¿Qué diferencia hay entre los planes?",
    questionEn: "What is the difference between plans?",
    answer:
      "El plan básico es una landing one-page con contacto y SEO esencial. El plan plantilla disponible incluye diseño listo para personalizar con catálogo visual, chatbot IA y datos estructurados, más el primer mes de mantenimiento. El plan full es un sitio a medida con mantenimiento mensual, carga de contenido, mejoras continuas y soporte prioritario.",
    answerEn:
      "The basic plan is a one-page landing with contact and essential SEO. The available template plan includes a ready-to-customize design with visual catalog, AI chatbot and structured data, plus the first month of maintenance included. The full plan is a custom site with monthly maintenance, content loading, ongoing improvements and priority support.",
  },
  {
    order: 2,
    category: "proceso",
    question: "¿Cuánto tarda la entrega?",
    questionEn: "How long does delivery take?",
    answer:
      "En la mayoría de los casos entre 1 y 2 semanas desde el kickoff, según contenidos y revisiones acordadas.",
    answerEn:
      "In most cases between 1 and 2 weeks from kickoff, depending on content and review rounds.",
  },
  {
    order: 3,
    category: "soporte",
    question: "¿Puedo cambiar el contenido después?",
    questionEn: "Can I change the content later?",
    answer:
      "Sí. Las plantillas están pensadas para que puedas actualizar textos e imágenes; el alcance de soporte y mantenimiento depende del plan (básico, plantilla disponible o full).",
    answerEn:
      "Yes. Templates are designed so you can update copy and images; support and maintenance scope depends on your plan (basic, available template or full).",
  },
  {
    order: 4,
    category: "tecnico",
    question: "¿Necesito contratar hosting aparte?",
    questionEn: "Do I need separate hosting?",
    answer:
      "No para el deploy en Vercel incluido en los planes listados; dominio y correo pueden gestionarse aparte si lo preferís.",
    answerEn:
      "Not for the Vercel deploy included in these plans; domain and email can be handled separately if you prefer.",
  },
];
