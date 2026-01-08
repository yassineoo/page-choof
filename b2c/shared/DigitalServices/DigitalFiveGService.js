import { digitalFiveGServiceData } from "./DigitalFiveGServiceData";
import { dialogData } from "./DigitalFiveGServiceData";

export default class DigitalFiveGService {
  constructor(container) {
    this.container = container;
    this.currentLang = this.getLang();
    this.fiveGActivated = this.getFiveGActivated();
    this.showFiveGComponent = this.showFiveGComponent();
    // expose clear function early so inline onclick can call it
    this.clearSignature = this.clearSignature?.bind(this);
    if (typeof window !== 'undefined') window.clearSignature5g = (id) => this.clearSignature();
    this.init();
  }

  // Clear the signature canvas and reset confirm button
  clearSignature() {
    const canvas = document.getElementById("5g-signature-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    try {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    } catch (e) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    canvas.dataset.hasSigned = 'false';
    const confirmBtn = document.getElementById("5g-confirm-signature");
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.style.opacity = '0.5';
    }
  }

  init() {
    this.render();
    this.bindEvents();
    this.initSignatureCanvas();
  }

  getLang() {
    const stored = localStorage.getItem("language");
    return ["fr", "ar"].includes(stored) ? stored : "fr";
  }

  showFiveGComponent() {
    return localStorage.getItem("showFiveGComponent");
  }

  getFiveGActivated() {
    return localStorage.getItem("fiveGActivated");
  }

  bindEvents() {
    this.unbindEvents();

    // Language change
    this.boundHandleLanguageChange = this.handleLanguageChange.bind(this);
    window.addEventListener("languageChanged", this.boundHandleLanguageChange);

    this.langPoller = setInterval(this.checkLanguageChange.bind(this), 200);

    this.boundStorageListener = (e) => {
      if (e.key === "language") {
        this.handleLanguageChange();
      }
    };
    window.addEventListener("storage", this.boundStorageListener);

    // Buttons
    this.bindButtons();
  }

  bindButtons() {
    // Activer button
    const openBtn = this.container.querySelector("#digital-5g-open-dialog");
    if (openBtn) {
      this.boundOpenDialog = () => {
        document.getElementById("5g-dialog1").style.display = "flex";
      };
      openBtn.addEventListener("click", this.boundOpenDialog);
    }

    // Close component button
    const closeBtn = this.container.querySelector("#digital-5g-close");
    const closeBtnMobile = this.container.querySelector("#digital-5g-close-mobile");

    // fiveG Component
    const fiveGComponent = document.getElementById("fiveG-container-desktop");
    const fiveGComponentMobile = document.getElementById("fiveG-container-mobile");
    if (closeBtn) {
      this.boundCloseComponent = () => {
        this.container.innerHTML = "";
        localStorage.setItem("showFiveGComponent", true);
        fiveGComponent.style.display = "flex";
        this.unbindEvents();
      };
      closeBtn.addEventListener("click", this.boundCloseComponent);
    }

    if (closeBtnMobile) {
      this.boundCloseComponentMobile = () => {
        this.container.innerHTML = "";
        localStorage.setItem("showFiveGComponent", true);
        fiveGComponentMobile.style.display = "flex";
        this.unbindEvents();
      };
      closeBtnMobile.addEventListener("click", this.boundCloseComponentMobile);
    }
  }

  unbindEvents() {
    if (this.boundHandleLanguageChange) {
      window.removeEventListener("languageChanged", this.boundHandleLanguageChange);
    }
    if (this.boundStorageListener) {
      window.removeEventListener("storage", this.boundStorageListener);
    }
    if (this.langPoller) {
      clearInterval(this.langPoller);
      this.langPoller = null;
    }

    // Remove old button listeners
    const openBtn = this.container?.querySelector("#digital-5g-open-dialog");
    if (openBtn && this.boundOpenDialog) {
      openBtn.removeEventListener("click", this.boundOpenDialog);
    }

    const closeBtn = this.container?.querySelector("#digital-5g-close");
    const closeBtnMobile = this.container?.querySelector("#digital-5g-close-mobile");
    if (closeBtn && this.boundCloseComponent) {
      closeBtn.removeEventListener("click", this.boundCloseComponent);
    }
    if (closeBtnMobile && this.boundCloseComponentMobile) {
      closeBtnMobile.removeEventListener("click", this.boundCloseComponentMobile);
    }
  }

  handleLanguageChange() {
    const newLang = this.getLang();
    if (newLang !== this.currentLang) {
      this.currentLang = newLang;
      this.render();
      this.bindButtons(); // Re-bind buttons after rendering new HTML
    }
  }

  checkLanguageChange() {
    this.handleLanguageChange();
  }

