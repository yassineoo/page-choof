export default class Footer {
  constructor() {
    this.currentLanguage = this.getStoredLanguage();
    this.footerElement = document.getElementById("footer-root");
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  getStoredLanguage() {
    try {
      return typeof localStorage !== "undefined" ? localStorage.getItem("language") || "fr" : "fr";
    } catch (e) {
      return "fr";
    }
  }

  bindEvents() {
    // Clean up any existing event listeners first
    this.unbindEvents();

    // Bind language change event listener
    this.boundHandleLanguageChange = this.handleLanguageChange.bind(this);
    window.addEventListener("languageChanged", this.boundHandleLanguageChange);

    // Set up polling to check for language changes
    this.langPoller = setInterval(this.checkLanguageChange.bind(this), 200);

    // Listen for storage changes (in case language is changed in another tab)
    this.boundStorageListener = (e) => {
      if (e.key === "language") {
        this.handleLanguageChange();
      }
    };
    window.addEventListener("storage", this.boundStorageListener);
  }

  unbindEvents() {
    if (this.boundHandleLanguageChange) {
      window.removeEventListener("languageChanged", this.boundHandleLanguageChange);
    }
    if (this.boundStorageListener) {
      window.removeEventListener("storage", this.boundStorageListener);
    }
    if (this.langPoller) {
      clearInterval(this.langPoller);
      this.langPoller = null;
    }
  }

  handleLanguageChange() {
    const newLanguage = this.getStoredLanguage();
    if (newLanguage !== this.currentLanguage) {
      console.log(`Footer: Language changed from ${this.currentLanguage} to ${newLanguage}`);
      this.currentLanguage = newLanguage;
      this.render();
    }
  }

  checkLanguageChange() {
    this.handleLanguageChange();
  }

  render() {
    if (!this.footerElement) return;

    if (this.currentLanguage === "ar") {
      this.footerElement.innerHTML = `
        <p>@ <span class="font-noto-kufi-arabic">حقوق النشر</span> 2025 Ooredoo </p>
      `;
    } else {
      this.footerElement.innerHTML = `
        <p>
          &copy; Copyright 2025 Ooredoo
        </p>
      `;
    }
  }

  // Method to clean up when the component is destroyed
  destroy() {
    this.unbindEvents();
  }
}
