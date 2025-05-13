"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Check } from "lucide-react";
import Link from "next/link";
import { countryLimits } from "@/lib/country_bac_limits";

export default function Results({ results }: any) {
  const [showAnimation, setShowAnimation] = useState(true);
  const [displayedCountries, setDisplayedCountries] = useState([]);

  useEffect(() => {
    // Animate the countries appearing one by one
    if (results.countries.length > 0 && showAnimation) {
      const timer = setTimeout(() => {
        setShowAnimation(false);
        setDisplayedCountries(results.countries);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [results.countries, showAnimation]);

  const getBACColor = (bac: any) => {
    if (bac === 0) return "text-green-600 dark:text-green-400";
    if (bac < 0.05) return "text-yellow-600 dark:text-yellow-400";
    if (bac < 0.08) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getBACMessage = (bac: any) => {
    if (bac === 0) return "You're completely sober!";
    if (bac < 0.05) return "You have a low level of alcohol in your system.";
    if (bac < 0.08)
      return "You have a moderate level of alcohol in your system.";
    return "You have a high level of alcohol in your system!";
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-red-800 dark:text-red-400">
        Your Results
      </h2>

      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-700">
        <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
          Estimated Blood Alcohol Content
        </h3>

        <div className="mb-6 flex items-center justify-center">
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-4 border-red-500 bg-white text-center dark:bg-gray-800">
            <span className={`text-4xl font-bold ${getBACColor(results.bac)}`}>
              {results.bac.toFixed(3)}%
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-green-600 dark:text-green-400">0.00%</span>
            <span className="text-yellow-600 dark:text-yellow-400">0.05%</span>
            <span className="text-orange-600 dark:text-orange-400">0.08%</span>
            <span className="text-red-600 dark:text-red-400">0.15%+</span>
          </div>
          <Progress
            value={Math.min((results.bac / 0.15) * 100, 100)}
            className={`h-2 ${
              results.bac === 0
                ? "bg-green-500"
                : results.bac < 0.05
                ? "bg-yellow-500"
                : results.bac < 0.08
                ? "bg-orange-500"
                : "bg-red-500"
            }`}
          />
        </div>

        <div
          className={`rounded-lg p-4 ${
            results.bac === 0
              ? "bg-green-100 dark:bg-green-900/30"
              : results.bac < 0.05
              ? "bg-yellow-100 dark:bg-yellow-900/30"
              : results.bac < 0.08
              ? "bg-orange-100 dark:bg-orange-900/30"
              : "bg-red-100 dark:bg-red-900/30"
          }`}
        >
          <p
            className={`font-medium ${
              results.bac === 0
                ? "text-green-800 dark:text-green-300"
                : results.bac < 0.05
                ? "text-yellow-800 dark:text-yellow-300"
                : results.bac < 0.08
                ? "text-orange-800 dark:text-orange-300"
                : "text-red-800 dark:text-red-300"
            }`}
          >
            {getBACMessage(results.bac)}
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-700">
        <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
          Countries Where You Can Legally Drive a Car
        </h3>

        {showAnimation ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-red-600"></div>
            <p className="text-gray-700 dark:text-gray-300">
              Checking global driving laws...
            </p>
          </div>
        ) : (
          <>
            {results.countries.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {results.countries.map((country: any, index: any) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center">
                        <Check className="mr-2 h-5 w-5 text-green-500" />
                        <span>{country.country}</span>
                      </div>
                      {country.limit === 100 ? (
                        <span className="rounded-md bg-gray-100 px-2 py-1 ml-2 text-xs font-bold text-gray-800">
                          No limit!
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-2 py-1 ml-2 text-xs font-medium text-green-800 dark:bg-green-900/50 dark:text-green-300">
                          {country.limit.toFixed(2)}%
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-8 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
        <h3 className="font-semibold text-red-800 dark:text-red-300">
          Important Disclaimer
        </h3>
        <p className="mt-1 text-sm text-red-700 dark:text-red-200">
          This app is for entertainment purposes only. Never drink and drive,
          regardless of BAC levels. Always follow local laws and regulations.
          The calculations provided are estimates and should not be used to
          determine if you are fit to drive.
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        <Link href="/">
          <Button variant="outline">Start Over</Button>
        </Link>
        <Button
          onClick={() => window.print()}
          className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
        >
          Save Results
        </Button>
      </div>
    </div>
  );
}
