import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Image from "next/image";

// Dynamically import the LapTimesChart component with SSR disabled
const LapTimesChart = dynamic(() => import('@/components/LapTimesChart'), { ssr: false });

// Dynamically import the RaceResultsTable component
const RaceResultsTable = dynamic(() => import('@/components/RaceResultsTable'), { ssr: false });

// Add the convertCountry object
const convertCountry = {
  "UK": "GB",
  "USA": "US",
  "UAE": "AE",
  // Add more country mappings as needed
};

export async function getServerSideProps(context) {
  const {
    params: { race },
  } = context;
  const raceYear = race[0];
  const raceCircuit = race[1];

  let data = {};
  let lapTimes = [];

  if (raceYear && raceCircuit) {
    try {
      // Race info from Ergast API
      const raceResponse = await fetch(
        `http://ergast.com/api/f1/${raceYear}/${raceCircuit}/results.json`
      );
      const raceData = await raceResponse.json();
      data.RaceData = raceData;

      if (raceData.MRData.RaceTable.Races.length > 0) {
        const countryName = raceData.MRData.RaceTable.Races[0].Circuit.Location.country;
        data.convertCountry = convertCountry[countryName] || countryName;

        // Use a more robust way to get the country code
        const countryCode = getCountryCode(data.convertCountry);

        data.countryImage = countryCode
          ? `https://flagsapi.com/${countryCode}/flat/64.png`
          : null;

        // Circuit info from Sports API
        const circuitResponse = await fetch(
          `https://v1.formula-1.api-sports.io/circuits?search=${raceData.MRData.RaceTable.Races[0].Circuit.circuitId}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "api-formula-1.p.rapidapi.com",
              "x-rapidapi-key": process.env.F1_API_KEY,
            },
          }
        );
        data.circuitData = await circuitResponse.json();

        // Fetch lap times
        const lapTimesResponse = await fetch(
          `http://ergast.com/api/f1/${raceYear}/${raceCircuit}/laps.json?limit=1000`
        );
        const lapTimesData = await lapTimesResponse.json();
        lapTimes = processLapTimes(lapTimesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Ensure all properties are defined
  data = {
    RaceData: data.RaceData || null,
    convertCountry: data.convertCountry || null,
    circuitData: data.circuitData || null,
    countryImage: data.countryImage || null,
  };

  return {
    props: {
      data: JSON.parse(JSON.stringify(data)),
      lapTimes: JSON.parse(JSON.stringify(lapTimes))
    }
  };
}

// Add this helper function to get the country code
function getCountryCode(country) {
  const countryMap = {
    "UK": "GB",
    "USA": "US",
    "UAE": "AE",
    // Add more mappings as needed
  };

  // If it's already a 2-letter code, return it
  if (country.length === 2) {
    return country.toUpperCase();
  }

  // Check if it's in our map
  if (countryMap[country]) {
    return countryMap[country];
  }

  // If not found, return null or a default
  return null;
}

function processLapTimes(lapData) {
  const drivers = {};
  lapData.MRData.RaceTable.Races[0]?.Laps.forEach(lap => {
    lap.Timings.forEach(timing => {
      if (!drivers[timing.driverId]) {
        drivers[timing.driverId] = { driverId: timing.driverId, times: [] };
      }
      drivers[timing.driverId].times.push({ lap: parseInt(lap.number), time: timing.time });
    });
  });
  return Object.values(drivers);
}

const RaceResults = ({ data, lapTimes }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="mt-10 px-12 lg:px-24 xl:px-80 w-screen text-xl">
        <Link href="/search-by-race" className="text-red-600 hover:text-red-400 transition duration-300">
          &lt; Return to Search
        </Link>
      </div>
      <div className="flex justify-center w-screen">
        {data.RaceData.MRData.RaceTable.Races.length > 0 && (
          <div className="animate-fade w-3/4 xl:w-3/5 mt-8 mb-10 bg-gray-900 p-8 rounded-lg">
            {/* Race info */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-extrabold text-xl lg:text-4xl">
                  {data.RaceData.MRData.RaceTable.season}{" "}
                  {data.RaceData.MRData.RaceTable.Races[0].raceName}
                </div>
                <div className="text-zinc-500">
                  {data.RaceData.MRData.RaceTable.Races[0].Circuit.circuitName}
                </div>
              </div>
              <div>
                {data.countryImage && (
                  <Image
                    width={75}
                    height={64}
                    src={data.countryImage}
                    alt={`${data.RaceData.MRData.RaceTable.Races[0].raceName} circuit`}
                  />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between ">
              <div className="w-1/2">
                <div>
                  {" "}
                  <span className="font-bold">Date:</span>{" "}
                  {data.RaceData.MRData.RaceTable.Races[0].date}
                </div>
                <div>
                  <span className="font-bold"> Round:</span>{" "}
                  {data.RaceData.MRData.RaceTable.Races[0].round}
                </div>
              </div>
              <div>
                <div className="text-end">
                  <span className="font-bold"> Laps:</span>{" "}
                  {data.circuitData?.response[0]?.laps}
                </div>
                <div className="text-end">
                  <span className="font-bold">Lap Record:</span>{" "}
                  {data.circuitData.response[0]?.lap_record.time} (
                  {data.circuitData.response[0]?.lap_record.driver} -{" "}
                  {data.circuitData.response[0]?.lap_record.year})
                </div>
              </div>
            </div>
            <div className="border-2 border-x-0 border-b-0 px-5 my-3 border-white"></div>
            <div className="text-2xl font-medium">Race Results</div>

            {/* Race results table */}
            {isClient && <RaceResultsTable data={data} />}

            {/* Lap times chart */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-red-600">Lap Times Comparison</h2>
              <LapTimesChart lapTimes={lapTimes} />
            </div>
          </div>
        )}

        {data.RaceData.MRData.RaceTable.Races.length === 0 && (
          <div className="text-center justify-center">
            <Image src="/assets/images/TBD.png" width="612" height="500" alt="TBD" />
            <div className="mb-3 text-white">
              This race hasn't happened yet! Check back soon!
            </div>
            <Link href={`/search-by-race`}>
              <button className="hover:cursor-pointer bg-red-600 text-white h-8 lg:h-10 items-center rounded-l-full rounded-r-full text-sm lg:text-lg px-4 py-2 hover:bg-red-700 transition ease-in-out duration-300">
                <span> &lt; Return to Search</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RaceResults;
