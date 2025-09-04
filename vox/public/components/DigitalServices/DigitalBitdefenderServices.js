import { bitdefenderPlans } from "./DigitalBitdefenderServicesData.js";
import modalData from "./ModalData.js";

const bitdefenderTranslations = {
  fr: {
    buttonText: "ACHETER",
    buyModalTitle: "Confirmation d'achat",
    buyMessage: (plan) => `Prix total : ${plan.price} DA/${plan.duration}.`,
    terms: `J'accepte les conditions générales`,
    congratsTitle: "Félicitations !",
    congratsMessage: (plan) => `Votre commande a été confirmée. Vous recevrez un SMS pour activer votre abonnement.`,
    creditTitle: "Crédit insuffisant",
    creditMessage: (plan) => `Votre crédit est insuffisant pour finaliser votre demande. Veuillez recharger votre compte et réessayer.`,
    errorTitle: "Erreur",
    errorMessage: "Une erreur s'est produite. Veuillez réessayer.",
    confirmBtn: "Confirmer",
    cancelBtn: "Annuler",
    closeBtn: "Retour",
    okBtn: "OK",
    startingFrom: "À partir de",
    completeProtection: "Protection complète",
    protectionUpTo: "Protection jusqu'à 10 appareils",
    chooseOffer: "Choisissez l'offre qui vous convient",
    subscriptionPrice: "Prix de l'abonnement",
    chooseDevices: "Choisissez le nombre d'appareils",
    chooseDuration: "Choisissez la durée de l'abonnement",
    chooseBtn: "Choisir",
    month: "mois",
    months: "mois",
    device: "appareil",
    devices: "appareils",
  },
  ar: {
    buttonText: "شراء",
    buyModalTitle: "تأكيد الشراء",
    buyMessage: (plan) => `السعر الإجمالي: ${plan.price} دج / ${plan.duration}`,
    terms: "أوافق على شروط الإستعمال ",
    congratsTitle: "هنيئًا!",
    congratsMessage: (plan) => `لقد تم تأكيد طلبك. ستتلقى رسالة قصيرة لتفعيل اشتراكك.`,
    creditTitle: "رصيد غير كافٍ",
    creditMessage: (plan) => `رصيدك غير كافٍ لتقديم طلبك. يرجى إعادة تعبئة حسابك والمحاولة مرة أخرى.`,
    errorTitle: "خطأ",
    errorMessage: "لقد حدث خلل ما. يرجى المحاولة مرة أخرى.",
    confirmBtn: "تأكيد",
    cancelBtn: "إلغاء",
    closeBtn: "العودة",
    okBtn: "تم",
    startingFrom: "ابتداءً من",
    completeProtection: "حماية كاملة",
    protectionUpTo: "حماية تصل إلى 10 أجهزة",
    chooseOffer: "إختاروا العرض الذي يناسبكم",
    subscriptionPrice: "سعر الإشتراك",
    chooseDevices: "إختاروا عدد الأجهزة",
    chooseDuration: "إختاروا مدة الإشتراك",
    chooseBtn: "إختيار",
    month: "شهر",
    months: "أشهر",
    device: "جهاز",
    devices: "أجهزة",
  },
};

// Configuration for device and duration options
const deviceOptions = [1, 3, 5, 10];
const durationOptions = [
  { value: 1, priceMultiplier: 1 },
  { value: 3, priceMultiplier: 2.8 },
  { value: 6, priceMultiplier: 5.5 },
  { value: 12, priceMultiplier: 10.5 },
];

export default class DigitalBitdefenderServices {
  constructor(container) {
    this.container = container;
    this.currentLang = this.getLang();
    this.currentView = "main"; // 'main' or 'selection'
    this.selectedPlan = null;
    this.selectedDevices = 5; // Default to first option
    this.selectedDuration = 1; // Default to first option
    this.checkboxAccepted = false; // For terms and conditions
    this.init();
  }

  init() {
    this.loadStyles();
    this.render();
    this.bindEvents();
    this.observeTheme();
  }

