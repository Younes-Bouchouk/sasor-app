export const getSportImage = (sport: string) => {
    const sportImages = {
      football: "https://i.ibb.co/rW4vqpn/Chat-GPT-Image-31-mars-2025-23-21-50.png",
      basketball: "https://i.ibb.co/Zpk7xJbh/Chat-GPT-Image-31-mars-2025-23-23-03.png",
      baseball: "https://i.ibb.co/sdz83t3q/Chat-GPT-Image-1-avr-2025-10-16-49.png",
      default: "https://i.ibb.co/SwQk3MHz/logo-white-mini.png",
    };
    return sportImages[sport.toLowerCase()] || sportImages.default;
  };
