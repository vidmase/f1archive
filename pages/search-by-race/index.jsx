import React, { useEffect, useState } from "react";
import F1Select from "@/components/F1Select";
import Navbar from "@/components/Navbar";
import { RaceYears } from "@/utils/Constants";
import Image from "next/image";
import { Michroma } from "next/font/google";
import { useRouter } from 'next/router';

const michroma = Michroma({ subsets: ["latin"], weight: ["400"] });

export default function SearchByRace() {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCircuit, setSelectedCircuit] = useState("");
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invalidInput, setInvalidInput] = useState(true);
  const router = useRouter();

  const getCiruits = async (selectedYear) => {
    if (selectedYear !== "Choose a Year" && selectedYear !== null) {
      setLoading(true);
      try {
        const response = await fetch(`/api/getRespectiveCircuits/${selectedYear}`);
        const data = await response.json();
        setCircuits(data);
      } catch (error) {
        console.error("Error fetching circuits:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setCircuits([]);
    }
  };

  useEffect(() => {
    getCiruits(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    setInvalidInput(
      selectedYear === "Choose a Year" ||
      selectedYear === null ||
      selectedCircuit === "Choose a Circuit" ||
      selectedCircuit === null
    );
  }, [selectedYear, selectedCircuit]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!invalidInput) {
      router.push(`/search-by-race/${selectedYear}/${selectedCircuit}`);
    }
  };

  return (
    <div className="relative min-h-screen">
      <Image
        src="/assets/images/f1-background3.png"
        layout="fill"
        objectFit="cover"
        quality={100}
        alt="F1 Background"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <h1 className={`${michroma.className} text-6xl font-bold text-center text-red-600 mb-20`}>
              Search by Race
            </h1>
            <div className="flex justify-center items-start space-x-8 w-full max-w-2xl mb-8">
              <F1Select
                id="Year"
                options={RaceYears}
                setValue={setSelectedYear}
                isDisabled={false}
              />
              <F1Select
                id="Circuit"
                options={circuits}
                setValue={setSelectedCircuit}
                isDisabled={loading}
              />
            </div>
            <button
              className={`shine-button ${invalidInput ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleSearch}
              disabled={invalidInput}
            >
              Shine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
