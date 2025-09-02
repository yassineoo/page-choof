import * as styles from './Styles.js';

export default function ForfaitCard(offer, index = 0, buyLabel = "Acheter") {
  const shadowClass = index === 0 ? 'forfait-card-light' : 'forfait-card-heavy';

  return `
    <div class="${styles.cardContainer} ${shadowClass}">
      <div class="${styles.cardContent}">
        <!-- Card Title -->
        <h2 class="${styles.cardTitle}">${offer.name}</h2>
        <div class="${styles.divider}"></div>

        <!-- Card Middle -->
        <div class="flex-1">
          <div class="${styles.dataWrap}">
            <!-- Red Title -->
            <h3 class="${styles.dataTitle}">${offer.data}</h3>
          </div>

          <!-- Feature List -->
          <ul class="${styles.featureList}">
            ${offer.features.map(feature => `
              <li class="${styles.featureItem}">
                <img src="/assets/images/dima/checkbox.svg" alt="Check" class="${styles.featureIcon}" />
                <span class="${styles.featureText}">${feature}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Price + Button -->
        <div class="mt-auto">
          <div class="${styles.priceContainer}" dir="ltr">
            <span class="${styles.priceAmount}">${offer.price}</span>
            <span class="${styles.priceDa}"> Da /</span>
            <span class="${styles.priceDuration}">${offer.duration}</span>
          </div>
          <div class="${styles.buttonWrap}">
<button class="acheter-button" data-index="${index}">${buyLabel}</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
