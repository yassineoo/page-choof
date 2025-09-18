import migrationData from "./MigrationData.js";

class MigrationComponent {
  constructor(container) {
    this.container = container;
    this.currentLang = this.getLanguage();
    this.boundHandlers = {
      languageChange: this.handleLanguageChange.bind(this),
      resize: this.handleResize.bind(this)
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
  --red:#ED1C24;
  --link:#0076B2;
  --border:#C5C5C5;
  --shadow: -0.861px 6.891px 15.505px 0 rgba(79,79,79,0.10);
}

.migration-card-shadow {
  box-shadow: 0px 3.92px 7.84px 0px #0505050A;
  border: 0.92px solid #C5C5C5;
  border-radius: 0.75rem;
  width: 100%;
  max-width: none;
  min-width: auto;
  height: 100%;
  background: white;
  color: #000;
  text-align: center;
  margin: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 300px;
}

.dark .migration-card-shadow {
  box-shadow: none;
  border: 0.92px solid #C5C5C5;
  background: #2C2C2C;
  color: #d1d5db;
}

[dir="rtl"] .migration-card-shadow {
  text-align: right;
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
  border: 0.92px solid #C5C5C5;
}
.dark .migration-hover-lift:hover {
  box-shadow: none;
  border: 0.92px solid #C5C5C5;
}

.migration-grid {
  display: grid;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  gap: 0.875rem;
  justify-items: center;
  align-items: stretch;
  grid-template-columns: 1fr;
  justify-content: center;
}

.migration-card-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.5rem;
  justify-content: space-between;
}
.migration-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: center;
}
.migration-buttons-grid {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: auto;
}
.migration-option-btn {
  background-color: #e30613;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 9999px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  text-transform: uppercase;
  min-width: 150px;
}
.migration-option-btn:hover {
  background-color: #c50510;
  color: white;
}

.migration-section {
  width: 100%;
  background: #ffffffff;
  padding: 70px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dark .migration-section {
  background: #2c2c2c;
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
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.migration-modal-button {
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 0.875rem;
}

.migration-modal-button.primary {
  background: #e30613;
  color: white;
  border: none;
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

.migration-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 1rem 0;
  font-size: 0.875rem;
  color: #e30613;
}

.migration-checkbox input[type="checkbox"] {
  margin-top: 0.25rem;
}

.migration-modal-top {
  background: white;
  padding: 2rem 1.5rem 1rem;
  border-radius: 1rem 1rem 0 0;
}

.dark .migration-modal-top {
  background: #2C2C2C;
}

.migration-modal-bottom {
  background: #F5F5F5;
  padding: 1rem 1.5rem;
  border-radius: 0 0 1rem 1rem;
  margin-top: -1px;
}

.dark .migration-modal-bottom {
  background: #3A3A3A;
}

:root{
  --bg:#F5F5F5;
  --modal-bg:#ffffff;
  --muted:#F8F8F8;
  --red:#ED1C24;
  --link:#0076B2;
  --border:#C5C5C5;
  --shadow: -0.861px 6.891px 15.505px 0 rgba(79,79,79,0.10);
}

.migration-backdrop{
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:28px;
  background:var(--bg);
  position:fixed;
  inset:0;
  z-index:9999;
}

.migration-modal{
  width:100%;
  max-width:908px;
  background:var(--modal-bg);
  border-radius:22px;
  border:1px solid var(--border);
  box-shadow:var(--shadow);
  overflow:hidden;
}

.migration-header{
  padding:66px 131px 40px 131px;
  text-align:center;
}

.migration-title{
  font-family:Rubik, -apple-system, Roboto, Helvetica, sans-serif;
  font-weight:500;
  font-size:42px;
  text-transform:uppercase;
  margin:0 0 25px 0;
  color:#000;
}

.migration-question{
  max-width:499px;
  margin:0 auto;
  padding:22px;
  font-family:Rubik, -apple-system, Roboto, Helvetica, sans-serif;
  font-size:22px;
  color:#000;
}

.migration-footer{
  background:var(--muted);
  border-top:1px solid var(--border);
  padding:26px 20px;
}

.migration-footer-inner{
  max-width:672px;
  margin:0 auto;
  display:flex;
  flex-direction:column;
  gap:35px;
  align-items:center;
}

.migration-subquestion{
  font-family:Rubik, -apple-system, Roboto, Helvetica, sans-serif;
  font-size:21px;
  color:#000;
  margin:0;
}

.migration-accept{
  display:flex;
  align-items:center;
  gap:15px;
  width:100%;
  padding:0 16px;
}

.migration-checkbox {
  width:18px;
  height:18px;
  background:var(--red);
  border-radius:3px;
  display:flex;
  align-items:center;
  justify-content:center;
  border:none;
  cursor:pointer;
  flex-shrink:0;
}

.migration-terms{
  font-family:Rubik, -apple-system, Roboto, Helvetica, sans-serif;
  font-size:21px;
  color:#000;
}

.migration-terms-link{
  color:var(--link);
  text-decoration:underline;
  margin-left:6px;
}

.migration-actions{
  display:flex;
  gap:13px;
  align-items:center;
  justify-content:center;
  width:100%;
  padding:0 16px 10px 16px;
}

.btn{
  min-width:180px;
  height:42px;
  border-radius:24px;
  font-family:Rubik, -apple-system, Roboto, Helvetica, sans-serif;
  font-weight:700;
  font-size:15px;
  text-transform:uppercase;
  cursor:pointer;
}

.btn--outline{
  background:transparent;
  border:2px solid var(--red);
  color:var(--red);
}

.btn--primary{
  background:var(--red);
  color:#fff;
  border:none;
}

.migration-modal-fade {
  animation: modalFadeIn 0.3s ease-out forwards;
  backdrop-filter: blur(8px);
  background-color: rgba(105, 105, 105, 0.8); /* overlay 696969 + 80% blur */
}
  
@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes modalFadeOut {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-6px) scale(0.99); }
}

