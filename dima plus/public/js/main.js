import Header from "../components/Header/Header.js";
import Consommation from "../components/Consommation/Consommation.js";
import Forfait from "../components/Forfait/Forfait.js";
import DigitalServices from "../components/DigitalServices/DigitalServices.js";
import Footer from "../components/Footer/footer.js";
import BoostComponent from "../components/Boost/Boost.js";
import MigrationComponent from "../components/Migration/Migration.js";
import ConversionsCompoenents from "../components/Conversions/Conversions.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const header = new Header();
    await header.init();

    const initComponent = (id, Component) => {
      const container = document.getElementById(id);
      if (container) new Component(container);
    };

    initComponent("consommation-root", Consommation);
    initComponent("forfait-root", Forfait);
    initComponent("boost-root", BoostComponent);
    initComponent("migration-root", MigrationComponent);
    initComponent("conversions-root", ConversionsCompoenents);
    initComponent("digitalServices-root", DigitalServices);
    initComponent("footer-root", Footer);
  } catch (error) {
    console.error("Initialization failed:", error);
    // Optional: show error bar
    const errorEl = document.createElement("div");
    errorEl.className =
      "fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center";
    errorEl.textContent = "Initialization error - please refresh the page";
    document.body.prepend(errorEl);
  }
});