  getDialogsHtml() {
    const lang = this.getLang();
    const idPrefix = "5g";

    return `
    <!-- FIRST DIALOG -->
    <div id="${idPrefix}-dialog1" style="display:none"
         class="${lang === "ar" ? "font-noto-kufi-arabic" : "font-rubik"} fixed inset-0 bg-black/70 flex items-center justify-center z-[99999]"
         onclick="if(event.target.id==='${idPrefix}-dialog1'){ this.style.display='none'; }">

      <div class="relative z-10 bg-white dark:bg-[#2C2C2C] w-[90%] max-w-[703px] rounded-2xl p-6 text-center"
           onclick="event.stopPropagation()">

        <!-- CLOSE BUTTON -->
        <button 
          class="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#ED1C24] text-white flex items-center justify-center text-xl"
          onclick="document.getElementById('${idPrefix}-dialog1').style.display='none'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="17" fill="#ED1C24"/>
            <path d="M23 11L11 23M11 11L23 23" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <h2 class="text-[24px] mt-2 md:mt-0 md:text-3xl text-[#ED1C24] dark:text-white font-semibold uppercase mt-2 mb-4">
          ${dialogData[lang].dialog1Title}
        </h2>

        <p class="text-base md:text-lg text-gray-700 dark:text-white my-4">${dialogData[lang].dialog1Message}</p>
        <label class="relative z-10 flex items-center gap-3 justify-center my-3 cursor-pointer">
          <input id="${idPrefix}-acceptCheck" type="checkbox"
                 class="w-5 h-5 accent-[#ED1C24]"
                 onclick="
                   document.getElementById('${idPrefix}-confirm1').disabled = !this.checked;
                   document.getElementById('${idPrefix}-confirm1').style.opacity = this.checked ? '1' : '0.5';
                 "
          />
          <span class="text-black dark:text-white text-sm md:text-base whitespace-nowrap">
            ${
              lang === "ar"
                ? 'أوافق على <a class="underline text-blue-600" href="./assets/documents/conditions-ar.pdf" target="_blank">الشروط العامة للاستعمال</a>'
                : 'J\'accepte <a class="underline text-blue-600" href="./assets/documents/conditions-fr.pdf" target="_blank">les conditions d\'utilisation</a>'
            }
          </span>
        </label>

        <div class="flex justify-center items-center gap-3 mt-6">
          <button 
            class="w-40 relative z-10 flex-1 px-2 py-2 border border-[#ED1C24] dark:border-white text-[#ED1C24] dark:text-white font-semibold rounded-full max-w-[150px] uppercase text-[15.4px]"
            onclick="document.getElementById('${idPrefix}-dialog1').style.display='none'"
          >
            ${lang === "ar" ? "إلغاء" : "Annuler"}
          </button>

          <button 
            id="${idPrefix}-confirm1"
            disabled
            class="w-40 relative z-10 flex-1 px-2 py-2 text-white font-semibold rounded-full max-w-[150px] uppercase opacity-50 bg-[#ED1C24] text-[15.4px]"
            onclick="
              document.getElementById('${idPrefix}-dialog1').style.display='none';
              document.getElementById('${idPrefix}-dialog2').style.display='flex';
            "
          >
            ${lang === "ar" ? "تفعيل" : "Activer"}
          </button>
        </div>
        <div class="sm:hidden absolute z-0 bottom-0 right-4 cursor-pointer opacity-10 dark:opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="121.5" viewBox="0 0 38 23" fill="none">
              <path d="M37.0172 10.8532H27.8026C27.579 10.8532 27.3823 10.9247 27.2169 11.0678C27.0515 11.2109 26.9486 11.3942 26.9129 11.6177L26.5194 14.0678C26.4881 14.2735 26.5284 14.4478 26.6491 14.5909C26.7698 14.734 26.9397 14.8055 27.1677 14.8055H31.6297C30.2303 16.263 28.0127 17.1751 26.0053 17.0767C22.9516 16.9292 20.8324 14.3987 21.1766 11.3226C21.5701 7.85767 24.8026 4.98286 28.2318 4.98286C30.3823 4.98286 32.0947 6.11401 32.8905 7.81296C33.1141 8.28688 33.6863 8.46572 34.2318 8.23323L37.0172 7.03949C37.6029 6.78912 37.9427 6.12295 37.7325 5.59985C36.2705 2.02757 32.6804 -0.310734 28.1558 0.0335283C22.8622 0.435913 17.9084 4.56706 16.4911 9.78018C14.6893 16.4285 18.9904 22.0753 25.4956 22.0753C31.2676 22.0753 36.4807 17.6222 37.8577 11.9709C38.0008 11.3763 37.6029 10.8711 37.0127 10.8621L37.0172 10.8532Z" fill="#ED1C24"/>
              <path d="M13.4533 8.52922C12.3982 7.86752 11.0301 7.5322 9.34004 7.5322C8.60233 7.5322 7.95404 7.5948 7.39518 7.71998C7.11798 7.78258 6.84972 7.85858 6.59041 7.948L7.63661 4.179H15.0226C15.7871 4.179 16.5114 3.55754 16.6321 2.79301L16.8691 1.31313C16.9809 0.615662 16.507 0.0478516 15.805 0.0478516H5.02558C4.53825 0.0478516 4.07327 0.414469 3.94361 0.897331L1.55166 9.83921C1.46671 10.1522 1.53825 10.4651 1.73944 10.6708L2.79905 11.7662C3.09413 12.0702 3.58594 12.1104 4.02409 11.8869C4.41753 11.6902 4.81992 11.5292 5.24466 11.4085C5.92424 11.2118 6.65747 11.1134 7.43542 11.1134C8.21336 11.1134 8.89294 11.252 9.46522 11.5337C10.0375 11.8154 10.4578 12.2133 10.7216 12.7319C10.9853 13.2505 11.0569 13.872 10.9451 14.5963C10.8333 15.3027 10.5606 15.9152 10.1269 16.4473C9.69771 16.9748 9.15226 17.3817 8.50397 17.6589C7.85121 17.9405 7.11351 18.0791 6.29085 18.0791C6.26403 18.0791 6.24167 18.0791 6.21932 18.0791L1.73944 18.0836C1.01962 18.0836 0.340036 18.6693 0.228262 19.3891L0.0181274 20.9137C-0.107059 21.7051 0.429454 22.3444 1.21634 22.3444H5.57103C5.6381 22.3444 5.70516 22.3444 5.77223 22.3444C7.5919 22.3444 9.22379 22.0225 10.6724 21.3787C12.1165 20.7349 13.3058 19.8452 14.2357 18.7051C15.1657 17.565 15.7469 16.2684 15.9794 14.8198C16.1895 13.492 16.0867 12.2803 15.6664 11.185C15.2461 10.0851 14.5084 9.20433 13.4578 8.54264L13.4533 8.52922Z" fill="#ED1C24"/>
            </svg>
        </div>
        <div class="hidden sm:block absolute z-0 bottom-[-50px] right-4 cursor-pointer opacity-10 dark:opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="250" height="250" viewBox="0 0 38 23" fill="none">
              <path d="M37.0172 10.8532H27.8026C27.579 10.8532 27.3823 10.9247 27.2169 11.0678C27.0515 11.2109 26.9486 11.3942 26.9129 11.6177L26.5194 14.0678C26.4881 14.2735 26.5284 14.4478 26.6491 14.5909C26.7698 14.734 26.9397 14.8055 27.1677 14.8055H31.6297C30.2303 16.263 28.0127 17.1751 26.0053 17.0767C22.9516 16.9292 20.8324 14.3987 21.1766 11.3226C21.5701 7.85767 24.8026 4.98286 28.2318 4.98286C30.3823 4.98286 32.0947 6.11401 32.8905 7.81296C33.1141 8.28688 33.6863 8.46572 34.2318 8.23323L37.0172 7.03949C37.6029 6.78912 37.9427 6.12295 37.7325 5.59985C36.2705 2.02757 32.6804 -0.310734 28.1558 0.0335283C22.8622 0.435913 17.9084 4.56706 16.4911 9.78018C14.6893 16.4285 18.9904 22.0753 25.4956 22.0753C31.2676 22.0753 36.4807 17.6222 37.8577 11.9709C38.0008 11.3763 37.6029 10.8711 37.0127 10.8621L37.0172 10.8532Z" fill="#ED1C24"/>
              <path d="M13.4533 8.52922C12.3982 7.86752 11.0301 7.5322 9.34004 7.5322C8.60233 7.5322 7.95404 7.5948 7.39518 7.71998C7.11798 7.78258 6.84972 7.85858 6.59041 7.948L7.63661 4.179H15.0226C15.7871 4.179 16.5114 3.55754 16.6321 2.79301L16.8691 1.31313C16.9809 0.615662 16.507 0.0478516 15.805 0.0478516H5.02558C4.53825 0.0478516 4.07327 0.414469 3.94361 0.897331L1.55166 9.83921C1.46671 10.1522 1.53825 10.4651 1.73944 10.6708L2.79905 11.7662C3.09413 12.0702 3.58594 12.1104 4.02409 11.8869C4.41753 11.6902 4.81992 11.5292 5.24466 11.4085C5.92424 11.2118 6.65747 11.1134 7.43542 11.1134C8.21336 11.1134 8.89294 11.252 9.46522 11.5337C10.0375 11.8154 10.4578 12.2133 10.7216 12.7319C10.9853 13.2505 11.0569 13.872 10.9451 14.5963C10.8333 15.3027 10.5606 15.9152 10.1269 16.4473C9.69771 16.9748 9.15226 17.3817 8.50397 17.6589C7.85121 17.9405 7.11351 18.0791 6.29085 18.0791C6.26403 18.0791 6.24167 18.0791 6.21932 18.0791L1.73944 18.0836C1.01962 18.0836 0.340036 18.6693 0.228262 19.3891L0.0181274 20.9137C-0.107059 21.7051 0.429454 22.3444 1.21634 22.3444H5.57103C5.6381 22.3444 5.70516 22.3444 5.77223 22.3444C7.5919 22.3444 9.22379 22.0225 10.6724 21.3787C12.1165 20.7349 13.3058 19.8452 14.2357 18.7051C15.1657 17.565 15.7469 16.2684 15.9794 14.8198C16.1895 13.492 16.0867 12.2803 15.6664 11.185C15.2461 10.0851 14.5084 9.20433 13.4578 8.54264L13.4533 8.52922Z" fill="#ED1C24"/>
            </svg>
        </div>
      </div>
    </div>

    <!-- SECOND DIALOG -->
    <div id="${idPrefix}-dialog2" style="display:none"
         class="${lang === "ar" ? "font-noto-kufi-arabic" : "font-rubik"} fixed inset-0 bg-black/70 flex items-center justify-center z-[99999]"
         onclick="if(event.target.id==='${idPrefix}-dialog2'){ this.style.display='none'; }">

      <div class="relative bg-white dark:bg-[#2C2C2C] w-[90%] max-w-[703px] rounded-2xl p-6 text-center relative"
           onclick="event.stopPropagation()">

        <!-- CLOSE BUTTON -->
        <button 
          class="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#ED1C24] text-white flex items-center justify-center text-xl"
          onclick="document.getElementById('${idPrefix}-dialog2').style.display='none'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="17" fill="#ED1C24"/>
            <path d="M23 11L11 23M11 11L23 23" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <h2 class="text-[24px] mt-2 md:mt-0 text-3xl text-[#ED1C24] dark:text-white font-semibold uppercase mt-2 mb-4">
          ${dialogData[lang].dialog2Title}
        </h2>

        <p class="text-base md:text-lg mb-6 text-black dark:text-white">${dialogData[lang].dialog2Message}</p>
        
        <!-- Signature Canvas -->
        <div class="mb-6 flex justify-center">
          <canvas 
            id="${idPrefix}-signature-canvas" 
            width="500" 
            height="200"
            class="border-2 relative z-20 border-ooredoo-red rounded-lg cursor-crosshair bg-white"
            style="display: block; margin: 0 auto; max-width: 100%;"
          ></canvas>
        </div>

        <div class="flex justify-center items-center gap-3 mt-6">
          <button 
            class="w-40 relative z-10 flex-1 px-2 py-2 border border-[#ED1C24] dark:border-white text-[#ED1C24] dark:text-white font-semibold rounded-full max-w-[150px] uppercase text-[15.4px]"
            onclick="clearSignature5g()"
          >
            ${lang === "ar" ? "مسح" : "Effacer"}
          </button>

          <button 
            id="${idPrefix}-confirm-signature"
            disabled
            class="w-40 relative z-10 flex-1 px-2 py-2 text-white font-semibold rounded-full max-w-[150px] uppercase opacity-50 bg-[#ED1C24] text-[15.4px]"
            onclick="
              document.getElementById('${idPrefix}-dialog2').style.display='none';
              document.getElementById('${idPrefix}-dialog3').style.display='flex';
            "
          >
            ${lang === "ar" ? "تأكيد" : "Confirmer"}
          </button>
        </div>

        <div class="sm:hidden absolute z-0 bottom-0 right-4 cursor-pointer opacity-10 dark:opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="121.5" viewBox="0 0 38 23" fill="none">
              <path d="M37.0172 10.8532H27.8026C27.579 10.8532 27.3823 10.9247 27.2169 11.0678C27.0515 11.2109 26.9486 11.3942 26.9129 11.6177L26.5194 14.0678C26.4881 14.2735 26.5284 14.4478 26.6491 14.5909C26.7698 14.734 26.9397 14.8055 27.1677 14.8055H31.6297C30.2303 16.263 28.0127 17.1751 26.0053 17.0767C22.9516 16.9292 20.8324 14.3987 21.1766 11.3226C21.5701 7.85767 24.8026 4.98286 28.2318 4.98286C30.3823 4.98286 32.0947 6.11401 32.8905 7.81296C33.1141 8.28688 33.6863 8.46572 34.2318 8.23323L37.0172 7.03949C37.6029 6.78912 37.9427 6.12295 37.7325 5.59985C36.2705 2.02757 32.6804 -0.310734 28.1558 0.0335283C22.8622 0.435913 17.9084 4.56706 16.4911 9.78018C14.6893 16.4285 18.9904 22.0753 25.4956 22.0753C31.2676 22.0753 36.4807 17.6222 37.8577 11.9709C38.0008 11.3763 37.6029 10.8711 37.0127 10.8621L37.0172 10.8532Z" fill="#ED1C24"/>
              <path d="M13.4533 8.52922C12.3982 7.86752 11.0301 7.5322 9.34004 7.5322C8.60233 7.5322 7.95404 7.5948 7.39518 7.71998C7.11798 7.78258 6.84972 7.85858 6.59041 7.948L7.63661 4.179H15.0226C15.7871 4.179 16.5114 3.55754 16.6321 2.79301L16.8691 1.31313C16.9809 0.615662 16.507 0.0478516 15.805 0.0478516H5.02558C4.53825 0.0478516 4.07327 0.414469 3.94361 0.897331L1.55166 9.83921C1.46671 10.1522 1.53825 10.4651 1.73944 10.6708L2.79905 11.7662C3.09413 12.0702 3.58594 12.1104 4.02409 11.8869C4.41753 11.6902 4.81992 11.5292 5.24466 11.4085C5.92424 11.2118 6.65747 11.1134 7.43542 11.1134C8.21336 11.1134 8.89294 11.252 9.46522 11.5337C10.0375 11.8154 10.4578 12.2133 10.7216 12.7319C10.9853 13.2505 11.0569 13.872 10.9451 14.5963C10.8333 15.3027 10.5606 15.9152 10.1269 16.4473C9.69771 16.9748 9.15226 17.3817 8.50397 17.6589C7.85121 17.9405 7.11351 18.0791 6.29085 18.0791C6.26403 18.0791 6.24167 18.0791 6.21932 18.0791L1.73944 18.0836C1.01962 18.0836 0.340036 18.6693 0.228262 19.3891L0.0181274 20.9137C-0.107059 21.7051 0.429454 22.3444 1.21634 22.3444H5.57103C5.6381 22.3444 5.70516 22.3444 5.77223 22.3444C7.5919 22.3444 9.22379 22.0225 10.6724 21.3787C12.1165 20.7349 13.3058 19.8452 14.2357 18.7051C15.1657 17.565 15.7469 16.2684 15.9794 14.8198C16.1895 13.492 16.0867 12.2803 15.6664 11.185C15.2461 10.0851 14.5084 9.20433 13.4578 8.54264L13.4533 8.52922Z" fill="#ED1C24"/>
            </svg>
        </div>
        <div class="hidden sm:block absolute z-0 bottom-[-50px] right-4 cursor-pointer opacity-10 dark:opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="250" height="250" viewBox="0 0 38 23" fill="none">
              <path d="M37.0172 10.8532H27.8026C27.579 10.8532 27.3823 10.9247 27.2169 11.0678C27.0515 11.2109 26.9486 11.3942 26.9129 11.6177L26.5194 14.0678C26.4881 14.2735 26.5284 14.4478 26.6491 14.5909C26.7698 14.734 26.9397 14.8055 27.1677 14.8055H31.6297C30.2303 16.263 28.0127 17.1751 26.0053 17.0767C22.9516 16.9292 20.8324 14.3987 21.1766 11.3226C21.5701 7.85767 24.8026 4.98286 28.2318 4.98286C30.3823 4.98286 32.0947 6.11401 32.8905 7.81296C33.1141 8.28688 33.6863 8.46572 34.2318 8.23323L37.0172 7.03949C37.6029 6.78912 37.9427 6.12295 37.7325 5.59985C36.2705 2.02757 32.6804 -0.310734 28.1558 0.0335283C22.8622 0.435913 17.9084 4.56706 16.4911 9.78018C14.6893 16.4285 18.9904 22.0753 25.4956 22.0753C31.2676 22.0753 36.4807 17.6222 37.8577 11.9709C38.0008 11.3763 37.6029 10.8711 37.0127 10.8621L37.0172 10.8532Z" fill="#ED1C24"/>
              <path d="M13.4533 8.52922C12.3982 7.86752 11.0301 7.5322 9.34004 7.5322C8.60233 7.5322 7.95404 7.5948 7.39518 7.71998C7.11798 7.78258 6.84972 7.85858 6.59041 7.948L7.63661 4.179H15.0226C15.7871 4.179 16.5114 3.55754 16.6321 2.79301L16.8691 1.31313C16.9809 0.615662 16.507 0.0478516 15.805 0.0478516H5.02558C4.53825 0.0478516 4.07327 0.414469 3.94361 0.897331L1.55166 9.83921C1.46671 10.1522 1.53825 10.4651 1.73944 10.6708L2.79905 11.7662C3.09413 12.0702 3.58594 12.1104 4.02409 11.8869C4.41753 11.6902 4.81992 11.5292 5.24466 11.4085C5.92424 11.2118 6.65747 11.1134 7.43542 11.1134C8.21336 11.1134 8.89294 11.252 9.46522 11.5337C10.0375 11.8154 10.4578 12.2133 10.7216 12.7319C10.9853 13.2505 11.0569 13.872 10.9451 14.5963C10.8333 15.3027 10.5606 15.9152 10.1269 16.4473C9.69771 16.9748 9.15226 17.3817 8.50397 17.6589C7.85121 17.9405 7.11351 18.0791 6.29085 18.0791C6.26403 18.0791 6.24167 18.0791 6.21932 18.0791L1.73944 18.0836C1.01962 18.0836 0.340036 18.6693 0.228262 19.3891L0.0181274 20.9137C-0.107059 21.7051 0.429454 22.3444 1.21634 22.3444H5.57103C5.6381 22.3444 5.70516 22.3444 5.77223 22.3444C7.5919 22.3444 9.22379 22.0225 10.6724 21.3787C12.1165 20.7349 13.3058 19.8452 14.2357 18.7051C15.1657 17.565 15.7469 16.2684 15.9794 14.8198C16.1895 13.492 16.0867 12.2803 15.6664 11.185C15.2461 10.0851 14.5084 9.20433 13.4578 8.54264L13.4533 8.52922Z" fill="#ED1C24"/>
            </svg>
        </div>
      </div>
    </div>

    <!-- THIRD DIALOG (FELICITATION) -->
    <div id="${idPrefix}-dialog3" style="display:none"
         class="${lang === "ar" ? "font-noto-kufi-arabic" : "font-rubik"} fixed inset-0 bg-black/70 flex items-center justify-center z-[99999]"
         onclick="if(event.target.id==='${idPrefix}-dialog3'){ this.style.display='none'; }">

      <div class="relative bg-white dark:bg-[#2C2C2C] w-[90%] max-w-[703px] rounded-2xl p-6 text-center"
           onclick="event.stopPropagation()">

        <!-- CLOSE BUTTON -->
        <button 
          class="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#ED1C24] text-white flex items-center justify-center text-xl"
          onclick="document.getElementById('${idPrefix}-dialog3').style.display='none'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="17" fill="#ED1C24"/>
            <path d="M23 11L11 23M11 11L23 23" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <h2 class="text-[24px] mt-2 md:mt-0 text-3xl text-[#ED1C24] dark:text-white font-semibold uppercase mt-2 mb-4">
          ${dialogData[lang].dialog3Title}
        </h2>

        <p class="text-base md:text-lg mb-6 text-black dark:text-white">${dialogData[lang].dialog3Message}</p>
        <button 
          class="relative z-10 w-40 max-w-[150px] py-2 rounded-full bg-[#ED1C24] text-white text-[15.4px] font-semibold uppercase"
          onclick="
          document.getElementById('${idPrefix}-dialog3').style.display='none';
          document.getElementById('fiveG-container').style.display='none';
          localStorage.setItem('fiveGActivated', true);
          "
        >
          ${lang === "ar" ? "تم" : "OK"}
        </button>

        <div class="sm:hidden absolute z-0 bottom-0 right-4 cursor-pointer opacity-10 dark:opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="121.5" viewBox="0 0 38 23" fill="none">
              <path d="M37.0172 10.8532H27.8026C27.579 10.8532 27.3823 10.9247 27.2169 11.0678C27.0515 11.2109 26.9486 11.3942 26.9129 11.6177L26.5194 14.0678C26.4881 14.2735 26.5284 14.4478 26.6491 14.5909C26.7698 14.734 26.9397 14.8055 27.1677 14.8055H31.6297C30.2303 16.263 28.0127 17.1751 26.0053 17.0767C22.9516 16.9292 20.8324 14.3987 21.1766 11.3226C21.5701 7.85767 24.8026 4.98286 28.2318 4.98286C30.3823 4.98286 32.0947 6.11401 32.8905 7.81296C33.1141 8.28688 33.6863 8.46572 34.2318 8.23323L37.0172 7.03949C37.6029 6.78912 37.9427 6.12295 37.7325 5.59985C36.2705 2.02757 32.6804 -0.310734 28.1558 0.0335283C22.8622 0.435913 17.9084 4.56706 16.4911 9.78018C14.6893 16.4285 18.9904 22.0753 25.4956 22.0753C31.2676 22.0753 36.4807 17.6222 37.8577 11.9709C38.0008 11.3763 37.6029 10.8711 37.0127 10.8621L37.0172 10.8532Z" fill="#ED1C24"/>
              <path d="M13.4533 8.52922C12.3982 7.86752 11.0301 7.5322 9.34004 7.5322C8.60233 7.5322 7.95404 7.5948 7.39518 7.71998C7.11798 7.78258 6.84972 7.85858 6.59041 7.948L7.63661 4.179H15.0226C15.7871 4.179 16.5114 3.55754 16.6321 2.79301L16.8691 1.31313C16.9809 0.615662 16.507 0.0478516 15.805 0.0478516H5.02558C4.53825 0.0478516 4.07327 0.414469 3.94361 0.897331L1.55166 9.83921C1.46671 10.1522 1.53825 10.4651 1.73944 10.6708L2.79905 11.7662C3.09413 12.0702 3.58594 12.1104 4.02409 11.8869C4.41753 11.6902 4.81992 11.5292 5.24466 11.4085C5.92424 11.2118 6.65747 11.1134 7.43542 11.1134C8.21336 11.1134 8.89294 11.252 9.46522 11.5337C10.0375 11.8154 10.4578 12.2133 10.7216 12.7319C10.9853 13.2505 11.0569 13.872 10.9451 14.5963C10.8333 15.3027 10.5606 15.9152 10.1269 16.4473C9.69771 16.9748 9.15226 17.3817 8.50397 17.6589C7.85121 17.9405 7.11351 18.0791 6.29085 18.0791C6.26403 18.0791 6.24167 18.0791 6.21932 18.0791L1.73944 18.0836C1.01962 18.0836 0.340036 18.6693 0.228262 19.3891L0.0181274 20.9137C-0.107059 21.7051 0.429454 22.3444 1.21634 22.3444H5.57103C5.6381 22.3444 5.70516 22.3444 5.77223 22.3444C7.5919 22.3444 9.22379 22.0225 10.6724 21.3787C12.1165 20.7349 13.3058 19.8452 14.2357 18.7051C15.1657 17.565 15.7469 16.2684 15.9794 14.8198C16.1895 13.492 16.0867 12.2803 15.6664 11.185C15.2461 10.0851 14.5084 9.20433 13.4578 8.54264L13.4533 8.52922Z" fill="#ED1C24"/>
            </svg>
        </div>
        <div class="hidden sm:block absolute z-0 bottom-[-50px] right-4 cursor-pointer opacity-10 dark:opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="250" height="250" viewBox="0 0 38 23" fill="none">
              <path d="M37.0172 10.8532H27.8026C27.579 10.8532 27.3823 10.9247 27.2169 11.0678C27.0515 11.2109 26.9486 11.3942 26.9129 11.6177L26.5194 14.0678C26.4881 14.2735 26.5284 14.4478 26.6491 14.5909C26.7698 14.734 26.9397 14.8055 27.1677 14.8055H31.6297C30.2303 16.263 28.0127 17.1751 26.0053 17.0767C22.9516 16.9292 20.8324 14.3987 21.1766 11.3226C21.5701 7.85767 24.8026 4.98286 28.2318 4.98286C30.3823 4.98286 32.0947 6.11401 32.8905 7.81296C33.1141 8.28688 33.6863 8.46572 34.2318 8.23323L37.0172 7.03949C37.6029 6.78912 37.9427 6.12295 37.7325 5.59985C36.2705 2.02757 32.6804 -0.310734 28.1558 0.0335283C22.8622 0.435913 17.9084 4.56706 16.4911 9.78018C14.6893 16.4285 18.9904 22.0753 25.4956 22.0753C31.2676 22.0753 36.4807 17.6222 37.8577 11.9709C38.0008 11.3763 37.6029 10.8711 37.0127 10.8621L37.0172 10.8532Z" fill="#ED1C24"/>
              <path d="M13.4533 8.52922C12.3982 7.86752 11.0301 7.5322 9.34004 7.5322C8.60233 7.5322 7.95404 7.5948 7.39518 7.71998C7.11798 7.78258 6.84972 7.85858 6.59041 7.948L7.63661 4.179H15.0226C15.7871 4.179 16.5114 3.55754 16.6321 2.79301L16.8691 1.31313C16.9809 0.615662 16.507 0.0478516 15.805 0.0478516H5.02558C4.53825 0.0478516 4.07327 0.414469 3.94361 0.897331L1.55166 9.83921C1.46671 10.1522 1.53825 10.4651 1.73944 10.6708L2.79905 11.7662C3.09413 12.0702 3.58594 12.1104 4.02409 11.8869C4.41753 11.6902 4.81992 11.5292 5.24466 11.4085C5.92424 11.2118 6.65747 11.1134 7.43542 11.1134C8.21336 11.1134 8.89294 11.252 9.46522 11.5337C10.0375 11.8154 10.4578 12.2133 10.7216 12.7319C10.9853 13.2505 11.0569 13.872 10.9451 14.5963C10.8333 15.3027 10.5606 15.9152 10.1269 16.4473C9.69771 16.9748 9.15226 17.3817 8.50397 17.6589C7.85121 17.9405 7.11351 18.0791 6.29085 18.0791C6.26403 18.0791 6.24167 18.0791 6.21932 18.0791L1.73944 18.0836C1.01962 18.0836 0.340036 18.6693 0.228262 19.3891L0.0181274 20.9137C-0.107059 21.7051 0.429454 22.3444 1.21634 22.3444H5.57103C5.6381 22.3444 5.70516 22.3444 5.77223 22.3444C7.5919 22.3444 9.22379 22.0225 10.6724 21.3787C12.1165 20.7349 13.3058 19.8452 14.2357 18.7051C15.1657 17.565 15.7469 16.2684 15.9794 14.8198C16.1895 13.492 16.0867 12.2803 15.6664 11.185C15.2461 10.0851 14.5084 9.20433 13.4578 8.54264L13.4533 8.52922Z" fill="#ED1C24"/>
            </svg>
        </div>
      </div>
    </div>
    `;
  }

