import migrationData from "./MigrationData";

class Migration {
  constructor(container) {
    this.container = container;
    this.currentLang = this.getLanguage();
    this.currentView = "main";
    this.boundHandlers = {
      languageChange: this.handleLanguageChange.bind(this),
      resize: this.handleResize.bind(this),
    };
    this.providers = [{ id: "dima" }, { id: "ooredoo" }, { id: "nyooz" }];
    this.initialize();
  }
  initialize() {
    this.loadStyles();
    this.render();
    this.setupEventListeners();
  }
  loadStyles() {
    if (!document.getElementById("migration-styles")) {
      const styleElement = document.createElement("style");
      styleElement.id = "migration-styles";
      styleElement.textContent = this.getStylesheet();
      document.head.appendChild(styleElement);
    }
  }

  getStylesheet() {
    return `
 :root{
      --container-max: 900px;
      --gutter: 24px;
      --accordion-gray: #F8F8F8;
      --border: #C5C5C5;
      --card-radius: 22px;
      --card-min-height: 300px;
    }

    .migration-terms-link {
        color: #0076B2;
        text-decoration: underline;
        text-underline-offset: 2px;
        cursor: pointer;
      }
      .migration-terms-link:focus {
        outline: 2px solid rgba(0,118,178,0.15);
        outline-offset: 2px;
      }
      .migration-terms-link:hover {
        opacity: 0.95;
      }
    
     .dark .migration-section {
      background: #2c2c2c;
    }
    .dark .migration-card-shadow {
      background: #2c2c2c;
      color: #ffffffff;
      box-shadow: none;
    }

    .migration-card-shadow {
      box-shadow: 0px 7px 15px 0px rgba(79,79,79,0.10);
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      box-sizing: border-box;
      width: var(--container-max);
      height: auto;
      background: white;
      color: #000;
      text-align: center;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2.5rem 1rem;
      gap: 1.25rem;
      transition: all 0.3s ease;
      min-height: var(--card-min-height);
    }

    [dir="rtl"] .migration-card-shadow {
      text-align: right;
    }
    [dir="rtl"] .migration-price {
      flex-direction: row-reverse;
    }
    [dir="rtl"] .migration-price .small {
      margin-left: 0;
      margin-right: 4px;
    }
    .migration-modal-fade {
      animation: modalFadeIn 0.3s ease-out forwards;
      backdrop-filter: blur(8px);
      background-color: rgba(105, 105, 105, 0.8);
    }
    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.95) translateY(-8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .migration-hover-lift {
      transition: all 0.3s ease;
    }
    .migration-hover-lift:hover {
      transform: translateY(-3px);
      box-shadow: 0px 8px 16px 0px #0505051A;
      border: 0.92px solid var(--border);
    }
    .dark .migration-hover-lift:hover {
      box-shadow: none;
      border: 0.92px solid var(--border);
    }
    .migration-grid {
      max-width: 1400px;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
    }
.migration-card-container {
  display: flex;
  width: 100%;
  max-width: var(--container-max);
  flex-direction: column;
  height: auto;
  margin: 0 auto;
  padding: 0 var(--gutter);
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}
    .migration-card-content {
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
    }
    .migration-card-footer {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      width: 100%;
    }
    .migration-title {
      font-weight: 500;
      font-size: 42px;
      margin-bottom: 24px;
      text-transform: uppercase;
      text-align: center;
      width: 100%;
      line-height: 1.05;
      word-break: break-word;
    }
    .migration-description {
      font-weight: 400;
      font-size: 22px;
      line-height: 1.5;
      margin-bottom: 1.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      max-width: 668px;
      margin-left: auto;
      margin-right: auto;
      box-sizing: border-box;
    }

     .dark .migration-title, .dark .migration-description {
     color: white;
     }

    .migration-price {
      font-weight: 600;
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: .5rem;
    }
    .migration-price .big {
      font-size: clamp(1.75rem, 4vw, 2.25rem);
    }
    .migration-price .small {
      font-size: clamp(1.125rem, 2.5vw, 1.25rem);
    }
    .migration-buy-btn {
      position: relative;
      overflow: hidden;
      z-index: 10;
      touch-action: manipulation;
      background-color: #e30613;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 99px;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.25s ease;
      font-weight: bold;
      text-transform: uppercase;
      min-width: 180px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
    .migration-cancel-btn {
      position: relative;
      overflow: hidden;
      z-index: 10;
      touch-action: manipulation;
      background-color: #fff;
      color: white;
      border: 1px solid #e30613;
      padding: 10px 24px;
      border-radius: 9999px;
      font-size: 1em;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: bold;
      text-transform: uppercase;
      min-width: 200px;
    }
    .migration-buy-btn:hover {
      background-color: #c50510;
      transform: scale(1.05);
      color: white;
    }
      .dark .migration-cancel-btn {
  background-color: transparent;
}
    .migration-confirm-panel {
      width: 100%;
      max-width: var(--container-max);
      margin: 1rem auto 0;
      background: var(--accordion-gray);
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      border: 1px solid #E6E6E6;
      overflow: hidden;
      max-height: 0;
      opacity: 0;
      padding: 0;
      box-sizing: border-box;
      transition: max-height 0.45s ease-in-out, opacity 0.3s ease-in, padding 0.35s ease-in-out, margin 0.35s ease-in-out;
    }
    .migration-confirm-panel.visible {
      max-height: 100%;
      opacity: 1;
      padding: 1.25rem;
      margin-top: 1.5rem;
    }
    .migration-confirm-inner {
      max-width: calc(var(--container-max) - 2 * var(--gutter));
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
      box-sizing: border-box;
    }
    .migration-section {
      width: 100%;
      padding : 70px 16px;
    }
      
    .dark .text-center.bg-\\[\\#fff\\] h2,
    .dark .text-center.bg-\\[\\#fff\\] p {
      color: #ffffffff;
    }
    .dark .text-center.bg-\\[\\#fff\\] {
      background-color: #3a3a3a;
    }
    
    .dark .rounded-b-\\[22\\.5px\\] {
       background-color: #3a3a3a;
    }

    .migration-back-btn {
      position: absolute;
      top: 20px;
      left: 20px;
      background: transparent;
      border: 2px solid #e30613;
      color: #e30613;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: bold;
      text-transform: uppercase;
      z-index: 10;
    }
    .migration-back-btn:hover {
      background-color: #e30613;
      color: white;
    }
    [dir="rtl"] .migration-back-btn {
      left: auto;
      right: 20px;
    }
    @keyframes modalFadeOut {
      from { opacity: 1; transform: scale(1) translateY(0); }
      to { opacity: 0; transform: scale(0.95) translateY(-10px); }
    }
    .migration-modal-close {
      transition: all 0.2s ease;
    }
    .migration-modal-close:hover {
      transform: scale(1.1);
    }
    .migration-modal-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
    }
    .migration-modal-button {
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      font-size: 0.875rem;
      box-sizing: border-box;
    }
    .migration-modal-button.primary {
      background: #e30613;
      color: white;
      border: none;
    }
    .migration-modal-button.primary[disabled] {
      opacity: 0.45;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    .migration-modal-button.primary:hover {
      background: #c50510;
    }
    .migration-modal-button.secondary {
      background: white;
      color: #e30613;
      border: 2px solid #e30613;
    }
    .migration-modal-button.secondary:hover {
      background: #e30613;
      color: white;
    }
    .dark .migration-modal-button.secondary {
      background: transparent;
      color: #ffffffff;
      border: 2px solid #ffffffff;
    }

.migration-terms-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  line-height: 1.4;
  font-size: 16px;
}

.migration-terms-checkbox input[type="checkbox"] {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  overflow: hidden;
  white-space: nowrap;
}

.migration-terms-checkbox .checkbox-faux {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid #cfcfcf;
  background: #fff;
  box-sizing: border-box;
  flex: 0 0 auto;
  display: inline-block;
  transition: background .12s ease, border-color .12s ease, box-shadow .12s ease;
}

.migration-terms-checkbox input[type="checkbox"]:checked + .checkbox-faux {
  background: #E30613;
  border-color: #E30613;
  box-shadow: none;
}

.migration-terms-checkbox input[type="checkbox"]:checked + .checkbox-faux::after {
  content: "";
  display: block;
  width: 12px;
  height: 10px;
  margin: 3px auto;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 10'><path fill='%23ffffff' d='M4.5 8.5L1 5l1-1 2.5 2.5L10 1.5l1 1z'/></svg>");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 12px 10px;
}

.migration-terms-checkbox input[type="checkbox"]:focus + .checkbox-faux {
  box-shadow: 0 0 0 3px rgba(227,6,19,0.14);
  outline: none;
}

.migration-terms-link {
  color: #0076B2;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}

.migration-confirm-panel[aria-hidden="true"] {
  visibility: hidden !important;
  pointer-events: none !important;
  background: transparent !important;
  border-color: transparent !important;
  opacity: 0 !important;
  max-height: 0 !important;
  padding: 0 !important;
  margin-top: 0 !important;
}
.dark .migration-confirm-panel.visible {
  background: #2c2c2c;
  border-color: rgba(255,255,255,0.06);
  color: #d1d5db;
}
.migration-confirm-panel.visible[aria-hidden="false"] {
  visibility: visible !important;
  pointer-events: auto !important;
}
    
    @media (max-width: 1000px) {
    .migration-card-shadow {
        width: 100%;
        max-width: 100%;
        padding: 1.5rem;
        min-height: 320px;
      }
      .migration-confirm-panel.visible { max-height: 380px; }
    }
    @media (max-width: 640px) {
      .migration-card-shadow {
        min-height: 300px;
        padding: 30px;
        margin: 0 auto;
      }
        
      .migration-title {
        font-size: 25px;
        margin-bottom: 20px;
      }
      .migration-description {
        margin-bottom: 25px;
        font-size: 18px;
        -webkit-line-clamp: 3;
      }
      .migration-price .big {
        font-size: 28px;
      }
      .migration-price .small {
        font-size: 18px;
      }
      .migration-modal-buttons {
        gap: 12px !important;
        justify-content: center;
        align-items: center;
      }
      .migration-modal-button {
        width: auto !important;
        min-width: 120px !important;
        flex: 1;
        max-width: 150px;
      }
      .migration-back-btn {
        top: 10px;
        left: 10px;
        padding: 6px 12px;
        font-size: 12px;
      }
      [dir="rtl"] .migration-back-btn {
        left: auto;
        right: 10px;
      }
      .migration-confirm-panel.visible { max-height: 520px; padding: 12px; }
      .migration-buy-btn { min-width: 200px; padding: 0.6rem 1rem; }
    }
    @media (max-width: 480px) {
      .migration-card-shadow {
        min-height: 280px;
      }
    }
    @media (max-width: 1279px) {
      .migration-card-container {
        min-height: 360px;
      }
    }
    @media (max-width: 991px) {
      .migration-card-container {
        min-height: 340px;
      }
    }
    @media (max-width: 767px) {
      .migration-card-container {
        min-height: auto;
      }
    }
    @media (min-width: 768px) and (max-width: 1279px) and ([dir="rtl"]) {
      .migration-card-container {
        text-align: right;
      }
      .migration-card-content ul {
        padding-right: 0;
        padding-left: 1rem;
      }
    }
    .migration-card-shadow, .migration-card-container, .migration-card-content {
      box-sizing: border-box;
    }
    .migration-card-shadow .buttons-row,
    .migration-card-shadow .flex.items-center.justify-center {
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }

    .migration-modal-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
    }

    .migration-modal-buttons .migration-modal-button {
      flex: 1 1 220px;
      max-width: 180px;
      min-width: 140px;
      height: 48px;
      box-sizing: border-box;
    }

    .migration-modal-buttons .migration-modal-button.w-40,
    .migration-modal-buttons .migration-modal-button.h-12 {
      width: auto !important;
      height: 48px !important;
    }

    @media (max-width: 640px) {
      .migration-modal-buttons {
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      .migration-modal-buttons .migration-modal-button {
        flex: 1 1 48%;
        max-width: none;
        min-width: 120px;
      }
    }

    @media (max-width: 420px) {
      .migration-modal-buttons {
        flex-direction: column;
        gap: 0.5rem;
      }
      .migration-modal-buttons .migration-modal-button {
        width: 100%;
        flex: 1 1 100%;
        min-width: 0;
      }
    }
    `;
  }

