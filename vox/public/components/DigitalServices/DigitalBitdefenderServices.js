import { bitdefenderPlans } from './DigitalBitdefenderServicesData.js';

const bitdefenderTranslations = {
  fr: {
    buttonText: 'ACHETER',
    buyModalTitle: 'Confirmation d\'achat',
    buyMessage: (plan) => `Obtenez un accès à ${plan.title} + ${plan.subtitle} pour ${plan.price} DA / ${plan.duration}.`,
    congratsTitle: 'Félicitations !',
    congratsMessage: (plan) => `Vous avez activé votre forfait ${plan.title} + ${plan.subtitle} avec succès.`,
    creditTitle: 'Information',
    creditMessage: (plan) => `Cher client, votre crédit est insuffisant pour acheter le forfait ${plan.title}. Veuillez recharger votre compte et réessayer.`,
    confirmBtn: 'Confirmer',
    cancelBtn: 'Annuler',
    closeBtn: 'Ok',
    okBtn: 'OK',
    startingFrom: 'À partir de',
    // New intermediate section translations
    completeProtection: 'Protection complète',
    protectionUpTo: 'Protection jusqu\'à 10 appareils',
    chooseOffer: 'Choisissez l\'offre qui vous convient',
    subscriptionPrice: 'Prix de l\'abonnement',
    chooseDevices: 'Choisissez le nombre d\'appareils',
    chooseDuration: 'Choisissez la durée de l\'abonnement',
    chooseBtn: 'Choisir',
    month: 'mois',
    months: 'mois',
    device: 'appareil',
    devices: 'appareils'
  },
  ar: {
    buttonText: 'شراء',
    buyModalTitle: 'تأكيد الشراء',
    buyMessage: (plan) => `احصل على ${plan.titleAr} + ${plan.subtitleAr} مقابل ${plan.price} دج / ${plan.durationAr}.`,
    congratsTitle: 'هنيئًا!',
    congratsMessage: (plan) => `لقد قمت بتفعيل باقة ${plan.titleAr} + ${plan.subtitleAr} بنجاح.`,
    creditTitle: 'معلومات',
    creditMessage: (plan) => `عزيزي العميل، رصيدك غير كافٍ لشراء باقة ${plan.titleAr}. يرجى شحن رصيدك وإعادة المحاولة.`,
    confirmBtn: 'تأكيد',
    cancelBtn: 'إلغاء',
    closeBtn: 'تم',
    okBtn: 'تمً',
    startingFrom: 'ابتداءً من',
    // New intermediate section translations
    completeProtection: 'حماية كاملة',
    protectionUpTo: 'حماية تصل إلى 10 أجهزة',
    chooseOffer: 'إختاروا العرض الذي يناسبكم',
    subscriptionPrice: 'سعر الإشتراك',
    chooseDevices: 'إختاروا عدد الأجهزة',
    chooseDuration: 'إختاروا مدة الإشتراك',
    chooseBtn: 'إختيار',
    month: 'شهر',
    months: 'أشهر',
    device: 'جهاز',
    devices: 'أجهزة'
  }
};

// Configuration for device and duration options
const deviceOptions = [1, 3, 5, 10];
const durationOptions = [
  { value: 1, priceMultiplier: 1 },
  { value: 3, priceMultiplier: 2.8 },
  { value: 6, priceMultiplier: 5.5 },
  { value: 12, priceMultiplier: 10.5 }
];

export default class DigitalBitdefenderServices {
  constructor(container) {
    this.container = container;
    this.currentLang = this.getLang();
    this.currentView = 'main'; // 'main' or 'selection'
    this.selectedPlan = null;

    // Add these lines in your constructor or initialization
this.selectedDevices = 5;  // Default to first option
this.selectedDuration = 1; // Default to first option
    this.init();
  }

  init() {
    this.loadStyles();
    this.render();
    this.bindEvents();
    this.observeTheme();
  }

