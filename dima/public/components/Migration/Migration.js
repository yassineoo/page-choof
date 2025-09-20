import migrationData from "./MigrationData.js";

class MigrationComponent {
  constructor(container) {
    this.container = container;
    this.currentLang = this.getLanguage();
    this.boundHandlers = {
      languageChange: this.handleLanguageChange.bind(this),
      resize: this.handleResize.bind(this),
    };
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
  --bg:#F5F5F5;
  --modal-bg:#ffffff;
  --muted:#F8F8F8;
  --red:#e30613;
  --link:#0076B2;
  --border:#C5C5C5;
  --shadow: 0px 7px 15px rgba(79,79,79,0.10);
}

.migration-section {
  width: 100%;
  background: #F8F8F8;
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.dark .migration-section {
  background: #2c2c2c;
}

.migration-grid {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
}

.migration-card-shadow {
  box-shadow: 0px 22px 22px rgba(79,79,79,0.09);
  border: 1px solid var(--border);
  border-radius: 22px;
  width: 900px;
  max-width: 100%;
  height: 345px;
  background: white;
  color: #000;
  text-align: center;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.dark .migration-card-shadow {
  box-shadow: none;
  border: 1px solid var(--border);
  background: #2C2C2C;
  color: #d1d5db;
}

.migration-hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.migration-hover-lift:hover {
  transform: translateY(-3px);
  box-shadow: 0px 7px 15px rgba(79,79,79,0.10);
}

.migration-card-container {
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 24px;
  justify-content: center;
  align-items: center;
  gap: 24px;
  flex-grow: 1;
  margin: 0 auto;
  box-sizing: border-box;
}

.migration-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
}

.migration-title {
  font-family: Rubik, -apple-system, Roboto, Helvetica, sans-serif;
  font-weight: 500;
  font-size: 42px;
  text-transform: uppercase;
  margin: 0;
  line-height: 1;
  word-break: break-word;
}

.migration-subtitle {
  font-family: Rubik, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 22px;
  max-width: 600px;
  line-height: 1.5;
  margin: 0;
}

.migration-buttons-grid {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0 1rem;
  box-sizing: border-box;
}

.migration-option-btn {
  background-color: var(--red);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 28px;
  font-size: 18px;
  min-width: 205px;
  height: 47px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  font-family: Rubik, sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-sizing: border-box;
}
.migration-option-btn:hover {
  background-color: #c50510;
  transform: translateY(-2px);
}

.migration-modal-fade {
  animation: modalFadeIn 0.3s ease-out forwards;
  backdrop-filter: blur(8px);
  background-color: rgba(105, 105, 105, 0.8);
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
}
.migration-modal {
  width: 100%;
  max-width: 908px;
  background: var(--modal-bg);
  border-radius: 22px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  overflow: hidden;
  box-sizing: border-box;
}
.migration-header {
  padding: 48px 24px 24px 24px;
  text-align: center;
}
.migration-header .migration-title {
  margin-bottom: 24px;
}
.migration-question {
  max-width: 668px;
  margin: 0 auto;
  font-family: Rubik, sans-serif;
  font-size: 22px;
  line-height: 1.5;
}

.migration-footer {
  background: var(--muted);
  border-top: 1px solid var(--border);
  padding: 24px;
  box-sizing: border-box;
}
.migration-footer-inner {
  max-width: 672px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  box-sizing: border-box;
}
.migration-subquestion {
  font-family: Rubik, sans-serif;
  font-size: 21px;
  margin: 0;
  text-align: center;
}
.migration-accept {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  justify-content: center;
}
.migration-checkbox {
  width: 18px;
  height: 18px;
  background: var(--red);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
}
.migration-terms {
  font-family: Rubik, sans-serif;
  font-size: 18px;
}
.migration-terms-link {
  color: var(--link);
  text-decoration: underline;
}
.migration-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
}
.btn {
  min-width: 180px;
  height: 42px;
  border-radius: 24px;
  font-family: Rubik, sans-serif;
  font-weight: 700;
  font-size: 15px;
  text-transform: uppercase;
  cursor: pointer;
  padding: 0 1.5rem;
  box-sizing: border-box;
}
.btn--outline {
  background: transparent;
  border: 2px solid var(--red);
  color: var(--red);
}
.btn--outline:hover {
  background: var(--red);
  color: white;
}
.btn--primary {
  background: var(--red);
  color: #fff;
  border: none;
}
.btn--primary:hover {
  background: #c50510;
}
@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.95) translateY(-8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes modalFadeOut {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-6px) scale(0.99); }
}

