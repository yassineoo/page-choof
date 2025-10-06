export const offerData = {
  fr: [
    {
      planName: "Gold Jdida 2000",
      description:
        "60Go + appels illimités vers Ooredoo + 5000 DA de crédit ",
      price: "2000",
      duration: "30 jours",
    },
    {
      planName: "Gold Jdida 1500",
      description:
        "20Go + appels illimités vers Ooredoo + 3000 DA de crédit ",
      price: "1500",
      duration: "30 jours",
    },
    {
      planName: "Gold Jdida 1000",
      description:
        "6Go + appels illimités vers Ooredoo + 2000 DA de crédit ",
      price: "1000",
      duration: "30 jours",
    },
  ],
  ar: [
    {
      planName: "Gold Jdida 2000",
      description:
        "حجم 60Go إنترنت + مكالمات غير محدودة نحو ooredoo و5000 دج رصيد",
      price: "2000",
      duration: "<span class=\"font-rubik\">30</span> يوم",
    },
    {
      planName: "Gold Jdida 1500",
      description:
        "حجم 20Go إنترنت + مكالمات غير محدودة نحو ooredoo و3000 دج رصيد",
      price: "1500",
      duration: "<span class=\"font-rubik\">30</span> يوم",
    },
    {
      planName: "Gold Jdida 1000",
      description:
        "حجم 6Go إنترنت + مكالمات غير محدودة نحو ooredoo و2000 دج رصيد",
      price: "1000",
      duration: "<span class=\"font-rubik\">30</span> يوم",
    },
  ],
  text: {
    fr: {
      helpText: "Aide",
      currentLanguage: "Français",
      renewalLabel: "Renouvellement :",
      autoLabel: "Auto",
      manualLabel: "Manuel",
      changeModeLabel: "Changer de mode",
      manualModalTitle: "MODE DE RECHARGEMENT",
      manualModalDesc:
        'Vous allez activer votre mode de rechargement en "Manuel", vous receverez du crédit non activé à chaque rechargement.',
      manualSuccessTitle: "FÉLICITATIONS !",
      manualSuccessDesc: 'Vous êtes sur le mode "Manuel".',
      autoModalTitle: "MODE DE RECHARGEMENT",
      autoModalDesc:
        'Vous allez modifier votre mode de rechargement en "Automatique" :',
      autoSuccessTitle: "FÉLICITATIONS !",
      autoSuccessDesc: (price, planName) =>
        `Vos prochains rechargements de ${price} DA et plus vous donneront les avantages de ${planName}, après expiration de votre forfait.`,
      cancelBtn: "ANNULER",
      confirmBtn: "CONFIRMER",
      allValidFor: ", le tout valable ",
      okBtn: "OK",
      modifyBtn: "MODIFIER",
      renewalInfoAuto: (name, price) =>
        `Vous êtes actuellement sur le mode "Renouvellement Automatique" de ${name}. Vos rechargements de ${price} DA et plus vous donneront les avantages de ${name}. Si vous souhaitez recevoir du crédit au prochain rechargement ou changer de forfait, cliquez sur la flèche.`,
      renewalInfoManual:
        "Votre renouvellement automatique est désactivé, vous receverez du crédit au prochain rechargements.",
    },
    ar: {
      helpText: "مساعدة",
      currentLanguage: "العربية",
      renewalLabel: "الوضع :",
      autoLabel: "التلقائي",
      manualLabel: "اليدوي",
      changeModeLabel: "تغيير الوضع",
      manualModalTitle: "وضع التعبئة",
      manualModalDesc:
        'ستقوم بتغيير وضع التعبئة إلى "يدوي"، وستحصل على رصيد غير مفعّل عند كل تعبئة.',
      manualSuccessTitle: "هنيئًا!",
      manualSuccessDesc: 'أنت الآن في الوضع "يدوي"',
      autoModalTitle: "وضع التعبئة",
      autoModalDesc: 'ستقوم بتغيير وضع التعبئة إلى "تلقائي":',
      autoSuccessTitle: "هنيئًا!",
      autoSuccessDesc: (price, planName) =>
        `تعبئاتك القادمة بقيمة ${price} دج وأكثر ستمنحك مزايا ${planName}، وهذا بعد انتهاء صلاحية اشتراكك.`,
      cancelBtn: "إلغاء",
      confirmBtn: "تأكيد",
      allValidFor: "، الكل صالح ",
      okBtn: "تم",
      modifyBtn: "التغيير",
      renewalInfoAuto: (name, price) =>
        `أنت الآن في وضع "التجديد التلقائي" لـ ${name}. تعبئاتك بقيمة ${price} دج وأكثر تمنحك مزايا ${name} إذا كنت تريد الحصول على رصيد عند تعبئتك القادمة أو تغيير الاشتراك، اضغط على السهم.`,
      renewalInfoManual:
        "التجديد التلقائي ملغى، ستحصل على رصيد عند تعبئاتك القادمة.",
    },
  },
};