@media (max-width: 768px){
  .migration-header{padding:40px 24px 24px 24px}
  .migration-title{font-size:28px}
  .migration-question{font-size:18px;padding:18px}
  .migration-footer{padding:18px}
  .migration-subquestion{font-size:18px}
  .migration-terms{font-size:17px}
  .btn{min-width:140px}
  .migration-footer-inner{gap:20px}
  .migration-actions{flex-direction:column}
}
`;
  }

  setupEventListeners() {
    window.removeEventListener("languageChanged", this.boundHandlers.languageChange);
    window.addEventListener("languageChanged", this.boundHandlers.languageChange);
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
    const isRTL = this.isRTL();
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
      <section class="w-full bg-[#141B4D] dark:bg-[#2c2c2c] migration-section">
        <div class="max-w-[1600px] mx-auto md:px-6">
          <div class="migration-grid">
            <div class="migration-card-shadow migration-hover-lift">
              <div class="migration-card-container">
                <div class="migration-card-content">
                  <h2 class="migration-title font-weight-500 text-5xl mb-6 uppercase">${this.createMixedTitleHTML(data.title)}</h2>
                  <p class="migration-subtitle font-normal text-2xl leading-relaxed mb-8">${data.subtitle}</p>
                </div>
                <div class="migration-buttons-grid">
                  ${data.options
                    .map(
                      (opt, index) => `
                    <button class="migration-option-btn migration-button-zone" data-index="${index}">
                      ${opt.label}
                    </button>
                  `
                    )
                    .join("")}
                </div>
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
    const modalContainer = this.container.querySelector("#migration-modal-container");
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
    this.container.addEventListener("touchend", touchHandler, { passive: false });
  }

  handlePurchaseClick(language, index) {
    const data = migrationData[language];
    const offer = data.options[index].label;
    const confirmTitle = data.confirmTitleTemplate.replace("{offer}", offer);
    const confirmDescription = data.confirmDescriptionTemplate.replace("{offer}", offer);
    const checkboxText = data.checkboxText;
    const subquestion = language === "ar" ? `هل تريد التغيير إلى العرض "${offer}"؟` : `Voulez-vous changer vers l'offre " ${offer} " ?`;
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
      offer
    });
  }

  showConfirmModal({ title, question, subquestion, message, checkboxText, confirmLabel, cancelLabel, successTitle, successMessageTemplate, lang, offer }) {
    const modalContainer = this.container.querySelector("#migration-modal-container");
    if (!modalContainer) return;
    modalContainer.innerHTML = `
      <div class="migration-backdrop migration-modal-fade" role="presentation">
        <div class="migration-modal" role="dialog" aria-modal="true" aria-labelledby="migration-modal-title">
          <header class="migration-header">
            <h1 id="migration-modal-title" class="migration-title">${this.createMixedTitleHTML(title)}</h1>
            <div class="migration-question">${message}</div>
          </header>
          <div class="migration-footer">
            <div class="migration-footer-inner">
              <p class="migration-subquestion">${subquestion}</p>
              <div class="migration-accept">
                <button id="migration-checkbox-btn" class="migration-checkbox" type="button" aria-pressed="false" aria-label="${lang === 'ar' ? 'غير مقبول' : 'unchecked'}"></button>
                <div class="migration-terms">
                  <span>${checkboxText}</span>
                  <a href="#" class="migration-terms-link">${lang === 'ar' ? 'الشروط والأحكام' : 'les termes et conditions du contrat'}</a>
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
    this.setupModalHandlers(modalContainer, { successTitle, successMessageTemplate, lang, offer });
    this.manageFocusForModal(modalContainer);
  }

  setupModalHandlers(modalContainer, { successTitle, successMessageTemplate, lang, offer }) {
    const backdrop = modalContainer.querySelector(".migration-backdrop");
    const checkboxBtn = modalContainer.querySelector("#migration-checkbox-btn");
    const cancelBtn = modalContainer.querySelector('[data-action="cancel"]');
    const confirmBtn = modalContainer.querySelector('[data-action="confirm"]');
    const setChecked = (el, checked) => {
      if (!el) return;
      el.setAttribute("aria-pressed", checked ? "true" : "false");
      el.innerHTML = checked ? `<svg width="18" height="17" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M17 -0.000488281H3C2.46957 -0.000488281 1.96086 0.210225 1.58579 0.585298C1.21071 0.960371 1 1.46908 1 1.99951V15.9995C1 16.5299 1.21071 17.0387 1.58579 17.4137C1.96086 17.7888 2.46957 17.9995 3 17.9995H17C17.5304 17.9995 18.0391 17.7888 18.4142 17.4137C18.7893 17.0387 19 16.5299 19 15.9995V1.99951C19 1.46908 18.7893 0.960371 18.4142 0.585298C18.0391 0.210225 17.5304 -0.000488281 17 -0.000488281Z" fill="#ED1C24"/><path d="M8 13.9996L4 9.99959L5.41 8.57959L8 11.1696L14.59 4.57959L16 5.99959" fill="white"/></svg>` : ``;
    };
    setChecked(checkboxBtn, false);
    const toggle = (e) => {
      e.stopPropagation();
      const cur = checkboxBtn.getAttribute("aria-pressed") === "true";
      setChecked(checkboxBtn, !cur);
    };
    checkboxBtn.addEventListener("click", toggle);
    const closeModal = () => {
      if (backdrop) backdrop.style.animation = "modalFadeOut 0.2s ease-in forwards";
      setTimeout(() => {
        modalContainer.innerHTML = "";
      }, 200);
    };
    cancelBtn.addEventListener("click", closeModal);
    confirmBtn.addEventListener("click", () => {
      const checked = checkboxBtn.getAttribute("aria-pressed") === "true";
      if (!checked) {
        alert(lang === "ar" ? "يرجى قبول الشروط والأحكام." : "Veuillez accepter les termes et conditions.");
        return;
      }
      closeModal();
      setTimeout(() => {
        this.showSuccessModal({ title: successTitle, message: (successMessageTemplate || "").replace("{offer}", offer), lang });
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
    const modalContainer = this.container.querySelector("#migration-modal-container");
    if (!modalContainer) return;
    modalContainer.innerHTML = `
      <div class="migration-backdrop migration-modal-fade" role="presentation">
        <div class="migration-modal" role="dialog" aria-modal="true" aria-labelledby="migration-success-title">
          <header class="migration-header">
            <h1 id="migration-success-title" class="migration-title">${this.createMixedTitleHTML(title)}</h1>
            <div class="migration-question">${lang === 'ar' ? 'تم' : 'Succès'}</div>
          </header>
          <div class="migration-footer">
            <div class="migration-footer-inner">
              <p class="migration-subquestion">${message}</p>
              <div class="migration-actions">
                <button class="btn btn--primary" data-action="close">${migrationData[lang].ok}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    const backdrop = modalContainer.querySelector(".migration-backdrop");
    const closeBtn = modalContainer.querySelector('[data-action="close"]');
    const close = () => {
      if (backdrop) backdrop.style.animation = "modalFadeOut 0.2s ease-in forwards";
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

  closeAnyOpenModals() {
    const modalContainer = this.container.querySelector("#migration-modal-container");
    if (modalContainer && modalContainer.innerHTML.trim()) {
      modalContainer.innerHTML = "";
    }
  }

  handleLanguageChange() {
    const newLanguage = this.getLanguage();
    if (newLanguage !== this.currentLang) {
      this.currentLang = newLanguage;
      this.closeAnyOpenModals();
      this.render();
    }
  }

  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.render();
    }, 100);
  }

  manageFocusForModal(modalContainer) {
    this.previouslyFocusedElement = document.activeElement;
    setTimeout(() => {
      const firstButton = modalContainer.querySelector("[data-action], #migration-checkbox-btn");
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
    window.removeEventListener("languageChanged", this.boundHandlers.languageChange);
    window.removeEventListener("resize", this.boundHandlers.resize);
    this.cleanupAllEventListeners();
    if (this.keyboardHandler) this.container.removeEventListener("keydown", this.keyboardHandler);
    const modalContainer = this.container.querySelector("#migration-modal-container");
    if (modalContainer) modalContainer.innerHTML = "";
    this.container.innerHTML = "";
  }
}

export default MigrationComponent;
