import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const LapTimeComparison = ({ raceData, lapTimes, mulishClass }) => {
    const [drivers, setDrivers] = useState([]);
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const [selectedLap, setSelectedLap] = useState(1);
    const [comparisonData, setComparisonData] = useState(null);
    const [error, setError] = useState(null);
    const [driverImages, setDriverImages] = useState({});

    useEffect(() => {
        if (raceData && raceData.Results) {
            const raceDrivers = raceData.Results.map(result => ({
                driverId: result.Driver.driverId,
                givenName: result.Driver.givenName,
                familyName: result.Driver.familyName
            }));
            setDrivers(raceDrivers);
            fetchDriverImages(raceDrivers);
        }
    }, [raceData]);

    const fetchDriverImages = async (drivers) => {
        const apiKey = process.env.NEXT_PUBLIC_API_SPORTS_KEY;
        const images = {};
        for (const driver of drivers) {
            try {
                const response = await axios.get(`https://v1.formula-1.api-sports.io/drivers?search=${driver.givenName} ${driver.familyName}`, {
                    headers: {
                        'x-rapidapi-host': 'v1.formula-1.api-sports.io',
                        'x-rapidapi-key': apiKey
                    }
                });
                if (response.data.response && response.data.response.length > 0) {
                    images[driver.driverId] = response.data.response[0].image;
                }
            } catch (error) {
                console.error('Error fetching driver image:', error);
            }
        }
        setDriverImages(images);
    };

    const handleDriverSelect = (event) => {
        const driverId = event.target.value;
        if (selectedDrivers.length < 5 && !selectedDrivers.includes(driverId)) {
            setSelectedDrivers([...selectedDrivers, driverId]);
        }
    };

    const handleLapChange = (event) => {
        setSelectedLap(parseInt(event.target.value));
        setError(null);
    };

    const handleCompare = () => {
        if (selectedDrivers.length >= 2 && selectedDrivers.length <= 5) {
            if (selectedLap > lapTimes.length) {
                setError("Must've exceeded track limits and got deleted by the stewards :)");
                setComparisonData(null);
            } else {
                setError(null);
                compareLapTimes();
            }
        }
    };

    const compareLapTimes = () => {
        if (!Array.isArray(lapTimes) || lapTimes.length === 0) {
            setError("No lap time data available.");
            setComparisonData(null);
            return;
        }

        const selectedLapData = lapTimes.find(lap => lap.number === selectedLap.toString());
        if (!selectedLapData || !selectedLapData.Timings) {
            setError("No data available for this lap.");
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
        setComparisonData(comparisonResult);
    };

    const resetSelectedDrivers = () => {
        setSelectedDrivers([]);
        setComparisonData(null);
        setError(null);
    };

    const removeDriver = (driverId) => {
        setSelectedDrivers(selectedDrivers.filter(id => id !== driverId));
        setComparisonData(null);
        setError(null);
    };

    return (
        <div className="w-full bg-gray-900 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-8 text-center">
                {raceData && raceData.raceName && ` - ${raceData.raceName}`}
                {raceData && raceData.season && ` ${raceData.season}`}
            </h2>

            <div className="mb-4">
                <label className="text-white mr-2">Select Drivers (2-5):</label>
                <Select
                    onChange={handleDriverSelect}
                    className="bg-gray-800 text-white p-2 rounded w-full md:w-auto"
                    value=""
                    disabled={selectedDrivers.length >= 5}
                >
                    <option value="">Select a driver</option>
                    {drivers.map(driver => (
                        <option key={driver.driverId} value={driver.driverId}>
                            {`${driver.givenName} ${driver.familyName}`}
                        </option>
                    ))}
                </Select>
            </div>

            <div className="mb-4">
                <h3 className="text-white mb-2">Selected Drivers:</h3>
                <div className="flex flex-col space-y-4">
                    {selectedDrivers.map(driverId => {
                        const driver = drivers.find(d => d.driverId === driverId);
                        return (
                            <Tippy
                                key={driverId}
                                content={
                                    <img
                                        src={driverImages[driverId] || '/assets/images/default-driver.png'}
                                        alt={`${driver.givenName} ${driver.familyName}`}
                                        className="w-32 h-32 object-cover rounded"
                                    />
                                }
                            >
                                <div className={`flex items-center justify-between bg-red-800 p-2 rounded ${mulishClass}`}>
                                    <span className="text-white text-xl">{`${driver.givenName} ${driver.familyName}`}</span>
                                    <Button
                                        onClick={() => removeDriver(driverId)}
                                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition duration-300"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </Tippy>
                        );
                    })}
                </div>
                {selectedDrivers.length > 0 && (
                    <Button
                        onClick={resetSelectedDrivers}
                        className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 transition duration-300 mt-2"
                    >
                        Reset All
                    </Button>
                )}
            </div>

            <div className="mb-4">
                <label className="text-white mr-2">Select Lap:</label>
                <input
                    type="number"
                    min="1"
                    max={lapTimes.length}
                    value={selectedLap}
                    onChange={handleLapChange}
                    className="bg-gray-800 text-white p-2 rounded w-full md:w-auto"
                />
                <span className="text-white ml-2">
                    (Total laps: {lapTimes.length})
                </span>
            </div>

            <Button
                onClick={handleCompare}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 w-full md:w-auto"
                disabled={selectedDrivers.length < 2 || selectedDrivers.length > 5}
            >
                Compare
            </Button>

            {error && (
                <div className="mt-4 p-2 bg-yellow-600 text-white rounded">
                    {error}
                </div>
            )}

            {comparisonData && (
                <div className="mt-4">
                    <h3 className="text-lg font-bold text-white mb-2">Comparison Results:</h3>
                    <Table className="w-full text-white">
                        <TableHeader>
                            <TableRow className="bg-gray-800">
                                <TableHead className="p-2">Driver</TableHead>
                                <TableHead className="p-2">Lap Time</TableHead>
                                <TableHead className="p-2">Difference</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {comparisonData.map((result, index) => {
                                const driver = drivers.find(d => d.driverId === result.driverId);
                                const fastestTime = Math.min(...comparisonData.map(r => r.lapTime !== 'N/A' ? parseFloat(r.lapTime) : Infinity));
                                const difference = result.lapTime !== 'N/A' ? (parseFloat(result.lapTime) - fastestTime).toFixed(3) : 'N/A';
                                return (
                                    <TableRow key={result.driverId} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}>
                                        <TableCell className="p-2">{`${driver.givenName} ${driver.familyName}`}</TableCell>
                                        <TableCell className="p-2">{result.lapTime}</TableCell>
                                        <TableCell className="p-2">{difference === '0.000' ? '-' : `+${difference}`}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default LapTimeComparison;