  setupEventListeners() {
    window.removeEventListener(
      "languageChanged",
      this.boundHandlers.languageChange
    );
    window.addEventListener(
      "languageChanged",
      this.boundHandlers.languageChange
    );
    window.removeEventListener("resize", this.boundHandlers.resize);
    window.addEventListener("resize", this.boundHandlers.resize);
    this.setupLanguagePolling();
    this.setupAccessibility();
  }
  setupLanguagePolling() {
    if (this.languagePolling) clearInterval(this.languagePolling);
    this.languagePolling = setInterval(() => {
      const currentLang = this.getLanguage();
      if (currentLang !== this.currentLang) {
        clearTimeout(this.languageChangeTimeout);
        this.languageChangeTimeout = setTimeout(() => {
          this.handleLanguageChange();
        }, 100);
      }
    }, 500);
  }
  setupAccessibility() {
    if (this.keyboardHandler) {
      this.container.removeEventListener("keydown", this.keyboardHandler);
    }
    this.keyboardHandler = (e) => {
      if (e.key === "Escape") {
        this.closeAnyOpenModals();
      }
    };
    this.container.addEventListener("keydown", this.keyboardHandler);
  }
  getLanguage() {
    const storedLanguage = localStorage.getItem("language");
    return ["fr", "ar"].includes(storedLanguage) ? storedLanguage : "fr";
  }
  isRTL() {
    return this.currentLang === "ar";
  }
  containsArabic(text) {
    if (!text) return false;
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicPattern.test(text);
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  createMixedTitleHTML(title, baseClasses = "") {
    if (!title) return "";
    const latinTokenRegex = /[A-Za-z0-9'’\-\.\,\/]+/;
    const latinWholeRegex = /^[A-Za-z0-9'’\-\.\,\/]+$/;
    if (this.containsArabic(title) && !latinTokenRegex.test(title)) {
      return `<span class="font-noto-kufi-arabic ${baseClasses}" dir="rtl">${this.escapeHtml(
        title
      )}</span>`;
    }
    const parts = title.split(/([A-Za-z0-9'’\-\.\,\/]+)/);
    return parts
      .map((part) => {
        if (part === "") return "";
        if (latinWholeRegex.test(part)) {
          return `<span class="font-rubik ${baseClasses}" dir="ltr">${this.escapeHtml(
            part
          )}</span>`;
        }
        if (this.containsArabic(part)) {
          return `<span class="font-noto-kufi-arabic ${baseClasses}" dir="rtl">${this.escapeHtml(
            part
          )}</span>`;
        }
        return this.escapeHtml(part);
      })
      .join("");
  }

  render() {
    try {
      const language = this.getLanguage();
      const data = migrationData[language];
      if (!data) {
        console.error("Missing data for language:", language);
        const fallbackData = migrationData.fr;
        if (!fallbackData) {
          throw new Error("No fallback data available");
        }
        this.renderWithData(fallbackData, language);
        return;
      }
      this.renderWithData(data, language);
    } catch (error) {
      console.error("Error rendering component:", error);
      this.renderErrorState();
    }
  }
  renderWithData(data, language) {
    const isRTL = this.isRTL();
    this.cleanupAllEventListeners();
    if (this.currentView && this.currentView.endsWith("Migration")) {
      const providerId = this.currentView.replace("Migration", "");
      this.renderProviderView(providerId, data, language, isRTL);
    } else {
      this.renderMainView(data, language, isRTL);
    }
    setTimeout(() => {
      this.addAccessibility();
    }, 50);
  }
  renderMainView(data, language, isRTL) {
    const providerButtonsHTML = this.providers
      .map((p) => {
        const id = p.id;
        const labelFromData =
          data[id] || data[id + "Label"] || id.toUpperCase();
        const displayName =
          data[id] || id.charAt(0).toUpperCase() + id.slice(1);
        return `<button class="migration-buy-btn migration-button-zone py-[10px]" data-provider="${id}" aria-label="${displayName}">
                <span>${labelFromData}</span>
              </button>`;
      })
      .join("\n");
    const description = data.description || "";
    this.container.innerHTML = `
  <div class="w-full ${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}" ${
      isRTL ? 'dir="rtl"' : 'dir="ltr"'
    }>
    <section class="w-full bg-[#F8F8F8] dark:bg-[#2c2c2c] migration-section">
      <div>
        <div style="width:100%">
<div class="migration-card-shadow migration-hover-lift">
  <div class="migration-card-container">
    <div class="migration-card-content">
      <h2 class="migration-title">${this.createMixedTitleHTML(
        data.title || ""
      )}</h2>
      <p class="migration-description">${description}</p>
    </div>
                 <div class="flex items-center gap-4 justify-center buttons-row">
      ${providerButtonsHTML}
    </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div id="migration-confirm-panel" class="migration-confirm-panel" aria-hidden="true"></div>
    <div id="migration-modal-container"></div>
  </div>
  `;
    this.bindPurchaseButtons(language);
  }

  highlightTerms(text, language) {
    if (!text) return "";
    const arPhrase = "شروط وأحكام العقد";
    const frPhrase = "termes et conditions du contrat";

    if (language === "ar" && text.includes(arPhrase)) {
      const href = "./assets/documents/TERMES_ET_CONDITIONS_AR.pdf";
      return text.replace(
        arPhrase,
        `<a href="${href}" class="migration-terms-link" role="link" tabindex="0" target="_blank" rel="noopener noreferrer" download="TERMES_ET_CONDITIONS_AR.pdf" aria-label="Télécharger les termes et conditions en arabe">${arPhrase}</a>`
      );
    }

    if (language === "fr" && text.includes(frPhrase)) {
      const href = "./assets/documents/TERMES_ET_CONDITIONS.pdf";
      return text.replace(
        frPhrase,
        `<a href="${href}" class="migration-terms-link" role="link" tabindex="0" target="_blank" rel="noopener noreferrer" download="TERMES_ET_CONDITIONS.pdf" aria-label="Télécharger les termes et conditions en français">${frPhrase}</a>`
      );
    }

    return text;
  }

  renderProviderView(providerId, data, language, isRTL) {
    const cap = providerId.charAt(0).toUpperCase() + providerId.slice(1);
    const changeKey = `change${cap}`;
    const changeSpecific = data[changeKey] || data.change || "";
    const providerFromDataLabel =
      data[providerId] || (providerId === "ooredoo" ? "Ooredoo" : providerId);
    const displayName = providerFromDataLabel;
    const cancelBtn = data.cancelBtn || "Annuler";
    const confirmBtn = data.confirmBtn || "Confirmer";

    let termsHTML = "";
    if (providerId === "dima") {
      const termsText = data.termsAndConditions || "";
      const wrapped = this.highlightTerms(termsText, language);
      termsHTML = `
      <div class="mt-4 mb-8 px-4 text-center">
        <label class="migration-terms-checkbox" style="max-width:100%; text-align:left;">
          <input type="checkbox" id="dima-terms-checkbox-view" />
          <span class="checkbox-faux" aria-hidden="true"></span>
          <span style="margin-left:8px;">${wrapped}</span>
        </label>
      </div>
    `;
    }

    const isDark = document.documentElement.classList.contains("dark");
    const roundedInlineStyle = `background: ${
      isDark ? "#424242" : "#F8F8F8"
    }; color: ${isDark ? "#fff" : "#000"};`;

    this.container.innerHTML = `
    <div class="w-full ${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}" ${
      isRTL ? 'dir="rtl"' : 'dir="ltr"'
    }>
      <section class="w-full dark:bg-[#2c2c2c] migration-section relative">
        <div class="border-[1px] border-[#C5C5C5] rounded-[22.5px] mx-auto w-[90%] max-w-[900px]">
          <div class="text-center bg-[#fff] flex flex-col items-center gap-6 justify-center min-h-[200px] px-4 rounded-t-[22.5px]">
            <h2 class="migration-title">${this.createMixedTitleHTML(
              data.title || ""
            )}</h2>
            <p class="migration-description">${data.description || ""}</p>
          </div>
          <div class="rounded-b-[22.5px] min-h-[200px] pt-14 pb-6" style="${roundedInlineStyle}">
            <p class="text-center mb-8 px-4">
              <span class="text-[18px] md:text-[21px]">${changeSpecific}</span>
            </p>

            ${termsHTML}

            <div class="flex items-center gap-4 justify-center">
              <button id="back-to-main" class="relative  font-semibold text-base uppercase forfait-modal-button w-[180px] h-12 rounded-full cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-white text-ooredoo-red border-2 border-ooredoo-red shadow-md dark:bg-[#2C2C2C] dark:text-white dark:border-white">
                <span>${cancelBtn}</span>
              </button>
              <button id="start-${providerId}-migration" class="relative font-semibold text-base uppercase forfait-modal-button w-[180px] h-12 rounded-full border-none cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-ooredoo-red text-white shadow-lg">
                <span>${confirmBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      <div id="migration-modal-container"></div>
    </div>
  `;

    if (providerId === "dima") {
      const checkbox = this.container.querySelector(
        "#dima-terms-checkbox-view"
      );
      const confirmButton = this.container.querySelector(
        `#start-${providerId}-migration`
      );
      confirmButton.disabled = true;
      confirmButton.style.opacity = "0.5";
      confirmButton.style.cursor = "not-allowed";
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          confirmButton.disabled = false;
          confirmButton.style.opacity = "1";
          confirmButton.style.cursor = "pointer";
        } else {
          confirmButton.disabled = true;
          confirmButton.style.opacity = "0.5";
          confirmButton.style.cursor = "not-allowed";
        }
      });
    }

    this.bindViewButtons(language);
  }

  renderErrorState() {
    this.container.innerHTML = `
      <div class="w-full flex items-center justify-center py-16">
        <div class="text-center">
          <p class="text-gray-600 dark:text-white mb-4">Une erreur s'est produite lors du chargement du boost</p>
          <button onclick="location.reload()"
                  class="bg-ooredoo-red text-white px-4 py-2 rounded-full">
            Recharger
          </button>
        </div>
      </div>
    `;
  }
  handleLanguageChange() {
    const newLanguage = this.getLanguage();
    if (newLanguage !== this.currentLang) {
      this.currentLang = newLanguage;
      this.closeAnyOpenModals();
      this.render();
    }
  }
  closeAnyOpenModals() {
    const modalContainer = this.container.querySelector(
      "#migration-modal-container"
    );
    if (modalContainer && modalContainer.innerHTML.trim()) {
      modalContainer.innerHTML = "";
    }
    this.toggleConfirmPanel(false);
  }
  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.render();
    }, 100);
  }
  bindPurchaseButtons(language) {
    if (this.purchaseClickHandler) {
      this.container.removeEventListener("click", this.purchaseClickHandler);
    }
    if (this.purchaseTouchHandler) {
      this.container.removeEventListener("touchend", this.purchaseTouchHandler);
    }
    const handler = (e) => {
      const button = e.target.closest(".migration-buy-btn");
      if (!button) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const provider = button.getAttribute("data-provider");
      if (!provider) return;
      this.currentView = `${provider}Migration`;
      this.render();
    };
    this.purchaseClickHandler = handler;
    this.purchaseTouchHandler = handler;
    this.container.addEventListener("click", handler);
    this.container.addEventListener("touchend", handler, { passive: false });
  }
  bindViewButtons(language) {
    if (this.viewClickHandler) {
      this.container.removeEventListener("click", this.viewClickHandler);
    }
    const clickHandler = (e) => {
      if (e.target.closest("#back-to-main")) {
        e.preventDefault();
        e.stopPropagation();
        this.currentView = "main";
        this.render();
        return;
      }
      const startBtn = e.target.closest("[id^='start-'][id$='-migration']");
      if (startBtn) {
        if (startBtn.disabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        const id = startBtn.id
          .replace(/^start-/, "")
          .replace(/-migration$/, "");
        const providerId = id;
        const lang = this.getLanguage();
        const baseModalData = migrationData[lang] || {};
        let modalData = {};
        let message = "";
        const provider = this.providers.find((p) => p.id === providerId);
        const displayName = provider ? provider.displayName : providerId;
        if (providerId === "dima") {
          modalData = baseModalData.migrationDimaModal || {};
          message = modalData.confirmDescription || "";
        } else if (providerId === "ooredoo") {
          modalData = baseModalData.migrationOoredooModal || {};
          message =
            modalData.confirmDescription ||
            baseModalData.changeOfferGeneric.replace(
              "{offerName}",
              displayName
            );
        } else if (providerId === "nyooz") {
          modalData = baseModalData.migrationNyoozModal || {};
          message =
            modalData.confirmDescription ||
            baseModalData.changeOfferGeneric.replace(
              "{offerName}",
              displayName
            );
        } else {
          modalData = baseModalData.migrationDimaModal || {};
          message = baseModalData.changeOfferGeneric.replace(
            "{offerName}",
            displayName
          );
        }
        this.handlePurchaseClick(lang, {
          ...modalData,
          confirmDescription: message,
        });
        return;
      }
    };
    this.viewClickHandler = clickHandler;
    this.container.addEventListener("click", clickHandler);
  }
  handlePurchaseClick(language, data) {
    const currentLanguage = this.getLanguage();
    const isRTL = currentLanguage === "ar";
    const message = data.confirmDescription || "";
    const title = data.confirmTitle || "";
    this.showModal({
      type: "confirm",
      title,
      message,
      isRTL,
      onConfirm: () => {
        this.showSuccessModal(data, isRTL, data.successMessage || "");
      },
    });
  }
  showInsufficientModal(data, isRTL) {
    this.showModal({
      type: "info",
      title: data.insufficientTitle || "",
      message: data.insufficientMessage || "",
      isRTL,
    });
  }
  showSuccessModal(data, isRTL, message) {
    this.showModal({
      type: "success",
      title: (data && data.successTitle) || "",
      message: message || "",
      isRTL,
      onConfirm: () => {
        this.currentView = "main";
        this.render();
      },
    });
  }
  showModal({ type, title, message, isRTL = false, onConfirm }) {
    try {
      const modalContainer = this.container.querySelector(
        "#migration-modal-container"
      );
      if (!modalContainer) {
        console.error("Modal container not found");
        return;
      }
      const modalHTML = this.createModalHTML({ type, title, message, isRTL });
      modalContainer.innerHTML = modalHTML;
      this.setupModalEvents({ type, onConfirm, modalContainer });
      this.manageFocusForModal(modalContainer);
    } catch (error) {
      console.error("Error showing modal:", error);
    }
  }
  manageFocusForModal(modalContainer) {
    this.previouslyFocusedElement = document.activeElement;
    setTimeout(() => {
      const firstButton = modalContainer.querySelector("[data-action]");
      if (firstButton) {
        firstButton.focus();
      }
    }, 100);
  }
  createModalHTML({ type, title, message, isRTL }) {
    const dirAttribute = isRTL ? `dir="rtl"` : "";
    const closeButtonPosition = isRTL ? "left-4" : "right-4";
    const buttons = this.getModalButtons(type, isRTL);
    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";
    const containsHTML = /<[^>]+>/.test(message);
    return `
      <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 migration-modal-fade"
          style="background-color: rgba(105, 105, 105, 0.8);"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title">
          <div class="relative bg-white dark:bg-[#2C2C2C] rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl min-w-[320px] px-6 md:px-8 pt-16 pb-8 md:pb-12" ${dirAttribute}>
              <button class="absolute top-[15px] right-[15px] w-[34px] h-[34px] flex items-center justify-center rounded-full bg-ooredoo-red text-white z-20  migration-modal-close"
                      aria-label="${isRTL ? "إغلاق" : "Fermer"}">
                  <img src="./assets/images/Close.svg" alt="close" class="w-6 h-6 block"/>
              </button>
              <div class="text-center mb-6">
                  <h2 id="modal-title" class="${fontClass} font-semibold text-ooredoo-red dark:text-white text-2xl md:text-3xl leading-tight uppercase tracking-tight">
                      ${this.createMixedTitleHTML(title)}
                  </h2>
              </div>
              <div class="text-center mb-10 px-2">
                  ${
                    containsHTML
                      ? message
                      : `<p class="${fontClass} text-gray-800 dark:text-white leading-relaxed text-base md:text-lg">${message}</p>`
                  }
              </div>
              <div class="flex justify-center migration-modal-buttons">${buttons}</div>
          </div>
      </div>
    `;
  }
  getModalButtons(type, isRTL) {
    const data = migrationData[this.currentLang] || {};
    const labels = {
      cancel: data.cancelBtn || "Annuler",
      confirm: data.confirmBtn || "Confirmer",
      close: data.ok || "OK",
    };
    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";
    const primaryBtn = `migration-modal-button primary ${fontClass} font-semibold text-base uppercase rounded-full border-none cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-ooredoo-red text-white shadow-lg`;
    const secondaryBtn = `migration-modal-button secondary ${fontClass} font-semibold text-base uppercase rounded-full cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-transparent text-ooredoo-red border-2 border-ooredoo-red shadow-md dark:bg-transparent dark:text-white dark:border-white`;

    const buttonGap = "gap-4 lg:gap-4";
    const buttonConfigs = {
      confirm: `
        <div class="flex ${buttonGap}">
          <button class="${secondaryBtn}" data-action="cancel">${labels.cancel}</button>
          <button class="${primaryBtn}" data-action="confirm">${labels.confirm}</button>
        </div>
      `,
      success: `
        <div class="flex ${buttonGap}">
          <button class="${primaryBtn}" data-action="close">${labels.close}</button>
        </div>
      `,
      info: `
        <div class="flex ${buttonGap}">
          <button class="${primaryBtn}" data-action="close">${labels.close}</button>
        </div>
      `,
    };
    return buttonConfigs[type] || buttonConfigs.success;
  }
  setupModalEvents({ type, onConfirm, modalContainer }) {
    const modal = modalContainer.querySelector(".migration-modal-fade");
    if (!modal) return;
    const closeButton = modal.querySelector(".migration-modal-close");
    const actionButtons = modal.querySelectorAll("[data-action]");
    const closeModal = () => {
      modal.style.animation = "modalFadeOut 0.2s ease-in forwards";
      setTimeout(() => {
        modalContainer.innerHTML = "";
        if (
          this.previouslyFocusedElement &&
          this.previouslyFocusedElement.focus
        ) {
          this.previouslyFocusedElement.focus();
        }
        this.previouslyFocusedElement = null;
      }, 200);
    };
    const modalHandlers = new Map();
    const closeClickHandler = () => closeModal();
    if (closeButton) {
      closeButton.addEventListener("click", closeClickHandler);
      modalHandlers.set("close-click", {
        element: closeButton,
        type: "click",
        handler: closeClickHandler,
      });
    }
    const dimaCheckbox = modal.querySelector("#dima-terms-checkbox");
    let confirmButton = modal.querySelector('[data-action="confirm"]');
    if (dimaCheckbox && confirmButton) {
      confirmButton.disabled = !dimaCheckbox.checked;
      const onCheckboxChange = (ev) => {
        confirmButton.disabled = !ev.target.checked;
      };
      dimaCheckbox.addEventListener("change", onCheckboxChange);
      modalHandlers.set("dima-checkbox-change", {
        element: dimaCheckbox,
        type: "change",
        handler: onCheckboxChange,
      });
    }
    actionButtons.forEach((button) => {
      const actionClickHandler = (ev) => {
        const action = button.getAttribute("data-action");
        if (action === "confirm" && button.disabled) {
          ev.preventDefault();
          ev.stopPropagation();
          return;
        }
        closeModal();
        setTimeout(() => {
          if (onConfirm && action === "confirm") onConfirm();
        }, 200);
      };
      button.addEventListener("click", actionClickHandler);
      modalHandlers.set(`action-${button.getAttribute("data-action")}`, {
        element: button,
        type: "click",
        handler: actionClickHandler,
      });
    });
    const backdropClickHandler = (event) => {
      if (event.target === modal) {
        closeModal();
      }
    };
    modal.addEventListener("click", backdropClickHandler);
    modalHandlers.set("backdrop-click", {
      element: modal,
      type: "click",
      handler: backdropClickHandler,
    });
    const escapeHandler = (event) => {
      if (event.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", escapeHandler);
        modalHandlers.delete("escape");
      }
    };
    document.addEventListener("keydown", escapeHandler);
    modalHandlers.set("escape", {
      element: document,
      type: "keydown",
      handler: escapeHandler,
    });
    modal.modalHandlers = modalHandlers;
  }
  cleanupAllEventListeners() {
    if (this.purchaseClickHandler) {
      this.container.removeEventListener("click", this.purchaseClickHandler);
      this.purchaseClickHandler = null;
    }
    if (this.purchaseTouchHandler) {
      this.container.removeEventListener("touchend", this.purchaseTouchHandler);
      this.purchaseTouchHandler = null;
    }
    if (this.viewClickHandler) {
      this.container.removeEventListener("click", this.viewClickHandler);
      this.viewClickHandler = null;
    }
  }
  addAccessibility() {}
  toggleConfirmPanel(show = true) {
    const panel = this.container.querySelector("#migration-confirm-panel");
    if (!panel) return;
    if (panel._migrationTransitionHandler) {
      panel.removeEventListener(
        "transitionend",
        panel._migrationTransitionHandler
      );
      panel._migrationTransitionHandler = null;
    }
    if (show) {
      panel.setAttribute("aria-hidden", "false");
      panel.classList.add("visible");
      panel.style.visibility = "visible";
      panel.style.pointerEvents = "";
      panel.style.background = "";
      panel.style.borderColor = "";
    } else {
      panel.classList.remove("visible");
      panel.setAttribute("aria-hidden", "true");
      panel.style.pointerEvents = "none";
      panel.style.background = "transparent";
      panel.style.borderColor = "transparent";
      const onTransitionEnd = (ev) => {
        if (ev.target !== panel) return;
        panel.style.visibility = "hidden";
        panel.style.background = "";
        panel.style.borderColor = "";
        panel.removeEventListener("transitionend", onTransitionEnd);
        panel._migrationTransitionHandler = null;
      };
      panel._migrationTransitionHandler = onTransitionEnd;
      panel.addEventListener("transitionend", onTransitionEnd);
      setTimeout(() => {
        if (panel._migrationTransitionHandler) {
          panel.style.visibility = "hidden";
          panel.style.background = "";
          panel.style.borderColor = "";
          panel.removeEventListener("transitionend", onTransitionEnd);
          panel._migrationTransitionHandler = null;
        }
      }, 500);
    }
  }
  isConfirmPanelVisible() {
    const panel = this.container.querySelector("#migration-confirm-panel");
    return panel ? panel.classList.contains("visible") : false;
  }
  destroy() {
    if (this.languagePolling) {
      clearInterval(this.languagePolling);
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    if (this.languageChangeTimeout) {
      clearTimeout(this.languageChangeTimeout);
    }
    window.removeEventListener(
      "languageChanged",
      this.boundHandlers.languageChange
    );
    window.removeEventListener("resize", this.boundHandlers.resize);
    this.cleanupAllEventListeners();
    if (this.keyboardHandler) {
      this.container.removeEventListener("keydown", this.keyboardHandler);
    }
    const modalContainer = this.container.querySelector(
      "#migration-modal-container"
    );
    if (modalContainer) {
      modalContainer.innerHTML = "";
    }
    this.container.innerHTML = "";
  }
}
export default Migration;