@media (max-width: 1000px) {
  .migration-card-shadow { width: calc(100% - 32px); height: auto; padding: 24px; }
  .migration-title { font-size: 34px; }
  .migration-subtitle, .migration-question { font-size: 20px; max-width: 100%; }
  .migration-option-btn { min-width: 160px; height: 44px; padding: 10px 20px; font-size: 16px; }
}

@media (max-width: 640px) {
  .migration-card-container { padding: 2rem 1rem; }
  .migration-title { font-size: 28px; }
  .migration-subtitle, .migration-question { font-size: 18px; }
  .migration-header { padding: 40px 24px 24px 24px; }
  .migration-footer { padding: 18px; }
  .migration-subquestion { font-size: 18px; }
  .migration-terms { font-size: 17px; }
  .btn { min-width: 140px; }
  .migration-footer-inner { gap: 20px; }
  .migration-actions { flex-direction: column; }
}

@media (max-width: 480px) {
  .migration-card-shadow { padding: 12px; min-height: 300px; }
  .migration-title { font-size: 22px; }
  .migration-subtitle, .migration-question { font-size: 16px; }
  .migration-option-btn { min-width: 120px; padding: 8px 14px; font-size: 14px; }
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

  createMixedTitleHTML(title, baseClasses = "") {
    if (!title) return "";
    if (this.containsArabic(title) && !title.match(/[a-zA-Z]/)) {
      return `<span class="font-noto-kufi-arabic ${baseClasses}" dir="rtl">${title}</span>`;
    }
    if (this.containsArabic(title) && title.match(/[a-zA-Z]/)) {
      const parts = title.split(/([a-zA-Z]+)/).filter((part) => part.trim());
      return parts
        .map((part) => {
          const isArabic = this.containsArabic(part);
          const fontClass = isArabic ? "font-noto-kufi-arabic" : "font-rubik";
          const direction = isArabic ? "rtl" : "ltr";
          return `<span class="${fontClass} ${baseClasses}" dir="${direction}">${part}</span>`;
        })
        .join("");
    }
    return `<span class="font-rubik ${baseClasses}">${title}</span>`;
  }

  render() {
    try {
      const language = this.getLanguage();
      const data = migrationData[language];
      if (!data) {
        const fallbackData = migrationData.fr;
        this.renderWithData(fallbackData, "fr");
        return;
      }
      this.renderWithData(data, language);
    } catch (error) {
      const fallbackData = migrationData.fr;
      this.renderWithData(fallbackData, "fr");
    }
  }

  renderWithData(data, language) {
    const isRTL = this.isRTL();
    this.cleanupAllEventListeners();
    this.container.innerHTML = `
    <div class="w-full">
      <section class="w-full migration-section">
        <div class="migration-grid">
          <div class="migration-card-shadow migration-hover-lift">
            <div class="migration-card-container">
              <div class="migration-card-content">
                <h2 class="migration-title">${this.createMixedTitleHTML(
                  data.title
                )}</h2>
                <p class="migration-subtitle">${data.subtitle}</p>
              </div>
              <div class="migration-buttons-grid">
                ${data.options
                  .map(
                    (opt, index) => `
                  <button class="migration-option-btn" data-index="${index}">
                    ${opt.label}
                  </button>
                `
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div id="migration-modal-container"></div>
    </div>
    `;
    this.bindPurchaseButtons(language);
  }

  renderErrorState() {
    this.container.innerHTML = `
      <div class="w-full flex items-center justify-center py-16">
        <div class="text-center">
          <p class="text-gray-600 dark:text-gray-400 mb-4">Une erreur s'est produite lors du chargement de la migration</p>
          <button onclick="location.reload()" class="bg-red-600 text-white px-4 py-2 rounded-full">Recharger</button>
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
    const clickHandler = (e) => {
      const button = e.target.closest(".migration-option-btn");
      if (!button) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const index = parseInt(button.getAttribute("data-index"), 10);
      setTimeout(() => {
        this.handlePurchaseClick(language, index);
      }, 50);
    };
    const touchHandler = (e) => {
      const button = e.target.closest(".migration-option-btn");
      if (!button) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const index = parseInt(button.getAttribute("data-index"), 10);
      setTimeout(() => {
        this.handlePurchaseClick(language, index);
      }, 50);
    };
    this.purchaseClickHandler = clickHandler;
    this.purchaseTouchHandler = touchHandler;
    this.container.addEventListener("click", clickHandler);
    this.container.addEventListener("touchend", touchHandler, {
      passive: false,
    });
  }

  handlePurchaseClick(language, index) {
    const data = migrationData[language];
    const offer = data.options[index].label;
    const confirmTitle = data.confirmTitleTemplate.replace("{offer}", offer);
    const confirmDescription = data.confirmDescriptionTemplate.replace(
      "{offer}",
      offer
    );
    const checkboxText = data.checkboxText;
    const subquestion =
      language === "ar"
        ? `هل تريد التغيير إلى العرض "${offer}"؟`
        : `Voulez-vous changer vers l'offre "${offer}" ?`;
    this.showConfirmModal({
      title: confirmTitle,
      question: data.subtitle,
      subquestion,
      message: confirmDescription,
      checkboxText,
      confirmLabel: data.confirmBtn,
      cancelLabel: data.cancelBtn,
      successTitle: data.successTitle,
      successMessageTemplate: data.successMessageTemplate,
      lang: language,
      offer,
    });
  }

  showConfirmModal({
    title,
    question,
    subquestion,
    message,
    checkboxText,
    confirmLabel,
    cancelLabel,
    successTitle,
    successMessageTemplate,
    lang,
    offer,
  }) {
    const modalContainer = this.container.querySelector(
      "#migration-modal-container"
    );
    if (!modalContainer) return;
    modalContainer.innerHTML = `
      <div class="migration-backdrop migration-modal-fade" role="presentation">
        <div class="migration-modal" role="dialog" aria-modal="true" aria-labelledby="migration-modal-title">
          <header class="migration-header">
            <h1 id="migration-modal-title" class="migration-title">${this.createMixedTitleHTML(
              title
            )}</h1>
            <div class="migration-question">${message}</div>
          </header>
          <div class="migration-footer">
            <div class="migration-footer-inner">
              <p class="migration-subquestion">${subquestion}</p>
              <div class="migration-accept">
                <button id="migration-checkbox-btn" class="migration-checkbox" type="button" aria-pressed="false" aria-label="${
                  lang === "ar" ? "غير مقبول" : "unchecked"
                }"></button>
                <div class="migration-terms">
                  <span>${checkboxText}</span>
                  <a href="#" class="migration-terms-link">${
                    lang === "ar"
                      ? "الشروط والأحكام"
                      : "les termes et conditions du contrat"
                  }</a>
                </div>
              </div>
              <div class="migration-actions">
                <button class="btn btn--outline" data-action="cancel">${cancelLabel}</button>
                <button class="btn btn--primary" data-action="confirm">${confirmLabel}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    this.setupModalHandlers(modalContainer, {
      successTitle,
      successMessageTemplate,
      lang,
      offer,
    });
    this.manageFocusForModal(modalContainer);
  }

  setupModalHandlers(
    modalContainer,
    { successTitle, successMessageTemplate, lang, offer }
  ) {
    const backdrop = modalContainer.querySelector(".migration-backdrop");
    const checkboxBtn = modalContainer.querySelector("#migration-checkbox-btn");
    const cancelBtn = modalContainer.querySelector('[data-action="cancel"]');
    const confirmBtn = modalContainer.querySelector('[data-action="confirm"]');
    const setChecked = (el, checked) => {
      if (!el) return;
      el.setAttribute("aria-pressed", checked ? "true" : "false");
      el.innerHTML = checked
        ? `<svg width="18" height="17" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M17 -0.000488281H3C2.46957 -0.000488281 1.96086 0.210225 1.58579 0.585298C1.21071 0.960371 1 1.46908 1 1.99951V15.9995C1 16.5299 1.21071 17.0387 1.58579 17.4137C1.96086 17.7888 2.46957 17.9995 3 17.9995H17C17.5304 17.9995 18.0391 17.7888 18.4142 17.4137C18.7893 17.0387 19 16.5299 19 15.9995V1.99951C19 1.46908 18.7893 0.960371 18.4142 0.585298C18.0391 0.210225 17.5304 -0.000488281 17 -0.000488281Z" fill="#e30613"/><path d="M8 13.9996L4 9.99959L5.41 8.57959L8 11.1696L14.59 4.57959L16 5.99959" fill="white"/></svg>`
        : ``;
    };
    setChecked(checkboxBtn, false);
    const toggle = (e) => {
      e.stopPropagation();
      const cur = checkboxBtn.getAttribute("aria-pressed") === "true";
      setChecked(checkboxBtn, !cur);
    };
    checkboxBtn.addEventListener("click", toggle);
    const closeModal = () => {
      if (backdrop)
        backdrop.style.animation = "modalFadeOut 0.2s ease-in forwards";
      setTimeout(() => {
        modalContainer.innerHTML = "";
      }, 200);
    };
    cancelBtn.addEventListener("click", closeModal);
    confirmBtn.addEventListener("click", () => {
      const checked = checkboxBtn.getAttribute("aria-pressed") === "true";
      if (!checked) {
        alert(
          lang === "ar"
            ? "يرجى قبول الشروط والأحكام."
            : "Veuillez accepter les termes et conditions."
        );
        return;
      }
      closeModal();
      setTimeout(() => {
        this.showSuccessModal({
          title: successTitle,
          message: (successMessageTemplate || "").replace("{offer}", offer),
          lang,
        });
      }, 220);
    });
    const backdropClick = (ev) => {
      if (ev.target === backdrop) closeModal();
    };
    backdrop.addEventListener("click", backdropClick);
    const esc = (ev) => {
      if (ev.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", esc);
      }
    };
    document.addEventListener("keydown", esc);
  }

  showSuccessModal({ title, message, lang }) {
    const modalContainer = this.container.querySelector(
      "#migration-modal-container"
    );
    if (!modalContainer) return;
    modalContainer.innerHTML = `
      <div class="migration-backdrop migration-modal-fade" role="presentation">
        <div class="migration-modal" role="dialog" aria-modal="true" aria-labelledby="migration-success-title">
          <header class="migration-header">
            <h1 id="migration-success-title" class="migration-title">${this.createMixedTitleHTML(
              title
            )}</h1>
            <div class="migration-question">${
              lang === "ar" ? "تم" : "Succès"
            }</div>
          </header>
          <div class="migration-footer">
            <div class="migration-footer-inner">
              <p class="migration-subquestion">${message}</p>
              <div class="migration-actions">
                <button class="btn btn--primary" data-action="close">${
                  migrationData[lang].ok
                }</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    const backdrop = modalContainer.querySelector(".migration-backdrop");
    const closeBtn = modalContainer.querySelector('[data-action="close"]');
    const close = () => {
      if (backdrop)
        backdrop.style.animation = "modalFadeOut 0.2s ease-in forwards";
      setTimeout(() => {
        modalContainer.innerHTML = "";
      }, 200);
    };
    closeBtn.addEventListener("click", close);
    const backdropClick = (ev) => {
      if (ev.target === backdrop) close();
    };
    backdrop.addEventListener("click", backdropClick);
    const esc = (ev) => {
      if (ev.key === "Escape") {
        close();
        document.removeEventListener("keydown", esc);
      }
    };
    document.addEventListener("keydown", esc);
  }

  manageFocusForModal(modalContainer) {
    this.previouslyFocusedElement = document.activeElement;
    setTimeout(() => {
      const firstButton = modalContainer.querySelector(
        "[data-action], #migration-checkbox-btn"
      );
      if (firstButton) firstButton.focus();
    }, 100);
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
  }

  destroy() {
    if (this.languagePolling) clearInterval(this.languagePolling);
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    if (this.languageChangeTimeout) clearTimeout(this.languageChangeTimeout);
    window.removeEventListener(
      "languageChanged",
      this.boundHandlers.languageChange
    );
    window.removeEventListener("resize", this.boundHandlers.resize);
    this.cleanupAllEventListeners();
    if (this.keyboardHandler)
      this.container.removeEventListener("keydown", this.keyboardHandler);
    const modalContainer = this.container.querySelector(
      "#migration-modal-container"
    );
    if (modalContainer) modalContainer.innerHTML = "";
    this.container.innerHTML = "";
  }
}

export default MigrationComponent;
