import { useState, useEffect } from 'react';

const Statistics = () => {
    const [stats, setStats] = useState({
        totalRaces: 0,
        totalDrivers: 0,
        totalConstructors: 0,
        currentSeasonRaces: 0,
        currentSeasonWinners: 0,
        mostWinsDriver: '',
        mostWinsConstructor: '',
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [racesRes, driversRes, constructorsRes, currentSeasonRes, winnersRes] = await Promise.all([
                    fetch('http://ergast.com/api/f1/races.json?limit=1'),
                    fetch('http://ergast.com/api/f1/drivers.json?limit=1'),
                    fetch('http://ergast.com/api/f1/constructors.json?limit=1'),
                    fetch('http://ergast.com/api/f1/current.json'),
                    fetch('http://ergast.com/api/f1/current/results/1.json'),
                ]);

                const [racesData, driversData, constructorsData, currentSeasonData, winnersData] = await Promise.all([
                    racesRes.json(),
                    driversRes.json(),
                    constructorsRes.json(),
                    currentSeasonRes.json(),
                    winnersRes.json(),
                ]);

                const uniqueWinners = new Set(winnersData.MRData.RaceTable.Races.map(race => race.Results[0].Driver.driverId));

                setStats({
                    totalRaces: racesData.MRData.total,
                    totalDrivers: driversData.MRData.total,
                    totalConstructors: constructorsData.MRData.total,
                    currentSeasonRaces: currentSeasonData.MRData.RaceTable.Races.length,
                    currentSeasonWinners: uniqueWinners.size,
                    mostWinsDriver: 'Lewis Hamilton', // This would require additional API calls to determine
                    mostWinsConstructor: 'Ferrari', // This would require additional API calls to determine
                });
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <section className="py-16 bg-red-600 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">F1 Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {Object.entries(stats).map(([key, value]) => (
                        <div key={key} className="text-center tracking-in-expand">
                            <div className="text-4xl font-bold mb-2">{value}</div>
                            <div className="text-xl">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;
