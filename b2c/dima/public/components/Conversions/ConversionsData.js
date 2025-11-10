const conversionsData = {
  fr: {
    title: "CONVERSIONS",
    description: "Voulez-vous convertir votre forfait Dima 2500 en :",
    convertToCredit: "CONVERTIR EN CRÉDIT",
    otherConversions: "AUTRES CONVERSIONS",
    confirmTitle: "Conversion",
    confirmDescription:
      "Vous allez convertir votre forfait Dima 2500 en crédit.",
    cancelBtn: "Annuler",
    confirmBtn: "Confirmer",
    ok: "OK",
    successTitle: "Félicitations !",
    creditSuccessMessage: "Vous avez maintenant 2500 DA de crédit.",
    successDescription:
      "Vous venez de recevoir le forfait {planName} qui vous offre {planDescription}, le tout valable {duration}.",
    convertBtn: "CONVERTIR",
    alreadyOnPlanTitle: "Conversions",
    alreadyOnPlanMessage: "Vous êtes déjà sur la Dima 2500.",
    insufficientCreditTitle: "Conversions",
    insufficientCreditMessage:
      "Votre crédit est insuffisant pour convertir votre forfait.",

    plans: [
      {
        name: "DIMA 2500",
        description:
          "Appels illimités vers tous les réseaux nationaux + 100Go internet + 250 SMS vers tous les réseaux + ANAZIK, ANAFLIX, SHAHID et Facebook gratuits",
        price: 2500,
        duration: "30 jours",
        priceUnit: "DA/",
      },
      {
        name: "DIMA 2000",
        description:
          "50Go internet + 300 min et 200 SMS vers tous les réseaux + appels illimités vers Ooredoo + ANAZIK, ANAFLIX et Facebook gratuits",
        price: 2000,
        duration: "30 jours",
        priceUnit: "DA/",
      },
      {
        name: "DIMA 1500",
        description:
          "30Go internet + 150 min et 150 SMS vers tous les réseaux + appels illimités vers Ooredoo + ANAFLIX et Facebook gratuits",
        price: 1500,
        duration: "30 jours",
        priceUnit: "DA/",
      },
      {
        name: "DIMA 1200",
        description:
          "8Go internet + 100 min et 120 SMS vers tous les réseaux + appels illimités vers Ooredoo + ANAZIK et Facebook gratuits",
        price: 1200,
        duration: "30 jours",
        priceUnit: "DA/",
      },
      {
        name: "DIMA 500",
        description:
          "3Go internet + 100 min et 50 SMS vers tous les réseaux + appels illimités vers Ooredoo",
        price: 500,
        duration: "15 jours",
        priceUnit: "DA/",
      },
      {
        name: "DIMA 500 HADRA",
        description:
          "100 min et 100 SMS vers tous les réseaux nationaux + appels illimités vers Ooredoo",
        price: 500,
        duration: "30 jours",
        priceUnit: "DA/",
      },
    ],
  },
  ar: {
    title: "التحويل",
    description: "هل تريد تحويل اشتراكك Dima 2500 إلى:",
    convertToCredit: "رصيد",
    otherConversions: "عروض أخرى",
    confirmTitle: "التحويل",
    confirmDescription: "هل تريد تحويل اشتراكك Dima 2500 إلى رصيد ؟",
    cancelBtn: "إلغاء",
    confirmBtn: "تأكيد",
    ok: "تم",
    successTitle: "هنيئًا!",
    creditSuccessMessage: "لديك الآن 2000 دج رصيد. ",
    successDescription:
      "لقد حصلت على {planName} الذي يمنحك {planDescription}، الكل صالح لمدة {duration}.",
    convertBtn: "تحويل",

    alreadyOnPlanTitle: "التحويل",
    alreadyOnPlanMessage: "لقد سبق أن تم تفعيل اشتراكك Dima 2500.",
    insufficientCreditTitle: "التحويل",
    insufficientCreditMessage:
      "اشتراكك غير قابل للتحويل، يرجى إعادة تعبئة رصيدك.",

    plans: [
      {
        name: "إشتراك <span class='font-rubik'>DIMA 2500</span>",
        description:
          "100Go إنترنت + مكالمات غير محدودة نحو كل الشبكات + 250 رسائل قصيرة نحو كل الشبكات + فايسبوك و ANAZIK  و ANAFLIX",
        price: 2500,
        duration: "<span class='font-rubik'>30</span> يوم",
        priceUnit: "دج/",
      },
      {
        name: "إشتراك <span class='font-rubik'>DIMA 2000</span>",
        description:
          "50Go إنترنت + 300 دقيقة و 200 رسالة قصيرة نحو كل الشبكات + مكالمات غير محدودة نحو Ooredoo و فايسبوك و ANAZIK و ANAFLIX ",
        price: 2000,
        duration: "<span class='font-rubik'>30</span> يوم",
        priceUnit: "دج/",
      },
      {
        name: "إشتراك <span class='font-rubik'>DIMA 1500</span>",
        description:
          "30Go إنترنت + 150 دقيقة و 150 رسالة قصيرة نحو كل الشبكات + مكالمات غير محدودة نحو Ooredoo و فايسبوك + ANAZIK",
        price: 1500,
        duration: "<span class='font-rubik'>30</span> يوم",
        priceUnit: "دج/",
      },
      {
        name: "إشتراك <span class='font-rubik'>DIMA 1200</span>",
        description:
          "8Go إنترنت + 100 دقيقة و 120 رسالة قصيرة نحو كل الشبكات + مكالمات غير محدودة نحو Ooredoo و فايسبوك + ANAZIK",
        price: 1200,
        duration: "<span class='font-rubik'>30</span> يوم",
        priceUnit: "دج/",
      },
      {
        name: "إشتراك <span class='font-rubik'>DIMA 500</span>",
        description:
          "3Go إنترنت + 100 دقيقة و 50 رسالة قصيرة نحو كل الشبكات + مكالمات غير محدودة نحو Ooredoo وفايسبوك ",
        price: 500,
        duration: "<span class='font-rubik'>15</span> يوم",
        priceUnit: "دج/",
      },
      {
        name: "إشتراك <span class='font-rubik'>DIMA 500 HADRA</span>",
        description:
          "100 دقيقة و 100 رسالة قصيرة نحو كل الشبكات + مكالمات غير محدودة نحو Ooredoo  ",
        price: 500,
        duration: "<span class='font-rubik'>30</span> يوم",
        priceUnit: "دج/",
      },
    ],
  },
};

export default conversionsData;
