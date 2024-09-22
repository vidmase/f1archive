import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import RaceResultsTable from '@/components/RaceResultsTable';
import LapTimeComparison from '@/components/LapTimeComparison';

// Dynamically import the LapTimesChart component with SSR disabled
const LapTimesChart = dynamic(() => import('@/components/LapTimesChart'), { ssr: false });

// Add the convertCountry object
const convertCountry = {
  "UK": "GB",
  "USA": "US",
  "UAE": "AE",
  // Add more country mappings as needed
};

export default function RaceResults() {
  const router = useRouter();
  const { race } = router.query;
  const [raceData, setRaceData] = useState(null);
  const [lapTimes, setLapTimes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (race) {
      const fetchRaceData = async () => {
        const response = await fetch(`/api/getRaceResults/${race[0]}/${race[1]}`);
        const data = await response.json();
        setRaceData(data.RaceData?.MRData?.RaceTable?.Races[0]);
      };

      const fetchLapTimes = async () => {
        const response = await fetch(`/api/getLapTimes/${race[0]}/${race[1]}`);
        const data = await response.json();
        setLapTimes(data.LapTimes);
      };

      fetchRaceData();
      fetchLapTimes();
    }
  }, [race]);

  const handleReturnToSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    router.push('/search-by-race').then(() => {
      setIsLoading(false);
    });
  };

  if (!raceData || !lapTimes) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white bg-[url('/assets/images/f1-background3.png')] bg-cover bg-center bg-fixed">
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/search-by-race"
          onClick={handleReturnToSearch}
          className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-disabled={isLoading}
        >
          {isLoading ? 'Returning...' : 'Return to Search'}
        </Link>
      </div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 bg-black bg-opacity-75">
        <h1 className="text-3xl font-bold mb-6 mt-16">{raceData.raceName}</h1>
        <div className="mt-8"> {/* Added margin top here */}
          <h2 className="text-2xl font-bold mb-4">Race Results</h2>

          <RaceResultsTable results={raceData.Results} />
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Lap Time Comparison</h2>
          <LapTimeComparison raceData={raceData} lapTimes={lapTimes} />
        </div>
      </div>
    </div>
  );
}
