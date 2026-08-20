const offers = [
  {
    name: { fr: "OOREDOO 500", ar: "OOREDOO 500" },
    topLabel: null,
    sub: "9",
    free: "3",
    data: "5",
    price: "500",
    priceX6: "2500",
    priceX9: "3500",
    priceX12: "4500",
    oldPriceX6: "3000",
    oldPriceX9: "4500",
    oldPriceX12: "6000",
    duration: { fr: "4 semaines", ar: "4 أسابيع" },
    features: {
      fr: ["Appels illimités vers Ooredoo", "500 DA de crédit"],
      ar: ["مكالمات غير محدودة نحو Ooredoo", "500 دج رصيد"],
    },
  },
  {
    name: { fr: "OOREDOO 1000", ar: "OOREDOO 1000" },
    topLabel: null,
    sub: "9",
    free: "3",
    data: "15",
    price: "1000",
    priceX6: "5000",
    priceX9: "7000",
    priceX12: "9000",
    oldPriceX6: "6000",
    oldPriceX9: "9000",
    oldPriceX12: "12000",
    duration: { fr: "4 semaines", ar: "4 أسابيع" },
    features: {
      fr: ["Appels illimités vers Ooredoo", "2000 DA de crédit"],
      ar: ["مكالمات غير محدودة نحو Ooredoo", "2000 دج رصيد"],
    },
  },
  {
    name: { fr: "OOREDOO 1500", ar: "OOREDOO 1500" },
    topLabel: null,
    sub: "9",
    free: "3",
    data: "40",
    price: "1500",
    priceX6: "7500",
    priceX9: "10500", 
    priceX12: "13500",
    oldPriceX6: "9000",
    oldPriceX9: "13500",
    oldPriceX12: "18000",
    duration: { fr: "4 semaines", ar: "4 أسابيع" },
    features: {
      fr: ["Appels illimités vers Ooredoo", "3000 DA de crédit"],
      ar: ["مكالمات غير محدودة نحو Ooredoo", "3000 دج رصيد"],
    },
  },
  {
    name: { fr: "OOREDOO 2000", ar: "OOREDOO 2000" },
    topLabel: null,
    sub: "9",
    free: "3",
    data: "70",
    price: "2000",
    priceX6: "10000",
    priceX9: "14000",
    priceX12: "18000",
    oldPriceX6: "12000",
    oldPriceX9: "18000",
    oldPriceX12: "24000",
    duration: { fr: "4 semaines", ar: "4 أسابيع" },
    features: {
      fr: ["Appels illimités vers tous les réseaux", "SMS illimités vers Ooredoo", "50 SMS vers les autres réseaux"],
      ar: ["مكالمات غير محدودة نحو كل الشبكات", "رسائل غير محدودة نحو Ooredoo", "50 رسالة نحو الشبكات الأخرى"],
    },
  },
  {
    name: { fr: "OOREDOO 2500", ar: "OOREDOO 2500" },
    topLabel: null,
    sub: "9",
    free: "3",
    data: "100",
    price: "2500",
    priceX6: "12500",
    priceX9: "17500",
    priceX12: "22500",
    oldPriceX6: "15000",
    oldPriceX9: "22500",
    oldPriceX12: "30000",
    duration: { fr: "30 jours", ar: "30 يومًا" },
    features: {
      fr: ["Appels illimités vers tous les réseaux", "SMS illimités vers tous les réseaux"],
      ar: ["مكالمات غير محدودة نحو كل الشبكات", "رسائل غير محدودة نحو كل الشبكات"],
    },
  },
  {
    name: { fr: "OOREDOO 4000", ar: "OOREDOO 4000" },
    topLabel: null,
    sub: "9",
    free: "3",
    data: "200",
    price: "4000",
    priceX6: "20000",
    priceX9: "28000",
    priceX12: "36000",
    oldPriceX6: "24000",
    oldPriceX9: "36000",
    oldPriceX12: "48000",
    duration: { fr: "30 jours", ar: "30 يومًا" },
    features: {
      fr: ["Appels illimités vers tous les réseaux", "SMS illimités vers tous les réseaux"],
      ar: ["مكالمات غير محدودة نحو كل الشبكات", "رسائل غير محدودة نحو كل الشبكات"],
    },
  },
  {
    name: { fr: "OOREDOO 4990", ar: "OOREDOO 4990" },
    topLabel: { fr: "Gardez votre SIM toute l’année", ar: "احتفظوا بشريحة SIM طوال السنة" },
    sub: "7",
    free: "2",
    data: "200",
    price: "4990",
    oldPrice: "4500",
    duration: { fr: "30 jours", ar: "30 يومًا" },
    features: {
      fr: ["Appels illimités vers Ooredoo", "500 DA de crédit"],
      ar: ["مكالمات غير محدودة نحو Ooredoo", "500 دج رصيد"],
    },
  },
];

