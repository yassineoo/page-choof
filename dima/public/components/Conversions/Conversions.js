import conversionsData from "./ConversionsData.js";

class ConversionsComponent {
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
    if (!document.getElementById("conversions-styles")) {
      const styleElement = document.createElement("style");
      styleElement.id = "conversions-styles";
      styleElement.textContent = this.getStylesheet();
      document.head.appendChild(styleElement);
    }
  }

  getStylesheet() {
    return `
  :root {
    --bg: #F5F5F5;
    --modal-bg: #ffffff;
    --muted: #F8F8F8;
    --red: #ED1C24;
    --border: #C5C5C5;
    --border-dashed: #CDCDCD;
    --shadow: -0.861px 6.891px 15.505px 0 rgba(79, 79, 79, 0.10);
  }

  .conversions-backdrop {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px;
    background: var(--bg);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
  }

  .conversions-modal {
    width: 100%;
    max-width: 908px;
    background: var(--modal-bg);
    border-radius: 22px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    overflow: hidden;
    max-height: 90vh;
    overflow-y: auto;
  }

  .conversions-header {
    padding: 70px 20px 45px 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  .conversions-title {
    font-family: Rubik, -apple-system, Roboto, Helvetica, sans-serif;
    font-weight: 500;
    font-size: 42px;
    text-transform: uppercase;
    margin: 0;
    color: #000;
  }

  .conversions-question {
    font-family: Rubik, -apple-system, Roboto, Helvetica, sans-serif;
    font-size: 22px;
    color: #000;
    margin: 0;
    max-width: 554px;
  }

  .btn-cancel {
    width: 205px;
    height: 47px;
    border: 2px solid var(--red);
    border-radius: 22px;
    background: transparent;
    color: var(--red);
    font-family: Rubik, -apple-system, Roboto, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 17px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-cancel:hover {
    background: var(--red);
    color: white;
  }

  .conversions-content {
    background: var(--muted);
    border-top: 1px solid var(--border);
    padding: 70px 20px;
  }

  .plans-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px 36px;
    max-width: 800px;
    margin: 0 auto;
  }

  .plan-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    width: 380px;
    max-width: 100%;
  }

  .plan-header {
    padding: 13px;
    border-bottom: 1px dashed var(--border-dashed);
    text-align: center;
  }

  .plan-name {
    font-family: Rubik, -apple-system, Roboto, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 22px;
    color: var(--red);
    text-transform: uppercase;
    margin: 0;
  }

  .plan-body {
    padding: 22px 17px 25px 17px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .plan-description {
    font-family: Rubik, -apple-system, Roboto, Helvetica, sans-serif;
    font-size: 14px;
    line-height: 20px;
    color: #000;
    text-align: center;
    margin: 0;
    max-width: 347px;
    min-height: 66px;
    display: flex;
    align-items: center;
  }

  .plan-pricing {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-top: auto;
  }

  .plan-price {
    text-align: center;
    font-family: Rubik, -apple-system, Roboto, Helvetica, sans-serif;
    color: #000;
  }

  .price-amount {
    font-weight: 700;
    font-size: 28px;
  }

  .price-currency {
    font-weight: 700;
    font-size: 18px;
  }

  .price-duration {
    font-weight: 700;
    font-size: 13px;
  }

  .btn-convert {
    width: 113px;
    height: 32px;
    background: var(--red);
    border: none;
    border-radius: 22px;
    color: white;
    font-family: Rubik, -apple-system, Roboto, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 14px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .btn-convert:hover {
    background: #d1182f;
  }

  .conv-card-footer {
    margin-top: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
  }

  .boost-buy-btn:hover {
    background-color: #c50510;
    color: white;
  }

  @media (max-width: 768px) {
    .conversions-header {
      padding: 40px 16px 24px 16px;
    }

    .conversions-title {
      font-size: 28px;
    }

    .conversions-question {
      font-size: 18px;
    }

    .btn-cancel {
      width: 160px;
      height: 40px;
      font-size: 15px;
    }

    .conversions-content {
      padding: 40px 16px;
    }

    .plans-grid {
      grid-template-columns: 1fr;
      gap: 24px;
      max-width: 380px;
    }

    .plan-card {
      width: 100%;
    }

    .plan-body {
      padding: 18px 14px 20px 14px;
    }

    .plan-description {
      font-size: 13px;
      line-height: 18px;
    }

    .conv-card-footer {
      flex-direction: column;
      align-items: center;
      padding-top: 16px;
    }

    .boost-title {
      font-size: 32px;
      margin-bottom: 16px;
    }

    .boost-description {
      font-size: 18px;
      margin-bottom: 20px;
    }

    .boost-buy-btn {
      width: 100%;
      max-width: 250px;
      margin: 0 auto;
    }
  }

  @media (max-width: 480px) {
    .conversions-backdrop {
      padding: 16px;
    }

    .conversions-header {
      padding: 30px 12px 20px 12px;
    }

    .conversions-title {
      font-size: 24px;
    }

    .conversions-question {
      font-size: 16px;
    }

    .conversions-content {
      padding: 30px 12px;
    }

    .plans-grid {
      gap: 20px;
    }

    .boost-card-shadow {
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
      const data = conversionsData[language];
      if (!data) {
        console.error("Missing data for language:", language);
        const fallbackData = conversionsData.fr;
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
                <div class="conv-card-footer">
                  <button class="boost-buy-btn boost-button-zone" data-action="convert-to-credit">
                    ${data.convertToCredit}
                  </button>
                  <button class="boost-buy-btn boost-button-zone" data-action="other-conversions">
                    ${data.otherConversions}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div id="boost-modal-container"></div>
      <div id="conversions-modal-container"></div>
    </div>
    `;
    this.bindPurchaseButtons(language);
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
    const conversionsModalContainer = this.container.querySelector(
      "#conversions-modal-container"
    );
    if (
      conversionsModalContainer &&
      conversionsModalContainer.innerHTML.trim()
    ) {
      conversionsModalContainer.innerHTML = "";
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
      const action = button.getAttribute("data-action");
      if (action === "convert-to-credit") {
        setTimeout(() => {
          this.handleConvertToCreditClick(language);
        }, 50);
      } else if (action === "other-conversions") {
        setTimeout(() => {
          this.handleOtherConversionsClick(language);
        }, 50);
      }
    };
    const touchHandler = (e) => {
      const button = e.target.closest(".boost-buy-btn");
      if (!button) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const action = button.getAttribute("data-action");
      if (action === "convert-to-credit") {
        setTimeout(() => {
          this.handleConvertToCreditClick(language);
        }, 50);
      } else if (action === "other-conversions") {
        setTimeout(() => {
          this.handleOtherConversionsClick(language);
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

  handleConvertToCreditClick(language) {
    const currentLanguage = this.getLanguage();
    const data = conversionsData[currentLanguage];
    this.showConfirmConversionModal(data, currentLanguage === "ar");
  }

  handleOtherConversionsClick(language) {
    const currentLanguage = this.getLanguage();
    const data = conversionsData[currentLanguage];
    this.showConversionsModal(data, currentLanguage === "ar");
  }

  showConfirmConversionModal(data, isRTL) {
    this.showModal({
      type: "confirm",
      title: data.confirmTitle,
      message: data.confirmDescription,
      isRTL,
      onConfirm: () => {
        this.showCreditSuccessModal(data, isRTL);
      },
    });
  }

  showCreditSuccessModal(data, isRTL) {
    const currentLanguage = this.getLanguage();
    const felicitationsText =
      currentLanguage === "ar" ? "هنيئًا!" : "Félicitations";

    this.showModal({
      type: "credit-success",
      title: felicitationsText,
      message: "",
      isRTL,
    });
  }

  showConversionsModal(data, isRTL) {
    const plans = data.plans;
    const modalContainer = this.container.querySelector(
      "#conversions-modal-container"
    );
    if (!modalContainer) {
      console.error("Conversions modal container not found");
      return;
    }
    modalContainer.innerHTML = `
      <div class="conversions-backdrop">
        <div class="conversions-modal" role="dialog" aria-modal="true">
          <header class="conversions-header">
            <h1 class="conversions-title">${this.createMixedTitleHTML(
              data.title
            )}</h1>
            <p class="conversions-question">
              ${data.description}
            </p>
            <button class="btn-cancel" id="close-conversions-modal">
              ${data.cancelBtn}
            </button>
          </header>
          <div class="conversions-content">
            <div class="plans-grid">
              ${plans
                .map(
                  (plan) => `
                <div key="${plan.name}" class="plan-card">
                  <div class="plan-header">
                    <h3 class="plan-name">${plan.name}</h3>
                  </div>
                  <div class="plan-body">
                    <p class="plan-description">${plan.description}</p>
                    <div class="plan-pricing">
                      <div class="plan-price">
                        <span class="price-amount">${plan.price}</span>
                        <span class="price-currency">${plan.priceUnit}</span>
                        <span class="price-duration">${plan.duration}</span>
                      </div>

                      <button class="btn-convert" data-action="convert-to-${plans.indexOf(
                        plan
                      )}">
  ${data.convertBtn}
</button>
                    </div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
    `;
    const buttons = modalContainer.querySelectorAll(".btn-convert");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.getAttribute("data-action");
        this.handleConversionOptionClick(action, isRTL, plans);
      });
    });
    const closeButton = modalContainer.querySelector(
      "#close-conversions-modal"
    );
    closeButton.addEventListener("click", () => {
      modalContainer.innerHTML = "";
    });
  }

  handleConversionOptionClick(action, isRTL, plans) {
    const modalContainer = this.container.querySelector(
      "#conversions-modal-container"
    );
    modalContainer.innerHTML = "";
    const planIndex = parseInt(action.split("-")[2]);
    const selectedPlan = plans[planIndex];
    if (!selectedPlan) {
      console.error("Plan non trouvé");
      return;
    }
    this.showModal({
      type: "confirm",
      title: "Confirmer la conversion",
      message: `Vous allez convertir votre forfait Dima 2500 en ${selectedPlan.name} ?`,
      isRTL,
      onConfirm: () => {
        this.showSuccessModal(selectedPlan, isRTL);
      },
      onCancel: () => {
        this.showConversionsModal(conversionsData[this.currentLang], isRTL);
      },
    });
  }

  showSuccessModal(plan, isRTL) {
    const currentLanguage = this.getLanguage();
    const data = conversionsData[currentLanguage];
    const message = data.successDescription
      .replace("{planName}", plan.name)
      .replace("{planDescription}", plan.description);
    this.showModal({
      type: "info",
      title: data.successTitle,
      message: message,
      isRTL,
    });
  }

  showModal({ type, title, message, isRTL = false, onConfirm, onCancel }) {
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
      this.setupModalEvents({ type, onConfirm, onCancel, modalContainer });
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
    const messageHTML =
      type === "credit-success"
        ? ""
        : `
  <div class="text-center mb-10">
      <p class="${fontClass} text-gray-800 dark:text-gray-200 leading-relaxed text-base md:text-lg px-2">
          ${message}
      </p>
  </div>
`;
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
${messageHTML}

              <div class="flex justify-center boost-modal-buttons">${buttons}</div>
          </div>
      </div>
    `;
  }

  getModalButtons(type, isRTL) {
    const data = conversionsData[this.currentLang];
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
      "credit-success": `
    <div class="flex ${buttonGap}">
      <button class="${primaryBtn}" data-action="close">${labels.close}</button>
    </div>
  `,
    };
    return buttonConfigs[type] || buttonConfigs.success;
  }

  setupModalEvents({ type, onConfirm, onCancel, modalContainer }) {
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
          if (action === "confirm" && onConfirm) onConfirm();
          if (action === "cancel" && onCancel) onCancel();
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

export default ConversionsComponent;
