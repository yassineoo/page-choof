import { DimaFrench, DimaArabic } from './DimaData.js';

const styles = {
  container: 'w-full bg-white dark:bg-[#2C2C2C] px-5 py-8',
  innerContainer: 'max-w-7xl mx-auto',
  title: 'font-rubik font-medium text-3xl md:text-4xl tracking-wide uppercase text-center mb-10 text-black dark:text-white',
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-items-center',
  card: 'w-full max-w-[28rem] bg-white dark:bg-[#2C2C2C] rounded-xl flex flex-col relative overflow-hidden dima-card-border',
  nouveauBadge: 'absolute top-0 left-0 w-[116px] h-[40px] rotate-[45deg] origin-top-left opacity-100 z-10 bg-[#FFD700] rounded-[1.47px] flex items-center justify-center transform translate-x-[20px] translate-y-[20px]',
  nouveauText: 'font-rubik font-semibold text-[12px] leading-[13.36px] text-center text-black transform rotate-[-45deg]',
  cardHeader: 'bg-ooredoo-red px-4 py-2 text-center',
  cardName: 'font-rubik font-semibold text-[1.535rem] leading-[2.383rem] tracking-tight text-white',
  cardContent: 'p-4 flex flex-col flex-1 justify-between',
  dataTitle: 'text-2xl font-bold text-ooredoo-red mb-3',
  featuresList: 'list-none p-0 m-0',
  featureIconBase: 'w-4 h-4 flex-shrink-0',
  featureText: 'flex-1',
  divider: 'dima-divider',
  priceContainer: 'text-center mb-1',
  priceAmount: 'font-rubik font-semibold text-[28px] dark:text-white',
  priceDa: 'font-rubik font-semibold text-[16px] dark:text-white',
  priceDuration: 'font-rubik font-semibold text-[16px] dark:text-gray-300',
  buttonWrap: 'flex justify-center mt-2',
  acheterButton: 'acheter-button'
};

