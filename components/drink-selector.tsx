"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wine,
  Beer,
  CoffeeIcon as Cocktail,
  Plus,
  Minus,
  GlassWater,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

type DrinkCategory = "beer" | "wine" | "spirits";

const servingSizes: Record<
  DrinkCategory,
  { id: string; name: string; amount: number; icon: string }[]
> = {
  beer: [
    { id: "can", name: "Can", amount: 330, icon: "🥫" },
    { id: "pint", name: "Pint", amount: 500, icon: "🍺" },
  ],
  wine: [
    { id: "glass", name: "Glass", amount: 175, icon: "🍷" },
    {
      id: "bottle_shared",
      name: "Bottle (shared by 4)",
      amount: 750 / 4,
      icon: "🍾",
    },
    { id: "bottle_solo", name: "Bottle (on my own)", amount: 750, icon: "🍾" },
  ],
  spirits: [
    { id: "shot", name: "Shot", amount: 25, icon: "🥃" },
    { id: "double", name: "Double", amount: 50, icon: "🥃🥃" },
  ],
};

const drinkCategories = [
  {
    id: "beer",
    name: "Beer",
    icon: <Beer className="h-6 w-6" />,
    emoji: "🍺",
    options: [
      {
        id: "lightlager",
        name: "Light",
        alcoholPercentage: 4.5,
        color: "#F9D342",
      },
      {
        id: "lager",
        name: "Lager",
        alcoholPercentage: 5.2,
        color: "#E8871E",
      },
      { id: "ale", name: "Ale", alcoholPercentage: 5.8, color: "#32292F" },
      {
        id: "ipa",
        name: "IPA",
        alcoholPercentage: 6.5,
        color: "#F9A03F",
      },
      {
        id: "craft",
        name: "Craft",
        alcoholPercentage: 7.2,
        color: "#8E5572",
      },
    ],
  },
  {
    id: "wine",
    name: "Wine",
    icon: <Wine className="h-6 w-6" />,
    emoji: "🍷",
    options: [
      { id: "red", name: "Red", alcoholPercentage: 13, color: "#7B0828" },
      {
        id: "white",
        name: "White",
        alcoholPercentage: 12,
        color: "#F9E076",
      },
      { id: "rose", name: "Rosé", alcoholPercentage: 11, color: "#F7A9A8" },
      {
        id: "sparkling",
        name: "Sparkling",
        alcoholPercentage: 12,
        color: "#F9E7E7",
      },
    ],
  },
  {
    id: "spirits",
    name: "Spirits",
    icon: <GlassWater className="h-6 w-6" />,
    emoji: "🥃",
    options: [
      { id: "vodka", name: "Vodka", alcoholPercentage: 37.5, color: "#E5E5E5" },
      {
        id: "whiskey",
        name: "Whiskey",
        alcoholPercentage: 42,
        color: "#C25E00",
      },
      { id: "rum", name: "Rum", alcoholPercentage: 45, color: "#8B4513" },
      { id: "gin", name: "Gin", alcoholPercentage: 40.5, color: "#D0F0C0" },
      {
        id: "tequila",
        name: "Tequila",
        alcoholPercentage: 40,
        color: "#F9D342",
      },
    ],
  },
];

const emojiVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
  hover: { scale: 1.2, rotate: 10, transition: { duration: 0.3 } },
  tap: { scale: 0.9, transition: { duration: 0.1 } },
};

