import { generateHeaderHTML } from "./HeaderHtml";
import { offerData } from "./OfferData.js";
import { ModalSlider } from "./ModalSlider.js";

class Modal {
  constructor() {
    this.overlay = document.getElementById("global-modal-overlay");
    this.container = document.getElementById("global-modal-container");
    this.setupListeners();
  }
  setupListeners() {
    if (this.overlay) {
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        this.overlay &&
        !this.overlay.classList.contains("hidden")
      ) {
        this.close();
      }
    });
  }
  getCloseButtonHTML() {
    return `
      <button id="modal-close-btn" type="button" aria-label="Close modal"
        class="absolute top-[15px] right-[15px] w-[34px] h-[34px] flex items-center justify-center rounded-full bg-ooredoo-red text-white z-20">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M13.25 1.50391L1.25 13.5039M1.25 1.50391L13.25 13.5039"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;
  }
  open(contentHTML) {
    if (!this.overlay || !this.container) return;
    this.container.innerHTML = contentHTML;
    this.overlay.classList.remove("hidden", "modal-animating-out");
    this.container.classList.remove("modal-animating-out");
    this.overlay.classList.add("modal-animating-in");
    this.container.classList.add("modal-animating-in");
    const closeBtn = this.container.querySelector("#modal-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }
  }
  close() {
    if (
      !this.overlay ||
      !this.container ||
      this.overlay.classList.contains("hidden")
    )
      return;
    this.overlay.classList.remove("modal-animating-in");
    this.container.classList.remove("modal-animating-in");
    this.overlay.classList.add("modal-animating-out");
    this.container.classList.add("modal-animating-out");
    setTimeout(() => {
      if (this.overlay) this.overlay.classList.add("hidden");
      if (this.container) this.container.innerHTML = "";
    }, 300);
  }
  showConfirmation({
    title,
    text,
    confirmText = "CONFIRMER",
    cancelText = "ANNULER",
    onConfirm,
  }) {
    const contentHTML = `
      <div class="bg-white dark:bg-[#2c2c2c] rounded-lg shadow-xl p-6 md:p-8 text-center relative">
        ${this.getCloseButtonHTML()}
        <h2 class="text-2xl font-bold text-ooredoo-red dark:text-white mb-4">${title}</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">${text}</p>
        <div class="flex justify-center gap-4">
          <button id="modal-cancel-btn" type="button" class="rounded-full border-2 border-ooredoo-red text-ooredoo-red dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-ooredoo-red font-semibold hover:bg-ooredoo-red hover:text-white transition-colors px-6 py-2">${cancelText}</button>
          <button id="modal-confirm-btn" type="button" class="rounded-full bg-ooredoo-red text-white font-semibold hover:bg-red-700 transition-colors px-6 py-2">${confirmText}</button>
        </div>
      </div>
    `;
    this.open(contentHTML);
    const confirmBtn = this.container.querySelector("#modal-confirm-btn");
    const cancelBtn = this.container.querySelector("#modal-cancel-btn");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        if (onConfirm) onConfirm();
        this.close();
      });
    }
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => this.close());
    }
  }
  showAlert({ title, text, buttonText = "OK" }) {
    const contentHTML = `
      <div class="bg-white dark:bg-[#2c2c2c] rounded-lg shadow-xl p-6 md:p-8 text-center relative">
        ${this.getCloseButtonHTML()}
        <h2 class="text-2xl font-bold text-ooredoo-red dark:text-white mb-4">${title}</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">${text}</p>
        <div class="flex justify-center">
          <button id="modal-ok-btn" type="button" class="min-w-[150px] rounded-full bg-ooredoo-red text-white font-semibold hover:bg-red-700 transition-colors px-6 py-2">${buttonText}</button>
        </div>
      </div>
    `;
    this.open(contentHTML);
    const okBtn = this.container.querySelector("#modal-ok-btn");
    if (okBtn) okBtn.addEventListener("click", () => this.close());
  }
  showCustom(contentHTML) {
    this.open(contentHTML);
  }
}

export default class Header {
  constructor() {
    this.currentLanguage = localStorage.getItem("language") || "fr";
    this.mobileMenuOpen = false;
    this.theme = this.detectInitialTheme();
    this.modalSliderInstance = null;
    const storedRenewal = localStorage.getItem("autoRenewal");
    const storedOffer = localStorage.getItem("selectedOffer");
    this.userData = {
      phone: "0509876543",
      offer: "Offre La Gold Jdida",
      credit: "4000",
      autoRenewal: storedRenewal !== null ? JSON.parse(storedRenewal) : true,
    };
    this.isTransitioning = false;
    this.boundOnClick = null;
  }
  getFontClass() {
    return this.currentLanguage === "ar"
      ? "font-noto-kufi-arabic"
      : "font-rubik";
  }
  async init() {
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir =
      this.currentLanguage === "ar" ? "rtl" : "ltr";
    this.render();
    requestAnimationFrame(() => {
      this.setupEventListeners();
      this.applyInitialTheme();
      this.preventHorizontalScroll();
    });
  }
  setupEventListeners() {
    this.modal = new Modal();
    this.initSlidingThemeSwitcher();
    this.initThemeSwitcher();
    this.initLanguageSwitcher();
    this.initMobileMenu();
    this.initMobileThemeSwitcher();
    this.initRenewalInfoCard();
    this.initRenewalSwitcher();
    this.initResponsiveHandling();
  }
  preventHorizontalScroll() {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
  }
  initResponsiveHandling() {
    const handleResize = () => {
      if (window.innerWidth >= 820 && this.mobileMenuOpen) {
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
  initSlidingThemeSwitcher() {
    const themeSwitcher = document.getElementById("theme-switcher");
    if (!themeSwitcher) return;
    const addVisualEffects = () => {
      themeSwitcher.classList.add("ripple");
      setTimeout(() => themeSwitcher.classList.remove("ripple"), 600);
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
    this.updateDesktopThemeSwitcher();
  }
  render() {
    document.querySelectorAll("header").forEach((h) => h.remove());
    document.body.insertAdjacentHTML(
      "afterbegin",
      generateHeaderHTML(this.currentLanguage, this.userData, this.theme)
    );
  }
  detectInitialTheme() {
    const storedTheme = localStorage.getItem("theme");
    return (
      storedTheme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  }
  applyInitialTheme() {
    document.documentElement.classList.toggle("dark", this.theme === "dark");
  }
  setTheme(theme) {
    if (theme === this.theme) return;
    this.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
    this.updateThemeUI();
  }
  updateThemeUI() {
    this.updateDesktopThemeSwitcher();
    this.updateMobileThemeIcons();
    this.updateMobileMenuIcons();
    this.updateRenewalUI();
  }
  initThemeSwitcher() {
    const moonBtn = document.getElementById("moon-btn");
    const sunBtn = document.getElementById("sun-btn");
    if (moonBtn && sunBtn) {
      moonBtn.addEventListener("click", () => this.setTheme("dark"));
      sunBtn.addEventListener("click", () => this.setTheme("light"));
      this.updateDesktopThemeSwitcher();
    }
  }
  updateDesktopThemeSwitcher() {
    const isDark = this.theme === "dark";
    const themeContainer = document.getElementById("theme-switcher");
    if (themeContainer) {
      themeContainer.className = `relative w-36 h-12 rounded-full ${
        isDark ? "bg-ooredoo-red" : "bg-gray-200"
      } overflow-hidden transition-all duration-500`;
      const moonBtn = document.getElementById("moon-btn");
      const sunBtn = document.getElementById("sun-btn");
      if (moonBtn && sunBtn) {
        moonBtn.classList.toggle("bg-white", isDark);
        moonBtn.classList.toggle("bg-[#171717]", !isDark);
        sunBtn.classList.toggle("bg-ooredoo-red", isDark);
        sunBtn.classList.toggle("bg-[#E4E4E7]", !isDark);
      }
    }
  }
  initMobileThemeSwitcher() {
    const mobileThemeBtn = document.getElementById("theme-mobile-switcher");
    if (mobileThemeBtn) {
      mobileThemeBtn.addEventListener("click", () => {
        this.setTheme(this.theme === "dark" ? "light" : "dark");
      });
      this.updateMobileThemeIcons();
    }
  }
  updateMobileThemeIcons() {
    const isDark = this.theme === "dark";
    document
      .getElementById("mobile-sun-icon")
      ?.classList.toggle("hidden", isDark);
    document
      .getElementById("mobile-sun-icon-dark")
      ?.classList.toggle("hidden", !isDark);
    document
      .getElementById("mobile-moon-icon")
      ?.classList.toggle("hidden", !isDark);
    document
      .getElementById("mobile-moon-icon-dark")
      ?.classList.toggle("hidden", isDark);
  }
  initLanguageSwitcher() {
    const desktopDropdown = document.getElementById("language-desktop");
    if (desktopDropdown) {
      const button = desktopDropdown.querySelector("button");
      const menu = desktopDropdown.querySelector(".language-dropdown-menu");
      if (button && menu) {
        button.addEventListener("click", (e) => {
          e.stopPropagation();
          menu.classList.toggle("hidden");
        });
        document.addEventListener("click", () => menu.classList.add("hidden"));
      }
    }
    document.querySelectorAll(".language-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        const lang =
          option.dataset?.lang ||
          (option.textContent?.trim() === "Français" ? "fr" : "ar");
        this.setLanguage(lang);
        this.closeMobileMenu();
      });
    });
  }
  setLanguage(lang) {
    if (this.currentLanguage === lang) return;
    this.currentLanguage = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    localStorage.setItem("language", lang);
    this.render();
    setTimeout(() => this.setupEventListeners(), 0);
  }
  initMobileMenu() {
    const menuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    if (menuBtn && mobileMenu) {
      this.addViewportMeta();
      menuBtn.setAttribute("aria-controls", "mobile-menu");
      menuBtn.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
      mobileMenu.style.transition = "transform 0.28s ease, opacity 0.28s ease";
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleMobileMenu();
      });
      document.addEventListener("click", (e) => {
        if (
          this.mobileMenuOpen &&
          !mobileMenu.contains(e.target) &&
          !menuBtn.contains(e.target)
        ) {
          this.closeMobileMenu();
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.mobileMenuOpen) this.closeMobileMenu();
      });
      this.updateMobileMenuIcons();
    }
  }
  addViewportMeta() {
    const existingMeta = document.querySelector('meta[name="viewport"]');
    if (!existingMeta) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content =
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
      document.head.appendChild(meta);
    }
  }
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    const mobileMenu = document.getElementById("mobile-menu");
    const menuBtn = document.getElementById("mobile-menu-btn");
    if (mobileMenu && menuBtn) {
      mobileMenu.style.willChange = "transform, opacity";
      if (this.mobileMenuOpen) {
        mobileMenu.classList.remove("hidden");
        requestAnimationFrame(() => {
          mobileMenu.style.transform = "translateY(0)";
          mobileMenu.style.opacity = "1";
        });
        document.body.style.overflow = "hidden";
        mobileMenu.setAttribute("aria-hidden", "false");
        menuBtn.setAttribute("aria-expanded", "true");
      } else {
        mobileMenu.style.transform = "translateY(-10px)";
        mobileMenu.style.opacity = "0";
        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300);
        document.body.style.overflow = "";
        mobileMenu.setAttribute("aria-hidden", "true");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    }
    this.updateMobileMenuIcons();
  }
  closeMobileMenu() {
    if (!this.mobileMenuOpen) return;
    this.mobileMenuOpen = false;
    const mobileMenu = document.getElementById("mobile-menu");
    const menuBtn = document.getElementById("mobile-menu-btn");
    if (mobileMenu) {
      mobileMenu.style.transform = "translateY(-10px)";
      mobileMenu.style.opacity = "0";
      setTimeout(() => {
        mobileMenu.classList.add("hidden");
      }, 300);
      mobileMenu.setAttribute("aria-hidden", "true");
    }
    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "false");
    }
    document.body.style.overflow = "";
    this.updateMobileMenuIcons();
  }
  updateMobileMenuIcons() {
    const isDark = this.theme === "dark";
    [
      { id: "mobile-menu-icon", visible: !this.mobileMenuOpen && !isDark },
      { id: "mobile-menu-icon-dark", visible: !this.mobileMenuOpen && isDark },
      { id: "mobile-menu-close-icon", visible: this.mobileMenuOpen && !isDark },
      {
        id: "mobile-menu-close-icon-dark",
        visible: this.mobileMenuOpen && isDark,
      },
    ].forEach(({ id, visible }) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.transition = "all 0.25s ease";
        el.classList.toggle("hidden", !visible);
      }
    });
  }
  initRenewalInfoCard() {
    const infoBtn = document.getElementById("auto-renewal-info");
    const infoCard = document.getElementById("auto-renewal-card");
    const infoBtnMobile = document.getElementById("auto-renewal-info-mobile");
    const infoCardMobile = document.getElementById("auto-renewal-card-mobile");
    if (infoBtn && infoCard) {
      infoBtn.addEventListener("mouseenter", () =>
        infoCard.classList.remove("hidden")
      );
      infoBtn.addEventListener("mouseleave", () =>
        infoCard.classList.add("hidden")
      );
      infoBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        infoCard.classList.toggle("hidden");
      });
    }
    if (infoBtnMobile && infoCardMobile) {
      let mobileAnchor = infoBtnMobile.closest("div");
      if (!mobileAnchor) mobileAnchor = document.body;
      if (getComputedStyle(mobileAnchor).position === "static") {
        mobileAnchor.style.position = "relative";
      }
      if (infoCardMobile.parentNode !== mobileAnchor) {
        mobileAnchor.appendChild(infoCardMobile);
      }
      Object.assign(infoCardMobile.style, {
        position: "absolute",
        left: "0",
        right: "0",
        width: "100%",
        top: "calc(100% + 8px)",
        transform: "none",
        margin: "0",
        boxSizing: "border-box",
        padding: infoCardMobile.style.padding || "12px",
        zIndex: "60",
      });
      infoBtnMobile.addEventListener("click", (e) => {
        e.stopPropagation();
        infoCardMobile.classList.toggle("hidden");
      });
      infoBtnMobile.addEventListener(
        "touchstart",
        (e) => {
          e.stopPropagation();
          infoCardMobile.classList.toggle("hidden");
        },
        { passive: true }
      );
      document.addEventListener("click", (e) => {
        if (
          !infoBtnMobile.contains(e.target) &&
          !infoCardMobile.contains(e.target)
        ) {
          infoCardMobile.classList.add("hidden");
        }
      });
      window.addEventListener("resize", () => {
        if (window.innerWidth > 767) {
          infoCardMobile.classList.add("hidden");
        } else {
          if (getComputedStyle(mobileAnchor).position === "static") {
            mobileAnchor.style.position = "relative";
          }
        }
      });
    }
  }
  initRenewalSwitcher() {
    const autoBtn = document.getElementById("renewal-auto");
    const manualBtn = document.getElementById("renewal-manual");
    const autoBtnMobile = document.getElementById("renewal-auto-mobile");
    const manualBtnMobile = document.getElementById("renewal-manual-mobile");
    if (autoBtn && manualBtn) {
      autoBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.handleAutoRenewalClick();
      });
      manualBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.handleManualRenewalClick();
      });
    }
    if (autoBtnMobile && manualBtnMobile) {
      autoBtnMobile.addEventListener("click", (e) => {
        e.stopPropagation();
        this.handleAutoRenewalClick();
      });
      manualBtnMobile.addEventListener("click", (e) => {
        e.stopPropagation();
        this.handleManualRenewalClick();
      });
    }
    this.updateRenewalUI();
  }
  updateRenewalUI() {
    const isAuto = this.userData.autoRenewal;
    const autoBtn = document.getElementById("renewal-auto");
    const manualBtn = document.getElementById("renewal-manual");
    const autoBtnMobile = document.getElementById("renewal-auto-mobile");
    const manualBtnMobile = document.getElementById("renewal-manual-mobile");
    const activeStyle = { background: "#E30613", color: "#ffffffff" };
    const inactiveStyle = { background: "transparent", color: "#575757" };
    if (autoBtn)
      Object.assign(autoBtn.style, isAuto ? activeStyle : inactiveStyle);
    if (manualBtn)
      Object.assign(manualBtn.style, !isAuto ? activeStyle : inactiveStyle);
    if (autoBtnMobile)
      Object.assign(autoBtnMobile.style, isAuto ? activeStyle : inactiveStyle);
    if (manualBtnMobile)
      Object.assign(
        manualBtnMobile.style,
        !isAuto ? activeStyle : inactiveStyle
      );
    const autoIcon = autoBtn?.querySelector("img");
    const manualIcon = manualBtn?.querySelector("img");
    if (autoIcon && manualIcon) {
      autoIcon.classList.toggle("hidden", !isAuto);
      manualIcon.classList.toggle("hidden", isAuto);
    }
    const autoIconMobile = autoBtnMobile?.querySelector("img");
    const manualIconMobile = manualBtnMobile?.querySelector("img");
    if (autoIconMobile && manualIconMobile) {
      autoIconMobile.classList.toggle("hidden", !isAuto);
      manualIconMobile.classList.toggle("hidden", isAuto);
    }
  }
  handleManualRenewalClick() {
    if (!this.userData.autoRenewal) return;
    const texts = offerData.text[this.currentLanguage];
    const onConfirm = () => {
      this.modal.close();
      setTimeout(() => {
        this.userData.autoRenewal = false;
        localStorage.setItem("autoRenewal", "false");
        this.updateRenewalUI();
        this.modal.showAlert({
          title: texts.manualSuccessTitle,
          text: texts.manualSuccessDesc,
          buttonText: texts.okBtn,
        });
      }, 350);
    };
    const closeBtnHTML =
      this.modal && typeof this.modal.getCloseButtonHTML === "function"
        ? this.modal.getCloseButtonHTML()
        : "";
    const fontClass = this.getFontClass();
    const customContent = `
      <div class="relative w-full max-w-[703px] h-auto md:h-[321px] bg-white dark:bg-[#2C2C2C] dark:border dark:border-gray-600 rounded-[18px] flex flex-col justify-center items-center overflow-hidden p-4">
        ${closeBtnHTML}
        <div class="w-full text-center pt-8 md:pt-0">
          <h1 class="text-ooredoo-red dark:text-white ${fontClass} text-[28px] lg:text-[34px] font-semibold uppercase mb-4 px-8">
            ${texts.manualModalTitle}
          </h1>
          <p class="${fontClass} text-[16px] lg:text-[21px] font-normal leading-normal max-w-xl mx-auto mb-8 px-4">
            ${texts.manualModalDesc}
          </p>
        </div>
        <div class="flex justify-center items-center gap-[13px] flex-col sm:flex-row w-full max-w-md px-4 pb-4 md:pb-0">
          <button id="modal-cancel-btn" type="button" class="flex w-full sm:w-auto justify-center items-center rounded-[22px] border-2 border-ooredoo-red text-ooredoo-red dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-ooredoo-red ${fontClass} font-semibold uppercase hover:bg-ooredoo-red/5 transition-colors" style="padding: 8.21px 29.78px; font-size: 15.4px;">
            ${texts.cancelBtn}
          </button>
          <button id="modal-confirm-btn" type="button" class="flex w-full sm:w-auto justify-center items-center rounded-[25px] bg-ooredoo-red text-white ${fontClass} font-semibold uppercase hover:bg-red-700 transition-colors" style="padding: 8.21px 29.78px; font-size: 15.4px;">
            ${texts.confirmBtn}
          </button>
        </div>
      </div>
    `;
    this.modal.showCustom(customContent);
    const confirmBtn = this.modal.container.querySelector("#modal-confirm-btn");
    const cancelBtn = this.modal.container.querySelector("#modal-cancel-btn");
    if (confirmBtn) confirmBtn.addEventListener("click", onConfirm);
    if (cancelBtn)
      cancelBtn.addEventListener("click", () => this.modal.close());
  }
  handleAutoRenewalClick() {
    if (this.userData.autoRenewal) return;
    const texts = offerData.text[this.currentLanguage];
    const closeBtnHTML =
      this.modal && typeof this.modal.getCloseButtonHTML === "function"
        ? this.modal.getCloseButtonHTML()
        : "";
    const fontClass = this.getFontClass();
    const customContent = `
      <div class="relative w-full max-w-5xl bg-white dark:bg-[#2C2C2C] rounded-lg flex flex-col overflow-hidden">
        ${closeBtnHTML}
        <div class="p-6 md:p-8 text-center">
          <h2 class="${fontClass} text-2xl font-bold text-[28px] text-ooredoo-red dark:text-white mb-8">${texts.autoModalTitle}</h2>
          <p class="${fontClass} text-black dark:text-white mb-4 px-0 text-[22px] md:px-[30px]">
            ${texts.autoModalDesc}
          </p>
          <div class="mt-6">
            <button id="modal-cancel-btn" type="button" class="${fontClass} rounded-full border-2 border-ooredoo-red text-ooredoo-red dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-ooredoo-red font-semibold hover:bg-ooredoo-red hover:text-white transition-colors" style="padding: 8.21px 29.78px; font-size: 15.4px;">
              ${texts.cancelBtn}
            </button>
          </div>
        </div>
        <div class="border-b border-gray-200 dark:border-white"></div>
        <div class="bg-[#F8F8F8] dark:bg-[#2c2c2c] py-6">
          <div id="modal-slider-container"></div>
        </div>
      </div>`;
    this.modal.showCustom(customContent);
    const sliderContainer = this.modal.container.querySelector(
      "#modal-slider-container"
    );
    const currentOffers = offerData[this.currentLanguage] || offerData.fr;
    if (sliderContainer) {
      this.modalSliderInstance = new ModalSlider({
        container: sliderContainer,
        slides: currentOffers,
        lang: this.currentLanguage,
        texts: texts,
        onSelect: (offer) => {
          this.showOfferConfirmation(offer, texts);
        },
      });
    }
    const cleanupAndClose = () => {
      if (this.modalSliderInstance) {
        try {
          this.modalSliderInstance.destroy();
        } catch (e) {}
        this.modalSliderInstance = null;
      }
      this.modal.close();
    };
    const closeBtn = this.modal.container.querySelector("#modal-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", cleanupAndClose);
    const cancelBtn = this.modal.container.querySelector("#modal-cancel-btn");
    if (cancelBtn) cancelBtn.addEventListener("click", cleanupAndClose);
  }
  showOfferConfirmation(offer, modalTexts) {
    this.modal.showConfirmation({
      title: offer.planName,
      text: `${offer.description}${modalTexts.allValidFor}${offer.duration}.`,
      confirmText: modalTexts.confirmBtn,
      cancelText: modalTexts.cancelBtn,
      onConfirm: () => {
        this.modal.close();
        setTimeout(() => {
          this.userData.autoRenewal = true;
          this.userData.offer = `Offre ${offer.planName}`;
          localStorage.setItem("autoRenewal", "true");
          localStorage.setItem("selectedOffer", this.userData.offer);
          this.render();
          setTimeout(() => {
            this.setupEventListeners();
            this.modal.showAlert({
              title: modalTexts.autoSuccessTitle,
              text: modalTexts.autoSuccessDesc(offer.price, offer.planName),
              buttonText: modalTexts.okBtn,
            });
          }, 50);
        }, 350);
      },
    });
  }
}
