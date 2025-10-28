// BoostComponent.js
import boostData from "./BoostData.js";

class BoostComponent {
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
    if (!document.getElementById("boost-styles")) {
      const styleElement = document.createElement("style");
      styleElement.id = "boost-styles";
      styleElement.textContent = this.getStylesheet();
      document.head.appendChild(styleElement);
    }
  }

  getStylesheet() {
    return `
    .boost-section {
      padding: 70px 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: white;
    }
    .dark .boost-section {
      background: #141414
    }

    .boost-card-shadow {
      box-shadow: 0px 7px 15px 0px rgba(79,79,79,0.10);
      border: 1px solid #C5C5C5;
      border-radius: 22px;
      width: 100%;
      max-width: 900px; /* Use max-width instead of fixed width */
      height: auto; /* Use auto height */
      background: white;
      color: #000;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2.5rem 1rem; /* Responsive padding */
      gap: 2rem; /* Consistent gap */
      transition: all 0.3s ease;
    }
    .dark .boost-card-shadow {
      background: #2c2c2c;
      color: #d1d5db;
    }
    .boost-card-shadow:hover {
      transform: translateY(-5px);
      box-shadow: 0px 12px 24px 0px rgba(79,79,79,0.12);
    }

    .boost-title {
      font-weight: 500;
      font-size: clamp(1.75rem, 5vw, 2.625rem); /* Fluid font size */
      text-transform: uppercase;
      line-height: 1.1;
      text-align: center;
      word-break: break-word;
    }

    .boost-description {
      font-weight: 400;
      font-size: clamp(1rem, 2.5vw, 1.375rem); /* Fluid font size */
      line-height: 1.5;
      max-width: 668px;
      text-align: center;
      margin: 0 auto;
    }

    .boost-price {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.5rem;
    }
    .boost-price .big {
      font-size: clamp(1.75rem, 5vw, 2.25rem); /* Fluid font size */
      font-weight: 700;
    }
    .boost-price .small {
      font-size: clamp(1.125rem, 3vw, 1.375rem); /* Fluid font size */
      font-weight: 700;
    }

    .boost-buy-btn {
      background-color: #e30613;
      color: white;
      border: none;
      padding: 0.75rem 2rem; /* Responsive padding */
      border-radius: 9999px;
      font-size: clamp(0.875rem, 2.5vw, 1.125rem); /* Fluid font size */
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
      text-transform: uppercase;
      min-width: 180px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .boost-buy-btn:hover {
      background-color: #c50510;
      transform: scale(1.05);
    }

    .boost-modal-fade {
      animation: modalFadeIn 0.3s ease-out forwards;
      backdrop-filter: blur(8px);
    }
    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes modalFadeOut {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.95); }
    }
    
    @media (max-width: 640px) {
      .boost-section {
        padding: 2rem 1rem;
      }
      .boost-card-shadow {
        padding: 2rem 1.5rem;
        gap: 1.5rem;
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
      const data = boostData[language];

      if (!data) {
        console.error("Missing data for language:", language);
        const fallbackData = boostData.fr;
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
      <section class="boost-section">
        <div class="boost-card-shadow">
          
          <div class="flex flex-col items-center gap-4 md:gap-6 text-center">
            <h2 class="boost-title dark:text-white">
              ${this.createMixedTitleHTML(data.title)}
            </h2>
            <p class="boost-description dark:text-white ${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}" >
              ${data.description}
            </p>
          </div>

          <div class="flex flex-col items-center gap-4 md:gap-5">
            <div class="boost-price dark:text-white">
              <span class="big font-rubik">500</span>
              <span class="small ${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}">${isRTL ? "دج" : "DA"}</span>
            </div>

            <button class="boost-buy-btn" data-index="0">
              <span class="text-white ${isRTL ? "font-noto-kufi-arabic" : "font-rubik"} font-semibold leading-normal uppercase">
                ${data.buy}
              </span>
            </button>
          </div>

        </div>
      </section>

      <div id="boost-modal-container"></div>
    </div>
  `;

    this.bindPurchaseButtons(language);

    setTimeout(() => {
      this.addAccessibility && this.addAccessibility();
    }, 50);
  }

  renderErrorState() {
    this.container.innerHTML = `
      <div class="w-full flex items-center justify-center py-16">
        <div class="text-center">
          <p class="text-gray-600 dark:text-gray-400 mb-4">Une erreur s'est produite lors du chargement du boost</p>
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
      "#boost-modal-container"
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
      const button = e.target.closest(".boost-buy-btn");
      if (!button) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const index = parseInt(button.getAttribute("data-index"), 10);
      if (index === 0) {
        setTimeout(() => {
          this.handlePurchaseClick(language);
        }, 50);
      }
    };

    const touchHandler = (e) => {
      const button = e.target.closest(".boost-buy-btn");
      if (!button) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const index = parseInt(button.getAttribute("data-index"), 10);
      if (index === 0) {
        setTimeout(() => {
          this.handlePurchaseClick(language);
        }, 50);
      }
    };

    this.purchaseClickHandler = clickHandler;
    this.purchaseTouchHandler = touchHandler;

    this.container.addEventListener("click", clickHandler);
    this.container.addEventListener("touchend", touchHandler, {
      passive: false,
    });
  }

  handlePurchaseClick(language) {
    const currentLanguage = this.getLanguage();
    const data = boostData[currentLanguage];

    this.showPurchaseFlow(data, currentLanguage === "ar");
  }

  showPurchaseFlow(data, isRTL) {
    this.showModal({
      type: "confirm",
      title: data.confirmTitle,
      message: data.confirmDescription,
      isRTL,
      onConfirm: () => {
        const isInsufficient = Math.random() > 0.7;
        this.showSuccessModal(data, isRTL);
      },
    });
  }

  showInsufficientModal(data, isRTL) {
    this.showModal({
      type: "info",
      title: data.insufficientTitle,
      message: data.insufficientMessage,
      isRTL,
    });
  }

  showSuccessModal(data, isRTL) {
    this.showModal({
      type: "success",
      title: data.successTitle,
      message: data.successMessage,
      isRTL,
      onConfirm: () => {
        const isInsufficient = Math.random() > 0.7;
        this.showInsufficientModal(data, isRTL);
      },
    });
  }

  showModal({ type, title, message, isRTL = false, onConfirm }) {
    try {
      const modalContainer = this.container.querySelector(
        "#boost-modal-container"
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
    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";
    const buttons = this.getModalButtons(type, isRTL);

    return `
      <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 boost-modal-fade"
          style="background-color: rgba(105, 105, 105, 0.8);"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title">
          <div class="relative bg-white dark:bg-[#2C2C2C] rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl min-w-[320px] px-6 md:px-8 pt-16 pb-8 md:pb-12" ${dirAttribute}>
              <button class="absolute top-4 right-4 p-2 z-10 rounded-full transition-all duration-200 boost-modal-close"
                      aria-label="${isRTL ? "إغلاق" : "Fermer"}">
                  <img src="./assets/images/Close.svg" alt="close" class="w-6 h-6 block"/>
              </button>
              <div class="text-center mb-6">
                  <h2 id="modal-title" class="${fontClass} font-semibold text-ooredoo-red dark:text-white text-2xl md:text-3xl leading-tight uppercase tracking-tight">
                      ${this.createMixedTitleHTML(title)}
                  </h2>
              </div>
              <div class="text-center mb-10">
                  <p class="${fontClass} text-gray-800 dark:text-gray-200 leading-relaxed text-base md:text-lg px-2">
                      ${message}
                  </p>
              </div>
              <div class="flex justify-center flex-nowrap">${buttons}</div>
          </div>
      </div>
    `;
  }

  getModalButtons(type, isRTL) {
    const data = boostData[this.currentLang];
    const labels = {
      cancel: data.cancelBtn,
      confirm: data.confirmBtn,
      close: data.ok,
    };

    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";
    const primaryBtn = `boost-modal-button primary ${fontClass} font-semibold text-base uppercase w-36 xs:w-40 h-12 rounded-full border-none cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-ooredoo-red text-white shadow-lg`;
    const secondaryBtn = `boost-modal-button secondary ${fontClass} font-semibold text-base uppercase w-36 xs:w-40 h-12 rounded-full cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-white text-ooredoo-red border-2 border-ooredoo-red shadow-md dark:bg-[#2C2C2C] dark:text-white dark:border-white`;
    const buttonGap = "gap-2 sm:gap-4 flex-nowrap";

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
    const modal = modalContainer.querySelector(".boost-modal-fade");
    const closeButton = modal.querySelector(".boost-modal-close");
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
    closeButton.addEventListener("click", closeClickHandler);
    modalHandlers.set("close-click", {
      element: closeButton,
      type: "click",
      handler: closeClickHandler,
    });

    actionButtons.forEach((button) => {
      const actionClickHandler = () => {
        closeModal();

        setTimeout(() => {
          if (onConfirm) onConfirm();
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
      "#boost-modal-container"
    );
    if (modalContainer) {
      modalContainer.innerHTML = "";
    }

    this.container.innerHTML = "";
  }
}

export default BoostComponent;
