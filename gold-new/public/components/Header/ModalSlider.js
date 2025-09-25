export class ModalSlider {
  constructor({ container, slides = [], lang = "fr", onSelect, texts = {} }) {
    this.container = container;
    this.slides = Array.isArray(slides) ? slides : [];
    this.lang = lang;
    this.onSelect = typeof onSelect === "function" ? onSelect : null;
    this.texts = texts || {};
    this.swiper = null;
    this._buttonHandlers = new Map();
    this.render();
  }

  _escapeHtml(str = "") {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  _containsArabic(text = "") {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
  }

  _fontClass() {
    return this.lang === "ar" ? "font-noto-kufi-arabic" : "font-rubik";
  }

  _splitIntoScriptRuns(text = "") {
    const re =
      /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+|[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF]+|[\s\S]/g;
    const runs = [];
    let match;
    while ((match = re.exec(text)) !== null) {
      const part = match[0];
      if (/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+$/.test(part)) {
        runs.push({ text: part, script: "arabic" });
      } else if (/^[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF]+$/.test(part)) {
        runs.push({ text: part, script: "latin" });
      } else {
        runs.push({ text: part, script: "other" });
      }
    }
    return runs;
  }

  _formatMixedRuns(text = "") {
    if (!text) return "";
    const runs = this._splitIntoScriptRuns(String(text));
    return runs
      .map((run) => {
        const safe = this._escapeHtml(run.text);
        if (run.script === "arabic") {
          return `<span class="font-noto-kufi-arabic arabic-text" dir="auto">${safe}</span>`;
        }
        if (run.script === "latin") {
          return `<span class="font-rubik" dir="auto">${safe}</span>`;
        }
        return `<span class="${this._fontClass()}" dir="auto">${safe}</span>`;
      })
      .join("");
  }

  createCardHTML(offer = {}) {
    const planName = offer.planName ? String(offer.planName) : "";
    const description = offer.description ? String(offer.description) : "";
    const price = offer.price ? String(offer.price) : "";
    const durationRaw = offer.duration ? String(offer.duration) : "";
    const buttonText =
      this.texts.modifyBtn || (this.lang === "ar" ? "تعديل" : "MODIFIER");
    const currencyText = this.lang === "ar" ? "دج" : "DA";
    const durationText = this._escapeHtml(durationRaw.toLowerCase());
    const dirAttribute = this.lang === "ar" ? 'dir="rtl"' : 'dir="ltr"';
    const safePlan = this._escapeHtml(planName);
    const safePrice = this._escapeHtml(price);

    return `
      <div class="flex w-full flex-shrink-0 flex-col items-center gap-[10px] rounded-[20px] border border-[#C5C5C5] bg-white dark:bg-[#2c2c2c] dark:border-white pb-[25px] h-full overflow-hidden" ${dirAttribute}>
        <div class="flex flex-col items-center gap-[22px] self-stretch h-full">
          <div class="flex self-stretch items-center justify-center gap-[10px] py-[13px] px-[20px] border-b border-dashed border-[#CDCDCD] dark:border-white rounded-t-[22.5px] bg-white dark:bg-[#2c2c2c] w-full">
            <div class="text-ooredoo-red dark:text-white text-[22px] font-bold leading-normal uppercase" aria-hidden="true">
              ${this._formatMixedRuns(planName)}
            </div>
          </div>
          <div class="flex flex-col items-center gap-[10px] self-stretch px-[10px] h-full justify-between">
            <div class="self-stretch text-black dark:text-white text-center text-[12px] font-normal leading-[20px] min-h-[60px]" role="article">
              ${this._formatMixedRuns(description)}
            </div>
            <div class="flex w-[257px] flex-col justify-end items-center gap-[15px]">
              <div class="h-[29px] flex-shrink-0 text-black dark:text-white text-center font-bold leading-normal">
                <span class="text-[26px]"><span class="font-rubik">${safePrice}</span></span>
                <span class="text-[18px]"> ${currencyText}/<span class="text-[13px]">${durationText}</span></span>
              </div>
              <button
                type="button"
                data-plan-name="${this._escapeHtml(planName)}"
                class="modifier-btn justify-center items-center rounded-[22px] bg-ooredoo-red hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ooredoo-red"
                style="padding: 7.34px 26.62px; font-size: 15.4px;"
                aria-label="${this._escapeHtml(buttonText)} ${safePlan}">
                <span class="text-white font-bold leading-normal uppercase">
                  ${this._escapeHtml(buttonText)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    this.destroySwiperIfAny();
    if (!this.container) return;
    if (!this.slides || this.slides.length === 0) {
      this.container.innerHTML = `<div class="font-rubik text-center py-8">${this._escapeHtml(
        this.texts.noOffers ||
          (this.lang === "ar" ? "لا توجد عروض" : "No offers available")
      )}</div>`;
      return;
    }

    const slidesHTML = this.slides
      .map(
        (offer) => `
      <div class="swiper-slide" style="width: 287px; height: auto; padding-bottom: 10px;">
        ${this.createCardHTML(offer)}
      </div>`
      )
      .join("");

    this.container.innerHTML = `
      <style>
        .swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: rgba(0,0,0,0.18);
          opacity: 1;
          transition: transform .18s ease, background .18s ease, box-shadow .18s ease;
        }
        .swiper .swiper-pagination-bullet-active {
          background: #E30613 !important;
          transform: scale(1.15);
        }
      </style>
      <div class="swiper w-full">
        <div class="swiper-wrapper items-stretch">${slidesHTML}</div>
        <div class="swiper-pagination !relative mt-4"></div>
      </div>
    `;

    this.initSwiper();
    this.setupEventListeners();
  }

  initSwiper() {
    if (typeof Swiper === "undefined") {
      console.warn("Swiper library is not loaded. Slider will not initialize.");
      return;
    }

    const sideOffset = 16;
    const swiperEl = this.container.querySelector(".swiper");
    const paginationEl = this.container.querySelector(".swiper-pagination");

    try {
      this.swiper = new Swiper(swiperEl, {
        slidesPerView: "auto",
        spaceBetween: 16,
        centeredSlides: false,
        slidesOffsetBefore: sideOffset,
        slidesOffsetAfter: sideOffset,
        pagination: {
          el: paginationEl,
          clickable: true,
        },
        a11y: {
          enabled: true,
        },
      });
    } catch (err) {
      console.error("Failed to initialize Swiper:", err);
      this.swiper = null;
    }
  }

  setupEventListeners() {
    this._removeButtonHandlers();

    const buttons = Array.from(
      this.container.querySelectorAll(".modifier-btn")
    );
    buttons.forEach((button) => {
      const handler = (e) => {
        e.preventDefault();
        const planName = button.dataset.planName || "";
        const selectedOffer = this.slides.find(
          (s) => String(s.planName) === String(planName)
        );
        if (selectedOffer && this.onSelect) {
          this.onSelect(selectedOffer);
        }
      };
      button.addEventListener("click", handler);
      this._buttonHandlers.set(button, handler);
    });
  }

  _removeButtonHandlers() {
    for (const [button, handler] of this._buttonHandlers.entries()) {
      try {
        button.removeEventListener("click", handler);
      } catch (e) {}
    }
    this._buttonHandlers.clear();
  }

  destroySwiperIfAny() {
    if (this.swiper && typeof this.swiper.destroy === "function") {
      try {
        this.swiper.destroy(true, true);
      } catch (e) {}
      this.swiper = null;
    }
  }

  destroy() {
    this._removeButtonHandlers();
    this.destroySwiperIfAny();
    if (this.container) this.container.innerHTML = "";
  }
}
