"use client";
import React, { useState, useRef, useId, useEffect } from "react";
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import LapTimeComparison from "./LapTimeComparison";
import axios from 'axios';
import CustomCheckbox from './CustomCheckbox';
import { Progress } from "@/components/ui/progress";
import styles from './RaceResults.module.css';
import { FaFlag, FaStopwatch, FaTrophy, FaBolt } from 'react-icons/fa';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import GradientProgressBar from './GradientProgressBar';

// Add this function at the top of your file, outside of any component
const getConstructorColor = (constructorName) => {
    const colors = {
        "Mercedes": "#00D2BE",
        "Red Bull": "#0600EF",
        "Ferrari": "#DC0000",
        "McLaren": "#FF8700",
        "Aston Martin": "#006F62",
        "Alpine": "#0090FF",
        "AlphaTauri": "#2B4562",
        "Alfa Romeo": "#900000",
        "Haas F1 Team": "#FFFFFF",
        "Williams": "#005AFF"
        // Add more constructor colors as needed
    };
    return colors[constructorName] || "#777777"; // Default to a neutral gray if not found
};

// Add this function at the top of your file, outside of any component
const getCountryCode = (nationality) => {
    const countryMap = {
        "British": "GB",
        "Dutch": "NL",
        "Mexican": "MX",
        "Spanish": "ES",
        "Monegasque": "MC",
        "Canadian": "CA",
        "Australian": "AU",
        "French": "FR",
        "Danish": "DK",
        "German": "DE",
        "Finnish": "FI",
        "Chinese": "CN",
        "Japanese": "JP",
        "Thai": "TH",
        "American": "US",
        "Russian": "RU",
        "Polish": "PL",
        "Brazilian": "BR",
        "Italian": "IT",
        "New Zealander": "NZ",
        "Swiss": "CH",
        "Belgian": "BE",
        "Austrian": "AT",
        "Swedish": "SE",
        "Indonesian": "ID",
        // Add more mappings as needed
    };
    return countryMap[nationality] || "UN"; // UN for unknown
};

const DriverCard3DContent = ({ result }) => {
    const [rotation, setRotation] = useState([0, 0, 0]);
    const groupRef = useRef();

    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime();
        setRotation([Math.sin(elapsedTime * 0.5) * 0.1, Math.cos(elapsedTime * 0.3) * 0.1, 0]);
    });

    const constructorColor = new THREE.Color(getConstructorColor(result.Constructor.name));

    return (
        <group ref={groupRef} rotation={rotation}>
            <Box args={[4, 2, 0.1]} position={[0, 0, -0.05]}>
                <meshStandardMaterial color={constructorColor} metalness={0.8} roughness={0.2} />
            </Box>
            <Text position={[-1.8, 0.8, 0]} fontSize={0.2} color="white">
                {`${result.Driver.givenName} ${result.Driver.familyName}`}
            </Text>
            <Text position={[-1.8, 0.5, 0]} fontSize={0.15} color="white">
                {result.Constructor.name}
            </Text>
            <Sphere args={[0.3, 32, 32]} position={[-1.5, -0.5, 0.2]}>
                <meshStandardMaterial color="white" metalness={0.5} roughness={0.2} />
                <Text position={[0, 0, 0.31]} fontSize={0.2} color="black">
                    {result.Driver.permanentNumber}
                </Text>
            </Sphere>
            <Text position={[0, -0.8, 0]} fontSize={0.15} color="white">
                {`Position: ${result.position} | Points: ${result.points}`}
            </Text>
            {/* Note: Flag implementation might need adjustment */}
        </group>
    );
};

const DriverCard3D = ({ result, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div className="bg-black bg-opacity-50 absolute inset-0" />
            <motion.div
                className="relative w-[80vw] h-[80vh] max-w-4xl max-h-[600px] rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <DriverCard3DContent result={result} />
                </Canvas>
            </motion.div>
        </motion.div>
    );
};

