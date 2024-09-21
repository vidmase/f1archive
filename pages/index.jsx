import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import FeaturedRaces from "@/components/FeaturedRaces";
import Statistics from "@/components/Statistics";
import LatestNews from "@/components/LatestNews";

export default function Home() {
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
          <div className="relative z-10 text-center text-white">
            <h1 className="text-focus-in lg:text-7xl text-4xl font-bold mb-4 font-michroma">
              Welcome to the F1 Archive
            </h1>
            <p className="lg:text-xl text-sm mb-8 font-yanone-kaffeesatz">
              Explore the rich history of Formula 1 racing
            </p>
            <Link href="/search-by-race" className="heartbeat bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition duration-300">
              <span className="slide-in-blurred-left">Start Exploring</span>

            </Link>
          </div>
        </div>



        <LatestNews />

      </div>
    </>
  );
}
