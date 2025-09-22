export const generateHeaderHTML = (language = "fr", userData = {}, theme = "light") => {
  const helpText = language === "ar" ? "مساعدة" : "Aide";
  const currentLanguage = language === "ar" ? "العربية" : "Français";
  const chargeText = language === "ar" ? "تعبئة رصيدي" : "CHARGER";
  const themeText = language === "ar" ? " تغيير الوضع" : "Changer de mode";
  const fontClass = language === "ar" ? "font-noto-kufi-arabic" : "font-rubik";

  const getOfferText = (offer) => {
    if (language === "ar") {
      if (offer === "Offre VOX") return "عرض VOX";
      if (offer === "Offre Dima") return "عرض Dima";
      if (offer.startsWith("Offre ")) {
        return offer.replace("Offre ", "عرض ");
      }
      return offer;
    }
    return offer;
  };

  const mactiviaText = "M'activia";
  const creditText = language === "ar" ? "<span class='font-noto-kufi-arabic'>الرصيد</span>" : "Credit";

  // Helper to detect Arabic chars
  const containsArabic = (text) => {
    if (!text) return false;
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicPattern.test(text);
  };

  // Split mixed Arabic-French text into segments with font classes
  const parseMixedText = (text) => {
    if (!text) return [];
    const parts = [];
    let currentPart = "";
    let isArabic = containsArabic(text[0]);

    for (let char of text) {
      const charIsArabic = containsArabic(char);
      if (charIsArabic === isArabic) {
        currentPart += char;
      } else {
        parts.push({ text: currentPart, isArabic });
        currentPart = char;
        isArabic = charIsArabic;
      }
    }
    if (currentPart) parts.push({ text: currentPart, isArabic });
    return parts;
  };

  // Render with font spans
  const formatMixedText = (text) => {
    const segments = parseMixedText(text);
    return segments.map((seg) => `<span class="${seg.isArabic ? "font-noto-kufi-arabic" : "font-rubik"}">${seg.text}</span>`).join("");
  };

  // Format user data with mixed text support
  const phoneHTML = formatMixedText(userData.phone || "");
  const companyHTML = formatMixedText(userData.compayName || "");
  const offerHTML = formatMixedText(getOfferText(userData.offer || "Offre Dima"));
  // Add this helper function at the top with other helpers
  const formatCredit = (credit, language) => {
    const creditValue = credit || "1200";
    const currency = language === "ar" ? "دج" : "DA";
    // Remove existing DA or دج if present
    const cleanCredit = creditValue.replace(/\s*(DA|دج)\s*$/i, "");
    return `<span class="font-rubik">${cleanCredit}</span> ${currency}`;
  };
  return `
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500&family=Noto+Kufi+Arabic&display=swap" rel="stylesheet" />
  <style>
    .font-noto-kufi-arabic { font-family: 'Noto Kufi Arabic', sans-serif; }
    .font-rubik { font-family: 'Rubik', sans-serif; }
  </style>

  <header class="bg-white dark:bg-[#171717] border-b border-gray-200 dark:border-gray-700 w-full transition-all duration-300 ease-in-out" dir="${
    language === "ar" ? "rtl" : "ltr"
  }">
    <div class="w-full max-w-[90vw] mx-auto">
      <div class="flex items-center justify-between h-16 md:h-20">
        <div class="flex items-center gap-[8px] lg:gap-[25px] flex-shrink-0">
          <div class="w-[120px] h-[30px] md:w-[140px] md:h-[36px] lg:w-[180px] lg:h-[56px] flex items-center justify-center relative ${
            language === "ar" ? "" : ""
          }">
            <img src="./assets/images/header/Ooredoo.svg" alt="Ooredoo" class="absolute inset-0 w-full h-full object-contain dark:hidden transition-opacity duration-300" />
            <img src="./assets/images/header/Ooredoo-white.svg" alt="Ooredoo" class="absolute inset-0 w-full h-full object-contain hidden dark:inline transition-opacity duration-300" />
          </div>
<span class="inline-block w-[0.5px] h-4 md:h-8 bg-black dark:bg-white transition-colors duration-300"></span>
          <div class="w-[56px] h-[24px] md:w-[100px] md:h-[29px] lg:w-[120px] lg:h-[40px] flex items-center justify-center relative">
            <img src="./assets/images/header/Choof.svg" alt="Choof" class="absolute inset-0 w-full h-full object-contain dark:hidden transition-opacity duration-300" />
            <img src="./assets/images/header/Choof-white.svg" alt="Choof" class="absolute inset-0 w-full h-full object-contain hidden dark:inline transition-opacity duration-300" />
          </div>
        </div>
        <div class="hidden md:flex items-center flex-shrink-0">
          <div id="theme-switcher" class="relative w-[102px] lg:w-[144px] h-[40px] lg:h-[48px] rounded-full bg-[#E4E4E7] overflow-hidden transition-all duration-500">
            <button id="moon-btn" class="absolute left-0 top-0 w-[60px] lg:w-[72px] h-[40px] lg:h-[48px] rounded-full bg-[#171717] dark:bg-[#2A2A2A] flex items-center justify-center transition-all duration-500 z-10 hover:scale-105">
              <img src="./assets/images/header/moon-white.svg" alt="Moon" class="w-5 h-5 lg:w-7 lg:h-7 transition-all duration-300" />
            </button>
            <button id="sun-btn" class="absolute right-0 top-0 w-[60px] lg:w-[72px] h-[40px] lg:h-[48px] rounded-full flex items-center justify-center transition-all duration-500 hover:scale-105">
              <img src="./assets/images/header/sun.svg" alt="Sun" class="w-5 h-5 lg:w-7 lg:h-7 transition-all duration-300" />
            </button>
          </div>
          <a href="https://www.ooredoo.dz/fr/particuliers/contactez-nous" target="_blank" class="flex items-center h-[40px] lg:h-[48px] px-4 lg:px-6 text-dark-text dark:text-white rounded-lg transition-all duration-300">
            <span id="help-text" class="${language === "ar" ? "font-noto-kufi-arabic" : "font-rubik"} text-sm lg:text-base mx-2">${helpText}</span>
            <img src="./assets/images/header/help.svg" class="w-4 h-4 lg:w-5 lg:h-5 mr-2 dark:hidden transition-opacity duration-300" />
            <img src="./assets/images/header/help-white.svg" class="w-4 h-4 lg:w-5 lg:h-5 mr-2 hidden dark:inline transition-opacity duration-300" />
          </a>
          <div class="relative h-[40px] lg:h-[48px]" id="language-desktop">
            <button class="flex items-center h-full px-4 lg:px-6 rounded-[40px] bg-white border border-[#E4E4E7] hover:bg-gray-50 transition-all duration-300 text-black">
              <span id="current-language" class="${
                language === "ar" ? "font-noto-kufi-arabic" : "font-rubik"
              } text-sm lg:text-base font-medium">${currentLanguage}</span>
              <img src="./assets/images/header/chevron-down.svg" class="w-3 h-3 lg:w-4 lg:h-4 ml-2 transition-all duration-300" />
            </button>
            <div class="language-dropdown-menu hidden absolute right-0 mt-2 w-full min-w-[120px] bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden transition-all duration-300">
              <a href="#" class="language-option block px-4 lg:px-6 py-3 hover:bg-gray-100 text-black transition-all duration-300 ${
                language === "fr" ? "font-semibold text-ooredoo-red" : ""
              }">Français</a>
              <a href="#" class="font-noto-kufi-arabic language-option block px-4 lg:px-6 py-3 hover:bg-gray-100 text-black transition-all duration-300 ${
                language === "ar" ? "font-semibold text-ooredoo-red" : ""
              }">العربية</a>
            </div>
          </div>
        </div>
        <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg transition-all duration-300 flex-shrink-0">
          <img src="./assets/images/header/Menu.svg" class="w-6 h-6 dark:hidden block transition-all duration-300" id="mobile-menu-icon" />
          <img src="./assets/images/header/Menu-white.svg" class="w-6 h-6 hidden dark:inline transition-all duration-300" id="mobile-menu-icon-dark" />
          <img src="./assets/images/header/close.svg" class="w-6 h-6 hidden transition-all duration-300 dark:hidden" id="mobile-menu-close-icon" />
          <!-- Use only Menu-white.svg for both open/close states in dark mode -->
        </button>
      </div>

      <div id="mobile-menu" class="absolute top-[64px] left-0 w-full shadow-lg bg-white dark:bg-[#171717] md:hidden pb-6 border-b border-gray-200 dark:border-gray-700 hidden z-50 transition-all duration-300 ease-in-out">
        <div class="flex flex-col space-y-4 pt-4 px-4">
          <div class="flex items-center gap-3 py-2 rounded-lg transition-all duration-300">
            <button id="theme-mobile-switcher" class="flex  gap-3 px-2   items-center w-full text-black dark:text-white">
              <img src="./assets/images/header/moon-white.svg" class="w-5 h-5 hidden dark:inline transition-opacity duration-300" id="mobile-moon-icon" />
              <img src="./assets/images/header/sun.svg" class="w-5 h-5 dark:hidden transition-opacity duration-300" id="mobile-moon-icon" />
              <span class="${fontClass}  text-sm">${themeText}</span>
            </button>
          </div>
          <div class="flex items-center gap-3 py-2 rounded-lg px-2 transition-all duration-300">
            <img src="./assets/images/header/help.svg" class="w-5 h-5 dark:hidden transition-opacity duration-300" />
            <img src="./assets/images/header/help-white.svg" class="w-5 h-5 hidden dark:inline transition-opacity duration-300" />
            <span id="help-text-mobile" class="${language === "ar" ? "font-noto-kufi-arabic" : "font-rubik"} text-sm text-black dark:text-white">
              <a href="https://www.ooredoo.dz/fr/particuliers/contactez-nous" target="_blank">${helpText}</a>
            </span>
          </div>
          <div class="flex items-center gap-3 py-2 rounded-lg px-2 transition-all duration-300">
            <img src="./assets/images/header/language.svg" class="w-5 h-5 hidden dark:hidden transition-opacity duration-300" />
            <!-- Removed language icon for dark mode -->
            <div class="flex gap-5">
              <button class="language-option py-1 rounded-lg text-sm transition-all duration-300 text-black dark:text-white ${
                language === "fr" ? "font-semibold text-ooredoo-red" : ""
              }">Français</button>
              <button class="font-noto-kufi-arabic language-option py-1 rounded-lg text-sm transition-all duration-300 text-black dark:text-white ${
                language === "ar" ? "font-semibold text-ooredoo-red" : ""
              }">العربية</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-ooredoo-red text-white w-full transition-all duration-300">
      <div class="w-full max-w-[90vw] mx-auto">
        <div class="hidden md:block py-4 lg:py-6">
          <div class="flex items-center justify-between gap-4 lg:gap-6 w-full">
            <div class="flex-1 flex items-center gap-4 lg:gap-6 xl:gap-8 min-w-0">
              <div class="flex items-center gap-2 flex-shrink-0">
                <img src="./assets/images/header/Telephone.svg" class="w-5 h-5 flex-shrink-0" />
                <span class="font-medium text-[clamp(14px,2.5vw,18px)] leading-[1.7] tracking-[0.02em] text-white whitespace-nowrap">${
                  phoneHTML || "0509876543"
                }</span>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0 min-w-0">
                <img src="./assets/images/header/Company.svg" class="w-5 h-5 flex-shrink-0" />
                <span class="font-medium font-rubik text-[clamp(14px,2.5vw,18px)] leading-[1.7] tracking-[0.02em] text-white truncate">${
                  (language === "ar" ? "<span class='font-noto-kufi-arabic'> عرض</span> " : "Offer ") + offerHTML
                }</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-white">${language === 'ar' ? "<span class='font-noto-kufi-arabic'>الوضع :</span>" : "<span class='font-rubik'>Mode :</span>"}</span>
                <div class="${language === 'ar' && "flex-row-reverse"} relative flex items-center bg-white rounded-full h-[32px] w-[160px] p-0.5">
                  <button 
                    id="mactivia-btn"
                    class="flex-1 flex items-center justify-center rounded-full h-[28px] text-sm font-medium transition-all duration-300 bg-ooredoo-red text-white">
                    ${mactiviaText}
                  </button>
                  <button 
                    id="credit-btn"
                    class="${language === 'ar' ? 'font-noto-kufi-arabic' : 'font-rubik'} flex-1 flex items-center justify-center rounded-full h-[28px] text-sm font-medium transition-all duration-300 bg-white text-black">
                    ${creditText}
                  </button>
                </div>
                <span class="relative group">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none" class="cursor-pointer">
    <g clip-path="url(#clip0_598_43525)">
      <path d="M3.75977 12C3.75977 13.1819 3.99256 14.3522 4.44485 15.4442C4.89714 16.5361 5.56008 17.5282 6.3958 18.364C7.23153 19.1997 8.22368 19.8626 9.31561 20.3149C10.4075 20.7672 11.5779 21 12.7598 21C13.9417 21 15.112 20.7672 16.2039 20.3149C17.2958 19.8626 18.288 19.1997 19.1237 18.364C19.9595 17.5282 20.6224 16.5361 21.0747 15.4442C21.527 14.3522 21.7598 13.1819 21.7598 12C21.7598 9.61305 20.8116 7.32387 19.1237 5.63604C17.4359 3.94821 15.1467 3 12.7598 3C10.3728 3 8.08363 3.94821 6.3958 5.63604C4.70798 7.32387 3.75977 9.61305 3.75977 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12.7598 8V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12.7598 16H12.7698" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_598_43525">
        <rect width="24" height="24" fill="white" transform="translate(0.759766)"/>
      </clipPath>
    </defs>
  </svg>

  <!-- Tooltip -->
  <span class="${language === 'ar' ? "font-noto-kufi-arabic" : "font-rubik"} absolute top-full bg-white text-black text-xs px-[14px] leading-loose rounded-b-[15px] rounded-tl-[15px] rounded-tr-[4px] py-5 opacity-0 z-auto group-hover:opacity-100 transition-opacity duration-200 w-[344px]">
    ${language === 'ar' ? 
      userData.mode === 'mactivia' ? "أنت حاليا في الوضع \"M'Activia\"، الذي يمكّنك من الحصول على اشتراك Gold مفعّل عند كل تعبئة بقيمة 1000 دج وأكثر." : "أنت حاليا في الوضع \"رصيد\"، الذي يمكّنك من الحصول على رصيد غير مفعّل عند كل تعبئة بقيمة 1000 دج وأكثر." : 
      userData.mode === 'mactivia' ? "Vous êtes actuellement sur le mode \"M'Activia\", qui vous permet de recevoir un forfait Gold Activé à chaque rechargement de 1000 DA et plus." : 
      "Vous êtes actuellement sur le mode \"Crédit\", qui vous permet de recevoir du crédit non activé à chaque rechargement de 1000 DA et plus."
    }
  </span>
</span>

              </div>
            </div>
            <div class="flex items-center justify-end gap-3 lg:gap-4 flex-shrink-0">
              <div class="flex items-center gap-2">
                <img src="./assets/images/header/Dollar.svg" class="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
             <span class="${
    language === "ar" ? "font-noto-kufi-arabic" : "font-rubik"
  } font-medium text-[clamp(20px,4vw,24px)] leading-[1.7] tracking-[0.02em] text-white">
  ${formatCredit(userData.credit, language)}
</span>
              </div>
            </div>
          </div>
        </div>

        <div class="md:hidden py-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <img src="./assets/images/header/Telephone.svg" class="w-5 h-5 flex-shrink-0" />
              <span class="font-medium text-[clamp(14px,2.5vw,18px)] leading-[1.7] tracking-[0.02em] text-white md:text-lg text-sm">${
                phoneHTML || "0509876543"
              }</span>
            </div>
            <div class="flex items-center gap-2">
              <img src="./assets/images/header/Dollar.svg" class="w-5 h-5 flex-shrink-0" />
              <span class="font-medium text-[clamp(20px,4vw,24px)] leading-[1.7] tracking-[0.02em] text-white text-sm md:text-lg ${fontClass}">${formatCredit(
                userData.credit,
                language
                )}
              </span>
            </div>

            
          </div>
          <div class="flex items-center gap-2 mb-4">
            <img src="./assets/images/header/Company.svg" class="w-5 h-5 flex-shrink-0" />
            <span class="font-medium font-rubik text-[clamp(14px,2.5vw,18px)] leading-[1.7] tracking-[0.02em] text-white truncate">${
                  (language === "ar" ? "<span class='font-noto-kufi-arabic'> عرض</span> " : "Offer ") + offerHTML
                }</span>
          </div>
          <div class="flex items-center gap-2 mb-4">
                <span class="text-white">${language === 'ar' ? "<span class='font-noto-kufi-arabic'>الوضع :</span>" : "<span class='font-rubik'>Mode :</span>"}</span>
                <div class="${language === 'ar' && "flex-row-reverse"} relative flex items-center bg-white rounded-full h-[32px] w-[160px] p-0.5">
                  <button 
                    id="mactivia-btn"
                    class="flex-1 flex items-center justify-center rounded-full h-[28px] text-sm font-medium transition-all duration-300 bg-ooredoo-red text-white">
                    ${mactiviaText}
                  </button>
                  <button 
                    id="credit-btn"
                    class="${language === 'ar' ? 'font-noto-kufi-arabic' : 'font-rubik'} flex-1 flex items-center justify-center rounded-full h-[28px] text-sm font-medium transition-all duration-300 bg-white text-black">
                    ${creditText}
                  </button>
                </div>
                <span class="relative group">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none" class="cursor-pointer">
    <g clip-path="url(#clip0_598_43525)">
      <path d="M3.75977 12C3.75977 13.1819 3.99256 14.3522 4.44485 15.4442C4.89714 16.5361 5.56008 17.5282 6.3958 18.364C7.23153 19.1997 8.22368 19.8626 9.31561 20.3149C10.4075 20.7672 11.5779 21 12.7598 21C13.9417 21 15.112 20.7672 16.2039 20.3149C17.2958 19.8626 18.288 19.1997 19.1237 18.364C19.9595 17.5282 20.6224 16.5361 21.0747 15.4442C21.527 14.3522 21.7598 13.1819 21.7598 12C21.7598 9.61305 20.8116 7.32387 19.1237 5.63604C17.4359 3.94821 15.1467 3 12.7598 3C10.3728 3 8.08363 3.94821 6.3958 5.63604C4.70798 7.32387 3.75977 9.61305 3.75977 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12.7598 8V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12.7598 16H12.7698" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_598_43525">
        <rect width="24" height="24" fill="white" transform="translate(0.759766)"/>
      </clipPath>
    </defs>
  </svg>

  <!-- Tooltip -->
  <span class="${language === 'ar' ? "font-noto-kufi-arabic" : "font-rubik"} absolute top-full bg-white text-black text-xs px-[14px] leading-loose rounded-b-[15px] rounded-tl-[15px] rounded-tr-[4px] py-5 opacity-0 z-auto group-hover:opacity-100 transition-opacity duration-200 w-[344px]">
    ${language === 'ar' ? 
      userData.mode === 'mactivia' ? "أنت حاليا في الوضع \"M'Activia\"، الذي يمكّنك من الحصول على اشتراك Gold مفعّل عند كل تعبئة بقيمة 1000 دج وأكثر." : "أنت حاليا في الوضع \"رصيد\"، الذي يمكّنك من الحصول على رصيد غير مفعّل عند كل تعبئة بقيمة 1000 دج وأكثر." : 
      userData.mode === 'mactivia' ? "Vous êtes actuellement sur le mode \"M'Activia\", qui vous permet de recevoir un forfait Gold Activé à chaque rechargement de 1000 DA et plus." : 
      "Vous êtes actuellement sur le mode \"Crédit\", qui vous permet de recevoir du crédit non activé à chaque rechargement de 1000 DA et plus."
    }
  </span>
</span>

              </div>
          <div class="flex items-center justify-end gap-3">
            <a href='https://estorm.ooredoo.dz/e-payment/payment/public/?lang=${language}' class="bg-white text-ooredoo-red  rounded-full px-6 py-2.5 flex items-center gap-2 hover:bg-red-50 transition-all duration-300 transform hover:scale-105 flex-shrink-0">
              <span class="${
                language === "ar" ? "font-noto-kufi-arabic" : "font-rubik"
              } font-medium text-ooredoo-red text-xs uppercase tracking-[0.02em]   "> ${chargeText} </span>
              <img src="./assets/images/consommation/baridi.svg" class="w-4 h-4 flex-shrink-0" />
              <img src="./assets/images/consommation/poste.svg" class="w-4 h-4 flex-shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
  `;
};
