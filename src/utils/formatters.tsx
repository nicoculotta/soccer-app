import { iUser } from "@/types/types";
import { User } from "@/types/userCredencial";

export const formatUser = (user: User, role: string): iUser => {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    avatar: user.photoURL,
    role: role,
    yellow: false,
  };
};

export const formatDate = (date: Date | undefined) => {
  if (date) {
    const newDate = new Date(date);

    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();

    const dayFormat = day < 10 ? `0${day}` : day;
    const monthFormat = month < 10 ? `0${month}` : month;

    return `${dayFormat}/${monthFormat}/${year}`;
  }
  return "no date";
};

export function getDayName(date: Date | undefined, locale: string = "en-EN") {
  if (date) {
    const newDate = new Date(date);
    return newDate.toLocaleDateString(locale, { weekday: "long" });
  }
  return "no date";
}

export const formatDayName = (day: string, locale: string) => {
  if (locale === "es") {
    switch (day) {
      case "Monday":
        return "Lunes";
      case "Tuesday":
        return "Martes";
      case "Wednesday":
        return "Miércoles";
      case "Thursday":
        return "Jueves";
      case "Friday":
        return "Viernes";
      case "Saturday":
        return "Sábado";
      case "Sunday":
        return "Domingo";
    }
  }
  return day;
};

export const createListOfPlayers = (list: iUser[] | undefined) => {
  let playersToText = "";

  // Si no hay lista o está vacía, retornar string vacío
  if (!list || list.length === 0) {
    return playersToText;
  }

  // Caso: menos de 16 jugadores
  if (list.length < 16) {
    // Listar los jugadores existentes
    for (let i = 0; i < list.length; i++) {
      playersToText += `${i + 1}. ${list[i].name}\n`;
    }
    
  } else {
    // Listar los primeros 16 jugadores (titulares)
    for (let i = 0; i < 16; i++) {
      playersToText += `${i + 1}. ${list[i].name}\n`;
    }
    
    // Si hay más de 16 jugadores, mostrar sección de reservas
    if (list.length > 16) {
      playersToText += `\nReservas\n\n`;
      for (let i = 16; i < list.length; i++) {
        playersToText += `${i + 1}. ${list[i].name}\n`;
      }
    }
  }
  
  return playersToText;
};
