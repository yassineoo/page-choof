import { todPackages, todDescription } from './TODServicesData.js';

// Enhanced styles following Dima pattern
const customCSS = `
.dima-card-border {
  box-shadow: -0.92px 7.34px 16.52px 0px #4F4F4F1A, -2.75px 29.37px 29.37px 0px #4F4F4F17;
  border: none;
}

.dark .dima-card-border {
  box-shadow: none;
  border: 1px solid #BBBEBE;
}

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
.acheter-button:active { 
  transform: translateY(0px); 
}

.tod-tab-shadow {
  box-shadow: 0 1.5px 7px 0 #ed1c2437;
}
`;

function renderLogoBlock({ logo, subLogo, id }) {
  const container = document.createElement('div');
  container.className = 'relative';
  container.style.width = '110px';
  container.style.height = '62px';
  container.style.flexShrink = '0';

  const tod = document.createElement('img');
  tod.src = logo;
  tod.alt = 'TOD';
  tod.style.position = 'absolute';
  tod.style.width = '77.28px';
  tod.style.height = '32.17px';
  tod.style.left = '3.78px';
  tod.style.top = '4.89px';
  tod.style.objectFit = 'contain';

  container.appendChild(tod);

  if (subLogo) {
    const sub = document.createElement('img');
    sub.src = subLogo;
    sub.alt = id === 'tod-4k' ? '4K' : 'Mobile';
    sub.style.position = 'absolute';
    if (id === 'tod-4k') {
      sub.style.width = '29px';
      sub.style.height = '19px';
      sub.style.left = '52px';
      sub.style.top = '38.11px';
    } else {
      sub.style.width = '58px';
      sub.style.height = '16px';
      sub.style.left = '24px';
      sub.style.top = '39.11px';
    }
    sub.style.objectFit = 'contain';
    container.appendChild(sub);
  }
  return container;
}

function renderTopCard(pkg, lang) {
  const topCard = document.createElement('div');
  topCard.className =
    "flex items-center justify-between w-[430px] h-[108px] bg-white dark:bg-[#2C2C2C] dima-card-border rounded-[15px] px-[24px] py-[24px]";

  const logoBlock = renderLogoBlock(pkg);

  const desc = document.createElement('div');
  desc.className = "font-rubik font-normal text-[14px] text-black dark:text-gray-200 leading-none";
  desc.innerHTML = lang === 'ar'
    ? pkg.description
    : pkg.description.replace(/<strong>(.*?)<\/strong>/g, `<strong class="font-semibold text-black dark:text-white">$1</strong>`);
  desc.style.lineHeight = "1";
  desc.style.verticalAlign = "middle";
  desc.style.letterSpacing = "0";
  desc.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
  desc.style.textAlign = lang === 'ar' ? 'right' : 'left';

  topCard.appendChild(logoBlock);
  topCard.appendChild(desc);
  return topCard;
}

function renderDownCard(pkg, currentDuration, onSwitch, onBuy, lang) {
  const curr = pkg.durations[currentDuration];
  const downCard = document.createElement('div');
  downCard.className =
    "w-[430px] flex flex-col items-center bg-white dark:bg-[#2C2C2C] dima-card-border rounded-[15px] pt-0 pb-[20px]";

  const titleBar = document.createElement('div');
  titleBar.className =
    "w-full bg-[#ED1C24] text-white font-rubik font-medium text-[25px] leading-[1] text-center capitalize py-[20px] rounded-t-[15px] tracking-wide";
  titleBar.innerText = pkg.title;
  downCard.appendChild(titleBar);

  // Tabs
  const tabs = document.createElement('div');
  tabs.className = "flex items-center w-[390px] h-[41px] gap-[8px] border border-[#ED1C24] rounded-full px-[10px] py-[7px] bg-white dark:bg-[#2C2C2C] mb-[10px] mt-6 shadow-sm";
  pkg.durations.forEach((d, i) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = [
      "rounded-full px-[15px] py-[5px] font-rubik text-[15px] flex-1 transition-all duration-150 font-normal ring-0",
      "shadow",
      i === currentDuration
        ? "bg-[#ED1C24] text-white tod-tab-shadow"
        : "bg-white dark:bg-[#2C2C2C] text-black dark:text-white"
    ].join(" ");
    tab.innerText = d.months;
    tab.onclick = () => onSwitch(i);
    tabs.appendChild(tab);
  });
  downCard.appendChild(tabs);

  // Options
  const optsUL = document.createElement("ul");
  optsUL.className = "flex flex-col gap-y-[9px] w-full px-2 mt-2";
  curr.options.forEach(opt => {
    const li = document.createElement("li");
    li.className = "flex items-center font-rubik text-[15px] font-normal text-[#191919] dark:text-gray-200";
    li.innerHTML =
      `<img src="/assets/images/dima/checkbox.svg" alt="" class="w-[19px] h-[19px] mr-2" /><span>${opt}</span>`;
    optsUL.appendChild(li);
  });
  downCard.appendChild(optsUL);

  // Dima-style Divider
  const dash = document.createElement('div');
  dash.className = "dima-divider w-[97%]";
  downCard.appendChild(dash);

  // Price
  const priceRow = document.createElement('div');
  priceRow.className = "flex items-baseline justify-center gap-[10px]";
  priceRow.innerHTML = `
    <span class="font-bold font-rubik text-[clamp(1.5rem,2vw,2.25rem)] dark:text-white">${curr.price}</span>
    <span class="font-rubik text-[1.09em] text-[#6c6c6c] dark:text-gray-300">${lang === 'ar' ? 'دج/' : 'DA /'}${curr.months}</span>
  `;
  downCard.appendChild(priceRow);

  // Button
  const buyBtn = document.createElement('button');
  buyBtn.className = "acheter-button mt-1";
  buyBtn.innerText = lang === 'ar' ? "شراء" : "ACHETER";
  buyBtn.onclick = () => onBuy();
  downCard.appendChild(buyBtn);

  return downCard;
}

