import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { Michroma } from 'next/font/google';
import { RaceResults } from '@/components/RaceResults';
import Link from 'next/link';
import Head from 'next/head';

const michroma = Michroma({ subsets: ["latin"], weight: ["400"] });

const countryFlags = {
  'Australia': 'AU',
  'Austria': 'AT',
  'Azerbaijan': 'AZ',
  'Bahrain': 'BH',
  'Belgium': 'BE',
  'Brazil': 'BR',
  'Canada': 'CA',
  'China': 'CN',
  'France': 'FR',
  'Germany': 'DE',
  'Hungary': 'HU',
  'Italy': 'IT',
  'Japan': 'JP',
  'Mexico': 'MX',
  'Monaco': 'MC',
  'Netherlands': 'NL',
  'Portugal': 'PT',
  'Russia': 'RU',
  'Saudi Arabia': 'SA',
  'Singapore': 'SG',
  'Spain': 'ES',
  'United Arab Emirates': 'AE',
  'United Kingdom': 'GB',
  'United States': 'US',
  'Vietnam': 'VN',
};

const SearchByRace = () => {
  const router = useRouter();
  const { race } = router.query;
  const [year, setYear] = useState('');
  const [round, setRound] = useState('');
  const [raceData, setRaceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (race && race.length === 2) {
      setYear(race[0]);
      setRound(race[1]);
    }
  }, [race]);

  useEffect(() => {
    if (year && round) {
      fetchRaceData();
    }
  }, [year, round]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchRaceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://ergast.com/api/f1/${year}/${round}/results.json`);
      const data = await response.json();
      setRaceData(data.MRData.RaceTable.Races[0]);
    } catch (err) {
      setError('Failed to fetch race data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (year && round) {
      router.push(`/race-results?year=${year}&round=${round}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!raceData) return null;

  const { raceName, Circuit, date } = raceData;
  const flagCode = countryFlags[Circuit.Location.country] || 'unknown';

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/assets/images/f1-background3.png')" }}>
      <div className="min-h-screen bg-black bg-opacity-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-white">
            <h1 className={`${michroma.className} text-3xl font-bold mb-4`}>{raceName} {year}</h1>
            <div className="mb-4 flex items-center">
              <Image
                src={`https://flagsapi.com/${flagCode}/flat/64.png`}
                alt={`${Circuit.Location.country} flag`}
                width={64}
                height={64}
              />
              <span className="ml-4">{Circuit.Location.country}</span>
            </div>
            <p>Date: {date}</p>
            <p>Circuit: {Circuit.circuitName}</p>
            <p>Location: {Circuit.Location.locality}, {Circuit.Location.country}</p>

            {/* New Back Button */}
            <div className="mt-4 mb-6">
              <Link href="/search-by-race" passHref>
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                  <span className="mr-2">←</span> Back to Search
                </button>
              </Link>
            </div>

            <div className="mt-6">
              <RaceResults raceData={raceData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchByRace;