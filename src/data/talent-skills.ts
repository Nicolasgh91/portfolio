/** Static skill data for the talent / portfolio profile page. */

interface BilingualEntry {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

export const talentCapabilities: BilingualEntry[] = [
  {
    title: "Arquitectura de agentes IA",
    titleEn: "AI agent architecture",
    description:
      "Diseño de sistemas multi-agente con memoria persistente, herramientas y planificación autónoma.",
    descriptionEn:
      "Design of multi-agent systems with persistent memory, tools and autonomous planning.",
  },
  {
    title: "Infraestructura y DevOps",
    titleEn: "Infrastructure & DevOps",
    description:
      "Despliegue de servicios en cloud y on-premise, CI/CD, contenedores y monitoreo de producción.",
    descriptionEn:
      "Cloud and on-premise service deployment, CI/CD, containers and production monitoring.",
  },
  {
    title: "Sistemas geoespaciales",
    titleEn: "Geospatial systems",
    description:
      "Análisis y visualización de datos geográficos integrados en plataformas de gestión operativa.",
    descriptionEn:
      "Analysis and visualization of geographic data integrated into operational management platforms.",
  },
];

export const talentSoftSkills: BilingualEntry[] = [
  {
    title: "Comunicación efectiva",
    titleEn: "Effective communication",
    description:
      "Síntesis clara entre contexto técnico y negocio, y documentación acorde a cada audiencia.",
    descriptionEn:
      "Clear synthesis between technical and business context, with documentation suited to each audience.",
  },
  {
    title: "Liderazgo técnico",
    titleEn: "Technical leadership",
    description:
      "Dirección de decisiones de arquitectura, priorización y calidad sin perder velocidad de entrega.",
    descriptionEn:
      "Guiding architecture choices, prioritization, and quality without sacrificing delivery speed.",
  },
  {
    title: "Mentoría y facilitación",
    titleEn: "Mentoring and facilitation",
    description:
      "Acompañamiento a perfiles en formación y dinámicas que alinean al equipo en objetivos comunes.",
    descriptionEn:
      "Support for early-career profiles and facilitation that keeps teams aligned on shared goals.",
  },
  {
    title: "Resolución de conflictos",
    titleEn: "Conflict resolution",
    description:
      "Negociación empática y foco en acuerdos accionables cuando hay tensión técnica u operativa.",
    descriptionEn:
      "Empathetic negotiation and actionable agreements when technical or operational tension arises.",
  },
  {
    title: "Pensamiento sistémico",
    titleEn: "Systems thinking",
    description:
      "Visión integral de dependencias, riesgos y efectos colaterales antes de comprometer cambios.",
    descriptionEn:
      "Holistic view of dependencies, risks, and side effects before committing to change.",
  },
  {
    title: "Gestión de stakeholders",
    titleEn: "Stakeholder management",
    description:
      "Expectativas alineadas, seguimiento de compromisos y comunicación predecible con negocio.",
    descriptionEn:
      "Aligned expectations, commitment tracking, and predictable communication with the business.",
  },
];

const STATUS_LABEL_MAP: Record<string, { es: string; en: string }> = {
  live: { es: "En producción", en: "Live" },
  "in-progress": { es: "En progreso", en: "In progress" },
  completed: { es: "Completado", en: "Completed" },
};

/** Returns a localized label for a project status, falling back to the raw value. */
export function projectStatusLabel(status: string, lang: "es" | "en" = "es") {
  return STATUS_LABEL_MAP[status]?.[lang] ?? status;
}
