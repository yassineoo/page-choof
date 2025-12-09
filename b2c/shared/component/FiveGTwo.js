// import { data, dialogData } from "./constants.js";

// export default function FiveGTwo(lang) {
//   return `
// <div class="relative">

//   <div class="p-4 flex items-center justify-between bg-[#ED1C24]">

//     <div class="flex items-center gap-2">
//       <span class="p-2 bg-white rounded-full">
//         <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 38 23" fill="none">
//           <path d="M37.0172 10.8532H27.8026C27.579 10.8532 27.3823 10.9247 27.2169 11.0678C27.0515 11.2109 26.9486 11.3942 26.9129 11.6177L26.5194 14.0678C26.4881 14.2735 26.5284 14.4478 26.6491 14.5909C26.7698 14.734 26.9397 14.8055 27.1677 14.8055H31.6297C30.2303 16.263 28.0127 17.1751 26.0053 17.0767C22.9516 16.9292 20.8324 14.3987 21.1766 11.3226C21.5701 7.85767 24.8026 4.98286 28.2318 4.98286C30.3823 4.98286 32.0947 6.11401 32.8905 7.81296C33.1141 8.28688 33.6863 8.46572 34.2318 8.23323L37.0172 7.03949C37.6029 6.78912 37.9427 6.12295 37.7325 5.59985C36.2705 2.02757 32.6804 -0.310734 28.1558 0.0335283C22.8622 0.435913 17.9084 4.56706 16.4911 9.78018C14.6893 16.4285 18.9904 22.0753 25.4956 22.0753C31.2676 22.0753 36.4807 17.6222 37.8577 11.9709C38.0008 11.3763 37.6029 10.8711 37.0127 10.8621L37.0172 10.8532Z" fill="#ED1C24"/>
//           <path d="M13.4533 8.52922C12.3982 7.86752 11.0301 7.5322 9.34004 7.5322C8.60233 7.5322 7.95404 7.5948 7.39518 7.71998C7.11798 7.78258 6.84972 7.85858 6.59041 7.948L7.63661 4.179H15.0226C15.7871 4.179 16.5114 3.55754 16.6321 2.79301L16.8691 1.31313C16.9809 0.615662 16.507 0.0478516 15.805 0.0478516H5.02558C4.53825 0.0478516 4.07327 0.414469 3.94361 0.897331L1.55166 9.83921C1.46671 10.1522 1.53825 10.4651 1.73944 10.6708L2.79905 11.7662C3.09413 12.0702 3.58594 12.1104 4.02409 11.8869C4.41753 11.6902 4.81992 11.5292 5.24466 11.4085C5.92424 11.2118 6.65747 11.1134 7.43542 11.1134C8.21336 11.1134 8.89294 11.252 9.46522 11.5337C10.0375 11.8154 10.4578 12.2133 10.7216 12.7319C10.9853 13.2505 11.0569 13.872 10.9451 14.5963C10.8333 15.3027 10.5606 15.9152 10.1269 16.4473C9.69771 16.9748 9.15226 17.3817 8.50397 17.6589C7.85121 17.9405 7.11351 18.0791 6.29085 18.0791C6.26403 18.0791 6.24167 18.0791 6.21932 18.0791L1.73944 18.0836C1.01962 18.0836 0.340036 18.6693 0.228262 19.3891L0.0181274 20.9137C-0.107059 21.7051 0.429454 22.3444 1.21634 22.3444H5.57103C5.6381 22.3444 5.70516 22.3444 5.77223 22.3444C7.5919 22.3444 9.22379 22.0225 10.6724 21.3787C12.1165 20.7349 13.3058 19.8452 14.2357 18.7051C15.1657 17.565 15.7469 16.2684 15.9794 14.8198C16.1895 13.492 16.0867 12.2803 15.6664 11.185C15.2461 10.0851 14.5084 9.20433 13.4578 8.54264L13.4533 8.52922Z" fill="#ED1C24"/>
//         </svg>
//       </span>

//       <p class="text-[22.65px] text-white">
//         ${data[lang].description}
//       </p>
//     </div>

//     <button 
//       class="py-3 uppercase font-medium text-ooredoo-red px-4 w-[171px] rounded-full text-[14px] bg-white flex items-center justify-center"
//       onclick="document.getElementById('dialog1').style.display='flex'"
//     >
//       ${data[lang].buttonText}
//     </button>
//   </div>