  loadStyles() {
    if (!document.getElementById("bitdefender-enhanced-styles")) {
      const styleElement = document.createElement("style");
      styleElement.id = "bitdefender-enhanced-styles";
      styleElement.textContent = `
        .bitdefender-card-shadow {
          box-shadow: -0.93px 7.46px 16.78px 0px rgba(79, 79, 79, 0.1), -2.8px 29.82px 29.82px 0px rgba(79, 79, 79, 0.09);
        }
        .dark .bitdefender-card-shadow {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .bitdefender-hover-lift {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .bitdefender-hover-lift:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: -0.93px 15px 30px 0px rgba(79, 79, 79, 0.15), -2.8px 40px 40px 0px rgba(79, 79, 79, 0.12);
        }
        .dark .bitdefender-hover-lift:hover {
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
        }

        .bitdefender-divider {
          background-image: repeating-linear-gradient(to right, #D1D5DB 0px, #D1D5DB 8px, transparent 8px, transparent 16px);
          background-size: 16px 1px;
          background-repeat: repeat-x;
        }
        .dark .bitdefender-divider {
          background-image: repeating-linear-gradient(to right, #6B7280 0px, #6B7280 8px, transparent 8px, transparent 16px);
        }

        .bitdefender-buy-btn {
          position: relative;
          overflow: hidden;
          z-index: 10;
          touch-action: manipulation;
        }
        .bitdefender-buy-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .bitdefender-buy-btn:hover::before {
          left: 100%;
        }

        .bitdefender-modal-fade {
          animation: modalFadeIn 0.3s ease-out forwards;
          backdrop-filter: blur(8px);
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes modalFadeOut {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to { opacity: 0; transform: scale(0.9) translateY(20px); }
        }

        .bitdefender-feature-item {
          font-family: 'Rubik', 'Noto Kufi Arabic', Arial, sans-serif;
          font-weight: 400;
          font-size: 14px;
          line-height: 18px;
          letter-spacing: 0;
          color: #000000;
        }
        .dark .bitdefender-feature-item {
          color: #d1d5db;
        }

        .font-noto-kufi-arabic .bitdefender-feature-item,
        [dir="rtl"] .bitdefender-feature-item {
          font-family: 'Noto Kufi Arabic', 'Rubik', Arial, sans-serif;
        }

        .bitdefender-card-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 450px;
        }
        .bitdefender-card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .bitdefender-card-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding-top: 1rem;
        }

        .bitdefender-button-zone {
          touch-action: manipulation;
          pointer-events: auto;
          z-index: 10;
          position: relative;
        }

        /* Enhanced Modal Styles */
        .bitdefender-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          animation: modalFadeIn 0.3s ease-out forwards;
        }

        .bitdefender-modal-content {
          background: white;
          border-radius: 24px;
          padding: 24px;
          width: 100%;
          max-width: 400px;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          text-align: center;
        }

        .dark .bitdefender-modal-content {
          background: #2C2C2C;
          color: white;
          border: 1px solid #374151;
        }

        .bitdefender-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          background: #ED1C24;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          font-size: 18px;
          font-weight: bold;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .bitdefender-modal-close:hover {
          transform: scale(1.05);
          background: #c41e1e;
        }

        [dir="rtl"] .bitdefender-modal-close {
          left: 16px;
        
        }

        .bitdefender-modal-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .bitdefender-modal-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .bitdefender-modal-message {
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 32px;
          color: black;
          padding: 0 8px;
        }

        .dark .bitdefender-modal-message {
          color: #ccc;
        }

        @media (max-width: 640px) {
          .bitdefender-modal-fade > div {
            margin: 16px;
            max-width: calc(100vw - 32px);
            padding: 20px;
          }
          
        
          
       .bitdefender-modal-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.bitdefender-modal-button {
  position: relative;
  overflow: hidden;
  padding: 9.41px 34.13px;
  border-radius: 28.24px;
  border: 2px solid #ED1C24;
  font-weight: 600;
  font-size: 17.65px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 207.11px;
  height: 47.07px;
  text-align: center;
  display: inline-block;
  white-space: nowrap;
  max-width: 200px;
  width: 100%;
}

.bitdefender-modal-button span {
  position: relative;
  z-index: 10;
}


          .bitdefender-modal-icon {
            width: 56px;
            height: 56px;
            margin-bottom: 20px;
          }

          .bitdefender-modal-title {
            font-size: 18px;
          }

          .bitdefender-modal-message {
            font-size: 13px;
            margin-bottom: 24px;
          }
        }
          @keyframes slideInUp {
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

@keyframes slideOutDown {
  from {
    transform: translate(-50%, 0);
    opacity: 1;
  }
  to {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
}
      `;
      document.head.appendChild(styleElement);
    }
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
      console.log(`Language changed from ${this.currentLang} to ${newLang}`);
      this.currentLang = newLang;
      this.render();
      this.updateDocumentDirection();
    }
  }

  checkLanguageChange() {
    this.handleLanguageChange();
  }

  updateDocumentDirection() {
    const mainContainer = this.container.querySelector("[dir]");
    if (mainContainer) {
      mainContainer.dir = this.currentLang === "ar" ? "rtl" : "ltr";
    }
  }

  getIconPath(plan, type = "icon") {
    const isDark = document.documentElement.classList.contains("dark");
    const iconKey = isDark ? `${type}Dark` : type;
    return plan[iconKey] || plan[type];
  }

  getLogoPath() {
    const isDark = document.documentElement.classList.contains("dark");
    return isDark ? "./assets/images/services/Bitdefender/Bitdefender-white.svg" : "./assets/images/services/Bitdefender.svg";
  }

  getTranslatedPlan(plan) {
    const isArabic = this.currentLang === "ar";
    return {
      ...plan,
      title: isArabic ? plan.titleAr || plan.title : plan.title,
      subtitle: isArabic ? plan.subtitleAr || plan.subtitle : plan.subtitle,
      features: isArabic ? plan.featuresAr || plan.features : plan.features,
      duration: isArabic ? plan.durationAr || plan.duration : plan.duration,
    };
  }

  createCardHTML(plan, index) {
    const translatedPlan = this.getTranslatedPlan(plan);
    const isArabic = this.currentLang === "ar";
    const t = bitdefenderTranslations[this.currentLang];
    const textAlign = isArabic ? "text-right" : "text-left";
    const fontClass = isArabic ? "font-noto-kufi-arabic" : "font-rubik";
    const currencyLabel = isArabic ? "دج" : "DA";

    return `
      <div class="relative bg-white dark:bg-[#2C2C2C] rounded-xl flex flex-col w-full max-w-[450px] mx-auto bitdefender-card-shadow dark:border dark:border-[#CDCDCD] bitdefender-hover-lift overflow-hidden">
        <!-- Header with red background -->
        <div class="bg-ooredoo-red rounded-t-xl py-3 text-center">
          <h3 class="${fontClass} text-white font-medium text-[24px]  tracking-wide leading-tight">
            ${translatedPlan.title}
          </h3>
        </div>
        
        <div class="p-6 bitdefender-card-container h-full">
          <!-- Subtitle and Icon -->
          <div class="flex items-center justify-between mb-4">
            <h4 class="${fontClass} text-ooredoo-red dark:text-white font-bold text-xl flex-1 ${isArabic ? "ml-3" : "mr-3"} leading-tight">
              ${translatedPlan.subtitle}
            </h4>
            <img src="${this.getIconPath(plan)}" alt="Device" class="w-20 h-14 object-contain flex-shrink-0 bitdefender-plan-icon" />
          </div>
          
          <!-- Divider -->
          <div class="w-full h-px bitdefender-divider mb-4"></div>
          
          <!-- Protection info -->
          <div class="flex items-center justify-between mb-4">
            <span class="${fontClass} text-black dark:text-white font-normal text-base ${isArabic ? "ml-3" : "mr-3"}">
              ${t.completeProtection}
            </span>
            <img src="${this.getIconPath(
              plan,
              "systemsIcon"
            )}" alt="Systems" class="w-28 h-7 mb-[9px] object-contain flex-shrink-0 bitdefender-systems-icon" />
          </div>
          
          <!-- Divider -->
          <div class="w-full h-px bitdefender-divider mb-5"></div>
          
          <!-- Content -->
          <div class="bitdefender-card-content flex-1">
            <!-- Features -->
            <div class="flex-1 mb-4">
              <div class="${isArabic ? "text-right" : "text-left"}" dir="${isArabic ? "rtl" : "ltr"}">
                <ul class="space-y-3">
                  ${translatedPlan.features
                    .map(
                      (feature) => `
                    <li class="flex items-start gap-2">
                      <img src="./assets/images/checkbox.svg" alt="Check" class="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span class="bitdefender-feature-item flex-1">
                        ${feature}
                      </span>
                    </li>
                  `
                    )
                    .join("")}
                </ul>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bitdefender-card-footer border-t border-gray-100 dark:border-gray-700 pt-4">
            <!-- Starting from text -->
            <div class="text-center">
              <span class="${fontClass} text-[#7F7F7F] text-sm font-normal leading-[18.91px]">
                ${t.startingFrom}
              </span>
            </div>

            <!-- Price Section -->
            <div class="flex justify-center items-baseline w-full">
              <div class="flex items-baseline justify-center gap-2">
                <span class="${fontClass} font-bold text-2xl sm:text-3xl leading-none text-black dark:text-white">
                  ${plan.price}
                </span>
                <span class="${fontClass} font-semibold text-base leading-none text-black dark:text-white whitespace-nowrap">
                  ${isArabic ? `${currencyLabel}/${translatedPlan.duration}` : `${currencyLabel}/${translatedPlan.duration}`}
                </span> 
              </div>
            </div>

            <!-- Button -->
            <div class="bitdefender-button-zone flex justify-center w-full">
              <button class="bitdefender-buy-btn ${fontClass} bg-ooredoo-red text-white border-none rounded-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:outline-2 focus:outline-ooredoo-red focus:outline-offset-2" 
                      style="
                        font-weight: 600;
                        font-size: 16px;
                        line-height: 100%;
                        letter-spacing: 0;
                        text-align: center;
                        text-transform: uppercase;
                        padding: 8px 24px;
                        height: 32px;
                        width: auto;
                        min-width: 96px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                      "
                      data-plan-index="${index}">
                ${t.buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  calculatePrice(basePrice, duration) {
    const priceTable = {
      5: { 1: 1500, 12: 16500 },
      10: { 1: 2500, 12: 27500 },
      20: { 1: 4500, 12: 49500 },
    };

    return priceTable[this.selectedDevices]?.[duration] || 1500;
  }

  createSelectionHTML() {
    const isArabic = this.currentLang === "ar";
    const t = bitdefenderTranslations[this.currentLang];
    const fontClass = isArabic ? "font-noto-kufi-arabic" : "font-rubik";
    const dirAttribute = isArabic ? 'dir="rtl"' : "";
    const currentPrice = this.calculatePrice(this.selectedPlan.price, this.selectedDuration);
    const currency = isArabic ? "دج" : "DA";

    return `
      <div class="w-full bg-gray-50 dark:bg-[#1C1C1C] pt-4 lg:pt-8 pb-[50px] lg:pb-[70px] ${fontClass}" ${dirAttribute}>
        <div class="w-full mx-auto px-2 sm:px-4 flex flex-col items-center">
          
          <!-- Main Container Card -->
          <div class="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[90vw] w-full mx-auto bg-white dark:bg-[#2C2C2C] rounded-xl lg:rounded-2xl shadow-lg overflow-hidden">
            
            <!-- Integrated Header -->
            <div class="rounded-t-xl lg:rounded-t-2xl" style="background-color: #ED1C24;">
              <div class="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 lg:p-6 gap-3 sm:gap-0 ${
                isArabic ? "sm:flex-row-reverse" : ""
              }">
                
                <!-- Left Side: Logo + Separator + Title -->
                <div class="flex items-center ${isArabic ? "flex-row-reverse" : ""} gap-2 sm:gap-3 lg:gap-4">
                  <div class="flex-shrink-0">
                    <img src="${this.getLogoPath()}" alt="Bitdefender" class="h-8 w-16 sm:h-10 sm:w-20 lg:h-[55px] lg:w-[112px] object-contain filter brightness-0 invert" />
                  </div>
                  
                  <!-- Vertical Separator - Hidden on mobile -->
                  <div class="hidden sm:block h-8 lg:h-12 w-px bg-white bg-opacity-30"></div>
                  
                  <div class="text-white ${isArabic ? "text-right" : "text-left"} text-center sm:text-left">
                    <h2 class="font-medium font-rubik text-sm sm:text-lg lg:text-[22px] leading-tight">Small Office Security</h2>
                  </div>
                </div>

                <!-- Right Side: Paragraph + Device Image -->
                <div class="flex items-center ${isArabic ? "flex-row-reverse" : ""} gap-2 sm:gap-3 lg:gap-4">
                  <div class="text-white ${isArabic ? "text-left" : "text-right"} text-center sm:text-right">
                    <p class="text-white text-opacity-90 text-sm sm:text-lg lg:text-[22px] font-medium lg:font-semibold">
                      ${isArabic ? "حماية تصل إلى 20 جهاز" : "Protégez jusqu'à 20 appareils"}
                    </p>
                  </div>
                  <div class="flex-shrink-0">
                    <img src="./assets/images/services/bitdefender/appareils-desktop-dark.svg" alt="Device" class="w-12 h-8 sm:w-16 sm:h-10 lg:w-20 lg:h-14 object-contain bitdefender-plan-icon" />
                  </div>
                </div>
                
              </div>
            </div>

            <!-- Content Section -->
            <div class="px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-[50px]">
              <!-- Title -->
              <div class="text-center mb-6 lg:mb-10">
                <h1 class="font-medium text-lg sm:text-xl lg:text-[28.8px] text-black dark:text-white leading-tight">
                  ${isArabic ? "اختاروا العرض الذي يناسبكم" : "CHOISISSEZ L'OFFRE QUI VOUS CONVIENT"}
                </h1>
              </div>

              <!-- Selection Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center items-start gap-4 lg:gap-6 mb-6 lg:mb-10">
                
                <!-- 01 - Duration Selection Card -->
                <div class="flex flex-col items-center rounded-2xl lg:rounded-[18px] border border-[#D4D4D4] overflow-hidden order-1">
                  <!-- Header -->
                  <div class="w-full flex items-center justify-center gap-2 lg:gap-3" style="background-color: #ED1C24; padding: 12px 8px; lg:padding: 16px;">
                    <div class="bg-white rounded-full flex items-center justify-center font-bold text-xs lg:text-sm" style="width: 22px; height: 22px; lg:width: 27px; lg:height: 27px; color: #ED1C24;">
                      01
                    </div>
                    <span class="font-medium text-white text-xs sm:text-sm lg:text-base text-center leading-tight">
                      ${isArabic ? "اختاروا  مدة الاشتراك" : "Choisissez la durée de l'abonnement"}
                    </span>
                  </div>
                  <!-- Options -->
                  <div class="flex gap-2 sm:gap-3 lg:gap-4 justify-center py-8 sm:py-12 lg:py-[60px]">
                    <button class="bitdefender-selection-option duration-option transition-all duration-300 font-medium text-xs sm:text-sm lg:text-sm ${
                      this.selectedDuration === 1 ? "text-white" : "text-black hover:bg-gray-200"
                    }" 
                            data-duration="1"
                            style="width: 60px; height: 35px; sm:width: 70px; sm:height: 38px; lg:width: 80px; lg:height: 40px; border-radius: 8px; ${
                              this.selectedDuration === 1 ? "background-color: #ED1C24;" : "background-color: #eee;"
                            }">
                      ${isArabic ? "01 شهر" : "01 mois"}
                    </button>
                    <button class="bitdefender-selection-option duration-option transition-all duration-300 font-medium text-xs sm:text-sm lg:text-sm ${
                      this.selectedDuration === 12 ? "text-white" : "text-black hover:bg-gray-200"
                    }" 
                            data-duration="12"
                            style="width: 60px; height: 35px; sm:width: 70px; sm:height: 38px; lg:width: 80px; lg:height: 40px; border-radius: 8px; ${
                              this.selectedDuration === 12 ? "background-color: #ED1C24;" : "background-color: #eee;"
                            }">
                      ${isArabic ? "12 شهر" : "12 mois"}
                    </button>
                  </div>
                </div>

                <!-- 02 - Device Selection Card -->
                <div class="flex flex-col items-center rounded-2xl lg:rounded-[18px] border border-[#D4D4D4] overflow-hidden order-2">
                  <!-- Header -->
                  <div class="w-full flex items-center justify-center gap-2 lg:gap-3" style="background-color: #ED1C24; padding: 12px 8px; lg:padding: 16px;">
                    <div class="bg-white rounded-full flex items-center justify-center font-bold text-xs lg:text-sm" style="width: 22px; height: 22px; lg:width: 27px; lg:height: 27px; color: #ED1C24;">
                      02
                    </div>
                    <span class="font-medium text-white text-xs sm:text-sm lg:text-base text-center leading-tight">
                      ${isArabic ? "اختاروا  عدد الأجهزة" : "Choisissez le nombre d'appareils"}
                    </span>
                  </div>
                  <!-- Options -->
                  <div class="flex gap-2 sm:gap-3 lg:gap-3 justify-center py-8 sm:py-12 lg:py-[60px]">
                    <button class="bitdefender-selection-option device-option transition-all duration-300 font-medium text-xs sm:text-sm lg:text-sm ${
                      this.selectedDevices === 5 ? "text-white" : "text-black hover:bg-gray-200"
                    }" 
                            data-devices="5"
                            style="width: 45px; height: 35px; sm:width: 50px; sm:height: 38px; lg:width: 60px; lg:height: 40px; border-radius: 8px; ${
                              this.selectedDevices === 5 ? "background-color: #ED1C24;" : "background-color: #eee;"
                            }">
                      05
                    </button>
                    <button class="bitdefender-selection-option device-option transition-all duration-300 font-medium text-xs sm:text-sm lg:text-sm ${
                      this.selectedDevices === 10 ? "text-white" : "text-black hover:bg-gray-200"
                    }" 
                            data-devices="10"
                            style="width: 45px; height: 35px; sm:width: 50px; sm:height: 38px; lg:width: 60px; lg:height: 40px; border-radius: 8px; ${
                              this.selectedDevices === 10 ? "background-color: #ED1C24;" : "background-color: #eee;"
                            }">
                      10
                    </button>
                    <button class="bitdefender-selection-option device-option transition-all duration-300 font-medium text-xs sm:text-sm lg:text-sm ${
                      this.selectedDevices === 20 ? "text-white" : "text-black hover:bg-gray-200"
                    }" 
                            data-devices="20"
                            style="width: 45px; height: 35px; sm:width: 50px; sm:height: 38px; lg:width: 60px; lg:height: 40px; border-radius: 8px; ${
                              this.selectedDevices === 20 ? "background-color: #ED1C24;" : "background-color: #eee;"
                            }">
                      20
                    </button>
                  </div>
                </div>

                <!-- 03 - Subscription Price Card -->
                <div class="flex flex-col items-center rounded-2xl lg:rounded-[18px] border border-[#D4D4D4] overflow-hidden order-3 sm:col-span-2 lg:col-span-1">
                  <!-- Header -->
                  <div class="w-full flex items-center justify-center gap-2 lg:gap-3" style="background-color: #ED1C24; padding: 12px 8px; lg:padding: 16px;">
                    <div class="bg-white rounded-full flex items-center justify-center font-bold text-xs lg:text-sm" style="width: 22px; height: 22px; lg:width: 27px; lg:height: 27px; color: #ED1C24;">
                      03
                    </div>
                    <span class="font-medium text-white text-xs sm:text-sm lg:text-base text-center leading-tight">
                      ${isArabic ? "سعر الاشتراك" : "Prix de l'abonnement"}
                    </span>
                  </div>
                  <!-- Price Display -->
                  <div class="py-8 sm:py-12 lg:py-[55px] flex items-center justify-center">
                    <div class="text-center bitdefender-price-display flex items-center justify-center text-white font-medium text-base sm:text-lg lg:text-[20px] px-3" 
                         style="background-color: #ED1C24; height: 40px; sm:height: 45px; lg:height: 50px; border-radius: 8px; min-width: 100px; sm:min-width: 120px;">
                     ${this.calculatePrice(null, this.selectedDuration)} ${currency}
                    </div>
                  </div>
                </div>

              </div>

              <!-- Action Buttons -->
              <div class="flex flex-row justify-center items-center gap-3 mt-8 lg:mt-12">
                <button class="bitdefender-cancel-btn ${fontClass} group relative overflow-hidden border-[#ED1C24] text-[#ED1C24] dark:border-white  dark:text-white bg-white max-w-[200px]  dark:bg-[#2C2C2C] border-2 font-medium sm:font-semibold text-sm sm:text-base lg:text-[17.65px] transition-all duration-300 hover:shadow-lg hover:scale-105 uppercase tracking-wide w-full sm:w-auto"
                        style="
                               width: 100%; height: 42px; 
                               sm:width: 180px; sm:height: 44px;
                               lg:width: 207.11px; lg:height: 47.07px; 
                               border-radius: 25px; lg:border-radius: 28.24px; 
                               padding: 8px 20px; sm:padding: 9px 30px; lg:padding: 9.41px 34.13px;">
                  <span class="relative z-10 dark:text-white dark:border-white">${isArabic ? "إلغاء" : "RETOUR"}</span>
                </button>
                <button class="bitdefender-choose-btn ${fontClass} group relative overflow-hidden max-w-[200px]  text-white border-2 font-medium sm:font-semibold text-sm sm:text-base lg:text-[17.65px] transition-all duration-300 hover:shadow-xl hover:scale-105 uppercase tracking-wide w-full sm:w-auto"
                        style="background-color: #ED1C24; border-color: #ED1C24; 
                               width: 100%; height: 42px; 
                               sm:width: 180px; sm:height: 44px;
                               lg:width: 207.11px; lg:height: 47.07px; 
                               border-radius: 25px; lg:border-radius: 28.24px; 
                               padding: 8px 20px; sm:padding: 9px 30px; lg:padding: 9.41px 34.13px;">
                  <span class="relative z-10">${isArabic ? "اختيار" : "CHOISIR"}</span>
                  <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: linear-gradient(135deg, #ED1C24 0%, #c41e1e 100%);"></div>
                </button>
              </div>
            </div>
          </div>
          
          <div id="bitdefender-modal-hook"></div>
        </div>
      </div>
    `;
  }

  render() {
    if (this.currentView === "selection") {
      this.container.innerHTML = this.createSelectionHTML();
      this.bindSelectionEvents();
    } else {
      this.renderMainView();
    }
  }

  renderMainView() {
    const isArabic = this.currentLang === "ar";
    const fontClass = isArabic ? "font-noto-kufi-arabic" : "font-rubik";
    const dirAttribute = isArabic ? 'dir="rtl"' : 'dir="ltr"';

    this.container.innerHTML = `
      <div class="w-full bg-white dark:bg-[#2C2C2C] py-16 ${fontClass}" ${dirAttribute}>
        <div class="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div class="flex-shrink-0 flex items-center justify-center lg:min-w-[300px] lg:h-[450px]">
            <img id="bitdefender-logo" src="${this.getLogoPath()}" alt="Bitdefender" class="w-80 h-auto object-contain" />
          </div>
          
          <div class="flex-1 max-w-lg w-full">
            <div class="space-y-6">
              ${bitdefenderPlans.map((plan, index) => this.createCardHTML(plan, index)).join("")}
            </div>
          </div>
        </div>
        
        <div id="bitdefender-modal-hook"></div>
      </div>
    `;

    this.bindButtons();
  }

  bindButtons() {
    this.container.querySelectorAll("button[data-plan-index]").forEach((btn) => {
      btn.addEventListener("click", this.handlePlanClick.bind(this, btn));
      btn.addEventListener(
        "touchend",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.handlePlanClick(btn);
        },
        { passive: false }
      );
    });
  }

  bindSelectionEvents() {
    // Device selection
    this.container.querySelectorAll(".device-option").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const devices = parseInt(e.currentTarget.dataset.devices);
        this.selectedDevices = devices;
        this.updateSelectionUI();
      });
    });

    // Duration selection
    this.container.querySelectorAll(".duration-option").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const duration = parseInt(e.currentTarget.dataset.duration);
        this.selectedDuration = duration;
        this.updateSelectionUI();
      });
    });

    // Action buttons
    this.container.querySelector(".bitdefender-cancel-btn")?.addEventListener("click", () => {
      this.currentView = "main";
      this.render();
    });

    this.container.querySelector(".bitdefender-choose-btn")?.addEventListener("click", () => {
      this.showPurchaseFlow();
    });
  }

  updateSelectionUI() {
    // Update device options
    this.container.querySelectorAll(".device-option").forEach((btn) => {
      const devices = parseInt(btn.dataset.devices);
      if (devices === this.selectedDevices) {
        btn.style.backgroundColor = "#ED1C24";
        btn.style.color = "white";
        btn.classList.add("selected");
      } else {
        btn.style.backgroundColor = "#eee";
        btn.style.color = "black";
        btn.classList.remove("selected");
      }
    });

    // Update duration options
    this.container.querySelectorAll(".duration-option").forEach((btn) => {
      const duration = parseInt(btn.dataset.duration);
      if (duration === this.selectedDuration) {
        btn.style.backgroundColor = "#ED1C24";
        btn.style.color = "white";
        btn.classList.add("selected");
      } else {
        btn.style.backgroundColor = "#eee";
        btn.style.color = "black";
        btn.classList.remove("selected");
      }
    });

    const isArabic = this.currentLang === "ar";
    const currency = isArabic ? "دج" : "DA";
    // Update price using the new calculation
    const newPrice = this.calculatePrice(null, this.selectedDuration);
    const priceDisplay = this.container.querySelector(".bitdefender-price-display");

    if (priceDisplay) {
      priceDisplay.textContent = `${newPrice} ${currency}`;
    }
  }

  handlePlanClick(btn) {
    const planIndex = parseInt(btn.dataset.planIndex);
    const plan = bitdefenderPlans[planIndex];

    this.selectedPlan = this.getTranslatedPlan(plan);
    this.selectedDevices = 5; // Default to 5 devices (first option)
    this.selectedDuration = 1; // Default to 1 month (first option)
    this.currentView = "selection";
    this.render();
  }

  // Enhanced Modal System with new designs
// Enhanced Modal System with new designs
createModalHTML({ type, title, message, isRTL }) {
  const dirAttribute = isRTL ? 'dir="rtl"' : 'dir="ltr"';
  const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

  // Get the appropriate icon based on modal type
  const getModalIcon = (modalType, isRTL) => {
    switch (modalType) {
      case "error":
        return `
          <div class="bitdefender-modal-icon bg-red-100 dark:bg-red-900/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ED1C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
        `;
      case "credit":
        return `
          <div class="bitdefender-modal-icon bg-yellow-100 dark:bg-yellow-900/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
              <line x1="1" y1="1" x2="23" y2="23" stroke="#ED1C24"/>
            </svg>
          </div>
        `;
      case "success":
        return `
          <div class="bitdefender-modal-icon bg-green-100 dark:bg-green-900/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
          </div>
        `;
      case "confirm":
      default:
        return `
          <div class="bitdefender-modal-icon flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="82" height="84" viewBox="0 0 82 84" fill="none">
              <path d="M26.1236 50.9266V65.8045M41.0014 50.9266V65.8045M55.8793 50.9266V65.8045M72.8996 36.0487H9.10325C8.25215 36.0415 7.4094 36.2169 6.63188 36.5632C5.85435 36.9094 5.16013 37.4184 4.59608 38.0557C4.03202 38.6931 3.61124 39.4441 3.36214 40.258C3.11304 41.0718 3.04142 41.9296 3.15209 42.7735L7.49644 75.5049C7.68528 76.9456 8.39472 78.2675 9.49098 79.2213C10.5872 80.175 11.9946 80.6947 13.4476 80.6824H68.4363C69.8893 80.6947 71.2966 80.175 72.3929 79.2213C73.4891 78.2675 74.1986 76.9456 74.3874 75.5049L78.7318 42.7735C78.8412 41.9396 78.7725 41.0919 78.5304 40.2864C78.2883 39.4809 77.8782 38.7358 77.3271 38.1004C76.776 37.465 76.0965 36.9536 75.3333 36.5999C74.5701 36.2463 73.7407 36.0584 72.8996 36.0487ZM55.8793 10.7563C55.8793 11.7332 55.6869 12.7006 55.3131 13.6031C54.9392 14.5056 54.3913 15.3257 53.7005 16.0165C53.0097 16.7072 52.1897 17.2552 51.2871 17.629C50.3846 18.0029 49.4173 18.1953 48.4404 18.1953H33.5625C31.5896 18.1953 29.6974 17.4115 28.3024 16.0165C26.9073 14.6214 26.1236 12.7293 26.1236 10.7563C26.1236 8.7834 26.9073 6.89127 28.3024 5.4962C29.6974 4.10113 31.5896 3.31738 33.5625 3.31738H48.4404C50.4133 3.31738 52.3054 4.10113 53.7005 5.4962C55.0956 6.89127 55.8793 8.7834 55.8793 10.7563Z" stroke="#4258F5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M55.7627 9.50781C59.3276 10.1237 62.5938 11.887 65.0645 14.5296C67.5352 17.1722 69.0753 20.5495 69.4503 24.1477L70.7596 36.05M11.248 36.05L12.5573 24.1477C12.9568 20.5708 14.5076 17.2206 16.9763 14.6016C19.445 11.9826 22.6979 10.2367 26.245 9.62684" stroke="#4258F5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        `;
    }
  };

  const buttons = this.getModalButtons(type, isRTL);

  // Enhanced download function with better error handling and feedback
  const setupTermsDownload = () => {
    const termsLink = document.getElementById('terms-link');
    
    if (termsLink) {
      termsLink.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const fileName = isRTL 
          ? 'TERMES_ET_CONDITIONS AR migration Dima Ooredoo ver DIma+.pdf' 
          : 'TERMES_ET_CONDITIONS migration Dima Ooredoo ver DIma+.pdf';
        
        // Show loading state
        const originalText = termsLink.textContent;
        termsLink.style.opacity = '0.6';
        termsLink.textContent = isRTL ? 'جاري التحميل...' : 'Téléchargement...';
        
        // Updated paths for your live-server setup
        const possiblePaths = [
          `http://127.0.0.1:3000/assets/documents/${fileName}`,
          `http://localhost:3000/assets/documents/${fileName}`,
          `./assets/documents/${fileName}`,
          `/assets/documents/${fileName}`,
          `assets/documents/${fileName}`,
          `./dist/assets/documents/${fileName}`,
          `/dist/assets/documents/${fileName}`
        ];
        
        let downloadSuccess = false;
        
        // Try each path
        for (const path of possiblePaths) {
          try {
            console.log(`Attempting download from: ${path}`);
            
            // For HTTP URLs, test with fetch first
            if (path.startsWith('http')) {
              try {
                const response = await fetch(path, { method: 'HEAD' });
                if (response.ok) {
                  downloadFile(path, fileName);
                  downloadSuccess = true;
                  break;
                }
              } catch (fetchError) {
                console.log(`Fetch failed for ${path}:`, fetchError.message);
                // Still try direct download as fallback
                downloadFile(path, fileName);
                downloadSuccess = true;
                break;
              }
            } else {
              // Try direct download for relative paths
              downloadFile(path, fileName);
              downloadSuccess = true;
              break;
            }
          } catch (error) {
            console.warn(`Failed to download from ${path}:`, error);
          }
        }
        
        // Reset button state
        setTimeout(() => {
          if (termsLink) {
            termsLink.style.opacity = '1';
            termsLink.textContent = originalText;
          }
        }, 2000);
        
        if (!downloadSuccess) {
          showNotification(
            isRTL ? 
            'تعذر العثور على الملف. تحقق من وجود الملف في مجلد assets/documents' : 
            'Fichier introuvable. Vérifiez que le fichier existe dans le dossier assets/documents',
            'error'
          );
        }
      });
    }
  };

  // Download function
  const downloadFile = (path, fileName) => {
    try {
      const link = document.createElement('a');
      link.href = path;
      link.download = fileName;
      link.target = '_blank';
      
      // Add to DOM temporarily
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification(
        isRTL ? 'تم بدء التحميل' : 'Téléchargement démarré',
        'success'
      );
      
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      
      // Fallback: try opening in new window
      try {
        window.open(path, '_blank');
        showNotification(
          isRTL ? 'تم فتح الملف في نافذة جديدة' : 'Fichier ouvert dans un nouvel onglet',
          'info'
        );
        return true;
      } catch (fallbackError) {
        console.error('Fallback failed:', fallbackError);
        return false;
      }
    }
  };

  // Notification system
  const showNotification = (message, type = 'success') => {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.download-notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    
    const colors = {
      success: '#10B981',
      error: '#ED1C24', 
      info: '#3B82F6'
    };
    
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${colors[type] || colors.success};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      font-size: 14px;
      max-width: 90vw;
      text-align: center;
      animation: slideInUp 0.3s ease-out;
      cursor: pointer;
      font-family: ${isRTL ? "'Noto Kufi Arabic'" : "'Rubik'"}, Arial, sans-serif;
    `;
    
    notification.textContent = message;
    
    // Click to dismiss
    notification.onclick = () => {
      notification.style.animation = 'slideOutDown 0.2s ease-in';
      setTimeout(() => notification.remove(), 200);
    };
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.animation = 'slideOutDown 0.2s ease-in';
        setTimeout(() => notification.remove(), 200);
      }
    }, type === 'error' ? 6000 : 3000);
  };

  // Execute download setup after modal renders
  setTimeout(setupTermsDownload, 0);

  return `
    <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bitdefender-modal-fade" 
         style="background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px);" 
         role="dialog" 
         aria-modal="true" 
         aria-labelledby="modal-title">
      <div class="relative bg-white pt-6 px-2 dark:bg-[#2C2C2C] rounded-3xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden flex flex-col items-center animate-[modalFadeIn_0.3s_ease-out_forwards]" ${dirAttribute}>
        <!-- Close Button -->
        <button class="bitdefender-modal-close absolute top-4 ${isRTL ? 'left-4' : 'right-4'} w-8 h-8 bg-[#ED1C24] hover:bg-[#c41e1e] border-none rounded-full flex items-center justify-center cursor-pointer text-white text-lg font-bold transition-all duration-200 hover:scale-105 z-10" 
                aria-label="${isRTL ? "إغلاق" : "Fermer"}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Modal Content -->
        <div class="px-6 py-8 text-center w-full">
          <!-- Icon -->
          ${getModalIcon(type, isRTL)}
          
          <!-- Title -->
          <h2 id="modal-title" class="bitdefender-modal-title ${fontClass} text-black dark:text-white text-xl font-bold mb-4 leading-tight">
            ${title}
          </h2>

          <!-- Message -->
          <p class="bitdefender-modal-message ${fontClass} font-semibold text-base text-black dark:text-[#ccc] leading-relaxed mb-8 px-2">
            ${message}
          </p>
          
          <!-- Terms Checkbox (only for confirm modal) -->
          ${
            type === "confirm"
              ? `   
              <div class="flex items-center justify-center mt-4 mb-6 font-normal text-sm">     
                <label class="${!isRTL ? 'flex-row-reverse' : ''} flex items-center cursor-pointer ${fontClass} select-none gap-3">         
                  <input type="checkbox" class="sr-only peer" id="terms-checkbox"> 
                  <div class="relative w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded-full border-2 border-gray-300 dark:border-gray-500 peer-focus:ring-2 peer-focus:ring-ooredoo-red peer-checked:bg-ooredoo-red peer-checked:border-ooredoo-red transition-all duration-200 cursor-pointer flex-shrink-0">
                    <svg class="w-3 h-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <span class="text-sm text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed ${isRTL ? 'text-right' : 'text-left'}">
                    ${isRTL 
                      ? `أوافق على <button type="button" class="terms-link text-ooredoo-red font-semibold hover:underline underline focus:outline-none focus:ring-2 focus:ring-ooredoo-red focus:ring-offset-1 rounded transition-all duration-200" id="terms-link">شروط الإستعمال</button>` 
                      : `J'accepte les <button type="button" class="terms-link text-ooredoo-red font-semibold hover:underline underline focus:outline-none focus:ring-2 focus:ring-ooredoo-red focus:ring-offset-1 rounded transition-all duration-200" id="terms-link">conditions générales</button>`
                    }
                  </span>
                </label>
              </div>`
              : ""
          }

          <!-- Buttons -->
          <div class="bitdefender-modal-buttons flex flex-row items-center justify-center gap-3 mt-8">
            ${buttons}
          </div>
        </div>
      </div>
    </div>
  `;
}

  getModalButtons(type, isRTL) {
    const t = bitdefenderTranslations[this.currentLang];
    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

    // Common styles for both buttons
    const baseBtnClass = `
    relative group overflow-hidden transition-all duration-300 
    text-sm sm:text-base lg:text-[17.65px] font-medium sm:font-semibold 
    tracking-wide uppercase max-w-[200px] w-auto 
    h-[42px] sm:h-[44px] lg:h-[47.07px] 
    px-[20px] sm:px-[30px] lg:px-[34.13px] 
    rounded-[25px] lg:rounded-[28.24px]
  `;

    const secondaryBtn = `
    ${baseBtnClass}
    border-2 text-[#ED1C24] bg-white dark:bg-[#2C2C2C] 
    border-[#ED1C24] dark:border-white  dark:text-white hover:scale-105 hover:shadow-lg
  `;

    const primaryBtn = `
    ${baseBtnClass}
    text-white border-2 bg-[#ED1C24] border-[#ED1C24] 
    hover:scale-105 hover:shadow-xl
  `;

    const primaryBtnContent = `
    <span class="relative z-10">${t.confirmBtn}</span>
    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
         style="background: linear-gradient(135deg, #ED1C24 0%, #c41e1e 100%);"></div>
  `;

    const closeBtnContent = `
    <span class="relative z-10">${t.closeBtn}</span>
    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
         style="background: linear-gradient(135deg, #ED1C24 0%, #c41e1e 100%);"></div>
  `;

    switch (type) {
      case "confirm":
        return `
        <button class="${secondaryBtn} ${fontClass}" data-action="cancel">
          <span class="relative z-10">${t.cancelBtn}</span>
        </button>
        <button class="${primaryBtn} ${fontClass}" data-action="confirm">
          ${primaryBtnContent}
        </button>
      `;
      case "error":
      case "credit":
      case "success":
      default:
        return `
        <button class="${primaryBtn} ${fontClass}" data-action="close">
          ${closeBtnContent}
        </button>
      `;
    }
  }

  showPurchaseFlow() {
    const t = bitdefenderTranslations[this.currentLang];
    const finalPrice = this.calculatePrice(this.selectedPlan.price, this.selectedDuration);
    function formatDuration(duration, lang) {
      if (lang === "fr") {
        return duration === 1 ? "mois" : `${duration} mois`;
      }
      if (lang === "ar") {
        return duration === 1 ? "شهر" : `${duration} شهر`;
      }
      return `${duration}`;
    }

    const planWithPrice = {
      ...this.selectedPlan,
      price: finalPrice,
      devices: this.selectedDevices,
      duration: formatDuration(this.selectedDuration, this.currentLang),
    };

    this.showModal({
      type: "confirm",
      title: t.buyModalTitle,
      message: t.buyMessage(planWithPrice),
      isRTL: this.currentLang === "ar",
      onConfirm: () => {
        // Simulate credit check - 70% chance of insufficient credit for demo
        const hasCredit = Math.random() > 0.3;

        if (!hasCredit) {
          // Show insufficient credit modal
          this.showModal({
            type: "credit",
            title: t.creditTitle,
            message: t.creditMessage(planWithPrice),
            isRTL: this.currentLang === "ar",
            onClose: () => {
              this.currentView = "main";
              this.render();
            },
          });
        } else {
          // Show success modal
          this.showModal({
            type: "success",
            title: t.congratsTitle,
            message: t.congratsMessage(planWithPrice),
            isRTL: this.currentLang === "ar",
            onClose: () => {
              this.currentView = "main";
              this.render();
            },
          });
        }
      },
    });
  }

  showModal({ type, title, message, isRTL = false, onConfirm, onClose }) {
    const modalContainer = this.container.querySelector("#bitdefender-modal-hook");
    const modalHTML = this.createModalHTML({ type, title, message, isRTL });

    modalContainer.innerHTML = modalHTML;
    this.setupModalEvents({ type, onConfirm, onClose, modalContainer });
  }

  setupModalEvents({ type, onConfirm, onClose, modalContainer }) {
    const modal = modalContainer.querySelector(".bitdefender-modal-fade");
    const closeButton = modal.querySelector(".bitdefender-modal-close");
    const actionButtons = modal.querySelectorAll("[data-action]");

    const closeModal = () => {
      modal.style.animation = "modalFadeOut 0.2s ease-in forwards";
      setTimeout(() => {
        modalContainer.innerHTML = "";
      }, 200);
    };

    closeButton.addEventListener("click", closeModal);

    actionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.getAttribute("data-action");
        closeModal();

        setTimeout(() => {
          switch (action) {
            case "confirm":
              if (onConfirm) onConfirm();
              break;
            case "close":
              if (onClose) onClose();
              break;
          }
        }, 200);
      });
    });

    // Close on backdrop click
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key
    const escapeHandler = (event) => {
      if (event.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", escapeHandler);
      }
    };
    document.addEventListener("keydown", escapeHandler);

    // Focus management
    setTimeout(() => {
      const firstButton = modal.querySelector("[data-action]");
      if (firstButton) {
        firstButton.focus();
      }
    }, 100);
  }

  observeTheme() {
    const observer = new MutationObserver(this.updateThemeElements.bind(this));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  }

  updateThemeElements() {
    const logo = document.getElementById("bitdefender-logo");
    if (logo) {
      logo.src = this.getLogoPath();
    }

    document.querySelectorAll(".bitdefender-plan-icon").forEach((img, index) => {
      if (index < bitdefenderPlans.length) {
        img.src = this.getIconPath(bitdefenderPlans[index]);
      }
    });

    document.querySelectorAll(".bitdefender-systems-icon").forEach((img, index) => {
      if (index < bitdefenderPlans.length) {
        img.src = this.getIconPath(bitdefenderPlans[index], "systemsIcon");
      }
    });
  }

  destroy() {
    this.unbindEvents();

    const styles = document.getElementById("bitdefender-enhanced-styles");
    if (styles) {
      styles.remove();
    }
  }
}
