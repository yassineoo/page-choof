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

    const hasShahid = (featuresString || "").toUpperCase().includes("SHAHID");

    modalContent[offer.name] = {
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
  ...(ForfaitData.fr?.forfaits || []),
  ...(ForfaitData.fr?.internetForfaits || []),
  ...(ForfaitData.fr?.smartForfaits || []),
];

const allForfaitsAR = [
  ...(ForfaitData.ar?.forfaits || []),
  ...(ForfaitData.ar?.internetForfaits || []),
  ...(ForfaitData.ar?.smartForfaits || []),
];

export const ModalData = {
  fr: generateModalContent(allForfaitsFR, "fr"),
  ar: generateModalContent(allForfaitsAR, "ar"),
};

export default ModalData;
