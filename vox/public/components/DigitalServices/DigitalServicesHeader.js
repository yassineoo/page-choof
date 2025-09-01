import { digitalServices } from './DigitalServicesHeaderData.js';

export default class DigitalServicesHeader {
  constructor(container) {
    this.container = container;
    this.currentLang = this.getLang();
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  getLang() {
    const stored = localStorage.getItem('language');
    return ['fr', 'ar'].includes(stored) ? stored : 'fr';
  }

  bindEvents() {
    this.unbindEvents();
    
    this.boundHandleLanguageChange = this.handleLanguageChange.bind(this);
    window.addEventListener('languageChanged', this.boundHandleLanguageChange);
    
    this.langPoller = setInterval(this.checkLanguageChange.bind(this), 200);
    
    this.boundStorageListener = (e) => {
      if (e.key === 'language') {
        this.handleLanguageChange();
      }
    };
    window.addEventListener('storage', this.boundStorageListener);
  }

  unbindEvents() {
    if (this.boundHandleLanguageChange) {
      window.removeEventListener('languageChanged', this.boundHandleLanguageChange);
    }
    if (this.boundStorageListener) {
      window.removeEventListener('storage', this.boundStorageListener);
    }
    if (this.langPoller) {
      clearInterval(this.langPoller);
      this.langPoller = null;
    }
  }

  handleLanguageChange() {
    const newLang = this.getLang();
    if (newLang !== this.currentLang) {
      console.log(`DigitalServicesHeader: Language changed from ${this.currentLang} to ${newLang}`);
      this.currentLang = newLang;
      this.render();
    }
  }

  checkLanguageChange() {
    this.handleLanguageChange();
  }

  render() {
    const lang = this.getLang();
    const isArabic = lang === 'ar';
    const dir = isArabic ? 'rtl' : 'ltr';
    const alignClass = isArabic ? 'text-right md:text-right' : 'text-left md:text-left';
    const fontClass = isArabic ? 'font-noto-kufi-arabic' : 'font-outfit';
    const legalFontClass = isArabic ? 'font-noto-kufi-arabic' : 'font-rubik';

    const headline = isArabic
      ? 'قوموا بحماية أجهزتكم مع <span class="uppercase">BITDEFENDER!</span>'
      : 'Protégez-vous avec <span class="uppercase">Bitdefender !</span>';
    const legal = isArabic
      ? 'يتم تطبيق الشروط و الأحكام'
      : 'Conditions générales applicables.';

    this.container.innerHTML = `
      <div class="bg-ooredoo-red w-full min-h-[clamp(200px,20vw,300px)] flex items-center justify-center" dir="${dir}">
        <div class="w-full max-w-[1700px] flex flex-col md:flex-row items-center px-[clamp(1rem,5vw,5rem)] py-[clamp(2rem,5vw,4rem)]">
          <div class="flex-1 flex flex-col items-start justify-center w-full">
            <h2 class="relative z-10 text-white ${fontClass} font-extrabold uppercase
              text-[2rem] md:text-[2.7rem] leading-[141%] tracking-[0.02em]
              mb-6 mt-2 ${alignClass}">
              ${headline}
            </h2>
            <div class="flex flex-wrap gap-3 md:gap-2 mb-4 ${isArabic ? 'justify-center md:justify-end' : 'justify-center md:justify-start'}">
              ${digitalServices.map(service => `
                <div class="aspect-square min-w-[54px] min-h-[54px] rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-105 bg-transparent ">
                  <img src="${service.icon}" alt="${service.name}" class="w-[36px] h-[36px] object-contain" />
                </div>
              `).join('')}
            </div>
            <p class="text-white ${legalFontClass} text-[1.02rem] md:text-[1.13rem] leading-[170%] tracking-wide mt-1 mb-2 ${alignClass}">
              ${legal}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  destroy() {
    this.unbindEvents();
  }
}