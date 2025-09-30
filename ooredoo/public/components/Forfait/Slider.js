import ForfaitData from "./ForfaitData.js";

export class Slider {
  constructor(parameters) {
    this.currentLang = this.getLanguage();
    this.boundHandlers = {
      languageChange: this.handleLanguageChange.bind(this),
      //resize: this.handleResize.bind(this),
    };
    this.setupEventListeners();
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
      <div class="h-[600px] sm:h-auto relative w-full max-w-[350px] flex flex-col mx-auto overflow-hidden">
        <div class="mb-2 h-[45px] flex items-center gap-1 justify-center text-ooredoo-red dark:text-white bg-[#ED1C2421] dark:bg-[#ED1C2421]/60 rounded-full font-semibold text-center">
          <span dir="ltr" class="font-rubik">
          ${offer.topLabel}
          <span class="${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}">${isRTL ? "وفّروا" : "D'ÉCONOMIE"}</span>
          </span>
        </div>
        <div class="h-full bg-white dark:bg-[#2C2C2C] pb-6 rounded-xl border-[1px] border-ooredoo-red dark:border-white"}>
          <div class="h-14 bg-ooredoo-red dark:border-ooredoo-red -m-[1px] flex items-center justify-center rounded-t-xl">
            <h2 class="text-white font-bold text-[20px] md:text-[25px]  text-center capitalize dark:text-white leading-tight">
              <span class="font-rubik">${offer.price}</span> ${currencyLabel}
            </h2>
          </div>

          <div class="flex-1 h-[260px] sm:h-auto py-4 text-center border-b-[1px] border-b-[#BBBEBE] border-dashed">
            <p>${this.currentLang === "ar" ? "قوموا بشراء" : "Payez"}</p>
            <p class="text-ooredoo-red text-xl font-bold">
              <span class="font-rubik">${offer.sub}</span>
              ${this.currentLang === "ar" ? "اشتراكات" : "forfaits"}
            </p>
            <p class="font-semibold text-lg md:text-xl font-rubik">Ooredoo 500</p>
            <p>${isRTL ? "و" : "&"}</p>
            <p>${this.currentLang === "ar" ? "احصلوا على" : "Obtenez"}</p>
            <p class="text-ooredoo-red font-bold text-xl">
              <span>${offer.free}</span>
              ${this.currentLang === "ar" ? "مجانا" : "gratuits"} !
            </p>
          </div>

          <div class="py-4 px-2 flex items-center justify-between">
            <div class="text-center">
              <p class="text-sm">${this.currentLang === "ar" ? "احصلوا على" : "Recevez"}</p>
              <p class="font-semibold text-lg md:text-xl"><span class="font-rubik">12</span> ${this.currentLang === "ar" ? "اشتراك" : "forfaits"}</p>
            </div>
            <div class="text-center">
              <p class="text-[#7F7F7F] font-semibold text-xl">
                <span class="font-rubik line-through decoration-red-500">${offer.oldPrice}</span> <span class="text-sm">${currencyLabel}</span>
              </p>
              <p class="font-semibold text-2xl md:text-3xl"><span class="font-rubik">${offer.price}</span> ${currencyLabel}</p>
            </div>
          </div>

          <div class="text-center text-sm px-6">
            <p>${isRTL ? "يتم تجديد اشتراك <span class='font-rubik'>Ooredoo</span> تلقائيًا كل <span class='font-rubik'>4</span> أسابيع" : "Forfait renouvelable automatiquement chaque 4 semaines"}</p>
          </div>

          <div class="forfait-card-footer pt-4">
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

  createOoredooCard(offer, index, labels) {
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
      <div class="h-[620px] sm:h-auto relative w-full max-w-[300px] flex flex-col mx-auto overflow-hidden">
        ${offer.hasTopLabel ?`
          <div class="mb-2 h-[50px] flex items-center gap-1 justify-center dark:text-white bg-[#F1C4004D] dark:bg-[#F1C400]/60 rounded-full font-semibold text-center py-2 px-1">
            <span class="text-[12px] md:text-[15px]">
            ${offer.topLabel}
            </span>
        </div>` : 
        `
        <div class="mb-2 h-[50px] flex items-center gap-1 justify-center text-ooredoo-red dark:text-white bg-transparent rounded-full font-semibold text-center">
          
        </div>`}
        <div class="h-full bg-white dark:bg-[#2C2C2C] pb-6 rounded-xl border-[1px] border-ooredoo-red dark:border-white"}>
          <div class="h-14 bg-ooredoo-red dark:border-ooredoo-red -m-[1px] flex items-center justify-center rounded-t-xl">
            <h2 class="text-white font-bold text-[20px] md:text-[25px]  text-center capitalize dark:text-white leading-tight">
              <span class="font-rubik">
                ${index === 1 ? 
                  `<span class="font-rubik">
                    <span class="font-rubik">4990 DA</span>
                  </span>` 
                  : 
                  offer.name}
              </span> 
            </h2>
          </div>

          <div class="flex-1 justify-center items-center text-center pt-8">
            <span class="text-[40px] sm:text-[55px] text-ooredoo-red dark:text-white font-semibold font-rubik">${offer.data}</span>
            <span>${isRTL ? "إنترنت" : "Internet"}</span>
          </div>