function TODCard({ packageData, lang, onBuyClick }) {
  let currentDuration = 0;
  const card = document.createElement('div');
  card.className = "flex flex-col items-center w-[430px] gap-[4px]";

  const topCard = renderTopCard(packageData, lang);
  card.appendChild(topCard);

  function refreshDownCard() {
    if (card.downCard) card.removeChild(card.downCard);
    card.downCard = renderDownCard(
      packageData,
      currentDuration,
      idx => { currentDuration = idx; refreshDownCard(); },
      () => onBuyClick({ package: packageData, duration: packageData.durations[currentDuration] }),
      lang
    );
    card.appendChild(card.downCard);
  }
  refreshDownCard();

  return card;
}

export default class TODServices {
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

    this.render();
  }

  // Inject enhanced styles
  injectStyles() {
    if (!document.getElementById('tod-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'tod-styles';
      styleEl.textContent = customCSS;
      document.head.appendChild(styleEl);
    }
  }

  getLang() {
    const stored = localStorage.getItem('language');
    return ['fr', 'ar'].includes(stored) ? stored : 'fr';
  }

  render() {
    const lang = this.getLang();
    const pkgs = todPackages[lang];
    const isArabic = lang === 'ar';

    this.container.innerHTML = `
      <div class="w-full bg-[#F8F8F8] dark:bg-[#2C2C2C] px-5 py-8" ${isArabic ? 'dir="rtl"' : ''}>
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="font-rubik font-medium text-3xl md:text-4xl tracking-wide uppercase text-center text-black dark:text-white">
              ${isArabic ? 'اشتراكات TOD' : 'FORFAITS TOD'}
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center w-full" id="tod-packages-grid"></div>
          <div id="tod-modal-hook"></div>
        </div>
      </div>
    `;

    const packageGrid = this.container.querySelector('#tod-packages-grid');
    pkgs.forEach(pkg => {
      const card = TODCard({
        packageData: pkg,
        lang,
        onBuyClick: selection => this.handleBuyClick(selection, lang)
      });
      packageGrid.appendChild(card);
    });
  }

  handleBuyClick(selection, lang) {
    const isArabic = lang === 'ar';
    const confirmMsg = isArabic
      ? `اشتر الآن باقة ${selection.package.type} + ${selection.duration.giga}Go، ${selection.duration.price} دج / ${selection.duration.months}.`
      : `Obtenez un accès à ${selection.package.type} + ${selection.duration.giga}Go pour ${selection.duration.price} DA / ${selection.duration.months}.`;
    const congratsMsg = isArabic
      ? `لقد قمت بتفعيل باقة ${selection.package.type} + ${selection.duration.giga}Go بنجاح. <a href="${selection.duration.link}" target="_blank" class="text-blue-500 underline">اضغط هنا</a>`
      : `Vous avez activé votre forfait ${selection.package.type} + ${selection.duration.giga}Go avec succès. <a href="${selection.duration.link}" target="_blank" class="text-blue-500 underline">Cliquez ici</a>`;
    const noCreditMsg = isArabic
      ? `رصيدك غير كافٍ لشراء باقة ${selection.package.type}. يرجى إعادة الشحن.`
      : `Votre crédit est insuffisant pour acheter ${selection.package.type}. Veuillez recharger.`;

    this.showModal('buy', selection.package.title, confirmMsg, () => {
      const noCredit = false;
      if (noCredit) {
        this.showModal('credit', isArabic ? 'معلومات' : 'Information', noCreditMsg);
      } else {
        this.showModal('congrats', isArabic ? 'تهانينا!' : 'Félicitations !', congratsMsg);
      }
    }, isArabic);
  }

  showModal(type, title, message, onConfirm, isArabic = false) {
    const hook = this.container.querySelector('#tod-modal-hook');
    hook.innerHTML = '';

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

    const primaryBtn = `flex items-center justify-center rounded-full bg-[#e50012] text-white font-rubik font-semibold uppercase text-sm min-w-[10rem] py-2 px-5`;
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

    hook.innerHTML = `
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

    const closeModal = () => { hook.innerHTML = ''; };
    hook.querySelector('button[aria-label="Fermer"]').onclick = closeModal;

    if (type === 'buy') {
      hook.querySelector('#modal-cancel').onclick = closeModal;
      hook.querySelector('#modal-confirm').onclick = () => {
        closeModal();
        if (onConfirm) onConfirm();
      };
    } else {
      hook.querySelector('#modal-close').onclick = closeModal;
    }

    hook.querySelector('.fixed').onclick = e => {
      if (e.target.classList.contains('fixed')) closeModal();
    };
  }
}