// public/components/Modals/Modals.js
export default class Modals {
  static render() {
    if (document.getElementById('global-modals-root')) return;
    const root = document.createElement('div');
    root.id = 'global-modals-root';
    document.body.appendChild(root);

    root.innerHTML = `
      <div id="modal-overlay" class="hidden fixed inset-0 z-[9999] flex items-center justify-center bg-[#696969CC]">
        <div class="relative bg-white rounded-[18px] shadow-xl w-full max-w-[640px] mx-auto px-8 pt-14 pb-10">
          <button class="absolute top-6 right-6 p-2 z-10" id="modal-close-btn" aria-label="Fermer" tabindex="0">
            <img src="/assets/images/Close.svg" alt="close" style="width:34px;height:34px;display:block"/>
          </button>
          <div id="modal-title" class="font-rubik font-semibold text-ooredoo-red text-[34px] leading-[55.86px] uppercase text-center tracking-[-0.02em] mb-6">
            <!-- title -->
          </div>
          <div id="modal-message" class="font-rubik text-[#262626] leading-snug text-center max-w-[70%] mx-auto mb-8">
            <!-- message -->
          </div>
          <div id="modal-buttons" class="flex flex-wrap justify-center gap-3">
            <!-- buttons -->
          </div>
        </div>
      </div>
    `;

    // Close events
    document.getElementById('modal-close-btn').onclick = () => Modals.close();
    document.getElementById('modal-overlay').onclick = e => {
      if (e.target.id === 'modal-overlay') Modals.close();
    };
  }

  static open({ type, title, message, onConfirm, isArabic = false }) {
    const overlay = document.getElementById('modal-overlay');
    const titleEl = document.getElementById('modal-title');
    const msgEl = document.getElementById('modal-message');
    const btnsEl = document.getElementById('modal-buttons');

    titleEl.textContent = title;
    msgEl.innerHTML = message;

    const primaryBtn = `flex items-center justify-center rounded-full bg-[#e50012] text-white font-rubik font-semibold uppercase text-sm min-w-[7rem] py-2 px-5 hover:bg-[#e50012]/90 transition`;
    const secondaryBtn = `flex items-center justify-center rounded-full bg-white border border-[#ED1C24] text-[#ED1C24] font-rubik font-semibold uppercase text-sm min-w-[7rem] py-2 px-5 hover:bg-[#ED1C24]/90 transition`;

    let buttonsHTML = '';
    if (type === 'buy') {
      buttonsHTML = `
        <button class="${secondaryBtn}" id="modal-cancel">${isArabic ? 'إلغاء' : 'Annuler'}</button>
        <button class="${primaryBtn}" id="modal-confirm">${isArabic ? 'تأكيد' : 'Confirmer'}</button>
      `;
    } else if (type === 'congrats') {
      buttonsHTML = `<button class="${secondaryBtn}" id="modal-close">${isArabic ? 'إغلاق' : 'Fermer'}</button>`;
    } else if (type === 'credit') {
      buttonsHTML = `<button class="${primaryBtn}" id="modal-close">${isArabic ? 'حسنًا' : 'OK'}</button>`;
    }
    btnsEl.innerHTML = buttonsHTML;

    // Bind button events
    if (type === 'buy') {
      document.getElementById('modal-cancel').onclick = () => Modals.close();
      document.getElementById('modal-confirm').onclick = () => {
        Modals.close();
        if (onConfirm) onConfirm();
      };
    } else {
      document.getElementById('modal-close').onclick = () => Modals.close();
    }

    overlay.classList.remove('hidden');
  }

  static close() {
    document.getElementById('modal-overlay').classList.add('hidden');
  }
}
