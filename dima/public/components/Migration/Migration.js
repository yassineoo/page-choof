import MigrationData from './MigrationData.js';

export default class Migration {
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
      
      cardWrapperNoPrice: `
        w-full flex justify-center
        ${isDark ? 'bg-[#2C2C2C]' : 'bg-[#F8F8F8]'}
        my-8 py-8
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
      
      priceSection: `
        text-center flex items-baseline justify-center gap-1 mb-4
      `,
      
      priceAmount: `
        ${fontFamily} font-bold 
        text-3xl
        ${isDark ? 'text-white' : 'text-black'}
      `,
      
      priceDa: `
        ${fontFamily} font-medium 
        text-lg
        ${isDark ? 'text-white' : 'text-black'}
      `,
      
      priceDuration: `
        ${fontFamily} font-medium 
        text-lg
        ${isDark ? 'text-white' : 'text-black'}
      `,
      
      buttonWrap: "flex justify-center w-full mb-4",
      
      migrationButtonsWrap: `
        w-[90%] mx-auto
        flex flex-wrap justify-center gap-4
        mb-4
      `,
      
      conversionsGrid: `
        flex flex-wrap justify-center 
        w-full gap-4
        mb-4
      `,
      
      acheterButton: `
        ${fontFamily}
        flex items-center justify-center rounded-full 
        bg-[#e50012] text-white font-medium 
        uppercase text-base
        min-w-[220px]
        py-3 px-10  // Increased padding
        transition hover:bg-[#e50012]/90 active:translate-y-0
      `,
      
      acheterButtonRed: `
        ${fontFamily}
        flex items-center justify-center rounded-full 
        bg-[#ED1C24] text-white font-medium 
        uppercase text-base  // Larger text
        min-w-[140px]  // Increased minimum width
        py-3 px-10  // Increased padding (py-3 instead of py-2)
        transition hover:bg-[#ED1C24]/90 active:translate-y-0
      `,
      
      acheterButtonConversionSmall: `
        ${fontFamily}
        flex items-center justify-center rounded-full 
        bg-[#e50012] text-white font-medium 
        uppercase text-base
        min-w-[180px]
        py-3 px-10  // Increased padding
        transition hover:bg-[#e50012]/90 active:translate-y-0
      `
    };
  }

  render() {
    const { migration, conversions, boost } = MigrationData;
    const styles = this.getCardStyles();
    const isArabic = this.currentLang === 'ar';

    // BOOST CARD
    const boostCard = `
      <div class="${styles.cardWrapper}">
        <div class="${styles.card}">
          <h2 class="${styles.cardTitle}">${boost.title}</h2>
          <div class="${styles.cardDesc}">
            ${boost.description}
          </div>
          <div class="${styles.buttonWrap}">
            <button class="${styles.acheterButton}">
              <span>${boost.button}</span>
            </button>
          </div>
          <div class="${styles.priceSection}">
            <span class="${styles.priceAmount}">${boost.price.split(' ')[0]}</span>
            <span class="${styles.priceDa}">DA/</span>
            <span class="${styles.priceDuration}">${boost.price.split('/')[1].trim()}</span>
          </div>
        </div>
      </div>
    `;

    // MIGRATION CARD
    const migrationCard = `
      <div class="${styles.cardWrapperNoPrice}">
        <div class="${styles.card}">
          <h2 class="${styles.cardTitle}">${migration.title}</h2>
          <div class="${styles.cardDesc}">
            ${migration.subtitle}
          </div>
          <div class="${styles.migrationButtonsWrap}">
            ${migration.options.map(opt => `
              <button class="${styles.acheterButtonRed}">
                <span>${opt.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // CONVERSIONS CARD
    const conversionsCard = `
      <div class="${styles.cardWrapper}">
        <div class="${styles.card}">
          <h2 class="${styles.cardTitle}">${conversions.title}</h2>
          <div class="${styles.cardDesc}">
            ${conversions.description}
          </div>
          <div class="${styles.conversionsGrid}">
            ${conversions.options.map(opt => `
              <button class="${styles.acheterButtonConversionSmall}">
                <span>${opt.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = `
      <div class="${styles.container}">
        ${boostCard}
        ${migrationCard}
        ${conversionsCard}
      </div>
    `;
  }
}