import { shahidPlans, shahidDescription, shahidModalData } from "./DigitalShahidServicesData.js";

// Card style constants - Updated to match Dima sizing and styling
const styles = {
  card: "w-full max-w-[30rem] bg-white dark:bg-[#2C2C2C] rounded-xl flex flex-col relative overflow-hidden dima-card-border",
  cardHeader: "bg-ooredoo-red flex items-center justify-center px-6 py-6 text-center",
  cardName: "font-medium text-[32px] leading-[100%] tracking-[0] capitalize text-white text-center align-middle",
  cardContent: "p-6 flex flex-col justify-between",
  dataTitle: "text-2xl font-semibold text-ooredoo-red mb-3",
  featuresList: "list-none p-0 m-0",
  featureIconBase: "w-5 h-5 flex-shrink-0 mr-3",
  featureText: "whitespace-nowrap",
  divider: "dima-divider",
  priceContainer: "text-center mb-2 py-4",
  priceAmount: "font-semibold text-[2rem] capitalize dark:text-white font-rubik",
  priceDa: "font-semibold text-lg capitalize dark:text-white",
  priceDuration: "font-semibold text-lg dark:text-white",
  buttonWrap: "flex justify-center mt-2",
  acheterButton: "acheter-button",
};

// Inject CSS once with updated styling to match Dima
if (!document.getElementById("dima-shahid-styles")) {
  const styleEl = document.createElement("style");
  styleEl.id = "dima-shahid-styles";
  styleEl.textContent = `
    .dima-card-border {
      box-shadow: -0.92px 7.34px 16.52px 0px #4F4F4F1A, -2.75px 29.37px 29.37px 0px #4F4F4F17;
      border: none;
    }

    .dark .dima-card-border {
      box-shadow: none;
      border: 1px solid #BBBEBE;
    }

    .acheter-button {
      min-width: 7rem;
      height: 2.5rem;
      padding: 0.5rem 2rem;
      border-radius: 22px;
      background-color: var(--ooredoo-red, #e50012);
      border: none;
      color: white;
      font-weight: 600;
      font-size: 1.1rem;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .acheter-button:hover {
      background-color: rgba(229,0,18,0.9);
      transform: translateY(-1px);
    }
    .acheter-button:active { transform: translateY(0px); }
    .dima-divider {
      border: none;
      width: 100%;
      margin: 0.75rem 0;
      height: 1px;
      background-image: repeating-linear-gradient(
        to right,
        #BBBEBE 0px,
        #BBBEBE 8px,
        transparent 8px,
        transparent 16px
      );
      background-size: 16px 1px;
      background-repeat: repeat-x;
    }

    /* Modal Styles for Shahid */
    .shahid-modal-fade {
      animation: shahidModalFadeIn 0.3s ease-out forwards;
      backdrop-filter: blur(8px);
      background-color: rgba(105, 105, 105, 0.8);
    }

    @keyframes shahidModalFadeIn {
      from { opacity: 0; transform: scale(0.95) translateY(-10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    @keyframes shahidModalFadeOut {
      from { opacity: 1; transform: scale(1) translateY(0); }
      to { opacity: 0; transform: scale(0.95) translateY(-10px); }
    }

    .shahid-modal-button {
      position: relative;
      overflow: hidden;
      z-index: 10;
      touch-action: manipulation;
      transition: all 0.3s ease;
    }

    .shahid-modal-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .shahid-modal-button:active {
      transform: translateY(0px);
    }
  `;
  document.head.appendChild(styleEl);
}

