import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Image from 'next/image';

export default function DriverStatistics() {
    const router = useRouter();
    const { driverId } = router.query;
    const [driverStats, setDriverStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (driverId) {
            fetchDriverStats();
        }
    }, [driverId]);

    const fetchDriverStats = async () => {
        try {
            const response = await fetch(`http://ergast.com/api/f1/drivers/${driverId}/results.json?limit=1000`);
            const data = await response.json();
            processDriverStats(data.MRData.RaceTable.Races);
        } catch (error) {
            console.error('Error fetching driver stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const processDriverStats = (races) => {
        const stats = {
            name: '',
            totalRaces: races.length,
            wins: 0,
            podiums: 0,
            polePositions: 0,
            fastestLaps: 0,
            points: 0,
        };

        races.forEach(race => {
            const result = race.Results[0];
            stats.name = `${result.Driver.givenName} ${result.Driver.familyName}`;
            stats.points += parseInt(result.points);
            if (result.position === '1') stats.wins++;
            if (['1', '2', '3'].includes(result.position)) stats.podiums++;
            if (result.grid === '1') stats.polePositions++;
            if (result.FastestLap && result.FastestLap.rank === '1') stats.fastestLaps++;
        });

        setDriverStats(stats);
    };

    if (loading) return <div>Loading...</div>;
    if (!driverStats) return <div>No data available</div>;

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">{driverStats.name} - Career Statistics</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Total Races" value={driverStats.totalRaces} />
                    <StatCard title="Wins" value={driverStats.wins} />
                    <StatCard title="Podiums" value={driverStats.podiums} />
                    <StatCard title="Pole Positions" value={driverStats.polePositions} />
                    <StatCard title="Fastest Laps" value={driverStats.fastestLaps} />
                    <StatCard title="Total Points" value={driverStats.points} />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-3xl font-bold text-red-500">{value}</p>
        </div>
    );
}