  loadStyles() {
    if (!document.getElementById('bitdefender-enhanced-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'bitdefender-enhanced-styles';
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
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes modalFadeOut {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to { opacity: 0; transform: scale(0.95) translateY(-10px); }
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
          gap: 1rem;
          padding-top: 1rem;
        }

       
        .bitdefender-button-zone {
          touch-action: manipulation;
          pointer-events: auto;
          z-index: 10;
          position: relative;
        }

        @media (max-width: 640px) {
          .bitdefender-modal-buttons {
            flex-direction: row !important;
            gap: 12px !important;
            justify-content: center;
            align-items: center;
          }
          .bitdefender-modal-button {
            width: auto !important;
            min-width: 120px !important;
            flex: 1;
            max-width: 150px;
          }
        }
      `;
      document.head.appendChild(styleElement);
    }
  }

  getLang() {
    const stored = localStorage.getItem('language');
    return ['fr', 'ar'].includes(stored) ? stored : 'fr';
  }

  bindEvents() {
    
    this.unbindEvents();
    
    
    this.boundHandleLanguageChange = this.handleLanguageChange.bind(this);
    window.addEventListener('languageChanged', this.boundHandleLanguageChange);
    
    
    this.langPoller = setInterval(this.checkLanguageChange.bind(this), 200);
    
    
    this.boundStorageListener = (e) => {
      if (e.key === 'language') {
        this.handleLanguageChange();
      }
    };
    window.addEventListener('storage', this.boundStorageListener);
  }

  unbindEvents() {
    if (this.boundHandleLanguageChange) {
      window.removeEventListener('languageChanged', this.boundHandleLanguageChange);
    }
    if (this.boundStorageListener) {
      window.removeEventListener('storage', this.boundStorageListener);
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
    const mainContainer = this.container.querySelector('[dir]');
    if (mainContainer) {
      mainContainer.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    }
  }

  getIconPath(plan, type = 'icon') {
    const isDark = document.documentElement.classList.contains('dark');
    const iconKey = isDark ? `${type}Dark` : type;
    return plan[iconKey] || plan[type];
  }

  getLogoPath() {
    const isDark = document.documentElement.classList.contains('dark');
    return isDark ? './assets/images/services/Bitdefender/Bitdefender-white.svg' : './assets/images/services/Bitdefender.svg';
  }

  getTranslatedPlan(plan) {
    const isArabic = this.currentLang === 'ar';
    return {
      ...plan,
      title: isArabic ? plan.titleAr || plan.title : plan.title,
      subtitle: isArabic ? plan.subtitleAr || plan.subtitle : plan.subtitle,
      features: isArabic ? plan.featuresAr || plan.features : plan.features,
      duration: isArabic ? plan.durationAr || plan.duration : plan.duration
    };
  }



  createCardHTML(plan, index) {
    const translatedPlan = this.getTranslatedPlan(plan);
    const isArabic = this.currentLang === 'ar';
    const t = bitdefenderTranslations[this.currentLang];
    const textAlign = isArabic ? 'text-right' : 'text-left';
    const fontClass = isArabic ? 'font-noto-kufi-arabic' : 'font-rubik';
    const currencyLabel = isArabic ? 'دج' : 'DA';

    return `
      <div class="relative bg-white dark:bg-[#2C2C2C] rounded-xl flex flex-col w-full max-w-[450px] mx-auto bitdefender-card-shadow dark:border dark:border-[#CDCDCD] bitdefender-hover-lift overflow-hidden">
        <!-- Header with red background -->
        <div class="bg-ooredoo-red rounded-t-xl py-3 text-center">
          <h3 class="${fontClass} text-white font-bold text-lg  tracking-wide leading-tight">
            ${translatedPlan.title}
          </h3>
        </div>
        
        <div class="p-6 bitdefender-card-container h-full">
          <!-- Subtitle and Icon -->
          <div class="flex items-center justify-between mb-4">
            <h4 class="${fontClass} text-ooredoo-red dark:text-white font-bold text-xl flex-1 ${isArabic ? 'ml-3' : 'mr-3'} leading-tight">
              ${translatedPlan.subtitle}
            </h4>
            <img src="${this.getIconPath(plan)}" alt="Device" class="w-20 h-14 object-contain flex-shrink-0 bitdefender-plan-icon" />
          </div>
          
          <!-- Divider -->
          <div class="w-full h-px bitdefender-divider mb-4"></div>
          
          <!-- Protection info -->
          <div class="flex items-center justify-between mb-4">
            <span class="${fontClass} text-black dark:text-white font-normal text-base ${isArabic ? 'ml-3' : 'mr-3'}">
              ${t.completeProtection}
            </span>
            <img src="${this.getIconPath(plan, 'systemsIcon')}" alt="Systems" class="w-28 h-7 object-contain flex-shrink-0 bitdefender-systems-icon" />
          </div>
          
          <!-- Divider -->
          <div class="w-full h-px bitdefender-divider mb-5"></div>
          
          <!-- Content -->
          <div class="bitdefender-card-content flex-1">
            <!-- Features -->
            <div class="flex-1 mb-4">
              <div class="${isArabic ? 'text-right' : 'text-left'}" dir="${isArabic ? 'rtl' : 'ltr'}">
                <ul class="space-y-3">
                  ${translatedPlan.features.map(feature => `
                    <li class="flex items-start gap-2">
                      <img src="./assets/images/checkbox.svg" alt="Check" class="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span class="bitdefender-feature-item flex-1">
                        ${feature}
                      </span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bitdefender-card-footer border-t border-gray-100 dark:border-gray-700 pt-4">
            <!-- Starting from text -->
            <div class="text-center mb-2">
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
                  ${isArabic 
                    ? `${currencyLabel}/${translatedPlan.duration}` 
                    : `${currencyLabel}/${translatedPlan.duration}`
                  }
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
  // Price table based on devices and duration
  const priceTable = {
    5: { 1: 1500, 12: 16500 },
    10: { 1: 2500, 12: 27500 },
    20: { 1: 4500, 12: 49500 }
  };
  
  return priceTable[this.selectedDevices]?.[duration] || 1500;
}
createSelectionHTML() {
  const isArabic = this.currentLang === 'ar';
  const t = bitdefenderTranslations[this.currentLang];
  const fontClass = isArabic ? 'font-noto-kufi-arabic' : 'font-rubik';
  const dirAttribute = isArabic ? 'dir="rtl"' : '';
  const currentPrice = this.calculatePrice(this.selectedPlan.price, this.selectedDuration);
  const currency = isArabic ? 'دج' : 'DA';

  return `
    <div class="w-full bg-gray-50 dark:bg-[#1C1C1C] pt-4 lg:pt-8 pb-[50px] lg:pb-[70px] ${fontClass}" ${dirAttribute}>
      <div class="w-full mx-auto px-2 sm:px-4 flex flex-col items-center">
        
        <!-- Main Container Card -->
        <div class="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[90vw] w-full mx-auto bg-white dark:bg-[#2C2C2C] rounded-xl lg:rounded-2xl shadow-lg overflow-hidden">
          
          <!-- Integrated Header -->
          <div class="rounded-t-xl lg:rounded-t-2xl" style="background-color: #ED1C24;">
            <div class="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 lg:p-6 gap-3 sm:gap-0 ${isArabic ? 'sm:flex-row-reverse' : ''}">
              
              <!-- Left Side: Logo + Separator + Title -->
              <div class="flex items-center ${isArabic ? 'flex-row-reverse' : ''} gap-2 sm:gap-3 lg:gap-4">
                <div class="flex-shrink-0">
                  <img src="${this.getLogoPath()}" alt="Bitdefender" class="h-8 w-16 sm:h-10 sm:w-20 lg:h-[55px] lg:w-[112px] object-contain filter brightness-0 invert" />
                </div>
                
                <!-- Vertical Separator - Hidden on mobile -->
                <div class="hidden sm:block h-8 lg:h-12 w-px bg-white bg-opacity-30"></div>
                
                <div class="text-white ${isArabic ? 'text-right' : 'text-left'} text-center sm:text-left">
                  <h2 class="font-medium text-sm sm:text-lg lg:text-[22px] leading-tight">Small Office Security</h2>
                </div>
              </div>

              <!-- Right Side: Paragraph + Device Image -->
              <div class="flex items-center ${isArabic ? 'flex-row-reverse' : ''} gap-2 sm:gap-3 lg:gap-4">
                <div class="text-white ${isArabic ? 'text-left' : 'text-right'} text-center sm:text-right">
                  <p class="text-white text-opacity-90 text-sm sm:text-lg lg:text-[22px] font-medium lg:font-semibold">
                    ${isArabic ? 'حماية تصل إلى 20 جهاز' : 'Protégez jusqu\'à 20 appareils'}
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
                ${isArabic ? 'اختاروا العرض الذي يناسبكم' : 'CHOISISSEZ L\'OFFRE QUI VOUS CONVIENT'}
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
                    ${isArabic ? 'اختاروا  مدة الاشتراك' : 'Choisissez la durée de l\'abonnement'}
                  </span>
                </div>
                <!-- Options -->
                <div class="flex gap-2 sm:gap-3 lg:gap-4 justify-center py-8 sm:py-12 lg:py-[60px]">
                  <button class="bitdefender-selection-option duration-option transition-all duration-300 font-medium text-xs sm:text-sm lg:text-sm ${
                    this.selectedDuration === 1 
                      ? 'text-white' 
                      : 'text-black hover:bg-gray-200'
                  }" 
                          data-duration="1"
                          style="width: 60px; height: 35px; sm:width: 70px; sm:height: 38px; lg:width: 80px; lg:height: 40px; border-radius: 8px; ${
                            this.selectedDuration === 1 
                              ? 'background-color: #ED1C24;' 
                              : 'background-color: #eee;'
                          }">
                    ${isArabic ? '01 شهر' : '01 mois'}
                  </button>
                  <button class="bitdefender-selection-option duration-option transition-all duration-300 font-medium text-xs sm:text-sm lg:text-sm ${
                    this.selectedDuration === 12 
                      ? 'text-white' 
                      : 'text-black hover:bg-gray-200'
                  }" 
                          data-duration="12"
                          style="width: 60px; height: 35px; sm:width: 70px; sm:height: 38px; lg:width: 80px; lg:height: 40px; border-radius: 8px; ${
                            this.selectedDuration === 12 
                              ? 'background-color: #ED1C24;' 
                              : 'background-color: #eee;'
                          }">
                    ${isArabic ? '12 شهر' : '12 mois'}
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
                    ${isArabic ? 'اختاروا  عدد الأجهزة' : 'Choisissez le nombre d\'appareils'}
                  </span>
                </div>
                <!-- Options -->
                <div class="flex gap-2 sm:gap-3 lg:gap-3 justify-center py-8 sm:py-12 lg:py-[60px]">
                  <button class="bitdefender-selection-option device-option transition-all duration-300 font-medium text-xs sm:text-sm lg:text-sm ${
                    this.selectedDevices === 5 
                      ? 'text-white' 
                      : 'text-black hover:bg-gray-200'
                  }" 
                          data-devices="5"
                          style="width: 45px; height: 35px; sm:width: 50px; sm:height: 38px; lg:width: 60px; lg:height: 40px; border-radius: 8px; ${
                            this.selectedDevices === 5 
                              ? 'background-color: #ED1C24;' 
                              : 'background-color: #eee;'
                          }">
                    05
                  </button>
                  <button class="bitdefender-selection-option device-option transition-all duration-300 font-medium text-xs sm:text-sm lg:text-sm ${
                    this.selectedDevices === 10 
                      ? 'text-white' 
                      : 'text-black hover:bg-gray-200'
                  }" 
                          data-devices="10"
                          style="width: 45px; height: 35px; sm:width: 50px; sm:height: 38px; lg:width: 60px; lg:height: 40px; border-radius: 8px; ${
                            this.selectedDevices === 10 
                              ? 'background-color: #ED1C24;' 
                              : 'background-color: #eee;'
                          }">
                    10
                  </button>
                  <button class="bitdefender-selection-option device-option transition-all duration-300 font-medium text-xs sm:text-sm lg:text-sm ${
                    this.selectedDevices === 20 
                      ? 'text-white' 
                      : 'text-black hover:bg-gray-200'
                  }" 
                          data-devices="20"
                          style="width: 45px; height: 35px; sm:width: 50px; sm:height: 38px; lg:width: 60px; lg:height: 40px; border-radius: 8px; ${
                            this.selectedDevices === 20 
                              ? 'background-color: #ED1C24;' 
                              : 'background-color: #eee;'
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
                    ${isArabic ? 'سعر الاشتراك' : 'Prix de l\'abonnement'}
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
              <button class="bitdefender-cancel-btn ${fontClass} group relative overflow-hidden bg-white max-w-[200px]  dark:bg-[#2C2C2C] border-2 font-medium sm:font-semibold text-sm sm:text-base lg:text-[18px] transition-all duration-300 hover:shadow-lg hover:scale-105 uppercase tracking-wide w-full sm:w-auto"
                      style="color: #ED1C24; border-color: #ED1C24; 
                             width: 100%; height: 42px; 
                             sm:width: 180px; sm:height: 44px;
                             lg:width: 207.11px; lg:height: 47.07px; 
                             border-radius: 25px; lg:border-radius: 28.24px; 
                             padding: 8px 20px; sm:padding: 9px 30px; lg:padding: 9.41px 34.13px;">
                <span class="relative z-10 dark:text-white dark:border-white">${isArabic ? 'الغاء' : 'RETOUR'}</span>
              </button>
              <button class="bitdefender-choose-btn ${fontClass} group relative overflow-hidden max-w-[200px]  text-white border-2 font-medium sm:font-semibold text-sm sm:text-base lg:text-[18px] transition-all duration-300 hover:shadow-xl hover:scale-105 uppercase tracking-wide w-full sm:w-auto"
                      style="background-color: #ED1C24; border-color: #ED1C24; 
                             width: 100%; height: 42px; 
                             sm:width: 180px; sm:height: 44px;
                             lg:width: 207.11px; lg:height: 47.07px; 
                             border-radius: 25px; lg:border-radius: 28.24px; 
                             padding: 8px 20px; sm:padding: 9px 30px; lg:padding: 9.41px 34.13px;">
                <span class="relative z-10">${isArabic ? 'اختيار' : 'CHOISIR'}</span>
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
    if (this.currentView === 'selection') {
      this.container.innerHTML = this.createSelectionHTML();
      this.bindSelectionEvents();
    } else {
      this.renderMainView();
    }
  }

  renderMainView() {
    const isArabic = this.currentLang === 'ar';
    const fontClass = isArabic ? 'font-noto-kufi-arabic' : 'font-rubik';
    const dirAttribute = isArabic ? 'dir="rtl"' : 'dir="ltr"';

    this.container.innerHTML = `
      <div class="w-full bg-white dark:bg-[#2C2C2C] py-16 ${fontClass}" ${dirAttribute}>
        <div class="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div class="flex-shrink-0 flex items-center justify-center lg:min-w-[300px] lg:h-[450px]">
            <img id="bitdefender-logo" src="${this.getLogoPath()}" alt="Bitdefender" class="w-80 h-auto object-contain" />
          </div>
          
          <div class="flex-1 max-w-lg w-full">
            <div class="space-y-6">
              ${bitdefenderPlans.map((plan, index) => this.createCardHTML(plan, index)).join('')}
            </div>
          </div>
        </div>
        
        <div id="bitdefender-modal-hook"></div>
      </div>
    `;

    
    this.bindButtons();
  }

  bindButtons() {
    this.container.querySelectorAll('button[data-plan-index]').forEach(btn => {
      btn.addEventListener('click', this.handlePlanClick.bind(this, btn));
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handlePlanClick(btn);
      }, { passive: false });
    });
  }

  bindSelectionEvents() {
    // Device selection
    this.container.querySelectorAll('.device-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const devices = parseInt(e.currentTarget.dataset.devices);
        this.selectedDevices = devices;
        this.updateSelectionUI();
      });
    });

    // Duration selection
    this.container.querySelectorAll('.duration-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const duration = parseInt(e.currentTarget.dataset.duration);
        this.selectedDuration = duration;
        this.updateSelectionUI();
      });
    });

    // Action buttons
    this.container.querySelector('.bitdefender-cancel-btn')?.addEventListener('click', () => {
      this.currentView = 'main';
      this.render();
    });

    this.container.querySelector('.bitdefender-choose-btn')?.addEventListener('click', () => {
      this.showPurchaseFlow();
    });
  }

 updateSelectionUI() {
  // Update device options
  this.container.querySelectorAll('.device-option').forEach(btn => {
    const devices = parseInt(btn.dataset.devices);
    if (devices === this.selectedDevices) {
      btn.style.backgroundColor = '#ED1C24';
      btn.style.color = 'white';
      btn.classList.add('selected');
    } else {
      btn.style.backgroundColor = '#eee';
      btn.style.color = 'black';
      btn.classList.remove('selected');
    }
  });

  // Update duration options
  this.container.querySelectorAll('.duration-option').forEach(btn => {
    const duration = parseInt(btn.dataset.duration);
    if (duration === this.selectedDuration) {
      btn.style.backgroundColor = '#ED1C24';
      btn.style.color = 'white';
      btn.classList.add('selected');
    } else {
      btn.style.backgroundColor = '#eee';
      btn.style.color = 'black';
      btn.classList.remove('selected');
    }
  });

  const isArabic = this.currentLang === 'ar';
  const currency = isArabic ? 'دج' : 'DA';
  // Update price using the new calculation
  const newPrice = this.calculatePrice(null, this.selectedDuration);
  const priceDisplay = this.container.querySelector('.bitdefender-price-display');

  if (priceDisplay) {
    priceDisplay.textContent = `${newPrice} ${currency}`;
  }
  
  // Also update the price in the HTML if it exists
  const priceContainer = this.container.querySelector('[style*="background-color: #ED1C24"]');
  if (priceContainer && priceContainer.textContent.includes('DA')) {
    priceContainer.textContent = `${newPrice} DA`;
  }
}