//   <!-- FIRST DIALOG -->
//   <div id="dialog1" style="display:none"
//        class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
//        onclick="if(event.target.id==='dialog1'){ this.style.display='none'; }">

//     <div class="bg-white w-[90%] max-w-[703px] rounded-2xl p-6 text-center relative"
//          onclick="event.stopPropagation()">

//       <!-- CLOSE BUTTON -->
//       <button 
//         class="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#ED1C24] text-white flex items-center justify-center text-xl"
//         onclick="document.getElementById('dialog1').style.display='none'"
//       >
//       <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
//         <rect width="34" height="34" rx="17" fill="#ED1C24"/>
//         <path d="M23 11L11 23M11 11L23 23" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//       </svg>
//       </button>

//       <h2 class="text-3xl text-[#ED1C24] font-semibold font-bold uppercase mt-2 mb-4">${dialogData[lang].dialog1Title}</h2>

//       <p class="text-gray-700 my-4">${dialogData[lang].dialog1Message}</p>

//       <label class="flex items-center gap-3 justify-center my-6 cursor-pointer">
//         <input id="acceptCheck" type="checkbox"
//                class="w-5 h-5 accent-[#ED1C24]"
//                onclick="
//                  document.getElementById('confirm1').disabled = !this.checked;
//                  document.getElementById('confirm1').style.opacity = this.checked ? '1' : '0.5';
//                "
//         />
//         <span>J'accepte <a class="underline text-blue-600" href="../assets/conditions-fr.pdf">les conditions d'utilisation</a></span>
//       </label>

//       <div class="flex justify-center items-center gap-3 mt-6">
//         <button 
//           class="flex-1 py-2 border border-[#ED1C24] text-[#ED1C24] font-semibold rounded-full max-w-[200px] uppercase"
//           onclick="document.getElementById('dialog1').style.display='none'"
//         >
//           ${lang === "ar" ? "إلغاء" : "Annuler"}
//         </button>

//         <button 
//           id="confirm1"
//           disabled
//           class="flex-1 py-2 text-white font-semibold rounded-full max-w-[200px] uppercase opacity-50 bg-[#ED1C24]"
//           onclick="
//             document.getElementById('dialog1').style.display='none';
//             document.getElementById('dialog2').style.display='flex';
//           "
//         >
//           ${lang === "ar" ? "تأكيد" : "Confirmer"}
//         </button>
//       </div>
//     </div>
//   </div>

//   <!-- SECOND DIALOG -->
//   <div id="dialog2" style="display:none"
//        class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
//        onclick="if(event.target.id==='dialog2'){ this.style.display='none'; }">

//     <div class="bg-white w-[90%] max-w-[703px] rounded-2xl p-6 text-center relative"
//          onclick="event.stopPropagation()">

//       <!-- CLOSE BUTTON -->
//       <button 
//         class="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#ED1C24] text-white flex items-center justify-center text-xl"
//         onclick="document.getElementById('dialog2').style.display='none'"
//       >
//       <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
// <rect width="34" height="34" rx="17" fill="#ED1C24"/>
// <path d="M23 11L11 23M11 11L23 23" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>
//       </button>

//       <h2 class="text-3xl text-[#ED1C24] font-semibold font-bold uppercase mt-2 mb-4">${dialogData[lang].dialog2Title}</h2>

//       <p class="mb-6">${dialogData[lang].dialog2Message}</p>

//       <button 
//         class="w-full max-w-[200px] h-12 rounded-full bg-[#ED1C24] text-white"
//         onclick="document.getElementById('dialog2').style.display='none'"
//       >
//         ${lang === "ar" ? "حسناً" : "OK"}
//       </button>
//     </div>
//   </div>

// </div>
//   `;
// }


import { data, dialogData } from "./constants.js";

