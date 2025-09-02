// Header.js
import { generateHeaderHTML } from "./HeaderHtml";

export default class Header {
  constructor() {
    this.currentLanguage = localStorage.getItem('language') || 'fr';
    this.mobileMenuOpen = false;
    this.theme = this.detectInitialTheme();
    this.userData = {
      phone: '0509876543',
      offer: 'Offre Dima',
      credit: '1200 DA',
      autoRenewal: true
    };
  }

  async init() {
    this.render();
    this.setupEventListeners();
    this.applyInitialTheme();
  }

  setupEventListeners() {
    this.initThemeSwitcher();
    this.initLanguageSwitcher();
    this.initMobileMenu();
    this.initAutoRenewal();
    this.initMobileThemeSwitcher();
    this.initRenewalInfoCard();
    this.initRenewalSwitcher();
  }

  render() {
    document.querySelectorAll("header").forEach(h => h.remove());
    document.body.insertAdjacentHTML("afterbegin", 
      generateHeaderHTML(this.currentLanguage, this.userData, this.theme));
  }

  // Theme Methods
  detectInitialTheme() {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
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
  }

  // Desktop Theme Switcher
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

  // Mobile Theme Switcher
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
    document.getElementById("mobile-sun-icon")?.classList.toggle("hidden", isDark);
    document.getElementById("mobile-sun-icon-dark")?.classList.toggle("hidden", !isDark);
    document.getElementById("mobile-moon-icon")?.classList.toggle("hidden", !isDark);
    document.getElementById("mobile-moon-icon-dark")?.classList.toggle("hidden", isDark);
  }

  // Language Switcher
  initLanguageSwitcher() {
    // Desktop
    const desktopDropdown = document.getElementById("language-desktop");
    if (desktopDropdown) {
      const button = desktopDropdown.querySelector("button");
      const menu = desktopDropdown.querySelector(".language-dropdown-menu");
      
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("hidden");
      });
      
      document.addEventListener("click", () => menu.classList.add("hidden"));
    }
    
    // Mobile
    document.querySelectorAll(".language-option").forEach(option => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        this.setLanguage(option.dataset.lang);
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

  // Mobile Menu - Fixed Version
  initMobileMenu() {
    const menuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    
    if (menuBtn && mobileMenu) {
      // Prevent zooming on mobile
      this.addViewportMeta();
      
      // Toggle menu on button click
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleMobileMenu();
      });
      
      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
          this.closeMobileMenu();
        }
      });
      
      // Close menu on escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.mobileMenuOpen) {
          this.closeMobileMenu();
        }
      });
      
      this.updateMobileMenuIcons();
    }
  }

  addViewportMeta() {
    const existingMeta = document.querySelector('meta[name="viewport"]');
    if (!existingMeta) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
      document.head.appendChild(meta);
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    const mobileMenu = document.getElementById("mobile-menu");
    
    if (mobileMenu) {
      mobileMenu.classList.toggle("hidden", !this.mobileMenuOpen);
      document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
    }
    
    this.updateMobileMenuIcons();
  }

  closeMobileMenu() {
    if (!this.mobileMenuOpen) return;
    this.mobileMenuOpen = false;
    const mobileMenu = document.getElementById("mobile-menu");
    
    if (mobileMenu) {
      mobileMenu.classList.add("hidden");
      document.body.style.overflow = '';
    }
    
    this.updateMobileMenuIcons();
  }

  updateMobileMenuIcons() {
    const isDark = this.theme === "dark";
    const menuIcon = document.getElementById("mobile-menu-icon");
    const menuIconDark = document.getElementById("mobile-menu-icon-dark");
    const closeIcon = document.getElementById("mobile-menu-close-icon");
    const closeIconDark = document.getElementById("mobile-menu-close-icon-dark");
    
    if (this.mobileMenuOpen) {
      menuIcon?.classList.add("hidden");
      menuIconDark?.classList.add("hidden");
      closeIcon?.classList.toggle("hidden", isDark);
      closeIconDark?.classList.toggle("hidden", !isDark);
    } else {
      menuIcon?.classList.toggle("hidden", isDark);
      menuIconDark?.classList.toggle("hidden", !isDark);
      closeIcon?.classList.add("hidden");
      closeIconDark?.classList.add("hidden");
    }
  }

  // Renewal Methods
  initAutoRenewal() {
    document.querySelectorAll(".auto-renewal-switch").forEach(toggle => {
      toggle.addEventListener("change", (e) => {
        this.userData.autoRenewal = e.target.checked;
        this.render();
        setTimeout(() => this.initRenewalSwitcher(), 0);
      });
    });
  }

  initRenewalInfoCard() {
    const infoBtn = document.getElementById("auto-renewal-info");
    const infoCard = document.getElementById("auto-renewal-card");
    
    if (infoBtn && infoCard) {
      infoBtn.addEventListener("mouseenter", () => infoCard.classList.remove("hidden"));
      infoBtn.addEventListener("mouseleave", () => infoCard.classList.add("hidden"));
    }
  }

  initRenewalSwitcher() {
    const autoBtn = document.getElementById("renewal-auto");
    const manualBtn = document.getElementById("renewal-manual");
    
    if (autoBtn && manualBtn) {
      autoBtn.addEventListener("click", () => this.setRenewalMode(true));
      manualBtn.addEventListener("click", () => this.setRenewalMode(false));
    }
  }

  setRenewalMode(isAuto) {
    if (this.userData.autoRenewal === isAuto) return;
    this.userData.autoRenewal = isAuto;
    this.render();
    setTimeout(() => this.initRenewalSwitcher(), 0);
  }
}