const FlagImage = ({ nationality }) => {
    const [error, setError] = useState(false);
    const countryCode = getCountryCode(nationality);

    if (error) {
        return <span>{nationality}</span>; // Fallback to text if image fails to load
    }

    return (
        <img
            src={`https://flagsapi.com/${countryCode}/flat/64.png`}
            alt={nationality}
            className="w-6 h-6 mr-2 rounded-sm"
            onError={() => setError(true)}
        />
    );
};

const DriverCardPreview = ({ result }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute z-10 w-64 p-4 rounded-xl shadow-2xl left-full ml-4 top-0 bg-gray-800 text-white"
        >
            <h3 className="text-lg font-bold mb-2">{`${result.Driver.givenName} ${result.Driver.familyName}`}</h3>
            <p className="text-sm mb-1">Team: {result.Constructor.name}</p>
            <p className="text-sm mb-1">Position: {result.position}</p>
            <p className="text-sm mb-1">Points: {result.points}</p>
            <p className="text-sm mb-1 flex items-center">
                <FlagImage nationality={result.Driver.nationality} />
                {result.Driver.nationality}
            </p>
            <p className="text-sm">Click for more details</p>
        </motion.div>
    );
};

export function RaceResults({ raceId }) {
    const [raceData, setRaceData] = useState(null);
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [hoveredDriver, setHoveredDriver] = useState(null);
    const [gradientStyle, setGradientStyle] = useState({});
    const [selectedDriver, setSelectedDriver] = useState(null);

    useEffect(() => {
        fetchRaceData();
    }, [raceId]);

    const fetchRaceData = async () => {
        setLoading(true);
        setProgress(0);
        setError(null);
        try {
            // Simulating progress
            for (let i = 0; i <= 90; i += 10) {
                await new Promise(resolve => setTimeout(resolve, 100));
                setProgress(i);
            }

            const url = `/api/race-results/${raceId}`;
            console.log('Fetching from URL:', url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Received data:', data);
            setRaceData(data);
            setProgress(100);
        } catch (error) {
            console.error('Error fetching race data:', error);
            setError(`Failed to fetch race data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const red = Math.round(255 * (100 - progress) / 100);
        const green = Math.round(255 * progress / 100);
        setGradientStyle({
            background: `linear-gradient(to right, rgb(${red}, ${green}, 0) ${progress}%, #f3f4f6 ${progress}%)`
        });
    }, [progress]);

    const handleDriverSelection = (driver) => {
        setSelectedDrivers(prev => {
            if (prev.some(d => d.driverId === driver.driverId)) {
                return prev.filter(d => d.driverId !== driver.driverId);
            } else if (prev.length < 5) {
                return [...prev, driver];
            }
            return prev;
        });
    };

    const getCountryFlag = (nationality) => {
        // You'd need to implement this function to return country flag emojis or images
        // For simplicity, we'll return a placeholder here
        return '🏁';
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="w-[60%] mb-4">
                    <GradientProgressBar value={progress} />
                </div>
                <p className="text-center text-lg font-semibold" style={{ color: '#e7ecec' }}>
                    Loading Race Results: {progress}%
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 bg-red-100 rounded-lg p-4">
                <p className="text-center text-lg font-semibold text-red-700">{error}</p>
            </div>
        );
    }

    if (!raceData) {
        return <div className="text-center text-lg font-semibold text-gray-700">No race data available</div>;
    }

    return (
        <>
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                    <tr>
                        <th className="p-2">Position</th>
                        <th className="p-2">Driver</th>
                        <th className="p-2">Team</th>
                        <th className="p-2">Points</th>
                        <th className="p-2">Select</th>
                    </tr>
                </thead>
                <tbody>
                    {raceData.Results.map((result) => (
                        <tr
                            key={result.position}
                            onMouseEnter={() => setHoveredDriver(result.Driver.driverId)}
                            onMouseLeave={() => setHoveredDriver(null)}
                            className={cn(
                                "border-b bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors duration-200",
                                hoveredDriver === result.Driver.driverId && "bg-gray-700"
                            )}
                        >
                            <td className="p-2">{result.position}</td>
                            <td className="p-2 relative">
                                {`${result.Driver.givenName} ${result.Driver.familyName}`}
                                <AnimatePresence>
                                    {hoveredDriver === result.Driver.driverId && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            className="absolute z-10 w-96 p-6 rounded-xl shadow-2xl left-full ml-4 top-0 overflow-hidden"
                                            style={{
                                                background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))`,
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.18)',
                                                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)'
                                            }}
                                        >
                                            <motion.div
                                                className="absolute top-0 left-0 w-full h-1"
                                                style={{ backgroundColor: getConstructorColor(result.Constructor.name) }}
                                                layoutId={`color-bar-${result.Driver.driverId}`}
                                            />
                                            <div className="flex items-center mb-4">
                                                <motion.div
                                                    className="w-20 h-20 rounded-full bg-gray-300 mr-4 flex items-center justify-center text-3xl font-bold relative overflow-hidden"
                                                    style={{ backgroundColor: getConstructorColor(result.Constructor.name) }}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    {result.Driver.permanentNumber}
                                                    <motion.div
                                                        className="absolute inset-0 bg-white"
                                                        initial={{ y: "100%" }}
                                                        animate={{ y: "100%" }}
                                                        whileHover={{ y: 0 }}
                                                        transition={{ type: "tween" }}
                                                    />
                                                </motion.div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-white">{`${result.Driver.givenName} ${result.Driver.familyName}`}</h3>
                                                    <p className="text-sm text-gray-300">{result.Constructor.name}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                                <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-700 p-3 rounded-lg">
                                                    <p className="text-gray-400 flex items-center"><FaFlag className="mr-2" /> Nationality</p>
                                                    <p className="font-semibold text-white flex items-center">
                                                        <img
                                                            src={`https://flagsapi.com/${getCountryCode(result.Driver.nationality)}/flat/64.png`}
                                                            alt={result.Driver.nationality}
                                                            className="w-6 h-6 mr-2 rounded-sm"
                                                        />
                                                        {result.Driver.nationality}
                                                    </p>
                                                </motion.div>
                                                <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-700 p-3 rounded-lg">
                                                    <p className="text-gray-400 flex items-center"><FaTrophy className="mr-2" /> Position</p>
                                                    <p className="font-semibold text-white text-2xl">{result.position}</p>
                                                </motion.div>
                                                <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-700 p-3 rounded-lg">
                                                    <p className="text-gray-400 flex items-center"><FaStopwatch className="mr-2" /> Grid</p>
                                                    <p className="font-semibold text-white">{result.grid}</p>
                                                </motion.div>
                                                <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-700 p-3 rounded-lg">
                                                    <p className="text-gray-400">Points</p>
                                                    <p className="font-semibold text-white text-2xl">{result.points}</p>
                                                </motion.div>
                                            </div>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className="bg-gray-700 p-3 rounded-lg mb-4"
                                            >
                                                <p className="text-gray-400">Status</p>
                                                <p className="font-semibold text-white">{result.status}</p>
                                            </motion.div>
                                            {result.FastestLap && (
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    className="bg-gray-700 p-3 rounded-lg"
                                                >
                                                    <p className="text-gray-400 flex items-center"><FaBolt className="mr-2" /> Fastest Lap</p>
                                                    <p className="font-semibold text-white">{result.FastestLap.Time.time} (Lap {result.FastestLap.lap})</p>
                                                </motion.div>
                                            )}
                                            {result.Time && (
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    className="bg-gray-700 p-3 rounded-lg mt-4"
                                                >
                                                    <p className="text-gray-400">Race Time</p>
                                                    <p className="font-semibold text-white">{result.Time.time}</p>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </td>
                            <td className="p-2">{result.Constructor.name}</td>
                            <td className="p-2">{result.points}</td>
                            <td className="p-2">
                                <CustomCheckbox
                                    checked={selectedDrivers.some(d => d.driverId === result.Driver.driverId)}
                                    onChange={() => handleDriverSelection(result.Driver)}
                                    disabled={selectedDrivers.length >= 5 && !selectedDrivers.some(d => d.driverId === result.Driver.driverId)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AnimatePresence>
                {selectedDriver && (
                    <DriverCard3D
                        result={selectedDriver}
                        onClose={() => setSelectedDriver(null)}
                    />
                )}
            </AnimatePresence>

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

export default RaceResults;  // Make sure this line is present