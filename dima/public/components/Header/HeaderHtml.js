export const generateHeaderHTML = (
  language = "fr",
  userData = {},
  theme = "light"
) => {
  const isAuto = userData.autoRenewal;
  const helpText = language === "ar" ? "مساعدة" : "Aide";
  const currentLanguage = language === "ar" ? "العربية" : "Français";
  const renewalLabel = language === "ar" ? "طريقة التجديد" : "Renouvellement :";

  const getOfferDetails = (offer) => {
    if (!offer || typeof offer !== "string")
      return { name: "Dima", price: "XXXX" };
    const parts = offer.split(" ");
    if (parts.length < 2) return { name: offer, price: "XXXX" };
    const price = parts[parts.length - 1];
    const name = parts.slice(1).join(" ");
    return { name, price };
  };

  const offerDetails = getOfferDetails(userData.offer);

  const infoCardDesc = isAuto
    ? `Vous êtes actuellement sur le mode "Renouvellement Automatique" de ${offerDetails.name}. Vos rechargements de ${offerDetails.price} DA et plus vous donneront les avantages de ${offerDetails.name}. Si vous souhaitez recevoir du crédit au prochain rechargement ou changer de forfait, cliquez sur la flèche.`
    : `Votre renouvellement automatique est désactivé, vous receverez du crédit au prochain rechargements.`;

  const commonTextStyle = `
    font-family: 'Rubik', sans-serif;
    font-weight: 500;
    font-style: normal;
    font-size: 18px;
    line-height: 170%;
    letter-spacing: 0.02em;
    text-transform: capitalize;
  `;

  const priceHeader = `
    font-family: Rubik;
    font-weight: 500;
    font-style: Medium;
    font-size: 24px;
    line-height: 170%;
    letter-spacing: 2%;
  `;

  const infoCardDescStyle = `
    font-family: 'Rubik', sans-serif;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: justify;
    color: #575757;
  `;

  const getOfferText = (offer) => {
    if (language === "ar") {
      if (offer === "Offre VOX") return "عرض VOX";
      if (offer === "Offre Dima") return "عرض Dima";
      if (offer && offer.startsWith && offer.startsWith("Offre ")) {
        return offer.replace("Offre ", "عرض ");
      }
      return offer;
    }
    return offer;
  };

  const containsArabic = (text) => {
    if (!text) return false;
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicPattern.test(text);
  };

  const parseMixedText = (text) => {
    if (!text) return [];
    const parts = [];
    let currentPart = "";
    if (text.length === 0) return parts;
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

  const formatMixedText = (text) => {
    const segments = parseMixedText(text);
    return segments
      .map(
        (seg) =>
          `<span class="${
            seg.isArabic ? "font-noto-kufi-arabic" : "font-rubik"
          }">${seg.text}</span>`
      )
      .join("");
  };

  const offerHTML = formatMixedText(
    getOfferText(userData.offer || "Offre Dima")
  );

  return `
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500&family=DM+Sans:wght@600&display=swap" rel="stylesheet">
<style>
  .font-noto-kufi-arabic { font-family: 'Noto Kufi Arabic', sans-serif; }
  .font-rubik { font-family: 'Rubik', sans-serif; }
  .bg-ooredoo-red { background-color: #E30613; }
  .text-ooredoo-red { color: #E30613; }

  @keyframes modalFadeIn {
    from { opacity: 0; transform: scale(0.95) translateY(-8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes modalFadeOut {
    from { opacity: 1; transform: scale(1) translateY(0); }
    to { opacity: 0; transform: scale(0.95) translateY(-10px); }
  }
  .modal-animating-in {
    animation: modalFadeIn 0.3s ease-out forwards;
  }
  .modal-animating-out {
    animation: modalFadeOut 0.3s ease-in forwards;
  }
</style>

<header class="bg-white dark:bg-[#171717] border-b border-gray-200 dark:border-gray-700 z-30 relative w-full">
  <div class="w-[95vw] mx-auto px-4">
    <div class="flex items-center justify-between h-16 md:h-20">
      <div class="flex items-center space-x-3">
        <div class="w-[140px] h-[36px] md:w-[180px] md:h-[56px] flex items-center justify-center relative">
          <img src="./assets/images/header/Ooredoo.svg" alt="Ooredoo" class="absolute inset-0 w-full h-full object-contain dark:hidden" />
          <img src="./assets/images/header/Ooredoo-white.svg" alt="Ooredoo" class="absolute inset-0 w-full h-full object-contain hidden dark:inline" />
        </div>
        <span class="text-3xl font-light hidden md:block text-black dark:text-white">|</span>
        <div class="w-[100px] h-[29px] md:w-[120px] md:h-[40px] flex items-center justify-center relative">
          <img src="./assets/images/header/Choof.svg" alt="Choof" class="absolute inset-0 w-full h-full object-contain dark:hidden" />
          <img src="./assets/images/header/Choof-white.svg" alt="Choof" class="absolute inset-0 w-full h-full object-contain hidden dark:inline" />
        </div>
      </div>
      
      <div class="hidden md:flex items-center space-x-4">
        <div id="theme-switcher" class="relative w-[144px] h-[48px] rounded-full bg-gray-200 dark:bg-ooredoo-red overflow-hidden transition-all duration-500">
          <button id="moon-btn" class="absolute left-0 top-0 w-[72px] h-[48px] rounded-full bg-[#171717] dark:bg-white flex items-center justify-center transition-all duration-500 z-10">
            <img src="./assets/images/header/moon-white.svg" alt="Moon" class="w-7 h-7 dark:hidden" />
            <img src="./assets/images/header/moon.svg" alt="Moon" class="w-7 h-7 hidden dark:block" />
          </button>
          <button id="sun-btn" class="absolute right-0 top-0 w-[72px] h-[48px] rounded-full bg-[#E4E4E7] dark:bg-ooredoo-red flex items-center justify-center transition-all duration-500">
            <img src="./assets/images/header/sun.svg" alt="Sun" class="w-7 h-7 dark:hidden" />
            <img src="./assets/images/header/sun-white.svg" alt="Sun" class="w-7 h-7 hidden dark:block" />
          </button>
        </div>
        
        <a href="https://www.ooredoo.dz/fr/particuliers/contactez-nous" target="_blank" class="flex items-center h-[40px] lg:h-[48px] px-4 lg:px-6 text-dark-text dark:text-white rounded-lg transition-all duration-300">
            <span id="help-text" class="${
              language === "ar" ? "font-noto-kufi-arabic" : "font-rubik"
            } text-sm lg:text-base mx-2">${helpText}</span>
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
      
      <button id="mobile-menu-btn" class="md:hidden p-2">
        <img src="./assets/images/header/Menu.svg" class="w-6 h-6 dark:hidden block" id="mobile-menu-icon" />
        <img src="./assets/images/header/Menu-white.svg" class="w-6 h-6 hidden dark:inline" id="mobile-menu-icon-dark" />
        <img src="./assets/images/header/close.svg" class="w-6 h-6 hidden" id="mobile-menu-close-icon" />
        <img src="./assets/images/header/close-white.svg" class="w-6 h-6 hidden" id="mobile-menu-close-icon-dark" />
      </button>
    </div>
    
    <div id="mobile-menu" class="absolute top-[64px] left-0 w-full shadow-lg bg-white dark:bg-[#171717] md:hidden pb-6 border-b border-gray-200 dark:border-gray-700 hidden z-40">
      <div class="flex flex-col space-y-4 pt-4 px-4">
        <div class="flex items-center gap-3 py-2">
          <button id="theme-mobile-switcher" class="flex items-center w-full">
            <img src="./assets/images/header/sun.svg" class="w-5 h-5 dark:hidden" id="mobile-sun-icon" />
            <img src="./assets/images/header/sun-white.svg" class="w-5 h-5 hidden dark:inline" id="mobile-sun-icon-dark" />
            <img src="./assets/images/header/moon-white.svg" class="w-5 h-5 hidden dark:hidden" id="mobile-moon-icon" />
            <img src="./assets/images/header/moon.svg" class="w-5 h-5 hidden dark:inline" id="mobile-moon-icon-dark" />
            <span class="ml-2">Changer de mode</span>
          </button>
        </div>
        
        <div class="flex items-center gap-3 py-2 rounded-lg px-2 transition-all duration-300">
            <img src="./assets/images/header/help.svg" class="w-5 h-5 dark:hidden transition-opacity duration-300" />
            <img src="./assets/images/header/help-white.svg" class="w-5 h-5 hidden dark:inline transition-opacity duration-300" />
            <span id="help-text-mobile" class="${
              language === "ar" ? "font-noto-kufi-arabic" : "font-rubik"
            } text-sm text-black dark:text-white">
              <a href="https://www.ooredoo.dz/fr/particuliers/contactez-nous" target="_blank">${helpText}</a>
            </span>
        </div>
        
        <div class="flex items-center gap-3 py-2">
          <img src="./assets/images/header/language.svg" class="w-5 h-5 dark:hidden" />
          <img src="./assets/images/header/language-white.svg" class="w-5 h-5 hidden dark:inline" />
          <div class="flex gap-2">
            <button type="button" class="language-option px-3 py-1 rounded-lg ${
              language === "fr" ? "font-semibold text-ooredoo-red" : ""
            }" data-lang="fr">Français</button>
            <button type="button" class="language-option px-3 py-1 rounded-lg ${
              language === "ar" ? "font-semibold text-ooredoo-red" : ""
            } font-noto-kufi-arabic" data-lang="ar">العربية</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="bg-ooredoo-red py-4 text-white w-full">
    <div class="px-4 w-[95vw] mx-auto">
      <div class="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
        <div class="flex-1 flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
          <div class="flex items-center gap-2">
            <img src="./assets/images/header/Telephone.svg" class="w-6 h-6" />
            <span style="${commonTextStyle}">${
    userData.phone || "0509876543"
  }</span>
          </div>
          
          <div class="flex items-center gap-2">
            <img src="./assets/images/header/Puce.svg" class="w-6 h-6" />
            <span style="${commonTextStyle}">${offerHTML}</span>
          </div>
          
          <div class="flex items-center gap-2">
            <span style="${commonTextStyle}">${renewalLabel}</span>
            <div class="relative flex items-center bg-white rounded-full h-[36px] w-[180px] p-0.5">
              <button 
                id="renewal-auto"
                class="flex-1 flex items-center justify-center gap-1 rounded-full h-[32px] transition-all duration-300"
                style="font-family:'Rubik',sans-serif;font-weight:500;font-size:0.95rem;${
                  isAuto
                    ? "background:#E30613;color:#fff;"
                    : "background:#fff;color:#2A2A2A;"
                }">
                <img src="./assets/images/header/chevron-down-white.svg" class="w-5 h-5 ${
                  isAuto ? "" : "hidden"
                }" />
                Auto
              </button>
              <button 
                id="renewal-manual"
                class="flex-1 flex items-center justify-center gap-1 rounded-full h-[32px] transition-all duration-300"
                style="font-family:'Rubik',sans-serif;font-weight:500;font-size:0.95rem;${
                  !isAuto
                    ? "background:#E30613;color:#fff;"
                    : "background:#fff;color:#2A2A2A;"
                }">
                <img src="./assets/images/header/chevron-down-white.svg" class="w-5 h-5 ${
                  !isAuto ? "" : "hidden"
                }" />
                Manuel
              </button>
            </div>
            
            <button id="auto-renewal-info" class="w-6 h-6 flex items-center justify-center rounded-full text-ooredoo-red relative">
              <img src="./assets/images/header/Info.svg" class="w-6 h-6" alt="Info" />
              <div id="auto-renewal-card" class="absolute bg-white text-left left-1/2 transform -translate-x-1/2 top-full mt-3 w-72 md:w-[22.5rem] p-4 shadow-lg rounded-lg border border-gray-200 hidden z-50">
                <div style="${infoCardDescStyle}">
                  ${infoCardDesc}
                </div>
              </div>
            </button>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <img src="./assets/images/header/Dollar.svg" class="w-6 h-6" />
          <span style="${priceHeader}">${userData.credit || "1200 DA"}</span>
        </div>
      </div>
    </div>
  </div>

  <div id="global-modal-overlay" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" style="backdrop-filter: blur(8px);">
    <div id="global-modal-container" class="max-w-lg lg:max-w-5xl">
    </div>
  </div>
</header>
  `;
};
