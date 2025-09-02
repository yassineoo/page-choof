import ServicesData from './ServicesData.js';

export default class Services {
  constructor(container) {
    this.container = container;
    this.currentLang = this.getLang();
    this.cachedHtml = {};

    // Instant language switch via event
    window.addEventListener('languageChanged', () => {
      const lang = this.getLang();
      if (lang !== this.currentLang) {
        this.currentLang = lang;
        this.render();
      }
    });

    // Polling fallback if event not used
    this.langPoll = setInterval(() => {
      const lang = this.getLang();
      if (lang !== this.currentLang) {
        this.currentLang = lang;
        this.render();
      }
    }, 500);

    this.render();
  }

  getLang() {
    const stored = localStorage.getItem('language');
    return ['fr', 'ar'].includes(stored) ? stored : 'fr';
  }

  render() {
    const lang = this.getLang();
    const cacheKey = lang;
    if (this.cachedHtml[cacheKey]) {
      this.container.innerHTML = this.cachedHtml[cacheKey];
      return;
    }

    const data = ServicesData[lang];
    const isArabic = lang === 'ar';
    const dir = isArabic ? 'rtl' : 'ltr';

    const textAlign = isArabic ? 'text-right' : 'text-left';
    const flexDirection = isArabic
      ? 'md:flex-row-reverse md:justify-between'
      : 'md:flex-row md:justify-between';

    const html = `
      <div class="bg-ooredoo-red w-full flex items-center py-12" dir="${dir}">
        <div class="w-full mx-auto px-[clamp(1rem,5vw,5rem)]">

          <h2 class="text-white font-outfit font-extrabold uppercase tracking-[0.02em]
                     text-[clamp(1.5rem,3vw,2.625rem)] leading-[141%]
                     mb-[clamp(1rem,2vw,2.5rem)] text-center md:${textAlign}">
            ${data.title}
          </h2>

          <!-- Service Items -->
          <div class="flex flex-wrap justify-center ${isArabic ? 'md:justify-end' : 'md:justify-start'} gap-3 md:gap-4 mb-[clamp(1.5rem,3vw,2.5rem)]">
            ${data.services.map(service => {
              // Make Anghami and OFN icons smaller
              const isSmallIcon = service.name === "Anghami" || service.name === "OFN";
              const iconClass = isSmallIcon ? 'h-4 md:h-5' : 'h-[clamp(15px,2vw,20px)]';
              if (service.separator) {
                return `
                  <div class="w-[clamp(100px,10vw,140px)] h-[clamp(50px,5vw,70px)] rounded-[50px] bg-white flex items-center justify-center
                    transition-transform duration-200 hover:scale-105">
                    <div class="flex items-center gap-1 px-2">
                      <img src="${service.icon}" alt="" class="object-contain ${iconClass} w-auto" />
                      <span class="text-black font-rubik text-[12px] leading-[11.49px] font-bold">&</span>
                      <img src="${service.secondaryIcon}" alt="" class="object-contain ${iconClass} w-auto" />
                    </div>
                  </div>
                `;
              } else {
                return `
                  <div class="w-[clamp(100px,10vw,140px)] h-[clamp(50px,5vw,70px)] rounded-[50px] bg-white flex items-center justify-center
                    transition-transform duration-200 hover:scale-105">
                    <img src="${service.icon}" alt="${service.name}"
                      class="object-contain ${iconClass} w-auto" />
                  </div>
                `;
              }
            }).join('')}
          </div>

          <div class="flex flex-col ${flexDirection} items-center gap-4 md:gap-0">
            <p class="text-white font-rubik font-normal text-[clamp(0.9rem,1.5vw,1.125rem)]
                      leading-[170%] tracking-[0.02em] text-center md:${textAlign}">
              ${data.subtitle}
            </p>
            <button class="rounded-[34.7px] bg-white text-ooredoo-red font-rubik font-medium
                              text-[clamp(0.9rem,1.5vw,1.125rem)] leading-[170%] tracking-[0.02em]
                              uppercase px-6 py-2 hover:bg-gray-100 transition-colors">
              ${data.buttonText}
            </button>
          </div>

        </div>
      </div>
    `;

    this.cachedHtml[cacheKey] = html;
    this.container.innerHTML = html;
  }
}
