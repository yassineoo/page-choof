import Header from "../components/Header/Header.js";
import Consommation from "../components/Consommation/Consommation.js";
import Dima from "../components/Dima/Dima.js";
import Forfait from "../components/Forfait/Forfait.js";
import Service from "../components/Services/Services.js";
import Migration from "../components/Migration/Migration.js";
import DigitalServices from "../components/DigitalServices/DigitalServices.js";
import DigitalFreeFireServices from "../components/DigitalServices/DigitalFreeFireServices.js";

// 🆕 1. Import the shared Modals
import Modals from "../components/Modals/Modals.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 🆕 2. Render modals once at app startup (before any components use them)
    Modals.render();

    // 1. Initialize Header
    const header = new Header();
    await header.init();

    // Utility to initialize component by ID
    const initComponent = (id, Component) => {
      const container = document.getElementById(id);
      if (container) new Component(container);
    };

    initComponent("consommation-root", Consommation);
    initComponent("dima-root", Dima);
    initComponent("forfait-root", Forfait);
    initComponent("service-root", Service);
    initComponent("migration-root", Migration);
    initComponent("digitalServices-root", DigitalServices);
    initComponent("freefire-services", DigitalFreeFireServices);

  } catch (error) {
    console.error("Initialization failed:", error);
    // Optional: show error bar
    const errorEl = document.createElement('div');
    errorEl.className = 'fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center';
    errorEl.textContent = 'Initialization error - please refresh the page';
    document.body.prepend(errorEl);
  }
});
