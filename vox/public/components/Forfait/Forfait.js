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
    /* Base Styles */
    .forfait-slider-container {
      overflow: hidden;
      position: relative;
      width: 100%;
      touch-action: pan-y;
      margin: 0 auto;
    }

    .forfait-card-shadow {
      box-shadow: 0px 3.92px 7.84px 0px #0505050A;
      border: 0.84px solid #C5C5C5;
      border-radius: 0.75rem;
      width: 100%;
      max-width: 300px;
      min-width: 280px;
      height: 100%;
    }

    .dark .forfait-card-shadow {
      box-shadow: none;
      border: 0.84px solid #C5C5C5;
    }

    .forfait-divider {
      background-image: repeating-linear-gradient(to right, #D1D5DB 0px, #D1D5DB 8px, transparent 8px, transparent 16px);
      background-size: 16px 1px;
      background-repeat: repeat-x;
      height: 1px;
    }

    .dark .forfait-divider {
      background-image: repeating-linear-gradient(to right, #6B7280 0px, #6B7280 8px, transparent 8px, transparent 16px);
    }

    .forfait-slider-track {
      display: flex;
      align-items: stretch;
      justify-content: center;
      width: 100%;
      transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      will-change: transform;
    }

    .forfait-slider-slide {
      flex: 0 0 calc(100% - 30px);
      display: flex;
      justify-content: center;
      align-items: stretch;
      padding: 0 15px;
      box-sizing: border-box;
      margin: 0;
    }

    /* RTL Support */
    [dir="rtl"] .forfait-slider-track {
      flex-direction: row-reverse;
    }
    [dir="rtl"] .forfait-grid-5 {
      direction: rtl;
    }
    [dir="rtl"] .forfait-card-shadow {
      text-align: right;
    }
    [dir="rtl"] .forfait-card-content {
      direction: rtl;
    }
    [dir="rtl"] .forfait-feature-item {
      text-align: right;
    }
    [dir="rtl"] .forfait-mixed-title {
      flex-direction: row-reverse;
    }

    /* Modal Styles */
    .forfait-modal-fade {
      animation: modalFadeIn 0.3s ease-out forwards;
      backdrop-filter: blur(8px);
      background-color: rgba(105, 105, 105, 0.8);
    }

    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.95) translateY(-10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Hover Effects */
    .forfait-hover-lift {
      transition: all 0.3s ease;
    }
    .forfait-hover-lift:hover {
      transform: translateY(-3px);
      box-shadow: 0px 8px 16px 0px #0505051A;
      border: 0.84px solid #C5C5C5;
    }
    .dark .forfait-hover-lift:hover {
      box-shadow: none;
      border: 0.84px solid #C5C5C5;
    }

    /* Grid System */
    .forfait-grid {
      display: grid;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
      gap: 0.875rem !imortant;
      justify-items: center;
      align-items: stretch;
    }

    .forfait-mobile-slider {
      display: none;
    }

    .forfait-mobile-container {
      padding: 0 1rem;
    }

    /* 5-card grid (Forfaits) - V-shape layout on desktop screens */
    .forfait-grid-5 {
      grid-template-columns: repeat(3, minmax(280px, 320px));
      grid-template-rows: auto auto;
      
      justify-content: center;
    }
    .forfait-grid-5 > *:nth-child(1),
    .forfait-grid-5 > *:nth-child(2),
    .forfait-grid-5 > *:nth-child(3) {
      grid-row: 1;
    }
    .forfait-grid-5 > *:nth-child(4),
    .forfait-grid-5 > *:nth-child(5) {
      grid-row: 2;
      justify-self: center;
    }
    .forfait-grid-5 > *:nth-child(4) {
      grid-column: 1 / 3;
      justify-self: end;
    }
    .forfait-grid-5 > *:nth-child(5) {
      grid-column: 2 / 6;
      justify-self: start;
    }

    /* 3-card grid (Smart) */
    .forfait-grid-3 {
      grid-template-columns: repeat(3, minmax(280px, 320px));
      justify-content: center;
    }

    /* Large Desktop (1920px+) */
    @media (min-width: 1920px) {
      .forfait-grid-5 {
        grid-template-columns: repeat(5, minmax(280px, 320px));
        grid-template-rows: auto;
        gap: 0.875rem;
      }
      .forfait-grid-5 > *:nth-child(4),
      .forfait-grid-5 > *:nth-child(5) {
        grid-row: 1;
        grid-column: auto;
        justify-self: center;
      }
      .forfait-grid-3 {
        grid-template-columns: repeat(3, minmax(320px, 380px));
        gap: 0.875rem;
      }
    }

    /* Desktop (1440px - 1919px) */
    @media (min-width: 1440px) and (max-width: 1919px) {
      .forfait-grid-5 {
        grid-template-columns: repeat(3, minmax(280px, 320px));
        gap: 1.2rem 0.5rem;
        
      }
      .forfait-grid-3 {
        grid-template-columns: repeat(3, minmax(280px, 320px));
        gap: 0.875rem;
      }
    }

    /* Small Desktop (1280px - 1439px) */
    @media (min-width: 1280px) and (max-width: 1439px) {
      .forfait-grid-5,
      .forfait-grid-3 {
        grid-template-columns: repeat(3, minmax(250px, 280px));
        gap: 1rem 1rem;
        justify-content: center;
      }
      .forfait-grid-5 > *:nth-child(4) {
        justify-self: end;
      }
      .forfait-grid-5 > *:nth-child(5) {
        justify-self: start;
      }
    }

    /* Middle Screen Fix: 2-column grid */
    @media (min-width: 992px) and (max-width: 1279px) {
      .forfait-grid-5,
      .forfait-grid-3 {
        grid-template-columns: repeat(2, minmax(280px, 300px)) !important;
        gap: 1rem !important;
        justify-content: center !important;
        max-width: 600px !important;
        margin: 0 auto !important;
      }
      .forfait-grid-5 > *:nth-child(n) {
        grid-row: auto !important;
        grid-column: auto !important;
        justify-self: auto !important;
      }
      .forfait-grid-5 > *:nth-child(5),
      .forfait-grid-3 > *:nth-child(3) {
        grid-column: 1 / 3 !important;
        justify-self: center !important;
        max-width: 300px !important;
        margin-top: 1rem !important;
      }
    }

    /* Tablet Portrait (768px - 991px) */
    @media (min-width: 768px) and (max-width: 991px) {
      .forfait-grid-5,
      .forfait-grid-3 {
        grid-template-columns: repeat(2, minmax(260px, 280px));
        gap: 1rem;
        justify-content: center;
        max-width: 700px;
        margin: 0 auto;
      }
      .forfait-grid-5 > *:nth-child(5),
      .forfait-grid-3 > *:nth-child(3) {
        grid-column: 1 / 3;
        justify-self: center;
        max-width: 280px;
        margin-top: 1rem;
      }
    }

    /* Mobile Landscape (640px - 767px) */
    @media (min-width: 640px) and (max-width: 767px) {
      .forfait-grid-5,
      .forfait-grid-3 {
        grid-template-columns: 1fr;
        gap: 1rem;
        justify-content: center;
        max-width: 400px;
      }
      .forfait-grid-5 > *:nth-child(5),
      .forfait-grid-3 > *:nth-child(3) {
        justify-self: center;
        max-width: 300px;
        margin-top: 0;
      }
    }

    /* Mobile (up to 639px): slider mode */
    @media (max-width: 639px) {
      .forfait-grid {
        display: none !important;
      }
      .forfait-mobile-slider {
        display: block !important;
      }
      .forfait-mobile-slider .forfait-card-shadow {
        background: white !important;
        box-shadow: 0px 3.92px 7.84px 0px #0505050A !important;
        border: 0.84px solid #C5C5C5 !important;
        max-width: 320px;
        width: 100%;
        margin: 0 auto;
      }
      .dark .forfait-mobile-slider .forfait-card-shadow {
        background: #2C2C2C !important;
        box-shadow: none !important;
        border: 0.84px solid #C5C5C5 !important;
      }
      .forfait-mobile-slider-wrapper {
        overflow: visible;
        margin: 0 -15px;
        padding: 0 15px;
      }
      .forfait-slider-slide {
        flex: 0 0 calc(100% - 30px);
        padding: 0 15px;
      }
      .forfait-slider-container {
        overflow: visible;
      }
    }

    /* Component Styles */
    .forfait-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: #d1d5db;
    }
    .forfait-dot:hover {
      transform: scale(1.2);
      background-color: #9ca3af;
    }
    .forfait-dot.active {
      background-color: #ED1C23;
      transform: scale(1.1);
    }
    .forfait-dots-container {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 24px;
      padding: 10px;
    }
    .forfait-buy-btn {
      position: relative;
      overflow: hidden;
      z-index: 10;
      touch-action: manipulation;
    }
    .forfait-card-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 340px;
      padding: 1.5rem;
    }
    .forfait-card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .forfait-card-footer {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding-top: 1rem;
    }
    .forfait-feature-item {
      font-weight: 400;
      font-size: 18px;
      line-height: 22.37px;
      letter-spacing: 0;
      color: #000000;
    }
    .dark .forfait-feature-item {
      color: #d1d5db;
    }
    .forfait-button-zone {
      touch-action: manipulation;
      pointer-events: auto;
      z-index: 10;
      position: relative;
    }
    .forfait-mixed-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .forfait-check-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    /* Mobile Optimizations */
    @media (max-width: 640px) {
      .forfait-modal-buttons {
        flex-direction: row !important;
        gap: 12px !important;
        justify-content: center;
        align-items: center;
      }
      .forfait-modal-button {
        width: auto !important;
        min-width: 120px !important;
        flex: 1;
        max-width: 150px;
      }
      .forfait-card-container {
        min-height: 380px;
        padding: 1.25rem;
      }
      .forfait-feature-item {
        font-size: 16px;
        line-height: 20px;
      }
    }
    @media (max-width: 480px) {
      .forfait-card-container {
        min-height: 360px;
        padding: 1rem;
      }
      .forfait-feature-item {
        font-size: 15px;
        line-height: 18px;
      }
      .forfait-slider-slide {
        flex: 0 0 85%;
      }
      .forfait-mobile-slider-wrapper {
        margin: 0 -10px;
        padding: 0 10px;
      }
    }

    /* Card height adjustments */
    @media (max-width: 1279px) {
      .forfait-card-container {
        min-height: 360px !important;
      }
    }
    @media (max-width: 991px) {
      .forfait-card-container {
        min-height: 340px !important;
      }
    }
    @media (max-width: 767px) {
      .forfait-card-container {
        min-height: 320px !important;
      }
    }

    /* Additional tablet-specific fixes */
    @media (min-width: 768px) and (max-width: 1024px) {
      /* Ensure proper text wrapping */
      .forfait-feature-item {
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      /* Adjust button sizes */
      .forfait-buy-btn {
        padding: 8px 20px !important;
        font-size: 14px !important;
      }
      /* Adjust price font sizes */
    
    }

    /* Arabic specific tablet fixes */
    @media (min-width: 768px) and (max-width: 1279px) and ([dir="rtl"]) {
      .forfait-card-container {
        text-align: right;
      }
      .forfait-feature-item {
        text-align: right;
      }
      /* Adjust RTL spacing */
      .forfait-card-content ul {
        padding-right: 0;
        padding-left: 1rem;
      }
    }

    /* Text overflow prevention */
    .forfait-card-container h2,
    .forfait-card-container h3,
    .forfait-feature-item {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .forfait-card-content ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .forfait-card-content li {
      display: flex;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }


    /* Tablet Portrait (768px - 991px) - FIXED */
@media (min-width: 768px) and (max-width: 991px) {
  .forfait-grid-5,
  .forfait-grid-3 {
    grid-template-columns: repeat(2, minmax(260px, 280px));
    gap: 1rem;
    justify-content: center;
    max-width: 700px;
    margin: 0 auto;
    gap: 30px;
  }
  
  /* RESET V-shape positioning for cards 1-4 */
  .forfait-grid-5 > *:nth-child(1),
  .forfait-grid-5 > *:nth-child(2),
  .forfait-grid-5 > *:nth-child(3),
  .forfait-grid-5 > *:nth-child(4) {
    grid-row: auto !important;
    grid-column: auto !important;
    justify-self: auto !important;
    
    
  }
  
  /* Only 5th card spans both columns */
  .forfait-grid-5 > *:nth-child(5),
  .forfait-grid-3 > *:nth-child(3) {
    grid-column: 1 / 3;
    justify-self: center;
    max-width: 280px;
    margin-top: 1rem;
    
   
  }


    .swiper {
      width: 100%;
      height: 100%;
    }

    .swiper-slide {
      text-align: center;
      font-size: 18px;
      background: #444;
      display: flex;
      justify-content: center;
      align-items: center;
    }


  

}
  `;
  }

  setupEventListeners() {
    window.removeEventListener("languageChanged", this.boundHandlers.languageChange);
    window.addEventListener("languageChanged", this.boundHandlers.languageChange);

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
            } else if (e.key === "ArrowLeft" && slider.currentIndex < slider.totalSlides - 1) {
              this.updateSliderSmooth(sliderType, slider.currentIndex + 1);
            }
          } else {
            if (e.key === "ArrowLeft" && slider.currentIndex > 0) {
              this.updateSliderSmooth(sliderType, slider.currentIndex - 1);
            } else if (e.key === "ArrowRight" && slider.currentIndex < slider.totalSlides - 1) {
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
      <h2 class="tesxt-center text-3xl sm:text-4xl md:text-5xl font-medium mb-16 leading-tight tracking-wide text-black dark:text-white" dir="rtl">
        <span class="font-noto-kufi-arabic" dir="rtl">اشتراكات</span>
        <span class="font-rubik" dir="ltr"> SMART</span>
      </h2>
    `;
    } else {
      return `
      <h2 class="text-3xl sm:text-4xl md:text-5xl font-medium mb-16 leading-tight tracking-wide text-center text-black dark:text-white">
        <span class="font-rubik">FORFAIT SMART</span>
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
    <div class="w-full">
      <section class="w-full bg-[#141B4D] dark:bg-[#141414] py-16">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6">
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-medium mb-16 leading-tight tracking-wide text-center text-white">
            ${this.createMixedTitleHTML(labels.titleData, "uppercase")}
          </h2>
          ${this.slider.createResponsiveLayout(data.forfaits, labels, "forfait-grid-5", this.isRTL)}
        </div>
      </section>

      <section class="w-full bg-white dark:bg-[#2c2c2c] py-16">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6">
          ${this.renderTitle(language)}
          ${this.slider.createResponsiveLayout(data.smartForfaits, labels, "forfait-grid-3")}
        </div>
      </section>

      <div id="forfait-modal-container"></div>
    </div>
  `;

    this.bindPurchaseButtons(language, [...data.forfaits, ...data.smartForfaits]);

    setTimeout(() => {
      this.initializeSliders();
      this.addSliderAccessibility();
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
        element.setAttribute("aria-label", sliderType === "forfaits" ? "Forfaits data" : "Forfaits smart");
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
      if (event.target.closest(".forfait-buy-btn") || event.target.closest(".forfait-button-zone")) {
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
      if (event.target.closest(".forfait-buy-btn") || event.target.closest(".forfait-button-zone")) {
        return;
      }
      const touch = event.type.startsWith("touch") ? event.touches[0] : event;
      slider.touchState.currentX = touch.clientX;
      slider.touchState.currentY = touch.clientY;

      const deltaX = Math.abs(slider.touchState.currentX - slider.touchState.startX);
      const deltaY = Math.abs(slider.touchState.currentY - slider.touchState.startY);

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

      if (!slider.touchState.isDragging || slider.touchState.isScrolling) return;

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
      const options = type.startsWith("touch") ? { passive: type !== "touchmove" } : undefined;
      el.addEventListener(type, fn, options);

      const key = `${el.constructor.name}-${type}-${Date.now()}-${Math.random()}`;
      slider.eventHandlers.set(key, { type, fn, element: el });
    });

    const dragStartHandler = (e) => {
      if (!e.target.closest(".forfait-buy-btn")) {
        e.preventDefault();
      }
    };
    element.addEventListener("dragstart", dragStartHandler);
    const dragKey = `${element.constructor.name}-dragstart-${Date.now()}-${Math.random()}`;
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

    const clampedIndex = Math.max(0, Math.min(slideIndex, slider.totalSlides - 1));
    slider.currentIndex = clampedIndex;

    const containerWidth = slider.element.offsetWidth;
    const slideWidth = containerWidth * 0.85;
    const gap = 30;
    const totalSlideWidth = slideWidth + gap;

    let offset;

    if (this.isRTL()) {
      slider.track.style.flexDirection = "row-reverse";
      offset = clampedIndex * totalSlideWidth - (containerWidth - slideWidth) / 2;
    } else {
      slider.track.style.flexDirection = "row";
      offset = -clampedIndex * totalSlideWidth + (containerWidth - slideWidth) / 2;
    }

    slider.track.style.transform = `translateX(${offset}px)`;

    this.updateDots(sliderType, clampedIndex);
  }
  updateSliderSmooth(sliderType, slideIndex) {
    const slider = this.sliders.get(sliderType);
    if (!slider || !slider.track) return;

    const clampedIndex = Math.max(0, Math.min(slideIndex, slider.totalSlides - 1));
    slider.currentIndex = clampedIndex;

    const containerWidth = slider.element.offsetWidth;
    const slideWidth = containerWidth * 0.85;
    const gap = 30;
    const totalSlideWidth = slideWidth + gap;

    let offset;

    if (this.isRTL()) {
      slider.track.style.flexDirection = "row-reverse";
      offset = clampedIndex * totalSlideWidth - (containerWidth - slideWidth) / 2;
    } else {
      slider.track.style.flexDirection = "row";
      offset = -clampedIndex * totalSlideWidth + (containerWidth - slideWidth) / 2;
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
    const modalContainer = this.container.querySelector("#forfait-modal-container");
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
        console.log(`ForfaitComponent: Layout changed from ${this.lastIsMobile ? "mobile" : "desktop"} to ${newIsMobile ? "mobile" : "desktop"}`);
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

  bindPurchaseButtons(language, allOffers) {
    if (this.purchaseClickHandler) {
      this.container.removeEventListener("click", this.purchaseClickHandler);
    }
    if (this.purchaseTouchHandler) {
      this.container.removeEventListener("touchend", this.purchaseTouchHandler);
    }

    const clickHandler = (e) => {
      const button = e.target.closest(".forfait-buy-btn");
      if (!button) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const index = parseInt(button.getAttribute("data-index"), 10);
      const offer = allOffers[index];
      if (offer) {
        setTimeout(() => {
          this.handlePurchaseClick(offer, language);
        }, 50);
      }
    };

    const touchHandler = (e) => {
      const button = e.target.closest(".forfait-buy-btn");
      if (!button) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const index = parseInt(button.getAttribute("data-index"), 10);
      const offer = allOffers[index];
      if (offer) {
        setTimeout(() => {
          this.handlePurchaseClick(offer, language);
        }, 50);
      }
    };

    this.purchaseClickHandler = clickHandler;
    this.purchaseTouchHandler = touchHandler;

    this.container.addEventListener("click", clickHandler);
    this.container.addEventListener("touchend", touchHandler, { passive: false });
  }

  handlePurchaseClick(offer, language) {
    const currentLanguage = this.getLanguage();
    const modalContent = ModalData[currentLanguage];
    const content = modalContent && modalContent[offer.name] ? modalContent[offer.name] : this.getDefaultModalContent(offer, currentLanguage);

    this.showPurchaseFlow(offer.name, content, this.currentLang === "ar");
  }

  getDefaultModalContent(offer, language) {
    const isArabic = language === "ar";
    const priceNumber = this.convertToLatinNumerals(offer.price.replace(/[^0-9٠-٩]/g, ""));

    return {
      confirm: isArabic ? `تأكيد شراء ${offer.data} مقابل ${priceNumber} دج` : `Confirmer l'achat de ${offer.data} pour ${priceNumber} DA`,
      success: isArabic ? `تم تفعيل باقة ${offer.name} بنجاح!` : `Forfait ${offer.name} activé avec succès!`,
      insufficient: isArabic ? `رصيد غير كافٍ لشراء ${offer.name}` : `Crédit insuffisant pour acheter ${offer.name}`,
    };
  }

  showPurchaseFlow(offerName, content, isRTL) {
    this.showModal({
      type: "confirm",
      title: offerName,
      message: content.confirm,
      isRTL,
      onConfirm: () => {
        this.showInsufficientCreditModal(content, isRTL, () => {
          this.showSuccessModal(content, isRTL);
        });
      },
    });
  }

  showInsufficientCreditModal(content, isRTL, onClose) {
    this.showModal({
      type: "info",
      title: isRTL ? "رصيدك غير كاف" : "Crédit Insuffisant",
      message: content.insufficient,
      isRTL,
      onClose,
    });
  }

  showSuccessModal(content, isRTL) {
    this.showModal({
      type: "success",
      title: isRTL ? "هنيئًا !" : "Félicitations !",
      message: content.success,
      isRTL,
    });
  }

  showModal({ type, title, message, isRTL = false, onConfirm, onClose }) {
    try {
      const modalContainer = this.container.querySelector("#forfait-modal-container");
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
    const closeButtonPosition = isRTL ? "left-4" : "right-4";
    const buttons = this.getModalButtons(type, isRTL);
    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

    return `
      <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 forfait-modal-fade"
          style="background-color: rgba(105, 105, 105, 0.8);"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title">
          <div class="relative bg-white dark:bg-[#2C2C2C] dark:border dark:border-[#CDCDCD] rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl min-w-[320px] px-6 md:px-8 pt-16 pb-8 md:pb-12" ${dirAttribute}>
              <button class="absolute top-4 ${closeButtonPosition} p-2 z-10 rounded-full transition-all duration-200 forfait-modal-close"
                      aria-label="${isRTL ? "تم" : "Fermer"}">
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
        if (this.previouslyFocusedElement && this.previouslyFocusedElement.focus) {
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

    window.removeEventListener("languageChanged", this.boundHandlers.languageChange);
    window.removeEventListener("resize", this.boundHandlers.resize);

    this.cleanupAllEventListeners();

    if (this.keyboardHandler) {
      this.container.removeEventListener("keydown", this.keyboardHandler);
    }

    this.sliders.clear();

    const modalContainer = this.container.querySelector("#forfait-modal-container");
    if (modalContainer) {
      modalContainer.innerHTML = "";
    }

    this.container.innerHTML = "";
  }
}

export default ForfaitComponent;
