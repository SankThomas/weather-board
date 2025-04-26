import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getWeatherBackground = (conditionText) => {
  const text = conditionText.toLowerCase();
  if (text.includes("rain")) return "/backgrounds/rainy.jpg";
  if (text.includes("cloud")) return "/backgrounds/cloudy.jpg";
  if (text.includes("snow")) return "/backgrounds/snowy.jpg";
  if (text.includes("sun")) return "/backgrounds/sunny.jpg";
  if (text.includes("clear")) return "/backgrounds/clear.jpg";
  return "/backgrounds/clear.jpg";
};
