export class Slider {
  constructor(parameters = {}) {
    this.params = parameters;

    this.currentLang = this.getLanguage();

    this.boundHandlers = {
      languageChange: this.handleLanguageChange.bind(this),
      resize: this.handleResize.bind(this),
    };

    this.languagePolling = null;
    this.languageChangeTimeout = null;
    this._resizeTimeout = null;

    this.setupEventListeners();
  }

  destroy() {
    window.removeEventListener(
      "languageChanged",
      this.boundHandlers.languageChange
    );
    window.removeEventListener("resize", this.boundHandlers.resize);

    if (this.languagePolling) {
      clearInterval(this.languagePolling);
      this.languagePolling = null;
    }
    if (this.languageChangeTimeout) {
      clearTimeout(this.languageChangeTimeout);
      this.languageChangeTimeout = null;
    }
    if (this._resizeTimeout) {
      clearTimeout(this._resizeTimeout);
      this._resizeTimeout = null;
    }
  }

  handleLanguageChange() {
    const newLanguage = this.getLanguage();
    if (newLanguage !== this.currentLang) {
      this.currentLang = newLanguage;
      const evt = new CustomEvent("sliderLanguageChanged", {
        detail: { language: this.currentLang },
      });
      window.dispatchEvent(evt);
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
  }

  setupLanguagePolling() {
    if (this.languagePolling) clearInterval(this.languagePolling);

    this.languagePolling = setInterval(() => {
      const currentLang = this.getLanguage();
      if (currentLang !== this.currentLang) {
        if (this.languageChangeTimeout)
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

  handleResize() {
    if (this._resizeTimeout) clearTimeout(this._resizeTimeout);
    this._resizeTimeout = setTimeout(() => {
      const evt = new CustomEvent("sliderResized", {});
      window.dispatchEvent(evt);
    }, 120);
  }

  containsArabic(text) {
    if (!text) return false;
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicPattern.test(String(text));
  }

  getFontClass(text) {
    return this.containsArabic(text) ? "font-noto-kufi-arabic" : "font-rubik";
  }

  convertToLatinNumerals(text) {
    if (text === undefined || text === null) return "";
    const s = String(text);
    const arabicNumerals = "٠١٢٣٤٥٦٧٨٩";
    const latinNumerals = "0123456789";
    return s.replace(
      /[٠-٩]/g,
      (match) => latinNumerals[arabicNumerals.indexOf(match)]
    );
  }

  _normalizeFeatures(features) {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    if (typeof features === "string") return [features];
    return [];
  }

  createForfaitCard(offer = {}, index = 0, labels = {}) {
    const isRTL = this.currentLang === "ar";
    const buyLabel =
      (labels && labels.buy) || offer.buy || (isRTL ? "شراء" : "Acheter");
    const currencyLabel = isRTL ? "دج" : "DA";
    const cardHeightClass =
      offer.height === "short" ? "h-[365px]" : "h-[472px]";
    const priceNumber = this.convertToLatinNumerals(
      String(offer.price ?? "").replace(/[^0-9٠-٩]/g, "")
    );
    const durationText = this.convertToLatinNumerals(offer.duration || "");
    const titleFont = this.getFontClass(offer.name);
    const dataFont = this.getFontClass(offer.data);
    const buyFont = this.getFontClass(buyLabel);
    const features = this._normalizeFeatures(offer.features);

    return `
    <div role="article" aria-label="${
      offer.name || "forfait"
    }" class="w-[290px] ${cardHeightClass} flex justify-center items-start rounded-xl border-[0.84px] border-[#C5C5C5] bg-white dark:bg-[#2C2C2C] shadow-sm dark:shadow-none">
      <div class="flex flex-col justify-between items-center flex-1 h-full pb-6" ${
        isRTL ? 'dir="rtl"' : ""
      }>
        <div class="flex flex-col items-start gap-3.5 w-full px-[0.9px]">
          <div class="flex h-14 px-2.5 justify-center items-center w-full rounded-t-[11px] bg-ooredoo-red">
            <h3 class="${titleFont} text-white text-center text-2xl font-bold capitalize">
              ${offer.name || ""}
            </h3>
          </div>

          <div class="flex px-5 items-center w-full">
            <div class="${dataFont} text-ooredoo-red dark:text-white text-[26px] font-bold leading-[45px] tracking-[-0.52px]">
              ${offer.data || ""}
            </div>
          </div>

          <div class="flex px-5 flex-col items-start gap-1.5 w-full">
            ${
              features.length
                ? features
                    .map(
                      (feature) => `
                  <div class="flex items-center gap-2.5 w-full">
                    <div aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                        <rect y="0.422852" width="14.91" height="14.91" rx="7.455" fill="#E31D23"/>
                        <g clip-path="url(#clip0)">
                          <path d="M4.22656 7.87927L6.37732 10.03L10.6788 5.72852" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                      </svg>
                    </div>
                    <div class="flex-1 text-black dark:text-white ${this.getFontClass(
                      feature
                    )} text-base font-normal leading-[22px]">
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
            <div class="text-black dark:text-white text-center ${this.getFontClass(
              priceNumber
            )} font-bold text-base">
              <span class="text-[28px]">${priceNumber}</span>
              <span class="${
                isRTL ? "font-noto-kufi-arabic" : "font-rubik"
              } text-[16px]"> ${currencyLabel}/${durationText}</span>
            </div>
            <button class="forfait-buy-btn ${buyFont} bg-ooredoo-red text-white border-none rounded-full cursor-pointer"
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
              data-offer-name="${offer.name || ""}">
              ${buyLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  }

  createForfaitCardInternet(offer = {}, index = 0, labels = {}) {
    const isRTL = this.currentLang === "ar";
    const currencyLabel = isRTL ? "دج" : "DA";
    const buyLabel =
      (labels && labels.buy) || offer.buy || (isRTL ? "شراء" : "Acheter");
    const priceNumber = this.convertToLatinNumerals(
      String(offer.price ?? "").replace(/[^0-9٠-٩]/g, "")
    );
    const durationText = this.convertToLatinNumerals(offer.duration || "");
    const buyFont = this.getFontClass(buyLabel);
    const features = this._normalizeFeatures(offer.features);

    return `
      <div class="relative bg-white pb-6 dark:bg-[#2C2C2C] rounded-xl flex flex-col w-full mx-auto forfait-card-shadow overflow-hidden" style="max-width: 340px;">
        <div class="h-full flex flex-col justify-between" ${
          isRTL ? `dir="rtl"` : ``
        }>
          <div>
            <div class="border-b-[1px] border-b-[#BBBEBE] border-dashed text-center py-3">
              <h2 class="${this.getFontClass(
                offer.price
              )} font-medium text-2xl text-center capitalize dark:text-white leading-tight">
                ${
                  isRTL
                    ? "<span class='font-noto-kufi-arabic'>اشتراك</span>"
                    : "Forfait"
                } <span class="${this.getFontClass(offer.price)}">${
      offer.price || ""
    }</span>
              </h2>
            </div>
            <div class="h-[54px] mt-6 px-4 text-xl">
              <h3 class="${this.getFontClass(
                offer.data
              )} text-ooredoo-red dark:text-white font-semibold text-[28px]">
                 ${offer.data || ""}
                 ${
                   isRTL
                     ? `<span class="font-noto-kufi-arabic">إنترنت</span>`
                     : `<span class="font-rubik">internet</span>`
                 }
              </h3>
              <div class="flex items-center gap-2 mt-8">
                <span aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                  <rect y="0.422852" width="14.91" height="14.91" rx="7.455" fill="#E31D23"/>
                  <g clip-path="url(#clip0)"><path d="M4.22656 7.87927L6.37732 10.03L10.6788 5.72852" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>
                  </svg>
                </span>
                <span class="${this.getFontClass(offer.features)} text-[16px]">
                  ${
                    Array.isArray(features)
                      ? features.join(", ")
                      : offer.features || ""
                  }
                </span>
              </div>
            </div>
            <div class="flex items-baseline justify-center mt-20">
              <span class="${this.getFontClass(
                priceNumber
              )} font-semibold mx-2 text-[28px] leading-none text-black dark:text-white">${priceNumber}</span>
              <span class="text-[16px] text-black dark:text-white font-semibold"> ${currencyLabel}/${durationText}</span>
            </div>
          </div>

          <div class="forfait-card-footer">
            <div class="forfait-button-zone flex justify-center w-full">
              <button class="forfait-buy-btn ${buyFont} bg-ooredoo-red text-white border-none rounded-full cursor-pointer"
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
                data-offer-name="${offer.name || ""}">
                ${buyLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createForfaitCardSmart(offer = {}, index = 0, labels = {}) {
    const isRTL = this.currentLang === "ar";
    const currencyLabel = isRTL ? "دج" : "DA";
    const buyLabel =
      (labels && labels.buy) || offer.buy || (isRTL ? "شراء" : "Acheter");
    const durationText = this.convertToLatinNumerals(offer.duration || "");
    const priceNumber = this.convertToLatinNumerals(
      String(offer.price ?? "").replace(/[^0-9٠-٩]/g, "")
    );
    const priceFontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";
    const features = this._normalizeFeatures(offer.features);

    return `
      <div class="relative bg-white pb-6 dark:bg-[#2C2C2C] rounded-xl flex flex-col w-full mx-auto forfait-card-shadow overflow-hidden" style="max-width: 340px;">
        <div class="h-full flex flex-col justify-between" ${
          isRTL ? `dir="rtl"` : ``
        }>
          <div>
            <div class="border-b-[1px] border-b-[#BBBEBE] border-dashed text-center py-3">
              <h2 class="${this.getFontClass(
                offer.name
              )} font-medium text-2xl text-center dark:text-white leading-tight">
                ${offer.name || ""}
              </h2>
            </div>
            <div class="h-[54px] mt-6 px-4 text-xl">
              <h3 class="${this.getFontClass(
                offer.data
              )} text-ooredoo-red dark:text-white font-semibold text-[28px]">
                 ${offer.data || ""}
              </h3>
            </div>
            <div class="space-y-2 h-16">
                ${features
                  .map(
                    (f) =>
                      `<div class="flex items-center gap-2 px-4">
                        <span aria-hidden="true">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                          <rect y="0.422852" width="14.91" height="14.91" rx="7.455" fill="#E31D23"/>
                          <g clip-path="url(#clip0)"><path d="M4.22656 7.87927L6.37732 10.03L10.6788 5.72852" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>
                          </svg>
                        </span>
                        <span class="${this.getFontClass(f)} text-[16px]">
                          ${f}
                        </span>
                      </div>`
                  )
                  .join("")}
              </div>
              <div class="flex items-baseline justify-center mt-20">
                <span class="${this.getFontClass(
                  priceNumber
                )} font-semibold mx-2 text-[27.96px] leading-none text-black dark:text-white">${priceNumber}</span>
                <span class="text-[16px] text-black dark:text-white font-semibold"> ${currencyLabel}/${durationText}</span>
            </div>
          </div>

          <div class="forfait-card-footer">
            <div class="forfait-button-zone flex justify-center w-full">
              <button class="forfait-buy-btn ${priceFontClass} bg-ooredoo-red text-white border-none rounded-full cursor-pointer"
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
                data-offer-name="${offer.name || ""}">
                ${buyLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createResponsiveLayout(offers = [], labels = {}, gridType) {
    const sliderId = "forfaits-slider";
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
                (offer, i) =>
                  `<div class="swiper-slide flex justify-center p-4">${this.createForfaitCard(
                    offer,
                    i,
                    labels
                  )}</div>`
              )
              .join("")}
          </div>
          <div class="absolute bottom-0 swiper-pagination"></div>
        </div>
      </div>
    </div>

    <div id="forfaits-dots" class="forfait-dots hidden md:block" aria-hidden="true"></div>
  `;
  }

  createResponsiveLayoutInternet(offers = [], labels = {}) {
    const sliderId = "internet-slider";
    return `
    <div class="hidden sm:flex w-full items-center justify-center">
      <div class="gap-5 items-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        ${offers
          .map((offer, index) =>
            this.createForfaitCardInternet(offer, index, labels)
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
                (offer, index) =>
                  `<div class="swiper-slide flex justify-center p-4">${this.createForfaitCardInternet(
                    offer,
                    index,
                    labels
                  )}</div>`
              )
              .join("")}
          </div>
          <div class="absolute bottom-0 swiper-pagination"></div>
        </div>
      </div>
    </div>

    <div id="internet-dots" class="forfait-dots hidden md:block" aria-hidden="true"></div>
  `;
  }

  createResponsiveLayoutSmart(offers = [], labels = {}) {
    const sliderId = "smart-slider";
    return `
    <div class="hidden sm:flex w-full items-center justify-center">
      <div class="gap-5 items-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        ${offers
          .map((offer, index) =>
            this.createForfaitCardSmart(offer, index, labels)
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
                (offer, index) =>
                  `<div class="swiper-slide flex justify-center p-4">${this.createForfaitCardSmart(
                    offer,
                    index,
                    labels
                  )}</div>`
              )
              .join("")}
          </div>
          <div class="absolute bottom-0 swiper-pagination"></div>
        </div>
      </div>
    </div>

    <div id="smart-dots" class="forfait-dots hidden md:block" aria-hidden="true"></div>
  `;
  }

  initSwiper(containerId, forceRTL = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const existingSwiper = container.querySelector(".swiper");
    if (existingSwiper && existingSwiper.swiper) {
      try {
        existingSwiper.swiper.destroy(true, true);
      } catch (e) {
        //
      }
    }

    const isRTL = forceRTL !== null ? forceRTL : this.getLanguage() === "ar";

    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.body.dir = isRTL ? "rtl" : "ltr";
    container.dir = isRTL ? "rtl" : "ltr";

    const self = this;

    setTimeout(() => {
      const swiperEl = container.querySelector(".swiper");
      if (!swiperEl) return;

      let swiper;
      try {
        swiper = new Swiper(swiperEl, {
          slidesPerView: 1.3,
          spaceBetween: 8,
          centeredSlides: true,
          loop: false,
          rtl: isRTL,
          pagination: {
            el: container.querySelector(".swiper-pagination"),
            clickable: true,
            renderBullet: (index, className) => {
              return `<button class="${className} forfait-dot" data-slide="${index}" aria-label="Slide ${
                index + 1
              }"></button>`;
            },
          },
          on: {
            init: function (s) {
              try {
                self.equalizeSlideHeights(container);
              } catch (e) {}
              try {
                const idx =
                  typeof s.realIndex === "number"
                    ? s.realIndex
                    : typeof s.activeIndex === "number"
                    ? s.activeIndex
                    : 0;
                container.dispatchEvent(
                  new CustomEvent("forfaitSlideChange", {
                    detail: { activeIndex: idx },
                  })
                );
              } catch (e) {}
            },
            slideChange: function (s) {
              try {
                const idx =
                  typeof s.realIndex === "number"
                    ? s.realIndex
                    : typeof s.activeIndex === "number"
                    ? s.activeIndex
                    : 0;
                container.dispatchEvent(
                  new CustomEvent("forfaitSlideChange", {
                    detail: { activeIndex: idx },
                  })
                );
              } catch (e) {}
            },
            resize: function () {
              try {
                self.equalizeSlideHeights(container);
              } catch (e) {}
            },
          },
        });
      } catch (e) {
        //
        return;
      }

      setTimeout(() => {
        if (swiper && typeof swiper.update === "function") {
          try {
            swiper.update();
          } catch (e) {}
        }
      }, 50);
    }, 100);
  }

  equalizeSlideHeights(container) {
    const slides = container.querySelectorAll(".swiper-slide");
    if (!slides || slides.length === 0) return;
    let maxHeight = 0;
    slides.forEach((slide) => {
      slide.style.height = "auto";
    });
    slides.forEach((slide) => {
      maxHeight = Math.max(maxHeight, slide.offsetHeight || 0);
    });
    slides.forEach((slide) => {
      slide.style.height = `${maxHeight}px`;
    });
  }

  generateDots(totalDots = 0, activeIndex = 0) {
    return Array.from(
      { length: totalDots },
      (_, index) =>
        `<button class="forfait-dot ${
          index === activeIndex ? "active" : ""
        }" data-slide="${index}" aria-label="Slide ${index + 1}"></button>`
    ).join("");
  }
}
