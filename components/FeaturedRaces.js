import { useState, useEffect } from 'react';
import Image from 'next/image';

const FeaturedRaces = () => {
    const [featuredRaces, setFeaturedRaces] = useState([]);

    useEffect(() => {
        const fetchFeaturedRaces = async () => {
            const response = await fetch('http://ergast.com/api/f1/current/last/results.json');
            const data = await response.json();
            setFeaturedRaces(data.MRData.RaceTable.Races);
        };

        fetchFeaturedRaces();
    }, []);

    return (
        <section className="py-16 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Featured Races</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredRaces.map((race) => (
                        <div key={race.round} className="bg-white rounded-lg shadow-md overflow-hidden scale-up-center">
                            <Image
                                src={`/assets/images/circuits/${race.Circuit.circuitId}.jpg`}
                                alt={race.raceName}
                                width={400}
                                height={200}
                                layout="responsive"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-2">{race.raceName}</h3>
                                <p className="text-gray-600">{race.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedRaces;