const content = {
  fr: {
    title: "FORFAITS OOREDOO",
    subtitle: "",
  },
  ar: {
    title: "اشتراكات OOREDOO",
    subtitle: "",
  },
};

const titleEl = document.querySelector("[data-title]");
const subtitleEl = document.querySelector("[data-subtitle]");
const desktopGrid = document.querySelector("[data-cards-desktop]");
const mobileGrid = document.querySelector("[data-cards-mobile]");
const langButtons = Array.from(document.querySelectorAll(".lang-btn"));

const state = {
  lang: detectLanguage(),
};

function detectLanguage() {
  const saved = localStorage.getItem("ooredoo-section-lang");
  if (saved === "fr" || saved === "ar") {
    return saved;
  }

  const browserLang = navigator.language?.toLowerCase() || "fr";
  return browserLang.startsWith("ar") ? "ar" : "fr";
}

function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem("ooredoo-section-lang", lang);
  render();
}

function checkIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#ED1C24"/>
      <path d="M6.58997 4.55566C6.58997 4.00338 7.03768 3.55566 7.58997 3.55566H8.18997C8.74225 3.55566 9.18997 4.00338 9.18997 4.55566V11.2223C9.18997 11.7746 8.74225 12.2223 8.18997 12.2223H7.58997C7.03768 12.2223 6.58997 11.7746 6.58997 11.2223V4.55566Z" fill="white"/>
      <path d="M3.55591 7.58887C3.55591 7.03658 4.00362 6.58887 4.55591 6.58887H11.2226C11.7749 6.58887 12.2226 7.03658 12.2226 7.58887V8.18887C12.2226 8.74115 11.7749 9.18887 11.2226 9.18887H4.55591C4.00362 9.18887 3.55591 8.74115 3.55591 8.18887V7.58887Z" fill="white"/>
    </svg>
  `;
}

function packInfo(pack) {
  if (pack === "X9") return { paid: "7", given: "9", free: "2" };
  if (pack === "X12") return { paid: "9", given: "12", free: "3" };
  return { paid: "5", given: "6", free: "1" };
}

function render() {
  const locale = content[state.lang];

  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("is-rtl", state.lang === "ar");

  titleEl.textContent = locale.title;
  subtitleEl.textContent = locale.subtitle;
  subtitleEl.style.display = locale.subtitle ? "block" : "none";

  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === state.lang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  const cardsMarkup = offers.map((offer, index) => renderOfferCard(offer, state.lang, index)).join("");
  desktopGrid.innerHTML = cardsMarkup;
  mobileGrid.innerHTML = cardsMarkup;

  initSliderDots(); 
}

function renderOfferCard(offer, lang, index) {
  const isArabic = lang === "ar";
  const fontClass = isArabic ? "font-noto-kufi-arabic" : "font-rubik";
  const isLastCard = index === offers.length - 1;
  const showModeTabs = !isLastCard;
  const showRenewalNoteInOoredoo = index === offers.length - 1;
  const topLabel = offer.topLabel
    ? `<div class="ooredoo-top-label"><span class="font-rubik">${offer.topLabel[lang]}</span></div>`
    : `<div class="ooredoo-top-label ooredoo-top-label--empty" aria-hidden="true"></div>`;

  const features = offer.features[lang]
    .map((feature) => `
      <div class="ooredoo-feature-item">
        <span class="ooredoo-check-icon">${checkIcon()}</span>
        <span style="font-size: 20px;">${feature}</span>
      </div>
    `)
    .join("");

  return `
    <article
      class="ooredoo-card"
      data-ooredoo-card
      data-active-mode="ooredoo"
      data-base-offer-name="${offer.name[lang]}"
      data-current-tab="X6"
      data-old-price-x6="${offer.oldPriceX6}"
      data-old-price-x9="${offer.oldPriceX9}"
      data-old-price-x12="${offer.oldPriceX12}"
      data-price-x6="${offer.priceX6}"
      data-price-x9="${offer.priceX9}"
      data-price-x12="${offer.priceX12}"
    >
      ${showModeTabs ? `
      <div class="ooredoo-mode-tabs" role="tablist" aria-label="${isArabic ? "خيارات الباقة" : "Pack options"}">
        <button type="button" class="ooredoo-mode-btn is-active ${fontClass}" data-card-mode="ooredoo">Ooredoo</button>
        <button type="button" class="ooredoo-mode-btn ${fontClass}" data-card-mode="forfait" data-card-pack="X6" data-card-free-count="1">X6</button>
        <button type="button" class="ooredoo-mode-btn ${fontClass}" data-card-mode="forfait" data-card-pack="X9" data-card-free-count="2">X9</button>
        <button type="button" class="ooredoo-mode-btn ${fontClass}" data-card-mode="forfait" data-card-pack="X12" data-card-free-count="3">X12</button>
      </div>
      ` : ""}

      ${topLabel}

      <div data-card-view="ooredoo" class="card-view">
        <div class="ooredoo-card-header">
          <h2 class="ooredoo-card-title ${fontClass}">
            <span data-card-title>${offer.name[lang]}</span>   
          </h2>
        
        </div>

        <div class="ooredoo-card-body ${isArabic ? "is-rtl" : ""}">
          <div class="ooredoo-main-data ${fontClass}">
            <span class="ooredoo-main-value">${offer.data}</span>
            <span class="ooredoo-main-unit">Go</span>
            <span class="ooredoo-main-caption">${isArabic ? "إنترنت" : "internet"}</span>
          </div>

          <div class="ooredoo-feature-list">${features}</div>

          <div class="ooredoo-meta-row">
            <div class="ooredoo-meta-copy">
              <p class="ooredoo-meta-label ${fontClass}">${index === offers.length - 1 ? "Recevez" : isArabic ? "المدة" : "Valables"}</p>
              <p class="ooredoo-meta-value ${fontClass}">${index === offers.length - 1 ? "11 forfaits" : offer.duration[lang]}</p>
            </div>
            <div class="ooredoo-price-box">
              <span class="ooredoo-old-price font-rubik" data-card-old-price></span>
              <span class="ooredoo-new-price font-rubik">
                <span data-card-price>${offer.price}</span> 
                <span class="ooredoo-currency ${fontClass}">${isArabic ? "دج" : "DA"}</span>
              </span>
            </div>
          </div>

          <p class="ooredoo-renewal-note ${fontClass}${showRenewalNoteInOoredoo ? "" : " is-placeholder"}">${showRenewalNoteInOoredoo ? (isArabic ? "يتم تجديد اشتراك Ooredoo تلقائيًا كل 4 أسابيع" : "Forfait renouvelable automatiquement chaque 4 semaines") : ""}</p>
        </div>
      </div>

      ${showModeTabs ? `
      <div data-card-view="forfait" class="card-view is-hidden">
        <div class="ooredoo-card-header">
<h2 class="ooredoo-card-title ${fontClass}">
  <span data-card-title dir="ltr">${offer.name[lang]}</span>
</h2>        </div>

        <div class="ooredoo-card-body ${isArabic ? "is-rtl" : ""}">
          <div class="ooredoo-forfait-copy ${fontClass}">
            <p>${isArabic ? "قوموا بشراء" : "Payez"}</p>
            <p class="ooredoo-forfait-accent"><span data-card-paid-count>5</span> ${isArabic ? "اشتراكات" : "forfaits"}</p>
            <p class="ooredoo-base-name" data-card-base-name>${offer.name[lang].toLowerCase()}</p>
            <p>${isArabic ? "و" : "&"}</p>
            <p>${isArabic ? "احصلوا على" : "obtenez"}</p>
            <p class="ooredoo-forfait-accent">
              <span data-card-free-summary-count>1</span>
              <span data-card-free-text>
                ${isArabic ? "اشتراك مجانًا!" : "gratuit !"}
              </span>
            </p>
          </div>

          <div class="ooredoo-forfait-grid">
            <div>
              <p class="ooredoo-meta-label ${fontClass}">${isArabic ? "استفيدوا من" : "Recevez"}</p>
              <p class="ooredoo-meta-value ${fontClass}"><span data-card-given>6</span> ${isArabic ? "اشتراكات" : "forfaits"}</p>
            </div>
            <div class="ooredoo-price-box">
              <span class="ooredoo-old-price font-rubik" data-card-old-price></span>              
              <span class="ooredoo-new-price font-rubik">
                <span data-card-price>${offer.priceX6}</span> 
                <span class="ooredoo-currency ${fontClass}">${isArabic ? "دج" : "DA"}</span></span>
            </div>
          </div>

          <p class="ooredoo-renewal-note ${fontClass}">${isArabic ? "يتم تجديد اشتراك Ooredoo تلقائيًا كل 4 أسابيع" : "Forfait renouvelable automatiquement chaque 4 semaines"}</p>
        </div>
      </div>
      ` : ""}
    </article>
  `;
}

function updateCardMode(card, modeButton) {
  const nextMode =
    modeButton.dataset.cardMode === "forfait" ? "forfait" : "ooredoo";

  const selectedPack = modeButton.dataset.cardPack || "X6";
  const packState = packInfo(selectedPack);

  card.dataset.activeMode = nextMode;
  card.dataset.currentTab = selectedPack;

  // Active button
  card.querySelectorAll(".ooredoo-mode-btn").forEach((btn) => {
    const active = btn === modeButton;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });

  // Card title
  const baseName = card.dataset.baseOfferName;

  card.querySelectorAll("[data-card-title]").forEach((el) => {
    el.textContent =
      nextMode === "forfait"
        ? `${baseName} ${selectedPack}`
        : baseName;
  });

  // Switch views
  const ooredooView = card.querySelector('[data-card-view="ooredoo"]');
  const forfaitView = card.querySelector('[data-card-view="forfait"]');

  if (ooredooView) {
    ooredooView.classList.toggle("is-hidden", nextMode !== "ooredoo");
  }

  if (forfaitView) {
    forfaitView.classList.toggle("is-hidden", nextMode !== "forfait");
  }

  // Update forfait values
  const paidElement = card.querySelector("[data-card-paid-count]");
  const givenElement = card.querySelector("[data-card-given]");
  const freeSummaryCountElement = card.querySelector("[data-card-free-summary-count]");
  const freeTextElement = card.querySelector("[data-card-free-text]");

  if (paidElement) paidElement.textContent = packState.paid;
  if (givenElement) givenElement.textContent = packState.given;
  if (freeSummaryCountElement) {
    freeSummaryCountElement.textContent = packState.free;
  }

  if (freeTextElement) {
    const freeCount = Number(packState.free);

    if (state.lang === "ar") {
      switch (freeCount) {
        case 1:
          freeTextElement.textContent = "اشتراك مجانًا!";
          break;
        case 2:
          freeTextElement.textContent = "اشتراكين مجانًا!";
          break;
        case 3:
          freeTextElement.textContent = "اشتراكات مجانًا!";
          break;
        default:
          freeTextElement.textContent = "اشتراك مجانًا!";
      }
    } else {
      freeTextElement.textContent =
        freeCount === 1 ? "gratuit !" : "gratuits !";
    }
  }

  // ===== Update prices =====

  const newPrices = {
    X6: card.dataset.priceX6,
    X9: card.dataset.priceX9,
    X12: card.dataset.priceX12,
  };

  const oldPrices = {
    X6: card.dataset.oldPriceX6,
    X9: card.dataset.oldPriceX9,
    X12: card.dataset.oldPriceX12,
  };

  const newPriceElement = card.querySelector(
    '[data-card-view="forfait"] [data-card-price]'
  );

  const oldPriceElement = card.querySelector(
    '[data-card-view="forfait"] [data-card-old-price]'
  );

  if (newPriceElement) {
    newPriceElement.textContent = newPrices[selectedPack] || "";
  }

  if (oldPriceElement) {
    oldPriceElement.textContent = oldPrices[selectedPack] || "";
  }
}

function initSliderDots() {
    const slider = document.querySelector("[data-cards-mobile]");
    const dotsContainer = document.querySelector("[data-slider-dots]");

    if (!slider || !dotsContainer) return;

    const cards = slider.querySelectorAll(".ooredoo-card");

    dotsContainer.innerHTML = "";

    cards.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.className = "slider-dot";
        if (index === 0) dot.classList.add("active");

        dot.addEventListener("click", () => {
            slider.scrollTo({
                left: slider.clientWidth * index,
                behavior: "smooth"
            });
        });

        dotsContainer.appendChild(dot);
    });

    function updateDots() {
        const index = Math.round(slider.scrollLeft / slider.clientWidth);

        dotsContainer.querySelectorAll(".slider-dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    }

    slider.addEventListener("scroll", updateDots);

    updateDots();
}   

langButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

document.addEventListener("click", (event) => {
  const modeButton = event.target.closest(".ooredoo-mode-btn");
  if (!modeButton) return;

  const card = modeButton.closest("[data-ooredoo-card]");
  if (!card) return;

  updateCardMode(card, modeButton);
});

render();