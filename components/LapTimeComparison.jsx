import React, { useState, useEffect } from 'react';

const MobileLapTimesComparison = ({ lapTimes, drivers }) => {
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const [maxLaps, setMaxLaps] = useState(0);

    useEffect(() => {
        if (lapTimes && Object.keys(lapTimes).length > 0) {
            const lapsCount = Math.max(...Object.values(lapTimes).map(laps => laps.length));
            setMaxLaps(lapsCount);
        }
    }, [lapTimes]);

    const toggleDriver = (driverId) => {
        if (selectedDrivers.includes(driverId)) {
            setSelectedDrivers(selectedDrivers.filter(d => d !== driverId));
        } else if (selectedDrivers.length < 3) {
            setSelectedDrivers([...selectedDrivers, driverId]);
        }
    };

    const formatLapTime = (time) => {
        return typeof time === 'number' ? time.toFixed(3) : '-';
    };

    if (!lapTimes || Object.keys(lapTimes).length === 0 || !drivers || drivers.length === 0) {
        return <div>Loading lap times data...</div>;
    }

    return (
        <div className="w-full">
            <div className="mb-4">
                <h3 className="text-sm font-bold mb-2">Select Drivers (max 3):</h3>
                <div className="flex flex-col gap-2">
                    {drivers.map(driver => (
                        <button
                            key={driver.driverId}
                            onClick={() => toggleDriver(driver.driverId)}
                            className={`px-2 py-1 rounded text-xs text-left ${selectedDrivers.includes(driver.driverId) ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'
                                }`}
                        >
                            {`${driver.givenName} ${driver.familyName}`}
                        </button>
                    ))}
                </div>
            </div>

            {selectedDrivers.length > 0 && maxLaps > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-gray-800">
                                <th className="p-2">Lap</th>
                                {selectedDrivers.map(driverId => (
                                    <th key={driverId} className="p-2">
                                        {drivers.find(d => d.driverId === driverId).familyName}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: maxLaps }, (_, index) => (
                                <tr key={index} className="border-b border-gray-700">
                                    <td className="p-2">{index + 1}</td>
                                    {selectedDrivers.map(driverId => {
                                        const lapTime = lapTimes[driverId]?.[index];
                                        const bestLapTime = Math.min(...selectedDrivers.map(d => lapTimes[d]?.[index] || Infinity));
                                        const diff = lapTime - bestLapTime;
                                        return (
                                            <td key={driverId} className="p-2">
                                                {formatLapTime(lapTime)}
                                                {diff > 0 && <span className="text-red-500 ml-1">+{formatLapTime(diff)}</span>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MobileLapTimesComparison;
