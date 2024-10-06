"use client";
import React, { useState, useRef, useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import LapTimeComparison from "@/components/LapTimeComparison";
import DriverCard from "@/components/DriverCard";

export function RaceResults({ raceData }) {
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const [hoveredDriver, setHoveredDriver] = useState(null);
    const ref = useRef(null);
    const id = useId();

    const handleDriverSelection = (driverId) => {
        setSelectedDrivers(prev => {
            if (prev.includes(driverId)) {
                return prev.filter(id => id !== driverId);
            } else if (prev.length < 5) {
                return [...prev, driverId];
            }
            return prev;
        });
    };

    const formatTime = (result) => {
        if (result.status === 'Finished') {
            if (result.Time && result.Time.time) {
                return result.Time.time;
            } else if (result.Time && result.Time.millis) {
                const milliseconds = parseInt(result.Time.millis);
                const minutes = Math.floor(milliseconds / 60000);
                const seconds = ((milliseconds % 60000) / 1000).toFixed(3);
                return `${minutes}:${seconds.padStart(6, '0')}`;
            }
        }

        if (result.status.startsWith('+')) {
            return result.status;
        }

        return result.status;
    };

    if (!raceData || !raceData.Results) {
        return (
            <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-4 p-4 bg-gray-800 text-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Lap Time Comparison Instructions:</h3>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Select up to 5 drivers using the checkboxes in the "Compare" column.</li>
                    <li>Scroll down to the "Lap Time Comparison" section that appears.</li>
                    <li>Choose a lap number to compare.</li>
                    <li>Click the "Compare" button to see the results.</li>
                </ol>
            </div>

            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                    <tr>
                        <th className="p-2">Position</th>
                        <th className="p-2">Driver</th>
                        <th className="p-2">Team</th>
                        <th className="p-2">Points</th>
                        <th className="p-2">Time</th>
                        <th className="p-2 text-left">Compare</th>
                    </tr>
                </thead>
                <tbody>
                    {raceData.Results.map((result, index) => (
                        <tr
                            key={result.Driver.driverId}
                            className={cn(
                                "border-b bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors duration-200",
                                hoveredDriver === result.Driver.driverId && "bg-gray-700"
                            )}
                        >
                            <td className="p-2">{result.position}</td>
                            <td
                                className="p-2 font-medium text-white whitespace-nowrap relative"
                                onMouseEnter={() => setHoveredDriver(result.Driver.driverId)}
                                onMouseLeave={() => setHoveredDriver(null)}
                            >
                                <span className="relative inline-block">
                                    {result.Driver.givenName} {result.Driver.familyName}
                                    <DriverCard
                                        driver={result.Driver}
                                        result={result}
                                        isOpen={hoveredDriver === result.Driver.driverId}
                                        onClose={() => setHoveredDriver(null)}
                                    />
                                </span>
                            </td>
                            <td className="p-2">{result.Constructor.name}</td>
                            <td className="p-2">{result.points}</td>
                            <td className={`p-2 ${result.status === 'Finished'
                                ? 'text-green-400'
                                : result.status.startsWith('+')
                                    ? 'text-yellow-400'
                                    : 'text-red-400'
                                }`}>
                                {formatTime(result)}
                            </td>
                            <td className="p-2">
                                <input
                                    type="checkbox"
                                    checked={selectedDrivers.includes(result.Driver.driverId)}
                                    onChange={() => handleDriverSelection(result.Driver.driverId)}
                                    disabled={selectedDrivers.length >= 5 && !selectedDrivers.includes(result.Driver.driverId)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedDrivers.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Lap Time Comparison</h2>
                    <LapTimeComparison
                        raceData={raceData}
                        selectedDrivers={selectedDrivers}
                    />
                </div>
            )}
        </>
    );
}