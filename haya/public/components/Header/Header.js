import { generateHeaderHTML } from "./HeaderHtml";
import { offerData } from "./OfferData.js";

class Modal {
  constructor() {
    this.overlay = document.getElementById("global-modal-overlay");
    this.container = document.getElementById("global-modal-container");
    this.setupListeners();
  }
  setupListeners() {
    if (this.overlay) {
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) this.close();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        this.overlay &&
        !this.overlay.classList.contains("hidden")
      )
        this.close();
    });
  }
  getCloseButtonHTML() {
    return `
      <button id="modal-close-btn" type="button" aria-label="Close modal"
        class="absolute top-[15px] right-[15px] w-[20px] h-[20px] md:w-[34px] md:h-[34px] flex items-center justify-center rounded-full bg-ooredoo-red text-white z-20">
        <img src="/assets/images/Close.svg" alt="close"/>
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
    if (closeBtn) closeBtn.addEventListener("click", () => this.close());
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
  showCustom(contentHTML) {
    this.open(contentHTML);
  }
  getCloseButtonHTML() {
    return `
      <button id="modal-close-btn" type="button" aria-label="Close modal"
        class="absolute top-[15px] right-[15px] w-[20px] h-[20px] md:w-[34px] md:h-[34px] flex items-center justify-center rounded-full bg-ooredoo-red text-white z-20">
        <img src="/assets/images/Close.svg" alt="close"/>
      </button>
    `;
  }
  showAlert({ title = "", text = "", buttonText = "OK" }) {
    const contentHTML = `
  <div class="relative bg-white dark:bg-[#2C2C2C] rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl min-w-[320px] px-6 md:px-8 pt-16 pb-8 md:pb-12">
        ${this.getCloseButtonHTML()}
        <h2 class="text-2xl md:text-[34px] font-bold text-ooredoo-red dark:text-white mb-4 text-center">${title}</h2>
        <p class="text-[16px] lg:text-[21px] text-center text-gray-600 dark:text-gray-300 mb-6">${text}</p>
        <div class="flex justify-center">
          <button id="modal-ok-btn" type="button" class="rounded-full bg-ooredoo-red text-white font-semibold hover:bg-red-700 w-[180px] transition-colors px-6 py-2 text-[15.4px]">${buttonText}</button>
        </div>
      </div>
    `;
    this.open(contentHTML);
    const okBtn = this.container.querySelector("#modal-ok-btn");
    if (okBtn) okBtn.addEventListener("click", () => this.close());
  }
}

export default class Header {
  constructor() {
    this.currentLanguage = localStorage.getItem("language") || "fr";
    this.mobileMenuOpen = false;
    this.theme = this.detectInitialTheme();
    const storedMode = localStorage.getItem("mode");
    this.userData = {
      phone: "0509876543",
      offer: "Offre Haya !",
      credit: "2000",
      mode: storedMode || null,
    };
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
    this.applyInitialTheme();
    this.render();
    requestAnimationFrame(() => {
      this.setupEventListeners();
      this.preventHorizontalScroll();
    });
  }
  setupEventListeners() {
    this.modal = new Modal();
    this.initThemeSwitcher();
    this.initLanguageSwitcher();
    this.initMobileMenu();
    this.initModeInfoCard();
    this.initModeSwitcher();
    this.initResponsiveHandling();
  }
  preventHorizontalScroll() {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
  }
  initResponsiveHandling() {
    const handleResize = () => {
      if (window.innerWidth >= 820 && this.mobileMenuOpen)
        this.closeMobileMenu();
      this.preventHorizontalScroll();
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () =>
      setTimeout(handleResize, 100)
    );
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
    this.updateMobileMenuIcons();
    this.updateModeUI();
  }
  initThemeSwitcher() {
    const moonBtn = document.getElementById("moon-btn");
    const sunBtn = document.getElementById("sun-btn");
    if (moonBtn && sunBtn) {
      moonBtn.addEventListener("click", () => this.setTheme("dark"));
      sunBtn.addEventListener("click", () => this.setTheme("light"));
    }
    const mobileThemeBtn = document.getElementById("theme-mobile-switcher");
    if (mobileThemeBtn)
      mobileThemeBtn.addEventListener("click", () =>
        this.setTheme(this.theme === "dark" ? "light" : "dark")
      );
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
    if (!menuBtn || !mobileMenu) return;
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
      )
        this.closeMobileMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.mobileMenuOpen) this.closeMobileMenu();
    });
    this.updateMobileMenuIcons();
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
    if (!mobileMenu || !menuBtn) return;
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
      setTimeout(() => mobileMenu.classList.add("hidden"), 300);
      document.body.style.overflow = "";
      mobileMenu.setAttribute("aria-hidden", "true");
      menuBtn.setAttribute("aria-expanded", "false");
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
      setTimeout(() => mobileMenu.classList.add("hidden"), 300);
      mobileMenu.setAttribute("aria-hidden", "true");
    }
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
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
      if (el) el.classList.toggle("hidden", !visible);
    });
  }

  initModeInfoCard() {
    const infoBtn = document.getElementById("mode-info");
    const infoCard = document.getElementById("mode-card");
    const infoBtnMobile = document.getElementById("mode-info-mobile");
    const infoCardMobile = document.getElementById("mode-card-mobile");

    if (!this._modeInfoTimers) this._modeInfoTimers = new Map();

    const showCard = (card) => {
      if (!card) return;
      card.classList.remove("hidden");
      card.style.pointerEvents = "auto";
    };
    const hideCard = (card) => {
      if (!card) return;
      card.classList.add("hidden");
    };

    const attachDesktop = (btn, card) => {
      if (!btn || !card) return;
      const key = "desktop";
      const clearTimer = () => {
        const t = this._modeInfoTimers.get(key);
        if (t) {
          clearTimeout(t);
          this._modeInfoTimers.delete(key);
        }
      };
      const scheduleHide = () => {
        clearTimer();
        const t = setTimeout(() => {
          if (!btn.matches(":hover") && !card.matches(":hover")) hideCard(card);
          this._modeInfoTimers.delete(key);
        }, 180);
        this._modeInfoTimers.set(key, t);
      };
      btn.addEventListener("mouseenter", () => {
        clearTimer();
        showCard(card);
      });
      card.addEventListener("mouseenter", () => {
        clearTimer();
        showCard(card);
      });
      btn.addEventListener("mouseleave", scheduleHide);
      card.addEventListener("mouseleave", scheduleHide);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (card.classList.contains("hidden")) showCard(card);
        else hideCard(card);
      });
      document.addEventListener("click", (e) => {
        if (!card.contains(e.target) && !btn.contains(e.target)) hideCard(card);
      });
    };

    const attachMobile = (btn, card) => {
      if (!btn || !card) return;
      let mobileAnchor = btn.closest("div");
      if (!mobileAnchor) mobileAnchor = document.body;
      if (getComputedStyle(mobileAnchor).position === "static")
        mobileAnchor.style.position = "relative";
      if (card.parentNode !== mobileAnchor) mobileAnchor.appendChild(card);
      Object.assign(card.style, {
        position: "absolute",
        left: "0",
        right: "0",
        width: "100%",
        top: "calc(100% + 8px)",
        transform: "none",
        margin: "0",
        boxSizing: "border-box",
        padding: card.style.padding || "12px",
        zIndex: "60",
        pointerEvents: "auto",
      });
      const key = btn.id || "mobile";
      const clearTimer = () => {
        const t = this._modeInfoTimers.get(key);
        if (t) {
          clearTimeout(t);
          this._modeInfoTimers.delete(key);
        }
      };
      const scheduleHide = () => {
        clearTimer();
        const t = setTimeout(() => {
          if (!btn.matches(":hover") && !card.matches(":hover")) hideCard(card);
          this._modeInfoTimers.delete(key);
        }, 180);
        this._modeInfoTimers.set(key, t);
      };
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (card.classList.contains("hidden")) showCard(card);
        else hideCard(card);
      });
      btn.addEventListener(
        "touchstart",
        (e) => {
          e.stopPropagation();
          if (card.classList.contains("hidden")) showCard(card);
          else hideCard(card);
        },
        { passive: true }
      );
      btn.addEventListener("mouseenter", () => {
        clearTimer();
        showCard(card);
      });
      card.addEventListener("mouseenter", () => {
        clearTimer();
        showCard(card);
      });
      btn.addEventListener("mouseleave", scheduleHide);
      card.addEventListener("mouseleave", scheduleHide);
      document.addEventListener("click", (e) => {
        if (!btn.contains(e.target) && !card.contains(e.target)) hideCard(card);
      });
      window.addEventListener("resize", () => {
        if (window.innerWidth > 767) hideCard(card);
        else {
          if (getComputedStyle(mobileAnchor).position === "static")
            mobileAnchor.style.position = "relative";
        }
      });
    };

    attachDesktop(infoBtn, infoCard);
    attachMobile(infoBtnMobile, infoCardMobile);
  }

  initModeSwitcher() {
    const modeBtn = document.getElementById("mode-btn");
    const modeBtnMobile = document.getElementById("mode-btn-mobile");
    const optHadra = document.getElementById("opt-hadra");
    const optInternet = document.getElementById("opt-internet");
    const optHadraMobile = document.getElementById("opt-hadra-mobile");
    const optInternetMobile = document.getElementById("opt-internet-mobile");
    const modeOptions = document.getElementById("mode-options");
    const modeOptionsMobile = document.getElementById("mode-options-mobile");
    if (modeBtn && modeOptions) {
      modeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const willShow = modeOptions.classList.toggle("hidden") === false;
        modeOptions.setAttribute("aria-hidden", String(!willShow));
        if (modeOptionsMobile) {
          modeOptionsMobile.classList.add("hidden");
          if (modeOptionsMobile.setAttribute)
            modeOptionsMobile.setAttribute("aria-hidden", "true");
        }
      });
    }

    if (modeBtnMobile && modeOptionsMobile) {
      modeBtnMobile.addEventListener("click", (e) => {
        e.stopPropagation();
        modeOptionsMobile.classList.toggle("hidden");
        if (modeOptions) modeOptions.classList.add("hidden");
      });
    }
    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!t) return;
      if (
        modeOptions &&
        !modeOptions.contains(t) &&
        !document.getElementById("mode-btn")?.contains(t)
      )
        modeOptions.classList.add("hidden");
      modeOptions.setAttribute("aria-hidden", "true");
      if (
        modeOptionsMobile &&
        !modeOptionsMobile.contains(t) &&
        !document.getElementById("mode-btn-mobile")?.contains(t)
      )
        modeOptionsMobile.classList.add("hidden");
    });
    if (optHadra)
      optHadra.addEventListener("click", (e) => {
        e.stopPropagation();
        modeOptions.classList.add("hidden");
        this.openModeChangeModal("hadra");
      });
    if (optInternet)
      optInternet.addEventListener("click", (e) => {
        e.stopPropagation();
        modeOptions.classList.add("hidden");
        this.openModeChangeModal("internet");
      });
    if (optHadraMobile)
      optHadraMobile.addEventListener("click", (e) => {
        e.stopPropagation();
        modeOptionsMobile.classList.add("hidden");
        this.openModeChangeModal("hadra");
      });
    if (optInternetMobile)
      optInternetMobile.addEventListener("click", (e) => {
        e.stopPropagation();
        modeOptionsMobile.classList.add("hidden");
        this.openModeChangeModal("internet");
      });
    this.updateModeUI();
  }
  updateModeUI() {
    const modeBtnLabel = document.getElementById("mode-label");
    const modeBtnLabelMobile = document.getElementById("mode-label-mobile");
    const texts = offerData.text[this.currentLanguage] || offerData.text.fr;
    let label = texts.currentMode;
    if (modeBtnLabel) modeBtnLabel.textContent = label;
    if (modeBtnLabelMobile) modeBtnLabelMobile.textContent = label;
  }

  openModeChangeModal(option) {
    const texts = offerData.text[this.currentLanguage] || offerData.text.fr;
    const closeBtnHTML =
      this.modal && typeof this.modal.getCloseButtonHTML === "function"
        ? this.modal.getCloseButtonHTML()
        : "";
    const fontClass = this.getFontClass();
    const isHadra = option === "hadra";
    const desc = isHadra
      ? texts.modeChangeDescriptionHadra || texts.modeInfoTooltip
      : texts.modeChangeDescriptionInternet || texts.modeInfoTooltip;
    const html = `
          <div class="relative bg-white dark:bg-[#2C2C2C] rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl min-w-[320px] px-6 md:px-8 pt-16 pb-8 md:pb-12">
        ${closeBtnHTML}
          <h2 class="${fontClass} text-2xl md:text-[34px] font-bold text-ooredoo-red dark:text-white mb-4 text-center">${texts.modeChangeTitle}</h2>
          <p class="${fontClass} text-[16px] lg:text-[21px] text-center text-gray-600 dark:text-gray-300 mb-6">${desc}</p>
          <div class="flex justify-center gap-4">
            <button id="modal-change-cancel" class="${fontClass} font-semibold text-base uppercase forfait-modal-button w-[180px] h-12 rounded-full cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-white text-ooredoo-red border-2 border-ooredoo-red shadow-md dark:bg-[#2C2C2C] dark:text-white dark:border-white">${texts.cancelBtn}</button>
            <button id="modal-change-confirm" class="${fontClass} font-semibold text-base uppercase forfait-modal-button w-[180px] h-12 rounded-full border-none cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-ooredoo-red text-white shadow-lg">${texts.confirmBtn}</button>
        </div>
      </div>
    `;
    this.modal.showCustom(html);
    const cancelBtn = this.modal.container.querySelector(
      "#modal-change-cancel"
    );
    const confirmBtn = this.modal.container.querySelector(
      "#modal-change-confirm"
    );
    if (cancelBtn)
      cancelBtn.addEventListener("click", () => this.modal.close());
    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        this.modal.close();
        setTimeout(() => {
          this.userData.mode = option;
          localStorage.setItem("mode", option);
          this.render();
          setTimeout(() => {
            this.setupEventListeners();
            const successTitle = texts.modeChangeSuccessTitle;
            const successText = isHadra
              ? texts.modeChangeSuccessDescriptionHadra ||
                texts.modeChangeSuccessDescriptionInternet
              : texts.modeChangeSuccessDescriptionInternet ||
                texts.modeChangeSuccessDescriptionHadra;
            this.modal.showAlert({
              title: successTitle,
              text: successText,
              buttonText: texts.okBtn,
            });
          }, 80);
        }, 220);
      });
    }
  }
}
