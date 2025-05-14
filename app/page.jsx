"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import DailyForecast from "@/components/dailyforecast";
import Image from "next/image";
import CityCombobox from "@/components/combobox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Droplet, Wind, Sun } from "lucide-react";
import { cn, getForecast, getWeatherBackground } from "@/lib/utils";
import HourlyChart from "@/components/hourlychart";

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [bgImage, setBgImage] = useState("/backgrounds/clear.jpg");
  const [bgLoaded, setBgLoaded] = useState(false);

  const convertTemp = (tempC) => (isCelsius ? tempC : (tempC * 9) / 5 + 32);

  const fetchWeather = async (lat, lon) => {
    try {
      const data = await getForecast(lat, lon);
      setWeather(data);
    } catch (error) {
      setError("Failed to load weather data");
      toast.error("Failed to load weather data", {
        description: error.message,
      });
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      toast.error("Geolocation is not supported.");
      return;
    }

    if (!selectedCity && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentCoords({ lat: latitude, lon: longitude });
          fetchWeather(latitude, longitude);
        },
        () => {
          setError("Location access denied");
          toast.error("Location access denied");
        },
      );
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedCity) {
      const city = cities.find((c) => c.name === selectedCity);

      if (city) {
        setCurrentCoords({ lat: city.lat, lon: city.lon });
        fetchWeather(city.lat, city.lon);
      }
    }
  }, [selectedCity]);

  useEffect(() => {
    // Refresh every hour
    const interval = setInterval(
      () => {
        if (currentCoords) {
          fetchWeather(currentCoords.lat, currentCoords.lon);
        }
      },
      10 * 60 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [currentCoords]);

  useEffect(() => {
    if (weather?.current?.condition?.text) {
      const img = getWeatherBackground(weather.current.condition.text);
      setBgLoaded(false);
      const timeout = setTimeout(() => {
        setBgImage(img);
        setBgLoaded(true);
      }, 100); // Slight delay for effect
      return () => clearTimeout(timeout);
    }
  }, [weather]);

  const loading = !weather;

  return (
    <div className="relative min-h-screen w-full">
      {/* Background image */}
      <Image
        src={bgImage}
        alt="weather background"
        fill
        className={cn(
          "object-cover transition-opacity duration-700 ease-in-out",
          bgLoaded ? "opacity-50" : "opacity-0",
        )}
        priority
      />

      <main className="relative z-50 container mx-auto flex min-h-screen flex-col items-center px-4 py-6">
        <div className="mb-12 flex w-full flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-white">Weatherly</h1>

          <div className="flex flex-wrap items-center gap-4">
            <CityCombobox
              onSelect={async (city) => {
                const data = await getForecast(city.lat, city.lon);
                setCurrentCoords({ lat: city.lat, lon: city.lon });
                setWeather(data);
              }}
            />
            <div className="flex items-center space-x-2">
              <Label htmlFor="unit-toggle" className="text-white">
                °C
              </Label>
              <Switch
                id="unit-toggle"
                checked={!isCelsius}
                onCheckedChange={() => setIsCelsius((prev) => !prev)}
              />
              <Label htmlFor="unit-toggle" className="text-white">
                °F
              </Label>
            </div>
          </div>
        </div>

        {error && (
          <CardDescription className="text-rose-500">{error}</CardDescription>
        )}

        {loading && !error && (
          <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-76 w-full rounded-md border border-neutral-700 bg-neutral-800" />
            <Skeleton className="h-76 w-full rounded-md border border-neutral-700 bg-neutral-800" />
            <Skeleton className="h-76 w-full rounded-md border border-neutral-700 bg-neutral-800" />
            <Skeleton className="h-76 w-full rounded-md border border-neutral-700 bg-neutral-800" />
            <Skeleton className="h-76 w-full rounded-md border border-neutral-700 bg-neutral-800" />
            <Skeleton className="h-76 w-full rounded-md border border-neutral-700 bg-neutral-800" />
          </div>
        )}

        {weather && (
          <div className="w-full space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-1 text-3xl font-bold">
                    {weather.location.name}
                  </h2>
                  <CardDescription className="text-sm text-white/75">
                    {new Date(weather.location.localtime).toLocaleDateString(
                      undefined,
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <CardTitle className="text-4xl font-bold">
                      {Math.round(convertTemp(weather.current.temp_c))}°
                      {isCelsius ? "C" : "F"}
                    </CardTitle>
                    <CardDescription className="text-sm text-white/75 capitalize">
                      {weather.current.condition.text}
                    </CardDescription>
                  </div>
                  <Image
                    src={`https:${weather.current.condition.icon}`}
                    alt={weather.current.condition.text}
                    className="size-16"
                    width={400}
                    height={400}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
                  <div className="flex flex-col items-center gap-2 rounded-md border border-white/15 p-4">
                    <span className="block font-semibold">
                      <Droplet className="mx-auto mb-2 text-blue-400" />{" "}
                      Humidity:
                    </span>
                    {weather.current.humidity}%
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-md border border-white/15 p-4">
                    <span className="block font-semibold">
                      <Wind className="mx-auto mb-2 text-cyan-400" /> Wind:
                    </span>
                    {weather.current.wind_kph} km/h
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-md border border-white/15 p-4">
                    <span className="block font-semibold">
                      <Sun className="mx-auto mb-2 text-yellow-400" /> Feels
                      like:
                    </span>
                    {Math.round(convertTemp(weather.current.feelslike_c))}°
                    {isCelsius ? "C" : "F"}
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-md border border-white/15 p-4">
                    <span className="block font-semibold">
                      <Sun className="mx-auto mb-2 text-orange-400" /> UV Index:
                    </span>
                    {weather.current.uv}
                  </div>
                </CardContent>
              </Card>
            </div>

            <HourlyChart data={weather.forecast.forecastday[0].hour} />

            <DailyForecast
              data={weather}
              convertTemp={convertTemp}
              isCelsius={isCelsius}
            />
          </div>
        )}
      </main>
    </div>
  );
}
