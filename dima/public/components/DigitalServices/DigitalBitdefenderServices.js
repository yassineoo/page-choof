import { bitdefenderPlans } from './DigitalBitdefenderServicesData.js';

const bitdefenderStyles = `
.bitdefender-card-border {
  box-shadow: -0.92px 7.34px 16.52px 0px #4F4F4F1A, -2.75px 29.37px 29.37px 0px #4F4F4F17;
  border: none;
}

.dark .bitdefender-card-border {
  box-shadow: none;
  border: 1px solid #BBBEBE;
}

.bitdefender-divider {
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

.bitdefender-acheter-button {
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

.bitdefender-acheter-button:hover { 
  background-color: rgba(229,0,18,0.9); 
  transform: translateY(-1px); 
}

.bitdefender-acheter-button:active { 
  transform: translateY(0px); 
}
`;

const bitdefenderTranslations = {
  fr: {
    buttonText: 'ACHETER',
    buyModalTitle: 'Confirmation d\'achat',
    buyMessage: (plan) => `Obtenez un accès à ${plan.title} + ${plan.subtitle} pour ${plan.price} DA / ${plan.duration}.`,
    congratsTitle: 'Félicitations !',
    congratsMessage: (plan) => `Vous avez activé votre forfait ${plan.title} + ${plan.subtitle} avec succès.`,
    creditTitle: 'Information',
    creditMessage: (plan) => `Cher client, votre crédit est insuffisant pour acheter le forfait ${plan.title}. Veuillez recharger votre compte et réessayer.`,
    confirmBtn: 'Confirmer',
    cancelBtn: 'Annuler',
    closeBtn: 'Fermer',
    okBtn: 'OK'
  },
  ar: {
    buttonText: 'شراء',
    buyModalTitle: 'تأكيد الشراء',
    buyMessage: (plan) => `احصل على ${plan.titleAr} + ${plan.subtitleAr} مقابل ${plan.price} دج / ${plan.durationAr}.`,
    congratsTitle: 'تهانينا!',
    congratsMessage: (plan) => `لقد قمت بتفعيل باقة ${plan.titleAr} + ${plan.subtitleAr} بنجاح.`,
    creditTitle: 'معلومات',
    creditMessage: (plan) => `عزيزي العميل، رصيدك غير كافٍ لشراء باقة ${plan.titleAr}. يرجى شحن رصيدك وإعادة المحاولة.`,
    confirmBtn: 'تأكيد',
    cancelBtn: 'إلغاء',
    closeBtn: 'إغلاق',
    okBtn: 'حسناً'
  }
};

