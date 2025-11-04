// export default class Footer {
//   constructor() {
//     this.currentLanguage = this.getStoredLanguage();
//     this.footerElement = document.getElementById("footer-root");
//     this.init();
//   }

//   init() {
//     this.render();
//     this.bindEvents();
//     this.showStyledModal(); // 👈 modal on every load
//   }

//   getStoredLanguage() {
//     try {
//       return typeof localStorage !== "undefined"
//         ? localStorage.getItem("language") || "fr"
//         : "fr";
//     } catch (e) {
//       return "fr";
//     }
//   }

//   bindEvents() {
//     this.unbindEvents();
//     this.boundHandleLanguageChange = this.handleLanguageChange.bind(this);
//     window.addEventListener("languageChanged", this.boundHandleLanguageChange);
//     this.langPoller = setInterval(this.checkLanguageChange.bind(this), 200);
//     this.boundStorageListener = (e) => {
//       if (e.key === "language") {
//         this.handleLanguageChange();
//       }
//     };
//     window.addEventListener("storage", this.boundStorageListener);
//   }

//   unbindEvents() {
//     if (this.boundHandleLanguageChange) {
//       window.removeEventListener("languageChanged", this.boundHandleLanguageChange);
//     }
//     if (this.boundStorageListener) {
//       window.removeEventListener("storage", this.boundStorageListener);
//     }
//     if (this.langPoller) {
//       clearInterval(this.langPoller);
//       this.langPoller = null;
//     }
//   }

//   handleLanguageChange() {
//     const newLanguage = this.getStoredLanguage();
//     if (newLanguage !== this.currentLanguage) {
//       console.log(`Footer: Language changed from ${this.currentLanguage} to ${newLanguage}`);
//       this.currentLanguage = newLanguage;
//       this.render();
//     }
//   }

//   checkLanguageChange() {
//     this.handleLanguageChange();
//   }

//   render() {
//     if (!this.footerElement) return;

//     if (this.currentLanguage === "ar") {
//       this.footerElement.innerHTML = `
//         <p>@ <span class="font-noto-kufi-arabic">حقوق النشر</span> 2025 Ooredoo </p>
//       `;
//     } else {
//       this.footerElement.innerHTML = `
//         <p>&copy; Copyright 2025 Ooredoo</p>
//       `;
//     }
//   }

//   // ✅ Modern styled modal (Tailwind-based)
//   showStyledModal() {
//     const language = this.currentLanguage;
//     const isRTL = language === "ar";
//     const dirAttribute = isRTL ? 'dir="rtl"' : "";
//     const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

//     const title =
//       language === "ar" ? "شاهد!" : "SHAHID!";
//     const message =
//       language === "ar"
//         ? "نحن سعداء بزيارتك! اضغط على الزر الأحمر أو خارج المربع لإغلاق النافذة."
//         : "We’re glad to have you here! Click the red button or outside the box to close this popup.";

//     // Create modal container
//     const modal = document.createElement("div");
//     modal.className =
//       "fixed inset-0 z-[9999] flex items-center justify-center p-4 forfait-modal-fade";
//     modal.style.backgroundColor = "rgba(105, 105, 105, 0.8)";
//     modal.setAttribute("role", "dialog");
//     modal.setAttribute("aria-modal", "true");
//     modal.setAttribute("aria-labelledby", "modal-title");

