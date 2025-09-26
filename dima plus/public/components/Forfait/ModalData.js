import ForfaitData from "./ForfaitData.js";

function generateModalContent(offers, lang) {
  const modalContent = {};

  if (!offers || !Array.isArray(offers)) {
    return modalContent;
  }

  for (const offer of offers) {
    const isArabic = lang === "ar";

    const featuresString = Array.isArray(offer.features)
      ? offer.features.join(" + ")
      : offer.features;

    const fullDescription = `${offer.data} + ${featuresString}, ${
      isArabic ? "الكل صالح لمدة" : "le tout valable"
    } ${offer.duration}.`;

    const successPreamble = isArabic ? ` لقد حصلت على` : `Vous avez reçu`;

    const successDescription = `${offer.data} + ${featuresString}, ${
      isArabic ? "الكل صالح لمدة" : "le tout valable"
    } ${offer.duration}.`;

    const hasShahid = /SHAHID|شاهد/i.test(featuresString || "");

    const uniqueKey = `${offer.type || "forfait"}-${offer.name}`;

    modalContent[uniqueKey] = {
      confirm: fullDescription,
      success: `${successPreamble} ${successDescription}`,
      insufficient: isArabic
        ? `رصيدك غير كافٍ لشراء اشتراك ${offer.name}. يرجى تعبئة حسابك.`
        : `Votre crédit est insuffisant pour acheter le forfait ${offer.name}. Veuillez recharger votre compte.`,
      hasShahid: hasShahid,
    };
  }
  return modalContent;
}

const allForfaitsFR = [
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
