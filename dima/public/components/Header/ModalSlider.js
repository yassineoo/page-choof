export class ModalSlider {
  constructor({ container, slides, lang, onSelect, texts }) {
    this.container = container;
    this.slides = slides;
    this.lang = lang;
    this.onSelect = onSelect;
    this.texts = texts;
    this.swiper = null;
    this.render();
  }

  createCardHTML(offer) {
    const buttonText =
      this.texts.modifyBtn || (this.lang === "ar" ? "تعديل" : "MODIFIER");
    const currencyText = this.lang === "ar" ? "دج" : "DA";
    const durationText = (offer.duration || "").toLowerCase();
    const dirAttribute = this.lang === "ar" ? 'dir="rtl"' : "";

    return `
      <div class="flex w-full flex-shrink-0 flex-col items-center gap-[10px] rounded-[20px] border border-[#C5C5C5] bg-white dark:bg-[#2c2c2c] dark:border-white pb-[25px] h-full overflow-hidden" ${dirAttribute}>
        <div class="flex flex-col items-center gap-[22px] self-stretch h-full">
          <div class="flex self-stretch items-center justify-center gap-[10px] py-[13px] px-[20px] border-b border-dashed border-[#CDCDCD] dark:border-white rounded-t-[22.5px] bg-white dark:bg-[#2c2c2c] w-full">
            <div class="text-ooredoo-red dark:text-white font-rubik text-[22px] font-bold leading-normal uppercase">
              ${offer.planName}
            </div>
          </div>
          <div class="flex flex-col items-center gap-[10px] self-stretch px-[10px] h-full justify-between">
            <div class="self-stretch text-black dark:text-white text-center font-rubik text-[12px] font-normal leading-[20px] min-h-[60px]">
              ${offer.description}
            </div>
            <div class="flex w-[257px] flex-col justify-end items-center gap-[15px]">
              <div class="h-[29px] flex-shrink-0 text-black dark:text-white text-center font-rubik font-bold leading-normal">
                <span class="text-[26px]">${offer.price}</span>
                <span class="text-[18px]"> ${currencyText}/<span class="text-[13px]">${durationText}</span></span>
              </div>
              <button data-plan-name="${offer.planName}" class="modifier-btn justify-center items-center rounded-[22px] bg-ooredoo-red hover:bg-red-700 transition-colors" style="padding: 7.34px 26.62px; font-size: 15.4px;">
                <span class="text-white font-rubik font-bold leading-normal uppercase">
                  ${buttonText}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
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
      console.error("Swiper library is not loaded.");
      return;
    }

    const sideOffset = 16;

    this.swiper = new Swiper(this.container.querySelector(".swiper"), {
      slidesPerView: "auto",
      spaceBetween: 16,
      centeredSlides: false,
      slidesOffsetBefore: sideOffset,
      slidesOffsetAfter: sideOffset,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  setupEventListeners() {
    this.container.querySelectorAll(".modifier-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const planName = button.dataset.planName;
        const selectedOffer = this.slides.find((s) => s.planName === planName);
        if (selectedOffer && typeof this.onSelect === "function") {
          this.onSelect(selectedOffer);
        }
      });
    });
  }

  destroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }
    this.container.innerHTML = "";
  }
}
