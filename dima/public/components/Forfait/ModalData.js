// import ForfaitData from "./ForfaitData.js";

// function formatForfaitName(name, lang) {
//   const isArabic = lang === "ar";
//   const prefix = isArabic ? "اشتراك" : "le forfait";
//   const prefixDeterminent = isArabic ? "" : "le ";

//   const styledName = `<span class="capitalize-text">${name}</span>`;

//   const plainText = name.replace(/<[^>]*>/g, "").trim();
//   const plainPrefix = isArabic ? "اشتراك" : "forfait";

//   if (plainText.toLowerCase().startsWith(plainPrefix.toLowerCase())) {
//     return `${prefixDeterminent} ${styledName}`;
//   }

//   return `${prefix} ${styledName}`;
// }

// function generateModalContent(offers, lang) {
//   const modalContent = {};

//   if (!offers || !Array.isArray(offers)) {
//     return modalContent;
//   }

//   for (const offer of offers) {
//     const isArabic = lang === "ar";

//     const formattedName = formatForfaitName(offer.name, lang);

//     const featuresString = Array.isArray(offer.features)
//       ? offer.features.join(" + ")
//       : offer.features;

//     const fullDescription = `${offer.data} + ${featuresString}, ${
//       isArabic ? "الكل صالح لمدة" : "le tout valable"
//     } ${offer.duration}.`;

//     const successPreamble = isArabic ? ` لقد حصلت على` : `Vous disposez de`;

//     const successDescription = `${offer.data} + ${featuresString}, ${
//       isArabic ? "الكل صالح لمدة" : "le tout valable"
//     } ${offer.duration}.`;

//     const hasShahid = /SHAHID|شاهد/i.test(featuresString || "");

//     const uniqueKey = `${offer.type || "forfait"}-${offer.name}`;

//     modalContent[uniqueKey] = {
//       confirm: fullDescription,
//       success: `${successPreamble} ${successDescription}`,
//       insufficient: isArabic
//         ? `رصيدك غير كافٍ لشراء ${formattedName}. يرجى تعبئة حسابك.`
//         : `Votre crédit est insuffisant pour acheter ${formattedName}. Veuillez recharger votre compte.`,
//       hasShahid: hasShahid,
//     };
//   }
//   return modalContent;
// }

// const allForfaitsFR = [
//   ...(ForfaitData.fr?.internetForfaits || []).map((f) => ({
//     ...f,
//     type: "internet",
//   })),
//   ...(ForfaitData.fr?.smartForfaits || []).map((f) => ({
//     ...f,
//     type: "smart",
//   })),
// ];

// const allForfaitsAR = [
//   ...(ForfaitData.ar?.internetForfaits || []).map((f) => ({
//     ...f,
//     type: "internet",
//   })),
//   ...(ForfaitData.ar?.smartForfaits || []).map((f) => ({
//     ...f,
//     type: "smart",
//   })),
// ];

// export const ModalData = {
//   fr: generateModalContent(allForfaitsFR, "fr"),
//   ar: generateModalContent(allForfaitsAR, "ar"),
// };

// export default ModalData;


import ForfaitData from "./ForfaitData.js";

function formatForfaitName(name, lang) {
  const isArabic = lang === "ar";
  const prefix = isArabic ? "اشتراك" : "le forfait";
  const prefixDeterminent = isArabic ? "" : "le ";

  const styledName = `<span class="capitalize-text">${name}</span>`;

  const plainText = name.replace(/<[^>]*>/g, "").trim();
  const plainPrefix = isArabic ? "اشتراك" : "forfait";

  if (plainText.toLowerCase().startsWith(plainPrefix.toLowerCase())) {
    return `${prefixDeterminent} ${styledName}`;
  }

  return `${prefix} ${styledName}`;
}

function generateModalContent(offers, lang) {
  const modalContent = {};

  if (!offers || !Array.isArray(offers)) {
    return modalContent;
  }

  for (const offer of offers) {
    const isArabic = lang === "ar";

    const formattedName = formatForfaitName(offer.name, lang);

    const featuresString = Array.isArray(offer.features)
      ? offer.features.join(" + ")
      : offer.features;

    const fullDescription = offer.name === "Forfait 500" ? 
    `6Go internet + Coupons Fayda, le tout valable 30 jours. `
    :
    `<span dir="rtl">${offer.data} ${offer.name.includes('Smart') ? ' ' : isArabic ? 'إنترنت ' : 'internet '}</span> + ${featuresString}, ${
      isArabic ? !offer.price === 50 ? "الكل صالح لمدة" : "الكل صالح" : "le tout valable"
    } ${offer.duration}.`;

    const successPreamble = isArabic ? ` لقد حصلت على` : ` Vous disposez de`;

    const successDescription = offer.name === "اشتراك <span class='font-rubik'>500</span>" ? 
    `لقد حصلت على 6Go  إنترنت + تخفيضات عند شركائنا، الكل صالح 30 يوم. حمّل التطبيق فايدة واستفد من المزايا!  ` 
    : 
    offer.name === "Forfait 500" ?
    `6Go attribués + des réductions en illimité chez nos partenaires, valables 30 jours. Téléchargez l’application Fayda et profitez-en! `
    :
    `<span dir="rtl">${offer.data} ${offer.name.includes('Smart') ? '' : isArabic ? 'إنترنت ' : 'internet '}</span> + ${featuresString}, ${
      isArabic ? "الكل صالح" : "le tout valable"
    } ${offer.duration}.`;

    const hasShahid = /SHAHID|شاهد/i.test(featuresString || "");

    const uniqueKey = `${offer.type || "forfait"}-${offer.name}`;

    modalContent[uniqueKey] = {
      confirm: fullDescription,
      success: `${offer.name === "Forfait 500" ? '' : offer.name === "اشتراك <span class='font-rubik'>500</span>" ? '' : successPreamble} ${successDescription}`,
      insufficient: isArabic
        ? `رصيدك غير كافٍ لشراء ${formattedName}. يرجى تعبئة حسابك.`
        : `Votre crédit est insuffisant pour acheter ${formattedName}. Veuillez recharger votre compte.`,
      hasShahid: hasShahid,
    };
  }
  return modalContent;
}

const allForfaitsFR = [
  ...(ForfaitData.fr?.forfaits || []).map((f) => ({ ...f, type: "forfait" })),
  ...(ForfaitData.fr?.internetForfaits || []).map((f) => ({
    ...f,
    type: "internet",
  })),
  ...(ForfaitData.fr?.smartForfaits || []).map((f) => ({
    ...f,
    type: "smart",
  })),
];

const allForfaitsAR = [
  ...(ForfaitData.ar?.forfaits || []).map((f) => ({ ...f, type: "forfait" })),
  ...(ForfaitData.ar?.internetForfaits || []).map((f) => ({
    ...f,
    type: "internet",
  })),
  ...(ForfaitData.ar?.smartForfaits || []).map((f) => ({
    ...f,
    type: "smart",
  })),
];

export const ModalData = {
  fr: generateModalContent(allForfaitsFR, "fr"),
  ar: generateModalContent(allForfaitsAR, "ar"),
};

export default ModalData;