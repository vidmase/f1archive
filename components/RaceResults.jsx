"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";
import { cacheImage, getCachedImage } from "../utils/imageCache";
import LapTimeComparison from "@/components/LapTimeComparison"; // Import the LapTimeComparison component

export function RaceResults({ raceData }) {
    const [active, setActive] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const ref = useRef(null);
    const id = useId();

    useOutsideClick(ref, () => setActive(null));

    const getDriverImageUrl = (driverId) => {
        // Convert driverId to the format used by F1's CDN
        const formattedId = driverId.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        return `https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023drivers/${formattedId}.png.transform/2col/image.png`;
    };

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

    if (!raceData || !raceData.Results) return null;

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
                        <th className="p-2">Status</th>
                        <th className="p-2 text-left">Compare</th>
                    </tr>
                </thead>
                <tbody>
                    {raceData.Results.map((result, index) => (
                        <tr
                            key={result.Driver.driverId}
                            className={cn(
                                "border-b bg-gray-800 border-gray-700",
                                active === index && "bg-gray-600"
                            )}
                        >
                            <td className="p-2">{result.position}</td>
                            <td className="p-2 font-medium text-white whitespace-nowrap">
                                {result.Driver.givenName} {result.Driver.familyName}
                            </td>
                            <td className="p-2">{result.Constructor.name}</td>
                            <td className="p-2">{result.points}</td>
                            <td className="p-2">{result.status}</td>
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

const CloseIcon = () => {
    return (
        <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-black"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </motion.svg>
    );
};

const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
    </div>
);