handlePlanClick(btn) {
  const planIndex = parseInt(btn.dataset.planIndex);
  const plan = bitdefenderPlans[planIndex];
  
  this.selectedPlan = this.getTranslatedPlan(plan);
  this.selectedDevices = 5;  // Default to 5 devices (first option)
  this.selectedDuration = 1; // Default to 1 month (first option)
  this.currentView = 'selection';
  this.render();
}

  showPurchaseFlow() {
    const t = bitdefenderTranslations[this.currentLang];
    const finalPrice = this.calculatePrice(this.selectedPlan.price, this.selectedDuration);
    const planWithPrice = {
      ...this.selectedPlan,
      price: finalPrice,
      devices: this.selectedDevices,
      duration: this.selectedDuration
    };
    
    this.showModal({
      type: 'confirm',
      title: t.buyModalTitle,
      message: t.buyMessage(planWithPrice),
      isRTL: this.currentLang === 'ar',
      onConfirm: () => {
        
        const hasCredit = Math.random() > 0.5; 
        
        if (!hasCredit) {
          this.showModal({
            type: 'info',
            title: t.creditTitle,
            message: t.creditMessage(planWithPrice),
            isRTL: this.currentLang === 'ar',
            onClose: () => {
              this.showModal({
                type: 'success',
                title: t.congratsTitle,
                message: t.congratsMessage(planWithPrice),
                isRTL: this.currentLang === 'ar',
                onClose: () => {
                  this.currentView = 'main';
                  this.render();
                }
              });
            }
          });
        } else {
          this.showModal({
            type: 'success',
            title: t.congratsTitle,
            message: t.congratsMessage(planWithPrice),
            isRTL: this.currentLang === 'ar',
            onClose: () => {
              this.currentView = 'main';
              this.render();
            }
          });
        }
      }
    });
  }

  showModal({ type, title, message, isRTL = false, onConfirm, onClose }) {
    const modalContainer = this.container.querySelector('#bitdefender-modal-hook');
    const modalHTML = this.createModalHTML({ type, title, message, isRTL });
    
    modalContainer.innerHTML = modalHTML;
    this.setupModalEvents({ type, onConfirm, onClose, modalContainer });
  }

  createModalHTML({ type, title, message, isRTL }) {
    const dirAttribute = isRTL ? 'dir="rtl"' : 'dir="ltr"';
    const closeButtonPosition = isRTL ? 'left-4' : 'right-4';
    const buttons = this.getModalButtons(type, isRTL);
    const fontClass = isRTL ? 'font-noto-kufi-arabic' : 'font-rubik';

    return `
      <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bitdefender-modal-fade" 
           style="background-color: rgba(105, 105, 105, 0.8);" 
           role="dialog" 
           aria-modal="true" 
           aria-labelledby="modal-title">
        <div class="relative bg-white dark:bg-[#2C2C2C] dark:border dark:border-[#CDCDCD] rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl min- px-6 md:px-8 pt-16 pb-8 md:pb-12" ${dirAttribute}>
          <button class="absolute top-4 ${closeButtonPosition} p-2 z-10 rounded-full transition-all duration-200 bitdefender-modal-close" 
                  aria-label="${isRTL ? 'تم' : 'Fermer'}">
            <img src="./assets/images/Close.svg" alt="close" class="w-6 h-6 block"/>
          </button>

          <div class="text-center mb-6">
            <h2 id="modal-title" class="${fontClass} font-semibold text-ooredoo-red text-2xl md:text-3xl leading-tight uppercase tracking-tight">
              ${title}
            </h2>
          </div>

          <div class="text-center mb-10">
            <p class="${fontClass} text-black dark:text-white leading-relaxed text-base md:text-lg px-2">
              ${message}
            </p>
          </div>

          <div class="flex justify-center bitdefender-modal-buttons">
            ${buttons}
          </div>
        </div>
      </div>
    `;
  }

  getModalButtons(type, isRTL) {
    const t = bitdefenderTranslations[this.currentLang];
    const fontClass = isRTL ? 'font-noto-kufi-arabic' : 'font-rubik';
    
    const primaryBtn = `${fontClass} font-semibold text-base uppercase forfait-modal-button w-40 h-12 rounded-full border-none cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-ooredoo-red text-white shadow-lg`;
    const secondaryBtn = `${fontClass} font-semibold text-base uppercase forfait-modal-button w-40 h-12 rounded-full cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-white text-ooredoo-red border-2 border-ooredoo-red shadow-md dark:bg-[#2C2C2C] dark:text-white dark:border-white`;
    const buttonGap = 'gap-4 flex-wrap sm:flex-nowrap';

    switch (type) {
      case 'confirm':
        return `
          <div class="flex ${buttonGap}">
            <button class="${secondaryBtn}" data-action="cancel">
              ${t.cancelBtn}
            </button>
            <button class="${primaryBtn}" data-action="confirm">
              ${t.confirmBtn}
            </button>
          </div>
        `;
      case 'success':
        return `
          <div class="flex ${buttonGap}">
            <button class="${secondaryBtn}" data-action="close">
              ${t.closeBtn}
            </button>
          </div>
        `;
      case 'info':
        return `
          <div class="flex ${buttonGap}">
            <button class="${primaryBtn}" data-action="close">
              ${t.okBtn}
            </button>
          </div>
        `;
      default:
        return `
          <div class="flex ${buttonGap}">
            <button class="${secondaryBtn}" data-action="close">
              ${t.closeBtn}
            </button>
          </div>
        `;
    }
  }

  setupModalEvents({ type, onConfirm, onClose, modalContainer }) {
    const modal = modalContainer.querySelector('.bitdefender-modal-fade');
    const closeButton = modal.querySelector('.bitdefender-modal-close');
    const actionButtons = modal.querySelectorAll('[data-action]');

    const closeModal = () => {
      modal.style.animation = 'modalFadeOut 0.2s ease-in forwards';
      setTimeout(() => {
        modalContainer.innerHTML = '';
      }, 200);
    };

    closeButton.addEventListener('click', closeModal);

    actionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        closeModal();

        setTimeout(() => {
          switch (action) {
            case 'confirm':
              if (onConfirm) onConfirm();
              break;
            case 'close':
              if (onClose) onClose();
              break;
          }
        }, 200);
      });
    });

    
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    
    const escapeHandler = (event) => {
      if (event.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);

    
    setTimeout(() => {
      const firstButton = modal.querySelector('[data-action]');
      if (firstButton) {
        firstButton.focus();
      }
    }, 100);
  }

  observeTheme() {
    const observer = new MutationObserver(this.updateThemeElements.bind(this));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  updateThemeElements() {
    const logo = document.getElementById('bitdefender-logo');
    if (logo) {
      logo.src = this.getLogoPath();
    }

    document.querySelectorAll('.bitdefender-plan-icon').forEach((img, index) => {
      if (index < bitdefenderPlans.length) {
        img.src = this.getIconPath(bitdefenderPlans[index]);
      }
    });

    document.querySelectorAll('.bitdefender-systems-icon').forEach((img, index) => {
      if (index < bitdefenderPlans.length) {
        img.src = this.getIconPath(bitdefenderPlans[index], 'systemsIcon');
      }
    });
  }

  destroy() {
    this.unbindEvents();
    
    const styles = document.getElementById('bitdefender-enhanced-styles');
    if (styles) {
      styles.remove();
    }
  }
}