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

    const fullDescription = `<span dir="ltr">${offer.data}</span> + ${featuresString}, ${
      isArabic ? "الكل صالح لمدة" : "le tout valable"
    } ${offer.duration}.`;

    const successPreamble = isArabic ? ` لقد حصلت على` : `Vous avez reçu`;

    const successDescription = `<span dir="ltr">${offer.data}</span> + ${featuresString}, ${
      isArabic ? "الكل صالح لمدة" : "le tout valable"
    } ${offer.duration}.`;

    const hasShahid = /SHAHID|شاهد/i.test(featuresString || "");

    const uniqueKey = `${offer.type || "forfait"}-${offer.name}`;

    modalContent[uniqueKey] = {
      confirm: fullDescription,
      success: `${successPreamble} ${successDescription}`,
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
