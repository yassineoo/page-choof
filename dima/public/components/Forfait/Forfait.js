import ForfaitData from "./ForfaitData.js";
import ModalData from "./ModalData.js";
import { Slider } from "./Slider.js";

class ForfaitComponent {
  constructor(container) {
    this.container = container;
    this.slider = new Slider();
    this.currentLang = this.getLanguage();
    this.lastIsMobile = this.isMobile();

    this.sliders = new Map([
      ["forfaits", this.createSliderState()],
      ["internet", this.createSliderState()],
      ["smart", this.createSliderState()],
    ]);

    this.boundHandlers = {
      languageChange: this.handleLanguageChange.bind(this),
      resize: this.handleResize.bind(this),
    };
    this.initialize();
  }

  initialize() {
    this.loadStyles();
    this.render();
    this.setupEventListeners();
    this.initializeSliders();
  }

  loadStyles() {
    if (!document.getElementById("forfait-animations")) {
      const styleElement = document.createElement("style");
      styleElement.id = "forfait-animations";
      styleElement.textContent = this.getStylesheet();
      document.head.appendChild(styleElement);
    }
  }

  getStylesheet() {
    return `
:root{
  --dima-card-min: 290px;
  --dima-card-max: 380px;
  --dima-gap-xs: 16px;   /* gap small (mobile) */
  --dima-gap-sm: 24px;   /* gap medium (sm/md) */
  --dima-gap-lg: 18px;   /* gap large (lg) -> same as your React lg:gap-[18px] */
  --ooredoo-red: #ED1C23;
  --card-border: #C5C5C5;
  --card-shadow: 0px 3.92px 7.84px rgba(5,5,5,0.04);
  /* desktop container width CALCULATED so that 4 cards of 290px + 3 gaps fit exactly:
     4*290 + 3*18 = 1214px -> keeps first row with 4 cards */
  --desktop-max-width: calc(4 * var(--dima-card-min) + 3 * var(--dima-gap-lg));
  --mobile-break: 640px;
}

/* Reset & base */
* { box-sizing: border-box; }
html,body { -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }

/* Swiper mobile tweaks */
.forfait-mobile-container .swiper { position: relative; padding-bottom: 40px; }
.forfait-mobile-container .swiper-pagination { position: absolute; bottom: 10px; left: 0; width: 100%; display: flex; justify-content: center; gap: 8px; pointer-events: auto; }
.forfait-mobile-container .swiper-pagination-bullet { width: 12px; height: 12px; border-radius: 50%; background: #ddd; opacity: 1; transition: all .3s; }
.forfait-mobile-container .swiper-pagination-bullet-active { background: var(--ooredoo-red); transform: scale(1.3); }

/* Card visuals */
.forfait-card-shadow {
  box-shadow: var(--card-shadow);
  border: 0.84px solid var(--card-border);
  border-radius: 0.75rem;
  width: 100%;
  max-width: var(--dima-card-max);
  min-width: var(--dima-card-min);
  height: 100%;
  background: #fff;
  overflow: hidden;
}
.dark .forfait-card-shadow { box-shadow: none; border-color: var(--card-border); background: #2C2C2C; }

/* Card internals (structure preserved) */
.forfait-card-container { display:flex; flex-direction:column; height:100%; padding:1.5rem; box-sizing:border-box; }
.forfait-card-content { flex:1; display:flex; flex-direction:column; justify-content:flex-start; }
.forfait-card-footer { margin-top:auto; display:flex; flex-direction:column; align-items:center; gap:1rem; padding-top:1rem; }
.forfait-feature-item { font-weight:400; font-size:18px; line-height:22.37px; color:#000; }
.dark .forfait-feature-item { color:#d1d5db; }

/* heights matching your React */
.dima-card { width: var(--dima-card-min); flex: 0 0 var(--dima-card-min); display:flex; justify-content:center; align-items:stretch; box-sizing:border-box; }
.dima-card--normal .forfait-card-container { min-height: 440px; } /* h-[440px] */
.dima-card--short  .forfait-card-container { min-height: 365px; } /* h-[365px] */

/* Hover */
.forfait-hover-lift { transition: all .3s; }
.forfait-hover-lift:hover { transform: translateY(-3px); box-shadow: 0px 8px 16px rgba(5,5,5,0.10); border-color: var(--card-border); }
.dark .forfait-hover-lift:hover { box-shadow: none; }

/* Modal animation */
.forfait-modal-fade { animation: modalFadeIn .28s ease-out forwards; backdrop-filter: blur(6px); background-color: rgba(0,0,0,0.45); }
@keyframes modalFadeIn { from { opacity: 0; transform: scale(.98) translateY(-6px); } to { opacity: 1; transform: scale(1) translateY(0); } }

/* Dots (fallback) */
.forfait-dot { width:12px; height:12px; border-radius:50%; border:none; cursor:pointer; background:#d1d5db; transition: all .25s; }
.forfait-dot:hover { transform: scale(1.15); background:#9ca3af; }
.forfait-dot.active { background: var(--ooredoo-red); transform: scale(1.05); }
.forfait-dots-container { display:flex; justify-content:center; gap:10px; margin-top:24px; padding:10px; }

/* RTL helpers */
[dir="rtl"] .forfait-card-shadow { direction: rtl; text-align: right; }
[dir="rtl"] .forfait-card-content { direction: rtl; }

/* ================= FLEX-WRAP LAYOUT (identique à ton React) ================= */
/* Wrapper used by createResponsiveLayout(): same behaviour as
   <div class="flex justify-center items-center content-center gap-4 sm:gap-6 lg:gap-[18px] flex-wrap max-w-[1215px]"> */
.forfait-grid-wrapper {
  width: 100%;
  max-width: var(--desktop-max-width); /* ensures first row can hold exactly 4 cards */
  margin: 0 auto;
  padding: 0 1rem;
  box-sizing: border-box;

  display: flex;
  flex-wrap: wrap;            /* allow wrapping */
  gap: var(--dima-gap-xs);    /* default gap on very small screens */
  justify-content: center;    /* center content horizontally */
  align-items: flex-start;
}

/* each item container holds card (keeps same spacing as react's <PackageCard /> wrapper) */
.forfait-grid-item { display:flex; align-items:stretch; justify-content:center; width: var(--dima-card-min); flex: 0 0 var(--dima-card-min); box-sizing:border-box; }

/* Mobile-first: show slider under breakpoint */
.forfait-mobile-slider { display:block; }
.forfait-grid-wrapper, .forfait-grid, .forfait-grid-5, .forfait-grid-3, .forfait-grid-4 { display: none; }

/* >= 640px : show wrapper, increase gap to sm */
@media (min-width: 640px) {
  .forfait-mobile-slider { display: none; }
  .forfait-grid-wrapper { display:flex; gap: var(--dima-gap-sm); }
}

/* >= 768px: keep same layout (cards still 290px, wrap naturally) */
@media (min-width: 768px) {
  .forfait-grid-wrapper { gap: var(--dima-gap-sm); }
  .forfait-grid-item { width: var(--dima-card-min); flex-basis: var(--dima-card-min); }
}

/* >= 1024px (or >=1200) use lg gap to match your react lg:gap-[18px] */
@media (min-width: 1024px) {
  .forfait-grid-wrapper { gap: var(--dima-gap-lg); max-width: var(--desktop-max-width); }
}

/* >= 1200px ensure wrapper still uses the previously calculated width, so 4 cards appear on the first row */
@media (min-width: 1200px) {
  .forfait-grid-wrapper { gap: var(--dima-gap-lg); max-width: var(--desktop-max-width); }
}

/* Larger screens tweak */
@media (min-width: 1600px) {
  :root { --dima-card-max: 420px; } /* optional enlarge */
  .forfait-grid-wrapper { max-width: var(--desktop-max-width); }
}

/* Ensure children fill correctly */
.forfait-grid-wrapper > * { display:flex; align-items:stretch; justify-content:center; }

/* Mobile slider tweaks */
.forfait-mobile-slider .forfait-card-shadow { margin: 0 auto; width: 100%; max-width: 320px; }
.forfait-mobile-slider-wrapper { overflow: visible; margin: 0 -15px; padding: 0 15px; }

/* small screen adjustments */
@media (max-width: 640px) {
  .forfait-card-container { padding: 1.25rem; min-height: 360px; }
  .forfait-card-shadow { max-width: 320px; }
}
@media (max-width: 480px) {
  .forfait-card-container { padding: 1rem; min-height: 320px; }
}

/* accessibility focus */
.forfait-grid-wrapper :focus, .forfait-grid-wrapper > * :focus { outline: 3px solid rgba(237,28,35,0.12); outline-offset:2px; }

/* small helpers kept */
.forfait-buy-btn { position: relative; overflow: hidden; z-index: 10; touch-action: manipulation; }
.forfait-button-zone { touch-action: manipulation; pointer-events: auto; z-index: 10; position: relative; }

/* Truncate long text */
.forfait-card-container h2, .forfait-card-container h3, .forfait-feature-item { overflow: hidden; text-overflow: ellipsis; white-space: normal; }
`;
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
    this.setupAccessibility();
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

  setupAccessibility() {
    if (this.keyboardHandler) {
      this.container.removeEventListener("keydown", this.keyboardHandler);
    }
    this.keyboardHandler = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const focusedSlider = e.target.closest(".forfait-slider-container");
        if (focusedSlider) {
          e.preventDefault();
          const sliderType = focusedSlider.id.replace("-slider", "");
          const slider = this.sliders.get(sliderType);

          if (this.isRTL()) {
            if (e.key === "ArrowRight" && slider.currentIndex > 0) {
              this.updateSliderSmooth(sliderType, slider.currentIndex - 1);
            } else if (
              e.key === "ArrowLeft" &&
              slider.currentIndex < slider.totalSlides - 1
            ) {
              this.updateSliderSmooth(sliderType, slider.currentIndex + 1);
            }
          } else {
            if (e.key === "ArrowLeft" && slider.currentIndex > 0) {
              this.updateSliderSmooth(sliderType, slider.currentIndex - 1);
            } else if (
              e.key === "ArrowRight" &&
              slider.currentIndex < slider.totalSlides - 1
            ) {
              this.updateSliderSmooth(sliderType, slider.currentIndex + 1);
            }
          }
        }
      }
    };
    this.container.addEventListener("keydown", this.keyboardHandler);
  }

  createSliderState() {
    return {
      currentIndex: 0,
      element: null,
      track: null,
      dotsContainer: null,
      totalSlides: 0,
      touchState: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        isDragging: false,
        startTime: 0,
        isScrolling: false,
      },
      eventHandlers: new Map(),
    };
  }

  getLanguage() {
    const storedLanguage = localStorage.getItem("language");
    return ["fr", "ar"].includes(storedLanguage) ? storedLanguage : "fr";
  }

  isRTL() {
    return this.currentLang === "ar";
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

  parseMixedTitle(title) {
    if (!title) return [{ text: "", isArabic: false }];

    const parts = [];
    let currentPart = "";
    let isCurrentArabic = false;

    for (let i = 0; i < title.length; i++) {
      const char = title[i];
      const isCharArabic = this.containsArabic(char);

      if (i === 0) {
        isCurrentArabic = isCharArabic;
        currentPart = char;
      } else if (isCharArabic === isCurrentArabic) {
        currentPart += char;
      } else {
        if (currentPart.trim()) {
          parts.push({ text: currentPart.trim(), isArabic: isCurrentArabic });
        }
        currentPart = char;
        isCurrentArabic = isCharArabic;
      }
    }

    if (currentPart.trim()) {
      parts.push({ text: currentPart.trim(), isArabic: isCurrentArabic });
    }

    return parts;
  }

  createMixedTitleHTML(title, baseClasses = "") {
    if (!title) return "";
    const isRTL = this.isRTL();

    // Specific fix for 'SMART اشتراكات' to show Arabic first then English
    if (title === "SMART اشتراكات" && isRTL) {
      return `
      <span class="font-noto-kufi-arabic ${baseClasses}">اشتراكات</span>
      <span class="font-rubik ${baseClasses}"> SMART</span>
    `;
    }

    // General Arabic text only (no Latin)
    if (this.containsArabic(title) && !title.match(/[a-zA-Z]/)) {
      return `<span class="font-noto-kufi-arabic ${baseClasses}" dir="rtl">${title}</span>`;
    }

    // Mixed Arabic + English text
    if (this.containsArabic(title) && title.match(/[a-zA-Z]/)) {
      const parts = title.split(/([a-zA-Z]+)/).filter((part) => part.trim());
      return parts
        .map((part) => {
          const isArabic = this.containsArabic(part);
          const fontClass = isArabic ? "font-noto-kufi-arabic" : "font-rubik";
          const direction = isArabic ? "rtl" : "ltr";
          // Display Arabic first followed by English when RTL mode
          // If you want to reverse order for all mixed text, add custom logic here
          return `<span class="${fontClass} ${baseClasses}" dir="${direction}">${part}</span>`;
        })
        .join("");
    }

    // Non-Arabic text only
    return `<span class="font-rubik ${baseClasses}">${title}</span>`;
  }

  render() {
    try {
      const language = this.getLanguage();
      const data = ForfaitData[language];

      if (!data || !data.forfaits || !data.smartForfaits) {
        console.error("Missing data for language:", language);
        const fallbackData = ForfaitData.fr;
        if (!fallbackData) {
          throw new Error("No fallback data available");
        }
        this.renderWithData(fallbackData, language);
        return;
      }

      this.renderWithData(data, language);
    } catch (error) {
      console.error("Error rendering component:", error);
      this.renderErrorState();
    }
  }

  createMixedTitleHTML(title, baseClasses = "") {
    if (!title) return "";
    const isRTL = this.isRTL();

    // Specific fix for 'SMART اشتراكات' to show Arabic first then English
    if (title === "SMART اشتراكات" && isRTL) {
      return `
      <span class="font-noto-kufi-arabic ${baseClasses}">اشتراكات</span>
      <span class="font-rubik ${baseClasses}"> SMART</span>
    `;
    }

    // General Arabic text only (no Latin)
    if (this.containsArabic(title) && !title.match(/[a-zA-Z]/)) {
      return `<span class="font-noto-kufi-arabic ${baseClasses}" dir="rtl">${title}</span>`;
    }

    // Mixed Arabic + English text
    if (this.containsArabic(title) && title.match(/[a-zA-Z]/)) {
      const parts = title.split(/([a-zA-Z]+)/).filter((part) => part.trim());
      return parts
        .map((part) => {
          const isArabic = this.containsArabic(part);
          const fontClass = isArabic ? "font-noto-kufi-arabic" : "font-rubik";
          const direction = isArabic ? "rtl" : "ltr";
          // Display Arabic first followed by English when RTL mode
          // If you want to reverse order for all mixed text, add custom logic here
          return `<span class="${fontClass} ${baseClasses}" dir="${direction}">${part}</span>`;
        })
        .join("");
    }

    // Non-Arabic text only
    return `<span class="font-rubik ${baseClasses}">${title}</span>`;
  }

  renderTitle(language) {
    if (language === "ar") {
      return `
      <h2 class="text-center text-3xl sm:text-4xl md:text-5xl font-medium mb-16 text-black dark:text-white" dir="rtl">
        <span class="font-noto-kufi-arabic" dir="rtl">اشتراكات</span>
        <span class="font-rubik" dir="ltr"> SMART</span>
      </h2>
    `;
    } else {
      return `
      <h2 class="text-3xl sm:text-4xl md:text-5xl font-medium mb-16 leading-tight tracking-wide text-center text-black dark:text-white">
        <span class="font-rubik">FORFAITS SMART</span>
      </h2>
    `;
    }
  }

  renderWithData(data, language) {
    const labels = data.labels;

    this.sliders.forEach((slider) => {
      slider.currentIndex = 0;
    });

    this.cleanupAllEventListeners();

    this.container.innerHTML = `
    <div class="w-full ${
      this.currentLang === "ar" ? "font-noto-kufi-arabic" : "font-rubik"
    }">
      <section class="w-full bg-white dark:bg-[#2c2c2c] pt-16">
        <div class="max-w-[1600px] mx-auto md:px-6">
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-medium mb-16 leading-tight tracking-wide text-center">
            ${
              this.currentLang === "ar"
                ? "اشتراكات <span class='font-rubik' dir='ltr'>DIMA OOREDOO</span>"
                : "FORFAITS DIMA OOREDOO"
            }
          </h2>
          ${this.slider.createResponsiveLayout(
            data.forfaits,
            labels,
            "forfait-grid-5",
            this.isRTL
          )}
        </div>
        <div class="bg-ooredoo-red py-16 mt-16 px-[clamp(1rem,5vw,5rem)]">
          <h1 class="text-white leading-snug font-extrabold text-[42px] max-w-[1000px] font-outfit">${
            this.currentLang === "ar"
              ? "إكتشفوا خدماتنا الرقمية"
              : "DECOUVREZ NOS SERVICES NUMERIQUES"
          }</h1>
          <div class="grid grid-cols-5 md:flex items-center gap-2 mt-10 md:mb-16 flex-wrap">
            <span class="bg-white py-2 px-1 rounded-full flex justify-center w-full max-w-32 h-8 md:h-12">
              <img src="./assets/images/services/Bitdefender.svg" class="h-full w-full"/>
            </span>
            <span class="bg-white py-2 px-1 rounded-full flex justify-center w-full max-w-32 h-8 md:h-12">
              <img src="./assets/images/TOD.svg" class="h-full w-full"/>
            </span>
            <span class="bg-white py-2 px-1 rounded-full flex justify-center w-full max-w-32 h-8 md:h-12">
              <img src="./assets/images/services/shahid.svg" class="h-full w-full"/>
            </span>
            <span class="bg-white py-2 px-1 rounded-full flex justify-center w-full max-w-32 h-8 md:h-12">
              <img src="./assets/images/services/anghami-osn.svg"  class="h-full w-full"/>
            </span>
            <span class="bg-white py-2 px-1 rounded-full flex justify-center w-full max-w-32 h-8 md:h-12">
              <img src="./assets/images/services/freefire.svg" class="h-full w-full"/>
            </span>
          </div>
          <div class="flex items-center gap-4 flex-wrap justify-between">
            <p class="text-white py-10 md:py-0">${
              this.currentLang === "ar"
                ? "استفيدوا منها اينما كنتم!"
                : "Profitez en où que vous soyez !"
            }</p>
            <button>
              <a href="#digitalServices-root" class="text-ooredoo-red bg-white px-4 py-2 rounded-full font-semibold text-[18px] uppercase">${
                this.currentLang === "ar"
                  ? "المزيد من التفاصيل"
                  : "Voir détails"
              }</a>
            </button>
          </div>
        </div>
        <div class="py-16 dark:bg-black bg-white">
          <h2 class="text-3xl sm:text-4xl uppercase md:text-5xl font-medium mb-16 leading-tight tracking-wide text-center">
            ${
              this.currentLang === "ar"
                ? "<span>اشتراكات الانترنت</span>"
                : "<span class='font-rubik'>forfaits internet</span>"
            }
          </h2>
          <div class="">
              ${this.slider.createResponsiveLayoutInternet(
                data.internetForfaits,
                labels,
                "forfait-grid-4",
                this.isRTL,
                this.convertToLatinNumerals
              )}
          </div>
        </div>
      </section>

      <section class="w-full bg-[#F8F8F8] dark:bg-[#2c2c2c] py-16">
          <h2 class="text-3xl sm:text-4xl uppercase md:text-5xl font-medium mb-16 leading-tight tracking-wide text-center">
            ${
              this.currentLang === "ar"
                ? "اشتراكات <span class='font-rubik'>Smart</span>"
                : "FORFAITS Smart"
            }
          </h2>
          <div class="">
              ${this.slider.createResponsiveLayoutSmart(
                data.smartForfaits,
                labels,
                "forfait-grid-4",
                this.isRTL,
                this.convertToLatinNumerals
              )}
          </div>
      </section>

      <div id="forfait-modal-container"></div>
    </div>
  `;

    this.bindPurchaseButtons(
      language,
      [...data.forfaits, ...data.internetForfaits, ...data.smartForfaits],
      labels
    );

    requestAnimationFrame(() => {
      this.slider.initSwiper("forfaits-slider");
      this.slider.initSwiper("internet-slider");
      this.slider.initSwiper("hadra-slider");
    });
    setTimeout(() => {
      this.initializeSliders();
      this.addSliderAccessibility();
      // after DOM is rendered
      this.updateGridLastRowClasses();
    }, 50);
  }

  renderErrorState() {
    this.container.innerHTML = `
      <div class="w-full flex items-center justify-center py-16">
        <div class="text-center">
          <p class="text-gray-600 dark:text-gray-400 mb-4">Une erreur s'est produite lors du chargement des forfaits</p>
          <button onclick="location.reload()" 
                  class="bg-ooredoo-red text-white px-4 py-2 rounded-full">
            Recharger
          </button>
        </div>
      </div>
    `;
  }

  addSliderAccessibility() {
    this.sliders.forEach((slider, sliderType) => {
      const element = this.container.querySelector(`#${sliderType}-slider`);
      if (element) {
        element.setAttribute("role", "region");
        element.setAttribute(
          "aria-label",
          sliderType === "forfaits" ? "Forfaits data" : "Forfaits smart"
        );
        element.setAttribute("tabindex", "0");
      }
    });
  }

  initializeSliders() {
    const data = ForfaitData[this.currentLang];

    this.sliders.forEach((slider) => {
      slider.element = null;
      slider.track = null;
      slider.dotsContainer = null;
      slider.totalSlides = 0;
    });

    this.setupSlider("forfaits", data.forfaits.length);
    this.setupSlider("internet", data.internetForfaits.length);
    this.setupSlider("smart", data.smartForfaits.length);
  }
  setupSlider(sliderType, totalSlides) {
    const slider = this.sliders.get(sliderType);
    const sliderId = `${sliderType}-slider`;
    const dotsId = `${sliderType}-dots`;

    const element = this.container.querySelector(`#${sliderId}`);
    if (!element) {
      console.warn(`Slider element not found for ${sliderType}`);
      return;
    }
    const track = element.querySelector(".forfait-slider-track");
    const dotsContainer = this.container.querySelector(`#${dotsId}`);

    if (!track || !dotsContainer) {
      console.warn(`Slider track or dots not found for ${sliderType}`);
      return;
    }

    slider.element = element;
    slider.track = track;
    slider.dotsContainer = dotsContainer;
    slider.totalSlides = totalSlides;
    slider.currentIndex = 0;

    this.cleanupSliderEventListenersFor(slider);

    this.initializeSwipeHandlers(sliderType);
    this.setupDotNavigation(sliderType);

    this.updateSlider(sliderType, 0);
  }

  initializeSwipeHandlers(sliderType) {
    const slider = this.sliders.get(sliderType);
    const { element, track } = slider;
    if (!element || !track) {
      return;
    }

    const isRTL = this.isRTL();

    const handleStart = (event) => {
      if (
        event.target.closest(".forfait-buy-btn") ||
        event.target.closest(".forfait-button-zone")
      ) {
        return;
      }
      const touch = event.type.startsWith("touch") ? event.touches[0] : event;
      slider.touchState.isDragging = false;
      slider.touchState.isScrolling = false;
      slider.touchState.startX = touch.clientX;
      slider.touchState.startY = touch.clientY;
      slider.touchState.startTime = Date.now();
    };

    const handleMove = (event) => {
      if (!slider.touchState.startX) return;
      if (
        event.target.closest(".forfait-buy-btn") ||
        event.target.closest(".forfait-button-zone")
      ) {
        return;
      }
      const touch = event.type.startsWith("touch") ? event.touches[0] : event;
      slider.touchState.currentX = touch.clientX;
      slider.touchState.currentY = touch.clientY;

      const deltaX = Math.abs(
        slider.touchState.currentX - slider.touchState.startX
      );
      const deltaY = Math.abs(
        slider.touchState.currentY - slider.touchState.startY
      );

      if (!slider.touchState.isDragging && !slider.touchState.isScrolling) {
        if (deltaX > 10 || deltaY > 10) {
          if (deltaY > deltaX) {
            slider.touchState.isScrolling = true;
            return;
          } else {
            slider.touchState.isDragging = true;
            track.style.transition = "none";
            event.preventDefault();
          }
        }
      }

      if (!slider.touchState.isDragging || slider.touchState.isScrolling)
        return;

      event.preventDefault();
      const deltaXReal = slider.touchState.currentX - slider.touchState.startX;

      const slideWidthPercent = 80;
      let currentTransform, movePercentage, newTransform;

      if (isRTL) {
        currentTransform = slider.currentIndex * slideWidthPercent;
        movePercentage = (deltaXReal / element.offsetWidth) * slideWidthPercent;
        newTransform = currentTransform - movePercentage;

        const maxTransform = (slider.totalSlides - 1) * slideWidthPercent;
        const minTransform = 0;

        if (newTransform > maxTransform) {
          newTransform = maxTransform;
        } else if (newTransform < minTransform) {
          newTransform = minTransform;
        }
      } else {
        currentTransform = -slider.currentIndex * slideWidthPercent;
        movePercentage = (deltaXReal / element.offsetWidth) * slideWidthPercent;
        newTransform = currentTransform + movePercentage;

        const maxTransform = 0;
        const minTransform = -(slider.totalSlides - 1) * slideWidthPercent;

        if (newTransform > maxTransform) {
          newTransform = maxTransform;
        } else if (newTransform < minTransform) {
          newTransform = minTransform;
        }
      }

      track.style.transform = `translateX(${newTransform}%)`;
    };

    const handleEnd = () => {
      if (!slider.touchState.startX) return;
      if (slider.touchState.isScrolling) {
        this.resetTouchState(slider);
        return;
      }
      if (!slider.touchState.isDragging) {
        this.resetTouchState(slider);
        return;
      }

      slider.touchState.isDragging = false;
      track.style.transition = "transform 0.3s ease";

      const deltaX = slider.touchState.currentX - slider.touchState.startX;
      const threshold = 50;
      let newIndex = slider.currentIndex;

      if (Math.abs(deltaX) > threshold) {
        if (isRTL) {
          if (deltaX > 0 && slider.currentIndex < slider.totalSlides - 1) {
            newIndex = slider.currentIndex + 1;
          } else if (deltaX < 0 && slider.currentIndex > 0) {
            newIndex = slider.currentIndex - 1;
          }
        } else {
          if (deltaX < 0 && slider.currentIndex < slider.totalSlides - 1) {
            newIndex = slider.currentIndex + 1;
          } else if (deltaX > 0 && slider.currentIndex > 0) {
            newIndex = slider.currentIndex - 1;
          }
        }
      }

      this.updateSlider(sliderType, newIndex);
      this.resetTouchState(slider);
    };

    this.bindSwipeEvents(element, handleStart, handleMove, handleEnd, slider);
  }

  resetTouchState(slider) {
    slider.touchState.startX = 0;
    slider.touchState.startY = 0;
    slider.touchState.currentX = 0;
    slider.touchState.currentY = 0;
    slider.touchState.isScrolling = false;
  }

  bindSwipeEvents(element, handleStart, handleMove, handleEnd, slider) {
    this.cleanupSliderEventListenersFor(slider);

    const handlers = [
      { element, type: "mousedown", fn: handleStart },
      { element: document, type: "mousemove", fn: handleMove },
      { element: document, type: "mouseup", fn: handleEnd },
      { element: document, type: "mouseleave", fn: handleEnd },
      { element, type: "touchstart", fn: handleStart },
      { element, type: "touchmove", fn: handleMove },
      { element, type: "touchend", fn: handleEnd },
      { element, type: "touchcancel", fn: handleEnd },
    ];

    handlers.forEach(({ element: el, type, fn }) => {
      const options = type.startsWith("touch")
        ? { passive: type !== "touchmove" }
        : undefined;
      el.addEventListener(type, fn, options);

      const key = `${
        el.constructor.name
      }-${type}-${Date.now()}-${Math.random()}`;
      slider.eventHandlers.set(key, { type, fn, element: el });
    });

    const dragStartHandler = (e) => {
      if (!e.target.closest(".forfait-buy-btn")) {
        e.preventDefault();
      }
    };
    element.addEventListener("dragstart", dragStartHandler);
    const dragKey = `${
      element.constructor.name
    }-dragstart-${Date.now()}-${Math.random()}`;
    slider.eventHandlers.set(dragKey, {
      type: "dragstart",
      fn: dragStartHandler,
      element,
    });
  }

  cleanupSliderEventListenersFor(slider) {
    if (slider.eventHandlers && slider.eventHandlers.size > 0) {
      slider.eventHandlers.forEach(({ element, type, fn }) => {
        if (element && element.removeEventListener) {
          element.removeEventListener(type, fn);
        }
      });
      slider.eventHandlers.clear();
    }
  }

  cleanupSliderEventListeners() {
    this.sliders.forEach((slider) => {
      this.cleanupSliderEventListenersFor(slider);
    });
  }

  setupDotNavigation(sliderType) {
    const slider = this.sliders.get(sliderType);
    if (!slider.dotsContainer) return;

    const dots = slider.dotsContainer.querySelectorAll(".forfait-dot");

    dots.forEach((dot, index) => {
      const clickHandler = () => {
        const slideIndex = parseInt(dot.getAttribute("data-slide")) || index;
        this.updateSlider(sliderType, slideIndex);
      };
      dot.addEventListener("click", clickHandler);
      const key = `dot-${index}-click-${Date.now()}-${Math.random()}`;
      slider.eventHandlers.set(key, {
        type: "click",
        fn: clickHandler,
        element: dot,
      });
    });
  }

  updateSlider(sliderType, slideIndex) {
    const slider = this.sliders.get(sliderType);
    if (!slider || !slider.track) return;

    const clampedIndex = Math.max(
      0,
      Math.min(slideIndex, slider.totalSlides - 1)
    );
    slider.currentIndex = clampedIndex;

    const containerWidth = slider.element.offsetWidth;
    const slideWidth = containerWidth * 0.85;
    const gap = 30;
    const totalSlideWidth = slideWidth + gap;

    let offset;

    if (this.isRTL()) {
      slider.track.style.flexDirection = "row-reverse";
      offset =
        clampedIndex * totalSlideWidth - (containerWidth - slideWidth) / 2;
    } else {
      slider.track.style.flexDirection = "row";
      offset =
        -clampedIndex * totalSlideWidth + (containerWidth - slideWidth) / 2;
    }

    slider.track.style.transform = `translateX(${offset}px)`;

    this.updateDots(sliderType, clampedIndex);
  }
  updateSliderSmooth(sliderType, slideIndex) {
    const slider = this.sliders.get(sliderType);
    if (!slider || !slider.track) return;

    const clampedIndex = Math.max(
      0,
      Math.min(slideIndex, slider.totalSlides - 1)
    );
    slider.currentIndex = clampedIndex;

    const containerWidth = slider.element.offsetWidth;
    const slideWidth = containerWidth * 0.85;
    const gap = 30;
    const totalSlideWidth = slideWidth + gap;

    let offset;

    if (this.isRTL()) {
      slider.track.style.flexDirection = "row-reverse";
      offset =
        clampedIndex * totalSlideWidth - (containerWidth - slideWidth) / 2;
    } else {
      slider.track.style.flexDirection = "row";
      offset =
        -clampedIndex * totalSlideWidth + (containerWidth - slideWidth) / 2;
    }

    requestAnimationFrame(() => {
      if (slider.track) {
        slider.track.style.transform = `translateX(${offset}px)`;
      }
    });
    this.updateDots(sliderType, clampedIndex);
  }

  updateDots(sliderType, activeIndex) {
    const slider = this.sliders.get(sliderType);
    const dots = slider.dotsContainer?.querySelectorAll(".forfait-dot");
    if (!dots) return;

    dots.forEach((dot, index) => {
      const slideIndex = parseInt(dot.getAttribute("data-slide")) || index;
      dot.classList.toggle("active", slideIndex === activeIndex);
    });
  }
  handleLanguageChange() {
    const newLanguage = this.getLanguage();
    if (newLanguage !== this.currentLang) {
      this.currentLang = newLanguage;
      this.closeAnyOpenModals();
      this.render();
    }
  }

  closeAnyOpenModals() {
    const modalContainer = this.container.querySelector(
      "#forfait-modal-container"
    );
    if (modalContainer && modalContainer.innerHTML.trim()) {
      modalContainer.innerHTML = "";
    }
  }
  isMobile() {
    return window.innerWidth <= 639;
  }

  isMobile() {
    return window.innerWidth <= 639;
  }
  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      const newIsMobile = this.isMobile();

      // Check if layout needs to change (mobile/desktop transition)
      if (newIsMobile !== this.lastIsMobile) {
        console.log(
          `ForfaitComponent: Layout changed from ${
            this.lastIsMobile ? "mobile" : "desktop"
          } to ${newIsMobile ? "mobile" : "desktop"}`
        );
        this.lastIsMobile = newIsMobile;

        // Re-render to switch between grid and slider layouts
        this.render();
        return;
      }

      // Just update slider positions for same layout
      this.sliders.forEach((slider, sliderType) => {
        if (slider.track) {
          this.updateSlider(sliderType, slider.currentIndex);
        }
      });
    }, 100);
  }

  bindPurchaseButtons() {
    if (this.purchaseClickHandler) {
      this.container.removeEventListener("click", this.purchaseClickHandler);
      this.purchaseClickHandler = null;
    }
    if (this.purchaseTouchHandler) {
      this.container.removeEventListener("touchend", this.purchaseTouchHandler);
      this.purchaseTouchHandler = null;
    }

    const handler = (e) => {
      const button = e.target.closest(".forfait-buy-btn");
      if (!button) return;

      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();

      const typeAttr =
        button.getAttribute("data-type") ||
        button.getAttribute("data-group") ||
        "forfait";
      const index = parseInt(button.getAttribute("data-index"), 10);
      const lang = this.getLanguage();
      const data = ForfaitData[lang] || ForfaitData.fr;

      const groups = {
        forfait: data.forfaits,
        internet: data.internetForfaits,
        smart: data.smartForfaits,
        forfaits: data.forfaits,
        internetForfaits: data.internetForfaits,
        smartForfaits: data.smartForfaits,
      };

      const offersArray = groups[typeAttr] || [];
      const offer = offersArray[index];
      if (!offer) return;

      if (!offer.type) {
        if (typeAttr === "forfaits") offer.type = "forfait";
        else if (typeAttr === "internetForfaits") offer.type = "internet";
        else if (typeAttr === "smartForfaits") offer.type = "smart";
        else offer.type = typeAttr;
      }

      setTimeout(() => {
        this.handlePurchaseClick(offer, lang);
      }, 50);
    };

    this.purchaseClickHandler = handler;
    this.purchaseTouchHandler = handler;

    this.container.addEventListener("click", handler);
    this.container.addEventListener("touchend", handler, { passive: false });
  }

  handlePurchaseClick(offer, language) {
    const currentLanguage = this.getLanguage();
    const modalContent = ModalData[currentLanguage];

    // Utilisez la même clé unique que celle générée dans ModalData.js
    const uniqueKey = `${offer.type || "forfait"}-${offer.name}`;

    const content =
      modalContent && modalContent[uniqueKey]
        ? modalContent[uniqueKey]
        : this.getDefaultModalContent(offer, currentLanguage);

    this.showPurchaseFlow(offer.name, content, this.currentLang === "ar");
  }

  getDefaultModalContent(offer, language) {
    const isArabic = language === "ar";
    const priceNumber = this.convertToLatinNumerals(
      offer.price.replace(/[^0-9٠-٩]/g, "")
    );

    return {
      confirm: isArabic
        ? `${offer.data} صالحة 4 أسابيع`
        : `${offer.data} valables 4 semaines`,
      success: isArabic
        ? `هنيئًا! لقد تم تفعيل الاشتراك ${offer.name} بنجاح: ${offer.data} صالحة 4 أسابيع.`
        : `Votre Forfait ${offer.name} est activé avec succès : ${offer.data} valables 4 semaines.`,
      insufficient: isArabic
        ? `رصيدك غير كافٍٍ. يُرجى إعادة تعبئة حسابك.`
        : `Votre crédit est insuffisant. Veuillez recharger votre compte.`,
    };
  }

  showPurchaseFlow(offerName, content, isRTL) {
    this.showModal({
      type: "confirm",
      title: offerName,
      message: content.confirm,
      isRTL,
      onConfirm: () => {
        if (content.hasShahid) {
          this.showShahidModal(isRTL, () => {
            this.showSuccessModal(content, isRTL, () => {
              this.showInsufficientCreditModal(content, isRTL);
            });
          });
        } else {
          this.showSuccessModal(content, isRTL, () => {
            this.showInsufficientCreditModal(content, isRTL);
          });
        }
      },
    });
  }

  showShahidModal(isRTL, onClose) {
    const shahidContent = {
      title: isRTL ? "شاهد" : "Service Shahid activé !",
      message: isRTL
        ? "لقد تم تفعيل خدمة شاهد! بعد قليل، ستصلك رسالة قصيرة تحتوي على رابط."
        : "Vous recevrez un SMS avec un lien sous peu.",
    };

    this.showModal({
      type: "info",
      title: shahidContent.title,
      message: shahidContent.message,
      isRTL,
      onClose,
    });
  }

  showInsufficientCreditModal(content, isRTL, onClose) {
    this.showModal({
      type: "info",
      title: isRTL ? "رصيدك غير كافٍ" : "Crédit Insuffisant",
      message: content.insufficient,
      isRTL,
    });
  }

  showSuccessModal(content, isRTL, onClose) {
    this.showModal({
      type: "success",
      title: isRTL ? "هنيئًا !" : "Félicitations !",
      message: content.success,
      isRTL,
      onClose,
    });
  }

  showModal({ type, title, message, isRTL = false, onConfirm, onClose }) {
    try {
      const modalContainer = this.container.querySelector(
        "#forfait-modal-container"
      );
      if (!modalContainer) {
        console.error("Modal container not found");
        return;
      }

      const modalHTML = this.createModalHTML({ type, title, message, isRTL });
      modalContainer.innerHTML = modalHTML;
      this.setupModalEvents({ type, onConfirm, onClose, modalContainer });
      this.manageFocusForModal(modalContainer);
    } catch (error) {
      console.error("Error showing modal:", error);
    }
  }

  manageFocusForModal(modalContainer) {
    this.previouslyFocusedElement = document.activeElement;
    setTimeout(() => {
      const firstButton = modalContainer.querySelector("[data-action]");
      if (firstButton) {
        firstButton.focus();
      }
    }, 100);
  }

  createModalHTML({ type, title, message, isRTL }) {
    const dirAttribute = isRTL ? `dir="rtl"` : "";
    const closeButtonPosition = "right-4";
    const buttons = this.getModalButtons(type, isRTL);
    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

    return `
      <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 forfait-modal-fade"
          style="background-color: rgba(105, 105, 105, 0.8);"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title">
          <div class="relative bg-white dark:bg-[#2C2C2C]  rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl min-w-[320px] px-6 md:px-8 pt-16 pb-8 md:pb-12" ${dirAttribute}>
              <button class="absolute top-4 ${closeButtonPosition} p-2 z-10 rounded-full transition-all duration-200 forfait-modal-close"
                      aria-label="${isRTL ? "تم" : "ok"}">
                  <img src="./assets/images/Close.svg" alt="close" class="w-6 h-6 block"/>
              </button>
              <div class="text-center mb-6">
                  <h2 id="modal-title" class="${fontClass} font-semibold text-ooredoo-red dark:text-white text-2xl md:text-3xl leading-tight uppercase tracking-tight">
                      ${title}
                  </h2>
              </div>
              <div class="text-center mb-10">
                  <p class="${fontClass} text-gray-800 dark:text-gray-200 leading-relaxed text-base md:text-lg px-2">
                      ${message}
                  </p>
              </div>
              <div class="flex justify-center forfait-modal-buttons">${buttons}</div>
          </div>
      </div>
    `;
  }

  getModalButtons(type, isRTL) {
    const labels = {
      cancel: isRTL ? "إلغاء" : "Annuler",
      confirm: isRTL ? "تأكيد" : "Confirmer",
      close: isRTL ? "تم" : "OK",
      ok: isRTL ? "تم" : "OK",
    };

    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";
    const primaryBtn = `${fontClass} font-semibold text-base uppercase forfait-modal-button w-40 h-12 rounded-full border-none cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-ooredoo-red text-white shadow-lg`;
    const secondaryBtn = `${fontClass} font-semibold text-base uppercase forfait-modal-button w-40 h-12 rounded-full cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-white text-ooredoo-red border-2 border-ooredoo-red shadow-md dark:bg-[#2C2C2C] dark:text-white dark:border-white`;
    const buttonGap = "gap-4 flex-wrap sm:flex-nowrap";

    const buttonConfigs = {
      confirm: `
        <div class="flex ${buttonGap}">
          <button class="${secondaryBtn}" data-action="cancel">${labels.cancel}</button>
          <button class="${primaryBtn}" data-action="confirm">${labels.confirm}</button>
        </div>
      `,
      success: `
        <div class="flex ${buttonGap}">
          <button class="${primaryBtn}" data-action="close">${labels.close}</button>
        </div>
      `,
      info: `
        <div class="flex ${buttonGap}">
          <button class="${primaryBtn}" data-action="close">${labels.ok}</button>
        </div>
      `,
    };

    return buttonConfigs[type] || buttonConfigs.success;
  }

  setupModalEvents({ type, onConfirm, onClose, modalContainer }) {
    const modal = modalContainer.querySelector(".forfait-modal-fade");
    const closeButton = modal.querySelector(".forfait-modal-close");
    const actionButtons = modal.querySelectorAll("[data-action]");

    const closeModal = () => {
      modal.style.animation = "modalFadeOut 0.2s ease-in forwards";
      setTimeout(() => {
        modalContainer.innerHTML = "";
        if (
          this.previouslyFocusedElement &&
          this.previouslyFocusedElement.focus
        ) {
          this.previouslyFocusedElement.focus();
        }
        this.previouslyFocusedElement = null;
      }, 200);
    };

    this.addModalCloseAnimation();

    const modalHandlers = new Map();

    const closeClickHandler = () => closeModal();
    closeButton.addEventListener("click", closeClickHandler);
    modalHandlers.set("close-click", {
      element: closeButton,
      type: "click",
      handler: closeClickHandler,
    });

    actionButtons.forEach((button) => {
      const actionClickHandler = () => {
        const action = button.getAttribute("data-action");
        closeModal();

        setTimeout(() => {
          if (action === "confirm" && onConfirm) onConfirm();
          if (action === "close" && onClose) onClose();
        }, 200);
      };
      button.addEventListener("click", actionClickHandler);
      modalHandlers.set(`action-${button.getAttribute("data-action")}`, {
        element: button,
        type: "click",
        handler: actionClickHandler,
      });
    });

    const backdropClickHandler = (event) => {
      if (event.target === modal) {
        closeModal();
      }
    };
    modal.addEventListener("click", backdropClickHandler);
    modalHandlers.set("backdrop-click", {
      element: modal,
      type: "click",
      handler: backdropClickHandler,
    });

    const escapeHandler = (event) => {
      if (event.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", escapeHandler);
        modalHandlers.delete("escape");
      }
    };
    document.addEventListener("keydown", escapeHandler);
    modalHandlers.set("escape", {
      element: document,
      type: "keydown",
      handler: escapeHandler,
    });

    modal.modalHandlers = modalHandlers;
  }

  addModalCloseAnimation() {
    if (!document.getElementById("modal-close-animation")) {
      const style = document.createElement("style");
      style.id = "modal-close-animation";
      style.textContent = `
            @keyframes modalFadeOut {
                from { opacity: 1; transform: scale(1) translateY(0); }
                to { opacity: 0; transform: scale(0.95) translateY(-10px); }
            }
        `;
      document.head.appendChild(style);
    }
  }

  cleanupAllEventListeners() {
    this.cleanupSliderEventListeners();

    if (this.purchaseClickHandler) {
      this.container.removeEventListener("click", this.purchaseClickHandler);
      this.purchaseClickHandler = null;
    }
    if (this.purchaseTouchHandler) {
      this.container.removeEventListener("touchend", this.purchaseTouchHandler);
      this.purchaseTouchHandler = null;
    }
  }

  updateGridLastRowClasses() {
    const grids = this.container.querySelectorAll(
      ".forfait-grid, .forfait-grid-5, .forfait-grid-3, .forfait-grid-4"
    );
    grids.forEach((grid) => {
      Array.from(grid.classList).forEach((cl) => {
        if (/^last-\d-\d$/.test(cl)) grid.classList.remove(cl);
      });
    });
  }

  destroy() {
    if (this.languagePolling) {
      clearInterval(this.languagePolling);
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    if (this.languageChangeTimeout) {
      clearTimeout(this.languageChangeTimeout);
    }

    window.removeEventListener(
      "languageChanged",
      this.boundHandlers.languageChange
    );
    window.removeEventListener("resize", this.boundHandlers.resize);

    this.cleanupAllEventListeners();

    if (this.keyboardHandler) {
      this.container.removeEventListener("keydown", this.keyboardHandler);
    }

    this.sliders.clear();

    const modalContainer = this.container.querySelector(
      "#forfait-modal-container"
    );
    if (modalContainer) {
      modalContainer.innerHTML = "";
    }

    this.container.innerHTML = "";
  }
}

export default ForfaitComponent;
