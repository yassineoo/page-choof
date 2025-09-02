import DigitalServicesHeader from './DigitalServicesHeader.js';
import DigitalBitdefenderServices from './DigitalBitdefenderServices.js';
import DigitalShahidServices from './DigitalShahidServices.js';
import DigitalAnghamiServices from './DigitalAnghamiServices.js';
import DigitalFreeFireServices from './DigitalFreeFireServices.js';
import TODServices from './TODServices.js';
export default class DigitalServices {
  constructor(container) {
    this.container = container;
    this.render();
    this.setupResizeObserver();
  }

  render() {
    this.container.innerHTML = `
      <div id="digital-services-header" class=""></div>
      <div id="bitdefender-services" class=""></div>
      <div id="tod-services" class=""></div>
      <div id="shahid-services" class=""></div>
      <div id="anghami-services" class=""></div>
      <div id="freefire-services" class=""></div>
    `;
    
    new DigitalServicesHeader(document.getElementById('digital-services-header'));
    new DigitalBitdefenderServices(document.getElementById('bitdefender-services'));
    new DigitalShahidServices(document.getElementById('shahid-services'));
    new DigitalAnghamiServices(document.getElementById('anghami-services'))
    new DigitalFreeFireServices(document.getElementById('freefire-services'));
    new TODServices(document.getElementById('tod-services'));
  }

  setupResizeObserver() {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        this.adjustLayoutForScreenSize(width);
      }
    });
    resizeObserver.observe(this.container);
  }

  adjustLayoutForScreenSize(width) {
    const isLargeScreen = width >= 1920;
    const isExtraLargeScreen = width >= 2560;
    const scale = isExtraLargeScreen ? '1.5' : isLargeScreen ? '1.2' : '1';
    
    document.documentElement.style.setProperty('--digital-services-scale', scale);
    
    // Adjust specific elements for Shahid services
    const shahidContainer = document.getElementById('shahid-services');
    if (shahidContainer) {
      const logo = shahidContainer.querySelector('img');
      const cards = shahidContainer.querySelectorAll('.card-container');
      
      if (isExtraLargeScreen) {
        if (logo) logo.style.width = '400px';
        cards.forEach(card => card.style.maxWidth = '350px');
      } else if (isLargeScreen) {
        if (logo) logo.style.width = '350px';
        cards.forEach(card => card.style.maxWidth = '320px');
      } else {
        if (logo) logo.style.width = '';
        cards.forEach(card => card.style.maxWidth = '');
      }
    }
  }
}