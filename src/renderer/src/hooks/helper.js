import { STORAGE_URL } from "../server/services";


export const renderAvatarFallback = (name) => {
    const nameParts = name.split(' ');
    const firstNameInitial = nameParts[0]?.[0]?.toUpperCase();
    const lastNameInitial = nameParts[1]?.[0]?.toUpperCase();

    return `${firstNameInitial || ''}${lastNameInitial || ''}`;
  }

  export const getImage = (img) => {
    if (img.includes("http")) {
      return img;
    }
    return `${STORAGE_URL}/${img}`;
  }

  export const currencyFormat = (amount) => {
    return `PKR ${amount}`
  }
