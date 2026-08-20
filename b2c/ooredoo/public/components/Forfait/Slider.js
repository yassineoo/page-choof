import ForfaitData from "./ForfaitData.js";
import ModalData, { newOredooModals } from "./ModalData.js";

export class Slider {
  constructor(parameters) {
    this.currentLang = this.getLanguage();
    this.boundHandlers = {
      languageChange: this.handleLanguageChange.bind(this),
      //resize: this.handleResize.bind(this),
    };
    this.setupEventListeners();
    // expose a bound modal helper so template buttons can call it
    if (typeof window !== "undefined") {
      const sliderInstance = this;
      window.ooredooShowModal = (btnOrName) => {
        try {
          let offerName = "";
          let pack = "";
          let activeMode = "";

          // string passed directly
          if (typeof btnOrName === 'string') {
            offerName = btnOrName;
          } else if (btnOrName && (btnOrName instanceof Element || btnOrName.nodeType)) {
            const el = btnOrName;

            // try common attributes on the button
            if (el.dataset && el.dataset.offerName) offerName = el.dataset.offerName;
            if (!offerName && el.getAttribute) {
              offerName = el.getAttribute('data-offer-name') || el.getAttribute('data-base-offer-name') || offerName || '';
            }

            // locate card container for mode/pack info
            const card = el.closest('[data-ooredoo-card]') || el.closest('[data-card-base-name]') || el.closest('[data-base-offer-name]') || el.closest('.forfait-card-footer');
            if (card) {
              if (!offerName && card.dataset && card.dataset.baseOfferName) offerName = card.dataset.baseOfferName;
              if (card.dataset && card.dataset.activeMode) activeMode = card.dataset.activeMode;
              // only consider pack when in forfait mode
              if (activeMode === 'forfait' && card.dataset && card.dataset.currentTab) pack = card.dataset.currentTab;
            }

            // fallback: read visible base name element
            if (!offerName) {
              const baseNameEl = el.closest('.forfait-button-zone')?.parentElement?.querySelector('[data-card-base-name]');
              if (baseNameEl) offerName = baseNameEl.innerText.trim();
            }
          }

          const lang = sliderInstance.getLanguage();
          let title = offerName || '';

          if (pack) {
            const titleWithPack = `${offerName} ${pack}`.trim();
            if (newOredooModals[lang] && newOredooModals[lang][titleWithPack]) {
              title = titleWithPack;
            }
          }

          // final fallback: use element text if still empty
          if (!title && btnOrName && btnOrName.innerText) title = btnOrName.innerText.trim();

          // call the instance modal
          sliderInstance.showOoredooModal(title || '');
        } catch (e) {
          console.error(e);
          // fallback to generic confirm
          try { sliderInstance.showOoredooModal(''); } catch (err) { /* ignore */ }
        }
      };
    }
  }

  handleLanguageChange() {
    const newLanguage = this.getLanguage();
    if (newLanguage !== this.currentLang) {
      this.currentLang = newLanguage;
      this.closeAnyOpenModals();
      this.render();
    }
  }