export default function FiveGTwo(lang) {
  return `
<div id="fiveGTwoContainer" class="relative">

  <div class="p-4 flex items-center justify-between bg-[#ED1C24]">

    <div class="flex items-center gap-2">
      <span class="p-2 bg-white rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 38 23" fill="none">
          <path d="M37.0172 10.8532H27.8026C27.579 10.8532 27.3823 10.9247 27.2169 11.0678C27.0515 11.2109 26.9486 11.3942 26.9129 11.6177L26.5194 14.0678C26.4881 14.2735 26.5284 14.4478 26.6491 14.5909C26.7698 14.734 26.9397 14.8055 27.1677 14.8055H31.6297C30.2303 16.263 28.0127 17.1751 26.0053 17.0767C22.9516 16.9292 20.8324 14.3987 21.1766 11.3226C21.5701 7.85767 24.8026 4.98286 28.2318 4.98286C30.3823 4.98286 32.0947 6.11401 32.8905 7.81296C33.1141 8.28688 33.6863 8.46572 34.2318 8.23323L37.0172 7.03949C37.6029 6.78912 37.9427 6.12295 37.7325 5.59985C36.2705 2.02757 32.6804 -0.310734 28.1558 0.0335283C22.8622 0.435913 17.9084 4.56706 16.4911 9.78018C14.6893 16.4285 18.9904 22.0753 25.4956 22.0753C31.2676 22.0753 36.4807 17.6222 37.8577 11.9709C38.0008 11.3763 37.6029 10.8711 37.0127 10.8621L37.0172 10.8532Z" fill="#ED1C24"/>
          <path d="M13.4533 8.52922C12.3982 7.86752 11.0301 7.5322 9.34004 7.5322C8.60233 7.5322 7.95404 7.5948 7.39518 7.71998C7.11798 7.78258 6.84972 7.85858 6.59041 7.948L7.63661 4.179H15.0226C15.7871 4.179 16.5114 3.55754 16.6321 2.79301L16.8691 1.31313C16.9809 0.615662 16.507 0.0478516 15.805 0.0478516H5.02558C4.53825 0.0478516 4.07327 0.414469 3.94361 0.897331L1.55166 9.83921C1.46671 10.1522 1.53825 10.4651 1.73944 10.6708L2.79905 11.7662C3.09413 12.0702 3.58594 12.1104 4.02409 11.8869C4.41753 11.6902 4.81992 11.5292 5.24466 11.4085C5.92424 11.2118 6.65747 11.1134 7.43542 11.1134C8.21336 11.1134 8.89294 11.252 9.46522 11.5337C10.0375 11.8154 10.4578 12.2133 10.7216 12.7319C10.9853 13.2505 11.0569 13.872 10.9451 14.5963C10.8333 15.3027 10.5606 15.9152 10.1269 16.4473C9.69771 16.9748 9.15226 17.3817 8.50397 17.6589C7.85121 17.9405 7.11351 18.0791 6.29085 18.0791C6.26403 18.0791 6.24167 18.0791 6.21932 18.0791L1.73944 18.0836C1.01962 18.0836 0.340036 18.6693 0.228262 19.3891L0.0181274 20.9137C-0.107059 21.7051 0.429454 22.3444 1.21634 22.3444H5.57103C5.6381 22.3444 5.70516 22.3444 5.77223 22.3444C7.5919 22.3444 9.22379 22.0225 10.6724 21.3787C12.1165 20.7349 13.3058 19.8452 14.2357 18.7051C15.1657 17.565 15.7469 16.2684 15.9794 14.8198C16.1895 13.492 16.0867 12.2803 15.6664 11.185C15.2461 10.0851 14.5084 9.20433 13.4578 8.54264L13.4533 8.52922Z" fill="#ED1C24"/>
        </svg>
      </span>

      <p class="text-[22.65px] text-white">
        ${data[lang].description}
      </p>
    </div>

    <div class="flex items-center gap-2">

      <!-- ACTIVER BUTTON -->
      <button 
        class="py-3 uppercase font-medium text-ooredoo-red px-4 w-[171px] rounded-full text-[14px] bg-white flex items-center justify-center"
        onclick="document.getElementById('dialog1').style.display='flex'"
      >
        ${data[lang].buttonText}
      </button>

      <!-- MOBILE CLOSE BUTTON (NEW) -->
      <button 
        class="md:hidden w-10 h-10 rounded-full bg-white flex items-center justify-center"
        onclick="
          if(window.innerWidth <= 768){
            document.getElementById('fiveGTwoContainer').style.display='none';
            document.getElementById('dialog1').style.display='flex';
          }
        "
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 34 34" fill="none">
          <rect width="34" height="34" rx="17" fill="#ED1C24"/>
          <path d="M23 11L11 23M11 11L23 23" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

    </div>
  </div>

  <!-- dialogs remain the same... -->
  ${/* (keep your existing dialog1 & dialog2 here unchanged) */""}

</div>
  `;
}
