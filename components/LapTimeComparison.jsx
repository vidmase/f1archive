import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LapTimeComparison = ({ raceData, selectedDrivers }) => {
    const [drivers, setDrivers] = useState([]);
    const [selectedLap, setSelectedLap] = useState(1);
    const [comparisonData, setComparisonData] = useState(null);
    const [error, setError] = useState(null);
    const [totalLaps, setTotalLaps] = useState(0);
    const [lapTimes, setLapTimes] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (raceData && raceData.Results) {
            const raceDrivers = raceData.Results.map(result => ({
                driverId: result.Driver.driverId,
                givenName: result.Driver.givenName,
                familyName: result.Driver.familyName
            }));
            setDrivers(raceDrivers);
        }
    }, [raceData]);

    const fetchLapTimes = async () => {
        setLoading(true);
        setError(null);
        try {
            const season = raceData.season;
            const round = raceData.round;
            const response = await axios.get(`http://ergast.com/api/f1/${season}/${round}/laps.json?limit=2000`);
            const fetchedLapTimes = response.data.MRData.RaceTable.Races[0].Laps;
            setLapTimes(fetchedLapTimes);
            setTotalLaps(fetchedLapTimes.length);
            setLoading(false);
            return fetchedLapTimes;
        } catch (err) {
            console.error('Error fetching lap times:', err);
            setError('Failed to fetch lap times. Please try again.');
            setLoading(false);
            return null;
        }
    };

    const handleLapChange = (event) => {
        setSelectedLap(parseInt(event.target.value));
        setError(null);
    };

    const handleCompare = async () => {
        if (selectedDrivers.length < 2 || selectedDrivers.length > 5) {
            setError("Please select between 2 and 5 drivers.");
            setComparisonData(null);
            return;
        }

        setLoading(true);
        let lapTimesData = lapTimes;
        if (!lapTimesData) {
            lapTimesData = await fetchLapTimes();
        }

        if (!lapTimesData || lapTimesData.length === 0) {
            setError("No lap times data available for this race.");
            setComparisonData(null);
            setLoading(false);
            return;
        }

        if (selectedLap > lapTimesData.length) {
            setError(`Selected lap (${selectedLap}) exceeds total laps (${lapTimesData.length}).`);
            setComparisonData(null);
            setLoading(false);
            return;
        }

        compareLapTimes(lapTimesData);
        setLoading(false);
    };

    const compareLapTimes = (lapTimesData) => {
        const selectedLapData = lapTimesData.find(lap => parseInt(lap.number) === selectedLap);

        if (!selectedLapData || !selectedLapData.Timings) {
            setError(`No data available for lap ${selectedLap}.`);
            setComparisonData(null);
            return;
        }

        const comparisonResult = selectedDrivers.map(driverId => {
            const driverLap = selectedLapData.Timings.find(timing => timing.driverId === driverId);
            return {
                driverId,
                lapTime: driverLap ? driverLap.time : 'N/A'
            };
        });

        if (comparisonResult.every(result => result.lapTime === 'N/A')) {
            setError(`No lap time data available for selected drivers on lap ${selectedLap}.`);
            setComparisonData(null);
        } else {
            setComparisonData(comparisonResult);
        }
    };

    const convertToSeconds = (timeString) => {
        const [minutes, seconds] = timeString.split(':');
        return parseFloat(minutes) * 60 + parseFloat(seconds);
    };

    return (
        <div className="w-full bg-gray-900 p-4 rounded-lg">
            <div className="mb-4">
                <label className="text-white mr-2">Select Lap:</label>
                <input
                    type="number"
                    min="1"
                    max={totalLaps}
                    value={selectedLap}
                    onChange={handleLapChange}
                    className="bg-gray-800 text-white p-2 rounded w-full md:w-auto"
                />
                <span className="text-white ml-2">
                    (Total laps: {totalLaps})
                </span>
            </div>

            <button
                onClick={handleCompare}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 w-full md:w-auto"
                disabled={selectedDrivers.length < 2 || loading}
            >
                {loading ? 'Loading...' : 'Compare'}
            </button>

            {error && (
                <div className="mt-4 p-2 bg-yellow-600 text-white rounded">
                    {error}
                </div>
            )}

            {comparisonData && (
                <div className="mt-8 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <h3 className="text-xl font-bold text-white bg-red-600 p-4">
                        Comparison Results
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-white">
                            <thead>
                                <tr className="bg-gray-700">
                                    <th className="p-3 text-left">Driver</th>
                                    <th className="p-3 text-left">Lap Time</th>
                                    <th className="p-3 text-left">Difference</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonData.map((result, index) => {
                                    const driver = drivers.find(d => d.driverId === result.driverId);
                                    const fastestTime = Math.min(...comparisonData.map(r => r.lapTime !== 'N/A' ? convertToSeconds(r.lapTime) : Infinity));
                                    const timeDiff = result.lapTime !== 'N/A' ? convertToSeconds(result.lapTime) - fastestTime : null;

                                    return (
                                        <tr key={result.driverId} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                                            <td className="p-3 flex items-center space-x-2">
                                                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-bold">
                                                    {driver?.givenName[0]}
                                                </div>
                                                <span>{driver ? `${driver.givenName} ${driver.familyName}` : result.driverId}</span>
                                            </td>
                                            <td className="p-3 font-mono">
                                                {result.lapTime}
                                            </td>
                                            <td className={`p-3 font-mono ${timeDiff === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                                                {timeDiff !== null ? (timeDiff === 0 ? 'Fastest' : `+${timeDiff.toFixed(3)}s`) : '-'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LapTimeComparison;