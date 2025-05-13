import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-red-100 dark:from-gray-900 dark:to-red-950">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative h-40 w-40 animate-bounce">
            <Image src="/wine-mascot.png" alt="Wine Glass Mascot" width={200} height={200} className="drop-shadow-lg" />
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-red-800 dark:text-red-400 md:text-6xl">
            Can I Drive There?
          </h1>

          <p className="mt-4 max-w-2xl text-xl text-gray-700 dark:text-gray-300">
            Find out your blood alcohol content and discover which countries you can legally drive in!
          </p>

          <div className="mt-10">
            <Link href="/calculator">
              <Button
                size="lg"
                className="animate-pulse bg-red-600 text-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              >
                Let's Get Started!
              </Button>
            </Link>
          </div>

          <div className="mt-8 max-w-2xl rounded-lg bg-white/80 p-4 text-gray-700 shadow-md dark:bg-gray-800/80 dark:text-gray-300">
            <p className="text-sm">
              <strong>Disclaimer:</strong> This app is for entertainment purposes only. Never drink and drive. Always
              follow local laws and regulations. The calculations provided are estimates and should not be used to
              determine if you are fit to drive.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