const customCSS = `
.dima-card-border {
  box-shadow: -0.92px 7.34px 16.52px 0px #4F4F4F1A, -2.75px 29.37px 29.37px 0px #4F4F4F17;
  border: none;
}

.dark .dima-card-border {
  box-shadow: none;
  border: 1px solid #BBBEBE;
}

.acheter-button {
  min-width: 6rem;
  height: 2rem;
  padding: 0.4rem 1.5rem;
  border-radius: 22px;
  background-color: var(--ooredoo-red, #e50012);
  border: none;
  color: white;
  font-family: Rubik, sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
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
.acheter-button:active { 
  transform: translateY(0px); 
}
.dima-divider {
  border: none;
  width: 100%;
  margin: 0.5rem 0;
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

export default class Dima {
  constructor(container) {
    this.container = container;
    this.currentLang = this.getLang();
    this.injectStyles();

    window.addEventListener('languageChanged', () => {
      const lang = this.getLang();
      if (lang !== this.currentLang) {
        this.currentLang = lang;
        this.render();
      }
    });

    this.langPoller = setInterval(() => {
      const lang = this.getLang();
      if (lang !== this.currentLang) {
        this.currentLang = lang;
        this.render();
      }
    }, 500);

    this.render();
  }

  // Inject Dima styles
  injectStyles() {
    if (!document.getElementById('dima-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'dima-styles';
      styleEl.textContent = customCSS;
      document.head.appendChild(styleEl);
    }
  }

  getLang() {
    const stored = localStorage.getItem('language');
    return ['fr', 'ar'].includes(stored) ? stored : 'fr';
  }

  getOffers() {
    return this.currentLang === 'fr' ? DimaFrench : DimaArabic;
  }

  // Render a single card
  renderOfferCard(offer, index) {
    const isArabic = this.currentLang === 'ar';
    const iconMargin = isArabic ? 'ml-2' : 'mr-2';
    const nouveauText = isArabic ? 'جديد' : 'Nouveau';
    
    return `
      <div class="${styles.card}">
        <div class="${styles.cardHeader}">
          <h2 class="${styles.cardName}">${offer.name}</h2>
        </div>
        <div class="${styles.cardContent}">
          <div>
            <div class="${styles.dataTitle}">${offer.highlight}</div>
            <ul class="${styles.featuresList}">
              ${offer.features.map(f => `
                <li class="text-base leading-relaxed flex items-center mb-2 text-gray-800 dark:text-gray-200">
                  <img src="/assets/images/dima/checkbox.svg" class="${styles.featureIconBase} ${iconMargin}" alt="" />
                  <span class="${styles.featureText}">${f}</span>
                </li>`).join('')}
            </ul>
          </div>
          <div>
            <div class="${styles.divider}"></div>
            <div class="${styles.priceContainer}" dir="ltr">
              <span class="${styles.priceAmount}">${offer.price}</span>
              <span class="${styles.priceDa}">${isArabic ? ' دج /' : 'DA /'}</span>
              <span class="${styles.priceDuration}">${offer.duration}</span>
            </div>
            <div class="${styles.buttonWrap}">
              <button class="${styles.acheterButton}" data-index="${index}">
                ${isArabic ? 'شراء' : 'ACHETER'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const { title, offers } = this.getOffers();
    const fontClass = this.currentLang === 'ar' ? 'font-[Noto_Kufi_Arabic]' : 'font-rubik';

    this.container.innerHTML = `
      <div class="${styles.container} ${fontClass}" ${this.currentLang === 'ar' ? 'dir="rtl"' : ''}>
        <div class="${styles.innerContainer}">
          <h1 class="${styles.title}">${title}</h1>
          <div class="${styles.grid}">
            ${offers.map((o, i) => this.renderOfferCard(o, i)).join('')}
          </div>
          <!-- Hook for internal modal -->
          <div id="dima-modal-hook"></div>
        </div>
      </div>
    `;
    this.bindButtons(offers);
  }

  bindButtons(offers) {
    const isArabic = this.currentLang === 'ar';
    this.container.querySelectorAll(`.${styles.acheterButton}`).forEach(btn => {
      btn.addEventListener('click', () => {
        const offer = offers[btn.dataset.index];
        // Messages per language
        const confirmMsg = isArabic
          ? `اشتر الآن باقة ${offer.name} + ${offer.highlight}، ${offer.price} دج / ${offer.duration}.`
          : `Obtenez un accès à ${offer.name} + ${offer.highlight} pour ${offer.price} DA / ${offer.duration}.`;

        const congratsMsg = isArabic
          ? `لقد قمت بتفعيل باقة ${offer.name} + ${offer.highlight} بنجاح.`
          : `Vous avez activé votre forfait ${offer.name} + ${offer.highlight} avec succès.`;

        const noCreditMsg = isArabic
          ? `رصيدك غير كافٍ لشراء باقة ${offer.name}. يرجى شحن رصيدك وإعادة المحاولة.`
          : `Cher client, votre crédit est insuffisant pour acheter le forfait ${offer.name}. Veuillez recharger votre compte et réessayer.`;

        this.showModal('buy', offer.name, confirmMsg, () => {
          const noCredit = false; // Replace with actual logic
          if (noCredit) {
            this.showModal('credit', isArabic ? 'معلومات' : 'Information', noCreditMsg, null, isArabic);
          } else {
            this.showModal('congrats', isArabic ? 'تهانينا!' : 'Félicitations !', congratsMsg, null, isArabic);
          }
        }, isArabic);
      });
    });
  }

  // Internal modal generator
  showModal(type, title, message, onConfirm, isArabic = false) {
    const modalRoot = this.container.querySelector('#dima-modal-hook');
    modalRoot.innerHTML = '';

    const modalTitleClass = `
      font-rubik font-semibold text-ooredoo-red
      text-[34px] leading-[55.86px]
      uppercase text-center tracking-[-0.02em]
      mb-6
    `.replace(/\s+/g, ' ');

    const closeButton = `
      <button class="absolute top-6 right-6 p-2 z-10" aria-label="Fermer" tabindex="0">
        <img src="/assets/images/Close.svg" alt="close" style="width:34px;height:34px;display:block"/>
      </button>
    `;

    // Migration-style buttons
    const primaryBtn = `flex items-center justify-center rounded-full bg-[#e50012] text-white font-rubik font-semibold uppercase text-sm min-w-[10rem] py-2 px-5 `;
    const secondaryBtn = `flex items-center justify-center rounded-full bg-white border-2 border-[#ED1C24] text-[#ED1C24] font-rubik font-semibold uppercase text-sm min-w-[10rem] py-2 px-5 transition`;

    let buttonsHTML = '';
    if (type === 'buy') {
      buttonsHTML = `
        <button class="${secondaryBtn}" id="modal-cancel">${isArabic ? 'إلغاء' : 'Annuler'}</button>
        <button class="${primaryBtn}" id="modal-confirm">${isArabic ? 'تأكيد' : 'Confirmer'}</button>
      `;
    } else if (type === 'congrats') {
      buttonsHTML = `<button class="${secondaryBtn}" id="modal-close">${isArabic ? 'إغلاق' : 'Fermer'}</button>`;
    } else if (type === 'credit') {
      buttonsHTML = `<button class="${primaryBtn}" id="modal-close">${isArabic ? 'حسنًا' : 'OK'}</button>`;
    }

    modalRoot.innerHTML = `
      <div class="fixed inset-0 z-[9999] flex items-center justify-center" style="background-color:#696969CC">
        <div class="relative bg-white rounded-[18px] shadow-xl w-full max-w-[640px] mx-auto px-8 pt-14 pb-10">
          ${closeButton}
          <div class="${modalTitleClass}">
            ${title}
          </div>
          <div class="font-rubik text-[#262626] leading-snug text-center max-w-[70%] mx-auto mb-8">
            ${message}
          </div>
          <div class="flex flex-wrap justify-center gap-3">
            ${buttonsHTML}
          </div>
        </div>
      </div>
    `;

    const closeModal = () => { modalRoot.innerHTML = ''; };
    modalRoot.querySelector('button[aria-label="Fermer"]').onclick = closeModal;
    if (type === 'buy') {
      modalRoot.querySelector('#modal-cancel').onclick = closeModal;
      modalRoot.querySelector('#modal-confirm').onclick = () => {
        closeModal();
        if (onConfirm) onConfirm();
      };
    } else {
      modalRoot.querySelector('#modal-close').onclick = closeModal;
    }
    modalRoot.querySelector('.fixed').onclick = e => {
      if (e.target.classList.contains('fixed')) closeModal();
    };
  }
}