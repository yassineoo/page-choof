export const offerData = {
  fr: [
    {
      planName: "DIMA 4000",
      description:
        "200Go + appels illimités vers tous + SMS illimités vers Ooredoo + 200 SMS vers tous.",
      price: "4000",
      duration: "30 jours",
    },
    {
      planName: "DIMA 2500",
      description:
        "100Go + appels illimités vers tous + SMS illimités vers Ooredoo + 100 SMS vers les autres réseaux nationaux + Facebook + ANAZIK, ANAFLIX et Shahid.",
      price: "2500",
      duration: "30 jours",
    },
    {
      planName: "DIMA 1500",
      description:
        "30Go + 150 min + appels illimités vers Ooredoo + 150 SMS valables vers tous les réseaux nationaux + Facebook et ANAFLIX.",
      price: "1500",
      duration: "30 jours",
    },
    {
      planName: "DIMA 1200",
      description:
        "8Go + 100 min + appels illimités vers Ooredoo + 120 SMS valables vers tous les réseaux nationaux + Facebook et ANAZIK.",
      price: "1200",
      duration: "30 jours",
    },
    {
      planName: "DIMA 750",
      description:
        "10Go + 100 min + appels illimités vers Ooredoo + 50 SMS valables vers tous les réseaux nationaux et Facebook.",
      price: "750",
      duration: "14 jours",
    },
    {
      planName: "DIMA 500 HADRA",
      description:
        "100 min et 100 SMS valables vers tous les réseaux nationaux + appels illimités vers Ooredoo.",
      price: "500",
      duration: "30 jours",
    },
    {
      planName: "DIMA 500",
      description:
        "3Go + 100 min + appels illimités vers Ooredoo + 50 SMS valables vers tous les réseaux nationaux et Facebook.",
      price: "500",
      duration: "15 jours",
    },
  ],
  ar: [
    {
      planName: "ديما 4000",
      description:
        "200Go + مكالمات غير محدودة نحو الجميع + رسائل قصيرة غير محدودة نحو Ooredoo + 200 رسالة قصيرة نحو كل الشبكات.",
      price: "4000",
      duration: "30 يومًا",
    },
    {
      planName: "ديما 2500",
      description:
        "100Go + مكالمات غير محدودة نحو الجميع + رسائل قصيرة غير محدودة نحو Ooredoo + 100 رسالة قصيرة نحو الشبكات الوطنية الأخرى + Facebook + ANAZIK و ANAFLIX و Shahid.",
      price: "2500",
      duration: "30 يومًا",
    },
    {
      planName: "ديما 1500",
      description:
        "30Go + 150 دقيقة + مكالمات غير محدودة نحو Ooredoo + 150 رسالة قصيرة صالحة نحو كل الشبكات الوطنية + Facebook و ANAFLIX.",
      price: "1500",
      duration: "30 يومًا",
    },
    {
      planName: "ديما 1200",
      description:
        "8Go + 100 دقيقة + مكالمات غير محدودة نحو Ooredoo + 120 رسالة قصيرة صالحة نحو كل الشبكات الوطنية + Facebook و ANAZIK.",
      price: "1200",
      duration: "30 يومًا",
    },
    {
      planName: "ديما 750",
      description:
        "10Go + 100 دقيقة + مكالمات غير محدودة نحو Ooredoo + 50 رسالة قصيرة صالحة نحو كل الشبكات الوطنية و Facebook.",
      price: "750",
      duration: "14 يومًا",
    },
    {
      planName: "ديما 500 هدرة",
      description:
        "100 دقيقة و 100 رسالة قصيرة صالحة نحو كل الشبكات الوطنية + مكالمات غير محدودة نحو Ooredoo.",
      price: "500",
      duration: "30 يومًا",
    },
    {
      planName: "ديما 500",
      description:
        "3Go + 100 دقيقة + مكالمات غير محدودة نحو Ooredoo + 50 رسالة قصيرة صالحة نحو كل الشبكات الوطنية و Facebook.",
      price: "500",
      duration: "15 يومًا",
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
      modifyBtn: "MODIFIER",
      renewalInfoAuto: (name, price) =>
        `Vous êtes actuellement sur le mode "Renouvellement Automatique" de ${name}. Vos rechargements de ${price} DA et plus vous donneront les avantages de ${name}. Si vous souhaitez recevoir du crédit au prochain rechargement ou changer de forfait, cliquez sur la flèche.`,
      renewalInfoManual:
        "Votre renouvellement automatique est désactivé, vous receverez du crédit au prochain rechargements.",
    },
    ar: {
      helpText: "مساعدة",
      currentLanguage: "العربية",
      renewalLabel: "التجديد",
      autoLabel: "التلقائي",
      manualLabel: "اليدوي",
      changeModeLabel: "تغيير الوضع",
      manualModalTitle: "وضع التعبئة",
      manualModalDesc:
        'ستقوم بتغيير وضع التعبئة إلى "يدوي"، وستحصل على رصيد غير مفعّل عند كل تعبئة.',
      manualSuccessTitle: "هنيئًا!",
      manualSuccessDesc: 'أنت الآن في الوضع "يدوي"',
      autoModalTitle: "وضع التعبئة",
      autoModalDesc: 'ستقوم بتغيير وضع التعبئة  "التلقائي":',
      autoSuccessTitle: "مبروك!",
      autoSuccessDesc: (price, planName) =>
        `تعبئاتك القادمة بقيمة ${price} دج وأكثر ستمنحك مزايا ${planName}، وهذا بعد انتهاء صلاحية اشتراكك.`,
      cancelBtn: "إلغاء",
      confirmBtn: "تأكيد",
      modifyBtn: "تعديل",
      renewalInfoAuto: (name, price) =>
        `أنت الآن في وضع "التجديد التلقائي" لـ ${name}. تعبئاتك بقيمة ${price} دج وأكثر تمنحك مزايا ${name} إذا كنت تريد الحصول على رصيد عند تعبئتك القادمة أو تغيير الاشتراك، اضغط على السهم..`,
      renewalInfoManual:
        "التجديد التلقائي ملغى، ستحصل على رصيد عند تعبئاتك القادمة.",
    },
  },
};
