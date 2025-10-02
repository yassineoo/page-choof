import { generateHeaderHTML } from "./HeaderHtml.js";

export default class Header {
  constructor() {
    this.currentLanguage = this.getStoredLanguage();
    this.mobileMenuOpen = false;
    this.theme = this.detectInitialTheme();
    this.userData = {
      phone: "0509876543",
      offer: "La Gold",
      credit: "2000 DA",
      autoRenewal: true,
      charge: "CHARGER",
      mode: "mactivia",
    };
    this.isTransitioning = false;
    this.boundOnClick = null;
  }

  getStoredLanguage() {
    try {
      return typeof localStorage !== "undefined" ? localStorage.getItem("language") || "fr" : "fr";
    } catch (e) {
      return "fr";
    }
  }

  getStoredTheme() {
    try {
      return typeof localStorage !== "undefined" ? localStorage.getItem("theme") : null;
    } catch (e) {
      return null;
    }
  }

  setStoredTheme(theme) {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("theme", theme);
      }
    } catch (_) {}
  }

  setStoredLanguage(lang) {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("language", lang);
      }
    } catch (_) {}
  }

  async init() {
    this.render();
    requestAnimationFrame(() => {
      this.setupEventListeners();
      this.applyInitialTheme();
      this.preventHorizontalScroll();
    });
  }

  preventHorizontalScroll() {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
  }

  setupEventListeners() {
    this.initSlidingThemeSwitcher();
    this.initLanguageSwitcher();
    this.initMobileMenu();
    this.initMobileThemeSwitcher();
    this.initChargeButton();
    this.initResponsiveHandling();
    this.initToggleModal(); // NEW
  }

  render() {
    document.querySelectorAll("header").forEach((h) => h.remove());
    document.body.insertAdjacentHTML("afterbegin", generateHeaderHTML(this.currentLanguage, this.userData, this.theme));

    // Insert modal container only once
    if (!document.getElementById("toggle-modal")) {
      document.body.insertAdjacentHTML(
        "beforeend",
        `
        <div id="toggle-modal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-[9999]">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative">
            <button id="modal-close" class="absolute top-[15px] right-[15px] w-[34px] h-[34px] bg-ooredoo-red rounded-full flex items-center justify-center hover:bg-red-700 transition-colors z-10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div id="modal-content"></div>
          </div>
        </div>
      `
      );
    }
  }

  // iOS-STYLE SLIDING THEME SWITCHER
  initSlidingThemeSwitcher() {
    const themeSwitcher = document.getElementById("theme-switcher");

    if (themeSwitcher) {
      const addVisualEffects = () => {
        themeSwitcher.classList.add("ripple");
        setTimeout(() => {
          themeSwitcher.classList.remove("ripple");
        }, 600);
      };

      themeSwitcher.addEventListener("click", (e) => {
        e.preventDefault();
        addVisualEffects();
        this.setTheme(this.theme === "dark" ? "light" : "dark");
      });

      themeSwitcher.addEventListener("mouseenter", () => {
        themeSwitcher.style.transform = "translateY(-1px) scale(1.02)";
      });

      themeSwitcher.addEventListener("mouseleave", () => {
        themeSwitcher.style.transform = "translateY(0) scale(1)";
      });

      this.updateSlidingThemeSwitcher();
    }
  }

  updateSlidingThemeSwitcher() {
    const themeSwitcher = document.getElementById("theme-switcher");
    if (themeSwitcher) {
      if (this.theme === "dark") {
        themeSwitcher.classList.add("dark-mode");
      } else {
        themeSwitcher.classList.remove("dark-mode");
      }
    }
  }

  async setTheme(theme) {
    if (theme === this.theme || this.isTransitioning) return;

    this.isTransitioning = true;
    this.theme = theme;

    document.documentElement.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
    document.documentElement.classList.toggle("dark", theme === "dark");

    this.setStoredTheme(theme);
    this.updateSlidingThemeSwitcher();
    this.updateMobileThemeIcons();
    this.updateMobileMenuIcons();

    setTimeout(() => {
      this.isTransitioning = false;
    }, 400);
  }

  initResponsiveHandling() {
    const handleResize = () => {
      if (window.innerWidth >= 768 && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
      this.preventHorizontalScroll();
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        handleResize();
        this.preventHorizontalScroll();
      }, 100);
    });
  }

  detectInitialTheme() {
    const storedTheme = this.getStoredTheme();
    return storedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }

  applyInitialTheme() {
    document.documentElement.classList.toggle("dark", this.theme === "dark");
    requestAnimationFrame(() => {
      document.documentElement.style.transition = "background-color 0.3s ease-in-out, color 0.3s ease-in-out";
    });
  }

  initMobileThemeSwitcher() {
    const mobileThemeBtn = document.getElementById("theme-mobile-switcher");
    if (mobileThemeBtn) {
      mobileThemeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.setTheme(this.theme === "dark" ? "light" : "dark");
      });
      this.updateMobileThemeIcons();
    }
  }

  updateMobileThemeIcons() {
    const isDark = this.theme === "dark";
    const sunIcon = document.getElementById("mobile-sun-icon");
    const moonIcon = document.getElementById("mobile-moon-icon-dark");

    if (sunIcon) {
      sunIcon.classList.toggle("hidden", isDark);
    }
    if (moonIcon) {
      moonIcon.classList.toggle("hidden", !isDark);
    }
  }

  initLanguageSwitcher() {
    const desktopDropdown = document.getElementById("language-desktop");
    if (desktopDropdown) {
      const button = desktopDropdown.querySelector("button");
      const menu = desktopDropdown.querySelector(".language-dropdown-menu");
      if (button && menu) {
        button.onclick = (e) => {
          e.stopPropagation();
          this.toggleLanguageDropdown(menu);
          if (!this.boundOnClick) {
            this.boundOnClick = (evt) => {
              if (!desktopDropdown.contains(evt.target)) {
                this.closeLanguageDropdown(menu);
                document.removeEventListener("click", this.boundOnClick);
                this.boundOnClick = null;
              }
            };
            setTimeout(() => {
              document.addEventListener("click", this.boundOnClick);
            }, 0);
          }
        };
      }
    }
    document.querySelectorAll(".language-option").forEach((option) => {
      option.onclick = (e) => {
        e.preventDefault();
        const lang = option.textContent.trim() === "Français" ? "fr" : "ar";
        if (lang) {
          this.setLanguage(lang);
          this.closeMobileMenu();
        }
      };
    });
  }

  toggleLanguageDropdown(menu) {
    if (menu) {
      menu.classList.toggle("hidden");
    }
  }

  closeLanguageDropdown(menu) {
    if (menu && !menu.classList.contains("hidden")) {
      menu.classList.add("hidden");
    }
  }

  async setLanguage(lang) {
    if (this.currentLanguage === lang || this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentLanguage = lang;
    document.documentElement.style.transition = "all 0.3s ease-in-out";
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    this.setStoredLanguage(lang);
    await new Promise((resolve) => {
      setTimeout(() => {
        this.render();
        requestAnimationFrame(() => {
          this.setupEventListeners();
          this.preventHorizontalScroll();
          this.isTransitioning = false;
          resolve();
        });
      }, 150);
    });
  }

  initMobileMenu() {
    const menuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    if (menuBtn && mobileMenu) {
      menuBtn.onclick = (e) => {
        e.stopPropagation();
        this.toggleMobileMenu();
      };
      document.addEventListener("click", (e) => {
        if (this.mobileMenuOpen && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
          this.closeMobileMenu();
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.mobileMenuOpen) {
          this.closeMobileMenu();
        }
      });
      this.updateMobileMenuIcons();
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
      mobileMenu.style.transition = "all 0.3s ease-in-out";
      if (this.mobileMenuOpen) {
        mobileMenu.classList.remove("hidden");
        requestAnimationFrame(() => {
          mobileMenu.style.transform = "translateY(0)";
          mobileMenu.style.opacity = "1";
        });
        document.body.style.overflow = "hidden";
      } else {
        mobileMenu.style.transform = "translateY(-10px)";
        mobileMenu.style.opacity = "0";
        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300);
        document.body.style.overflow = "";
      }
    }
    this.updateMobileMenuIcons();
  }

  closeMobileMenu() {
    if (!this.mobileMenuOpen) return;
    this.mobileMenuOpen = false;
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
      mobileMenu.style.transition = "all 0.3s ease-in-out";
      mobileMenu.style.transform = "translateY(-10px)";
      mobileMenu.style.opacity = "0";
      setTimeout(() => {
        mobileMenu.classList.add("hidden");
      }, 300);
      document.body.style.overflow = "";
    }
    this.updateMobileMenuIcons();
  }

  updateMobileMenuIcons() {
    const isDark = this.theme === "dark";
    [
      { id: "mobile-menu-icon", visible: !this.mobileMenuOpen && !isDark },
      { id: "mobile-menu-icon-dark", visible: !this.mobileMenuOpen && isDark },
      { id: "mobile-menu-close-icon", visible: this.mobileMenuOpen && !isDark },
      { id: "mobile-menu-close-icon-dark", visible: this.mobileMenuOpen && isDark },
    ].forEach(({ id, visible }) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.transition = "all 0.3s ease-in-out";
        element.classList.toggle("hidden", !visible);
      }
    });
  }

  initChargeButton() {
    const chargeButtons = document.querySelectorAll('button:has([src*="baridi.svg"])');
    chargeButtons.forEach((button) => {
      button.onclick = (e) => {
        e.preventDefault();
        this.handleChargeClick();
      };
      button.onmouseenter = () => {
        button.style.transform = "scale(1.05)";
      };
      button.onmouseleave = () => {
        button.style.transform = "scale(1)";
      };
    });
  }

  handleChargeClick() {
    // Hook for payment/charge logic
  }

  // NEW: init toggle modal
  // NEW: init toggle modal
