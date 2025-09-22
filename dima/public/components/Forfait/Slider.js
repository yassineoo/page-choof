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
    window.removeEventListener(
      "languageChanged",
      this.boundHandlers.languageChange
    );
    window.addEventListener(
      "languageChanged",
      this.boundHandlers.languageChange
    );

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
    const buyLabel =
      (labels && labels.buy) || offer.buy || (isRTL ? "شراء" : "Acheter");
    const currencyLabel = isRTL ? "دج" : "DA";

    const cardHeightClass =
      offer.height === "short" ? "h-[365px]" : "h-[460px]";

    const priceNumber = this.convertToLatinNumerals(
      String(offer.price ?? "").replace(/[^0-9٠-٩]/g, "")
    );
    const durationText = this.convertToLatinNumerals(offer.duration || "");

    return `
    <div class="w-[290px] ${cardHeightClass} flex justify-center items-start rounded-xl border-[0.84px] border-[#C5C5C5] bg-white dark:bg-[#2C2C2C] shadow-sm dark:shadow-none">
      <div class="flex flex-col justify-between items-center flex-1 h-full pb-6">
        <div class="flex flex-col items-start gap-3.5 w-full px-[0.9px]">
          <div class="flex h-14 px-2.5 justify-center items-center  w-full rounded-t-[11px] bg-ooredoo-red">
            <h3 class="text-white text-center font-rubik text-2xl font-bold capitalize">
              ${offer.name}
            </h3>
          </div>

          <div class="flex px-5 items-center w-full">
            <div class="text-ooredoo-red font-rubik text-[26px] font-bold leading-[45px] tracking-[-0.52px]">
              ${offer.data}
            </div>
          </div>

          <div class="flex px-5 flex-col items-start gap-1.5 w-full">
            ${
              offer.features && offer.features.length
                ? offer.features
                    .map(
                      (feature) => `
                  <div class="flex items-center gap-2.5 w-full">
                    <div>
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
                    </div>
                    <div class="flex-1 text-black dark:text-white font-rubik text-base font-normal leading-[22px]">
                      ${feature}
                    </div>
                  </div>`
                    )
                    .join("")
                : ``
            }
          </div>
        </div>

        <div class="flex flex-col items-center gap-5 w-full">
          <div class="w-[290px] border-b-[1px] border-b-[#BBBEBE] dark:border-b-gray-600 border-dashed text-center py-3"></div>
          <div class="flex flex-col justify-end items-center gap-2.5">
            <div class="text-black dark:text-white text-center font-rubik font-bold text-base">
              <span class="text-[28px]">${priceNumber}</span>
              <span class="text-[16px]"> ${currencyLabel}/${durationText}</span>
            </div>
            <button class="forfait-buy-btn bg-ooredoo-red text-white border-none rounded-full cursor-pointer"
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
              data-type="forfait"
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

    const priceNumber = this.convertToLatinNumerals(
      offer.price.replace(/[^0-9٠-٩]/g, "")
    );
    const durationText = this.convertToLatinNumerals(offer.duration);

    const priceFontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

    return `
      <div class="${
        index - 12 === 2 &&
        "md:col-span-2 md:justify-self-center lg:col-span-1 lg:justify-self-auto"
      }relative bg-white pb-6 dark:bg-[#2C2C2C] rounded-xl flex flex-col w-full mx-auto forfait-card-shadow overflow-hidden" style="max-width: 340px;">
        <div class="h-full flex flex-col justify-between" ${
          isRTL ? `dir="rtl"` : ``
        }>
          <div class="">
            <div class="border-b-[1px] border-b-[#BBBEBE] border-dashed text-center py-3">
              <h2 class="font-medium text-2xl text-center capitalize dark:text-white leading-tight">
                ${isRTL ? "اشتراك" : "Forfait"} <span class="font-rubik">${
      offer.price
    }</span>
              </h2>
            </div>
            <div class="h-[54px] mt-6 px-4 text-xl">
              <h3 class="text-ooredoo-red font-semibold text-[28px]">
                 <span class="font-rubik">${offer.data}</span>
                 ${
                   isRTL
                     ? `<span class="font-noto-kufi-arabic">انترنت</span>`
                     : `<span class="font-rubik">Internet</span>`
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
              <span class="font-rubik font-semibold mx-2 text-[28px] leading-none text-black dark:text-white">${priceNumber}</span>
                <span class="text-[16px] text-black dark:text-white font-semibold "> ${currencyLabel}/${durationText}</span>
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
     data-type="internet"
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

    const priceNumber = this.convertToLatinNumerals(
      offer.price.replace(/[^0-9٠-٩]/g, "")
    );
    const priceFontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";
    return `
      <div class="${
        index - 11 === 2 &&
        "md:col-span-2 md:justify-self-center lg:col-span-1 lg:justify-self-auto"
      }relative bg-white pb-6 dark:bg-[#2C2C2C] rounded-xl flex flex-col w-full mx-auto forfait-card-shadow overflow-hidden" style="max-width: 340px;">
        <div class="h-full flex flex-col justify-between" ${
          isRTL ? `dir="rtl"` : ``
        }>
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
                ${offer.features
                  .map(
                    (f) =>
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
                  )
                  .join("")}
              </div>
              <div class="flex items-baseline justify-center mt-20">
              <span class="font-rubik font-semibold mx-2 text-[27.96px] leading-none text-black dark:text-white">${priceNumber}</span>
                 <span class="text-[16px] text-black dark:text-white font-semibold "> ${currencyLabel}/${durationText}</span>
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
     data-type="smart"
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

  createResponsiveLayout(
    offers,
    labels,
    gridType,
    isRTL,
    convertToLatinNumerals
  ) {
    const sliderId = "forfaits-slider";
    const dotsId = "forfaits-dots";

    return `
    <div class="hidden sm:flex w-full items-center justify-center">
      <div class="flex justify-center items-center content-center gap-4 sm:gap-6 lg:gap-[18px] flex-wrap max-w-[1215px]">
        ${offers
          .map((offer, i) => this.createForfaitCard(offer, i, labels))
          .join("")}
      </div>
    </div>

    <div class="block md:hidden forfait-mobile-slider forfait-mobile-container" id="${sliderId}">
      <div class="forfait-slider-track">
        <div class="relative swiper">
          <div class="swiper-wrapper">
            ${offers
              .map(
                (offer, i) => `
              <div class="swiper-slide flex justify-center p-4">
                ${this.createForfaitCard(offer, i, labels)}
              </div>
            `
              )
              .join("")}
          </div>
          <div class="absolute bottom-0 swiper-pagination"></div>
        </div>
      </div>
    </div>

    <div id="${dotsId}" class="forfait-dots hidden md:block" aria-hidden="true"></div>
  `;
  }

  createResponsiveLayoutInternet(
    offers,
    labels,
    gridType,
    isRTL,
    convertToLatinNumerals
  ) {
    const sliderId = "internet-slider";
    const dotsId = "internet-dots";

    return `
    <div class="hidden sm:flex w-full items-center justify-center">
      <div class="gap-5 items-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        ${offers
          .map((offer, index) =>
            this.createForfaitCardInternet(
              offer,
              index,
              labels,
              isRTL,
              convertToLatinNumerals
            )
          )
          .join("")}
      </div>
    </div>

    <div class="block md:hidden forfait-mobile-slider forfait-mobile-container" id="${sliderId}">
      <div class="forfait-slider-track">
        <div class="relative swiper">
          <div class="swiper-wrapper">
            ${offers
              .map(
                (offer, index) => `
              <div class="swiper-slide flex justify-center p-4">
                ${this.createForfaitCardInternet(
                  offer,
                  index,
                  labels,
                  isRTL,
                  convertToLatinNumerals
                )}
              </div>
            `
              )
              .join("")}
          </div>
          <div class="absolute bottom-0 swiper-pagination"></div>
        </div>
      </div>
    </div>

    <div id="${dotsId}" class="forfait-dots hidden md:block" aria-hidden="true"></div>
  `;
  }

  createResponsiveLayoutSmart(
    offers,
    labels,
    gridType,
    isRTL,
    convertToLatinNumerals
  ) {
    const sliderId = "smart-slider";
    const dotsId = "smart-dots";

    return `
    <div class="hidden sm:flex w-full items-center justify-center">
      <div class="gap-5 items-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        ${offers
          .map((offer, index) =>
            this.createForfaitCardSmart(
              offer,
              index,
              labels,
              isRTL,
              convertToLatinNumerals
            )
          )
          .join("")}
      </div>
    </div>

    <div class="block md:hidden forfait-mobile-slider forfait-mobile-container" id="${sliderId}">
      <div class="forfait-slider-track">
        <div class="relative swiper">
          <div class="swiper-wrapper">
            ${offers
              .map(
                (offer, index) => `
              <div class="swiper-slide flex justify-center p-4">
                ${this.createForfaitCardSmart(
                  offer,
                  index,
                  labels,
                  isRTL,
                  convertToLatinNumerals
                )}
              </div>
            `
              )
              .join("")}
          </div>
          <div class="absolute bottom-0 swiper-pagination"></div>
        </div>
      </div>
    </div>

    <div id="${dotsId}" class="forfait-dots hidden md:block" aria-hidden="true"></div>
  `;
  }

  initSwiper(containerId, forceRTL = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
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
    slides.forEach((slide) => {
      slide.style.height = "auto";
    });

    // Find tallest slide
    slides.forEach((slide) => {
      maxHeight = Math.max(maxHeight, slide.offsetHeight);
    });

    // Apply tallest height to all
    slides.forEach((slide) => {
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
