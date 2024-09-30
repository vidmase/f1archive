import { useState, useEffect } from 'react';

const Standings = ({ year }) => {
    const [driverStandings, setDriverStandings] = useState([]);
    const [constructorStandings, setConstructorStandings] = useState([]);
    const [selectedStandings, setSelectedStandings] = useState('driver');

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                console.log(`Fetching driver standings for year: ${year}`);
                const driverResponse = await fetch(`https://ergast.com/api/f1/${year}/driverStandings.json`);
                const driverData = await driverResponse.json();
                console.log('Driver Standings Data:', driverData);
                setDriverStandings(driverData.MRData.StandingsTable.StandingsLists[0].DriverStandings);

                console.log(`Fetching constructor standings for year: ${year}`);
                const constructorResponse = await fetch(`https://ergast.com/api/f1/${year}/constructorStandings.json`);
                const constructorData = await constructorResponse.json();
                console.log('Constructor Standings Data:', constructorData);
                setConstructorStandings(constructorData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings);
            } catch (error) {
                console.error('Error fetching standings:', error);
            }
        };

        if (year) {
            fetchStandings();
        }
    }, [year]);

    const handleStandingsChange = (event) => {
        setSelectedStandings(event.target.value);
    };

    return (
        <div className="bg-black bg-opacity-75 p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Current Standings</h2>
            <div className="mb-4">
                <label className="text-white mr-2">Select Standings:</label>
                <select
                    onChange={handleStandingsChange}
                    className="bg-gray-800 text-white p-2 rounded"
                    value={selectedStandings}
                >
                    <option value="driver">Driver Standings</option>
                    <option value="constructor">Constructor Standings</option>
                </select>
            </div>
            {selectedStandings === 'driver' ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-black text-white">
                        <thead>
                            <tr className="bg-gray-800">
                                <th className="py-2 px-4 text-left">Position</th>
                                <th className="py-2 px-4 text-left">Driver</th>
                                <th className="py-2 px-4 text-left">Points</th>
                                <th className="py-2 px-4 text-left">Wins</th>
                            </tr>
                        </thead>
                        <tbody>
                            {driverStandings.map((driver, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-gray-700 animate-text-focus-in"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <td className="py-2 px-4">{driver.position}</td>
                                    <td className="py-2 px-4">{driver.Driver.givenName} {driver.Driver.familyName}</td>
                                    <td className="py-2 px-4">{driver.points}</td>
                                    <td className="py-2 px-4">{driver.wins}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-black text-white">
                        <thead>
                            <tr className="bg-gray-800">
                                <th className="py-2 px-4 text-left">Position</th>
                                <th className="py-2 px-4 text-left">Constructor</th>
                                <th className="py-2 px-4 text-left">Points</th>
                                <th className="py-2 px-4 text-left">Wins</th>
                            </tr>
                        </thead>
                        <tbody>
                            {constructorStandings.map((constructor, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-gray-700 animate-text-focus-in"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <td className="py-2 px-4">{constructor.position}</td>
                                    <td className="py-2 px-4">{constructor.Constructor.name}</td>
                                    <td className="py-2 px-4">{constructor.points}</td>
                                    <td className="py-2 px-4">{constructor.wins}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Standings;
