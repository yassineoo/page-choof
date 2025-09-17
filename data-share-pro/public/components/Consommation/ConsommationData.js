export const consommationData = {
  fr: {
    title: "Mon compte",
    charge: "Recharger mon compte",
    cards: [
      {
        icon: "rocket",
        title: "Crédit",
        sections: [
          {
            subIcon: "dollar-phone",
            subtitle: "Crédit recharge",
            value: "4000",
            date: "26/05/25",
            unit: "DA",
          },
        ],
      },
      {
        icon: "internet",
        title: "Internet",
        sections: [
          {
            subIcon: "internet",
            subtitle: "Internet offert",
            value: "1",
            unit: "To",
            date: "26/05/25",
            percentage: 50,
            extra: "/2To",
          },
          {
            subIcon: "internet",
            subtitle: "Internet mensuel",
            value: "15",
            unit: "Go",
            date: "26/05/25",
            percentage: 100,
            extra: "/15Go",
          },
          {
            subIcon: "internet",
            subtitle: "Consommation en Mo",
            value: "700",
            unit: "Mo",
            date: "26/05/25",
          },
          {
            subIcon: "internet",
            subtitle: "Seuil de consommation total",
            value: "80",
            unit: "Go",
            date: "26/05/25",
          },
        ],
      },
    ],
  },
  ar: {
    title: "حسابي",
    charge: "تعبئة رصيدي",
    cards: [
      {
        icon: "rocket",
        title: "الرصيد",
        sections: [
          {
            subIcon: "dollar-phone",
            subtitle: "رصيد التعبئة",
            value: '<span class="font-rubik">4000</span>',
            unit: "دج",
            date: "26/05/25",
          },
        ],
      },
      {
        icon: "internet",
        title: "الإنترنت",
        sections: [
          {
            subIcon: "internet",
            subtitle: "إنترنت مُهدى",
            value: "1",
            unit: "To",
            date: "26/05/25",
            percentage: 50,
            extra: "/2To",
          },
          {
            subIcon: "internet",
            subtitle: "إنترنت شهري",
            value: "25",
            unit: "Go",
            date: "26/05/25",
            percentage: 100,
            extra: "/500"
          },
          {
            subIcon: "internet",
            subtitle: "الاستهلاك بالـ <span class=\"font-rubik\">Mo</span>",
            value: "700",
            unit: "Mo",
            date: "26/05/25",
          },
          {
            subIcon: "internet",
            subtitle: "الحد الإجمالي للاستهلاك",
            value: "80",
            unit: "Go",
            date: "26/05/25",
          },
        ],
      },
    ],
  },
};
