// export default class Footer {
//   constructor() {
//     this.currentLanguage = this.getStoredLanguage();
//     this.footerElement = document.getElementById("footer-root");
//     this.init();
//   }

//   init() {
//     this.render();
//     this.bindEvents();
//   }

//   getStoredLanguage() {
//     try {
//       return typeof localStorage !== "undefined" ? localStorage.getItem("language") || "fr" : "fr";
//     } catch (e) {
//       return "fr";
//     }
//   }

//   bindEvents() {
//     // Clean up any existing event listeners first
//     this.unbindEvents();

//     // Bind language change event listener
//     this.boundHandleLanguageChange = this.handleLanguageChange.bind(this);
//     window.addEventListener("languageChanged", this.boundHandleLanguageChange);

//     // Set up polling to check for language changes
//     this.langPoller = setInterval(this.checkLanguageChange.bind(this), 200);

//     // Listen for storage changes (in case language is changed in another tab)
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
//         <p>
//           &copy; Copyright 2025 Ooredoo
//         </p>
//       `;
//     }
//   }

//   // Method to clean up when the component is destroyed
//   destroy() {
//     this.unbindEvents();
//   }
// }


// export default class Footer {
//   constructor() {
//     this.currentLanguage = this.getStoredLanguage();
//     this.footerElement = document.getElementById("footer-root");
//     this.init();
//   }

//   init() {
//     this.render();
//     this.bindEvents();
//     this.showModal(); // 👈 always show on page load
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

//   // ✅ Show modal on every page load
//   showModal() {
//     // Create modal overlay
//     const modalOverlay = document.createElement("div");
//     modalOverlay.style.position = "fixed";
//     modalOverlay.style.top = 0;
//     modalOverlay.style.left = 0;
//     modalOverlay.style.width = "100%";
//     modalOverlay.style.height = "100%";
//     modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
//     modalOverlay.style.display = "flex";
//     modalOverlay.style.alignItems = "center";
//     modalOverlay.style.justifyContent = "center";
//     modalOverlay.style.zIndex = "9999";

//     // Create modal box
//     const modalBox = document.createElement("div");
//     modalBox.style.backgroundColor = "white";
//     modalBox.style.padding = "20px";
//     modalBox.style.borderRadius = "8px";
//     modalBox.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
//     modalBox.style.textAlign = "center";
//     modalBox.style.minWidth = "250px";

//     // Modal content
//     modalBox.innerHTML = `
//       <p style="margin-bottom: 15px; font-weight: 500;">Welcome to Ooredoo!</p>
//       <button id="modal-close-btn"
//         style="
//           background-color: red;
//           color: white;
//           border: none;
//           padding: 10px 16px;
//           border-radius: 6px;
//           cursor: pointer;
//         ">
//         Close
//       </button>
//     `;

//     modalOverlay.appendChild(modalBox);
//     document.body.appendChild(modalOverlay);

//     // Function to close modal
//     const closeModal = () => {
//       modalOverlay.remove();
//     };

//     // Close when clicking the button
//     document.getElementById("modal-close-btn").addEventListener("click", closeModal);

//     // Close when clicking outside the modal box
//     modalOverlay.addEventListener("click", (e) => {
//       if (e.target === modalOverlay) {
//         closeModal();
//       }
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
    this.showStyledModal(); // 👈 modal on every load
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

  // ✅ Modern styled modal (Tailwind-based)
  showStyledModal() {
    const language = this.currentLanguage;
    const isRTL = language === "ar";
    const dirAttribute = isRTL ? 'dir="rtl"' : "";
    const fontClass = isRTL ? "font-noto-kufi-arabic" : "font-rubik";

    const title =
      language === "ar" ? "مرحبًا بك في أوريدو" : "Welcome to Ooredoo";
    const message =
      language === "ar"
        ? "نحن سعداء بزيارتك! اضغط على الزر الأحمر أو خارج المربع لإغلاق النافذة."
        : "We’re glad to have you here! Click the red button or outside the box to close this popup.";

    // Create modal container
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-[9999] flex items-center justify-center p-4 forfait-modal-fade";
    modal.style.backgroundColor = "rgba(105, 105, 105, 0.8)";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "modal-title");

    // Inner box HTML
    modal.innerHTML = `
      <div class="relative bg-white dark:bg-[#2C2C2C] rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl min-w-[320px] px-6 md:px-8 pt-16 pb-8 md:pb-12" ${dirAttribute}>
        <button id="modal-close-btn" type="button" aria-label="Close modal"
          class="forfait-modal-close absolute top-[15px] right-[15px] w-[24px] h-[24px] md:w-[34px] md:h-[34px] flex items-center justify-center rounded-full bg-ooredoo-red text-white z-20">
          <img src="./assets/images/Close.svg" alt="close" class="w-5 h-5 md:w-4 md:h-4"/>
        </button>
        <div class="text-center mb-6">
          <h2 id="modal-title" class="font-semibold text-ooredoo-red dark:text-white text-xl xs:text-2xl md:text-3xl leading-tight uppercase tracking-tight">
            ${title}
          </h2>
        </div>
        <div class="text-center mb-10">
          <p class="${fontClass} text-gray-800 dark:text-gray-200 leading-relaxed text-base md:text-lg px-2">
            ${message}
          </p>
        </div>
        <div class="flex justify-center">
          <button
            id="modal-confirm-btn"
            class="bg-ooredoo-red hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition"
          >
            ${language === "ar" ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    `;

    // Append modal
    document.body.appendChild(modal);

    // Close logic
    const closeModal = () => modal.remove();

    // Button events
    modal.querySelector("#modal-close-btn").addEventListener("click", closeModal);
    modal.querySelector("#modal-confirm-btn").addEventListener("click", closeModal);

    // Click outside to close
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  destroy() {
    this.unbindEvents();
  }
}

