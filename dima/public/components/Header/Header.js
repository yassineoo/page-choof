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
  }

  open(contentHTML) {
    if (!this.overlay || !this.container) return;
    this.container.innerHTML = contentHTML;

    this.overlay.classList.remove("hidden", "modal-animating-out");
    this.container.classList.remove("modal-animating-out");

    this.overlay.classList.add("modal-animating-in");
    this.container.classList.add("modal-animating-in");
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
      this.overlay.classList.add("hidden");
      this.container.innerHTML = "";
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
      <div class="bg-white rounded-lg shadow-xl p-6 md:p-8 text-center relative">
        <button id="modal-close-btn" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-ooredoo-red text-white flex items-center justify-center text-2xl font-bold">&times;</button>
        <h2 class="text-2xl font-bold text-ooredoo-red mb-4">${title}</h2>
        <p class="text-gray-600 mb-6">${text}</p>
        <div class="flex justify-center gap-4">
          <button id="modal-cancel-btn" class="rounded-full border-2 border-ooredoo-red text-ooredoo-red font-semibold hover:bg-ooredoo-red hover:text-white transition-colors" style="padding: 8.21px 29.78px; font-size: 15.4px;">${cancelText}</button>
          <button id="modal-confirm-btn" class="rounded-full bg-ooredoo-red text-white font-semibold hover:bg-red-700 transition-colors" style="padding: 8.21px 29.78px; font-size: 15.4px;">${confirmText}</button>
        </div>
      </div>
    `;
    this.open(contentHTML);
    document.getElementById("modal-confirm-btn").onclick = () => {
      if (onConfirm) onConfirm();
      this.close();
    };
    document.getElementById("modal-cancel-btn").onclick = () => this.close();
    document.getElementById("modal-close-btn").onclick = () => this.close();
  }

  showAlert({ title, text, buttonText = "OK" }) {
    const contentHTML = `
      <div class="bg-white rounded-lg shadow-xl p-6 md:p-8 text-center relative">
        <button id="modal-close-btn" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-ooredoo-red text-white flex items-center justify-center text-2xl font-bold">&times;</button>
        <h2 class="text-2xl font-bold text-ooredoo-red mb-4">${title}</h2>
        <p class="text-gray-600 mb-6">${text}</p>
        <div class="flex justify-center">
          <button id="modal-ok-btn" class="rounded-full bg-ooredoo-red text-white font-semibold hover:bg-red-700 transition-colors" style="padding: 8.21px 29.78px; font-size: 15.4px;">${buttonText}</button>
        </div>
      </div>
    `;
    this.open(contentHTML);
    document.getElementById("modal-ok-btn").onclick = () => this.close();
    document.getElementById("modal-close-btn").onclick = () => this.close();
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
      offer: storedOffer || "Offre Dima 2500",
      credit: "4000 DA",
      autoRenewal: storedRenewal !== null ? JSON.parse(storedRenewal) : true,
    };
  }

  async init() {
    this.render();
    this.setupEventListeners();
    this.applyInitialTheme();
  }

  setupEventListeners() {
    this.modal = new Modal();
    this.initThemeSwitcher();
    this.initLanguageSwitcher();
    this.initMobileMenu();
    this.initMobileThemeSwitcher();
    this.initRenewalInfoCard();
    this.initRenewalSwitcher();
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
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleMobileMenu();
      });
      document.addEventListener("click", (e) => {
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
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
    if (mobileMenu) {
      mobileMenu.classList.toggle("hidden", !this.mobileMenuOpen);
      document.body.style.overflow = this.mobileMenuOpen ? "hidden" : "";
    }
    this.updateMobileMenuIcons();
  }

  closeMobileMenu() {
    if (!this.mobileMenuOpen) return;
    this.mobileMenuOpen = false;
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
      mobileMenu.classList.add("hidden");
      document.body.style.overflow = "";
    }
    this.updateMobileMenuIcons();
  }

  updateMobileMenuIcons() {
    const isDark = this.theme === "dark";
    const menuIcon = document.getElementById("mobile-menu-icon");
    const menuIconDark = document.getElementById("mobile-menu-icon-dark");
    const closeIcon = document.getElementById("mobile-menu-close-icon");
    const closeIconDark = document.getElementById(
      "mobile-menu-close-icon-dark"
    );
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

  initRenewalInfoCard() {
    const infoBtn = document.getElementById("auto-renewal-info");
    const infoCard = document.getElementById("auto-renewal-card");
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
      document.addEventListener("click", (e) => {
        if (!infoBtn.contains(e.target)) infoCard.classList.add("hidden");
      });
    }
  }

  initRenewalSwitcher() {
    const autoBtn = document.getElementById("renewal-auto");
    const manualBtn = document.getElementById("renewal-manual");
    if (autoBtn && manualBtn) {
      autoBtn.addEventListener("click", () => this.handleAutoRenewalClick());
      manualBtn.addEventListener("click", () =>
        this.handleManualRenewalClick()
      );
    }
  }

  updateRenewalUI() {
    const isAuto = this.userData.autoRenewal;
    const autoBtn = document.getElementById("renewal-auto");
    const manualBtn = document.getElementById("renewal-manual");
    const autoIcon = autoBtn?.querySelector("img");
    const manualIcon = manualBtn?.querySelector("img");
    if (autoBtn && manualBtn) {
      autoBtn.style.background = isAuto ? "#E30613" : "#fff";
      autoBtn.style.color = isAuto ? "#fff" : "#2A2A2A";
      manualBtn.style.background = !isAuto ? "#E30613" : "#fff";
      manualBtn.style.color = !isAuto ? "#fff" : "#2A2A2A";
    }
    if (autoIcon && manualIcon) {
      autoIcon.classList.toggle("hidden", !isAuto);
      manualIcon.classList.toggle("hidden", isAuto);
    }
  }

  handleManualRenewalClick() {
    if (!this.userData.autoRenewal) return;
    const onConfirm = () => {
      this.modal.close();
      setTimeout(() => {
        this.userData.autoRenewal = false;
        localStorage.setItem("autoRenewal", "false");
        this.updateRenewalUI();
        this.modal.showAlert({
          title: "FÉLICITATIONS !",
          text: 'Vous êtes sur le mode "Manuel".',
        });
      }, 350);
    };

    const cancelText = this.currentLanguage === "ar" ? "إلغاء" : "ANNULER";
    const confirmText = this.currentLanguage === "ar" ? "تأكيد" : "CONFIRMER";

    const customContent = `
      <div class="relative w-full max-w-[703px] h-auto md:h-[321px] bg-white rounded-[18px] flex flex-col justify-center items-center overflow-hidden p-4">
        <button id="modal-close-btn" class="absolute top-[15px] right-[15px] w-[34px] h-[34px] bg-ooredoo-red rounded-full flex items-center justify-center hover:bg-red-700 transition-colors z-10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="w-full text-center pt-8 md:pt-0">
          <h1 class="text-ooredoo-red font-rubik text-[28px] lg:text-[34px] font-semibold uppercase mb-4 px-8">
            MODE DE RECHARGEMENT
          </h1>
          <p class="text-black font-rubik text-[16px] lg:text-[21px] font-normal leading-normal max-w-xl mx-auto mb-8 px-4">
            Vous allez activer votre mode de rechargement en "Manuel", vous receverez du crédit non activé à chaque rechargement.
          </p>
        </div>
        <div class="flex justify-center items-center gap-[13px] flex-col sm:flex-row w-full max-w-md px-4 pb-4 md:pb-0">
          <button id="modal-cancel-btn" class="flex w-full sm:w-auto justify-center items-center rounded-[22px] border-2 border-ooredoo-red text-ooredoo-red font-rubik font-semibold uppercase hover:bg-ooredoo-red/5 transition-colors" style="padding: 8.21px 29.78px; font-size: 15.4px;">
            ${cancelText}
          </button>
          <button id="modal-confirm-btn" class="flex w-full sm:w-auto justify-center items-center rounded-[25px] bg-ooredoo-red text-white font-rubik font-semibold uppercase hover:bg-red-700 transition-colors" style="padding: 8.21px 29.78px; font-size: 15.4px;">
            ${confirmText}
          </button>
        </div>
      </div>
    `;

    this.modal.showCustom(customContent);
    document.getElementById("modal-confirm-btn").onclick = onConfirm;
    document.getElementById("modal-cancel-btn").onclick = () =>
      this.modal.close();
    document.getElementById("modal-close-btn").onclick = () =>
      this.modal.close();
  }

  handleAutoRenewalClick() {
    if (this.userData.autoRenewal) return;

    const cancelButtonText =
      this.currentLanguage === "ar" ? "إلغاء" : "ANNULER";

    const customContent = `
      <div class="relative w-full max-w-5xl bg-white rounded-lg flex flex-col overflow-hidden">
        <button id="modal-close-btn" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-ooredoo-red text-white flex items-center justify-center text-2xl font-bold z-20">&times;</button>
        
        <div class="p-6 md:p-8 text-center">
          <h2 class="text-2xl font-bold text-ooredoo-red mb-2">MODE DE RECHARGEMENT</h2>
      <p class="text-gray-600 mb-4 px-0 md:px-[30px]">
  Vous allez modifier votre mode de rechargement en "Automatique" :
</p>

          <div class="mt-6">
                  <button id="modal-cancel-btn" class="rounded-full border-2 border-ooredoo-red text-ooredoo-red font-semibold hover:bg-ooredoo-red hover:text-white transition-colors" style="padding: 8.21px 29.78px; font-size: 15.4px;">${cancelButtonText}</button>
          </div>
        </div>

        <div class="border-b border-gray-200"></div>

        <div class="bg-[#F8F8F8] p-6 md:p-8">
            <div id="modal-slider-container"></div>
        </div>
      </div>`;

    this.modal.showCustom(customContent);

    const sliderContainer = document.getElementById("modal-slider-container");
    const currentOffers = offerData[this.currentLanguage] || offerData.fr;

    if (sliderContainer) {
      this.modalSliderInstance = new ModalSlider({
        container: sliderContainer,
        slides: currentOffers,
        lang: this.currentLanguage,
        onSelect: (offer) => {
          this.showOfferConfirmation(offer);
        },
      });
    }

    const cleanupAndClose = () => {
      if (this.modalSliderInstance) this.modalSliderInstance.destroy();
      this.modal.close();
    };

    document.getElementById("modal-close-btn").onclick = cleanupAndClose;
    document.getElementById("modal-cancel-btn").onclick = cleanupAndClose;
  }

  showOfferConfirmation(offer) {
    this.modal.showConfirmation({
      title: offer.planName,
      text: offer.description,
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
              title: "FÉLICITATIONS !",
              text: `Vos prochains rechargements de ${offer.price} DA et plus vous donneront les avantages de ${offer.planName}, après expiration de votre forfait.`,
            });
          }, 50);
        }, 350);
      },
    });
  }
}
