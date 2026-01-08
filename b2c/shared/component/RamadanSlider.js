import { ramadanSliderData, ramadanWelcomeDialogData, ramadanConfirmationDialogData } from "./constants";

export class RamadanSlider {
  static injectStyles() {
    if (document.getElementById('ramadan-slider-styles')) return;
    const style = document.createElement('style');
    style.id = 'ramadan-slider-styles';
    style.textContent = `
      /* ===========================
         Ramadan Welcome Dialog
         =========================== */
      .ramadan-welcome-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease-in-out;
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
      }
      .ramadan-welcome-dialog {
        background: white;
        border-radius: 16px;
        padding: 32px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        animation: slideUp 0.3s ease-in-out;
      }
      @media (prefers-color-scheme: dark) {
        .ramadan-welcome-dialog {
          background-color: #2c2c2c;
          color: #ffffff;
        }
      }
      .ramadan-welcome-dialog-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .ramadan-welcome-dialog-title {
        font-size: 24px;
        font-weight: 700;
        color: #ed1c24;
        margin: 0;
        text-align: center;
      }
      .ramadan-welcome-dialog-text {
        font-size: 16px;
        line-height: 1.6;
        color: #333333;
        margin: 0;
        text-align: center;
      }
      @media (prefers-color-scheme: dark) {
        .ramadan-welcome-dialog-text {
          color: #e0e0e0;
        }
      }
      .ramadan-welcome-dialog-buttons {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-top: 12px;
      }
      .ramadan-welcome-dialog-btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        min-width: 120px;
      }
      .ramadan-welcome-dialog-btn.confirm-btn {
        background-color: #ed1c24;
        color: white;
      }
      .ramadan-welcome-dialog-btn.confirm-btn:hover {
        background-color: #d41620;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(237, 28, 36, 0.3);
      }
      .ramadan-welcome-dialog-btn.confirm-btn:active {
        transform: translateY(0);
      }
      .ramadan-welcome-dialog-btn.delete-btn {
        background-color: #f0f0f0;
        color: #333333;
        border: 2px solid #ddd;
      }
      @media (prefers-color-scheme: dark) {
        .ramadan-welcome-dialog-btn.delete-btn {
          background-color: #3c3c3c;
          color: #e0e0e0;
          border-color: #555;
        }
      }
      .ramadan-welcome-dialog-btn.delete-btn:hover {
        background-color: #e0e0e0;
        border-color: #999;
        transform: translateY(-2px);
      }
      @media (prefers-color-scheme: dark) {
        .ramadan-welcome-dialog-btn.delete-btn:hover {
          background-color: #4c4c4c;
          border-color: #777;
        }
      }
      .ramadan-welcome-dialog-btn.delete-btn:active {
        transform: translateY(0);
      }
      /* ===========================
         Ramadan Confirmation Dialog
         =========================== */
      .ramadan-confirmation-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease-in-out;
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
      }
      .ramadan-confirmation-dialog {
        background: white;
        border-radius: 16px;
        padding: 32px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        animation: slideUp 0.3s ease-in-out;
      }
      @media (prefers-color-scheme: dark) {
        .ramadan-confirmation-dialog {
          background-color: #2c2c2c;
          color: #ffffff;
        }
      }
      .ramadan-confirmation-dialog-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .ramadan-confirmation-dialog-title {
        font-size: 24px;
        font-weight: 700;
        color: #ed1c24;
        margin: 0;
        text-align: center;
      }
      .ramadan-confirmation-dialog-text {
        font-size: 16px;
        line-height: 1.6;
        color: #333333;
        margin: 0;
        text-align: center;
      }
      @media (prefers-color-scheme: dark) {
        .ramadan-confirmation-dialog-text {
          color: #e0e0e0;
        }
      }
      .ramadan-confirmation-dialog-buttons {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-top: 12px;
      }
      .ramadan-confirmation-dialog-btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        min-width: 120px;
      }
      .ramadan-confirmation-dialog-btn.ok-btn {
        background-color: #ed1c24;
        color: white;
      }
      .ramadan-confirmation-dialog-btn.ok-btn:hover {
        background-color: #d41620;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(237, 28, 36, 0.3);
      }
      .ramadan-confirmation-dialog-btn.ok-btn:active {
        transform: translateY(0);
      }
      /* ===========================
         Ramadan Felicitation
         =========================== */
      .ramadan-felicitation {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ed1c24 0%, #c41820 100%);
        border-radius: 16px;
        padding: 32px;
        min-width: 300px;
        box-shadow: 0 10px 40px rgba(237, 28, 36, 0.3);
        z-index: 10000;
        animation: popIn 0.4s ease-out;
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .felicitation-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }
      .felicitation-icon {
        font-size: 48px;
        color: white;
        font-weight: bold;
        animation: scaleIn 0.4s ease-out;
      }
      .felicitation-text {
        font-size: 20px;
        font-weight: 700;
        color: white;
        text-align: center;
        margin: 0;
      }
      /* ===========================
         Animations
         =========================== */
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes popIn {
        from {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.8);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      /* ===========================
         Responsive Design
         =========================== */
      @media (max-width: 640px) {
        .ramadan-welcome-dialog {
          padding: 24px;
          width: 95%;
        }
        .ramadan-welcome-dialog-title {
          font-size: 20px;
        }
        .ramadan-welcome-dialog-text {
          font-size: 14px;
        }
        .ramadan-welcome-dialog-buttons {
          flex-direction: column;
        }
        .ramadan-welcome-dialog-btn {
          width: 100%;
          min-width: unset;
        }
        .ramadan-felicitation {
          min-width: 250px;
          padding: 24px;
        }
        .felicitation-text {
          font-size: 18px;
        }
        .felicitation-icon {
          font-size: 40px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  constructor(parameters) {
    RamadanSlider.injectStyles();
    this.currentLang = this.getLanguage();
    // Always reset dialog state on each page load so dialogs show every refresh
    try {
      localStorage.removeItem("ramadanWelcomeDialogConfirmed");
      localStorage.removeItem("ramadanConfirmationHandled");
      localStorage.removeItem("ramadanFlowCompleted");
    } catch {}
    // State flags (fresh each load)
    this.confirmationHandled = false;
    this.flowCompleted = false;
    this.confirmationActive = false;
    this.boundHandlers = {
      languageChange: this.handleLanguageChange.bind(this),
      //resize: this.handleResize.bind(this),
    };
    this.setupEventListeners();
    this.checkAndShowWelcomeDialog();
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
    const currencyLabel = isRTL ? "<span class=\"font-noto-kufi-arabic\">دج</span>" : "DA";
    const buyLabel = (isRTL ? "شراء" : "Acheter");
    const textAlign = isRTL ? "text-right" : "text-left";

    const titleFontClass = this.getFontClass(offer.name);
    const dataFontClass = this.getFontClass(offer.data);
    const buttonFontClass = this.getFontClass(buyLabel);

    const priceNumber = this.convertToLatinNumerals(offer.price.replace(/[^0-9٠-٩]/g, ""));
    const durationText = this.convertToLatinNumerals(offer.duration);

    const priceFontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

    return `
      <div class="${isRTL ? "font-noto-kufi-arabic" : "font-rubik"} relative bg-white dark:bg-[#2C2C2C] rounded-xl flex flex-col w-full mx-auto forfait-card-shadow overflow-hidden" style="max-width: 300px;">
        <div class="h-full pb-6" ${isRTL ? `dir="rtl"` : ``}>
          <div class="h-14 -mx-[0.84px] bg-ooredoo-red flex items-center justify-center p-5">
            <h2 class="text-white font-rubik text-xl md:text-2xl font-medium text-center capitalize dark:text-white leading-tight">
              ${offer.price} ${currencyLabel}
            </h2>
          </div>

          <div class="flex-1 flex items-center justify-center border-b-[1px] border-b-[#BBBEBE] border-dashed">
              <h3 class="py-10 text-[50px] font-semibold text-ooredoo-red dark:text-white leading-10">${offer.data}</h3>
          </div>

          <div class="forfait-card-footer">
            <div class="flex justify-center items-baseline w-full mt-5">
              <div class="flex items-baseline justify-center" style="width:70%;">
                <span class="font-rubik font-semibold mx-2 text-[27.96px] leading-none text-black dark:text-white">${priceNumber}</span>
                <span class="${priceFontClass} font-semibold leading-none text-black dark:text-white whitespace-nowrap">${currencyLabel}</span>
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

  createResponsiveLayout(startIndex, labels, gridType, isRTL, convertToLatinNumerals) {
    const gridClass = gridType === "forfait-grid-5" ? "forfait-grid-5" : "forfait-grid-3";
    const sliderId = gridType === "forfait-grid-5" ? "forfaits-slider" : "smart-slider";
    const dotsId = gridType === "forfait-grid-5" ? "forfaits-dots" : "smart-dots";

    return `
        <div>
          <style>
            @media (min-width:640px) and (max-width:1023.98px){
              .grid-center-last-2 > *:last-child:nth-child(odd){
                grid-column: 1 / -1;
                justify-self: center;
              }
            }
          </style>
          <div class="hidden sm:flex w-full items-center justify-center">
            <div 
              class="grid items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 justify-center gap-6 max-w-[1300px]"
            > 
              ${ramadanSliderData[this.currentLang].forfaits.map((offer, index) => this.createForfaitCard(offer, startIndex + index, labels, isRTL, convertToLatinNumerals)).join("")}
            </div>
          </div>
      
            
          <div class="block md:hidden forfait-mobile-slider forfait-mobile-container" id="ramadan-slider">
              <div class="relative swiper">
              <div class="swiper-wrapper">
                  ${ramadanSliderData[this.currentLang].forfaits
                    .map(
                      (offer, index) => `
                  <div class="swiper-slide flex justify-center">
                      ${this.createForfaitCard(offer, startIndex + index, labels, isRTL, convertToLatinNumerals)}
                  </div>
                  `
                    )
                    .join("")}
              </div>
              <div class="absolute bottom-0  swiper-pagination"></div>
              </div>
          </div>
        </div>`;
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
        slidesPerView: 1,
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
        breakpoints: {
          370: {
          slidesPerView: 1.3,
          }
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

  checkAndShowWelcomeDialog() {
    // Always show welcome dialog on each load
    setTimeout(() => {
      this.showWelcomeDialog();
    }, 500);
  }

  showWelcomeDialog() {
    const dialogData = ramadanWelcomeDialogData[this.currentLang];
    const isRTL = this.currentLang === "ar";
    
    const dialogHTML = `
      <div id="ramadan-welcome-overlay"
        class="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999]"
        onclick="if(event.target.id==='ramadan-welcome-overlay'){ this.style.display='none'; }">

        <div class="relative bg-white dark:bg-[#2C2C2C] w-[90%] max-w-[703px] rounded-2xl p-6 text-center"
            onclick="event.stopPropagation()" ${isRTL ? `dir="rtl"` : `dir="ltr"`}>

          <!-- CLOSE BUTTON -->
          <button 
            class="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#ED1C24] text-white flex items-center justify-center text-xl"
            id="ramadan-welcome-close"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 34 34" fill="none">
    <rect width="34" height="34" rx="17" fill="#ED1C24"/>
    <path d="M23 11L11 23M11 11L23 23" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
          </button>

          <h2 class="text-[24px] md:text-3xl text-[#ED1C24] dark:text-white font-semibold font-bold uppercase mt-2 mb-4 ${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}">
            ${dialogData.title}
          </h2>

          <p class="mb-6 text-black dark:text-white ${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}">
            ${dialogData.text}
          </p>

          <div class="flex gap-3 justify-center ${isRTL ? "flex-row-reverse" : "flex-row"}">
            <button 
              class="relative z-10 w-40 max-w-[200px] h-12 rounded-full bg-[#ED1C24] text-white text-[15.4px] font-semibold uppercase ${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}"
              id="ramadan-welcome-confirm"
            >
              ${dialogData.confirmBtn}
            </button>
            <button 
              class="relative z-10 w-40 max-w-[200px] h-12 rounded-full bg-white dark:bg-transparent border-2 border-[#ED1C24] dark:border-white text-[#ED1C24] dark:text-white text-[15.4px] font-semibold uppercase ${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}"
              id="ramadan-welcome-delete"
            >
              ${dialogData.deleteBtn}
            </button>
          </div>
        </div>
      </div>
    `;

    // Add dialog to DOM
    document.body.insertAdjacentHTML("beforeend", dialogHTML);
    const overlay = document.getElementById('ramadan-welcome-overlay');
    overlay.style.display = "flex";
    
    // Add event listeners
    const confirmBtn = document.getElementById('ramadan-welcome-confirm');
    const deleteBtn = document.getElementById('ramadan-welcome-delete');
    const closeBtn = document.getElementById('ramadan-welcome-close');

    confirmBtn.addEventListener("click", () => {
      this.handleWelcomeDialogConfirm(overlay);
    });

    deleteBtn.addEventListener("click", () => {
      this.closeWelcomeDialog(overlay);
    });

    closeBtn.addEventListener("click", () => {
      this.closeWelcomeDialog(overlay);
    });

    // Close on overlay click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.closeWelcomeDialog(overlay);
      }
    });
  }