//     // Inner box HTML
//     modal.innerHTML = `
//       <div class="relative bg-white dark:bg-[#2C2C2C] rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl min-w-[320px] px-6 md:px-8 pt-16 pb-8 md:pb-12" ${dirAttribute}>
//         <button id="modal-close-btn" type="button" aria-label="Close modal"
//           class="forfait-modal-close absolute top-[15px] right-[15px] w-[24px] h-[24px] md:w-[34px] md:h-[34px] flex items-center justify-center rounded-full bg-ooredoo-red text-white z-20">
//           <img src="./assets/images/Close.svg" alt="close" class="w-5 h-5 md:w-4 md:h-4"/>
//         </button>
//         <div class="text-center mb-6">
//           <h2 id="modal-title" class="font-semibold text-ooredoo-red dark:text-white text-xl xs:text-2xl md:text-3xl leading-tight uppercase tracking-tight">
//             ${title}
//           </h2>
//         </div>
//         <div class="text-center mb-10">
//           <p class="${fontClass} text-gray-800 dark:text-gray-200 leading-relaxed text-base md:text-lg px-2">
//             ${message}
//           </p>
//         </div>
//         <div class="flex justify-center">
//           <button
//             id="modal-confirm-btn"
//             class="bg-ooredoo-red hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition"
//           >
//             ${language === "ar" ? "إغلاق" : "Close"}
//           </button>
//         </div>
//       </div>
//     `;

//     // Append modal
//     document.body.appendChild(modal);

//     // Close logic
//     const closeModal = () => modal.remove();

//     // Button events
//     modal.querySelector("#modal-close-btn").addEventListener("click", closeModal);
//     modal.querySelector("#modal-confirm-btn").addEventListener("click", closeModal);

//     // Click outside to close
//     modal.addEventListener("click", (e) => {
//       if (e.target === modal) closeModal();
//     });
//   }

//   destroy() {
//     this.unbindEvents();
//   }
// }

export default class Footer {
  constructor() {
    this.currentLanguage = this.getStoredLanguage();
    this.footerElement = document.getElementById("footer-root");
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.showFirstModal(); // 👈 show on first load
  }

  getStoredLanguage() {
    try {
      return typeof localStorage !== "undefined"
        ? localStorage.getItem("language") || "fr"
        : "fr";
    } catch (e) {
      return "fr";
    }
  }

  bindEvents() {
    this.unbindEvents();
    this.boundHandleLanguageChange = this.handleLanguageChange.bind(this);
    window.addEventListener("languageChanged", this.boundHandleLanguageChange);
    this.langPoller = setInterval(this.checkLanguageChange.bind(this), 200);
    this.boundStorageListener = (e) => {
      if (e.key === "language") {
        this.handleLanguageChange();
      }
    };
    window.addEventListener("storage", this.boundStorageListener);
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
  }

  handleLanguageChange() {
    const newLanguage = this.getStoredLanguage();
    if (newLanguage !== this.currentLanguage) {
      console.log(`Footer: Language changed from ${this.currentLanguage} to ${newLanguage}`);
      this.currentLanguage = newLanguage;
      this.render();
    }
  }

  checkLanguageChange() {
    this.handleLanguageChange();
  }

  render() {
    if (!this.footerElement) return;

    if (this.currentLanguage === "ar") {
      this.footerElement.innerHTML = `
        <p>@ <span class="font-noto-kufi-arabic">حقوق النشر</span> 2025 Ooredoo </p>
      `;
    } else {
      this.footerElement.innerHTML = `
        <p>&copy; Copyright 2025 Ooredoo</p>
      `;
    }
  }