export default function DrinkSelector({
  formData,
  updateFormData,
  nextStep,
}: any) {
  const [selectedCategory, setSelectedCategory] =
    useState<DrinkCategory>("beer");
  const [selectedDrinks, setSelectedDrinks] = useState(formData.drinks || []);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCategoryChange = (category: any) => {
    setSelectedCategory(category);
    setSelectedDrink(null);
    setSelectedSize(null);
  };

  const handleDrinkSelect = (drink: any) => {
    setSelectedDrink(drink);
    setSelectedSize(null);
  };

  const handleSizeSelect = (size: any) => {
    setSelectedSize(size);
  };

  const addDrink = () => {
    if (!selectedDrink || !selectedSize) return;
    const category = drinkCategories.find((c) => c.id === selectedCategory);
    if (!category) return;
    const drink = category.options.find((d) => d.id === selectedDrink);
    const size = servingSizes[selectedCategory].find(
      (s: any) => s.id === selectedSize
    );

    if (!drink || !size) return;

    const newDrink = {
      id: `${drink.id}-${size.id}`,
      name: drink.name,
      category: selectedCategory,
      alcoholPercentage: drink.alcoholPercentage,
      amount: size.amount,
      servingType: size.name,
      color: drink.color,
      emoji: category.emoji,
      sizeEmoji: size.icon,
      quantity: 1,
    };

    let updatedDrinks;
    const existingDrinkIndex = selectedDrinks.findIndex(
      (d: any) => d.id === newDrink.id && d.category === newDrink.category
    );

    if (existingDrinkIndex >= 0) {
      updatedDrinks = [...selectedDrinks];
      updatedDrinks[existingDrinkIndex].quantity += 1;
    } else {
      updatedDrinks = [...selectedDrinks, newDrink];
    }

    setSelectedDrinks(updatedDrinks);
    updateFormData({ drinks: updatedDrinks });

    // Show confetti effect
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);

    // Reset selections
    setSelectedDrink(null);
    setSelectedSize(null);
  };

  const removeDrink = (index: any) => {
    const updatedDrinks = selectedDrinks.filter(
      (_: any, i: any) => i !== index
    );
    setSelectedDrinks(updatedDrinks);
    updateFormData({ drinks: updatedDrinks });
  };

  const updateQuantity = (index: any, change: any) => {
    const updatedDrinks = [...selectedDrinks];
    updatedDrinks[index].quantity = Math.max(
      1,
      updatedDrinks[index].quantity + change
    );
    setSelectedDrinks(updatedDrinks);
    updateFormData({ drinks: updatedDrinks });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-red-800 dark:text-red-400">
        What have you been drinking?
      </h2>

      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <Tabs
          value={selectedCategory}
          onValueChange={handleCategoryChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            {drinkCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center space-x-2"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: selectedCategory === category.id ? 1.2 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  {category.icon}
                </motion.div>
                <span>{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {drinkCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-4">
              <div className="mb-6">
                <h3 className="mb-3 text-lg font-medium">
                  Select your {category.name.toLowerCase()}:
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {category.options.map((drink) => (
                    <motion.div
                      key={drink.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDrinkSelect(drink.id)}
                    >
                      <Card
                        className={`cursor-pointer overflow-hidden h-[160px] transition-all ${
                          selectedDrink === drink.id
                            ? "border-2 border-red-500 shadow-lg"
                            : "border border-gray-200 hover:shadow-md dark:border-gray-700"
                        }`}
                      >
                        <div className="flex flex-col items-center p-4 text-center">
                          <div
                            className="mb-3 flex h-16 w-16 items-center justify-center rounded-full"
                            style={{ backgroundColor: `${drink.color}20` }}
                          >
                            <motion.div
                              variants={emojiVariants}
                              initial="initial"
                              animate="animate"
                              whileHover="hover"
                              whileTap="tap"
                              className="text-3xl"
                            >
                              {category.emoji}
                            </motion.div>
                          </div>
                          <h3 className="font-medium">{drink.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {drink.alcoholPercentage} %
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {selectedDrink && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <h3 className="mb-3 text-lg font-medium">
                    Choose serving size:
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {servingSizes[category.id as DrinkCategory].map((size) => (
                      <motion.div
                        key={size.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSizeSelect(size.id)}
                      >
                        <Card
                          className={`cursor-pointer overflow-hidden transition-all ${
                            selectedSize === size.id
                              ? "border-2 border-red-500 shadow-lg"
                              : "border border-gray-200 hover:shadow-md dark:border-gray-700"
                          }`}
                        >
                          <div className="flex flex-col items-center p-4 text-center">
                            <div className="mb-2 text-3xl">{size.icon}</div>
                            <h3 className="font-medium">{size.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {size.amount}ml
                            </p>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {selectedDrink && selectedSize && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={addDrink}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    Add to My Drinks
                  </Button>
                </motion.div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => {
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            const delay = Math.random() * 0.5;

            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${left}%`,
                  top: "-20px",
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
                  borderRadius: "50%",
                }}
                initial={{ y: -20 }}
                animate={{ y: "100vh" }}
                transition={{
                  duration: animationDuration,
                  delay: delay,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </div>
      )}

      {selectedDrinks.length > 0 && (
        <div className="mt-8 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Your Drinks:
          </h3>
          <div className="space-y-3">
            {selectedDrinks.map((drink: any, index: any) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between rounded-lg bg-white p-3 shadow dark:bg-gray-700"
              >
                <div className="flex items-center">
                  <div
                    className="mr-3 flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${drink.color}30` }}
                  >
                    <span className="text-2xl">{drink.emoji}</span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {drink.name} ({drink.servingType})
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {drink.alcoholPercentage}% | {drink.amount}ml |{" "}
                      {drink.sizeEmoji}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(index, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-6 text-center">{drink.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(index, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeDrink(index)}
                  >
                    Remove
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src="/wine-mascot.png"
                alt="Wine Glass Mascot"
                width={40}
                height={40}
                className="mr-2"
              />
              <p className="text-sm italic text-gray-600 dark:text-gray-400">
                {selectedDrinks.length === 1
                  ? "That's a good start! Add more or continue."
                  : selectedDrinks.length < 3
                  ? "Looking good! Ready to continue?"
                  : "Wow, that's quite a selection! Ready to see the results?"}
              </p>
            </div>
            <Button
              onClick={nextStep}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
