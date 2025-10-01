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
      <div class="relative bg-white dark:bg-[#2C2C2C] rounded-xl flex flex-col w-full mx-auto forfait-card-shadow overflow-hidden" style="max-width: 400px;">
        <div class="h-full pb-6" ${isRTL ? `dir="rtl"` : ``}>
          <div class="h-14 -mx-[0.84px] bg-ooredoo-red flex items-center justify-center p-5">
            <h2 class="text-white font-rubik text-xl md:text-2xl font-medium text-center capitalize dark:text-white leading-tight">
              ${offer.name}
            </h2>
          </div>

          <div class="flex-1 px-5 pb-4 border-b-[1px] border-b-[#BBBEBE] border-dashed">
            <div class="">
              <h3 class="py-4 text-[26px] font-semibold text-ooredoo-red dark:text-white leading-10">${offer.data}</h3>
              <div>
                ${offer.features && offer.features.length > 0 ? 
                  `<ul class="space-y-2">
                  ${offer.features.map((feature) => `
                    <li class="flex items-center gap-2 text-sm text-black dark:text-white">
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
                      <span class="text-[16px]">
                        ${feature}
                      </span>
                    </li>`).join("")}
                </ul>` : ``}
              </div>
            </div>
          </div>

          <div class="forfait-card-footer">
            <div class="flex justify-center items-baseline w-full mt-5">
              <div class="flex items-baseline justify-center" style="width:70%;">
                <span class="font-rubik font-semibold mx-2 text-[27.96px] leading-none text-black dark:text-white">${priceNumber}</span>
                <span class="${priceFontClass} font-semibold text-base leading-none text-black dark:text-white whitespace-nowrap">${currencyLabel}</span>
                <span class="${priceFontClass} font-semibold leading-none text-black dark:text-white whitespace-nowrap">/${durationText}</span>
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
                ${isRTL ? "اشتراك" : "Forfait"} <span class="font-rubik">${offer.price}</span>
              </h2>
            </div>
            <div class="h-[54px] mt-6 px-4 text-xl">
              <h3 class="text-ooredoo-red font-semibold text-[28px]">
                 <span class="font-rubik">${offer.data}</span>
                 ${isRTL ?
                  `<span class="font-noto-kufi-arabic">انترنت</span>`
                  :
                  `<span class="font-rubik">Internet</span>`
                 }
              </h3>
              <div class="flex items-center gap-2 mt-8">
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
                      <span class="text-[16px]">
                        ${offer.features}
                      </span>
              </div>
            </div>
            <div class="flex items-baseline justify-center mt-20">
              <span class="font-rubik font-semibold mx-2 text-[27.96px] leading-none text-black dark:text-white">${priceNumber}</span>
              <span class="${priceFontClass} font-semibold text-base leading-none text-black dark:text-white whitespace-nowrap">${currencyLabel}</span>
              <span class="${priceFontClass} font-semibold leading-none text-black dark:text-white whitespace-nowrap ${index === 10 && "text-sm font-medium"}">/${durationText}</span>
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

    const durationText = this.convertToLatinNumerals(offer.duration);
   
    const priceNumber = this.convertToLatinNumerals(offer.price.replace(/[^0-9٠-٩]/g, ""));
    const priceFontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";
    return `
      <div class="${
        index - 11 === 2 && "md:col-span-2 md:justify-self-center lg:col-span-1 lg:justify-self-auto"
      }relative bg-white pb-6 dark:bg-[#2C2C2C] rounded-xl flex flex-col w-full mx-auto forfait-card-shadow overflow-hidden" style="max-width: 340px;">
        <div class="h-full flex flex-col justify-between" ${isRTL ? `dir="rtl"` : ``}>
          <div class="">
            <div class="border-b-[1px] border-b-[#BBBEBE] border-dashed text-center py-3">
              <h2 class="font-rubik font-medium text-2xl text-center capitalize dark:text-white leading-tight">
                ${offer.name}
              </h2>
            </div>
            <div class="h-[54px] mt-6 px-4 text-xl">
              <h3 class="text-ooredoo-red font-semibold text-[28px]">
                 ${offer.data}
              </h3>
            </div>
            <div class="space-y-2 h-16">
                ${offer.features.map((f)=> (
                  `<div class="flex items-center gap-2 px-4">
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
                      <span class="text-[16px]">
                        ${f}
                      </span>
                  </div>`
                )).join("")}
              </div>
              <div class="flex items-baseline justify-center mt-20">
              <span class="font-rubik font-semibold mx-2 text-[27.96px] leading-none text-black dark:text-white">${priceNumber}</span>
              <span class="${priceFontClass} font-semibold text-base leading-none text-black dark:text-white whitespace-nowrap">${currencyLabel}</span>
              <span class="${priceFontClass} font-semibold leading-none text-black dark:text-white whitespace-nowrap">/${durationText}</span>
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

  createResponsiveLayout(offers, labels, gridType, isRTL, convertToLatinNumerals) {
    const gridClass = gridType === "forfait-grid-5" ? "forfait-grid-5" : "forfait-grid-3";
    const sliderId = gridType === "forfait-grid-5" ? "forfaits-slider" : "smart-slider";
    const dotsId = gridType === "forfait-grid-5" ? "forfaits-dots" : "smart-dots";
    const startIndex = 0;

    return `
          <div class="hidden sm:flex w-full items-center justify-center">
            <div class="grid items-stretch grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1000px]">
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
    const startIndex = 5;

    return `
          <div class="hidden sm:flex w-full items-center justify-center">
            <div class="gap-5 items-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
    const startIndex = 11;

    return `
          <div class="hidden sm:flex w-full items-center justify-center">
            <div class="gap-5 items-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
