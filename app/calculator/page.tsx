"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import DrinkSelector from "@/components/drink-selector";
import TimeSelector from "@/components/time-selector";
import PersonalInfo from "@/components/personal-info";
import Results from "@/components/results";
import MascotGuide from "@/components/mascot-guide";
import { countryLimits } from "@/lib/country_bac_limits";

type Drink = {
  name: string;
  amount: number; // in ml
  alcoholPercentage: number; // in percentage
  quantity: number; // number of drinks
};

export type FormType = {
  drinks: Drink[];
  timeSinceDrinking: number;
  gender: string;
  weight: number;
  height: number;
  age: number;
  eatingStatus: string;
};

export type ResultsType = {
  bac: number;
  countries: { country: string; limit: number }[];
};

export default function Calculator() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [calculating, setCalculating] = useState(false);

  const [formData, setFormData] = useState({
    drinks: [] as Drink[],
    timeSinceDrinking: 0,
    gender: "",
    weight: 0,
    height: 0,
    age: 0,
    eatingStatus: "",
  } as FormType);

  const [results, setResults] = useState({
    bac: 0,
    countries: [],
  } as ResultsType);

  const calculateResults = useCallback(() => {
    setCalculating(true);

    // Simulate calculation time with animation
    setTimeout(() => {
      // Calculate BAC based on Widmark formula with adjustments
      // For each drink: amount in ml * alcohol percentage gives ml of pure alcohol
      const totalAlcohol = formData.drinks.reduce(
        (sum, drink) =>
          sum + drink.amount * (drink.alcoholPercentage / 100) * drink.quantity,
        0
      );

      // Convert ml of alcohol to grams (density of alcohol is about 0.789 g/ml)
      const alcoholInGrams = totalAlcohol * 0.789;

      // Check for valid weight and gender
      if (!formData.weight || !formData.gender) {
        setResults({ bac: 0, countries: [] });
        setCalculating(false);
        setStep(5);
        setProgress(100);
        return;
      }

      // Body water constant (0.68 for males, 0.55 for females)
      const r = formData.gender === "male" ? 0.68 : 0.55;

      // Calculate BAC using Widmark formula: grams of alcohol / (weight in kg * r)
      let bac = alcoholInGrams / (formData.weight * r);

      // Convert to percentage (grams per 100ml, most countries use this scale)
      bac = bac / 10;

      // Metabolism rate (about 0.015% per hour)
      bac = Math.max(0, bac - 0.015 * formData.timeSinceDrinking);

      // Adjust for food in stomach
      if (formData.eatingStatus === "full") {
        bac = bac * 0.7;
      } else if (formData.eatingStatus === "some") {
        bac = bac * 0.9;
      }

      // Ensure BAC is not negative
      bac = Math.max(0, bac);

      // Round to 3 decimal places
      bac = Math.round(bac * 1000) / 1000;

      // Get countries where this BAC is legal for driving
      const countries = getCountriesForBAC(bac);

      setResults({ bac, countries });
      setCalculating(false);
      setStep(5);
      setProgress(100);
    }, 3000);
  }, [formData, setStep]);

  const updateFormData = useCallback((data: FormType) => {
    setFormData((prev) => {
      if (
        data.drinks &&
        JSON.stringify(data.drinks) === JSON.stringify(prev.drinks)
      ) {
        return prev;
      }
      return { ...prev, ...data };
    });
  }, []);

  const nextStep = useCallback(() => {
    if (step < 4) {
      setStep(step + 1);
      setProgress((step + 1) * 25);
    } else {
      calculateResults();
    }
  }, [step, calculateResults]);

  const prevStep = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(step * 25 - 25);
    }
  }, [step]);

  const getCountriesForBAC = (bac: number) => {
    const res = countryLimits.filter((c) => c.limit >= bac);
    return res.sort((a, b) => b.limit - a.limit);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <DrinkSelector
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <TimeSelector formData={formData} updateFormData={updateFormData} />
        );
      case 3:
        return (
          <PersonalInfo formData={formData} updateFormData={updateFormData} />
        );
      case 4:
        return (
          <div className="flex flex-col items-center justify-center space-y-6 p-6 text-center">
            <h2 className="text-2xl font-bold text-red-800 dark:text-red-400">
              Ready to Calculate!
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We have all the information we need. Click the button below to
              calculate your BAC and see where you can drive!
            </p>
            <Button
              onClick={calculateResults}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              Calculate Results
            </Button>
          </div>
        );
      case 5:
        return <Results results={results} />;
      default:
        return null;
    }
  };

  const getMessage = () => {
    switch (step) {
      case 1:
        return "Let's start by selecting what you've been drinking!";
      case 2:
        return "Now, tell me how long it's been since your last drink.";
      case 3:
        return "I need to know a bit about you to calculate accurately.";
      case 4:
        return "Ready to see the results? Let's calculate!";
      case 5:
        return results.bac > 0
          ? "Here are your results! Remember, never drink and drive!"
          : "Good news! Your BAC is 0%. You're good to go!";
      default:
        return "Let's find out where you can drive!";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-red-100 dark:from-gray-900 dark:to-red-950 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <Progress
              value={progress}
              className="h-2 bg-gray-200 dark:bg-gray-700"
            />
            <div className="mt-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Start</span>
              <span>Drinks</span>
              <span>Time</span>
              <span>You</span>
              <span>Results</span>
            </div>
          </div>

          <MascotGuide message={getMessage()} />

          <Card className="mt-6 overflow-hidden bg-white/90 shadow-xl dark:bg-gray-800/90">
            {calculating ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-6 h-24 w-24 animate-spin rounded-full border-b-2 border-t-2 border-red-600"></div>
                <h3 className="text-xl font-bold text-red-800 dark:text-red-400">
                  Calculating...
                </h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  Crunching the numbers and checking global driving laws!
                </p>
              </div>
            ) : (
              <div className="p-6">
                {renderStep()}

                {step < 5 && step > 1 && (
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>

                    {step < 4 && (
                      <Button
                        onClick={nextStep}
                        className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                      >
                        Next
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
