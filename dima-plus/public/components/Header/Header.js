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
        <img src="./assets/images/Close.svg" alt="close"/>
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
      <div class="relative bg-white dark:bg-[#2C2C2C] rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl min-w-[320px] px-6 md:px-8 pt-16 pb-8 md:pb-12">
        ${this.getCloseButtonHTML()}
        <h2 class="text-2xl md:text-[34px] font-bold text-ooredoo-red dark:text-white mb-4 text-center">${title}</h2>
        <p class="text-[16px] lg:text-[21px] text-center text-gray-600 dark:text-gray-300 mb-6">${text}</p>
        <div class="flex justify-center gap-4">
          <button id="modal-cancel-btn" type="button" class="font-semibold text-base uppercase forfait-modal-button w-[180px] h-12 rounded-full cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-white text-ooredoo-red border-2 border-ooredoo-red shadow-md dark:bg-[#2C2C2C] dark:text-white dark:border-white">${cancelText}</button>
          <button id="modal-confirm-btn" type="button" class="font-semibold text-base uppercase forfait-modal-button w-[180px] h-12 rounded-full border-none cursor-pointer inline-flex items-center justify-center transition-all duration-300 bg-ooredoo-red text-white shadow-lg">${confirmText}</button>
        </div>
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
      <div class="relative bg-white dark:bg-[#2C2C2C]  rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl min-w-[320px] px-6 md:px-8 pt-16 pb-8 md:pb-12">
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
  showCustom(contentHTML) {
    this.open(contentHTML);
  }
}

export default class Header {
  constructor() {
    this.currentLanguage = localStorage.getItem("language") || "fr";
    this.mobileMenuOpen = false;
    this.theme = this.detectInitialTheme();

    const storedRenewal = localStorage.getItem("autoRenewal");
    const storedOffer = localStorage.getItem("selectedOffer");
    this.userData = {
      phone: "0509876543",
      offer: "Offre Dima +",
      credit: "2000",
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
    this.applyInitialTheme();
    this.render();
    requestAnimationFrame(() => {
      this.setupEventListeners();
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
      this.closeMobileMenu();
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
}
