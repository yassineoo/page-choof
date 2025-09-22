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
    .boost-card-shadow {
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

    .dark .boost-card-shadow {
      box-shadow: none;
      border: 0.92px solid #C5C5C5;
      background: #2C2C2C;
      color: #d1d5db;
    }

    [dir="rtl"] .boost-card-shadow {
      text-align: right;
    }
    [dir="rtl"] .boost-price {
      flex-direction: row-reverse;
    }
    [dir="rtl"] .boost-price .small {
      margin-left: 0;
      margin-right: 4px;
    }

    .boost-modal-fade {
      animation: modalFadeIn 0.3s ease-out forwards;
      backdrop-filter: blur(8px);
      background-color: rgba(105, 105, 105, 0.8);
    }

    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.95) translateY(-8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .boost-hover-lift {
      transition: all 0.3s ease;
    }
    .boost-hover-lift:hover {
      transform: translateY(-3px);
      box-shadow: 0px 8px 16px 0px #0505051A;
      border: 0.92px solid #C5C5C5;
    }
    .dark .boost-hover-lift:hover {
      box-shadow: none;
      border: 0.92px solid #C5C5C5;
    }

    .boost-grid {
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

    .boost-card-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 1.5rem;
      justify-content: space-between;
    }
    .boost-card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      text-align: center;
    }
    .boost-card-footer {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .boost-title {
      font-weight: 500;
      font-size: 42px;
      margin-bottom: 24px;
      text-transform: uppercase;
    }
    .boost-description {
      font-weight: 400;

      font-size: 22px;
      line-height: 1.5;
      margin-bottom: 1.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .boost-price {
      font-weight: 600;
      display: flex;
      align-items: baseline;
      justify-content: center;
    }
    .boost-price .big {
      font-size: 36px;
    }
    .boost-price .small {
      font-size: 22px;
    }
    .boost-buy-btn {
      position: relative;
      overflow: hidden;
      z-index: 10;
      touch-action: manipulation;
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
      min-width: 200px;
    }
    .boost-buy-btn:hover {
      background-color: #c50510;
      color: white;
    }

    .boost-section {
      width: 100%;
      background: #ffffffff;
      padding: 70px 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .dark .boost-section {
      background: #2c2c2c;
    }

    @keyframes modalFadeOut {
      from { opacity: 1; transform: scale(1) translateY(0); }
      to { opacity: 0; transform: scale(0.95) translateY(-10px); }
    }

    .boost-modal-close {
      transition: all 0.2s ease;
    }
    .boost-modal-close:hover {
      transform: scale(1.1);
    }

    .boost-modal-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .boost-modal-button {
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      font-size: 0.875rem;
    }

    .boost-modal-button.primary {
      background: #e30613;
      color: white;
      border: none;
    }

    .boost-modal-button.primary:hover {
      background: #c50510;
    }

    .boost-modal-button.secondary {
      background: white;
      color: #e30613;
      border: 2px solid #e30613;
    }

    .boost-modal-button.secondary:hover {
      background: #e30613;
      color: white;
    }

    @media (max-width: 640px) {
      .boost-card-shadow {
        min-height: 380px;
        padding: 1.25rem;
        margin: 0 auto;
      }
      .boost-title {
        font-size: 32px;
        margin-bottom: 20px;
      }
      .boost-description {
        font-size: 18px;
      }
      .boost-price .big {
        font-size: 28px;
      }
      .boost-price .small {
        font-size: 18px;
      }
      .boost-price {
        margin-bottom: 14px;
      }
      .boost-modal-buttons {
        flex-direction: row !important;
        gap: 12px !important;
        justify-content: center;
        align-items: center;
      }
      .boost-modal-button {
        width: auto !important;
        min-width: 120px !important;
        flex: 1;
        max-width: 150px;
      }
    }
    @media (max-width: 480px) {
      .boost-card-shadow {
        min-height: 360px;
        padding: 1rem;
      }
    }

    @media (max-width: 1279px) {
      .boost-card-container {
        min-height: 360px !important;
      }
    }
    @media (max-width: 991px) {
      .boost-card-container {
        min-height: 340px !important;
      }
    }
    @media (max-width: 767px) {
      .boost-card-container {
        min-height: 320px !important;
      }
    }

    @media (min-width: 768px) and (max-width: 1279px) and ([dir="rtl"]) {
      .boost-card-container {
        text-align: right;
      }
      .boost-card-content ul {
        padding-right: 0;
        padding-left: 1rem;
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
    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

    this.cleanupAllEventListeners();

    this.container.innerHTML = `
    <div class="w-full">
      <section class="w-full bg-[#141B4D] dark:bg-[#2c2c2c] boost-section">
        <div class="max-w-[1600px] mx-auto md:px-6">
          <div class="boost-grid">
            <div class="boost-card-shadow boost-hover-lift">
              <div class="boost-card-container">
                <div class="boost-card-content">
                  <h2 class="boost-title">${this.createMixedTitleHTML(
                    data.title
                  )}</h2>
                  <p class="boost-description">${data.description}</p>
                </div>
                <div class="boost-card-footer">
                  <div class="flex items-baseline gap-x-2 text-center" ${
                    isRTL ? 'dir="rtl"' : 'dir="ltr"'
                  }>
                    ${
                      isRTL
                        ? `
                          <span class="${fontClass} font-semibold text-[36px] leading-[43px]" dir="ltr" style="unicode-bidi:isolate; white-space:nowrap;">500</span>
                          <span class="${fontClass} font-semibold text-[22px] leading-[28px]" dir="rtl">دج</span>
     `
                        : `<span class="${fontClass} font-semibold text-[36px] leading-[43px]" dir="ltr" style="unicode-bidi:isolate; white-space:nowrap;">500</span>
                           <span class="${fontClass} font-semibold text-[22px] leading-[28px]" dir="ltr">DA</span>`
                    }
                  </div>

                  <button class="boost-buy-btn boost-button-zone" data-index="0">
                    ${data.buy}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="boost-modal-container"></div>
    </div>
  `;

    this.bindPurchaseButtons(language);
    setTimeout(() => this.addAccessibility(), 50);
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
        // if (isInsufficient) {
        // this.showInsufficientModal(data, isRTL);
        //  } else {
        this.showSuccessModal(data, isRTL);
        // }
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
    const closeButtonPosition = isRTL ? "left-4" : "right-4";
    const buttons = this.getModalButtons(type, isRTL);
    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

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
              <div class="flex justify-center boost-modal-buttons">${buttons}</div>
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
    const primaryBtn = `boost-modal-button primary ${fontClass} font-semibold text-base uppercase w-40 h-12 rounded-full border-none cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-ooredoo-red text-white shadow-lg`;
    const secondaryBtn = `boost-modal-button secondary ${fontClass} font-semibold text-base uppercase w-40 h-12 rounded-full cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-white text-ooredoo-red border-2 border-ooredoo-red shadow-md dark:bg-[#2C2C2C] dark:text-white dark:border-white`;
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
        const action = button.getAttribute("data-action");
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
