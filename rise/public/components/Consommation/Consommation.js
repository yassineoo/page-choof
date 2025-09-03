import { consommationData } from "./ConsommationData.js";

export default class Consommation {
  constructor(container) {
    if (!container) return;
    this.container = container;
    this.state = {
      showAllCards: false,
      expandedCards: new Set(),
      currentLang: this.getLang(),
      currentTheme: this.getTheme(),
      isAnimating: false,
      maxCardHeight: 0,
      allExpandedPair: false,
      lastIsMobile: this.isMobile(),
    };
    this.config = {
      IMAGE_BASE: "./assets/images/consommation/",
      PUBLIC_IMAGE_BASE: "./assets/images/consommation/",
      DARK_ICONS: ["dollar-phone", "infini", "internet", "rocket", "services", "sms", "telephone", "phone"],
      MAX_SECTIONS_BEFORE_EXPAND: 4,
      EXPANDABLE_INDICES: new Set([2, 3]),
    };

    this.cache = {
      renderedSections: new Map(),
      renderedCards: new Map(),
      iconPaths: new Map(),
      layoutCache: new Map(),
    };

    this.init();
  }

  init() {
    if (!consommationData?.fr || !consommationData?.ar) return;
    this.setupWatchers();
    this.setupEventDelegation();
    this.render();
  }

