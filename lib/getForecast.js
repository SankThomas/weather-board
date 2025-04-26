export async function getForecast(lat, lon) {
  const res = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`,
  );

  if (!res.ok) throw new Error("Failed to fetch forecast");

  const data = await res.json();
  console.log(data);
  return data;
}
