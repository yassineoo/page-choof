import ForfaitData from "./ForfaitData.js";



export class Slider {
    constructor(parameters) {
        this.currentLang = this.getLanguage();
    }

    getLanguage() {
    const storedLanguage = localStorage.getItem("language");
    return ["fr", "ar"].includes(storedLanguage) ? storedLanguage : "fr";
    }

    createForfaitCard(offer, index, labels, isRTL) {
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
        <div class="p-6 forfait-card-container h-full" ${isRTL ? `dir="rtl"` : ``}>
          <div class="pb-4">
            <h2 class="${titleFontClass} font-medium text-2xl text-center capitalize text-black dark:text-white mb-4 leading-tight">
              ${offer.name}
            </h2>
            <div class="w-full h-px forfait-divider mb-4"></div>
          </div>

          <div class="forfait-card-content flex-1">
            <div class="mb-5">
              <h3 class="${dataFontClass} text-[28px] font-semibold text-ooredoo-red dark:text-white mb-2 ${textAlign} leading-10">${offer.data}</h3>
            </div>

            <div class="flex-1">
              ${
                offer.features && offer.features.length > 0
                  ? `<div class="${isRTL ? "text-right" : "text-left"}" dir="${isRTL ? "rtl" : "ltr"}">
                    <ul class="space-y-2">
                      ${offer.features
                        .map((feature) => {
                          const featureFontClass = this.getFontClass(feature);
                          return `
                            <li class="flex items-start gap-2">
                              <img src="./assets/images/checkbox.svg" alt="Check" class="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span class="forfait-feature-item ${featureFontClass} flex-1">${feature}</span>
                            </li>
                          `;
                        })
                        .join("")}
                    </ul>
                  </div>`
                  : ``
              }
            </div>
          </div>

          <div class="forfait-card-footer pt-4">
            <div class="flex justify-center items-baseline w-full mb-4">
              <div class="flex items-baseline justify-center" style="width:70%;">
                <span class="${priceFontClass} font-bold mx-2 text-[27.96px] leading-none text-black dark:text-white">${priceNumber}</span>
                <span class="${priceFontClass} font-semibold text-base leading-none text-black dark:text-white whitespace-nowrap">${currencyLabel}</span> 
                <span class="${priceFontClass} font-semibold leading-none text-black dark:text-white whitespace-nowrap ${durationText.includes("cycle") ? "text-xs" : "text-base"}">/${durationText}</span> 
              </div>
            </div>

            <div class="forfait-button-zone flex justify-center w-full">
              <button class="forfait-buy-btn ${buttonFontClass} bg-ooredoo-red text-white border-none rounded-full cursor-pointer"
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

    createResponsiveLayout(offers, labels, gridType,isRTL,  convertToLatinNumerals) {
          const gridClass = gridType === "forfait-grid-5" ? "forfait-grid-5" : "forfait-grid-3";
          const sliderId = gridType === "forfait-grid-5" ? "forfaits-slider" : "smart-slider";
          const dotsId = gridType === "forfait-grid-5" ? "forfaits-dots" : "smart-dots";
          const startIndex = gridType === "forfait-grid-5" ? 0 : ForfaitData[this.currentLang].forfaits.length;
      
          return `
            <div class="forfait-grid ${gridClass}">
              ${offers.map((offer, index) => this.createForfaitCard(offer, startIndex + index, labels, isRTL,  convertToLatinNumerals)).join("")}
            </div>
      
            
            <div class="forfait-mobile-slider forfait-mobile-container" id="${sliderId}">
                <div class="relative swiper">
                <div class="swiper-wrapper">
                    ${offers.map((offer, index) => `
                    <div class="swiper-slide flex justify-center p-4">
                        ${this.createForfaitCard(offer, startIndex + index, labels, isRTL,  convertToLatinNumerals)}
                    </div>
                    `).join("")}
                </div>
                <div class="absolute bottom-0  swiper-pagination"></div>
                </div>
            </div>`;
}


        initSwiper(containerId, isRTL = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  new Swiper(container.querySelector(".swiper"), {
    slidesPerView: 1.3,
    spaceBetween: 10,
    centeredSlides: false,
    loop: true,
    rtl: isRTL,
    pagination: {
      el: container.querySelector(".swiper-pagination"),
      clickable: true,
      renderBullet: (index, className) => {
        // Custom HTML for each dot
        return `<span class="${className} custom-dot"></span>`;
      }
    },
  });
}




    containsArabic(text) {
    if (!text) return false;
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicPattern.test(text);
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