  // ✅ 1️⃣ First modal with Confirm / Cancel
  showFirstModal() {
    const language = this.currentLanguage;
    const isRTL = language === "ar";
    const dirAttribute = isRTL ? 'dir="rtl"' : "";
    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";
    const title = language === "ar" ? "شاهد!" : "SHAHID !";
    const message =
      language === "ar"
        ? "استفد من دخول إلى تطبيق شاهد صالح إلى غاية يوم/شهر/سنة."
        : "Profitez d'un accès à Shahid Mobile valable jusqu'au jj/mm/aaaa.";

    // Create modal overlay
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-[9999] flex items-center justify-center p-4 forfait-modal-fade";
    modal.style.backgroundColor = "rgba(105, 105, 105, 0.8)";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    // Modal HTML
    modal.innerHTML = `
      <div class="relative bg-white dark:bg-[#2C2C2C] rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl min-w-[320px] px-6 md:px-8 pt-16 pb-8 md:pb-12" ${dirAttribute}>
        <button id="modal-close-btn" type="button" aria-label="Close modal"
          class="absolute top-[15px] right-[15px] w-[24px] h-[24px] md:w-[34px] md:h-[34px] flex items-center justify-center rounded-full bg-ooredoo-red text-white z-20">
          <img src="./assets/images/Close.svg" alt="close" class="w-8 h-8"/>
        </button>

        <div class="text-center mb-6">
          <h2 id="modal-title" class="font-semibold ${language === "ar" ? "font-noto-kufi-arabic" : "font-rubik"} text-ooredoo-red dark:text-white text-xl md:text-3xl uppercase tracking-tight">
            ${title}
          </h2>
        </div>
        <div class="text-center mb-10">
          <p class="${fontClass} text-gray-800 dark:text-gray-200 leading-relaxed text-base md:text-lg px-2">
            ${message}
          </p>
        </div>

        <div class="flex justify-center gap-4 text-base">
          <button id="modal-cancel-btn"
            class="flex items-center justify-center bg-white border border-ooredoo-red text-ooredoo-red px-6 h-12 w-[145px] sm:w-[150px] rounded-full font-medium transition">
            ${language === "ar" ? "إلغاء" : "ANNULER"}
          </button>
          <button id="modal-confirm-btn"
            class="flex items-center justify-center bg-ooredoo-red text-white px-6 h-12 w-[145px] sm:w-[150px] rounded-full font-medium transition">
            ${language === "ar" ? "تفعيل" : "ACTIVER"}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();

    modal.querySelector("#modal-close-btn").addEventListener("click", closeModal);
    modal.querySelector("#modal-cancel-btn").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Confirm → open second modal
    modal.querySelector("#modal-confirm-btn").addEventListener("click", () => {
      closeModal();
      this.showSecondModal(language);
    });
  }

  // ✅ 2️⃣ Second modal with OK
  showSecondModal(language) {
    const isRTL = language === "ar";
    const dirAttribute = isRTL ? 'dir="rtl"' : "";
    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

    const title = language === "ar" ? "شاهد!" : "SHAHID !";
    const message =
      language === "ar"
        ? "لقد تم تفعيل خدمة شاهد ! بعد قليل، ستصلك رسالة قصيرة تحتوي على رابط"
        : "Service Shahid activé ! Vous recevrez un SMS avec un lien sous peu.";

    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-[9999] flex items-center justify-center p-4 forfait-modal-fade";
    modal.style.backgroundColor = "rgba(105, 105, 105, 0.8)";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    modal.innerHTML = `
      <div class="relative bg-white dark:bg-[#2C2C2C] rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl min-w-[320px] px-6 md:px-8 pt-16 pb-8 md:pb-12" ${dirAttribute}>
        <button id="modal-close-btn" type="button" aria-label="Close modal"
          class="absolute top-[15px] right-[15px] w-[24px] h-[24px] md:w-[34px] md:h-[34px] flex items-center justify-center rounded-full bg-ooredoo-red text-white z-20">
          <img src="./assets/images/Close.svg" alt="close" class="w-8 h-8"/>
          </button>

        <div class="text-center mb-6">
          <h2 id="modal-title" class="font-semibold ${language === "ar" ? "font-noto-kufi-arabic" : "font-rubik"} text-ooredoo-red dark:text-white text-xl md:text-3xl uppercase tracking-tight">
            ${title}
          </h2>
        </div>
        <div class="text-center mb-10">
          <p class="${fontClass} text-gray-800 dark:text-gray-200 leading-relaxed text-base md:text-lg px-2">
            ${message}
          </p>
        </div>

        <div class="flex justify-center text-base">
          <button id="modal-ok-btn"
            class="bg-ooredoo-red text-white px-6 h-12 w-[120px] sm:w-[150px] rounded-full font-medium transition">
            ${language === "ar" ? "تم" : "OK"}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();

    modal.querySelector("#modal-close-btn").addEventListener("click", closeModal);
    modal.querySelector("#modal-ok-btn").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  destroy() {
    this.unbindEvents();
  }
}
