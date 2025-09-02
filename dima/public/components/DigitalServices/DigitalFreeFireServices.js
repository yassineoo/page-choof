import { freeFireData } from './DigitalFreeFireServicesData';

export default class DigitalFreeFireServices {
  constructor(container) {
    this.container = container;
    this.currentLang = this.getLang();
    this.currentTheme = this.getTheme();
    
    // Watch for changes
    this.watcher = setInterval(() => {
      const lang = this.getLang();
      const theme = this.getTheme();
      if (lang !== this.currentLang || theme !== this.currentTheme) {
        this.currentLang = lang;
        this.currentTheme = theme;
        this.render();
      }
    }, 500);
    
    this.render();
    this.setupEventListeners();
  }

  getLang() {
    const stored = localStorage.getItem('language');
    return ['fr', 'ar'].includes(stored) ? stored : 'fr';
  }

  getTheme() {
    return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  }

  getCardStyles() {
    const isDark = this.currentTheme === 'dark';
    const isArabic = this.currentLang === 'ar';
    const fontFamily = isArabic ? 'font-[Noto_Kufi_Arabic]' : 'font-rubik';
    
    return {
      container: `
        w-full min-h-screen
        flex flex-col items-center gap-8
        px-4 py-8
        ${isDark ? 'bg-[#141414]' : 'bg-white'}
      `,
      
      cardWrapper: `
        w-full flex justify-center
        ${isDark ? 'bg-[#141414]' : 'bg-white'}
        my-4
      `,
      
      card: `
        ${isDark ? 'bg-[#2C2C2C]' : 'bg-white'}
        rounded-xl flex flex-col justify-between
        w-full max-w-[800px]
        min-h-[280px] h-[280px]
        border border-[#C5C5C5]
        py-6 px-8
        transition-all
        ${isDark ? 
          'shadow-[-0.69px_5.52px_12.41px_0px_#4F4F4F1A, -2.07px_22.06px_22.06px_0px_#4F4F4F17]' : 
          'shadow-[-0.86px_6.89px_15.51px_0px_#4F4F4F1A]'
        }
      `,
      
      cardTitle: `
        ${fontFamily}
        font-medium
        text-[36px]
        text-center uppercase
        mb-4
        ${isDark ? 'text-white' : 'text-black'}
        leading-[100%]
        tracking-[0%]
      `,
      
      cardDesc: `
        ${fontFamily}
        text-lg
        text-center mb-6
        ${isDark ? 'text-[#CDCDCD]' : 'text-gray-700'}
        leading-relaxed
        flex-1 flex items-center justify-center
        w-3/5 mx-auto
      `,
      
      logoContainer: `
        flex justify-center items-center mb-4
      `,
      
      logo: `
        w-[min(100vw,240px)] h-auto object-contain
      `,
      
      buttonWrap: "flex justify-center w-full mb-4",
      
      acheterButton: `
        ${fontFamily}
        flex items-center justify-center rounded-full 
        bg-[#e50012] text-white font-medium 
        uppercase text-base
        min-w-[220px]
        py-3 px-10
        transition hover:bg-[#e50012]/90 active:translate-y-0
      `
    };
  }

  render() {
    const styles = this.getCardStyles();
    const isArabic = this.currentLang === 'ar';

    // Free Fire Card with same structure as Migration cards
    const freeFireCard = `
      <div class="${styles.cardWrapper}">
        <div class="${styles.card}">
          <div class="${styles.logoContainer}">
            <img src="/assets/images/services/freefire.svg" alt="Free Fire" 
              class="${styles.logo}"/>
          </div>
          <div class="${styles.cardDesc}">
            ${freeFireData.description}
          </div>
          <div class="${styles.buttonWrap}">
            <button class="${styles.acheterButton} freefire-btn">
              <span>${freeFireData.button}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = `
      <div class="${styles.container}">
        ${freeFireCard}
      </div>
    `;
  }

  setupEventListeners() {
    const button = this.container.querySelector('.freefire-btn');
    if (button) {
      button.addEventListener('click', () => {
        // Handle button click action here
        console.log('Free Fire service button clicked');
      });
    }
  }
}