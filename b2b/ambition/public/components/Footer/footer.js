export default class Footer {
  constructor() {
    this.currentLanguage = this.getStoredLanguage();
    this.footerElement = document.getElementById("footer-root");
    this.render();
  }

  getStoredLanguage() {
    try {
      return typeof localStorage !== "undefined"
        ? localStorage.getItem("language") || "fr"
        : "fr";
    } catch (e) {
      return "fr";
    }
  }

  render() {
    if (!this.footerElement) return;

    if (this.currentLanguage === "ar") {
      this.footerElement.innerHTML = `
        <p>
  @ <span class="font-noto-kufi-arabic">حقوق النشر</span> 2025 Ooredoo
</p>
      `;
    } else {
      this.footerElement.innerHTML = `
        <p>
          &copy; Copyright 2025 Ooredoo
        </p>
      `;
    }
  }
}