//   initToggleModal() {
//   const mactiviaBtn = document.getElementById("mactivia-btn");
//   const creditBtn = document.getElementById("credit-btn");

//   if (!mactiviaBtn || !creditBtn) return; // safety

//   // Centralized translations (unchanged)
//   const messages = {
//     fr: {
//       confirmationTitle: "MODE DE RECHARGEMENT",
//       cancelBtn: "Annuler",
//       confirmBtn: "Confirmer",
//       felicitationTitle: "Félicitations!",
//       okBtn: "OK",
//       offers: {
//         mactivia: {
//           confirmDesc:
//             'Vous allez modifier votre mode de rechargement et vous recevrez désormais votre Gold "M\'activia" à chaque rechargement de 1000 DA et plus.',
//           felicitationDesc: 'Vous êtes sur le mode "Mactivia"',
//         },
//         credit: {
//           confirmDesc:
//             "Vous allez modifier votre mode de rechargement et vous recevrez désormais du crédit non activé à chaque rechargement de 1000 DA et plus.",
//           felicitationDesc: 'Vous êtes sur le mode "Crédit"',
//         },
//       },
//     },
//     ar: {
//       confirmationTitle: "وضع التعبئة",
//       cancelBtn: "إلغاء",
//       confirmBtn: "تأكيد",
//       felicitationTitle: "هنيئًا!",
//       okBtn: "تمّ",
//       offers: {
//         mactivia: {
//           confirmDesc:
//             "ستقوم بتغيير وضع التعبئة وستحصل من الآن فصاعدًا على اشتراكك Gold M'activia عند كل تعبئة بقيمة 1000 دج وأكثر.",
//           felicitationDesc: 'أنت الآن في وضع "ماكتيفيا"',
//         },
//         credit: {
//           confirmDesc:
//             "ستقوم بتغيير وضع التعبئة وستحصل من الآن فصاعدًا على رصيد غير مفعّل عند كل تعبئة بقيمة 1000 دج وأكثر.",
//           felicitationDesc: 'أنت الآن في وضع "الرصيد"',
//         },
//       },
//     },
//   };

