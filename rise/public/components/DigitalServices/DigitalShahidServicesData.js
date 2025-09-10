export const shahidPlans = {
  fr: [
    {
      id: "shahid500",
      name: "SHAHID 500",
      data: "02",
      features: ["Accès shahid mobile", "02 Go internet"],
      price: "500",
      duration: "30 jour",
    },
    {
      id: "shahid1000",
      name: "SHAHID 1000",
      data: "06",
      features: ["Accès shahid mobile", "06 Go internet"],
      price: "1000",
      duration: "30 jour",
    },
  ],
  ar: [
    {
      id: "shahid500",
      name: "شاهد <span class='font-rubik'>500</span>",
      data: "02",
      features: ["الوصول إلى شاهد موبايل", "<span class='font-rubik'>2Go</span> إنترنت"],
      price: "500",
      duration: "30 يوم",
    },
    {
      id: "shahid1000",
      name: "شاهد <span class='font-rubik'>1000</span>",
      data: "06",
      features: ["الوصول إلى شاهد موبايل", "<span class='font-rubik'>6Go</span> إنترنت"],
      price: "1000",
      duration: "30 يوم",
    },
  ],
};

export const shahidDescription = {
  fr: "Obtenez dès maintenant un forfait Shahid,30 jours d'accès premium Shahid + internet",
  ar: "احصلوا الآن على اشتراك شاهد الذي يناسبكم، و استفيدوا من دخول حصري لمدة 30 يوم + إنترنت.",
};

// Modal data structure for Shahid services
export const shahidModalData = {
  fr: {
    "SHAHID 500": {
      confirm: "Pour 500 DA, profitez de 30 jours d'accès à SHAHID + 2Go sur l'application.",
      success: "Achat effectué avec succès ! Vous recevrez un SMS avec un lien sous peu.",
      insufficient: "Votre crédit est insuffisant. Veuillez recharger votre compte et réessayer à nouveau.",
    },
    "SHAHID 1000": {
      confirm: "Pour 1000 DA, profitez de 30 jours d'accès à SHAHID + 6Go sur l'application.",
      success: "Achat effectué avec succès ! Vous recevrez un SMS avec un lien sous peu.",
      insufficient: "Votre crédit est insuffisant. Veuillez recharger votre compte et réessayer à nouveau.",
    },
  },
  ar: {
    "شاهد <span class='font-rubik'>500</span>": {
      confirm: "بـ 500 دج ,إستفد من 30 يوم دخول إلى شاهد + 2Go في التطبيق",
      success: "لقد تم الشراء بنجاح ! بعد قليل ,ستصلك رسالة قصيرة فيها رابط",
      insufficient: "عزيزي الزبون، رصيدك غير كافٍ لشراء الإشتراك شاهد 500يُرجى تعبئة حسابك والمحاولة مرة أخرى.",
    },
    "شاهد <span class='font-rubik'>1000</span>": {
      confirm: "بـ 1000 دج ,إستفد من 30 يوم دخول إلى شاهد + 6Go في التطبيق",
      success: "لقد تم الشراء بنجاح ! بعد قليل ,ستصلك رسالة قصيرة فيها رابط",
      insufficient: "عزيزي الزبون، رصيدك غير كافٍ لشراء الإشتراك شاهد 1000 يُرجى تعبئة حسابك والمحاولة مرة أخرى.",
    },
  },
};
