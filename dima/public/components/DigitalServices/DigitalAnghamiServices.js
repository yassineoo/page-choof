import { anghamiPlan, anghamiDescription } from './DigitalAnghamiServicesData.js';

// Updated styles to match Dima card sizing (28rem instead of 21rem)
const styles = {
  card: 'w-full max-w-[28rem] bg-white dark:bg-[#2C2C2C] rounded-xl flex flex-col relative overflow-hidden dima-card-border',
  cardHeader: 'bg-ooredoo-red px-6 py-3 text-center',
  cardName: 'font-rubik font-semibold text-2xl md:text-3xl leading-tight tracking-tight text-white',
  cardContent: 'p-6 flex flex-col flex-1 justify-between',
  dataTitle: 'text-2xl font-bold text-ooredoo-red mb-3',
  featuresList: 'list-none p-0 m-0',
  featureIconBase: 'w-5 h-5 flex-shrink-0 mr-3',
  featureText: 'flex-1',
  divider: 'dima-divider',
  priceContainer: 'text-center mb-2',
  priceAmount: 'font-rubik font-semibold text-[2rem] capitalize dark:text-white',
  priceDa: 'font-rubik font-semibold text-lg capitalize dark:text-white',
  priceDuration: 'font-rubik font-semibold text-lg capitalize dark:text-gray-300',
  buttonWrap: 'flex justify-center mt-2',
  acheterButton: 'acheter-button'
};

// Updated CSS injection to match Dima styling
if (!document.getElementById('dima-anghami-styles')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'dima-anghami-styles';
  styleEl.textContent = `
    .dima-card-border {
      box-shadow: -0.92px 7.34px 16.52px 0px #4F4F4F1A, -2.75px 29.37px 29.37px 0px #4F4F4F17;
      border: none;
    }

    .dark .dima-card-border {
      box-shadow: none;
      border: 1px solid #BBBEBE;
    }

    .acheter-button {
      min-width: 7rem;
      height: 2.5rem;
      padding: 0.5rem 2rem;
      border-radius: 22px;
      background-color: var(--ooredoo-red, #e50012);
      border: none;
      color: white;
      font-family: Rubik, sans-serif;
      font-weight: 600;
      font-size: 1.1rem;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .acheter-button:hover {
      background-color: rgba(229,0,18,0.9);
      transform: translateY(-1px);
    }
    .acheter-button:active { transform: translateY(0px); }
    .dima-divider {
      border: none;
      width: 100%;
      margin: 0.75rem 0;
      height: 1px;
      background-image: repeating-linear-gradient(
        to right,
        #BBBEBE 0px,
        #BBBEBE 8px,
        transparent 8px,
        transparent 16px
      );
      background-size: 16px 1px;
      background-repeat: repeat-x;
    }
  `;
  document.head.appendChild(styleEl);
}

function renderAnghamiCard(plan, isArabic) {
  return `
    <div class="${styles.card}">
      <div class="${styles.cardHeader}">
        <h2 class="${styles.cardName}">${plan.name}</h2>
      </div>
      <div class="${styles.cardContent}">
        <div>
          <div class="${styles.dataTitle}">${plan.data}</div>
          <ul class="${styles.featuresList}">
            ${plan.features.map(f => `
              <li class="text-base leading-relaxed flex items-center mb-3 text-gray-800 dark:text-gray-200">
                <img src="/assets/images/dima/checkbox.svg" class="${styles.featureIconBase}" alt="✓" />
                <span class="${styles.featureText}">${f}</span>
              </li>`).join('')}
          </ul>
        </div>
        <div>
          <div class="${styles.divider}"></div>
          <div class="${styles.priceContainer}" dir="ltr">
            <span class="${styles.priceAmount}">${plan.price}</span>
            <span class="${styles.priceDa}"> دج /</span>
            <span class="${styles.priceDuration}">${plan.duration}</span>
          </div>
          <div class="${styles.buttonWrap}">
            <button class="${styles.acheterButton}">
              ${isArabic ? 'شراء' : 'ACHETER'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export default class DigitalAnghamiServices {
  constructor(container) {
    this.container = container;
    this.currentLang = this.getLang();
    this.render();

    window.addEventListener('languageChanged', () => {
      const lang = this.getLang();
      if (lang !== this.currentLang) {
        this.currentLang = lang;
        this.render();
      }
    });
  }

  getLang() {
    const stored = localStorage.getItem('language');
    return ['fr', 'ar'].includes(stored) ? stored : 'fr';
  }

  render() {
    const lang = this.getLang();
    const isArabic = lang === 'ar';
    const plan = anghamiPlan[lang];
    const description = anghamiDescription[lang];

    this.container.innerHTML = `
      <div class="w-full bg-[#F8F8F8] dark:bg-[#2C2C2C] px-5 py-8">
        <div class="mx-auto px-2 sm:px-4 py-12 w-full max-w-screen-xl" ${isArabic ? 'dir="rtl"' : ''}>
          <div class="flex flex-col-reverse lg:flex-row w-full gap-8 items-center">
            <!-- Logos & Description (left on desktop, top on mobile) -->
            <div class="w-full lg:w-[55%] max-w-xl mx-auto flex flex-col items-center text-center">
              <div class="flex items-center justify-center gap-6 mb-8">
                <img src="/assets/images/services/anghani.svg" alt="Anghami"
                  class="w-36 md:w-48 h-auto"/>
                <span class="text-4xl font-bold mx-4 text-black dark:text-white">&</span>
                <img src="/assets/images/services/ofn.svg" alt="OSN+"
                  class="w-36 md:w-48 h-auto"/>
              </div>
              <h3 class="font-semibold text-xl leading-relaxed tracking-wide mb-4 text-black dark:text-white">
                ${isArabic ? "إشتراك OSN + Anghami" : "FORFAITS OSN + Anghami"}
              </h3>
              <p class="text-base leading-relaxed tracking-wide w-full max-w-sm mx-auto ${isArabic ? 'text-right' : 'text-left'} text-gray-800 dark:text-gray-200">
                ${description}
              </p>
            </div>

            <!-- Card Section (right on desktop, bottom on mobile) -->
            <div class="w-full lg:w-[45%] flex justify-center">
              ${renderAnghamiCard(plan, isArabic)}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}