//   // Pick current language or fallback
//   const lang = this.currentLanguage in messages ? this.currentLanguage : "fr";
//   const texts = messages[lang];

//   const fontClass =
//     this.currentLanguage === "ar" ? "font-noto-kufi-arabic" : "font-rubik";
//   const primaryBtn = `boost-modal-button primary ${fontClass} font-semibold text-base uppercase w-40 h-12 rounded-full border-none cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-ooredoo-red text-white shadow-lg`;
//   const secondaryBtn = `boost-modal-button secondary ${fontClass} font-semibold text-base uppercase w-40 h-12 rounded-full cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-white text-ooredoo-red border-2 border-ooredoo-red shadow-md dark:bg-[#2C2C2C] dark:text-white dark:border-white`;

//   let pendingSelection = null;

//   // createModal (keeps your styles + outside click close)
//   const createModal = (title, description, buttonsHtml = "") => {
//     const modal = document.createElement("div");
//     modal.id = "custom-modal";
//     modal.className =
//       "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4";

//     modal.innerHTML = `
//       <div class="relative w-full max-w-[703px] h-auto md:h-[321px] bg-white dark:bg-[#2C2C2C] dark:border dark:border-gray-600 rounded-[18px] flex flex-col justify-center items-center overflow-hidden p-4">
        