export default class DigitalBitdefenderServices {
  constructor(container) {
    this.container = container;
    this.currentLang = this.getLang();
    this.injectStyles();
    this.render();
    this.observeTheme();
    this.setupResizeObserver();

    // Language change listener
    window.addEventListener('languageChanged', () => {
      const lang = this.getLang();
      if (lang !== this.currentLang) {
        this.currentLang = lang;
        this.render();
      }
    });

    // Language polling fallback
    this.langPoller = setInterval(() => {
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

  injectStyles() {
    if (!document.getElementById('bitdefender-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'bitdefender-styles';
      styleEl.textContent = bitdefenderStyles;
      document.head.appendChild(styleEl);
    }
  }

  getPlanIcon(plan) {
    const isDark = document.documentElement.classList.contains('dark');
    return isDark && plan.iconDark ? plan.iconDark : plan.icon;
  }

  getSystemsIcon(plan) {
    if (plan.id === "securiteMobile") {
      return "/assets/images/services/bitdefender/2-systems.svg";
    }
    const isDark = document.documentElement.classList.contains('dark');
    return isDark && plan.systemsIconDark ? plan.systemsIconDark : plan.systemsIcon;
  }

  getTranslatedPlan(plan) {
    const isArabic = this.currentLang === 'ar';
    return {
      ...plan,
      title: isArabic ? plan.titleAr || plan.title : plan.title,
      subtitle: isArabic ? plan.subtitleAr || plan.subtitle : plan.subtitle,
      features: isArabic ? plan.featuresAr || plan.features : plan.features,
      duration: isArabic ? plan.durationAr || plan.duration : plan.duration
    };
  }

  render() {
    const isArabic = this.currentLang === 'ar';
    const fontClass = isArabic ? 'font-[Noto_Kufi_Arabic]' : 'font-rubik';
    const dirAttribute = isArabic ? 'dir="rtl"' : '';
    const iconMargin = isArabic ? 'ml-3' : 'mr-3';
    const t = bitdefenderTranslations[this.currentLang];

    this.container.innerHTML = `
      <div class="w-full flex justify-center bg-white dark:bg-[#141414] py-[clamp(2rem,5vw,6rem)] px-[clamp(1rem,5vw,5rem)] ${fontClass}" ${dirAttribute}>
        <div class="flex-shrink-0 flex flex-col items-center justify-center ${isArabic ? 'ml-[clamp(1rem,3vw,3rem)]' : 'mr-[clamp(1rem,3vw,3rem)]'}">
          <img src="/assets/images/services/Bitdefender.svg" alt="Bitdefender"
            class="w-[clamp(200px,25vw,400px)] h-auto object-contain mb-4" />
        </div>
        <div class="w-full max-w-[2800px] grid grid-cols-1 md:grid-cols-2 gap-[clamp(1rem,3vw,3rem)]">
          ${bitdefenderPlans.map((plan, idx) => {
            const translatedPlan = this.getTranslatedPlan(plan);
            return `
            <div class="relative flex flex-col bg-white dark:bg-[#141414] rounded-2xl bitdefender-card-border min-h-[clamp(400px,50vw,600px)] overflow-hidden max-w-none">
              <div class="w-full flex justify-center">
                <div class="bg-ooredoo-red rounded-t-2xl w-full flex items-center justify-center shadow-lg py-[clamp(0.5rem,1vw,1.5rem)]">
                  <span class="text-white font-rubik font-bold text-[clamp(1rem,1.5vw,1.5rem)] uppercase tracking-wide">${translatedPlan.title}</span>
                </div>
              </div>
              <div class="flex flex-col pt-[clamp(1rem,2vw,2rem)] pb-[clamp(1rem,2vw,2rem)] px-[clamp(1rem,2vw,2rem)] h-full">
                <div class="flex justify-between items-center mb-[clamp(0.5rem,1vw,1.5rem)]">
                  <span class="text-ooredoo-red font-rubik text-[clamp(1rem,1.5vw,1.5rem)] font-bold flex-1">${translatedPlan.subtitle}</span>
                  <img src="${this.getPlanIcon(plan)}" alt="Appareils" 
                    class="w-[clamp(60px,6vw,120px)] h-[clamp(40px,4vw,80px)] object-contain ${isArabic ? 'mr-4' : 'ml-4'} bitdefender-plan-icon" />
                </div>
                <div class="bitdefender-divider"></div>
                
                <div class="flex justify-between items-center mb-[clamp(0.5rem,1vw,1.5rem)]">
                  <span class="text-gray-800 dark:text-gray-200 font-rubik leading-relaxed text-[clamp(0.9rem,1.2vw,1.2rem)]">${isArabic ? 'حماية شاملة' : 'Protection complète'}</span>
                  <img src="${this.getSystemsIcon(plan)}" alt="Systems" 
                    class="${plan.id === "securiteMobile" ? 
                      'w-[clamp(40px,4vw,80px)] h-[clamp(20px,2vw,40px)]' : 
                      'w-[clamp(80px,8vw,160px)] h-[clamp(20px,2vw,40px)]'} object-contain ${isArabic ? 'mr-4' : 'ml-4'} bitdefender-systems-icon" />
                </div>
                <div class="bitdefender-divider"></div>
                
                <ul class="flex flex-col gap-[clamp(0.5rem,1vw,1rem)] mb-[clamp(1rem,2vw,2rem)]">
                  ${translatedPlan.features.map(feature => `
                    <li class="flex items-center gap-3">
                      <img src="/assets/images/dima/checkbox.svg" alt="Check" 
                        class="w-[clamp(16px,1.2vw,20px)] h-[clamp(16px,1.2vw,20px)] flex-shrink-0 ${iconMargin}" />
                      <span class="text-gray-800 dark:text-gray-200 font-rubik text-[clamp(0.8rem,1.1vw,1.1rem)] leading-relaxed flex-1">${feature}</span>
                    </li>
                  `).join('')}
                </ul>
                
                <div class="mt-auto pt-2">
                  <div class="bitdefender-divider"></div>
                  <div class="flex flex-col items-center">
                    <div class="text-center mb-[clamp(0.5rem,1vw,1.5rem)]" dir="ltr">
                      <span class="text-[clamp(1.5rem,2vw,2.5rem)] font-bold dark:text-white">${plan.price}</span>
                      <span class="font-bold text-[clamp(1rem,1.5vw,1.5rem)] dark:text-white">${isArabic ? ' دج /' : ' Da /'}</span>
                      <span class="font-semibold text-[clamp(0.7rem,1vw,1rem)] dark:text-gray-300">${translatedPlan.duration}</span>
                    </div>
                    <button class="bitdefender-acheter-button" data-plan-index="${idx}">
                      ${t.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `}).join('')}
        </div>
        <!-- Modal Hook -->
        <div id="bitdefender-modal-hook"></div>
      </div>
    `;

    this.bindButtons();
  }

  bindButtons() {
    const t = bitdefenderTranslations[this.currentLang];
    const isArabic = this.currentLang === 'ar';
    
    this.container.querySelectorAll('.bitdefender-acheter-button').forEach(btn => {
      btn.addEventListener('click', () => {
        const planIndex = parseInt(btn.dataset.planIndex);
        const plan = bitdefenderPlans[planIndex];
        const translatedPlan = this.getTranslatedPlan(plan);

        const confirmMsg = t.buyMessage(translatedPlan);
        const congratsMsg = t.congratsMessage(translatedPlan);
        const noCreditMsg = t.creditMessage(translatedPlan);

        this.showModal('buy', t.buyModalTitle, confirmMsg, () => {
          const noCredit = false; // Replace with actual logic
          if (noCredit) {
            this.showModal('credit', t.creditTitle, noCreditMsg);
          } else {
            this.showModal('congrats', t.congratsTitle, congratsMsg);
          }
        });
      });
    });
  }

  showModal(type, title, message, onConfirm) {
    const modalRoot = this.container.querySelector('#bitdefender-modal-hook');
    modalRoot.innerHTML = '';
    
    const isArabic = this.currentLang === 'ar';
    const t = bitdefenderTranslations[this.currentLang];
    const dirAttribute = isArabic ? 'dir="rtl"' : '';

    const modalTitleClass = `
      font-rubik font-semibold text-ooredoo-red
      text-[34px] leading-[55.86px]
      uppercase text-center tracking-[-0.02em]
      mb-6
    `.replace(/\s+/g, ' ');

    const closeButton = `
      <button class="absolute top-6 ${isArabic ? 'left-6' : 'right-6'} p-2 z-10" aria-label="Fermer" tabindex="0">
        <img src="/assets/images/Close.svg" alt="close" style="width:34px;height:34px;display:block"/>
      </button>
    `;

    const primaryBtn = `flex items-center justify-center rounded-full bg-[#e50012] text-white font-rubik font-semibold uppercase text-sm min-w-[10rem] py-2 px-5`;
    const secondaryBtn = `flex items-center justify-center rounded-full bg-white border-2 border-[#ED1C24] text-[#ED1C24] font-rubik font-semibold uppercase text-sm min-w-[10rem] py-2 px-5 transition`;

    let buttonsHTML = '';
    if (type === 'buy') {
      buttonsHTML = `
        <button class="${secondaryBtn}" id="modal-cancel">${t.cancelBtn}</button>
        <button class="${primaryBtn}" id="modal-confirm">${t.confirmBtn}</button>
      `;
    } else if (type === 'congrats') {
      buttonsHTML = `<button class="${secondaryBtn}" id="modal-close">${t.closeBtn}</button>`;
    } else if (type === 'credit') {
      buttonsHTML = `<button class="${primaryBtn}" id="modal-close">${t.okBtn}</button>`;
    }

    modalRoot.innerHTML = `
      <div class="fixed inset-0 z-[9999] flex items-center justify-center" style="background-color:#696969CC" ${dirAttribute}>
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

  observeTheme() {
    const updateIcons = () => {
      document.querySelectorAll('.bitdefender-plan-icon').forEach((img, idx) => {
        const plan = bitdefenderPlans[idx];
        img.src = this.getPlanIcon(plan);
      });
      document.querySelectorAll('.bitdefender-systems-icon').forEach((img, idx) => {
        const plan = bitdefenderPlans[idx];
        img.src = this.getSystemsIcon(plan);
      });
    };
    const observer = new MutationObserver(updateIcons);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  setupResizeObserver() {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        this.adjustCardLayout(width);
      }
    });
    resizeObserver.observe(this.container);
  }

  adjustCardLayout(width) {
    const cards = this.container.querySelectorAll('.relative.flex-col');
    cards.forEach(card => {
      if (width >= 2560) {
        card.style.minHeight = '700px';
      } else if (width >= 1920) {
        card.style.minHeight = '600px';
      } else {
        card.style.minHeight = '';
      }
    });
  }
}