  handleWelcomeDialogConfirm(overlay) {
    localStorage.setItem("ramadanWelcomeDialogConfirmed", "true");
    this.closeWelcomeDialog(overlay);
    setTimeout(() => {
      // Skip confirmation entirely and go straight to felicitation
      localStorage.setItem("ramadanConfirmationHandled", "true");
      localStorage.setItem("ramadanFlowCompleted", "true");
      this.confirmationHandled = true;
      this.flowCompleted = true;
      this.confirmationActive = false;
      // Ensure any confirmation artifacts are removed
      this.forceRemoveConfirmationElements();
      this.showFelicitation();
    }, 300);
  }

  closeWelcomeDialog(overlay) {
    if (overlay) {
      overlay.style.opacity = "0";
      overlay.style.transition = "opacity 0.3s ease-in-out";
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }
  }

  cleanupAllDialogs() {
    const dialogs = document.querySelectorAll('[id$="-dialog"]');
    dialogs.forEach(dialog => {
      if (dialog.id.includes('ramadan')) {
        dialog.remove();
      }
    });
  }

  removeAllRamadanDialogs() {
  // Remove specific dialog IDs
  const dialogIds = [
    'ramadan-welcome-overlay',
    'ramadan-confirmation-overlay', 
    'ramadan-felicitation-panel'
  ];
  dialogIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

  // Force remove any lingering confirmation elements (overlay/buttons/containers)
  forceRemoveConfirmationElements() {
    const selectors = [
      '#ramadan-confirmation-overlay',
      '#ramadan-confirmation-close-btn',
      '#ramadan-confirmation-ok-btn',
      '#ramadan-confirmation-cancel-btn',
      '[id^="ramadan-confirmation"]',
      '.ramadan-confirmation-dialog',
      '.ramadan-confirmation-dialog-overlay'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(el => {
      try { el.remove(); } catch {}
    });
  }

  showFelicitation() {
    // Brutal cleanup - remove confirmation overlay completely
    const confirmationOverlay = document.getElementById('ramadan-confirmation-overlay');
    if (confirmationOverlay) {
      confirmationOverlay.remove();
    }
    // Extra safety: remove any lingering confirmation elements
    this.forceRemoveConfirmationElements();
    // Live guard: auto-remove any confirmation nodes that might get re-inserted
    const removeConfirmations = () => {
      this.forceRemoveConfirmationElements();
    };
    removeConfirmations();
    this.felicitationObserver = new MutationObserver(() => {
      removeConfirmations();
    });
    this.felicitationObserver.observe(document.body, { childList: true, subtree: true });
    // Mark that the overall flow is completed to avoid any re-insertions
    localStorage.setItem("ramadanFlowCompleted", "true");
    this.flowCompleted = true;
    this.confirmationActive = false;
    
    // Remove ALL confirmation buttons individually
    const confirmButtons = document.querySelectorAll('[id*="ramadan-confirmation"]');
    confirmButtons.forEach(btn => btn.remove());
    
    // Remove ALL welcome elements
    const welcomeElements = document.querySelectorAll('[id*="ramadan-welcome"]');
    welcomeElements.forEach(el => el.remove());
    
    // Hide any remaining ramadan elements (just in case)
    document.querySelectorAll('[id*="ramadan-"]').forEach(el => {
      el.style.display = 'none';
    });

    // Ensure no confirmation-related element remains
    this.forceRemoveConfirmationElements();
    
    const isRTL = this.currentLang === "ar";
    const felicitationText = isRTL ? "هنيئًا!" : "Félicitations!";
    
    const felicitationHTML = `
      <div id="ramadan-felicitation-panel" style="display:none"
        class="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999]">

        <div class="relative bg-white dark:bg-[#2C2C2C] w-[90%] max-w-[703px] rounded-2xl p-6 text-center"
            onclick="event.stopPropagation()">

          <h2 class="text-[24px] md:text-3xl text-[#ED1C24] dark:text-white font-semibold font-bold uppercase mt-2 ${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}">
            ${felicitationText}
          </h2>

          <p class="py-8">${ramadanConfirmationDialogData[this.currentLang].text}</p>

          <button 
            class="relative z-10 w-40 max-w-[200px] h-12 rounded-full bg-[#ED1C24] text-white text-[15.4px] font-semibold uppercase ${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}"
            id="ramadan-felicitation-ok"
          >
            OK
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", felicitationHTML);
    const dialog = document.getElementById("ramadan-felicitation-panel");
    dialog.style.display = "flex";
    dialog.style.opacity = "1";
    dialog.style.transition = "opacity 0.3s ease-in-out";
    
    const okBtn = document.getElementById("ramadan-felicitation-ok");
    okBtn.addEventListener("click", () => {
      dialog.style.opacity = "0";
      setTimeout(() => {
        if (this.felicitationObserver) {
          try { this.felicitationObserver.disconnect(); } catch {}
          this.felicitationObserver = null;
        }
        dialog.remove();
      }, 300);
    });
  }

  showConfirmationDialog() {
    const dialogData = ramadanConfirmationDialogData[this.currentLang];
    const isRTL = this.currentLang === "ar";
    const idPrefix = "ramadan-confirmation";
    // Prevent duplicates if already handled or already present
    if (this.confirmationHandled) return;
    if (this.flowCompleted) return;
    if (document.getElementById(`${idPrefix}-overlay`)) return;
    
    const dialogHTML = `
      <div id="${idPrefix}-overlay" style="display:none"
        class="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999]">

        <div class="relative bg-white dark:bg-[#2C2C2C] w-[90%] max-w-[703px] rounded-2xl p-6 text-center"
            onclick="event.stopPropagation()" ${isRTL ? `dir="rtl"` : `dir="ltr"`}>

          <!-- CLOSE BUTTON -->
          <button 
            class="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#ED1C24] text-white flex items-center justify-center text-xl"
            id="${idPrefix}-close-btn"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 34 34" fill="none">
    <rect width="34" height="34" rx="17" fill="#ED1C24"/>
    <path d="M23 11L11 23M11 11L23 23" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
          </button>

          <h2 class="text-[24px] md:text-3xl text-[#ED1C24] dark:text-white font-semibold font-bold uppercase mt-2 mb-4 ${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}">
            ${dialogData.title}
          </h2>

          <p class="mb-6 text-black dark:text-white ${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}">
            ${dialogData.text}
          </p>

          <div class="flex gap-3 justify-center ${isRTL ? "flex-row-reverse" : "flex-row"}">
            <button 
              class="relative z-10 w-40 max-w-[200px] h-12 rounded-full bg-[#ED1C24] text-white text-[15.4px] font-semibold uppercase ${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}"
              id="${idPrefix}-ok-btn"
            >
              ${dialogData.okBtn}
            </button>
            <button 
              class="relative z-10 w-40 max-w-[200px] h-12 rounded-full bg-transparent border-2 border-[#ED1C24] dark:border-white text-[#ED1C24] dark:text-white text-[15.4px] font-semibold uppercase ${isRTL ? "font-noto-kufi-arabic" : "font-rubik"}"
              id="${idPrefix}-cancel-btn"
            >
              ${dialogData.cancelBtn}
            </button>
          </div>
        </div>
      </div>
    `;

    // Add dialog to DOM
    document.body.insertAdjacentHTML("beforeend", dialogHTML);
    const dialog = document.getElementById(`${idPrefix}-overlay`);
    dialog.style.display = "flex";
    this.confirmationActive = true;
    
    // Add event listeners
    const okBtn = document.getElementById(`${idPrefix}-ok-btn`);
    const cancelBtn = document.getElementById(`${idPrefix}-cancel-btn`);
    const closeBtn = document.getElementById(`${idPrefix}-close-btn`);

    okBtn.addEventListener("click", () => {
      if (dialog) {
        dialog.style.opacity = "0";
        dialog.style.transition = "opacity 0.3s ease-in-out";
        setTimeout(() => {
          // Completely remove the entire confirmation dialog and all its elements
          dialog.remove();
          // Also force remove any lingering confirmation elements
          this.forceRemoveConfirmationElements();
          // Mark confirmation handled to prevent re-render
          localStorage.setItem("ramadanConfirmationHandled", "true");
          this.confirmationHandled = true;
          this.confirmationActive = false;
          // Wait before showing felicitation
          setTimeout(() => {
            this.showFelicitation();
          }, 50);
        }, 300);
      }
    });

    cancelBtn.addEventListener("click", () => {
      this.closeConfirmationDialog(dialog);
      this.forceRemoveConfirmationElements();
      this.confirmationActive = false;
    });

    closeBtn.addEventListener("click", () => {
      this.closeConfirmationDialog(dialog);
      this.forceRemoveConfirmationElements();
      this.confirmationActive = false;
    });

    // Close on overlay click
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        this.closeConfirmationDialog(dialog);
      }
    });
  }

  closeConfirmationDialog(overlay) {
    if (overlay) {
      overlay.style.opacity = "0";
      overlay.style.transition = "opacity 0.3s ease-in-out";
      setTimeout(() => {
        overlay.remove();
        this.forceRemoveConfirmationElements();
        this.confirmationActive = false;
      }, 300);
    }
  }
}