//         <button id="modal-close-btn" class="absolute top-[15px] right-[15px] w-[34px] h-[34px] bg-ooredoo-red rounded-full flex items-center justify-center hover:bg-red-700 transition-colors z-10">
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//           </svg>
//         </button>

//         <div class="w-full text-center pt-8 md:pt-0">
//           <h1 class="text-ooredoo-red ${fontClass} text-[28px] lg:text-[34px] font-semibold uppercase mb-4 px-8">
//             ${title}
//           </h1>
//           <p class="text-black dark:text-gray-300 ${fontClass} text-[16px] lg:text-[21px] font-normal leading-normal max-w-xl mx-auto mb-8 px-4">
//             ${description}
//           </p>
//         </div>

//         ${buttonsHtml}
//       </div>
//     `;

//     document.body.appendChild(modal);

//     // Close button
//     const closeBtn = modal.querySelector("#modal-close-btn");
//     if (closeBtn) closeBtn.addEventListener("click", () => modal.remove());

//     // Close on outside click
//     modal.addEventListener("click", (e) => {
//       if (e.target === modal) {
//         modal.remove();
//       }
//     });

//     // ESC to close (helpful on mobile keyboards too)
//     const escHandler = (e) => {
//       if (e.key === "Escape") {
//         modal.remove();
//         document.removeEventListener("keydown", escHandler);
//       }
//     };
//     document.addEventListener("keydown", escHandler);

//     return modal;
//   };

//   const openConfirmationModal = (
//     selectedBtn,
//     otherBtn,
//     confirmDesc,
//     felicitationDesc,
//     modeKey
//   ) => {
//     pendingSelection = { selectedBtn, otherBtn, felicitationDesc, modeKey };

//     const buttonsHtml = `
//       <div class="flex justify-center items-center gap-[13px] flex-col sm:flex-row w-full max-w-md px-4 pb-4 md:pb-0">
//         <button id="modal-confirm-btn" class="${fontClass} ${primaryBtn}">
//           ${texts.confirmBtn}
//         </button>  
//         <button id="modal-cancel-btn" class="${fontClass} ${secondaryBtn}">
//           ${texts.cancelBtn}
//         </button>
//       </div>
//     `;

