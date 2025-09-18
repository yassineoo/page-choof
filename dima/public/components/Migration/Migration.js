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

    @media (max-width: 640px) {
      .migration-card-shadow {
        min-height: 380px;
        padding: 1.25rem;
        margin: 0 auto;
      }
      .migration-title {
        font-size: 32px;
        margin-bottom: 20px;
      }
      .migration-subtitle {
        font-size: 18px;
      }
      .migration-modal-buttons {
        flex-direction: row !important;
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
    }
    @media (max-width: 480px) {
      .migration-card-shadow {
        min-height: 360px;
        padding: 1rem;
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

    this.container.innerHTML = `
    <div class="w-full">
      <section class="w-full bg-[#141B4D] dark:bg-[#2c2c2c] migration-section">
        <div class="max-w-[1600px] mx-auto md:px-6">
          <div class="migration-grid">
            <div class="migration-card-shadow migration-hover-lift">
              <div class="migration-card-container">
                <div class="migration-card-content">
                  <h2 class="migration-title font-weight-500 text-5xl mb-6 uppercase">${this.createMixedTitleHTML(
                    data.title
                  )}</h2>
                  <p class="migration-subtitle font-normal text-2xl leading-relaxed mb-8">${
                    data.subtitle
                  }</p>
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

    setTimeout(() => {
      this.addAccessibility();
    }, 50);
  }

  renderErrorState() {
    this.container.innerHTML = `
      <div class="w-full flex items-center justify-center py-16">
        <div class="text-center">
          <p class="text-gray-600 dark:text-gray-400 mb-4">Une erreur s'est produite lors du chargement de la migration</p>
          <button onclick="location.reload()" 
                  class="bg-red-600 text-white px-4 py-2 rounded-full">
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
    const hasCheckbox = data.options[index].hasCheckbox;
    const isRTL = language === "ar";

    const confirmTitle = data.confirmTitleTemplate.replace("{offer}", offer);
    const confirmDescription = data.confirmDescriptionTemplate.replace(
      "{offer}",
      offer
    );
    const checkboxText = hasCheckbox ? data.checkboxText : null;

    this.showConfirmModal(
      data,
      isRTL,
      confirmTitle,
      confirmDescription,
      checkboxText,
      offer
    );
  }

  showConfirmModal(
    data,
    isRTL,
    confirmTitle,
    confirmDescription,
    checkboxText,
    offer
  ) {
    this.showModal({
      type: "confirm",
      title: confirmTitle,
      message: confirmDescription,
      checkboxText,
      isRTL,
      onConfirm: () => {
        this.showSuccessModal(data, isRTL, offer);
      },
    });
  }

  showSuccessModal(data, isRTL, offer) {
    const successMessage = data.successMessageTemplate.replace(
      "{offer}",
      offer === "DIMA+" ? "Dima Ooredoo" : offer
    );
    this.showModal({
      type: "success",
      title: data.successTitle,
      message: successMessage,
      isRTL,
    });
  }

  showModal({
    type,
    title,
    message,
    checkboxText = null,
    isRTL = false,
    onConfirm,
  }) {
    try {
      const modalContainer = this.container.querySelector(
        "#migration-modal-container"
      );
      if (!modalContainer) {
        console.error("Modal container not found");
        return;
      }

      const modalHTML = this.createModalHTML({
        type,
        title,
        message,
        checkboxText,
        isRTL,
      });
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

  createModalHTML({ type, title, message, checkboxText, isRTL }) {
    const dirAttribute = isRTL ? `dir="rtl"` : "";
    const closeButtonPosition = isRTL ? "left-4" : "right-4";
    const buttons = this.getModalButtons(type, isRTL);
    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";
    const checkboxHTML = checkboxText
      ? `
      <div class="migration-checkbox text-left ${isRTL ? "text-right" : ""}">
        <input type="checkbox" id="terms-checkbox" required>
        <label for="terms-checkbox" class="${fontClass}">${checkboxText}</label>
      </div>
    `
      : "";

    return `
      <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 migration-modal-fade"
          style="background-color: rgba(105, 105, 105, 0.8);"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title">
          <div class="relative bg-white dark:bg-[#2C2C2C] rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl min-w-[320px]" ${dirAttribute}>
              <div class="migration-modal-top">
                  <button class="absolute top-4 ${closeButtonPosition} p-2 z-10 rounded-full transition-all duration-200 migration-modal-close"
                          aria-label="${isRTL ? "إغلاق" : "Fermer"}">
                      <img src="./assets/images/Close.svg" alt="close" class="w-6 h-6 block"/>
                  </button>
                  <div class="text-center mb-6">
                      <h2 id="modal-title" class="${fontClass} font-semibold text-red-600 dark:text-white text-2xl md:text-3xl leading-tight uppercase tracking-tight">
                          ${this.createMixedTitleHTML(title)}
                      </h2>
                  </div>
                  <div class="text-center mb-10">
                      <p class="${fontClass} text-gray-800 dark:text-gray-200 leading-relaxed text-base md:text-lg px-2">
                          ${message}
                      </p>
                  </div>
              </div>
              <div class="migration-modal-bottom">
                  ${checkboxHTML}
                  <div class="flex justify-center migration-modal-buttons">${buttons}</div>
              </div>
          </div>
      </div>
    `;
  }

  getModalButtons(type, isRTL) {
    const data = migrationData[this.currentLang];
    const labels = {
      cancel: data.cancelBtn,
      confirm: data.confirmBtn,
      close: data.ok,
    };

    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";
    const primaryBtn = `migration-modal-button primary ${fontClass} font-semibold text-base uppercase w-40 h-12 rounded-full border-none cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-red-600 text-white shadow-lg`;
    const secondaryBtn = `migration-modal-button secondary ${fontClass} font-semibold text-base uppercase w-40 h-12 rounded-full cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-white text-red-600 border-2 border-red-600 shadow-md dark:bg-[#2C2C2C] dark:text-white dark:border-white`;
    const buttonGap = "gap-4 flex-wrap sm:flex-nowrap";

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
    };

    return buttonConfigs[type] || buttonConfigs.success;
  }

  setupModalEvents({ type, onConfirm, modalContainer }) {
    const modal = modalContainer.querySelector(".migration-modal-fade");
    const closeButton = modal.querySelector(".migration-modal-close");
    const actionButtons = modal.querySelectorAll("[data-action]");
    const checkbox = modal.querySelector("#terms-checkbox");

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
    closeButton.addEventListener("click", closeClickHandler);
    modalHandlers.set("close-click", {
      element: closeButton,
      type: "click",
      handler: closeClickHandler,
    });

    actionButtons.forEach((button) => {
      const actionClickHandler = () => {
        const action = button.getAttribute("data-action");
        if (action === "confirm" && checkbox && !checkbox.checked) {
          alert(
            this.currentLang === "fr"
              ? "Veuillez accepter les termes et conditions."
              : "يرجى قبول الشروط والأحكام."
          );
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

export default MigrationComponent;