          <div class="space-y-4 py-8 px-5 border-b-[1px] border-b-[#BBBEBE] h-[180px] border-dashed">
            ${
              offer.features.map(feature => `
                <div class="flex items-center gap-2">
                  <span class="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#ED1C24"/>
                      <path d="M6.58997 4.55566C6.58997 4.00338 7.03768 3.55566 7.58997 3.55566H8.18997C8.74225 3.55566 9.18997 4.00338 9.18997 4.55566V11.2223C9.18997 11.7746 8.74225 12.2223 8.18997 12.2223H7.58997C7.03768 12.2223 6.58997 11.7746 6.58997 11.2223V4.55566Z" fill="white"/>
                      <path d="M3.55591 7.58887C3.55591 7.03658 4.00362 6.58887 4.55591 6.58887H11.2226C11.7749 6.58887 12.2226 7.03658 12.2226 7.58887V8.18887C12.2226 8.74115 11.7749 9.18887 11.2226 9.18887H4.55591C4.00362 9.18887 3.55591 8.74115 3.55591 8.18887V7.58887Z" fill="white"/>
                    </svg>
                  </span>
                  <span>${feature}</span>
                </div>
            `).join('')}
          </div>

          <div class="p-4 flex items-center justify-between">
            <div class="text-center">
            ${
              index === 0 ?               
              `<p class="text-sm">${this.currentLang === "ar" ? "الكل صالح لمدة" : "Valables"}</p>` : ""

            }
            ${
              index === 1 ?               
              `<p class="text-sm">${this.currentLang === "ar" ? "استفيدوا من" : "Recevez"}</p>` : ""

            }
            ${
              index === 0 ? 
              `<p class="font-semibold text-lg md:text-xl"><span class="font-rubik">4</span> ${this.currentLang === "ar" ? "أسابيع" : "Semaines"}</p>` : ""
            }
            ${
              index === 1 ? 
              `<p class="font-semibold text-lg md:text-xl whitespace-nowrap"><span class="font-rubik">11</span> ${this.currentLang === "ar" ? "اشتراك" : "forfaits"}</p>
              ` : ""
            }
            </div>
            <div class="text-center">
              <p class="font-semibold text-2xl md:text-3xl"><span class="font-rubik">${offer.price}</span> ${currencyLabel}</p>
            </div>
          </div>

          <div class="text-center text-sm px-6">
          ${index===1  ?
          `<p class='h-[50px] sm:h-[30px]'>${isRTL ? "يتم تجديد اشتراك <span class='font-rubik'>Ooredoo</span> تلقائيًا كل <span class='font-rubik'>4</span> أسابيع" : "Forfait renouvelable automatiquement chaque 4 semaines"}</p>` : "<p class='h-[50px] sm:h-[30px]'></p>"}
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
              <h2 class="font-medium text-2xl text-center capitalize dark:text-white leading-tight">
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
                  `<span class="font-noto-kufi-arabic">انترنت</span>`
                  :
                  `<span class="font-rubik">Internet</span>`
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
            <div class="flex items-baseline justify-center mt-8">
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
      <div class="${
        index - 12 === 2 && "md:col-span-2 md:justify-self-center lg:col-span-1 lg:justify-self-auto"
      }relative bg-white pb-6 dark:bg-[#2C2C2C] rounded-xl flex flex-col w-full mx-auto forfait-card-shadow overflow-hidden" style="max-width: 340px;">
        <div class="h-full flex flex-col justify-between" ${isRTL ? `dir="rtl"` : ``}>
          <div class="">
            <div class="border-b-[1px] border-b-[#BBBEBE] border-dashed text-center py-3">
              <h2 class="font-medium text-2xl text-center capitalize dark:text-white leading-tight">
                ${isRTL ? "اشتراك" : "INTERNET"} <span class="font-rubik">${offer.price}</span>
              </h2>
            </div>
            <div class="mt-6 px-4 text-xl">
              <h3 class="text-ooredoo-red dark:text-white font-semibold text-[28px]">
                 <span class="font-rubik">${offer.data}</span>
                 ${isRTL ?
                  `<span class="font-noto-kufi-arabic">انترنت</span>`
                  :
                  `<span class="font-rubik">Internet</span>`
                 }
              </h3>
              <div class="space-y-4 mt-8 h-[60px]">
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
            <div class="flex items-baseline justify-center mt-8">
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
                        ${this.createOoredooCard(offer, index, labels, isRTL, convertToLatinNumerals)}
                    </div>
                    `
                      )
                      .join("")}
                    ${offers
                      .map(
                        (offer, index) => `
                    <div class="swiper-slide flex justify-center p-4">
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
            <div 
              class="grid grid-cols-1 md:grid-cols-2 justify-center gap-5 max-w-[1000px]"
            > 
              ${offers.map((offer, index) => this.createOoredooCard(offer, startIndex + index, labels, isRTL, convertToLatinNumerals)).join("")}
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
            <div class="forfait-grid gap-5 items-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-2">
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
    const startIndex = 12;

    return `
          <div class="hidden sm:flex w-full items-center justify-center">
            <div class="gap-5 items-stretch grid grid-cols-1 md:grid-cols-2">
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
        slidesPerView: 1.3,
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
}
