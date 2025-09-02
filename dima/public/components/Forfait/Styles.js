// components/Styles.js

export const wrapper = "max-w-4xl mx-auto px-4 py-6";

export const sectionTitle = `
  text-3xl font-medium mb-6 
  leading-[1.7] tracking-[0.02em] 
  uppercase text-center text-black dark:text-white
`;

export const grid = `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5`;
export const gridWithMargin = `${grid} mb-10`;

// Card container – back to original styling but much wider
export const cardContainer = `
  relative bg-white dark:bg-[#2C2C2C] 
  rounded-lg flex flex-col w-full 
  max-w-[480px] mx-auto min-h-[360px]
  forfait-card-border
`;

// Inject custom CSS styles - back to original
if (!document.getElementById('forfait-styles')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'forfait-styles';
  styleEl.textContent = `
    .forfait-card-border {
      box-shadow: -0.93px 7.46px 16.78px 0px #4F4F4F1A, -2.8px 29.82px 29.82px 0px #4F4F4F17;
      border: none;
    }

    .dark .forfait-card-border {
      box-shadow: none;
      border: 1px solid #CDCDCD;
    }

    .acheter-button {
      width: 100.96px;
      height: 32.12px;
      padding: 7.34px 26.62px;
      gap: 9.18px;
      border-radius: 22.03px;
      background-color: var(--ooredoo-red, #e50012);
      border: none;
      color: white;
      font-family: Rubik, sans-serif;
      font-weight: 600;
      font-size: 14px;
      line-height: 100%;
      text-transform: uppercase;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    .acheter-button:hover {
      background-color: rgba(229,0,18,0.9);
      transform: translateY(-1px);
    }
    .acheter-button:active {
      transform: translateY(0px);
    }

    .forfait-divider {
      border: none;
      width: 100%;
      margin: 1.5rem 0;
      height: 1px;
      background-image: repeating-linear-gradient(
        to right,
        #D1D5DB 0px,
        #D1D5DB 8px,
        transparent 8px,
        transparent 16px
      );
      background-size: 16px 1px;
      background-repeat: repeat-x;
    }

    .dark .forfait-divider {
      background-image: repeating-linear-gradient(
        to right,
        #6B7280 0px,
        #6B7280 8px,
        transparent 8px,
        transparent 16px
      );
    }
  `;
  document.head.appendChild(styleEl);
}

export const cardContent = `p-5 flex flex-col h-full`;

export const cardTitle = `
  font-rubik font-medium text-[24px] leading-[100%] tracking-[0%]
  text-center capitalize align-middle text-black dark:text-white
`;

export const divider = `forfait-divider`;

// Red title under value, now with bottom margin for spacing
export const dataTitle = `text-[28px] font-bold text-ooredoo-red mb-4`;

export const dataWrap = `flex items-center gap-2 mb-2 mt-2`;

// Feature list styling
export const featureList = `space-y-1.5 mb-3`;
export const featureItem = `flex items-center`; // center vertically with icon
export const featureIcon = `w-4 h-4 mt-0 flex-shrink-0 mr-4`;
export const featureText = `
  flex-1 text-sm md:text-base leading-relaxed 
  break-words text-gray-800 dark:text-gray-200
`;

// Price area – updated for dark mode
export const priceContainer = `text-center mb-2`;
export const priceAmount = `font-rubik font-semibold text-[28px] leading-[100%]  text-black dark:text-white`;
export const priceDa = `font-rubik font-semibold text-[16px] leading-[100%]  text-black dark:text-white`;
export const priceDuration = `font-rubik font-semibold text-[16px] leading-[100%]  text-black dark:text-gray-300`;

export const buttonWrap = `flex justify-center`;
export const acheterButton = `acheter-button`;