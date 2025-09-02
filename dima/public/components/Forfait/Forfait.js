import ForfaitData from './ForfaitData.js';
import ForfaitCard from './ForfaitCard.js';
import * as styles from './Styles.js';

export default class Forfait {
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

    // Optional polling fallback
    this.langPoll = setInterval(() => {
      const lang = this.getLang();
      if (lang !== this.currentLang) {
        this.currentLang = lang;
        this.render();
      }
    }, 500);
  }

  getLang() {
    const stored = localStorage.getItem('language');
    return ['fr', 'ar'].includes(stored) ? stored : 'fr';
  }

  render() {
    const lang = this.getLang();
    const data = ForfaitData[lang];
    const labels = data.labels;

    this.container.innerHTML = `
      <div class="w-full" ${lang === 'ar' ? 'dir="rtl"' : ''}>
        
        <!-- Regular Forfaits Section - White Background -->
        <section class="w-full bg-white dark:bg-[#1a1a1a] py-12">
          <div class="${styles.wrapper}">
            <h2 class="${styles.sectionTitle}">${labels.titleData}</h2>
            <div class="${styles.gridWithMargin}">
              ${data.forfaits.map((offer, i) => ForfaitCard(offer, i, labels.buy)).join('')}
            </div>
          </div>
        </section>

        <!-- Smart Forfaits Section - Light Gray Background -->
        <section class="w-full bg-[#F8F8F8] dark:bg-[#2C2C2C] py-12">
          <div class="${styles.wrapper}">
            <h2 class="${styles.sectionTitle}">${labels.titleSmart}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
              ${data.smartForfaits.map((offer, i) => ForfaitCard(offer, i + data.forfaits.length, labels.buy)).join('')}
            </div>
          </div>
        </section>

        <!-- Hook for internal modal -->
        <div id="forfait-modal-hook"></div>
      </div>
    `;

    // Bind modal openers
    this.bindModalButtons(lang, [...data.forfaits, ...data.smartForfaits]);
  }

  bindModalButtons(lang, allOffers) {
    const isArabic = lang === 'ar';

    this.container.querySelectorAll('.acheter-button').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const offer = allOffers[idx];

        // ✅ Build per-offer messages using offer.name (not undefined .title)
        const confirmMsg = isArabic
          ? `اشتر الآن باقة ${offer.name}، ${offer.price} دج / ${offer.duration}.`
          : `Obtenez un accès à ${offer.name} pour ${offer.price} DA / ${offer.duration}.`;

        const congratsMsg = isArabic
          ? `لقد قمت بتفعيل باقة ${offer.name} بنجاح.`
          : `Vous avez activé votre forfait ${offer.name} avec succès.`;

        const noCreditMsg = isArabic
          ? `رصيدك غير كافٍ لشراء باقة ${offer.name}. يرجى شحن رصيدك وإعادة المحاولة.`
          : `Cher client, votre crédit est insuffisant pour acheter le forfait ${offer.name}. Veuillez recharger votre compte et réessayer.`;

        // Show buy modal
        this.showModal('buy', offer.name, confirmMsg, () => {
          const noCredit = false; // TODO: replace with real balance check
          if (noCredit) {
            this.showModal('credit', isArabic ? 'معلومات' : 'Information', noCreditMsg, null, isArabic);
          } else {
            this.showModal('congrats', isArabic ? 'تهانينا!' : 'Félicitations !', congratsMsg, null, isArabic);
          }
        }, isArabic);
      });
    });
  }

  // Internal modal generator (same style for all)
  showModal(type, title, message, onConfirm, isArabic = false) {
    const modalRoot = this.container.querySelector('#forfait-modal-hook');
    modalRoot.innerHTML = '';

    const modalTitleClass = `
      font-rubik font-semibold text-ooredoo-red
      text-[34px] leading-[55.86px]
      uppercase text-center tracking-[-0.02em]
      mb-6
    `.replace(/\s+/g, ' ');

    const closeButton = `
      <button class="absolute top-6 right-6 p-2 z-10 hover:bg-gray-100 rounded-full transition-all duration-200" aria-label="Fermer" tabindex="0">
        <img src="/assets/images/Close.svg" alt="close" style="width:34px;height:34px;display:block"/>
      </button>
    `;

    const primaryBtn = `flex items-center justify-center rounded-full bg-[#e50012] text-white font-rubik font-semibold uppercase text-sm min-w-[10rem] py-3 px-6 hover:bg-[#cc000f] transition-all duration-200 shadow-lg hover:shadow-xl`;
    const secondaryBtn = `flex items-center justify-center rounded-full bg-white border-2 border-[#ED1C24] text-[#ED1C24] font-rubik font-semibold uppercase text-sm min-w-[10rem] py-3 px-6 hover:bg-[#ED1C24] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg`;

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
      <div class="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm" style="background-color:#696969CC">
        <div class="relative bg-white rounded-[20px] shadow-2xl w-full max-w-[640px] mx-4 px-8 pt-16 pb-12 transform transition-all duration-300 scale-100">
          ${closeButton}
          <div class="${modalTitleClass}">
            ${title}
          </div>
          <div class="font-rubik text-[#262626] leading-relaxed text-center max-w-[80%] mx-auto mb-10 text-lg">
            ${message}
          </div>
          <div class="flex flex-wrap justify-center gap-4">
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