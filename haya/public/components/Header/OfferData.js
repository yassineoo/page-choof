export const offerData = {
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
