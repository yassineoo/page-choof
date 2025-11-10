import { generateHeaderHTML } from "./HeaderHtml.js";

export default class Header {
  constructor() {
    this.currentLanguage = this.getStoredLanguage();
    this.mobileMenuOpen = false;
    this.theme = this.detectInitialTheme();
    this.userData = {
      phone: "0509876543",
      offer: "Offre VOX",
      credit: "4000 DA",
      compayName: "Nom De L'entreprise",
      autoRenewal: true,
      charge: "CHARGER",
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
  }

  render() {
    document.querySelectorAll("header").forEach((h) => h.remove());
    document.body.insertAdjacentHTML("afterbegin", generateHeaderHTML(this.currentLanguage, this.userData, this.theme));
  }

  // iOS-STYLE SLIDING THEME SWITCHER
  initSlidingThemeSwitcher() {
    const themeSwitcher = document.getElementById("theme-switcher");

    if (themeSwitcher) {
      // Add visual effects
      const addVisualEffects = () => {
        // Ripple effect
        themeSwitcher.classList.add("ripple");
        setTimeout(() => {
          themeSwitcher.classList.remove("ripple");
        }, 600);
      };

      // Handle click anywhere on the switcher
      themeSwitcher.addEventListener("click", (e) => {
        e.preventDefault();
        addVisualEffects();
        this.setTheme(this.theme === "dark" ? "light" : "dark");
      });

      // Smooth hover effects
      themeSwitcher.addEventListener("mouseenter", () => {
        themeSwitcher.style.transform = "translateY(-1px) scale(1.02)";
      });

      themeSwitcher.addEventListener("mouseleave", () => {
        themeSwitcher.style.transform = "translateY(0) scale(1)";
      });

      // Update initial state
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

    // Add smooth document transition
    document.documentElement.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
    document.documentElement.classList.toggle("dark", theme === "dark");

    this.setStoredTheme(theme);
    this.updateSlidingThemeSwitcher();
    this.updateMobileThemeIcons();
    this.updateMobileMenuIcons();

    // Match the sliding animation timing
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