//     const modal = createModal(
//       texts.confirmationTitle,
//       confirmDesc,
//       buttonsHtml
//     );

//     modal.querySelector("#modal-cancel-btn").addEventListener("click", () => modal.remove());

//     modal.querySelector("#modal-confirm-btn").addEventListener("click", () => {
//       modal.remove();

//       if (pendingSelection) {
//         const { selectedBtn, otherBtn, modeKey } = pendingSelection;

//         // Update button styles
//         selectedBtn.classList.add("bg-ooredoo-red", "text-white");
//         selectedBtn.classList.remove("bg-white", "text-black");

//         otherBtn.classList.remove("bg-ooredoo-red", "text-white");
//         otherBtn.classList.add("bg-white", "text-black");

//         // Update userData.mode
//         this.userData.mode = modeKey;
//       }

//       openFelicitationModal(pendingSelection.felicitationDesc);
//     });
//   };

//   const openFelicitationModal = (felicitationDesc) => {
//     const buttonsHtml = `
//       <div class="flex justify-center items-center w-full max-w-md px-4 pb-4 md:pb-0">
//         <button id="modal-ok-btn" class="${fontClass} ${primaryBtn}">
//           ${texts.okBtn}
//         </button>
//       </div>
//     `;

//     const modal = createModal(
//       texts.felicitationTitle,
//       felicitationDesc,
//       buttonsHtml
//     );

//     modal.querySelector("#modal-ok-btn").addEventListener("click", () => {
//       modal.remove();
//       pendingSelection = null;
//     });
//   };

//   // Helper: attach robust touch/click listeners (debounced to avoid double-fire)
//   const attachTapListener = (el, handler) => {
//     if (!el) return;
//     el.style.touchAction = el.style.touchAction || "manipulation"; // improve responsiveness

//     let last = 0;
//     const wrapper = (e) => {
//       // prevent duplicates from multiple event types
//       const now = Date.now();
//       if (now - last < 400) {
//         e.preventDefault();
//         return;
//       }
//       last = now;

//       // Make sure to not let parent handlers interfere
//       try { e.preventDefault(); } catch (_) {}
//       try { e.stopPropagation(); } catch (_) {}

//       handler(e);
//     };

//     el.addEventListener("click", wrapper, { passive: false });
//     el.addEventListener("pointerup", wrapper, { passive: false });
//     el.addEventListener("touchend", wrapper, { passive: false });
//   };

//   // Make sure initial UI reflects stored mode
//   const setInitialActive = () => {
//     const mode = this.userData && this.userData.mode ? this.userData.mode : "mactivia";
//     if (mode === "credit") {
//       creditBtn.classList.add("bg-ooredoo-red", "text-white");
//       creditBtn.classList.remove("bg-white", "text-black");
//       mactiviaBtn.classList.add("bg-white", "text-black");
//       mactiviaBtn.classList.remove("bg-ooredoo-red", "text-white");
//     } else {
//       mactiviaBtn.classList.add("bg-ooredoo-red", "text-white");
//       mactiviaBtn.classList.remove("bg-white", "text-black");
//       creditBtn.classList.add("bg-white", "text-black");
//       creditBtn.classList.remove("bg-ooredoo-red", "text-white");
//     }
//   };

//   // Attach handlers using attachTapListener (keeps styles unchanged)
//   attachTapListener(mactiviaBtn, () =>
//     openConfirmationModal(
//       mactiviaBtn,
//       creditBtn,
//       texts.offers.mactivia.confirmDesc,
//       texts.offers.mactivia.felicitationDesc,
//       "mactivia"
//     )
//   );

//   attachTapListener(creditBtn, () =>
//     openConfirmationModal(
//       creditBtn,
//       mactiviaBtn,
//       texts.offers.credit.confirmDesc,
//       texts.offers.credit.felicitationDesc,
//       "credit"
//     )
//   );

