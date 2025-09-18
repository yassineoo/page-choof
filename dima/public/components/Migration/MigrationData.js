export const migrationData = {
  fr: {
    title: "MIGRATION",
    subtitle: "Voulez-vous changer vers une autre offre ?",
    options: [
      { label: "DIMA+", hasCheckbox: true },
      { label: "OOREDOO", hasCheckbox: false },
      { label: "N'YOOZ", hasCheckbox: false },
    ],
    checkboxText:
      "J'atteste avoir lu et accepté les termes et conditions du contrat",
    confirmTitleTemplate: "MIGRATION VERS {offer}",
    confirmDescriptionTemplate:
      "Vous allez changer vers l'offre {offer} gratuitement, ceci peut entraîner la perte de votre forfait en cours.",
    confirmBtn: "CONFIRMER",
    cancelBtn: "ANNULER",
    successTitle: "MIGRATION",
    successMessageTemplate:
      "Vous êtes désormais sur l'offre {offer}. Pour plus d'infos, composez *500#.",
    ok: "OK",
  },
  ar: {
    title: "الهجرة",
    subtitle: "هل تريد التغيير إلى عرض آخر؟",
    options: [
      { label: "ديما+", hasCheckbox: true },
      { label: "أوريدو", hasCheckbox: false },
      { label: "نيوز", hasCheckbox: false },
    ],
    checkboxText: "أشهد أنني قرأت وقبلت الشروط والأحكام التعاقدية",
    confirmTitleTemplate: "الهجرة إلى {offer}",
    confirmDescriptionTemplate:
      "ستقوم بالتغيير إلى العرض {offer} مجانًا، قد يؤدي ذلك إلى فقدان باقتك الحالية.",
    confirmBtn: "تأكيد",
    cancelBtn: "إلغاء",
    successTitle: "الهجرة",
    successMessageTemplate:
      "أنت الآن على العرض {offer}. لمزيد من المعلومات، اطلب *500#.",
    ok: "موافق",
  },
};

export default migrationData;