  setupEventListeners() {
    window.removeEventListener("languageChanged", this.boundHandlers.languageChange);
    window.addEventListener("languageChanged", this.boundHandlers.languageChange);

    window.removeEventListener("resize", this.boundHandlers.resize);
    window.addEventListener("resize", this.boundHandlers.resize);

    this.setupLanguagePolling();
    //this.setupAccessibility();
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

  getLanguage() {
    const storedLanguage = localStorage.getItem("language");
    return ["fr", "ar"].includes(storedLanguage) ? storedLanguage : "fr";
  }

  createForfaitCard(offer, index, labels) {
    return `
      <div class="h-full sm:h-auto relative w-full max-w-[320px] flex flex-col mx-auto overflow-hidden">
        ${this.createForfaitCardBody(offer, index, labels)}
      </div>
    `;
  }

  createForfaitCardBody(offer, index, labels, currentTab = null) {
    const isRTL = this.currentLang === "ar";
    const currencyLabel = isRTL ? "دج" : "DA";
    const buyLabel = labels.buy || offer.buy || (isRTL ? "شراء" : "Acheter");
    const textAlign = isRTL ? "text-right" : "text-left";
    const titleFontClass = this.getFontClass(offer.name);
    const dataFontClass = this.getFontClass(offer.data);
    const buttonFontClass = this.getFontClass(buyLabel);

    const priceNumber = this.convertToLatinNumerals(offer.price.replace(/[^0-9٠-٩]/g, ""));
    const durationText = this.convertToLatinNumerals(offer.duration);

    const priceFontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";
    // Show pack-first header in Arabic when currentTab (pack) is provided
    const headerDisplay = (isRTL && currentTab)
      ? `${currentTab} ${offer.name}`
      : `${offer.price} ${currencyLabel}`;

    return `
        ${offer.topLabel ? `
        <div class="mb-2 h-[30px] flex items-center justify-center text-ooredoo-red dark:text-white bg-[#ED1C2421] dark:bg-[#ED1C2421]/60 rounded-full px-1 text-center">
          <span dir="ltr" class="font-rubik text-[15px] font-semibold">
          ${offer.topLabel}
          <span class="${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}">${isRTL ? "وفّروا" : "D'ÉCONOMIE"}</span>
          </span>
        </div>` : ""}
        <div class="pb-5 bg-white dark:bg-[#2C2C2C] rounded-xl border-[2px] border-ooredoo-red dark:border-white"}>
          <div class="h-14 bg-ooredoo-red dark:border-ooredoo-red -m-[1px] flex items-center justify-center rounded-t-xl">
            <h2 class="text-white font-bold text-[20px] md:text-[25px] text-center capitalize dark:text-white leading-tight">
              <span class="font-rubik" data-card-offer-name data-base-offer-name="${offer.name}" ${isRTL && currentTab ? 'dir="ltr"' : ''}>${headerDisplay}</span>
            </h2>
          </div>

          <div class="flex-1 text-2xl flex flex-col items-center justify-center ${isRTL ? "h-[347px] md:h-[370px]" : "h-[347px] md:h-[367px]"} gap-1 py-4 text-center border-b-[1px] border-b-[#BBBEBE] border-dashed">
            <p>${this.currentLang === "ar" ? "قوموا بشراء" : "Payez"}</p>
            <p class="text-ooredoo-red text-2xl font-bold">
              <span data-card-paid-count>${offer.sub || ''}</span>
              <span class="ml-1">${this.currentLang === "ar" ? "اشتراكات" : "forfaits"}</span>
            </p>
            <p class="font-semibold capitalize font-rubik" data-card-base-name>${offer.name.toLowerCase()}</p>
            <p>${isRTL ? "و" : "&"}</p>
            <p>${this.currentLang === "ar" ? "احصلوا على" : "obtenez"}</p>
            <p class="text-ooredoo-red font-bold">
              ${(() => {
                const freeCount = currentTab === "X9" ? 2 : currentTab === "X12" ? 3 : 1;
                return `<span class="${isRTL ? "hidden" : ""}" data-card-free-summary-count>${freeCount}</span>`;
              })()}
              <span data-card-free-text>
                ${this.currentLang === "ar" ? (
                  currentTab === "X9" ? "اشتراكين مجانًا!" :
                  currentTab === "X12" ? "3 اشتراكات مجانًا!" :
                  "اشتراك مجانًا!"
                ) : 
                  currentTab === "X9" ? "gratuits !" :
                  currentTab === "X12" ? "gratuits !" :
                  "gratuit !"
                }
              </span>
            </p>
          </div>

          <div class="${isRTL ? "py-[22px]" : "py-[21px]"} md:py-6 sm:pt-4 px-2 flex items-center justify-between">
            <div class="text-center">
              <p class="text-sm">${this.currentLang === "ar" ? "احصلوا على" : "Recevez"}</p>
              <p class="font-semibold text-lg md:text-xl"><span class="font-rubik" data-card-given>${offer.given || ''}</span> ${this.currentLang === "ar" ? "اشتراكات" : "forfaits"}</p>
            </div>
            <div class="text-center">
              <p class="text-[#7F7F7F] font-semibold text-xl">
                <span class="font-rubik line-through decoration-red-500" data-card-old-price>${offer.oldPrice}</span> <span class="text-sm">${currencyLabel}</span>
              </p>
              <p class="font-semibold text-2xl md:text-3xl">
                <span class="font-rubik" data-card-price>${offer.price}</span> 
                <span class="text-xl">${currencyLabel}</span>
              </p>
            </div>
          </div>

          <div class="text-center text-sm ${isRTL ? "px-8 md:px-12" : "px-2 md:px-6"} pt-[7px]">
            <p>${isRTL ? "يتم تجديد اشتراك <span class='font-rubik'>Ooredoo</span> تلقائيًا كل <span class='font-rubik'>4</span> أسابيع" : "Forfait renouvelable automatiquement chaque 4 semaines"}</p>
          </div>

          <div class="forfait-card-footer pt-4">
            <div class="forfait-button-zone flex justify-center w-full">
              <button class="${buttonFontClass} bg-ooredoo-red text-white border-none rounded-full cursor-pointer"
                style="
                  font-weight: 500;
                  font-size: 16px;
                  line-height: 100%;
                  letter-spacing: 0;
                  text-align: center;
                  text-transform: uppercase;
                  padding: 20px 24px;
                  height: 32px;
                  width: auto;
                  min-width: 96px;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                "
                onclick="ooredooShowModal(this)">
                ${buyLabel}
              </button>
            </div>
          </div>
        </div>
    `;
  }

  createOoredooCard(offer, index, labels, showModeTabs = true, currentTab = "X6", wrapperClass = "") {
    return `
      <div class="h-full sm:h-auto relative w-full max-w-[320px] flex flex-col mx-auto overflow-hidden ${wrapperClass}" data-ooredoo-card data-active-mode="ooredoo" data-base-offer-name="${offer.name}" data-current-tab="${currentTab}">
        ${showModeTabs ? this.createOoredooModeTabs() : ""}
        <div data-card-view="ooredoo">
          ${this.createOoredooCardBody(offer, index, labels)}
        </div>
        ${showModeTabs ? `
        <div data-card-view="forfait" class="hidden">
          ${this.createForfaitCardBody(offer, index, labels, currentTab)}
        </div>
        ` : ""}
      </div>
    `;
  }

  createOoredooModeTabs() {
    const modeButtonBase = "inline-flex items-center justify-center rounded-full border px-3 py-2 text-[15px] font-semibold transition-all duration-200 ease-out transform-gpu focus:outline-none focus-visible:ring-2 focus-visible:ring-ooredoo-red/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#2C2C2C]";
    const activeModeButton = "border-[#ED1C2421] bg-[#ED1C2421] text-[#ED1C24] hover:bg-[#ED1C2430]";
    const inactiveModeButton = "border-[#78626321] bg-[#78626321] text-[#827D7D] hover:border-[#ED1C2440] hover:bg-white hover:text-[#ED1C24] dark:hover:bg-[#3A3A3A] dark:hover:text-white";

    return `
      <div class="mb-2 h-[30px] flex flex-nowrap items-stretch justify-center gap-2 px-2 overflow-hidden">
        <button type="button" class="ooredoo-mode-btn ${modeButtonBase} ${activeModeButton} h-full min-w-0 flex-[1.35] px-2 py-0 leading-none" data-card-mode="ooredoo">
          Ooredoo
        </button>
        <button type="button" class="ooredoo-mode-btn ${modeButtonBase} ${inactiveModeButton} h-full min-w-0 flex-1 px-2 py-0 leading-none" data-card-mode="forfait" data-card-pack="X6" data-card-free-count="1">
          X6
        </button>
        <button type="button" class="ooredoo-mode-btn ${modeButtonBase} ${inactiveModeButton} h-full min-w-0 flex-1 px-2 py-0 leading-none" data-card-mode="forfait" data-card-pack="X9" data-card-free-count="2">
          X9
        </button>
        <button type="button" class="ooredoo-mode-btn ${modeButtonBase} ${inactiveModeButton} h-full min-w-0 flex-1 px-2 py-0 leading-none" data-card-mode="forfait" data-card-pack="X12" data-card-free-count="3">
          X12
        </button>
      </div>
    `;
  }

  createOoredooCardBody(offer, index, labels) {
    const isRTL = this.currentLang === "ar";
    const currencyLabel = isRTL ? "دج" : "DA";
    const buyLabel = labels.buy || offer.buy || (isRTL ? "شراء" : "Acheter");
    const textAlign = isRTL ? "text-right" : "text-left";
    const titleFontClass = this.getFontClass(offer.name);
    const dataFontClass = this.getFontClass(offer.data);
    const buttonFontClass = this.getFontClass(buyLabel);

    const priceNumber = this.convertToLatinNumerals(offer.price.replace(/[^0-9٠-٩]/g, ""));
    const durationText = this.convertToLatinNumerals(offer.duration);

    const priceFontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

    return `
        ${offer.hasTopLabel ?`
          <div class="mb-2 h-[30px] flex items-center gap-1 justify-center dark:text-white bg-[#F1C4004D] dark:bg-[#F1C400]/60 rounded-full font-semibold text-center px-1">
            <span class="text-[15px]">
            ${offer.topLabel}
            </span>
        </div>` : 
        `
        <div class="h-[0px] flex items-center gap-1 justify-center text-ooredoo-red dark:text-white bg-transparent rounded-full font-semibold text-center">
          
        </div>`}
        <div class="pb-5 bg-white dark:bg-[#2C2C2C] rounded-xl border-[2px] border-ooredoo-red dark:border-white"}>
          <div class="h-14 bg-ooredoo-red dark:border-ooredoo-red -m-[1px] flex items-center justify-center rounded-t-xl">
            <h2 class="text-white font-bold text-[20px] md:text-[25px]  text-center capitalize dark:text-white leading-tight">
              <span class="font-rubik">
                ${
                  offer.name}
              </span> 
            </h2>
          </div>

          <div class="flex-1 justify-center items-center text-center pt-4">
            <span dir="ltr">
              <span class="text-[40px] sm:text-[55px] text-ooredoo-red dark:text-white font-semibold font-rubik">${offer.data}</span>
              <span class="-ml-1 text-[30px] sm:text-[40px] text-ooredoo-red dark:text-white font-semibold font-rubik">Go</span>
            </span>
            <span class="${isRTL ? "mr-1" : "ml-1"}">${isRTL ? "إنترنت" : "internet"}</span>
          </div>

          <div class="space-y-4 py-8 px-5 border-b-[1px] border-b-[#BBBEBE] ${isRTL ? "h-[270px]" : "h-[270px]"} border-dashed">
            ${
              offer.features.map(feature => `
                <div class="flex gap-2">
                  <span class="flex-shrink-0 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#ED1C24"/>
                      <path d="M6.58997 4.55566C6.58997 4.00338 7.03768 3.55566 7.58997 3.55566H8.18997C8.74225 3.55566 9.18997 4.00338 9.18997 4.55566V11.2223C9.18997 11.7746 8.74225 12.2223 8.18997 12.2223H7.58997C7.03768 12.2223 6.58997 11.7746 6.58997 11.2223V4.55566Z" fill="white"/>
                      <path d="M3.55591 7.58887C3.55591 7.03658 4.00362 6.58887 4.55591 6.58887H11.2226C11.7749 6.58887 12.2226 7.03658 12.2226 7.58887V8.18887C12.2226 8.74115 11.7749 9.18887 11.2226 9.18887H4.55591C4.00362 9.18887 3.55591 8.74115 3.55591 8.18887V7.58887Z" fill="white"/>
                    </svg>
                  </span>
                  <span class="">${feature}</span>
                </div>
            `).join('')}
          </div>

          <div class="h-[150px]">
            <div class="px-4 py-6 flex items-center justify-between">
              <div class="text-center">
              ${              
                index !== 6 ?
                `<p class="text-sm">${this.currentLang === "ar" ? "الكل صالح لمدة" : "Valables"}</p>`
                :
                `<p class="text-sm">${this.currentLang === "ar" ? "استفيدوا من" : "Recevez"}</p>`

              }
              
              ${
                index === 6 ?
                `<p class="font-semibold text-lg md:text- ${this.currentLang === "ar" ? "font-noto-kufi-arabic" : "font-rubik"}">
                  ${this.currentLang === "ar" ? "11 اشتراك" : "11 forfaits"}
                </p>`
                :
                `<p class="font-semibold text-lg md:text- ${this.currentLang === "ar" ? "font-noto-kufi-arabic" : "font-rubik"}">
                  ${offer.duration}
                </p>`
              }
              </div>
              <div class="text-center">
                <p class="font-semibold text-2xl md:text-3xl">
                  <span class="font-rubik">${offer.price}</span> 
                  <span class="text-xl">${currencyLabel}</span>
                </p>
              </div>
            </div>
            ${index === 6 ? 
            `<div>
              <p class="text-center text-sm ${isRTL ? "px-12" : "px-8"}">
                ${this.currentLang === "ar" ? "يتم تجديد اشتراك Ooredoo تلقائيًا كل 4 أسابيع" : "Forfait renouvelable automatiquement chaque 4 semaines"}
              </p>
            </div>` 
          : 
          ``}
          </div>

          <div class="forfait-card-footer">
            <div class="forfait-button-zone flex justify-center w-full">
              <button class=" ${buttonFontClass} bg-ooredoo-red text-white border-none rounded-full cursor-pointer"
                style="
                  font-weight: 500;
                  font-size: 16px;
                  line-height: 100%;
                  letter-spacing: 0;
                  text-align: center;
                  text-transform: uppercase;
                  padding: 20px 24px;
                  height: 32px;
                  width: auto;
                  min-width: 96px;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                "
                onclick="ooredooShowModal(this)">
                ${buyLabel}
              </button>
            </div>
          </div>
        </div>
    `;
  }

  createForfaitCardInternet(offer, index, labels) {
    const isRTL = this.currentLang === "ar";
    const currencyLabel = isRTL ? "دج" : "DA";
    const buyLabel = labels.buy || offer.buy || (isRTL ? "شراء" : "Acheter");
    const textAlign = isRTL ? "text-right" : "text-left";

    const titleFontClass = this.getFontClass(offer.price);
    const dataFontClass = this.getFontClass(offer.data);
    const buttonFontClass = this.getFontClass(buyLabel);

    const priceNumber = this.convertToLatinNumerals(offer.price.replace(/[^0-9٠-٩]/g, ""));
    const durationText = this.convertToLatinNumerals(offer.duration);

    const priceFontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

    return `
      <div class=
       "relative bg-white pb-6 dark:bg-[#2C2C2C] rounded-xl flex flex-col w-full mx-auto forfait-card-shadow overflow-hidden" style="max-width: 300px;">
        <div class="h-full flex flex-col justify-between" ${isRTL ? `dir="rtl"` : ``}>
          <div class="">
            <div class="border-b-[1px] border-b-[#BBBEBE] border-dashed text-center py-3">
              <h2 class="border ${isRTL ? "font-noto-kufi-arabic" : "font-rubik"} font-medium text-2xl text-center capitalize dark:text-white leading-tight">
                ${isRTL ? "اشتراك" : "Forfait"} <span class="font-rubik">${offer.price}</span>
              </h2>
            </div>
            <div class="mt-6 px-4 text-xl">
              ${index === 10 ?
                `<h3 class="text-ooredoo-red dark:text-white font-semibold text-[28px]">
                 <span class="">${offer.data}</span>
                </h3> `
                :
                `<h3 class="text-ooredoo-red dark:text-white font-semibold text-[28px]">
                 <span class="font-rubik">${offer.data}</span>
                 ${isRTL ?
                  `<span class="font-noto-kufi-arabic">إنترنت</span>`
                  :
                  `<span class="font-rubik">internet</span>`
                 }
                </h3> `}
              <div class="space-y-4 mt-8 h-[200px] sm:h-[180px]">
              ${offer.features.map(feature => `
                <div class="flex items-center gap-2">
                  <span>
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
                    </span>
                    <span class="text-[16px]">${feature}</span>
                </div>
              `).join('')}
              </div>
            </div>
            <div class="flex items-baseline justify-center ${isRTL ? "mt-8" : "mt-0"}">
              <span class="font-rubik font-semibold mx-2 text-[27.96px] leading-none text-black dark:text-white">${priceNumber}</span>
              <span class="${priceFontClass} font-semibold text-lg leading-none text-black dark:text-white whitespace-nowrap">${currencyLabel}</span>
              <span class="${priceFontClass} font-semibold text-lg leading-none text-black dark:text-white whitespace-nowrap">/${durationText}</span>
            </div>
          </div>

          <div class="forfait-card-footer">
            <div class="forfait-button-zone flex justify-center w-full">
              <button class="forfait-buy-btn ${buttonFontClass} bg-ooredoo-red text-white border-none rounded-full cursor-pointer"
                style="
                  font-weight: 500;
                  font-size: 16px;
                  line-height: 100%;
                  letter-spacing: 0;
                  text-align: center;
                  text-transform: uppercase;
                  padding: 20px 24px;
                  height: 32px;
                  width: auto;
                  min-width: 96px;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                "
                data-index="${index}" 
                data-offer-name="${offer.name}">
                ${buyLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createForfaitCardSmart(offer, index, labels) {
    const isRTL = this.currentLang === "ar";
    const currencyLabel = isRTL ? "دج" : "DA";
    const buyLabel = labels.buy || offer.buy || (isRTL ? "شراء" : "Acheter");
    const textAlign = isRTL ? "text-right" : "text-left";

    const titleFontClass = this.getFontClass(offer.price);
    const dataFontClass = this.getFontClass(offer.data);
    const buttonFontClass = this.getFontClass(buyLabel);

    const priceNumber = this.convertToLatinNumerals(offer.price.replace(/[^0-9٠-٩]/g, ""));
    const durationText = this.convertToLatinNumerals(offer.duration);

    const priceFontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

    return `
      <div class="relative bg-white pb-6 dark:bg-[#2C2C2C] rounded-xl flex flex-col w-full mx-auto forfait-card-shadow overflow-hidden" style="max-width: 340px;">
        <div class="h-full flex flex-col justify-between" ${isRTL ? `dir="rtl"` : ``}>
          <div class="">
            <div class="border-b-[1px] border-b-[#BBBEBE] border-dashed text-center py-3">
              <h2 class="font-medium text-2xl text-center capitalize dark:text-white leading-tight">
                  <span class="${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}" data-card-offer-name data-base-offer-name="${offer.name}">${offer.displayedName}</span>
                </h2>
            </div>
            <div class="mt-6 px-4 text-xl">
              <h3 class="text-ooredoo-red dark:text-white font-semibold text-[28px]">
                 <span class="${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}">${offer.data}</span>
              </h3>
              <div class="space-y-4 mt-8 h-[150px]">
              ${offer.features.map(feature => `
                <div class="flex items-center gap-2">
                  <span>
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
                    </span>
                    <span class="text-[16px]">${feature}</span>
                </div>
              `).join('')}
              </div>
            </div>
            <div class="flex items-baseline justify-center">
              <span class="font-rubik font-semibold mx-2 text-[27.96px] leading-none text-black dark:text-white">${priceNumber}</span>
              <span class="${priceFontClass} font-semibold text-lg leading-none text-black dark:text-white whitespace-nowrap">${currencyLabel}</span>
              <span class="${priceFontClass} font-semibold text-lg leading-none text-black dark:text-white whitespace-nowrap">/${durationText}</span>
            </div>
          </div>

          <div class="forfait-card-footer">
            <div class="forfait-button-zone flex justify-center w-full">
              <button class="forfait-buy-btn ${buttonFontClass} bg-ooredoo-red text-white border-none rounded-full cursor-pointer"
                style="
                  font-weight: 500;
                  font-size: 16px;
                  line-height: 100%;
                  letter-spacing: 0;
                  text-align: center;
                  text-transform: uppercase;
                  padding: 20px 24px;
                  height: 32px;
                  width: auto;
                  min-width: 96px;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                "
                data-index="${index}" 
                data-offer-name="${offer.name}">
                ${buyLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  generateDots(totalDots, activeIndex) {
    return Array.from(
      { length: totalDots },
      (_, index) =>
        `<button class="forfait-dot ${index === activeIndex ? "active" : ""}" 
                data-slide="${index}" 
                aria-label="Slide ${index + 1}"></button>`
    ).join("");
  }

  createResponsiveLayout(offers, ooredoo,labels, gridType, isRTL, convertToLatinNumerals) {
    const gridClass = gridType === "forfait-grid-5" ? "forfait-grid-5" : "forfait-grid-3";
    const sliderId = gridType === "forfait-grid-5" ? "forfaits-slider" : "smart-slider";
    const dotsId = gridType === "forfait-grid-5" ? "forfaits-dots" : "smart-dots";
    const startIndex = 2;

    return `
          <div class="hidden sm:flex w-full items-center justify-center">
            <div 
              class="forfait-grid-3 grid items-stretch grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-5 max-w-[1000px] grid-center-last-2"
            > 
              ${offers.map((offer, index) => this.createForfaitCard(offer, startIndex + index, labels, isRTL, convertToLatinNumerals)).join("")}
            </div>
          </div>
      
            
            <div class="block md:hidden forfait-mobile-slider forfait-mobile-container" id="${sliderId}">
                <div class="relative swiper">
                <div class="swiper-wrapper">
                ${ooredoo
                      .map(
                        (offer, index) => `
                    <div class="swiper-slide flex justify-center">
                        ${this.createOoredooCard(offer, index, labels, index !== ooredoo.length - 1)}
                    </div>
                    `
                      )
                      .join("")}
                    ${offers
                      .map(
                        (offer, index) => `
                    <div class="swiper-slide flex justify-center">
                        ${this.createForfaitCard(offer, startIndex + index, labels, isRTL, convertToLatinNumerals)}
                    </div>
                    `
                      )
                      .join("")}
                </div>
                <div class="absolute bottom-0  swiper-pagination"></div>
                </div>
            </div>`;
  }

  createResponsiveLayoutOoredoo(offers, labels, gridType, isRTL, convertToLatinNumerals) {
    const gridClass = gridType === "forfait-grid-5" ? "forfait-grid-5" : "forfait-grid-3";
    const sliderId = gridType === "forfait-grid-5" ? "forfaits-slider" : "ooredoo-slider";
    const dotsId = gridType === "forfait-grid-5" ? "forfaits-dots" : "smart-dots";
    const startIndex = 0;

    return `
          <div class="hidden sm:flex w-full items-center justify-center">
            <div class="hidden md:flex lg:hidden w-full justify-center">
              <div class="grid grid-cols-2 justify-items-center gap-5 w-full max-w-[660px]">
                ${offers.map((offer, index) => {
                  const mdWrapperClass = offers.length % 2 === 1 && index === offers.length - 1 ? "md:col-span-2 md:justify-self-center" : "";
                  return this.createOoredooCard(offer, startIndex + index, labels, index !== offers.length - 1, "X6", mdWrapperClass);
                }).join("")}
              </div>
            </div>

            <div class="hidden lg:flex w-full justify-center">
              <div class="w-full max-w-[1360px]">
                <div class="grid grid-cols-4 justify-items-center gap-5 mb-5">
                  ${offers.slice(0, 4).map((offer, index) => this.createOoredooCard(offer, startIndex + index, labels, index !== offers.length - 1)).join("")}
                </div>
                <div class="grid grid-cols-3 justify-items-center gap-5 w-fit mx-auto">
                  ${offers.slice(4).map((offer, index) => this.createOoredooCard(offer, startIndex + 4 + index, labels, (startIndex + 4 + index) !== offers.length - 1)).join("")}
                </div>
              </div>
            </div>
          </div>

          <div class="block md:hidden forfait-mobile-slider forfait-mobile-container" id="${sliderId}">
              <div class="relative swiper">
                <div class="swiper-wrapper">
                  ${offers.map((offer, index) => `
                    <div class="swiper-slide flex justify-center p-4">
                      ${this.createOoredooCard(offer, startIndex + index, labels, index !== offers.length - 1)}
                    </div>
                  `).join("")}
                </div>
                <div class="absolute bottom-0  swiper-pagination"></div>
              </div>
          </div>`;
  }

  createResponsiveLayoutInternet(offers, labels, gridType, isRTL, convertToLatinNumerals) {
    const gridClass = gridType === "forfait-grid-5" ? "forfait-grid-5" : "forfait-grid-3";
    const sliderId = gridType === "forfait-grid-5" ? "forfaits-slider" : "internet-slider";
    const dotsId = gridType === "forfait-grid-5" ? "forfaits-dots" : "smart-dots";
    const startIndex = 5;

    return `
          <div class="hidden sm:flex w-full items-center justify-center">
            <div class="forfait-grid">
              ${offers
                .map((offer, index) => this.createForfaitCardInternet(offer, startIndex + index, labels, isRTL, convertToLatinNumerals))
                .join("")}
            </div>
          </div>
      
            
            <div class="block md:hidden forfait-mobile-slider forfait-mobile-container" id="${sliderId}">
                <div class="relative swiper">
                <div class="swiper-wrapper">
                    ${offers
                      .map(
                        (offer, index) => `
                    <div class="swiper-slide flex justify-center p-4">
                        ${this.createForfaitCardInternet(offer, startIndex + index, labels, isRTL, convertToLatinNumerals)}
                    </div>
                    `
                      )
                      .join("")}
                </div>
                <div class="absolute bottom-0  swiper-pagination"></div>
                </div>
            </div>`;
  }

  createResponsiveLayoutSmart(offers, labels, gridType, isRTL, convertToLatinNumerals) {
    const sliderId = gridType === "forfait-grid-5" ? "forfaits-slider" : "hadra-slider";
    const startIndex = 25;

    return `
          <div class="hidden sm:flex w-full items-center justify-center">
            <div class="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center">
              ${offers.map((offer, index) => this.createForfaitCardSmart(offer, startIndex + index, labels, isRTL, convertToLatinNumerals)).join("")}
            </div>
          </div>
      
            
            <div class="block md:hidden forfait-mobile-slider forfait-mobile-container" id="${sliderId}">
                <div class="relative swiper">
                <div class="swiper-wrapper">
                    ${offers
                      .map(
                        (offer, index) => `
                    <div class="swiper-slide flex justify-center p-4">
                        ${this.createForfaitCardSmart(offer, startIndex + index, labels, isRTL, convertToLatinNumerals)}
                    </div>
                    `
                      )
                      .join("")}
                </div>
                <div class="absolute bottom-0  swiper-pagination"></div>
                </div>
            </div>`;
  }

  initSwiper(containerId, forceRTL = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Find and destroy existing Swiper instance
    const existingSwiper = container.querySelector(".swiper");
    if (existingSwiper && existingSwiper.swiper) {
      existingSwiper.swiper.destroy(true, true);
    }

    const isRTL = forceRTL !== null ? forceRTL : this.getLanguage() === "ar";

    // CRITICAL: Set document direction for Swiper to work properly
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.body.dir = isRTL ? "rtl" : "ltr";

    // Also set on the container
    container.dir = isRTL ? "rtl" : "ltr";

    setTimeout(() => {
      const swiper = new Swiper(container.querySelector(".swiper"), {
        slidesPerView: 1,
        spaceBetween: 8,
        centeredSlides: true,
        loop: false,
        rtl: isRTL,
        pagination: {
          el: container.querySelector(".swiper-pagination"),
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} custom-dot"></span>`;
          },
        },
        breakpoints: {
          370: {
            slidesPerView: 1.3,
        },
      },
        on: {
        init: () => {
          this.equalizeSlideHeights(container);
        },
        resize: () => {
          this.equalizeSlideHeights(container);
        },
      },
      });

      setTimeout(() => {
        if (swiper && swiper.update) {
          swiper.update();
        }
      }, 50);
    }, 100);
  }

  equalizeSlideHeights(container) {
  const slides = container.querySelectorAll(".swiper-slide");
  let maxHeight = 0;

  // Reset heights first
  slides.forEach(slide => {
    slide.style.height = "auto";
  });

  // Find tallest slide
  slides.forEach(slide => {
    maxHeight = Math.max(maxHeight, slide.offsetHeight);
  });

  // Apply tallest height to all
  slides.forEach(slide => {
    slide.style.height = `${maxHeight}px`;
  });
}

  containsArabic(text) {
    if (!text) return false;
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicPattern.test(text);
  }

  getLanguage() {
    const storedLanguage = localStorage.getItem("language");
    return ["fr", "ar"].includes(storedLanguage) ? storedLanguage : "fr";
  }

  getFontClass(text) {
    return this.containsArabic(text) ? "font-noto-kufi-arabic" : "font-rubik";
  }

  convertToLatinNumerals(text) {
    if (!text) return text;
    const arabicNumerals = "٠١٢٣٤٥٦٧٨٩";
    const latinNumerals = "0123456789";

    return text.replace(/[٠-٩]/g, (match) => {
      return latinNumerals[arabicNumerals.indexOf(match)];
    });
  }

  formatOfferForArabicDisplay(text) {
    if (!text) return "";
    const normalized = String(text).trim();
    const match = normalized.match(/^OOREDOO\s+(\d+)\s+X(\d+)$/i);
    if (match) {
      const [, amount, pack] = match;
      return `X${pack} ooredoo ${amount}`;
    }
    return normalized;
  }

  showOoredooModal(title = "", message = null, onConfirm = null) {
    const isArabic = this.getLanguage() === "ar";
    const lang = isArabic ? "ar" : "fr";
    const hook = document.createElement("div");
    hook.className = "fixed inset-0 z-[9999] flex items-center justify-center px-4";
    hook.style.backgroundColor = "#696969CC";

    const modal = document.createElement("div");
    modal.className = "relative bg-white dark:bg-[#2C2C2C]  rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl min-w-[320px] px-6 md:px-8 pt-8 pb-8 md:pb-12";

    const closeButton = document.createElement("button");
    closeButton.className = "absolute top-2 right-2 p-2 z-10";
    closeButton.setAttribute("aria-label", "Fermer");
    closeButton.innerHTML = `<img src="./assets/images/Close.svg" alt="close" style="width:25px;height:25px;display:block"/>`;
    closeButton.onclick = () => document.body.removeChild(hook);
    modal.appendChild(closeButton);

    const titleEl = document.createElement("div");
    titleEl.className = "font-rubik font-semibold text-ooredoo-red dark:text-white text-[22px] sm:text-[30px] uppercase text-center tracking-[-0.02em] mb-2";
    const displayTitle = isArabic ? this.formatOfferForArabicDisplay(title).replace("X6", "6X").replace("X9", "9X").replace("X12", "12X") : title;
    titleEl.innerText = displayTitle || (isArabic ? "تأكيد" : "Confirmer");
    modal.appendChild(titleEl);

    // Build offer details as an HTML string of <div> lines with data-field so you can edit markup
    const bodyEl = document.createElement("div");
    bodyEl.className = "dark:text-white text-[#262626] leading-snug text-center mx-auto mb-8";

    if (message) {
      bodyEl.innerHTML = message;
    } else if (newOredooModals[lang] && newOredooModals[lang][title]) {
      const offer = newOredooModals[lang][title];
      const parts = [];

      bodyEl.innerHTML = `
            <div class="">
              <p class="text-center mb-8 font-semibold">${offer.topText}</p>
              <div class="flex flex-col gap-4 px-4 xs:px-28">
                <div class="flex items-center gap-2">
                  <img src="./assets/images/internet.png" alt="${offer.name}" class="w-8 h-8"/>
                  <p class="${isArabic ? 'text-right' : 'text-left'}">${offer.internet}</p>             
                </div>
                <div class="flex items-center gap-2">
                  <img src="./assets/images/fav.png" alt="${offer.name}" class="w-8 h-8"/>
                  <p class="${isArabic ? 'text-right' : 'text-left'}">${offer.fav}</p>             
                </div>
                ${offer.calls ? `<div class="flex items-center gap-2">
                  <img src="./assets/images/calls.png" alt="${offer.name}" class="w-8 h-8"/>
                  <p class="${isArabic ? 'text-right' : 'text-left'}">${offer.calls}</p>             
                </div>` : ''}
                ${offer.sms ? `<div class="flex items-center gap-2">
                  <img src="./assets/images/sms.png" alt="${offer.name}" class="w-8 h-8"/>
                  <p class="${isArabic ? 'text-right' : 'text-left'}">${offer.sms}</p>             
                </div>` : ''}
                <div class="flex items-center gap-2">
                  <img src="./assets/images/duration.png" alt="${offer.name}" class="w-8 h-8"/>
                  <p class="${isArabic ? 'text-right' : 'text-left'}">${offer.duration}</p>             
                </div>
                ${offer.bonus ? `<div class="flex items-center gap-2">
                  <img src="./assets/images/internet.png" alt="${offer.name}" class="w-8 h-8"/>
                  <p class="${isArabic ? 'text-right' : 'text-left'}">${offer.bonus}</p>             
                </div>` : ''}
              </div>
            </div>`
    } else {
      bodyEl.innerHTML = isArabic ? "هل أنت متأكد من الشراء؟" : "Êtes-vous sûr de vouloir acheter ?";
    }

    modal.appendChild(bodyEl);

    const footer = document.createElement("div");
    footer.className = "flex flex-row flex-nowrap justify-center gap-3";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "flex items-center justify-center rounded-full bg-white dark:bg-transparent border-2 border-[#ED1C24] dark:border-white text-[#ED1C24] dark:text-white font-semibold uppercase text-sm min-w-[8rem] sm:min-w-[10rem] py-2 px-5 transition";
    cancelBtn.id = "modal-cancel";
    cancelBtn.innerText = isArabic ? "إلغاء" : "Annuler";
    cancelBtn.onclick = () => document.body.removeChild(hook);

    const confirmBtn = document.createElement("button");
    confirmBtn.className = "flex items-center justify-center rounded-full bg-[#e50012] text-white font-semibold uppercase text-sm min-w-[8rem] sm:min-w-[10rem] py-2 px-5";
    confirmBtn.id = "modal-confirm";
    confirmBtn.innerText = isArabic ? "تأكيد" : "Confirmer";
    // Show felicitation modal after confirming
    const showFelicitationModal = (felicityText, offerObj) => {
      const okHook = document.createElement('div');
      okHook.className = hook.className;
      okHook.style.backgroundColor = hook.style.backgroundColor;

      const okModal = document.createElement('div');
      okModal.className = modal.className;

      const okClose = document.createElement('button');
      okClose.className = "absolute top-2 right-2 p-2 z-10";
      okClose.setAttribute('aria-label', isArabic ? 'إغلاق' : 'Fermer');
      okClose.innerHTML = closeButton.innerHTML;
      okClose.onclick = () => { if (okHook.parentNode) document.body.removeChild(okHook); };
      okModal.appendChild(okClose);

      const okTitleEl = document.createElement('div');
      okTitleEl.className = `${isArabic ? 'font-noto-kufi-arabic' : 'font-rubik'} font-semibold text-ooredoo-red dark:text-white text-[22px] sm:text-[30px] uppercase text-center tracking-[-0.02em] mb-2`;
      okTitleEl.innerText = isArabic ? 'هنيئا!' : 'Félicitations !';
      okModal.appendChild(okTitleEl);

      const okBody = document.createElement('div');
      okBody.className = bodyEl.className;

      // Reuse the same structure as the main Ooredoo modal: topText + rows with icons and text
      const o = offerObj || (newOredooModals && newOredooModals[lang] && newOredooModals[lang][title]) || null;
      const topLine = felicityText || (o && o.felicity) || (o && o.topText) || '';

      okBody.innerHTML = `
        <div class="">
          <p class="text-center mb-8 font-semibold">${topLine}</p>
          <div class="flex flex-col gap-4 px-4 xs:px-28">
            ${o && o.internet ? `<div class="flex items-center gap-2"><img src="./assets/images/internet.png" alt="${title}" class="w-8 h-8"/><p class="${isArabic ? "text-right" : "text-left"}">${o.internet}</p></div>` : ''}
            ${o && o.fav ? `<div class="flex items-center gap-2"><img src="./assets/images/fav.png" alt="${title}" class="w-8 h-8"/><p class="${isArabic ? "text-right" : "text-left"}">${o.fav}</p></div>` : ''}
            ${o && o.calls ? `<div class="flex items-center gap-2"><img src="./assets/images/calls.png" alt="${title}" class="w-8 h-8"/><p class="${isArabic ? "text-right" : "text-left"}">${o.calls}</p></div>` : ''}
            ${o && o.sms ? `<div class="flex items-center gap-2"><img src="./assets/images/sms.png" alt="${title}" class="w-8 h-8"/><p class="${isArabic ? "text-right" : "text-left"}">${o.sms}</p></div>` : ''}
            ${o && o.duration ? `<div class="flex items-center gap-2"><img src="./assets/images/duration.png" alt="${title}" class="w-8 h-8"/><p class="${isArabic ? "text-right" : "text-left"}">${o.duration}</p></div>` : ''}
            ${o && o.bonus ? `<div class="flex items-center gap-2"><img src="./assets/images/internet.png" alt="${title}" class="w-8 h-8"/><p class="${isArabic ? "text-right" : "text-left"}">${o.bonus}</p></div>` : ''}
            </div>
            <div>
              <p class="text-center text-sm text-[#7F7F7F] font-medium pt-10 px-8">
                ${isArabic ? 
                  "استفد من عروض حصرية على My Ooredoo عند كل عملية شراء تقوم بها. حمّل التطبيق هنا: " 
                  :
                  "Pour tes prochains achats, profite d'offres exclusives sur My Ooredoo. Télécharge l'application ici :" 
                }
              </p>
              <a href="http://ore.do/myo" target="_blank" rel="noopener noreferrer" class="text-ooredoo-red dark:text-white text-center text-sm font-medium">
                http://ore.do/myo
              </a>
            </div>
        </div>
      `;
      okModal.appendChild(okBody);

      const okFooter = document.createElement('div');
      okFooter.className = 'flex justify-center';

      const okBtn = document.createElement('button');
      okBtn.className = "flex items-center justify-center rounded-full bg-[#e50012] text-white font-semibold uppercase text-sm min-w-[8rem] sm:min-w-[10rem] py-2 px-5";
      okBtn.innerText = isArabic ? 'تم' : 'OK';
      okBtn.onclick = () => { if (okHook.parentNode) document.body.removeChild(okHook); };

      okFooter.appendChild(okBtn);
      okModal.appendChild(okFooter);

      okHook.appendChild(okModal);
      okHook.onclick = (e) => { if (e.target === okHook && okHook.parentNode) document.body.removeChild(okHook); };
      document.body.appendChild(okHook);
    };

    confirmBtn.onclick = () => {
      // close confirm modal
      if (hook.parentNode) document.body.removeChild(hook);
      // run provided confirm callback if any
      try { if (typeof onConfirm === "function") onConfirm(); } catch (e) { console.error(e); }

      // determine felicity text from modal data
      const felicity = (newOredooModals && newOredooModals[lang] && newOredooModals[lang][title] && newOredooModals[lang][title].felicity)
        || (ModalData && ModalData[lang] && ModalData[lang][title] && (ModalData[lang][title].success || ModalData[lang][title].confirm))
        || (isArabic ? 'تم التفعيل !' : 'Forfait activé !');

      showFelicitationModal(felicity);
    };

    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);
    modal.appendChild(footer);

    hook.appendChild(modal);

    hook.onclick = (e) => {
      if (e.target === hook) {
        if (hook.parentNode) document.body.removeChild(hook);
      }
    };

    document.body.appendChild(hook);
  }
}
