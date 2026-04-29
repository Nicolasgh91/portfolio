// Chat widget loader. Extracted from Layout.astro inline <script> so the CSP
// can stay tight (script-src 'self') and the HTML payload stays small.
// Loaded with `defer` from <head>, so DOM is parsed by the time it runs.
(function () {
  function initChatWidget() {
    if (document.querySelector("iframe[data-chatbot-widget]")) return;

    const isEnglish = document.documentElement.lang === "en";
    const chatTitle = isEnglish ? "Virtual assistant" : "Asistente virtual";
    const chatAriaLabel = isEnglish ? "Assistance chat" : "Chat de asistencia";

    const iframe = document.createElement("iframe");
    iframe.src = "/chatbot/widget/index.html";
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("title", chatTitle);
    iframe.setAttribute("aria-label", chatAriaLabel);
    iframe.setAttribute("data-chatbot-widget", "");

    iframe.style.cssText = [
      "position:fixed",
      "bottom:0",
      "right:0",
      "width:84px",
      "height:84px",
      "border:none",
      "z-index:9999",
      "background:transparent",
    ].join(";");
    document.body.appendChild(iframe);

    let chatOpen = false;

    window.addEventListener("message", (e) => {
      if (e.source !== iframe.contentWindow) return;
      if (e.data?.chat === "open") {
        chatOpen = true;
        iframe.style.width = "420px";
        iframe.style.height = "680px";
      }
      if (e.data?.chat === "close") {
        chatOpen = false;
        iframe.style.width = "84px";
        iframe.style.height = "84px";
      }
    });

    // L-14: solo notificamos "chat:close" cuando el widget está abierto.
    // Antes se posteaba en cada click del documento, independientemente
    // del estado del iframe.
    document.addEventListener("click", () => {
      if (!chatOpen) return;
      try {
        iframe.contentWindow.postMessage("chat:close", window.location.origin);
      } catch {}
    });
  }

  function scheduleChatWidget() {
    // Keep injection off the critical path, but cap delay so preview does
    // not look broken.
    if ("requestIdleCallback" in window) {
      requestIdleCallback(initChatWidget, { timeout: 1500 });
    } else {
      setTimeout(initChatWidget, 1500);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleChatWidget, {
      once: true,
    });
  } else {
    scheduleChatWidget();
  }
})();
