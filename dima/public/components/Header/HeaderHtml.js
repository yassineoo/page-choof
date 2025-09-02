// HeaderHtml.js
export const generateHeaderHTML = (language = 'fr', userData = {}, theme = 'light') => {
  const isAuto = userData.autoRenewal;
  const helpText = language === 'ar' ? 'مساعدة' : 'Aide ?';
  const currentLanguage = language === 'ar' ? 'العربية' : 'Français';
  const renewalMode = isAuto ? 'Automatique' : 'Manuel';
  const renewalLabel = language === 'ar' ? 'طريقة التجديد' : 'Renouvellement :';

  // Common text style
  const commonTextStyle = `
    font-family: 'Rubik', sans-serif;
    font-weight: 500;
    font-style: normal;
    font-size: 18px;
    line-height: 170%;
    letter-spacing: 0.02em;
    text-transform: capitalize;
  `;

  const priceHeader = `
  font-family: Rubik;
font-weight: 500;
font-style: Medium;
font-size: 24px;
leading-trim: NONE;
line-height: 170%;
letter-spacing: 2%;
`

  const infoCardTitleStyle = `
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.25rem;
    text-transform: capitalize;
    color: #263238;
    margin-bottom: 0.5rem;
  `;

  const infoCardDescStyle = `
    font-family: 'Rubik', sans-serif;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: justify;
    text-transform: capitalize;
    color: #575757;
  `;

  return `
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500&family=DM+Sans:wght@600&display=swap" rel="stylesheet">

<header class="bg-white dark:bg-[#171717] border-b border-gray-200 dark:border-gray-700 z-30 relative w-full">
  <div class="w-[95vw] mx-auto px-4">
    <div class="flex items-center justify-between h-16 md:h-20">
      <!-- Logo Section -->
      <div class="flex items-center space-x-3">
        <div class="w-[140px] h-[36px] md:w-[180px] md:h-[56px] flex items-center justify-center relative">
          <img src="/assets/images/header/Ooredoo.svg" alt="Ooredoo" class="absolute inset-0 w-full h-full object-contain dark:hidden" />
          <img src="/assets/images/header/Ooredoo-white.svg" alt="Ooredoo" class="absolute inset-0 w-full h-full object-contain hidden dark:inline" />
        </div>
        <span class="text-3xl font-light hidden md:block text-black dark:text-white">|</span>
        <div class="w-[100px] h-[29px] md:w-[120px] md:h-[40px] flex items-center justify-center relative">
          <img src="/assets/images/header/Choof.svg" alt="Choof" class="absolute inset-0 w-full h-full object-contain dark:hidden" />
          <img src="/assets/images/header/Choof-white.svg" alt="Choof" class="absolute inset-0 w-full h-full object-contain hidden dark:inline" />
        </div>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-4">
        <!-- Theme Switcher -->
        <div id="theme-switcher" class="relative w-[144px] h-[48px] rounded-full bg-gray-200 dark:bg-ooredoo-red overflow-hidden transition-all duration-500">
          <button id="moon-btn" class="absolute left-0 top-0 w-[72px] h-[48px] rounded-full bg-[#171717] dark:bg-white flex items-center justify-center transition-all duration-500 z-10">
            <img src="/assets/images/header/moon-white.svg" alt="Moon" class="w-7 h-7 dark:hidden" />
            <img src="/assets/images/header/moon.svg" alt="Moon" class="w-7 h-7 hidden dark:block" />
          </button>
          <button id="sun-btn" class="absolute right-0 top-0 w-[72px] h-[48px] rounded-full bg-[#E4E4E7] dark:bg-ooredoo-red flex items-center justify-center transition-all duration-500">
            <img src="/assets/images/header/sun.svg" alt="Sun" class="w-7 h-7 dark:hidden" />
            <img src="/assets/images/header/sun-white.svg" alt="Sun" class="w-7 h-7 hidden dark:block" />
          </button>
        </div>
        
        <!-- Help Link -->
        <a href="#" class="flex items-center h-[48px] px-6 text-dark-text dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <img src="/assets/images/header/help.svg" class="w-5 h-5 mr-2 dark:hidden" />
          <img src="/assets/images/header/help-white.svg" class="w-5 h-5 mr-2 hidden dark:inline" />
          <span id="help-text">${helpText}</span>
        </a>
        
        <!-- Language Selector -->
        <div class="relative h-[48px]" id="language-desktop">
          <button class="flex items-center h-full px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <img src="/assets/images/header/language.svg" class="w-5 h-5 mr-2 dark:hidden" />
            <span id="current-language">${currentLanguage}</span>
            <img src="/assets/images/header/chevron-down.svg" class="w-4 h-4 ml-2 dark:hidden" />
          </button>
          <div class="language-dropdown-menu hidden absolute right-0 mt-2 w-full bg-white dark:bg-[#171717] rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <a href="#" class="language-option block px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white transition-colors ${language === 'fr' ? 'font-semibold text-ooredoo-red' : ''}" data-lang="fr">Français</a>
            <a href="#" class="language-option block px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white transition-colors ${language === 'ar' ? 'font-semibold text-ooredoo-red' : ''}" data-lang="ar">العربية</a>
          </div>
        </div>
      </div>
      
      <!-- Mobile Menu Button -->
      <button id="mobile-menu-btn" class="md:hidden p-2">
        <img src="/assets/images/header/Menu.svg" class="w-6 h-6 dark:hidden block" id="mobile-menu-icon" />
        <img src="/assets/images/header/Menu-white.svg" class="w-6 h-6 hidden dark:inline" id="mobile-menu-icon-dark" />
        <img src="/assets/images/header/close.svg" class="w-6 h-6 hidden" id="mobile-menu-close-icon" />
        <img src="/assets/images/header/close-white.svg" class="w-6 h-6 hidden" id="mobile-menu-close-icon-dark" />
      </button>
    </div>
    
    <!-- Mobile Menu Content -->
    <div id="mobile-menu" class="absolute top-[64px] left-0 w-full shadow-lg bg-white dark:bg-[#171717] md:hidden pb-6 border-b border-gray-200 dark:border-gray-700 hidden z-40">
      <div class="flex flex-col space-y-4 pt-4 px-4">
        <!-- Theme Switcher -->
        <div class="flex items-center gap-3 py-2">
          <button id="theme-mobile-switcher" class="flex items-center w-full">
            <img src="/assets/images/header/sun.svg" class="w-5 h-5 dark:hidden" id="mobile-sun-icon" />
            <img src="/assets/images/header/sun-white.svg" class="w-5 h-5 hidden dark:inline" id="mobile-sun-icon-dark" />
            <img src="/assets/images/header/moon-white.svg" class="w-5 h-5 hidden dark:hidden" id="mobile-moon-icon" />
            <img src="/assets/images/header/moon.svg" class="w-5 h-5 hidden dark:inline" id="mobile-moon-icon-dark" />
            <span class="ml-2">Changer mode</span>
          </button>
        </div>
        
        <!-- Help Link -->
        <div class="flex items-center gap-3 py-2">
          <img src="/assets/images/header/help.svg" class="w-5 h-5 dark:hidden" />
          <img src="/assets/images/header/help-white.svg" class="w-5 h-5 hidden dark:inline" />
          <span id="help-text-mobile">${helpText}</span>
        </div>
        
        <!-- Language Selector -->
        <div class="flex items-center gap-3 py-2">
          <img src="/assets/images/header/language.svg" class="w-5 h-5 dark:hidden" />
          <img src="/assets/images/header/language-white.svg" class="w-5 h-5 hidden dark:inline" />
          <div class="flex gap-2">
            <button class="language-option px-3 py-1 rounded-lg ${language === 'fr' ? 'font-semibold text-ooredoo-red' : ''}" data-lang="fr">Français</button>
            <button class="language-option px-3 py-1 rounded-lg ${language === 'ar' ? 'font-semibold text-ooredoo-red' : ''}" data-lang="ar">العربية</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Red Info Bar -->
  <div class="bg-ooredoo-red py-4 text-white w-full">
    <div class="px-4 w-[95vw] mx-auto">
      <div class="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
        <!-- Left Section -->
        <div class="flex-1 flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
          <!-- Phone -->
          <div class="flex items-center gap-2">
            <img src="/assets/images/header/Telephone.svg" class="w-6 h-6" />
            <span style="${commonTextStyle}">${userData.phone || '0509876543'}</span>
          </div>
          
          <!-- Offer -->
          <div class="flex items-center gap-2">
            <img src="/assets/images/header/Puce.svg" class="w-6 h-6" />
            <span style="${commonTextStyle}">${userData.offer || 'Offre Dima'}</span>
          </div>
          
          <!-- Renewal -->
          <div class="flex items-center gap-2">
            <span style="${commonTextStyle}">${renewalLabel}</span>
            <!-- Renewal Switcher -->
            <div class="relative flex items-center bg-white rounded-full h-[36px] w-[180px] p-0.5">
              <button 
                id="renewal-auto"
                class="flex-1 flex items-center justify-center gap-1 rounded-full h-[32px] transition-all duration-300"
                style="font-family:'Rubik',sans-serif;font-weight:500;font-size:0.95rem;${isAuto ? 'background:#E30613;color:#fff;' : 'background:#fff;color:#2A2A2A;'}">
                <img src="/assets/images/header/chevron-down-white.svg" class="w-5 h-5 ${isAuto ? '' : 'hidden'}" />
                Auto
              </button>
              <button 
                id="renewal-manual"
                class="flex-1 flex items-center justify-center gap-1 rounded-full h-[32px] transition-all duration-300"
                style="font-family:'Rubik',sans-serif;font-weight:500;font-size:0.95rem;${!isAuto ? 'background:#E30613;color:#fff;' : 'background:#fff;color:#2A2A2A;'}">
                <img src="/assets/images/header/chevron-down-white.svg" class="w-5 h-5 ${!isAuto ? '' : 'hidden'}" />
                Manuel
              </button>
            </div>
            
            <!-- Info Button -->
            <button id="auto-renewal-info" class="w-6 h-6 flex items-center justify-center rounded-full text-ooredoo-red relative">
              <img src="/assets/images/header/Info.svg" class="w-6 h-6" alt="Info" />
              <div id="auto-renewal-card" class="absolute bg-white left-1/2 transform -translate-x-1/2 top-full mt-3 mx-48 z-100 w-[22.5rem] py-3 px-6 shadow-lg rounded-tl rounded-tr-[15px] rounded-br-[15px] rounded-bl-[15px] border border-gray-200 hidden"
                style="font-family:'Rubik',sans-serif;">
                <div class="text-left" style="${infoCardTitleStyle}">
                  Mode : ${renewalMode}
                </div>
                <div style="${infoCardDescStyle}">
                  ${isAuto
                    ? `Le mode de renouvellement automatique permet d'activer votre offre chaque mois sans action de votre part. Désactivez-le si vous souhaitez renouveler manuellement.`
                    : `Le mode manuel permet de renouveler votre offre chaque mois seulement si vous le demandez. Activez le mode automatique pour ne pas oublier.`}
                </div>
              </div>
            </button>
          </div>
        </div>
        
        <!-- Right Section (Credit) -->
        <div class="flex items-center gap-2">
          <img src="/assets/images/header/Dollar.svg" class="w-6 h-6" />
          <span style="${priceHeader}">${userData.credit || '1200 DA'}</span>
        </div>
      </div>
    </div>
  </div>
</header>
  `;
};