// Card renderer with purchase button functionality
function renderShahidCard(plan, isArabic, index) {
  return `
    <div class="${isArabic ? "font-noto-kufi-arabic" : "font-rubik"} ${styles.card}">
      <div class="${styles.cardHeader}">
        <h2 class="${styles.cardName}">${plan.name}</h2>
      </div>
      <div class="${styles.cardContent}">
        <div>
          <ul class="">
              ${plan.features
                .map(
                  (f, i) => `
              <li class="text-base leading-relaxed flex items-center gap-2 mb-3 text-gray-800 dark:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                  <rect y="0.422852" width="14.91" height="14.91" rx="7.455" fill="#E31D23"/>
                  <g clip-path="url(#clip0_113_17964)">
                  <g clip-path="url(#clip1_113_17964)">
                  <path d="M4.22656 7.87927L6.37732 10.03L10.6788 5.72852" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  </g>
                  <defs>
                  <clipPath id="clip0_113_17964">
                  <rect width="9.08421" height="9.08421" fill="white" transform="translate(2.91211 3.33594)"/>
                  </clipPath>
                  <clipPath id="clip1_113_17964">
                  <rect width="9.08421" height="9.08421" fill="white" transform="translate(2.91016 3.33691)"/>
                  </clipPath>
                  </defs>
                </svg>
                <span class="${styles.featureText}">${f}</span>
              </li>`
                )
                .join("")}
          </ul>
        </div>
        <div>
          <div class="${styles.divider}"></div>
          <div class="${styles.priceContainer} flex items-end gap-2 justify-center">
            <span class="${styles.priceAmount}">${plan.price}</span>
            <div class="flex items-center gap-0 pb-1">
              <span class="${styles.priceDa}">${isArabic ? "دج" : "DA"}/</span>
              <span class="${styles.priceDuration}">${plan.duration}</span>
            </div>
          </div>
          <div class="${styles.buttonWrap}">
            <button class="${styles.acheterButton} ${isArabic ? "font-noto-kufi-arabic" : "font-rubik"} shahid-purchase-btn" data-offer-name="${
    plan.name
  }" data-plan-index="${index}">
              ${isArabic ? "شراء" : "ACHETER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export default class DigitalShahidServices {
  constructor(container) {
    this.container = container;
    this.currentLang = this.getLang();
    this.previouslyFocusedElement = null;
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
    this.bindEvents();
  }

  setupEventListeners() {
    // Purchase button event delegation
    this.container.addEventListener("click", this.handlePurchaseClick.bind(this));
  }

  getLang() {
    const stored = localStorage.getItem("language");
    return ["fr", "ar"].includes(stored) ? stored : "fr";
  }

  bindEvents() {
    this.unbindEvents();

    this.boundHandleLanguageChange = this.handleLanguageChange.bind(this);
    window.addEventListener("languageChanged", this.boundHandleLanguageChange);

    this.langPoller = setInterval(this.checkLanguageChange.bind(this), 200);

    this.boundStorageListener = (e) => {
      if (e.key === "language") {
        this.handleLanguageChange();
      }
    };
    window.addEventListener("storage", this.boundStorageListener);
  }

  unbindEvents() {
    if (this.boundHandleLanguageChange) {
      window.removeEventListener("languageChanged", this.boundHandleLanguageChange);
    }
    if (this.boundStorageListener) {
      window.removeEventListener("storage", this.boundStorageListener);
    }
    if (this.langPoller) {
      clearInterval(this.langPoller);
      this.langPoller = null;
    }
  }

  handleLanguageChange() {
    const newLang = this.getLang();
    if (newLang !== this.currentLang) {
      console.log(`DigitalShahidServices: Language changed from ${this.currentLang} to ${newLang}`);
      this.currentLang = newLang;
      this.render();
    }
  }

  checkLanguageChange() {
    this.handleLanguageChange();
  }

  convertToLatinNumerals(text) {
    if (!text) return text;
    const arabicNumerals = "٠١٢٣٤٥٦٧٨٩";
    const latinNumerals = "0123456789";

    return text.replace(/[٠-٩]/g, (match) => {
      return latinNumerals[arabicNumerals.indexOf(match)];
    });
  }

  handlePurchaseClick(e) {
    const button = e.target.closest(".shahid-purchase-btn");
    if (!button) return;

    e.preventDefault();
    e.stopPropagation();

    const offerName = button.getAttribute("data-offer-name");
    const currentLanguage = this.getLang();
    const modalContent = shahidModalData[currentLanguage] && shahidModalData[currentLanguage][offerName];

    if (modalContent) {
      this.showPurchaseFlow(offerName, modalContent, currentLanguage === "ar");
    }
  }

  showPurchaseFlow(offerName, content, isRTL) {
    this.showModal({
      type: "confirm",
      title: offerName,
      message: content.confirm,
      isRTL,
      onConfirm: () => {
        this.showSuccessModal(content, isRTL, () => {
          this.showInsufficientCreditModal(content, isRTL);
        });
      },
    });
  }

  showSuccessModal(content, isRTL, onClose) {
    this.showModal({
      type: "success",
      title: isRTL ? "هنيئًا !" : "Félicitations !",
      message: content.success,
      isRTL,
      onClose,
    });
  }

  showInsufficientCreditModal(content, isRTL) {
    this.showModal({
      type: "info",
      title: isRTL ? "رصيدك غير كافٍ" : "Crédit Insuffisant",
      message: content.insufficient,
      isRTL,
    });
  }

  showModal({ type, title, message, isRTL = false, onConfirm, onClose }) {
    try {
      let modalContainer = this.container.querySelector("#shahid-modal-container");
      if (!modalContainer) {
        modalContainer = document.createElement("div");
        modalContainer.id = "shahid-modal-container";
        this.container.appendChild(modalContainer);
      }

      const modalHTML = this.createModalHTML({ type, title, message, isRTL });
      modalContainer.innerHTML = modalHTML;
      this.setupModalEvents({ type, onConfirm, onClose, modalContainer });
      this.manageFocusForModal(modalContainer);
    } catch (error) {
      console.error("Error showing Shahid modal:", error);
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
    const closeButtonPosition = "right-4";
    const buttons = this.getModalButtons(type, isRTL);
    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

    return `
      <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 shahid-modal-fade"
          style="background-color: rgba(105, 105, 105, 0.8);"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shahid-modal-title">
          <div class="relative bg-white dark:bg-[#2C2C2C] rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl min-w-[320px] px-6 md:px-8 pt-16 pb-8 md:pb-12" ${dirAttribute}>
              <button class="absolute top-4 ${closeButtonPosition} p-2 z-10 rounded-full transition-all duration-200 shahid-modal-close"
                      aria-label="${isRTL ? "إغلاق" : "Fermer"}">
                  <img src="./assets/images/Close.svg" alt="close" class="w-6 h-6 block"/>
              </button>
              <div class="text-center mb-6">
                  <h2 id="shahid-modal-title" class="${fontClass} font-semibold text-ooredoo-red dark:text-white text-2xl md:text-3xl leading-tight uppercase tracking-tight">
                      ${title}
                  </h2>
              </div>
              <div class="text-center mb-10">
                  <p class="${fontClass} text-gray-800 dark:text-gray-200 leading-relaxed text-base md:text-lg px-2">
                      ${message}
                  </p>
              </div>
              <div class="flex justify-center flex-nowrap shahid-modal-buttons">${buttons}</div>
          </div>
      </div>
    `;
  }

  getModalButtons(type, isRTL) {
    const labels = {
      cancel: isRTL ? "إلغاء" : "Annuler",
      confirm: isRTL ? "تأكيد" : "Confirmer",
      close: isRTL ? "تم" : "OK",
      ok: isRTL ? "تم" : "OK",
    };

    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";
    const primaryBtn = `${fontClass} font-semibold text-base uppercase shahid-modal-button w-28 sm:w-40 h-12 rounded-full border-none cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-ooredoo-red text-white shadow-lg`;
    const secondaryBtn = `${fontClass} font-semibold text-base uppercase shahid-modal-button w-28 sm:w-40 h-12 rounded-full cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-white text-ooredoo-red border-2 border-ooredoo-red shadow-md dark:bg-[#2C2C2C] dark:text-white dark:border-white`;
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
          <button class="${primaryBtn}" data-action="close">${labels.ok}</button>
        </div>
      `,
    };

    return buttonConfigs[type] || buttonConfigs.success;
  }

  setupModalEvents({ type, onConfirm, onClose, modalContainer }) {
    const modal = modalContainer.querySelector(".shahid-modal-fade");
    const closeButton = modal.querySelector(".shahid-modal-close");
    const actionButtons = modal.querySelectorAll("[data-action]");

    const closeModal = () => {
      modal.style.animation = "shahidModalFadeOut 0.2s ease-in forwards";
      setTimeout(() => {
        modalContainer.innerHTML = "";
        if (this.previouslyFocusedElement && this.previouslyFocusedElement.focus) {
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
          if (action === "close" && onClose) onClose();
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

  render() {
    const lang = this.getLang();
    const isArabic = lang === "ar";
    const plans = shahidPlans[lang];
    const description = shahidDescription[lang];

    this.container.innerHTML = `
      <div class="${this.currentLang === "ar" ? "font-noto-kufi-arabic" : "font-rubik"} w-full bg-white dark:bg-[#141414] px-5 py-16">
        <div class="mx-auto w-full max-w-screen-2xl ${isArabic ? 'dir="rtl"' : ""}">
          <h2 class="font-medium text-3xl md:text-4xl tracking-wide uppercase text-center text-black dark:text-white mb-10">
            ${isArabic ? "اشتراكات شاهد" : "FORFAITS SHAHID"}
          </h2>

          <div class="flex flex-col-reverse lg:grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-5 items-stretch">
            <!-- Card 1 -->
            <div class="flex justify-center">
              ${renderShahidCard(plans[0], isArabic, 0)}
            </div>

            <!-- Card 2 -->
            <div class="flex justify-center">
              ${renderShahidCard(plans[1], isArabic, 1)}
            </div>

            <div class="flex flex-col items-center justify-center text-center mt-4 lg:mt-0 px-4">
              <img src="./assets/images/services/shahid.svg"  alt="Shahid"
                   class="w-full max-w-xs h-auto dark:hidden flex"/>
              <img src="./assets/images/services/shahid-d.svg" alt="Shahid"
                   class="w-full max-w-xs h-auto dark:flex hidden"/>
              <div class="text-base leading-relaxed tracking-wide max-w-sm text-gray-800 dark:text-gray-200">
                ${
                  isArabic
                    ? `<p>احصلوا الآن على اشتراك <span class="font-semibold">شاهد</span> الذي يناسبكم، و استفيدوا من <span class="font-semibold">دخول حصري</span> لمدة 30 يوم + <span class="font-semibold">إنترنت</span>. <span></span></p>`
                    : `<p>Obtenez dès maintenant <span class="font-semibold">un forfait Shahid</span>,30 jours d'<span class="font-semibold">accès premium Shahid + internet</span></p>`
                }
              </div>
            </div>

          </div>
        </div>
      </div>
      <div id="shahid-modal-container"></div>
    `;
  }

  destroy() {
    this.unbindEvents();
  }
}