  setupEventDelegation() {
    this.container.addEventListener("click", (e) => {
      const chevronButton = e.target.closest(".card-chevron");
      if (chevronButton) {
        e.preventDefault();
        e.stopPropagation();
        const idx = Number.parseInt(chevronButton.getAttribute("data-card-index"));
        if (!isNaN(idx) && this.config.EXPANDABLE_INDICES.has(idx)) {
          this.togglePairExpand();
        }
        return;
      }

      const showAllBtn = e.target.closest(".show-all-btn");
      if (showAllBtn) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleShowAll();
        return;
      }
    });
  }

  setupWatchers() {
    this.unbindEvents();

    this.boundHandleLanguageChange = this.handleLanguageChange.bind(this);
    window.addEventListener("languageChanged", this.boundHandleLanguageChange);

    this.langPoller = setInterval(this.checkLanguageChange.bind(this), 200);

    this.boundStorageListener = (e) => {
      if (e.key === "language" || e.key === "theme") {
        this.handleLanguageChange();
      }
    };
    window.addEventListener("storage", this.boundStorageListener);

    let resizeTimeout;
    this.boundResizeHandler = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleLanguageChange();
      }, 100);
    };
    window.addEventListener("resize", this.boundResizeHandler);
  }

  unbindEvents() {
    if (this.boundHandleLanguageChange) {
      window.removeEventListener("languageChanged", this.boundHandleLanguageChange);
    }
    if (this.boundStorageListener) {
      window.removeEventListener("storage", this.boundStorageListener);
    }
    if (this.boundResizeHandler) {
      window.removeEventListener("resize", this.boundResizeHandler);
    }
    if (this.langPoller) {
      clearInterval(this.langPoller);
      this.langPoller = null;
    }
  }

  handleLanguageChange() {
    const newLang = this.getLang();
    const newTheme = this.getTheme();
    const newIsMobile = this.isMobile();

    if (newLang !== this.state.currentLang || newTheme !== this.state.currentTheme || newIsMobile !== this.state.lastIsMobile) {
      console.log(
        `Consommation: Language/Theme/Layout changed from ${this.state.currentLang}/${this.state.currentTheme}/${this.state.lastIsMobile} to ${newLang}/${newTheme}/${newIsMobile}`
      );

      this.state.currentLang = newLang;
      this.state.currentTheme = newTheme;
      this.state.lastIsMobile = newIsMobile;

      // Reset mobile-specific state when switching layouts
      if (this.state.lastIsMobile !== newIsMobile) {
        this.state.showAllCards = false;
        this.state.allExpandedPair = false;
        this.state.expandedCards.clear();
      }

      this.clearCache();
      this.render();
    }
  }

  checkLanguageChange() {
    this.handleLanguageChange();
  }

  clearCache() {
    this.cache.renderedSections.clear();
    this.cache.renderedCards.clear();
    this.cache.layoutCache.clear();
  }

  getLang() {
    try {
      const lang = localStorage.getItem("language");
      return ["fr", "ar"].includes(lang) ? lang : "fr";
    } catch {
      return "fr";
    }
  }

  getTheme() {
    try {
      const theme = localStorage.getItem("theme");
      return theme === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  }

  isMobile() {
    return window.innerWidth < 768;
  }

  resolveIcon(name, theme) {
    if (!name) return "";

    const cacheKey = `${name}-${theme}`;
    if (this.cache.iconPaths.has(cacheKey)) {
      return this.cache.iconPaths.get(cacheKey);
    }

    const n = name.toLowerCase();
    let iconPath = "";

    if (n === "messenger") {
      iconPath = `${this.config.IMAGE_BASE}messenger.svg`;
    } else if (this.config.DARK_ICONS.includes(n)) {
      iconPath = theme === "dark" ? `${this.config.IMAGE_BASE}dark/${n}-white.svg` : `${this.config.IMAGE_BASE}light/${n}.svg`;
    } else {
      iconPath = `${this.config.IMAGE_BASE}${n}.svg`;
    }

    this.cache.iconPaths.set(cacheKey, iconPath);
    return iconPath;
  }

  resolveSubIcon(name, theme) {
    return Array.isArray(name) ? name.map((n) => this.resolveIcon(n, theme)) : this.resolveIcon(name, theme);
  }

  resolveChevronIcon(theme) {
    return `${this.config.IMAGE_BASE}chevron-down.svg`;
  }

  calculateMaxCardHeight() {
    if (this.isMobile()) return;

    requestAnimationFrame(() => {
      const cards = this.container.querySelectorAll(".card[data-card-index]");
      let maxHeight = 0;

      cards.forEach((card) => {
        card.style.height = "auto";
      });

      cards.forEach((card) => {
        const height = card.offsetHeight;
        if (height > maxHeight) {
          maxHeight = height;
        }
      });

      if (maxHeight > 0) {
        cards.forEach((card) => {
          card.style.height = `${maxHeight}px`;
        });
        this.state.maxCardHeight = maxHeight;
      }
    });
  }

  togglePairExpand() {
    this.state.allExpandedPair = !this.state.allExpandedPair;

    this.state.expandedCards.clear();
    if (this.state.allExpandedPair) {
      this.config.EXPANDABLE_INDICES.forEach((i) => this.state.expandedCards.add(i));
    }

    this.clearCache();

    this.config.EXPANDABLE_INDICES.forEach((idx) => {
      const cardEl = this.container.querySelector(`.card[data-card-index="${idx}"]`);
      if (!cardEl) return;

      const rotator = cardEl.querySelector(".card-chevron .chevron-rotator");
      if (rotator) {
        rotator.classList.toggle("rotate-180", this.state.allExpandedPair);
        rotator.classList.toggle("rotate-0", !this.state.allExpandedPair);
      }

      const btn = cardEl.querySelector(".card-chevron");
      if (btn) {
        btn.setAttribute("aria-expanded", this.state.allExpandedPair ? "true" : "false");
      }

      this.renderCardContent(idx);
    });

    if (!this.isMobile()) {
      setTimeout(() => this.calculateMaxCardHeight(), 50);
    }
  }

  async toggleShowAll() {
    if (this.state.isAnimating) return;
    this.state.isAnimating = true;
    this.state.showAllCards = !this.state.showAllCards;
    if (this.isMobile()) {
      await this.animateMobileCardsReveal();
    } else {
      this.render();
    }
    this.state.isAnimating = false;
  }

  async animateMobileCardsReveal() {
    const { currentLang, currentTheme } = this.state;
    const data = consommationData[currentLang];
    const button = this.container.querySelector(".show-all-btn");
    const cardsContainer = this.container.querySelector(".cards-container");

    if (this.state.showAllCards) {
      this.updateButtonText(button, currentLang, true);
      const remainingCards = data.cards
        .slice(1)
        .map((card, index) => this.renderMobileCard(card, index + 1, currentLang, currentTheme, false, this.state.allExpandedPair))
        .join("");

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = remainingCards;
      const cards = Array.from(tempDiv.children);

      cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
        cardsContainer.appendChild(card);

        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, index * 100 + 100);
      });
    } else {
      this.updateButtonText(button, currentLang, false);
      const additionalCards = cardsContainer.querySelectorAll('[data-card-index]:not([data-card-index="0"])');

      additionalCards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = "0";
          card.style.transform = "translateY(-20px)";
          setTimeout(() => {
            if (card.parentNode) {
              card.remove();
            }
          }, 300);
        }, index * 50);
      });
    }
  }

  updateButtonText(button, lang, showingAll) {
    if (!button) return;
    const buttonText = showingAll ? (lang === "ar" ? "إخفاء التفاصيل" : "MASQUER DÉTAILS") : lang === "ar" ? "عرض التفاصيل" : "VOIR DÉTAILS";
    const span = button.querySelector("span");
    if (span) {
      span.style.opacity = "0";
      setTimeout(() => {
        span.textContent = buttonText;
        span.style.opacity = "1";
      }, 150);
    }
  }

  isCardExpanded(cardIndex) {
    return this.config.EXPANDABLE_INDICES.has(cardIndex) ? this.state.allExpandedPair : false;
  }

  getCardSections(card, isExpanded) {
    const sections = card.sections || [];
    return !isExpanded && sections.length > this.config.MAX_SECTIONS_BEFORE_EXPAND
      ? sections.slice(0, this.config.MAX_SECTIONS_BEFORE_EXPAND)
      : sections;
  }

  hasExpandableContent(card) {
    return card.sections && card.sections.length > this.config.MAX_SECTIONS_BEFORE_EXPAND;
  }

  getVisibleCards() {
    const { currentLang } = this.state;
    const data = consommationData[currentLang];
    if (!data?.cards) return [];
    if (this.isMobile() && !this.state.showAllCards) {
      return [{ card: data.cards[0], originalIndex: 0 }];
    }
    return data.cards.map((card, index) => ({ card, originalIndex: index }));
  }

  render() {
    if (!this.container) return;
    const { currentLang, currentTheme } = this.state;
    const data = consommationData[currentLang];
    if (!data?.cards) {
      this.container.innerHTML = "";
      return;
    }

    const layoutCacheKey = `layout-${currentLang}-${currentTheme}-${this.isMobile()}-${this.state.showAllCards}-${this.state.allExpandedPair}`;
    if (this.cache.layoutCache.has(layoutCacheKey)) {
      this.container.innerHTML = this.cache.layoutCache.get(layoutCacheKey);
      if (!this.isMobile()) {
        this.calculateMaxCardHeight();
      }
      return;
    }

    const renderedLayout = this.isMobile()
      ? this.renderMobileLayout(data, currentTheme, currentLang)
      : this.renderDesktopLayout(data, currentTheme, currentLang);

    this.cache.layoutCache.set(layoutCacheKey, renderedLayout);
    this.container.innerHTML = renderedLayout;

    if (!this.isMobile()) {
      this.calculateMaxCardHeight();
    }
  }

  renderMobileLayout(data, theme, lang) {
    const bgClass = theme === "dark" ? "bg-[#141414]" : "bg-white";
    const fontClass = lang === "ar" ? "font-noto-kufi-arabic" : "font-rubik";

    return `
      <div class="w-full flex flex-col ${bgClass} ${fontClass}" ${lang === "ar" ? 'dir="rtl"' : ""}>
        <div class="bg-[#141B4D] w-full px-6 pt-2 pb-14 -my-7"> 
          <h1 class="text-white text-2xl leading-[170%] tracking-[2%] text-center py-4" style="font-weight: 500; font-size: 24px;">
            ${data.title}
          </h1>
        </div>
        <div class="w-full px-4 -mt-7">
          <div class="cards-container flex flex-col gap-6 max-w-full mx-auto">
            ${this.renderMobileCard(data.cards[0], 0, lang, theme, true, this.isCardExpanded(0))}
            ${
              this.state.showAllCards
                ? data.cards
                    .slice(1)
                    .map((card, index) => this.renderMobileCard(card, index + 1, lang, theme, false, this.isCardExpanded(index + 1)))
                    .join("")
                : ""
            }
          </div>
          <div class="mb-6"> <!-- Added margin-bottom to the button wrapper -->
            ${this.renderMobileButton(lang, theme)}
          </div>
        </div>
      </div>
    `;
  }

  renderMobileButton(lang, theme) {
    const buttonText = this.state.showAllCards
      ? lang === "ar"
        ? "إخفاء التفاصيل"
        : "MASQUER DÉTAILS"
      : lang === "ar"
      ? "عرض التفاصيل"
      : "VOIR DÉTAILS";
    const fontClass = lang === "ar" ? "font-noto-kufi-arabic" : "font-rubik";

    return `
      <div class="w-full flex justify-end mt-4 mb-2 px-2 ${fontClass}">
        <button class="show-all-btn bg-ooredoo-red text-white font-medium text-sm uppercase rounded-full px-8 py-3 flex items-center justify-center gap-2 w-3/5 max-w-[200px]" style="font-weight: 500;">
          <span>${buttonText}</span>
        </button>
      </div>
    `;
  }

  renderMobileCard(card, cardIndex, lang, theme, isFirst = false, expanded = false) {
    if (!card) return "";

    const cacheKey = `mcard-${cardIndex}-${lang}-${theme}-${isFirst}-${expanded}-${this.isCardExpanded(cardIndex)}`;
    if (this.cache.renderedCards.has(cacheKey)) {
      return this.cache.renderedCards.get(cacheKey);
    }

    const sections = card.sections || [];
    const borderRadius = "rounded-[22px]";
    const bgClass = theme === "dark" ? "bg-[#141414]" : "bg-white";
    const borderClass = theme === "dark" ? "border border-[#3F3F3F]" : "border border-[#CDCDCD]";
    const textClass = theme === "dark" ? "text-white" : "text-[#2A2A2A]";
    const fontClass = lang === "ar" ? "font-noto-kufi-arabic" : "font-rubik";
    const shadowClass = theme === "dark" ? "" : "shadow-[-0.87px_6.94px_15.61px_0px_#4F4F4F1A]";

    const renderedCard = `
      <div class="card ${bgClass} ${borderRadius} ${borderClass} w-full max-w-full relative transition-all duration-500 flex flex-col ${shadowClass} ${fontClass}" data-card-index="${cardIndex}" style="min-height: 400px;">
        <div class="px-6 py-3 flex flex-col flex-1">
          <div class="flex items-center gap-3 mb-4 pb-3" style="border-bottom: 0.87px solid #F4F4F4;">
            <div class="flex items-center justify-center">
              <img src="${this.resolveIcon(card.icon, theme)}" style="width:27.76px;height:27.76px;" alt="${card.title}" />
            </div>
            <h2 class="text-xl leading-[170%] tracking-[2%] ${textClass}" style="font-weight: 500; font-size: 24px;">
              ${card.title}
            </h2>
          </div>
          <div class="card-content flex flex-col gap-3 flex-1">
            ${sections.map((section) => this.renderSection(section, lang, theme)).join("")}
          </div>
        </div>
      </div>
    `;

    this.cache.renderedCards.set(cacheKey, renderedCard);
    return renderedCard;
  }

  renderDesktopLayout(data, theme, lang) {
    const visibleCards = this.getVisibleCards();
    const bgClass = theme === "dark" ? "bg-[#141414]" : "bg-white";
    const textClass = theme === "dark" ? "text-white" : "text-[#2A2A2A]";
    const fontClass = lang === "ar" ? "font-noto-kufi-arabic" : "font-rubik";

    return `
      <div class="${bgClass} w-full mb-6 py-8 px-8 md:px-12 flex flex-col items-stretch min-h-screen ${fontClass}" ${
      lang === "ar" ? 'dir="rtl"' : ""
    }>
        <div class="w-full flex flex-row justify-between items-center mb-8">
          <div class="flex flex-col">
            <h1 class="${textClass} text-[2rem] leading-[170%] tracking-[2%] uppercase" style="font-weight: 500;">
              ${data.title}
            </h1>
          </div>
          <button class="bg-ooredoo-red text-white font-medium text-sm rounded-full px-6 py-3 flex items-center gap-2 whitespace-nowrap" style="font-weight: 500;">
            <span class="${lang === "ar" ? "font-noto-kufi-arabic" : "font-rubik"}"> ${data.charge}</span>
            <img src="${this.config.IMAGE_BASE}baridi.svg" class="w-4 h-4" />
            <img src="${this.config.IMAGE_BASE}poste.svg" class="w-4 h-4" />
          </button>
        </div>
        <div class="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          ${visibleCards.map(({ card, originalIndex }) => this.renderDesktopCard(card, originalIndex, lang, theme)).join("")}
        </div>
      </div>
    `;
  }

  renderDesktopCard(card, cardIndex, lang, theme) {
    if (!card) return "";

    const cacheKey = `dcard-${cardIndex}-${lang}-${theme}-${this.isCardExpanded(cardIndex)}`;
    if (this.cache.renderedCards.has(cacheKey)) {
      return this.cache.renderedCards.get(cacheKey);
    }

    const isExpanded = this.isCardExpanded(cardIndex);
    const sections = this.getCardSections(card, isExpanded);
    const bgClass = theme === "dark" ? "bg-[#141414]" : "bg-white";
    const borderClass = theme === "dark" ? "border border-[#3F3F3F]" : "border border-[#CDCDCD]";
    const shadowClass = theme === "dark" ? "" : "shadow-[-2.6px_27.76px_27.76px_0px_#4F4F4F17]";
    const textClass = theme === "dark" ? "text-white" : "text-[#2A2A2A]";
    const fontClass = lang === "ar" ? "font-noto-kufi-arabic" : "font-rubik";
    const renderedTitle = (() => {
      let titleHTML = card.title;

      if (titleHTML.includes("SMS")) {
        titleHTML = titleHTML.replace(/(SMS)/g, '<span class="font-rubik">$1</span>');
      }

      return `
        <h2 class="text-xl leading-[170%] tracking-[2%] ${textClass}" style="font-weight: 500; font-size: 24px;">
          ${titleHTML}
        </h2>
      `;
    })();

    const renderedCard = `
      <div class="card ${bgClass} ${borderClass} rounded-[22px] overflow-hidden w-full relative transition-all duration-300 ${shadowClass} flex flex-col ${fontClass}" data-card-index="${cardIndex}" style="min-height: 450px;">
        <div class="px-6 pt-6 pb-6 flex flex-col h-full">
        
          <!-- Title Section -->
          <div class="flex items-center gap-1 flex-shrink-0" style="padding-bottom: 24px; border-bottom: 0.87px solid #F4F4F4;">
            <div class="flex items-center justify-center">
              <img src="${this.resolveIcon(card.icon, theme)}" style="width:27.76px;height:27.76px;" alt="${card.title}" />
            </div>
            <h2 class="text-xl leading-[170%] tracking-[2%] ${textClass}" style="font-weight: 500; font-size: 24px;">
              ${card.title}
            </h2>
          </div>

          <!-- Card Content -->
          <div class="card-content flex flex-col gap-3 flex-1 pt-6">
            ${sections.map((section) => this.renderSection(section, lang, theme)).join("")}
          </div>

          <!-- Expand Button (if any) -->
          ${this.config.EXPANDABLE_INDICES.has(cardIndex) ? this.renderExpandButton(cardIndex, isExpanded, theme) : ""}
        </div>
      </div>
    `;

    this.cache.renderedCards.set(cacheKey, renderedCard);
    return renderedCard;
  }

  renderSection(section, lang, theme) {
    if (!section?.subtitle) return "";

    const cacheKey = `section-${JSON.stringify(section)}-${lang}-${theme}`;
    if (this.cache.renderedSections.has(cacheKey)) {
      return this.cache.renderedSections.get(cacheKey);
    }

    const textClass = theme === "dark" ? "text-white" : "text-[#2A2A2A]";

    const isRTL = lang === "ar";
    const directionStyle = isRTL ? "direction: rtl;" : "direction: ltr;";
    const gapSideMargin = isRTL ? "margin-left: 0.5rem;" : "margin-right: 0.5rem;";

    const isFacebookMessenger =
      (section.subtitle?.includes("Facebook & Messenger") || section.subtitle?.includes("فايسبوك & ماسنجر")) &&
      Array.isArray(section.subIcon) &&
      section.subIcon.length === 2;

    let iconsAndTextContent = "";

    // Special case: Facebook & Messenger
    if (isFacebookMessenger) {
      const facebookIcon = `<img src="${this.resolveSubIcon(section.subIcon[0], theme)}" style="width:20px;height:20px;" alt="${
        section.subIcon[0]
      }" />`;
      const messengerIcon = `<img src="${this.resolveSubIcon(section.subIcon[1], theme)}" style="width:20px;height:20px;" alt="${
        section.subIcon[1]
      }" />`;

      const facebookText = lang === "ar" ? "فايسبوك" : "Facebook";
      const messengerText = lang === "ar" ? "ماسنجر" : "Messenger";
      const fontClassForText = lang === "ar" ? "font-noto-kufi-arabic" : "font-rubik";

      iconsAndTextContent = `
        <div class="flex items-center gap-1">
          ${facebookIcon}
          <span class="text-sm font-medium ${textClass} ${fontClassForText}" style="font-weight: 500;">
            ${facebookText}
          </span>
        </div>
        <span class="text-sm font-medium ${textClass} ${fontClassForText}" style="font-weight: 500;">
          &amp;
        </span>
        <div class="flex items-center gap-1">
          ${messengerIcon}
          <span class="text-sm font-medium ${textClass} ${fontClassForText}" style="font-weight: 500;">
            ${messengerText}
          </span>
        </div>
      `;
    } else {
      // Default subtitle rendering
      let fontClassForSubtitle = "font-rubik";

      if (lang === "ar") {
        const hasArabicChars = /[\u0600-\u06FF]/.test(section.subtitle);
        const containsOoredoo = section.subtitle.includes("Ooredoo");

        if (hasArabicChars && containsOoredoo) {
          fontClassForSubtitle = ""; // Fonts handled manually

          // Wrap "Ooredoo" in Rubik, and the rest in Noto Kufi Arabic
          const subtitleWithFonts = section.subtitle.replace(/Ooredoo/g, `<span class="font-rubik">Ooredoo</span>`);
          section.subtitle = `<span class="font-noto-kufi-arabic">${subtitleWithFonts}</span>`;
        } else if (hasArabicChars) {
          fontClassForSubtitle = "font-noto-kufi-arabic";
        }
      }

      iconsAndTextContent = `
        ${this.renderSectionIcons(section, theme)}
        <span class="text-sm font-medium ${textClass} ${fontClassForSubtitle}"
              style="font-weight: 500; line-height: 1.3; white-space: normal; word-break: break-word; ${gapSideMargin}">
          ${section.subtitle}
        </span>
      `;
    }

    const renderedSection = `
      <div class="flex flex-col font-rubik mb-6">
        <div class="flex items-center justify-between min-w-0">
          <div class="flex flex-col flex-1 min-w-0">
            <div class="flex items-center gap-2" style="${directionStyle};">
              ${iconsAndTextContent}
            </div>
            <div class="mt-1">
              ${this.renderSectionSecondaryRow(section, lang, theme)}
            </div>
          </div>
          <div class="flex-shrink-0 flex items-center whitespace-nowrap">
            ${this.renderSectionValue(section, theme)}
          </div>
        </div>
      </div>
    `;

    this.cache.renderedSections.set(cacheKey, renderedSection);
    return renderedSection;
  }

  renderSectionIcons(section, theme) {
    if (!section.subIcon) return "";
    if (Array.isArray(section.subIcon)) {
      return section.subIcon
        .map((icon) => `<img src="${this.resolveSubIcon(icon, theme)}" style="width:20px;height:20px;" alt="${icon}" />`)
        .join("");
    }

    return `<img src="${this.resolveSubIcon(section.subIcon, theme)}" style="width:20px;height:20px;" alt="${section.subIcon}" />`;
  }

  renderSectionValue(section, theme) {
    if (section.infini) {
      return `<img src="${this.resolveSubIcon("infini", theme)}" style="width:40px;height:40px;" alt="Infini" />`;
    }
    if (!section.value) return "";

    const unit = section.unit || "";
    const unitLower = unit.toLowerCase();

    // Determine font class based on unit
    let fontClass = "";
    if (unit === "DA") {
      fontClass = "font-rubik";
    } else if (unit === "دج") {
      fontClass = "font-noto-kufi-arabic";
    }

    const valueClass = theme === "dark" ? "text-white" : "text-ooredoo-red";

    const formatUnit = (unit, value) => {
      if (!unit) return value;
      // For "Go" and "Mo" units, combine without space
      if (unit.toLowerCase() === "go" || unit.toLowerCase() === "mo") {
        return `${value}${unit}`;
      }
      return `${value} ${unit}`;
    };

    if (section.extra) {
      return `
        <div class="flex flex-col items-end">
          <span class="${valueClass} ${fontClass} font-medium text-right" style="font-weight: 600; font-size: 15.99px;">
            ${formatUnit(section.unit, section.value)}
          </span>
          <span class="${valueClass} ${fontClass} font-medium text-right text-[9px]" style="font-weight: 500;">
            ${section.extra}
          </span>
        </div>
      `;
    }

    return `<span class="${valueClass} ${fontClass} font-medium text-right" style="font-weight: 500; font-size: 15.99px;">${formatUnit(
      section.unit,
      section.value
    )}</span>`;
  }

  renderSectionSecondaryRow(section, lang, theme) {
    const hasDate = !!section.date;
    const isCreditRecharge = section.subtitle?.toLowerCase().includes("crédit recharge");
    const hasProgress = !section.infini && !isCreditRecharge && section.percentage !== undefined && section.percentage !== null;
    if (!hasDate && !hasProgress) return "";

    let content = "";
    if (hasDate) {
      content += `
        <div class="flex justify-start">
          <span class="text-[#7F7F7F] text-[10px] font-medium" style="font-weight: 500;">
            ${lang === "ar" ? "إلى" : "Expire le"} ${section.date}
          </span>
        </div>
      `;
    }
    if (hasProgress) {
      const percentage = Math.max(0, Math.min(100, section.percentage));
      const barBgColor = theme === "dark" ? "bg-white" : "bg-[#F1F1F1]";
      content += `
        <div class="flex justify-start mt-1">
          <div class="relative ${barBgColor} rounded-full h-2" style="width: 90%;"> <!-- increased width -->
            <div class="bg-ooredoo-red h-2 rounded-full" style="width:${percentage}%;"></div>
          </div>
        </div>
      `;
    }
    return content;
  }

  renderExpandButton(cardIndex, isExpanded, theme) {
    const borderColor = theme === "dark" ? "#3F3F3F" : "#CFCFCF";
    const chevronSrc = this.resolveChevronIcon(theme);

    return `
      <div class="w-full mt-4 pt-4 flex-shrink-0 flex justify-center">
        <div class="w-2/3 border-t" style="border-color: ${borderColor};"></div>
      </div>
      <div class="flex justify-center">
        <button
          class="card-chevron flex items-center justify-center cursor-pointer rounded-full p-3 transition-all duration-200"
          data-card-index="${cardIndex}"
          type="button"
          aria-label="Toggle card content"
          aria-expanded="${isExpanded ? "true" : "false"}"
          style="min-width: 50px; min-height: 50px; margin-bottom: 0;"
        >
          <div class="chevron-rotator w-12 h-10 flex items-center justify-center transform transition-transform duration-300 ease-in-out ${
            isExpanded ? "rotate-180" : "rotate-0"
          }">
            <img src="${chevronSrc}"
                 class="w-full h-full"
                 alt="expand chevron"
                 style="filter: ${theme === "dark" ? "brightness(0) invert(1)" : "none"};" />
          </div>
        </button>
      </div>
    `;
  }

  renderCardContent(cardIndex) {
    const { currentLang, currentTheme } = this.state;
    const data = consommationData[currentLang];
    const card = data?.cards[cardIndex];
    if (!card) return;

    const isExpanded = this.isCardExpanded(cardIndex);
    const sections = this.getCardSections(card, isExpanded);
    const cardElement = this.container.querySelector(`.card[data-card-index="${cardIndex}"]`);
    const contentElement = cardElement?.querySelector(".card-content");

    if (contentElement) {
      contentElement.style.transition = "all 0.3s ease-in-out";
      contentElement.innerHTML = sections.map((section) => this.renderSection(section, currentLang, currentTheme)).join("");
    }
  }

  destroy() {
    this.unbindEvents();
    this.state.expandedCards.clear();
    this.clearCache();
    this.container = null;
  }
}
