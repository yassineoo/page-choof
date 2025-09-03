import Header from "../components/Header/Header.js";
import Consommation from "../components/Consommation/Consommation.js";
import Forfait from "../components/Forfait/Forfait.js";
import DigitalServices from "../components/DigitalServices/DigitalServices.js";
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const header = new Header();
    await header.init();

    // Utility to initialize component by ID
    const initComponent = (id, Component) => {
      const container = document.getElementById(id);
      if (container) new Component(container);
    };

    initComponent("consommation-root", Consommation);
    initComponent("forfait-root", Forfait);
    initComponent("digitalServices-root", DigitalServices);

  } catch (error) {
    console.error("Initialization failed:", error);
    // Optional: show error bar
    const errorEl = document.createElement('div');
    errorEl.className = 'fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center';
    errorEl.textContent = 'Initialization error - please refresh the page';
    document.body.prepend(errorEl);
  }
});
