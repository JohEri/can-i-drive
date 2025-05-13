import Image from "next/image"

interface MascotGuideProps {
  message: string
}

export default function MascotGuide({ message }: MascotGuideProps) {
  return (
    <div className="flex items-center">
      <div className="relative h-20 w-20 flex-shrink-0 animate-bounce">
        <Image src="/wine-mascot.png" alt="Wine Glass Mascot" width={100} height={100} className="drop-shadow-lg" />
      </div>
      <div className="ml-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
        <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 transform bg-white dark:bg-gray-800"></div>
        <p className="text-gray-800 dark:text-gray-200">{message}</p>
      </div>
    </div>
  )
}