//   // set initial active according to this.userData.mode
//   setInitialActive();
// }

  initToggleModal() {
  const desktopBtns = {
    mactivia: document.getElementById("mactivia-btn"),
    credit: document.getElementById("credit-btn"),
  };

  const mobileBtns = {
    mactivia: document.getElementById("mactivia-btn-mobile"),
    credit: document.getElementById("credit-btn-mobile"),
  };

  // Centralized translations
  const messages = {
    fr: {
      confirmationTitle: "MODE DE RECHARGEMENT",
      cancelBtn: "Annuler",
      confirmBtn: "Confirmer",
      felicitationTitle: "Félicitations!",
      okBtn: "OK",
      offers: {
        mactivia: {
          confirmDesc:
            'Vous allez modifier votre mode de rechargement et vous recevrez désormais votre Gold "M\'activia" à chaque rechargement de 1000 DA et plus.',
          felicitationDesc: 'Vous êtes sur le mode "Mactivia"',
        },
        credit: {
          confirmDesc:
            "Vous allez modifier votre mode de rechargement et vous recevrez désormais du crédit non activé à chaque rechargement de 1000 DA et plus.",
          felicitationDesc: 'Vous êtes sur le mode "Crédit"',
        },
      },
    },
    ar: {
      confirmationTitle: "وضع التعبئة",
      cancelBtn: "إلغاء",
      confirmBtn: "تأكيد",
      felicitationTitle: "هنيئًا!",
      okBtn: "تمّ",
      offers: {
        mactivia: {
          confirmDesc:
            "ستقوم بتغيير وضع التعبئة وستحصل من الآن فصاعدًا على اشتراكك Gold M'activia عند كل تعبئة بقيمة 1000 دج وأكثر.",
          felicitationDesc: 'أنت الآن في وضع "<span class=\'font-rubik\'>M\'Activia</span>"',
        },
        credit: {
          confirmDesc:
            "ستقوم بتغيير وضع التعبئة وستحصل من الآن فصاعدًا على رصيد غير مفعّل عند كل تعبئة بقيمة 1000 دج وأكثر.",
          felicitationDesc: 'أنت الآن في وضع "الرصيد"',
        },
      },
    },
  };

  const lang =
    this.currentLanguage in messages ? this.currentLanguage : "fr";
  const texts = messages[lang];

  const fontClass =
    this.currentLanguage === "ar"
      ? "font-noto-kufi-arabic"
      : "font-rubik";

  const primaryBtn = `boost-modal-button primary ${fontClass} font-semibold text-base uppercase w-40 h-12 rounded-full border-none cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-ooredoo-red text-white shadow-lg`;
  const secondaryBtn = `boost-modal-button secondary ${fontClass} font-semibold text-base uppercase w-40 h-12 rounded-full cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-white text-ooredoo-red border-2 border-ooredoo-red shadow-md dark:bg-[#2C2C2C] dark:text-white dark:border-white`;

  let pendingSelection = null;

  // ✅ Reusable modal creator
  const createModal = (title, description, buttonsHtml = "") => {
    const modal = document.createElement("div");
    modal.id = "custom-modal";
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4";

    modal.innerHTML = `
      <div class="relative w-full max-w-[703px] h-auto md:h-[321px] bg-white dark:bg-[#2C2C2C] dark:border dark:border-gray-600 rounded-[18px] flex flex-col justify-center items-center overflow-hidden p-4">
        <button id="modal-close-btn" class="absolute top-[15px] right-[15px] w-[34px] h-[34px] bg-ooredoo-red rounded-full flex items-center justify-center hover:bg-red-700 transition-colors z-10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

        <div class="w-full text-center pt-8 md:pt-0">
          <h1 class="text-ooredoo-red dark:text-white ${fontClass} text-[28px] lg:text-[34px] font-semibold uppercase mb-4 px-8">
            ${title}
          </h1>
          <p class="text-black dark:text-gray-300 ${fontClass} text-[16px] lg:text-[21px] font-normal leading-normal max-w-xl mx-auto mb-8 px-4">
            ${description}
          </p>
        </div>
        ${buttonsHtml}
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector("#modal-close-btn").addEventListener("click", () =>
      modal.remove()
    );

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });

    return modal;
  };

  // ✅ Confirmation modal
  const openConfirmationModal = (
    selectedBtn,
    otherBtn,
    confirmDesc,
    felicitationDesc,
    modeKey
  ) => {
    pendingSelection = { selectedBtn, otherBtn, felicitationDesc, modeKey };

    const buttonsHtml = `
      <div class="flex justify-center items-center gap-5 w-full pb-4 md:pb-0 flex-nowrap">  
        <button id="modal-cancel-btn" class="${fontClass} ${secondaryBtn}">
          ${texts.cancelBtn}
        </button>
        <button id="modal-confirm-btn" class="${fontClass} ${primaryBtn}">
          ${texts.confirmBtn}
        </button>
      </div>
    `;

    const modal = createModal(
      texts.confirmationTitle,
      confirmDesc,
      buttonsHtml
    );

    modal.querySelector("#modal-cancel-btn").addEventListener("click", () =>
      modal.remove()
    );

    modal.querySelector("#modal-confirm-btn").addEventListener("click", () => {
      modal.remove();

      if (pendingSelection) {
        const { selectedBtn, otherBtn, modeKey } = pendingSelection;

        selectedBtn.classList.add("bg-ooredoo-red", "text-white");
        selectedBtn.classList.remove("bg-white", "text-black");

        otherBtn.classList.remove("bg-ooredoo-red", "text-white");
        otherBtn.classList.add("bg-white", "text-black");

        this.userData.mode = modeKey;
      }

      openFelicitationModal(pendingSelection.felicitationDesc);
    });
  };

  // ✅ Felicitation modal
  const openFelicitationModal = (felicitationDesc) => {
    const buttonsHtml = `
      <div class="flex justify-center items-center w-full max-w-md px-4 pb-4 md:pb-0">
        <button id="modal-ok-btn" class="${fontClass} ${primaryBtn}">
          ${texts.okBtn}
        </button>
      </div>
    `;

    const modal = createModal(
      texts.felicitationTitle,
      felicitationDesc,
      buttonsHtml
    );

    modal.querySelector("#modal-ok-btn").addEventListener("click", () => {
      modal.remove();
      pendingSelection = null;
    });
  };

  // ✅ Attach logic for a pair of buttons (desktop or mobile)
  const attachToggleHandlers = (btns) => {
    if (!btns.mactivia || !btns.credit) return;

    btns.mactivia.addEventListener("click", () =>
      openConfirmationModal(
        btns.mactivia,
        btns.credit,
        texts.offers.mactivia.confirmDesc,
        texts.offers.mactivia.felicitationDesc,
        "mactivia"
      )
    );

    btns.credit.addEventListener("click", () =>
      openConfirmationModal(
        btns.credit,
        btns.mactivia,
        texts.offers.credit.confirmDesc,
        texts.offers.credit.felicitationDesc,
        "credit"
      )
    );
  };

  // Init both sets independently
  attachToggleHandlers(desktopBtns);
  attachToggleHandlers(mobileBtns);
}














  updateUserData(newData) {
    this.userData = { ...this.userData, ...newData };
    this.render();
    requestAnimationFrame(() => {
      this.setupEventListeners();
      this.preventHorizontalScroll();
    });
  }

  destroy() {
    document.body.style.overflow = "";
    document.body.style.overflowX = "";
    document.documentElement.style.overflowX = "";
    document.querySelectorAll("header").forEach((h) => h.remove());
  }
}
