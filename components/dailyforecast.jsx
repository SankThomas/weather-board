"use client";

import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Thermometer } from "lucide-react";
import Image from "next/image";

export default function DailyForecast({ data, convertTemp, isCelsius }) {
  const days = data.forecast.forecastday;

  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold text-white">3-Day Forecast</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {days.map((day, index) => (
          <Card key={index}>
            <CardContent className="space-y-2 p-4 text-center">
              <p className="text-sm">
                {format(new Date(day.date), "EEEE, MMM d")}
              </p>
              <Image
                src={`https:${day.day.condition.icon}`}
                alt={day.day.condition.text}
                className="mx-auto h-12 w-12"
                width={400}
                height={400}
              />
              <p className="text-lg font-bold">
                {Math.round(convertTemp(day.day.avgtemp_c))}°
                {isCelsius ? "C" : "F"}
              </p>
              <p className="text-sm">{day.day.condition.text}</p>
              <div className="flex items-center justify-center gap-4 text-xs">
                <span className="flex items-center">
                  <Thermometer /> Max:{" "}
                  {Math.round(convertTemp(day.day.maxtemp_c))}°
                  {isCelsius ? "C" : "F"}
                </span>
                <span>
                  Min: {Math.round(convertTemp(day.day.mintemp_c))}°
                  {isCelsius ? "C" : "F"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
