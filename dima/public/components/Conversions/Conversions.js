import conversionsData from "./ConversionsData.js";

class ConversionsComponent {
  constructor(container) {
    this.container = container;
    this.currentLang = this.getLanguage();
    this.isAccordionOpen = false;
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
      --red: #e30613;
      --border: #C5C5C5;
      --border-dashed: #CDCDCD;
      --shadow: 0px 7px 15px rgba(79, 79, 79, 0.10);
    }
    .conversions-section{
      padding: 70px 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: white;
    }
    .dark .conversions-section {
      background: #141414
    }
    .conversions-card-shadow{
      box-shadow: 0px 7px 15px 0px rgba(79,79,79,0.10);
      border: 1px solid #C5C5C5;
      border-radius: 22px;
      width: 100%;
      max-width: 900px;
      height: auto;
      background: white;
      color: #000;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 30px;
      gap: 2rem;
      transition: all 0.3s ease;
    }
    .dark .conversions-card-shadow{
      background: #2c2c2c;
      color: #fff;
    }
    .conversions-card-shadow:hover {
      transform: translateY(-5px);
      box-shadow: 0px 12px 24px 0px rgba(79,79,79,0.12);
    }
    .conversions-buy-btn{
      background-color: #e30613;
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 9999px;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
      text-transform: uppercase;
      min-width: 180px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .conversions-buy-btn:hover {
      background-color: #c50510;
      transform: scale(1.05);
    }

    .cancel-accordion {
      padding: 0.75rem 2rem;
      border-radius: 9999px;
      font-size: 18px;
      font-weight: 600;
      text-transform: uppercase;
      min-width: 180px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
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
      width: 100%;
      display: flex;
      flex-direction: column;
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
      text-transform: uppercase;
    }
    .plan-body {
      padding: 22px 17px 25px 17px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      flex-grow: 1;
    }
    .plan-description {
      font-family: Rubik, -apple-system, Roboto, Helvetica, sans-serif;
      font-size: 14px;
      line-height: 20px;
      color: #000;
      text-align: center;
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60px;
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
      font-size: 18px;
    }
    .btn-convert {
      width: 113px;
      height: 32px;
      background: var(--red);
      border: none;
      border-radius: 22px;
      color: white;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    .btn-convert:hover {
      background: #d1182f;
    }

    .dark .plan-card {
      background: #2c2c2c;
      border-color: #666;
    }
   .dark .plan-header {
      border-color: #666;
    }
    
    .dark .plan-description {
      color: #ffffffff;
    }

       .dark .plan-price {
      color: #fff;
    }

    .dark .conversions-accordion-panel.visible {
        background: #424242;
        border-top-color: #555;
    }

  .conversions-accordion-panel {
  width: 100%;
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 0.7s ease-in-out, opacity 0.5s ease-in-out, margin 0.7s ease-in-out, padding 0.7s ease-in-out, border-top-width 0.4s ease-in-out;
  margin-top: 0;
  padding-top: 0;
  padding-bottom: 0;
  border-top: 1px solid transparent;
  box-sizing: border-box;
  align-self: stretch;
}

.conversions-accordion-panel.visible {
  background: var(--muted);
  width: auto;
  max-height: 100%;
  opacity: 1;
  margin-top: 2.5rem;
  border-top-color: var(--border);
  margin-left: -30px;
  margin-right: -30px;
  margin-bottom: -30px;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom-left-radius: 22px;
  border-bottom-right-radius: 22px;
  height: calc (100% + 30px)
}

.accordion-toggle-icon {
  transition: transform 0.4s ease;
}

.accordion-open .accordion-toggle-icon {
  transform: rotate(180deg);
}

    @media (max-width: 920px) {
      .plans-grid {
        grid-template-columns: 1fr;
        gap: 24px;
        max-width: 420px;
      }
    }
    @media (max-width: 620px) {
    .conversions-buy-btn{
      min-width: 248px;
    }
     .conversions-credit-message {
        margin-top: 30px;
      }
      .conversions-card-shadow {
        padding: 2rem 1.5rem;
        gap: 1.5rem;
      }

      .conversions-accordion-panel.visible {
  margin-left: -24px;
  margin-right: -24px;
  margin-bottom: -32px;
}
    }

      .conversions-credit-message {
      margin-top: 50px;
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
    const isRTL = language === "ar" || this.isRTL();
    this.currentLang = language;

    this.cleanupAllEventListeners();

    const accordionContentHTML = this.isAccordionOpen
      ? this.getAccordionContentHTML(data, isRTL)
      : "";

    const dirAttr = isRTL ? `dir="rtl"` : `dir="ltr"`;
    const textFont = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

    let buttonsHTML = "";
    if (this.isAccordionOpen) {
      const cancelBtnClasses = `conversions-modal-button cancel-accordion secondary ${textFont} font-semibold text-base uppercase forfait-modal-button w-[180px] h-12 rounded-full cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-white text-ooredoo-red border-2 border-ooredoo-red shadow-md dark:bg-[#2C2C2C] dark:text-white dark:border-white px-2`;
      buttonsHTML = `
            <button class="${cancelBtnClasses}" data-action="close-accordion">
                ${data.cancelBtn}
            </button>
        `;
    } else {
      buttonsHTML = `
            <button class="conversions-buy-btn" data-action="convert-to-credit">
                <span class="${textFont} font-semibold leading-normal uppercase whitespace-nowrap text-[18px]">
                    ${data.convertToCredit}
                </span>
            </button>
            <button class="conversions-buy-btn" data-action="other-conversions">
                <span class="${textFont} font-semibold leading-normal uppercase whitespace-nowrap text-[18px]">
                    ${data.otherConversions}
                </span>
            </button>
        `;
    }

    this.container.innerHTML = `
    <div class="w-full" ${dirAttr}>
      <section class="conversions-section">
        <div class="conversions-card-shadow">
          <div class="flex flex-col justify-center items-center gap-6 self-stretch">
            <div class="self-stretch">
              <h2 class="text-black dark:text-white text-center ${textFont} text-[25px] md:text-[42px] font-medium leading-tight uppercase">
                ${this.createMixedTitleHTML(data.title)}
              </h2>
            </div>
            <div class="w-full max-w-2xl">
              <p class="text-black dark:text-white text-center ${textFont} text-[18px] md:text-[22px] font-normal leading-normal">
                ${data.description}
              </p>
            </div>
            <div class="flex flex-col sm:flex-row w-full max-w-xl justify-center items-center gap-4 md:gap-6 px-4">
              ${buttonsHTML}
            </div>
          </div>
          <div class="conversions-accordion-panel ${
            this.isAccordionOpen ? "visible" : ""
          }">
            ${accordionContentHTML}
          </div>
        </div>
      </section>
      <div id="conversions-modal-container"></div>
    </div>
    `;
    this.bindEventListeners(language);
    this.bindPurchaseButtons(language);
  }

  getAccordionContentHTML(data, isRTL) {
    const plans = data.plans || [];
    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";
    return `
      <div class="plans-grid">
        ${plans
          .map(
            (plan, idx) => `
          <div key="${plan.name}" class="plan-card">
            <div class="plan-header">
              <h3 class="plan-name ${fontClass} text-ooredoo-red dark:text-white">${plan.name}</h3>
            </div>
            <div class="plan-body">
              <p class="plan-description ${fontClass}">${plan.description}</p>
              <div class="plan-pricing">
                <div class="plan-price ${fontClass}">
                  <span class="price-amount">${plan.price}</span>
                  <span class="price-currency">${plan.priceUnit}<span class="price-duration">${plan.duration}</span></span>
                </div>
                <button class="btn-convert" data-action="convert-to-${idx}">
                  ${data.convertBtn}
                </button>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  bindEventListeners(language) {
    if (this.eventHandler) {
      this.container.removeEventListener("click", this.eventHandler);
    }
    this.eventHandler = (e) => {
      const buyButton = e.target.closest(".conversions-buy-btn");
      if (buyButton) {
        e.preventDefault();
        const action = buyButton.getAttribute("data-action");
        if (action === "convert-to-credit") {
          this.handleConvertToCreditClick(language);
        } else if (action === "other-conversions") {
          this.isAccordionOpen = !this.isAccordionOpen;
          this.render();
        }
        return;
      }

      const cancelButton = e.target.closest('[data-action="close-accordion"]');
      if (cancelButton) {
        e.preventDefault();
        this.isAccordionOpen = false;
        this.render();
        return;
      }

      const convertButton = e.target.closest(".btn-convert");
      if (convertButton) {
        e.preventDefault();
        const action = convertButton.getAttribute("data-action");
        const plans = conversionsData[this.getLanguage()].plans;
        this.handleConversionOptionClick(action, this.isRTL(), plans);
        return;
      }
    };
    this.container.addEventListener("click", this.eventHandler);
  }

  renderErrorState() {
    this.container.innerHTML = `
      <div class="w-full flex items-center justify-center py-16">
        <div class="text-center">
          <p class="text-gray-600 dark:text-white mb-4">Une erreur s'est produite lors du chargement des conversions</p>
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
      "#conversions-modal-container"
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
      const button = e.target.closest(".conversions-buy-btn");
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
          this.isAccordionOpen = !this.isAccordionOpen;
          this.render();
        }, 50);
      }
    };
    const touchHandler = (e) => {
      const button = e.target.closest(".conversions-buy-btn");
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
          this.isAccordionOpen = !this.isAccordionOpen;
          this.render();
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
    this.showModal({
      type: "confirm",
      title: data.confirmTitle,
      message: data.confirmDescription,
      isRTL: currentLanguage === "ar",
      onConfirm: () => {
        this.showCreditSuccessModal(data, currentLanguage === "ar");
      },
    });
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
      data.successTitle ||
      (currentLanguage === "ar" ? "هنيئًا!" : "Félicitations !");
    const message = data.creditSuccessMessage || "";

    this.showModal({
      type: "credit-success",
      title: felicitationsText,
      message: message,
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
    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";
    const dirAttr = isRTL ? `dir="rtl"` : `dir="ltr"`;
    modalContainer.innerHTML = `
      <div class="conversions-backdrop">
        <div class="conversions-modal" role="dialog" aria-modal="true" ${dirAttr}>
            <button class="btn-cancel ${fontClass}" id="close-conversions-modal">
              ${data.cancelBtn}
            </button>
          <div class="conversions-content">
            <div class="plans-grid">
              ${plans
                .map(
                  (plan, idx) => `
                <div key="${plan.name}" class="plan-card">
                  <div class="plan-header">
                    <h3 class="plan-name ${fontClass}">${plan.name}</h3>
                  </div>
                  <div class="plan-body">
                    <p class="plan-description ${fontClass}">${plan.description}</p>
                    <div class="plan-pricing">
                      <div class="plan-price ${fontClass}">
                        <span class="price-amount">${plan.price}</span>
                        <span class="price-currency">${plan.priceUnit}</span>
                        <span class="price-duration">${plan.duration}</span>
                      </div>

                      <button class="btn-convert" data-action="convert-to-${idx}">
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
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        modalContainer.innerHTML = "";
      });
    }
  }

  handleConversionOptionClick(action, isRTL, plans) {
    const modalContainer = this.container.querySelector(
      "#conversions-modal-container"
    );
    if (modalContainer) modalContainer.innerHTML = "";
    const planIndex = parseInt(action.split("-")[2], 10);
    const selectedPlan = plans[planIndex];
    if (!selectedPlan) {
      console.error("Plan non trouvé");
      return;
    }

    const currentLanguage = this.getLanguage();
    let confirmTitle =
      conversionsData[currentLanguage].confirmTitle || "Conversion";

    function normalizeDimaWord(name = "") {
      if (typeof name !== "string") return name;
      return name.replace(
        /\b(dimma|dima)\b/gi,
        (match) => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
      );
    }

    const planNameSafe = normalizeDimaWord(selectedPlan.name || "");

    let confirmMessage;
    if (currentLanguage === "ar") {
      confirmMessage = `هل تريد تحويل اشتراكك Dima 2500 إلى ${planNameSafe}؟`;
    } else {
      confirmMessage = `Vous allez convertir votre forfait Dima 2500 en ${planNameSafe} ?`;
    }

    this.showModal({
      type: "confirm",
      title: confirmTitle,
      message: confirmMessage,
      isRTL,
      onConfirm: () => {
        this.startModalSequence(selectedPlan, isRTL);
      },
      onCancel: () => {
        this.isAccordionOpen = true;
        this.render();
      },
    });
  }

  startModalSequence(plan, isRTL) {
    const data = conversionsData[this.getLanguage()];

    const showInsufficientCreditModal = () => {
      this.showModal({
        type: "info",
        title: data.insufficientCreditTitle,
        message: data.insufficientCreditMessage,
        isRTL: isRTL,
        onConfirm: () => {
          this.isAccordionOpen = false;
          this.render();
        },
      });
    };

    const showAlreadyOnPlanModal = () => {
      this.showModal({
        type: "info",
        title: data.alreadyOnPlanTitle,
        message: data.alreadyOnPlanMessage,
        isRTL: isRTL,
        onConfirm: showInsufficientCreditModal,
      });
    };

    this.showSuccessModal(plan, isRTL, showAlreadyOnPlanModal);
  }

  processConversion(plan, isRTL) {
    const data = conversionsData[this.getLanguage()];

    if (plan.name === "DIMA 2500") {
      this.showInfoModal(
        data.alreadyOnPlanTitle,
        data.alreadyOnPlanMessage,
        isRTL
      );
      return;
    }

    const shouldFailForCredit = Math.random() > 0.5;
    if (shouldFailForCredit) {
      this.showInfoModal(
        data.insufficientCreditTitle,
        data.insufficientCreditMessage,
        isRTL
      );
      return;
    }

    this.showSuccessModal(plan, isRTL);
  }

  showInfoModal(title, message, isRTL) {
    const onConfirmClose = () => {
      const data = conversionsData[this.getLanguage()];
      const shouldShowInsufficientCredit = Math.random() > 0.5;

      if (
        message === data.alreadyOnPlanMessage &&
        shouldShowInsufficientCredit
      ) {
        this.showModal({
          type: "info",
          title: data.insufficientCreditTitle,
          message: data.insufficientCreditMessage,
          isRTL: isRTL,
          onConfirm: () => {
            this.isAccordionOpen = false;
            this.render();
          },
        });
      } else {
        this.isAccordionOpen = false;
        this.render();
      }
    };

    this.showModal({
      type: "info",
      title: title,
      message: message,
      isRTL: isRTL,
      onConfirm: onConfirmClose,
    });
  }

  showSuccessModal(plan, isRTL, onConfirmCallback) {
    const currentLanguage = this.getLanguage();
    const data = conversionsData[currentLanguage];

    function containsArabic(s = "") {
      return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(String(s));
    }

    function normalizePlanName(raw = "") {
      if (!raw || typeof raw !== "string") return "";
      return raw.replace(
        /([A-Za-zÀ-ÖØ-öø-ÿ]+(?:['-][A-Za-zÀ-ÖØ-öø-ÿ]+)*)/g,
        (word) => {
          let w = word.replace(/\b(dimaa|dimma|dima)\b/gi, "dima");
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        }
      );
    }

    const template = data.successDescription || "";

    const safePlanName = normalizePlanName(plan.name || "");
    const safePlanDescription = plan.description || "";
    const safeDuration = plan.duration || "";

    const message = template
      .replace(/\{planName\}/g, safePlanName)
      .replace(/\{planDescription\}/g, safePlanDescription)
      .replace(/\{duration\}/g, safeDuration);

    this.showModal({
      type: "info",
      title: data.successTitle,
      message: message,
      isRTL,
      onConfirm: onConfirmCallback,
    });
  }

  showModal({ type, title, message, isRTL = false, onConfirm, onCancel }) {
    try {
      const modalContainer = this.container.querySelector(
        "#conversions-modal-container"
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
    const buttons = this.getModalButtons(type, isRTL);
    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

    const messageContainerClass =
      type === "credit-success" ? "conversions-credit-message" : "";

    const messageHTML = message
      ? `
      <div class="text-center mb-10 ${messageContainerClass}">
        <p class="${fontClass} text-gray-800 dark:text-white leading-relaxed text-base md:text-lg px-2">
            ${message}
        </p>
      </div>`
      : "";

    return `
      <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 conversions-modal-fade" style="background-color: rgba(105, 105, 105, 0.8);" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="relative bg-white dark:bg-[#2C2C2C] rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl min-w-[320px] px-6 md:px-8 pt-16 pb-8 md:pb-12" ${dirAttribute}>
          <button class="absolute top-[15px] right-[15px] w-[34px] h-[34px] flex items-center justify-center rounded-full bg-ooredoo-red text-white z-20 conversions-modal-close" aria-label="${
            isRTL ? "إغلاق" : "Fermer"
          }">
            <img src="./assets/images/Close.svg" alt="close" class="w-6 h-6 block"/>
          </button>
          <div class="text-center mb-6">
            <h2 id="modal-title" class="${fontClass} font-semibold text-ooredoo-red dark:text-white text-2xl md:text-3xl leading-tight uppercase tracking-tight">${this.createMixedTitleHTML(
      title
    )}</h2>
          </div>
          ${messageHTML}
          <div class="flex justify-center conversions-modal-buttons">${buttons}</div>
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
    const primaryBtn = `conversions-modal-button primary ${fontClass} font-semibold text-base uppercase forfait-modal-button w-[125px] md:w-[180px] h-12 rounded-full border-none cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-ooredoo-red text-white shadow-lg`;
    const secondaryBtn = `conversions-modal-button secondary ${fontClass} font-semibold text-base uppercase forfait-modal-button w-[125px] md:w-[180px] h-12 rounded-full cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-white text-ooredoo-red border-2 border-ooredoo-red shadow-md dark:bg-[#2C2C2C] dark:text-white dark:border-white`;
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
      "credit-success": `
    <div class="flex ${buttonGap}">
      <button class="${primaryBtn}" data-action="close">${labels.close}</button>
    </div>
  `,
    };
    return buttonConfigs[type] || buttonConfigs.success;
  }

  setupModalEvents({ type, onConfirm, onCancel, modalContainer }) {
    const modal = modalContainer.querySelector(".conversions-modal-fade");
    const closeButton = modal.querySelector(".conversions-modal-close");
    const actionButtons = modal.querySelectorAll("[data-action]");

    const closeModal = (callback) => {
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
        if (callback) {
          callback();
        }
      }, 200);
    };

    const handlers = new Map();

    const createHandler = (element, eventType, actionFn) => {
      if (!element) return;
      const handler = () => {
        closeModal(actionFn);
      };
      element.addEventListener(eventType, handler);
      handlers.set(element, { eventType, handler });
    };

    createHandler(closeButton, "click", onCancel);

    actionButtons.forEach((button) => {
      const action = button.getAttribute("data-action");
      if (action === "confirm" || action === "close") {
        createHandler(button, "click", onConfirm);
      }
      if (action === "cancel") {
        createHandler(button, "click", onCancel);
      }
    });

    const backdropClickHandler = (event) => {
      if (event.target === modal) {
        closeModal(onCancel);
      }
    };
    modal.addEventListener("click", backdropClickHandler);

    const escapeHandler = (event) => {
      if (event.key === "Escape") {
        closeModal(onCancel);
        document.removeEventListener("keydown", escapeHandler);
      }
    };
    document.addEventListener("keydown", escapeHandler);
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
      "#conversions-modal-container"
    );
    if (modalContainer) {
      modalContainer.innerHTML = "";
    }
    this.container.innerHTML = "";
  }
}

export default ConversionsComponent;
