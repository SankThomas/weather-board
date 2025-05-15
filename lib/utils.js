import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function getForecast(lat, lon) {
  const res = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`,
  );

  if (!res.ok) throw new Error("Failed to fetch forecast");

  const data = await res.json();
  return data;
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
