export class ModalSlider {
  constructor({ container, slides, lang, onSelect }) {
    this.container = container;
    this.slides = slides;
    this.lang = lang;
    this.onSelect = onSelect;
    this.swiper = null;
    this.render();
  }

  createCardHTML(offer) {
    const buttonText = this.lang === "ar" ? "تعديل" : "MODIFIER";
    const currencyText = this.lang === "ar" ? "دج" : "DA";
    const durationText = offer.duration;
    const dirAttribute = this.lang === "ar" ? 'dir="rtl"' : "";

    return `
      <div class="flex w-full flex-shrink-0 flex-col items-center gap-[10px] rounded-[20px] border border-[#C5C5C5] bg-white dark:bg-[#2C2C2C] dark:border-white pb-[25px] h-full overflow-hidden" ${dirAttribute}>
        <div class="flex flex-col items-center gap-[22px] self-stretch h-full">
          <div class="flex self-stretch items-center justify-center gap-[10px] py-[13px] px-[20px] border-b border-dashed border-[#CDCDCD] dark:border-white bg-white dark:bg-[#2C2C2C] w-full">
            <div class="text-ooredoo-red font-rubik text-[22px] font-bold leading-normal uppercase">
              ${offer.planName}
            </div>
          </div>
          <div class="flex flex-col items-center gap-[10px] self-stretch px-[10px] h-full justify-between">
            <div class="self-stretch text-black dark:text-white text-center font-rubik text-[12px] font-normal leading-[20px] min-h-[60px]">
              ${offer.description}
            </div>
            <div class="flex w-[257px] flex-col justify-end items-center gap-[15px]">
              <div class="h-[29px] flex-shrink-0 text-black dark:text-gray-200 text-center font-rubik font-bold leading-normal capitalize">
                <span class="text-[26px]">${offer.price}</span>
                <span class="text-[18px]"> ${currencyText}/</span>
                <span class="text-[13px]">${durationText}</span>
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

    // Définit un espacement au début et à la fin du slider
    const sideOffset = 16;

    this.swiper = new Swiper(this.container.querySelector(".swiper"), {
      // Respecte la largeur CSS de chaque carte
      slidesPerView: "auto",

      // Espace entre les cartes
      spaceBetween: 16,

      // Ne centre pas les cartes, commence à gauche
      centeredSlides: false,

      // Ajoute un "padding" interne au slider pour éviter que les cartes ne soient coupées
      slidesOffsetBefore: sideOffset,
      slidesOffsetAfter: sideOffset,

      // Affiche les points de navigation
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
