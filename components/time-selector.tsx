"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

export default function TimeSelector({ formData, updateFormData }: any) {
  const [hours, setHours] = useState(formData.timeSinceDrinking || 1);

  useEffect(() => {
    // Only update if the hours value has changed
    if (formData.timeSinceDrinking !== hours) {
      updateFormData({ timeSinceDrinking: hours });
    }
  }, [hours, updateFormData, formData.timeSinceDrinking]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-red-800 dark:text-red-400">
        How long since your last drink?
      </h2>

      <div className="mt-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-700">
        <div className="mb-6 flex items-center justify-center">
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-4 border-red-500 bg-white dark:bg-gray-800">
            <div className="text-center">
              <span className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                {hours}
              </span>
              <p className="text-gray-600 dark:text-gray-400">hours ago</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Slider
            value={[hours]}
            min={0}
            max={24}
            step={0.5}
            onValueChange={(value) => setHours(value[0])}
            className="py-4"
          />
          <div className="mt-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>0 hours</span>
            <span>12 hours</span>
            <span>24 hours</span>
          </div>
        </div>

        <div className="space-y-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-600">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Did you know?
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            On average, the human body metabolizes alcohol at a rate of about
            0.015% BAC per hour. This means it takes approximately one hour to
            eliminate one standard drink from your system.
          </p>
        </div>
      </div>
    </div>
  );
}
