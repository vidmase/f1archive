import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import FeaturedRaces from "@/components/FeaturedRaces";
import Statistics from "@/components/Statistics";
import LatestNews from "@/components/LatestNews";

export default function Home({ kiteOneClass, titilliumWebClass }) {
  return (
    <>
      <Navbar />
      <div className="animate-fade">
        <div className="hero-section relative h-screen flex items-center justify-center">
          <Image
            src="/assets/images/f1-background.jpg"
            layout="fill"
            objectFit="cover"
            quality={100}
            alt="F1 Race Track"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className={`text-focus-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 ${titilliumWebClass}`}>
              Welcome to the F1 Archive
            </h1>
            <p className={`text-sm sm:text-base md:text-lg lg:text-xl mb-8 ${kiteOneClass}`}>
              Explore the rich history of Formula 1 racing
            </p>
            <Link href="/search-by-race" className="heartbeat bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full hover:bg-red-700 transition duration-300">
              <span className="slide-in-blurred-left">Start Exploring</span>
            </Link>
          </div>
        </div>

        <LatestNews />
      </div>
    </>
  );
}
