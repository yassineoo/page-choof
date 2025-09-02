import { digitalServices } from './DigitalServicesHeaderData.js';

export default class DigitalServicesHeader {
  constructor(container) {
    this.container = container;
    this.currentLang = this.getLang();

    // Watch for language changes
    window.addEventListener('languageChanged', () => {
      const lang = this.getLang();
      if (lang !== this.currentLang) {
        this.currentLang = lang;
        this.render();
      }
    });

    this.render();
  }

  getLang() {
    const stored = localStorage.getItem('language');
    return ['fr', 'ar'].includes(stored) ? stored : 'fr';
  }

  render() {
    const lang = this.getLang();
    const isArabic = lang === 'ar';
    const dir = isArabic ? 'rtl' : 'ltr';
    const textAlign = isArabic ? 'text-right' : 'text-left';

    // Text content for the black circle
    const circleText = isArabic ? 'طور عالمك' : 'Upgrade your world';

    this.container.innerHTML = `
      <div class="bg-ooredoo-red w-full min-h-[clamp(200px,20vw,400px)] flex items-center justify-center" dir="${dir}">
        <div class="w-full max-w-[2400px] flex flex-col md:flex-row items-center px-[clamp(1rem,5vw,5rem)] py-[clamp(2rem,5vw,4rem)] gap-8">
          <div class="flex-1 flex flex-col items-start">

            <h2 class="relative z-10 text-white font-outfit font-extrabold uppercase
            text-[45px] leading-[141%] tracking-[0.02em]
            mb-[clamp(1rem,2vw,2.5rem)] text-center md:text-left">
  Protégez-vous avec Bitdefender !
  <br>
  <span class="relative inline-block z-10">
    Sécurité + contrôle parental en un seul pack.

    <!-- Black Circle in background -->
    <div class="absolute left-[90%] -translate-x-1/2 
                -top-[clamp(3rem,6vw,5rem)]
                w-[clamp(60px,8vw,97px)] h-[clamp(60px,8vw,97px)]
                bg-black rounded-full flex items-center justify-center z-0">
      <span class="relative z-10 text-white font-rubik font-semibold uppercase 
                   text-[13px] leading-[120%] tracking-[0.02em] text-center px-2">
        ${circleText}
      </span>
    </div>
  </span>
</h2>


            

            <!-- Service Icons -->
            <div class="flex flex-wrap gap-[clamp(1rem,2vw,3rem)] mb-6 justify-center md:justify-start">
              ${digitalServices.map(service => `
                <div class="aspect-square min-w-[clamp(50px,5vw,90px)] min-h-[clamp(50px,5vw,90px)] rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-105">
                  <img src="${service.icon}" alt="${service.name}" 
                    class="w-[clamp(30px,3vw,56px)] h-[clamp(30px,3vw,56px)] object-contain" />
                </div>
              `).join('')}
            </div>

            <p class="text-white font-rubik text-[clamp(0.8rem,1.5vw,1.25rem)] leading-[170%] tracking-wide pl-2 mt-2 mb-2">
              Conditions générales applicables.
            </p>
          </div>
        </div>
      </div>
    `;
  }
}
