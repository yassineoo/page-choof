import { offerData } from "./OfferData.js";

export const generateHeaderHTML = (
  language = "fr",
  userData = {},
  theme = "light"
) => {
  const texts = offerData.text[language] || offerData.text.fr;
  const isAuto = userData.autoRenewal;
  const fontClass = language === "ar" ? "font-noto-kufi-arabic" : "font-rubik";
  const containsArabic = (text = "") =>
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
  const escapeHtml = (str = "") =>
    String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const formatMixedText = (text = "") => {
    const safe = escapeHtml(text);
    if (containsArabic(text)) {
      return `<span class="${fontClass} arabic-text" dir="auto">${safe}</span>`;
    }
    return `<span class="${fontClass}" dir="auto">${safe}</span>`;
  };

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
    ? texts.renewalInfoAuto(offerDetails.name, offerDetails.price)
    : texts.renewalInfoManual;
  const infoCardDescStyle = `
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: justify;
    color: #575757;
  `;
  const infoCardDescStyleDark = `
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: justify;
    color: #ffffff;
  `;
  const LRM = "\u200E";
  const wrapLatin = (s) => s.replace(/([A-Za-z0-9\-\_]+)/g, `${LRM}$1${LRM}`);

  const getOfferText = (offer) => {
    if (language === "ar") {
      if (!offer) return offer;
      // remplacer "Offre " par "عرض " puis protéger les séquences latines
      const replaced = offer.replace(/^Offre\s+/, "عرض ");
      return wrapLatin(replaced);
    }
    return offer;
  };

  const offerHTML = formatMixedText(getOfferText("Offre Dima"));

  return `
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&family=Noto+Kufi+Arabic:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  .font-noto-kufi-arabic { font-family: 'Noto Kufi Arabic', sans-serif; }
  .font-rubik { font-family: 'Rubik', sans-serif; }
  .bg-ooredoo-red { background-color: #E30613; }
  .text-ooredoo-red { color: #E30613; }
  .hdr-common-text{
    font-family: 'Rubik', sans-serif;
    font-weight: 500;
    font-style: normal;
    font-size: 18px;
    line-height: 170%;
    letter-spacing: 0.02em;
    text-transform: capitalize;
  }
  .hdr-price{
    font-family: Rubik, sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: 24px;
    line-height: 170%;
    letter-spacing: 2%;
  }
  @media (max-width: 767px){
    .hdr-common-text{ font-size: 14px; }
    .hdr-price{ font-size: 20px; }
  }
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
  @media (max-width: 767px) {
    #auto-renewal-info-mobile { position: relative; z-index: 70; }
    #auto-renewal-card-mobile {
      position: absolute !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      top: calc(100% + 8px) !important;
      transform: none !important;
      margin: 0 !important;
      box-sizing: border-box !important;
      padding: 12px !important;
      border-radius: 12px !important;
      box-shadow: 0 6px 18px rgba(0,0,0,0.12) !important;
      z-index: 60 !important;
    }
    #auto-renewal-card-mobile.hidden { display: none !important; }
    #auto-renewal-card-mobile:not(.hidden) { display: block !important; }
  }
  html[lang="ar"], [dir="rtl"] { font-family: 'Noto Kufi Arabic', sans-serif; }
  .arabic-text { direction: rtl; unicode-bidi: isolate; -webkit-font-smoothing: antialiased; }
  [dir="rtl"] .language-dropdown-menu { left: 0; right: auto; }
  [dir="rtl"] .logo-group {
  flex-direction: row-reverse;
}
</style>

<header class="bg-white dark:bg-[#171717] z-30 relative w-full" dir="${
    language === "ar" ? "rtl" : "ltr"
  }">
  <div class="w-full max-w-[90vw] mx-auto px-4">
    <div class="flex items-center justify-between h-16 md:h-20 w-full">
     
    <div class="flex items-center gap-1 md:gap-3 logo-group" dir="ltr">
  <div class="flex items-center justify-center w-[102px] h-[20px] md:w-[200px] md:h-[40px]">
    <img src="./assets/images/header/Ooredoo.svg" alt="Ooredoo"
         class="block w-full h-full max-h-full object-contain dark:hidden"
         width="200" height="40" loading="lazy" />
    <img src="./assets/images/header/Ooredoo-white.svg" alt="Ooredoo"
         class="block w-full h-full max-h-full object-contain hidden dark:block"
         width="200" height="40" loading="lazy" />
  </div>

  <span class="flex items-center justify-center h-[20px] md:h-[40px] text-[18px] md:text-3xl font-light text-black dark:text-white leading-none separator" aria-hidden="true">|</span>

  <div class="flex items-center justify-center  pt-1 md:pt-1 w-[58.5px] h-[20px] md:w-[115px] md:h-[40px]">
    <img src="./assets/images/header/Choof.svg" alt="Choof"
         class="block w-full h-full max-h-full object-contain dark:hidden"
         style="transform: translateY(1px);"
         width="115" height="26" loading="lazy" />
    <img src="./assets/images/header/Choof-white.svg" alt="Choof"
         class="block w-full h-full max-h-full object-contain hidden dark:block"
         style="transform: translateY(1px);"
         width="115" height="26" loading="lazy" />
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

        <a href="https://www.ooredoo.dz/fr/particuliers/contactez-nous" target="_blank" class="flex items-center h-[40px] lg:h-[48px] px-4 lg:px-6 text-black dark:text-white rounded-lg transition-all duration-300">
          <span id="help-text" class="${fontClass} text-sm lg:text-base mx-2">${
    texts.helpText
  }</span>
          <img src="./assets/images/header/help.svg" class="w-4 h-4 lg:w-5 lg:h-5 mr-2 dark:hidden transition-opacity duration-300" />
          <img src="./assets/images/header/help-white.svg" class="w-4 h-4 lg:w-5 lg:h-5 mr-2 hidden dark:inline transition-opacity duration-300" />
        </a>

        <div class="relative h-[40px] lg:h-[48px]" id="language-desktop">
          <button class="flex items-center h-full px-4 lg:px-6 rounded-[40px] bg-white border border-[#E4E4E7] dark:border-[#E4E4E7] hover:bg-gray-100 transition-all duration-300 text-[#2A2A2A]">
            <span id="current-language" class="${fontClass} text-sm lg:text-base font-medium">${
    texts.currentLanguage
  }</span>
            <img src="./assets/images/header/chevron-down-black-h.svg" class="w-3 h-3 lg:w-4 lg:h-4 ml-2" />
          </button>
          <div class="language-dropdown-menu hidden absolute right-0 mt-2 w-full min-w-[120px] bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
            <a href="#" class="language-option block px-4 lg:px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white transition-all duration-300 ${
              language === "fr" ? "font-semibold text-ooredoo-red" : ""
            }">Français</a>
            <a href="#" class="font-noto-kufi-arabic language-option block px-4 lg:px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white transition-all duration-300 ${
              language === "ar" ? "font-semibold text-ooredoo-red" : ""
            }">العربية</a>
          </div>
        </div>
      </div>

      <button id="mobile-menu-btn" class="md:hidden p-2" aria-controls="mobile-menu" aria-expanded="false" aria-label="Ouvrir le menu">
        <img src="./assets/images/header/Menu.svg" class="w-6 h-6 dark:hidden block" id="mobile-menu-icon" />
        <img src="./assets/images/header/Menu-white.svg" class="w-6 h-6 hidden dark:inline" id="mobile-menu-icon-dark" />
        <img src="./assets/images/header/close.svg" class="w-6 h-6 hidden" id="mobile-menu-close-icon" />
        <img src="./assets/images/header/close-white.svg" class="w-6 h-6 hidden" id="mobile-menu-close-icon-dark" />
      </button>
    </div>

    <div id="mobile-menu" role="navigation" aria-hidden="true" class="absolute top-[64px] left-0 w-full shadow-lg bg-white dark:bg-gray-800 md:hidden pb-6 border-b border-gray-200 dark:border-gray-700 hidden z-40" style="transform: translateY(-10px); opacity: 0; transition: transform 0.28s ease, opacity 0.28s ease;">
      <div class="flex flex-col space-y-4 pt-4 px-4 text-black dark:text-white">
        <div class="flex items-center gap-3 py-2">
          <button id="theme-mobile-switcher" class="flex items-center w-full text-black dark:text-white" type="button" aria-pressed="false">
            <img src="./assets/images/header/sun.svg" class="w-5 h-5 dark:hidden" id="mobile-sun-icon" />
            <img src="./assets/images/header/sun-white.svg" class="w-5 h-5 hidden dark:inline" id="mobile-sun-icon-dark" />
            <img src="./assets/images/header/moon-white.svg" class="w-5 h-5 hidden" id="mobile-moon-icon" />
            <img src="./assets/images/header/moon.svg" class="w-5 h-5 dark:hidden" id="mobile-moon-icon-dark" />
            <span class="ml-2 ${fontClass}">${texts.changeModeLabel}</span>
          </button>
        </div>

        <div class="flex items-center gap-3 py-2 rounded-lg px-2 transition-all duration-300">
          <img src="./assets/images/header/help.svg" class="w-5 h-5 dark:hidden transition-opacity duration-300" />
          <img src="./assets/images/header/help-white.svg" class="w-5 h-5 hidden dark:inline transition-opacity duration-300" />
          <span id="help-text-mobile" class="${fontClass} text-[10px] text-black dark:text-white">
            <a href="https://www.ooredoo.dz/fr/particuliers/contactez-nous" target="_blank">${
              texts.helpText
            }</a>
          </span>
        </div>

        <div class="flex items-center gap-3 py-2">
          <img src="./assets/images/header/language.svg" class="w-5 h-5 dark:hidden" />
          <img src="./assets/images/header/language-white.svg" class="w-5 h-5 hidden dark:inline" />
          <div class="flex gap-2">
            <button type="button" class="language-option px-3 py-1 rounded-lg text-black dark:text-white ${
              language === "fr" ? "font-semibold text-ooredoo-red" : ""
            } ${fontClass}" data-lang="fr">Français</button>
            <button type="button" class="language-option px-3 py-1 rounded-lg text-black dark:text-white ${
              language === "ar" ? "font-semibold text-ooredoo-red" : ""
            } font-noto-kufi-arabic" data-lang="ar">العربية</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-ooredoo-red py-4 text-white w-full">
    <div class="px-4 w-full max-w-[95vw] md:max-w-[90vw] mx-auto">
      <div class="md:block hidden">
        <div class="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
          <div class="flex-1 flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto min-w-0">
            <div class="flex items-center gap-2 min-w-0">
              <img src="./assets/images/header/Telephone.svg" class="w-6 h-6 flex-shrink-0" />
              <span class="hdr-common-text ${fontClass}">${
    userData.phone || "0509876543"
  }</span>
            </div>

            <div class="flex items-center gap-2 min-w-0">
              <img src="./assets/images/header/Puce.svg" class="w-6 h-6 flex-shrink-0" />
              <span class="hdr-common-text">${offerHTML}</span>
            </div>

            <div class="flex items-center gap-2">
              <span class="hdr-common-text ${fontClass}">${
    texts.renewalLabel
  }</span>
              <div class="relative flex items-center bg-white rounded-full h-[36px] w-[180px] p-0.5">
                <button 
                  id="renewal-auto"
                  class="flex-1 flex flex-row items-center justify-start gap-[5px] rounded-full h-[32px] transition-all duration-300 ${fontClass}"
                  style="font-weight:500; font-size:0.95rem; padding:4px 10px; border-radius:100px; ${
                    isAuto
                      ? "background:#ED1C24;color:#fff;"
                      : "background:#fff;color:#2A2A2A;"
                  }">
                  <img src="./assets/images/header/chevron-down.svg" class="w-5 h-5 ${
                    isAuto ? "hidden" : ""
                  }" />
                  <img src="./assets/images/header/chevron-down-white.svg" class="w-5 h-5 ${
                    isAuto ? "" : "hidden"
                  }" />
                  ${texts.autoLabel}
                </button>

                <button 
                  id="renewal-manual"
                  class="flex-1 flex items-center justify-center gap-1 rounded-full h-[32px] transition-all duration-300 ${fontClass}"
                  style="font-weight:500;font-size:0.95rem; ${
                    !isAuto
                      ? "background:#E30613;color:#fff;"
                      : "background:#fff;color:#2A2A2A;"
                  }">
                  ${texts.manualLabel}
                </button>
              </div>

              <button id="auto-renewal-info" class="w-6 h-6 flex items-center justify-center rounded-full text-ooredoo-red relative">
                <img src="./assets/images/header/Info.svg" class="w-6 h-6" alt="Info" />
                <div id="auto-renewal-card" class="absolute bg-white dark:bg-[#2C2C2C] text-left left-1/2 transform -translate-x-1/2 top-full mt-3 w-72 md:w-[22.5rem] p-4 shadow-lg rounded-lg border border-gray-200 dark:border-[#fff] hidden z-50">
                  <div class="${fontClass}" style="${
    theme === "dark" ? infoCardDescStyleDark : infoCardDescStyle
  }">
                    ${infoCardDesc}
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <img src="./assets/images/header/Dollar.svg" class="w-6 h-6" />
            <span class="hdr-price ${fontClass}">${
    userData.credit || "1200 DA"
  }</span>
          </div>
        </div>
      </div>

      <div class="md:hidden">
        <div class="flex flex-col gap-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 min-w-0">
              <img src="./assets/images/header/Telephone.svg" class="w-6 h-6 flex-shrink-0" />
              <span class="hdr-common-text ${fontClass} truncate">${
    userData.phone || "0509876543"
  }</span>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <img src="./assets/images/header/Dollar.svg" class="w-6 h-6" />
              <span class="hdr-price ${fontClass}">${
    userData.credit || "1200 DA"
  }</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 min-w-0">
              <img src="./assets/images/header/Puce.svg" class="w-6 h-6 flex-shrink-0" />
              <span class="hdr-common-text truncate">${offerHTML}</span>
            </div>

            <div>
              <button id="charge-btn" type="button" class="flex items-center px-[8px] py-[6px] rounded-full bg-white text-ooredoo-red border border-white dark:border-transparent shadow-sm">
                <span class="${fontClass} font-semibold text-[10px]">${
    texts.chargeText || "CHARGER"
  }</span>
                <span class="ml-[4px] flex items-center gap-[3px]">
                  <img src="./assets/images/header/cb.png" alt="" class="w-[16.5px] h-[16.5px]" />
                  <img src="./assets/images/header/barid.png" alt="" class="w-[16.5px] h-[16.5px]" />
                </span>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-center">
            <div class="flex items-center  gap-1 md:gap-3">
              <span class="hdr-common-text ${fontClass}">${
    texts.renewalLabel
  }</span>
              <div class="relative flex items-center bg-white rounded-full h-[36px] w-[160px] md:w-[175px] p-0.5">
                <button 
                  id="renewal-auto-mobile"
                  class="flex-1 flex flex-row items-center justify-start gap-[3px] rounded-full h-[32px] transition-all duration-300 ${fontClass}"
                  style="font-weight:500; font-size:0.95rem; padding:4px 10px; border-radius:100px; ${
                    isAuto
                      ? "background:#ED1C24;color:#fff;"
                      : "background:#fff;color:#2A2A2A;"
                  }">
                  <img src="./assets/images/header/chevron-down.svg" class="w-5 h-5 ${
                    isAuto ? "hidden" : ""
                  }" />
                  <img src="./assets/images/header/chevron-down-white.svg" class="w-5 h-5 ${
                    isAuto ? "" : "hidden"
                  }" />
                  ${texts.autoLabel}
                </button>

                <button 
                  id="renewal-manual-mobile"
                  class="flex-1 flex items-center justify-center gap-1 rounded-full h-[32px] transition-all duration-300 ${fontClass}"
                  style="font-weight:500;font-size:0.95rem; ${
                    !isAuto
                      ? "background:#E30613;color:#fff;"
                      : "background:#fff;color:#2A2A2A;"
                  }">
                  ${texts.manualLabel}
                </button>
              </div>

              <button id="auto-renewal-info-mobile" class="w-6 h-6 flex items-center justify-center rounded-full bg-transparent text-white relative ml-2">
                <img src="./assets/images/header/Info.svg" class="w-6 h-6" alt="Info" />
                <div id="auto-renewal-card-mobile" class="absolute bg-white dark:bg-[#2C2C2C] text-left left-1/2 transform -translate-x-1/2 top-full mt-3 w-72 md:w-[22.5rem] p-4 shadow-lg rounded-lg border border-gray-200 hidden z-50">
                  <div class="${fontClass}" style="${
    theme === "dark" ? infoCardDescStyleDark : infoCardDescStyle
  }">
                    ${infoCardDesc}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <div id="global-modal-overlay" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" style="backdrop-filter: blur(8px);">
    <div id="global-modal-container" class="w-full max-w-[703px]"></div>
  </div>
</header>
`;
};
