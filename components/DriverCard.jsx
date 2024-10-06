import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaTimes, FaFlag, FaClock, FaTrophy, FaCar } from 'react-icons/fa';
import { HelmIcon, PodiumIcon, SpeedometerIcon } from './F1Icons';

const nationalityToCountryCode = {
    'British': 'GB',
    'Dutch': 'NL',
    'Mexican': 'MX',
    'Spanish': 'ES',
    'Monégasque': 'MC',
    'Canadian': 'CA',
    'Australian': 'AU',
    'French': 'FR',
    'Danish': 'DK',
    'German': 'DE',
    'Thai': 'TH',
    'Japanese': 'JP',
    'Chinese': 'CN',
    'Finnish': 'FI',
    'Italian': 'IT',
    'American': 'US',
    'Brazilian': 'BR',
    'Russian': 'RU',
    'Polish': 'PL',
    'Swiss': 'CH',
    'Belgian': 'BE',
    'Swedish': 'SE',
    'Indonesian': 'ID',
    // Add more nationalities and their corresponding country codes as needed
};

const DriverCard = ({ driver, result, isOpen, onClose }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        const fetchDriverImage = async () => {
            try {
                const response = await axios.get(`https://www.formula1.com/en/drivers/${driver.driverId}.html`);
                const html = response.data;
                const match = html.match(/https:\/\/media\.formula1\.com\/content\/dam\/fom-website\/drivers\/[^\s]+\.jpg\.transform\/2col\/image\.jpg/);
                if (match) {
                    const fullResolutionUrl = match[0].replace('transform/2col/', '');
                    setImageUrl(fullResolutionUrl);
                }
            } catch (error) {
                console.error('Error fetching driver image:', error);
            }
        };

        fetchDriverImage();
    }, [driver.driverId]);

    const getCountryFlag = (nationality) => {
        const countryCode = nationalityToCountryCode[nationality];
        if (countryCode) {
            return (
                <Image
                    src={`https://flagsapi.com/${countryCode}/flat/64.png`}
                    alt={`Flag of ${nationality}`}
                    width={24}
                    height={24}
                    className="inline-block mr-2 align-text-bottom"
                />
            );
        }
        return null;
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.8 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, type: 'spring', stiffness: 300, damping: 24 } },
        exit: { opacity: 0, y: 20, scale: 0.8, transition: { duration: 0.2 } }
    };

    const tabContent = {
        info: (
            <>
                <p className="text-gray-300 mb-2">
                    <HelmIcon className="inline-block w-5 h-5 mr-2 text-red-500" />
                    Number: {driver.permanentNumber}
                </p>
                <p className="text-gray-300 mb-2">
                    {getCountryFlag(driver.nationality)}
                    Nationality: {driver.nationality}
                </p>
                <p className="text-gray-300 mb-2">
                    🎂 Date of Birth: {driver.dateOfBirth}
                </p>
            </>
        ),
        race: (
            <>
                <p className="text-gray-300 mb-2">
                    <PodiumIcon className="inline-block w-5 h-5 mr-2 text-yellow-500" />
                    Position: {result.position}
                </p>
                <p className="text-gray-300 mb-2">
                    💯 Points: {result.points}
                </p>
                <p className="text-gray-300 mb-2">
                    🏁 Status: {result.status}
                </p>
                {result.Time && (
                    <p className="text-gray-300 mb-2">
                        ⏱️ Race Time: {result.Time.time}
                    </p>
                )}
                {result.grid && (
                    <p className="text-gray-300 mb-2">
                        🏎️ Grid Position: {result.grid}
                    </p>
                )}
                {result.laps && (
                    <p className="text-gray-300 mb-2">
                        🔄 Laps Completed: {result.laps}
                    </p>
                )}
            </>
        ),
        fastest: result.FastestLap && (
            <>
                <p className="text-gray-300 mb-2">
                    <FaTrophy className="inline-block text-yellow-500 mr-2" />
                    Fastest Lap: {result.FastestLap.lap}
                </p>
                <p className="text-gray-300 mb-2">
                    ⚡ Lap Time: {result.FastestLap.Time.time}
                </p>
                <p className="text-gray-300 mb-2">
                    <SpeedometerIcon className="inline-block w-5 h-5 mr-2 text-blue-500" />
                    Average Speed: {result.FastestLap.AverageSpeed.speed} {result.FastestLap.AverageSpeed.units}
                </p>
            </>
        )
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute z-10 bg-gray-800 p-4 rounded-lg shadow-lg w-96 bottom-full mb-2 left-1/2 transform -translate-x-1/2"
                    style={{ boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)' }}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <FaTimes />
                    </button>
                    <div className="flex flex-col items-center">
                        {imageUrl && (
                            <div className="relative w-full h-48 mb-4 overflow-hidden rounded-t-lg">
                                <Image
                                    src={imageUrl}
                                    alt={`${driver.givenName} ${driver.familyName}`}
                                    layout="fill"
                                    objectFit="cover"
                                    objectPosition="center top"
                                    priority
                                />
                            </div>
                        )}
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {driver.givenName} {driver.familyName}
                        </h3>
                        <p className="text-xl text-red-500 font-semibold mb-4">{result.Constructor.name}</p>

                        <div className="flex justify-center space-x-2 mb-4">
                            <TabButton icon={<HelmIcon className="w-5 h-5" />} active={activeTab === 'info'} onClick={() => setActiveTab('info')} />
                            <TabButton icon={<FaClock />} active={activeTab === 'race'} onClick={() => setActiveTab('race')} />
                            {result.FastestLap && (
                                <TabButton icon={<SpeedometerIcon className="w-5 h-5" />} active={activeTab === 'fastest'} onClick={() => setActiveTab('fastest')} />
                            )}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {tabContent[activeTab]}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const TabButton = ({ icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-full transition-colors duration-200 ${active ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
    >
        {icon}
    </button>
);

export default DriverCard;