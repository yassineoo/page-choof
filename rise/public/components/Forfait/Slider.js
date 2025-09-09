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
      <div class="relative bg-white dark:bg-[#2C2C2C] rounded-xl flex flex-col w-full mx-auto forfait-card-shadow overflow-hidden" style="max-width: 300px;">
        <div class="h-full pb-6" ${isRTL ? `dir="rtl"` : ``}>
          <div class="h-14 bg-ooredoo-red flex items-center justify-center">
            <h2 class="${titleFontClass} text-white font-medium text-center capitalize dark:text-white leading-tight">
              ${offer.name}
            </h2>
          </div>

          <div class="flex-1 text-center border-b-[1px] border-b-[#BBBEBE] border-dashed">
            <div class="flex items-center justify-center">
              <h3 class="${dataFontClass} py-7 px-5 text-4xl font-semibold text-ooredoo-red dark:text-white ${textAlign} leading-10">${offer.data}</h3>
            </div>
          </div>

          <div class="forfait-card-footer pt-4">
            <div class="flex justify-center items-baseline w-full mb-4">
              <div class="flex items-baseline justify-center" style="width:70%;">
                <span class="${priceFontClass} font-bold mx-2 text-[27.96px] leading-none text-black dark:text-white">${priceNumber}</span>
                <span class="${priceFontClass} font-semibold text-base leading-none text-black dark:text-white whitespace-nowrap">${currencyLabel}</span>
                <span class="${priceFontClass} font-semibold leading-none text-black dark:text-white whitespace-nowrap ${
      durationText.includes("cycle") ? "text-xs" : "text-base"
    }">/${durationText}</span>
              </div>
            </div>

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
    const titleFontClass = this.getFontClass(offer.name);
    const dataFontClass = this.getFontClass(offer.data);
    const buttonFontClass = this.getFontClass(buyLabel);

    const priceNumber = this.convertToLatinNumerals(offer.price.replace(/[^0-9٠-٩]/g, ""));
    const durationText = this.convertToLatinNumerals(offer.duration);

    const priceFontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

    return `
      <div class="relative md:w-[340px] flex flex-col mx-auto overflow-hidden">
        <div class="mb-2 h-[45px] flex items-center justify-center text-ooredoo-red bg-[#ED1C2421] rounded-full font-semibold text-center uppercase">
          ${offer.topLabel}
        </div>
        <div class="h-full bg-white dark:bg-[#2C2C2C] pb-6 rounded-xl border-[1px] border-ooredoo-red"}>
          <div class="h-14 bg-ooredoo-red flex items-center justify-center rounded-t-xl">
            <h2  class="text-white font-medium text-center capitalize dark:text-white leading-tight">
              ${offer.price} ${currencyLabel}
            </h2>
          </div>

          <div class="flex-1 text-center">
            <div class="flex items-center justify-center">
              <h3 class=" py-2 px-5 text-4xl font-semibold text-ooredoo-red dark:text-white ${textAlign} leading-10">${offer.data}</h3>
            </div>
          </div>

          <div class="flex-1 py-4 text-center border-b-[1px] border-t-[1px] border-t-[#BBBEBE] border-b-[#BBBEBE] border-dashed">
            <p>${this.currentLang === 'ar' ? "قوموا بشراء" : "Payez"}</p>
            <p class="text-ooredoo-red text-xl font-bold">${this.currentLang === 'ar' ? "10 اشتراكات" : "10 forfaits"}</p>
            <p class="font-bold text-xl">Ooredoo Internet ${offer.price}</p>
            <p>${isRTL ? "و" : "&"}</p>
            <p>${this.currentLang === 'ar' ? "احصلوا على" : "Obtenez"}</p>
            <p class="text-ooredoo-red font-bold text-xl">${this.currentLang === 'ar' ? "اشتراكين مجانا" : "2 gratuits"} !</p>
          </div>

          <div class="p-4 flex items-center justify-between">
            <div class="text-center">
              <p class="text-sm">${this.currentLang === 'ar' ? "احصلوا على" : "Recevez"}</p>
              <p class="font-bold text-xl">${this.currentLang === 'ar' ? "12 اشتراك" : "12 forfaits"}</p>
            </div>
            <div class="text-center">
              <p class="text-[#7F7F7F] font-bold text-xl line-through decoration-red-500">
                ${offer.oldPrice} ${currencyLabel}
              </p>
              <p class="font-bold text-3xl">${offer.price} ${currencyLabel}</p>
            </div>
          </div>

          <div class="text-center text-sm px-6">
            <p>${isRTL ? "يتم تجديد الاشتراك تلقائيًا كل 4 أسابيع " : "Forfait renouvelable automatiquement chaque 4 semaines"}</p>
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

  createForfaitCardHadra(offer, index, labels) {
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
      <div class="${(index-12) === 2 && "md:col-span-2 md:justify-self-center lg:col-span-1 lg:justify-self-auto"}relative bg-white px-4 py-6 dark:bg-[#2C2C2C] rounded-xl flex flex-col w-full mx-auto forfait-card-shadow overflow-hidden" style="max-width: 300px;">
        <div class="h-full flex flex-col justify-between" ${isRTL ? `dir="rtl"` : ``}>
          <div class="">
            <div class="h-12 border-b-[1px] border-b-[#BBBEBE] border-dashed flex items-center justify-center">
              <h2 class="font-bold text-2xl text-center capitalize dark:text-white leading-tight">
                ${offer.price} ${currencyLabel}
              </h2>
            </div>
            <div class="h-24 text-center flex items-center justify-center text-xl">
              <p>${offer.data}</p>
            </div>
            <div class="text-center">
              <p class="font-bold text-3xl py-4">${offer.price} ${currencyLabel}</p>
              <p class="text-sm">${isRTL ? "" : "Suit la validité du forfait en cours"}</p>
            </div>
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

  generateDots(totalDots, activeIndex) {
    return Array.from(
      { length: totalDots },
      (_, index) =>
        `<button class="forfait-dot ${index === activeIndex ? "active" : ""}" 
                data-slide="${index}" 
                aria-label="Slide ${index + 1}"></button>`
    ).join("");
  }

  createResponsiveLayout(offers, labels, gridType, isRTL, convertToLatinNumerals) {
    const gridClass = gridType === "forfait-grid-5" ? "forfait-grid-5" : "forfait-grid-3";
    const sliderId = gridType === "forfait-grid-5" ? "forfaits-slider" : "smart-slider";
    const dotsId = gridType === "forfait-grid-5" ? "forfaits-dots" : "smart-dots";
    const startIndex = gridType === "forfait-grid-5" ? 0 : ForfaitData[this.currentLang].forfaits.length;

    return `
          <div class="hidden sm:flex w-full items-center justify-center">
            <div class="gap-5 grid gap-y-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center max-w-[1000px]">
              ${offers.map((offer, index) => this.createForfaitCard(offer, startIndex + index, labels, isRTL, convertToLatinNumerals)).join("")}
            </div>
          </div>
      
            
            <div class="block md:hidden forfait-mobile-slider forfait-mobile-container" id="${sliderId}">
                <div class="relative swiper">
                <div class="swiper-wrapper">
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

  createResponsiveLayoutInternet(offers, labels, gridType, isRTL, convertToLatinNumerals) {
    const gridClass = gridType === "forfait-grid-5" ? "forfait-grid-5" : "forfait-grid-3";
    const sliderId = gridType === "forfait-grid-5" ? "forfaits-slider" : "internet-slider";
    const dotsId = gridType === "forfait-grid-5" ? "forfaits-dots" : "smart-dots";
    const startIndex = 6

    return `
          <div class="hidden sm:flex w-full items-center justify-center">
            <div class="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              ${offers.map((offer, index) => this.createForfaitCardInternet(offer, startIndex + index, labels, isRTL, convertToLatinNumerals)).join("")}
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

  createResponsiveLayoutHadra(offers, labels, gridType, isRTL, convertToLatinNumerals) {
    const sliderId = gridType === "forfait-grid-5" ? "forfaits-slider" : "hadra-slider";
    const startIndex = 12;

    return `
          <div class="hidden sm:flex w-full items-center justify-center">
            <div class="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              ${offers.map((offer, index) => this.createForfaitCardHadra(offer, startIndex + index, labels, isRTL, convertToLatinNumerals)).join("")}
            </div>
          </div>
      
            
            <div class="block md:hidden forfait-mobile-slider forfait-mobile-container" id="${sliderId}">
                <div class="relative swiper">
                <div class="swiper-wrapper">
                    ${offers
                      .map(
                        (offer, index) => `
                    <div class="swiper-slide flex justify-center p-4">
                        ${this.createForfaitCardHadra(offer, startIndex + index, labels, isRTL, convertToLatinNumerals)}
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
        spaceBetween: 10,
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
      });

      setTimeout(() => {
        if (swiper && swiper.update) {
          swiper.update();
        }
      }, 50);
    }, 100);
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
