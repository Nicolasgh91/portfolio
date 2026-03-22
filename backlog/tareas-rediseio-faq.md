<style>
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

  .faq-wrap {
    background: #0e0e0e;
    padding: 3rem 2rem;
    border-radius: 16px;
    font-family: 'DM Sans', sans-serif;
  }

  .faq-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: start;
    margin-bottom: 3rem;
  }

  .faq-label {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #f0a500;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .faq-title {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: #f5f5f0;
    margin: 0 0 12px;
    line-height: 1.15;
  }

  .faq-intro {
    font-size: 14px;
    color: #666;
    line-height: 1.7;
    margin: 0;
  }

  .faq-cta-box {
    background: #141414;
    border: 0.5px solid #252525;
    border-radius: 14px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .faq-cta-title {
    font-family: 'Syne', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #f5f5f0;
    margin: 0;
    line-height: 1.3;
  }

  .faq-cta-sub {
    font-size: 13px;
    color: #666;
    margin: 0;
    line-height: 1.6;
  }

  .faq-cta-btn {
    font-size: 13px;
    font-weight: 500;
    color: #0e0e0e;
    background: #f0a500;
    border: none;
    padding: 11px 20px;
    border-radius: 9px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    width: fit-content;
    transition: opacity 0.15s;
  }

  .faq-cta-btn:hover { opacity: 0.85; }

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .faq-item {
    border: 0.5px solid #1e1e1e;
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.2s;
    background: #111;
  }

  .faq-item.open {
    border-color: #2a2a2a;
    background: #141414;
  }

  .faq-question {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 22px;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
  }

  .faq-q-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .faq-tag {
    font-size: 10px;
    font-weight: 500;
    padding: 3px 9px;
    border-radius: 6px;
    white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
    flex-shrink: 0;
  }

  .tag-proceso  { background: rgba(240,165,0,0.1);  color: #f0a500;  border: 0.5px solid rgba(240,165,0,0.2); }
  .tag-comercial{ background: rgba(76,175,125,0.1); color: #4caf7d; border: 0.5px solid rgba(76,175,125,0.2); }
  .tag-tecnico  { background: rgba(120,100,220,0.1);color: #a088f0; border: 0.5px solid rgba(120,100,220,0.2); }
  .tag-soporte  { background: rgba(80,160,220,0.1); color: #6ab4e8; border: 0.5px solid rgba(80,160,220,0.2); }

  .faq-q-text {
    font-size: 15px;
    font-weight: 500;
    color: #ddd;
    line-height: 1.4;
    transition: color 0.15s;
  }

  .faq-item.open .faq-q-text { color: #f5f5f0; }

  .faq-icon {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 0.5px solid #2a2a2a;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s, border-color 0.2s, transform 0.25s;
    background: #1a1a1a;
  }

  .faq-item.open .faq-icon {
    background: #f0a500;
    border-color: #f0a500;
    transform: rotate(45deg);
  }

  .faq-icon-plus {
    position: relative;
    width: 10px;
    height: 10px;
  }

  .faq-icon-plus::before,
  .faq-icon-plus::after {
    content: '';
    position: absolute;
    background: #888;
    border-radius: 1px;
    transition: background 0.2s;
  }

  .faq-icon-plus::before { width: 10px; height: 1.5px; top: 4px; left: 0; }
  .faq-icon-plus::after  { width: 1.5px; height: 10px; top: 0; left: 4px; }

  .faq-item.open .faq-icon-plus::before,
  .faq-item.open .faq-icon-plus::after { background: #0e0e0e; }

  .faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1);
  }

  .faq-item.open .faq-answer { max-height: 300px; }

  .faq-answer-inner {
    padding: 0 22px 22px 22px;
    padding-left: calc(22px + 14px + 52px);
  }

  .faq-answer-text {
    font-size: 14px;
    color: #888;
    line-height: 1.75;
    margin: 0 0 12px;
  }

  .faq-answer-highlight {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: rgba(240,165,0,0.05);
    border: 0.5px solid rgba(240,165,0,0.15);
    border-radius: 8px;
    padding: 12px 14px;
    margin-top: 4px;
  }

  .faq-highlight-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #f0a500;
    flex-shrink: 0;
    margin-top: 5px;
  }

  .faq-highlight-text {
    font-size: 13px;
    color: #bbb;
    line-height: 1.6;
    margin: 0;
  }

  @media (max-width: 620px) {
    .faq-header { grid-template-columns: 1fr; }
    .faq-answer-inner { padding-left: 22px; }
    .faq-tag { display: none; }
  }
</style>

<div class="faq-wrap">
  <div class="faq-header">
    <div>
      <p class="faq-label">Preguntas frecuentes</p>
      <h2 class="faq-title">Todo lo que necesitás saber antes de arrancar</h2>
      <p class="faq-intro">Respondemos las dudas que más aparecen antes de una primera reunión. Si no encontrás lo que buscás, el diagnóstico gratuito no tiene costo ni compromiso.</p>
    </div>
    <div class="faq-cta-box">
      <p class="faq-cta-title">¿Tenés una duda que no está acá?</p>
      <p class="faq-cta-sub">Agendá un diagnóstico gratuito de 30 minutos. Analizamos tu operación y te decimos si tiene sentido trabajar juntos.</p>
      <button class="faq-cta-btn">Agendar diagnóstico gratis →</button>
    </div>
  </div>

  <div class="faq-list" id="faqList">

    <div class="faq-item open" data-index="0">
      <button class="faq-question" onclick="toggleFaq(0)">
        <div class="faq-q-left">
          <span class="faq-tag tag-proceso">Proceso</span>
          <span class="faq-q-text">¿Cuánto tiempo lleva construir un sistema a medida?</span>
        </div>
        <div class="faq-icon"><div class="faq-icon-plus"></div></div>
      </button>
      <div class="faq-answer">
        <div class="faq-answer-inner">
          <p class="faq-answer-text">Depende del alcance, pero trabajamos en sprints de 2 a 4 semanas. Un sistema básico de automatización puede estar operativo en 3 semanas. Una plataforma de gestión completa suele tomar entre 6 y 10 semanas.</p>
          <div class="faq-answer-highlight">
            <div class="faq-highlight-dot"></div>
            <p class="faq-highlight-text">Siempre entregamos una versión funcional temprana para que puedas usar el sistema mientras seguimos desarrollando.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="faq-item" data-index="1">
      <button class="faq-question" onclick="toggleFaq(1)">
        <div class="faq-q-left">
          <span class="faq-tag tag-comercial">Comercial</span>
          <span class="faq-q-text">¿Trabajás con empresas de cualquier tamaño?</span>
        </div>
        <div class="faq-icon"><div class="faq-icon-plus"></div></div>
      </button>
      <div class="faq-answer">
        <div class="faq-answer-inner">
          <p class="faq-answer-text">Trabajamos con pymes y empresas medianas que ya tienen operación real pero están frenadas por procesos manuales o herramientas desconectadas. No hacemos proyectos para startups sin tracción ni para corporaciones que necesiten licitaciones.</p>
          <div class="faq-answer-highlight">
            <div class="faq-highlight-dot"></div>
            <p class="faq-highlight-text">El perfil ideal: empresa con 5 a 80 empleados, que paga 3 o más SaaS distintos y siente que pierde tiempo en tareas repetitivas.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="faq-item" data-index="2">
      <button class="faq-question" onclick="toggleFaq(2)">
        <div class="faq-q-left">
          <span class="faq-tag tag-comercial">Comercial</span>
          <span class="faq-q-text">¿Y si ya tengo un sistema o herramientas funcionando?</span>
        </div>
        <div class="faq-icon"><div class="faq-icon-plus"></div></div>
      </button>
      <div class="faq-answer">
        <div class="faq-answer-inner">
          <p class="faq-answer-text">Podemos integrarnos con lo que ya tenés, migrarte o construir algo nuevo según lo que tenga más sentido para tu operación. No forzamos un reemplazo total si no es necesario.</p>
          <div class="faq-answer-highlight">
            <div class="faq-highlight-dot"></div>
            <p class="faq-highlight-text">En el diagnóstico mapeamos tus herramientas actuales y detectamos exactamente dónde está el cuello de botella antes de proponer cualquier solución.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="faq-item" data-index="3">
      <button class="faq-question" onclick="toggleFaq(3)">
        <div class="faq-q-left">
          <span class="faq-tag tag-proceso">Proceso</span>
          <span class="faq-q-text">¿En qué consiste el diagnóstico gratuito?</span>
        </div>
        <div class="faq-icon"><div class="faq-icon-plus"></div></div>
      </button>
      <div class="faq-answer">
        <div class="faq-answer-inner">
          <p class="faq-answer-text">Es una reunión de 30 minutos donde analizamos tu operación actual, identificamos los puntos de mayor pérdida y te mostramos qué tipo de sistema resolvería cada uno. Sin presentaciones genéricas, todo sobre tu negocio específico.</p>
          <div class="faq-answer-highlight">
            <div class="faq-highlight-dot"></div>
            <p class="faq-highlight-text">Al final de la reunión te llevás un mapa de fricciones operativas, aunque decidas no avanzar con nosotros.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="faq-item" data-index="4">
      <button class="faq-question" onclick="toggleFaq(4)">
        <div class="faq-q-left">
          <span class="faq-tag tag-tecnico">Técnico</span>
          <span class="faq-q-text">¿Qué tecnologías utilizan?</span>
        </div>
        <div class="faq-icon"><div class="faq-icon-plus"></div></div>
      </button>
      <div class="faq-answer">
        <div class="faq-answer-inner">
          <p class="faq-answer-text">Python, React, PostgreSQL y Node para el core. Para IA usamos modelos propios o APIs según el caso de uso. Priorizamos stacks estables, sin dependencias de plataformas que puedan cambiar precios o cerrar.</p>
          <div class="faq-answer-highlight">
            <div class="faq-highlight-dot"></div>
            <p class="faq-highlight-text">El código es tuyo. Al finalizar el proyecto entregamos el repositorio completo y documentación para que cualquier desarrollador pueda mantenerlo.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="faq-item" data-index="5">
      <button class="faq-question" onclick="toggleFaq(5)">
        <div class="faq-q-left">
          <span class="faq-tag tag-soporte">Soporte</span>
          <span class="faq-q-text">¿Qué pasa si el sistema falla después de entregar?</span>
        </div>
        <div class="faq-icon"><div class="faq-icon-plus"></div></div>
      </button>
      <div class="faq-answer">
        <div class="faq-answer-inner">
          <p class="faq-answer-text">Todos los proyectos incluyen 30 días de soporte post-lanzamiento sin costo. Para después, ofrecemos planes de mantenimiento mensual o atención por ticket según el volumen que necesites.</p>
          <div class="faq-answer-highlight">
            <div class="faq-highlight-dot"></div>
            <p class="faq-highlight-text">Construimos con monitoreo de errores desde el día uno, así sabemos si algo falla antes de que vos nos escribas.</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

<script>
function toggleFaq(index) {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item, i) => {
    if (i === index) {
      item.classList.toggle('open');
    } else {
      item.classList.remove('open');
    }
  });
}
</script>