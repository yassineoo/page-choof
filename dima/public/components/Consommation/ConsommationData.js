export const consommationData = {
  fr: {
    title: 'MA CONSOMMATION',
    charge: 'CHARGER MON COMPTE',
    cards: [
      {
        icon: 'rocket',
        title: 'Crédit',
        sections: [
          { subIcon: 'dollar-phone', subtitle: 'Crédit total', value: '3769.00', unit: 'DA', date: '26/05/25', percentage: 25 },
          { subIcon: 'dollar-phone', subtitle: 'Crédit chargé', value: '1000.00', unit: 'DA', date: '26/05/25', percentage: 25 },
          { subIcon: 'dollar-phone', subtitle: 'Forfait de mois précédent', value: '2769.00', unit: 'DA', date: '26/05/25', percentage: 25 }
        ]
      },
      {
        icon: 'internet',
        title: 'Internet',
        isInternet: true,
        sections: [
          { subIcon: 'internet', subtitle: 'Internet total', value: '109', unit: 'GO', date: '26/05/25', percentage: 80 },
          { subIcon: 'internet', subtitle: 'Internet mensuel', value: '90', unit: 'GO', date: '26/05/25', percentage: 60 },
          { subIcon: 'internet', subtitle: 'Internet journalier', value: '2', unit: 'GO', date: '26/05/25', percentage: 10 },
          { subIcon: 'internet', subtitle: 'Internet de mois précédent', value: '15', unit: 'GO', date: '26/05/25', percentage: 20 }
        ],
        extra: [
          { label: "Historique", value: "10 GO - 15/05/25" },
          { label: "Consommation max", value: "12 GO" }
        ]
      },
      {
        icon: 'Telephone',
        title: 'Appels/SMS',
        sections: [
          { subIcon: 'Telephone', subtitle: 'Appels illimités vers tous les réseaux', infini: true, date: '26/05/25', percentage: 100 },
          { subIcon: 'Sms', subtitle: 'SMS vers tout les réseaux', value: '120', unit: '/250', date: '26/05/25', percentage: 48 }
        ]
      },
      {
        icon: 'services',
        title: 'Mes services',
        isServices: true,
        sections: [
          { subIcon: 'facebook', subtitle: 'Facebook gratuit', infini: true, date: '26/05/25' },
          { subIcon: 'shahid', subtitle: 'SHAHID', infini: true, date: '26/05/25' },
          { subIcon: 'anazik', subtitle: 'Anazik', infini: true, date: '26/05/25' },
          { subIcon: 'anaflix', subtitle: 'Anaflix', infini: true, date: '26/05/25' },
        ]
      }
    ]
  },
  ar: {
  title: 'استهلاك حسابي',
  charge: 'شحن حسابي',
  cards: [
    {
      icon: 'rocket',
      title: 'رصيدي',
      sections: [
        { subIcon: 'dollar-phone', subtitle: 'إجمالي الرصيد', value: '3769.00', unit: 'دج', date: '26/05/25', percentage: 25 },
        { subIcon: 'dollar-phone', subtitle: 'رصيد الشحن', value: '1000.00', unit: 'دج', date: '26/05/25', percentage: 25 },
        { subIcon: 'dollar-phone', subtitle: 'رصيد من الشهر السابق', value: '2769.00', unit: 'دج', date: '26/05/25', percentage: 25 }
      ]
    },
    {
      icon: 'internet',
      title: 'إنترنت',
      isInternet: true,
      sections: [
        { subIcon: 'internet', subtitle: 'إجمالي الإنترنت', value: '109', unit: 'GO', date: '26/05/25', percentage: 25 },
        { subIcon: 'internet', subtitle: 'إنترنت شهري SHAHID', value: '90', unit: 'GO', date: '26/05/25', percentage: 25 },
        { subIcon: 'internet', subtitle: 'الإنترنت اليومي', value: '2', unit: 'GO', date: '26/05/25', percentage: 25 },
        { subIcon: 'internet', subtitle: 'الإنترنت من الشهر السابق', value: '15', unit: 'GO', date: '26/05/25', percentage: 25 }
      ],
      extra: [
        { label: "تاريخ الاستخدام", value: "10 GO - 15/05/25" },
        { label: "أقصى استهلاك", value: "12 GO" }
      ]
    },
    {
      icon: 'Telephone',
      title: 'المكالمات/الرسائل',
      sections: [
        { subIcon: 'Telephone', subtitle: 'مكالمات غير محدودة لجميع الشبكات', infini: true, date: '26/05/25', percentage: 25 },
        { subIcon: 'Sms', subtitle: 'رسائل نصية لجميع الشبكات', value: '120', unit: '/250', date: '26/05/25', percentage: 25 }
      ]
    },
    {
      icon: 'services',
      title: 'خدماتي',
      isServices: true,
      sections: [
        { subIcon: 'facebook', subtitle: 'الفيسبوك مجانا', infini: true, date: '26/05/25', percentage: 25 },
        { subIcon: 'shahid', subtitle: 'SHAHID', infini: true, date: '26/05/25', percentage: 25 },
        { subIcon: ['anazik', 'anaflix'], subtitle: 'ANAZIK&ANAFLIX', infini: true, date: '26/05/25', percentage: 25 }
      ]
    }
  ]
}
};
