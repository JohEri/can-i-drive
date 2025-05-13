"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PersonalInfo({ formData, updateFormData }) {
  const [personalData, setPersonalData] = useState({
    gender: formData.gender || "",
    weight: formData.weight || "",
    height: formData.height || "",
    age: formData.age || "",
    eatingStatus: formData.eatingStatus || "",
  })

  useEffect(() => {
    // Only update if the data has actually changed
    const hasChanged = Object.keys(personalData).some((key) => personalData[key] !== formData[key])

    if (hasChanged) {
      updateFormData(personalData)
    }
  }, [personalData, updateFormData, formData])

  const handleChange = (field, value) => {
    setPersonalData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-red-800 dark:text-red-400">Tell us about yourself</h2>
      <p className="text-gray-700 dark:text-gray-300">
        We need some information about you to calculate your blood alcohol content accurately.
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="gender">Biological Sex</Label>
          <RadioGroup
            value={personalData.gender}
            onValueChange={(value) => handleChange("gender", value)}
            className="mt-2 flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={personalData.weight}
              onChange={(e) => handleChange("weight", Number.parseFloat(e.target.value))}
              placeholder="Enter your weight"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={personalData.age}
              onChange={(e) => handleChange("age", Number.parseInt(e.target.value))}
              placeholder="Enter your age"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="eatingStatus">Have you eaten?</Label>
          <Select value={personalData.eatingStatus} onValueChange={(value) => handleChange("eatingStatus", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select eating status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="empty">Empty stomach</SelectItem>
              <SelectItem value="some">Some food</SelectItem>
              <SelectItem value="full">Full meal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/30">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-400">Why do we need this information?</h3>
        <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
          Your biological sex, weight, and eating status all affect how your body processes alcohol. This helps us
          provide a more accurate estimate of your blood alcohol content.
        </p>
      </div>
    </div>
  )
}
