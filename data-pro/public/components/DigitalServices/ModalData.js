const modalData = {
  fr: {
    confirm: {
      title: "CONFIRMATION D'ACHAT",
      icon: "./assets/images/services/Bitdefender/Modals/confirm.svg",
      getMessage: (price) => `Prix total : ${price} DA`,
      checkbox: {
        text: "J'accepte les conditions générales",
        required: true,
      },
      buttons: [
        { text: "RETOUR", type: "secondary", action: "cancel" },
        { text: "CHOISIR", type: "primary", action: "confirm" },
      ],
    },
    success: {
      title: "FÉLICITATIONS !",
      icon: "./assets/images/services/Bitdefender/Modals/congrats.svg",
      message: "Votre commande a été confirmée. Vous recevrez un SMS avec le lien d'activation",
      buttons: [{ text: "OK", type: "secondary", action: "close" }],
    },
    noCredit: {
      title: "CRÉDIT INSUFFISANT",
      icon: "./assets/images/services/Bitdefender/Modals/no-credit.svg",
      message: "Vous n'avez pas assez de crédit pour passer votre commande. Veuillez recharger votre compte et réessayer",
      buttons: [{ text: "OK", type: "secondary", action: "close" }],
    },
    error: {
      title: "ERREUR",
      icon: "./assets/images/services/Bitdefender/Modals/error.svg",
      message: "Une erreur s'est produite. Veuillez réessayer.",
      buttons: [{ text: "OK", type: "secondary", action: "close" }],
    },
  },
  ar: {
    confirm: {
      title: "تأكيد الشراء",
      icon: "./assets/images/services/Bitdefender/Modals/confirm.svg",
      getMessage: (price) => `السعر الإجمالي : ${price} دج`,
      checkbox: {
        text: "أوافق على شروط الاستعمال",
        required: true,
      },
      buttons: [
        { text: "العودة", type: "secondary", action: "cancel" },
        { text: "إختيار", type: "primary", action: "confirm" },
      ],
    },
    success: {
      title: "هنيئًا!",
      icon: "./assets/images/services/Bitdefender/Modals/congrats.svg",
      message: "لقد تم تأكيد طلبك، ستصلك رسالة قصيرة تتضمن رابط التفعيل",
      buttons: [{ text: "العودة", type: "secondary", action: "close" }],
    },
    noCredit: {
      title: "رصيد غير كافٍ",
      icon: "./assets/images/services/Bitdefender/Modals/no-credit.svg",
      message: "رصيدك غير كافٍ لتقديم طلبك، يرجى إعادة تعبئة حسابك والمحاولة مرة أخرى",
      buttons: [{ text: "العودة", type: "secondary", action: "close" }],
    },
    error: {
      title: "خطأ",
      icon: "./assets/images/services/Bitdefender/Modals/error.svg",
      message: "لقد حدث خلل ما. يرجى المحاولة مرة أخرى",
      buttons: [{ text: "العودة", type: "secondary", action: "close" }],
    },
  },
};

export default modalData;
