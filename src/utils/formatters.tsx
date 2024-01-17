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
        return "Sabado";
      case "Sunday":
        return "Domingo";
    }
  }
  return day;
};

export const createListOfPlayers = (list: iUser[] | undefined) => {
  let playersToText = "";

  if (list && list?.length < 16) {
    for (let i = 0; i < list?.length; i++) {
      playersToText += `${i + 1}. ${list[i].name}\n`;
    }
  }
  if (list && list.length > 16) {
    playersToText += `\nReservas\n\n`;
    for (let i = 16; i < list.length; i++) {
      playersToText += `${i + 1}. ${list[i].name}\n`;
    }
  }
  return playersToText;
};
