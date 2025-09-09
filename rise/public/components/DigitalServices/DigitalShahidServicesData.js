export const shahidPlans = {
  fr: [
    {
      id: "shahid500",
      name: "SHAHID 500",
      data: "02 Go internet",
      features: ["Accès shahid mobile", "02 Go internet"],
      price: "500",
      duration: "30 jour",
    },
    {
      id: "shahid1000",
      name: "SHAHID 1000",
      data: "06 Go internet",
      features: ["Accès shahid mobile", "06 Go internet"],
      price: "1000",
      duration: "30 jour",
    },
  ],
  ar: [
    {
      id: "shahid500",
      name: "شاهد 500",
      data: "02 Go إنترنت",
      features: ["الوصول إلى شاهد موبايل", "02 Go إنترنت"],
      price: "500",
      duration: "30 يوم",
    },
    {
      id: "shahid1000",
      name: "شاهد 1000",
      data: "06 Go إنترنت",
      features: ["الوصول إلى شاهد موبايل", "06 Go إنترنت"],
      price: "1000",
      duration: "30 يوم",
    },
  ],
};

export const shahidDescription = {
  fr: "Obtenez dès maintenant un forfait Shahid. 30 jours d'accès premium Shahid + Internet",
  ar: "احصل على اشتراك شاهد الآن، 30 يومًا من الوصول المميز إلى شاهد + الإنترنت",
};

// Modal data structure for Shahid services
export const shahidModalData = {
  fr: {
    "SHAHID 500": {
      confirm: "Accès Shahid mobile + 02 Go internet, valables 30 jours pour 500 DA seulement",
      success: "Félicitations ! Votre forfait SHAHID 500 est activé avec succès : Accès Shahid mobile + 02 Go internet, valables 30 jours.",
      insufficient: "Votre crédit est insuffisant pour acheter le forfait SHAHID 500. Veuillez recharger votre compte.",
    },
    "SHAHID 1000": {
      confirm: "Accès Shahid mobile + 06 Go internet, valables 30 jours pour 1000 DA seulement",
      success: "Félicitations ! Votre forfait SHAHID 1000 est activé avec succès : Accès Shahid mobile + 06 Go internet, valables 30 jours.",
      insufficient: "Votre crédit est insuffisant pour acheter le forfait SHAHID 1000. Veuillez recharger votre compte.",
    },
  },
  ar: {
    "شاهد 500": {
      confirm: "الوصول إلى شاهد موبايل + 02 Go إنترنت، صالحين 30 يوم بـ 500 دج فقط",
      success: "هنيئًا ! لقد تم تفعيل اشتراك شاهد 500 بنجاح: الوصول إلى شاهد موبايل + 02 Go إنترنت، صالحين 30 يوم.",
      insufficient: "رصيدك غير كافٍ لشراء اشتراك شاهد 500. يُرجى تعبئة رصيدك.",
    },
    "شاهد 1000": {
      confirm: "الوصول إلى شاهد موبايل + 06 Go إنترنت، صالحين 30 يوم بـ 1000 دج فقط",
      success: "هنيئًا ! لقد تم تفعيل اشتراك شاهد 1000 بنجاح: الوصول إلى شاهد موبايل + 06 Go إنترنت، صالحين 30 يوم.",
      insufficient: "رصيدك غير كافٍ لشراء اشتراك شاهد 1000. يُرجى تعبئة رصيدك.",
    },
  },
};