  initSignatureCanvas() {
    setTimeout(() => {
      const canvas = document.getElementById("5g-signature-canvas");
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;
      // track signed state on canvas element so clear can reset it from outside
      canvas.dataset.hasSigned = 'false';

      const getMousePos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY
        };
      };

      const enableConfirmButton = () => {
        if (canvas.dataset.hasSigned !== 'true') {
          canvas.dataset.hasSigned = 'true';
          const confirmBtn = document.getElementById("5g-confirm-signature");
          if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = "1";
          }
        }
      };

      canvas.addEventListener("mousedown", (e) => {
        const pos = getMousePos(e);
        isDrawing = true;
        lastX = pos.x;
        lastY = pos.y;
        enableConfirmButton();
      });

      canvas.addEventListener("mousemove", (e) => {
        if (!isDrawing) return;
        const pos = getMousePos(e);

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        lastX = pos.x;
        lastY = pos.y;
      });

      canvas.addEventListener("mouseup", () => {
        isDrawing = false;
      });

      canvas.addEventListener("mouseleave", () => {
        isDrawing = false;
      });

      // Touch support for mobile
      canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousedown", {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
      });

      canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousemove", {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
      });

      canvas.addEventListener("touchend", (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
      });
    }, 100);
  }

  render() {
    const lang = this.getLang();
    const isArabic = lang === "ar";
    const dir = isArabic ? "rtl" : "ltr";

    if (this.fiveGActivated) this.container.innerHTML = "";
    // Main component HTML
    this.container.innerHTML = `
      <div class="bg-[#ED1C24] w-full fixed bottom-0 left-0 z-[99]" dir="${dir}" id="fiveG-container">
        <div class="mx-auto py-3 md:py-6 px-10 flex justify-between items-center flex-wrap gap-y-[15px] relative">
            <div class="flex items-center gap-2 mt-6 md:mt-0">
                <span class="p-2 bg-white rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 38 23" fill="none">
                      <path d="M37.0172 10.8532H27.8026C27.579 10.8532 27.3823 10.9247 27.2169 11.0678C27.0515 11.2109 26.9486 11.3942 26.9129 11.6177L26.5194 14.0678C26.4881 14.2735 26.5284 14.4478 26.6491 14.5909C26.7698 14.734 26.9397 14.8055 27.1677 14.8055H31.6297C30.2303 16.263 28.0127 17.1751 26.0053 17.0767C22.9516 16.9292 20.8324 14.3987 21.1766 11.3226C21.5701 7.85767 24.8026 4.98286 28.2318 4.98286C30.3823 4.98286 32.0947 6.11401 32.8905 7.81296C33.1141 8.28688 33.6863 8.46572 34.2318 8.23323L37.0172 7.03949C37.6029 6.78912 37.9427 6.12295 37.7325 5.59985C36.2705 2.02757 32.6804 -0.310734 28.1558 0.0335283C22.8622 0.435913 17.9084 4.56706 16.4911 9.78018C14.6893 16.4285 18.9904 22.0753 25.4956 22.0753C31.2676 22.0753 36.4807 17.6222 37.8577 11.9709C38.0008 11.3763 37.6029 10.8711 37.0127 10.8621L37.0172 10.8532Z" fill="#ED1C24"/>
                      <path d="M13.4533 8.52922C12.3982 7.86752 11.0301 7.5322 9.34004 7.5322C8.60233 7.5322 7.95404 7.5948 7.39518 7.71998C7.11798 7.78258 6.84972 7.85858 6.59041 7.948L7.63661 4.179H15.0226C15.7871 4.179 16.5114 3.55754 16.6321 2.79301L16.8691 1.31313C16.9809 0.615662 16.507 0.0478516 15.805 0.0478516H5.02558C4.53825 0.0478516 4.07327 0.414469 3.94361 0.897331L1.55166 9.83921C1.46671 10.1522 1.53825 10.4651 1.73944 10.6708L2.79905 11.7662C3.09413 12.0702 3.58594 12.1104 4.02409 11.8869C4.41753 11.6902 4.81992 11.5292 5.24466 11.4085C5.92424 11.2118 6.65747 11.1134 7.43542 11.1134C8.21336 11.1134 8.89294 11.252 9.46522 11.5337C10.0375 11.8154 10.4578 12.2133 10.7216 12.7319C10.9853 13.2505 11.0569 13.872 10.9451 14.5963C10.8333 15.3027 10.5606 15.9152 10.1269 16.4473C9.69771 16.9748 9.15226 17.3817 8.50397 17.6589C7.85121 17.9405 7.11351 18.0791 6.29085 18.0791C6.26403 18.0791 6.24167 18.0791 6.21932 18.0791L1.73944 18.0836C1.01962 18.0836 0.340036 18.6693 0.228262 19.3891L0.0181274 20.9137C-0.107059 21.7051 0.429454 22.3444 1.21634 22.3444H5.57103C5.6381 22.3444 5.70516 22.3444 5.77223 22.3444C7.5919 22.3444 9.22379 22.0225 10.6724 21.3787C12.1165 20.7349 13.3058 19.8452 14.2357 18.7051C15.1657 17.565 15.7469 16.2684 15.9794 14.8198C16.1895 13.492 16.0867 12.2803 15.6664 11.185C15.2461 10.0851 14.5084 9.20433 13.4578 8.54264L13.4533 8.52922Z" fill="#ED1C24"/>
                    </svg>
                </span>
            
                <p class="text-base md:text-[22.65px] text-white">
                    ${digitalFiveGServiceData[lang].description}
                </p>
            </div>

            <div class="flex items-center gap-4">
                <button 
                      id="digital-5g-open-dialog"
                      class="py-3 text-[14px] font-medium uppercase text-[#ED1C24] px-4 w-[171px] rounded-full bg-white flex items-center justify-center"
                >
                      ${digitalFiveGServiceData[lang].buttonText}
                </button>

                <button id="digital-5g-close" class="hidden md:flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                        <rect width="34" height="34" rx="17" fill="#ED1C24"/>
                        <path d="M23 11L11 23M11 11L23 23" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>

            <div class="flex items-center gap-4 absolute top-4 ${lang === "ar" ? "left-4" : "right-4"} md:hidden">
              <button id="digital-5g-close-mobile" class="">
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                    <rect width="34" height="34" rx="17" fill="#ED1C24"/>
                    <path d="M23 11L11 23M11 11L23 23" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
        </div>
      </div>
    `;

    // Append dialogs HTML
    this.container.innerHTML += this.getDialogsHtml();

    // Bind the buttons again after rendering
    this.bindButtons();

    // ⭐ AUTO-OPEN FIRST DIALOG (like useEffect)
    const firstDialog = document.getElementById("5g-dialog1");
    if (firstDialog) {
      localStorage.setItem("fiveGActivated", false);
      localStorage.setItem("showFiveGComponent", false);

    }
  }

  destroy() {
    this.unbindEvents();
    this.container.innerHTML = "";
  }
}
