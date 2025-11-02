export const offerData = {
  fr: [
    {
      planName: "DIMA 4000",
      description:
        "200Go + appels illimités vers tous + SMS illimités vers Ooredoo + 200 SMS vers tous",
      price: "4000",
      duration: "30 jours",
    },
    {
      planName: "DIMA 2500",
      description:
        "100Go + appels illimités vers tous + SMS illimités vers Ooredoo + 100 SMS vers les autres réseaux nationaux + Facebook + ANAZIK, ANAFLIX et Shahid",
      price: "2500",
      duration: "30 jours",
    },
    {
      planName: "DIMA 1500",
      description:
        "30Go + 150 min + appels illimités vers Ooredoo + 150 SMS valables vers tous les réseaux nationaux + Facebook et ANAFLIX",
      price: "1500",
      duration: "30 jours",
    },
    {
      planName: "DIMA 1200",
      description:
        "8Go + 100 min + appels illimités vers Ooredoo + 120 SMS valables vers tous les réseaux nationaux + Facebook et ANAZIK",
      price: "1200",
      duration: "30 jours",
    },
    {
      planName: "DIMA 750",
      description:
        "10Go + 100 min + appels illimités vers Ooredoo + 50 SMS valables vers tous les réseaux nationaux et Facebook",
      price: "750",
      duration: "14 jours",
    },
    {
      planName: "DIMA 500 HADRA",
      description:
        "100 min et 100 SMS valables vers tous les réseaux nationaux + appels illimités vers Ooredoo",
      price: "500",
      duration: "30 jours",
    },
    {
      planName: "DIMA 500",
      description:
        "3Go + 100 min + appels illimités vers Ooredoo + 50 SMS valables vers tous les réseaux nationaux et Facebook",
      price: "500",
      duration: "15 jours",
    },
  ],
  ar: [
    {
      planName: "DIMA 4000",
      description:
        "حجم 200Go إنترنت + مكالمات غير محدودة نحو الكل + رسائل قصيرة غير محدودة نحو Ooredoo و 200 رسالة قصيرة نحو الك",
      price: "4000",
      duration: "30 يوم",
    },
    {
      planName: "DIMA 2500",
      description:
        "حجم 100Go إنترنت + مكالمات غير محدودة نحو الكل + رسائل قصيرة غير محدودة نحو Ooredoo و 100 رسالة قصيرة نحو الشبكات الأخرى + فايسبوك و ANAFLIX و ANAZIK وشاهد",
      price: "2500",
      duration: "30 يوم",
    },
    {
      planName: "DIMA 2000",
      description:
        "حجم 50Go إنترنت + 300 دقيقة + مكالمات غير محدودة نحو Ooredoo و 200 رسالة قصيرة صالحة نحو كل الشبكات الوطنية + فايسبوك و ANAZIK و ANAFLIX",
      price: "2000",
      duration: "30 يوم",
    },
    {
      planName: "DIMA 1500",
      description:
        "حجم 30Go إنترنت + 150 دقيقة + مكالمات غير محدودة نحو Ooredoo و 150 رسالة قصيرة صالحة نحو كل الشبكات الوطنية + فايسبوك و ANAFLIX",
      price: "1500",
      duration: "30 يوم",
    },
    {
      planName: "DIMA 1200",
      description:
        "حجم 10Go إنترنت + 100 دقيقة + مكالمات غير محدودة نحو Ooredoo و 120 رسالة قصيرة صالحة نحو كل الشبكات الوطنية + فايسبوك و ANAZIK",
      price: "1200",
      duration: "30 يوم",
    },
    {
      planName: "DIMA 750",
      description:
        "حجم 10Go إنترنت + 100 دقيقة + مكالمات غير محدودة نحو Ooredoo و 50 رسالة قصيرة صالحة نحو كل الشبكات",
      price: "750",
      duration: "14 يوم",
    },
    {
      planName: "Dima 500 Hadra",
      description:
        "مكالمات 100 دقيقة و 100 رسالة قصيرة صالحة نحو كل الشبكات الوطنية + مكالمات غير محدودة نحو Ooredoo",
      price: "500",
      duration: "30 يوم",
    },
    {
      planName: "DIMA 500",
      description:
        "حجم 3Go إنترنت + 100 دقيقة + مكالمات غير محدودة نحو Ooredoo و 50 رسالة قصيرة صالحين نحو كل الشبكات الوطنية + فايسبوك",
      price: "500",
      duration: "15 يوم",
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
        'Vous allez modifier votre mode de rechargement "Automatique" :',
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
      renewalLabel: "التجديد :",
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
