import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaTimes, FaFlag, FaClock, FaTrophy, FaCar } from 'react-icons/fa';

const DriverCard = ({ driver, result, isOpen, onClose }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        const fetchDriverImage = async () => {
            try {
                const response = await axios.get(`https://www.formula1.com/en/drivers/${driver.driverId}.html`);
                const html = response.data;
                const match = html.match(/<img class="driver-image".*?src="(.*?)"/);
                if (match && match[1]) {
                    setImageUrl(match[1]);
                }
            } catch (error) {
                console.error('Error fetching driver image:', error);
            }
        };

        fetchDriverImage();
    }, [driver.driverId]);

    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.8 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, type: 'spring', stiffness: 300, damping: 24 } },
        exit: { opacity: 0, y: 20, scale: 0.8, transition: { duration: 0.2 } }
    };

    const tabContent = {
        info: (
            <>
                <p className="text-gray-300 mb-2">Number: {driver.permanentNumber}</p>
                <p className="text-gray-300 mb-2">Nationality: {driver.nationality}</p>
                <p className="text-gray-300 mb-2">Date of Birth: {driver.dateOfBirth}</p>
            </>
        ),
        race: (
            <>
                <p className="text-gray-300 mb-2">Position: {result.position}</p>
                <p className="text-gray-300 mb-2">Points: {result.points}</p>
                <p className="text-gray-300 mb-2">Status: {result.status}</p>
                {result.Time && <p className="text-gray-300 mb-2">Race Time: {result.Time.time}</p>}
                {result.grid && <p className="text-gray-300 mb-2">Grid Position: {result.grid}</p>}
                {result.laps && <p className="text-gray-300 mb-2">Laps Completed: {result.laps}</p>}
            </>
        ),
        fastest: result.FastestLap && (
            <>
                <p className="text-gray-300 mb-2">Fastest Lap: {result.FastestLap.lap}</p>
                <p className="text-gray-300 mb-2">Lap Time: {result.FastestLap.Time.time}</p>
                <p className="text-gray-300 mb-2">
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
                    className="absolute z-10 bg-gray-800 p-4 rounded-lg shadow-lg w-80 bottom-full mb-2 left-1/2 transform -translate-x-1/2"
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
                            <Image
                                src={imageUrl}
                                alt={`${driver.givenName} ${driver.familyName}`}
                                width={150}
                                height={150}
                                className="rounded-full mb-4 border-4 border-red-600"
                            />
                        )}
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {driver.givenName} {driver.familyName}
                        </h3>
                        <p className="text-xl text-red-500 font-semibold mb-4">{result.Constructor.name}</p>

                        <div className="flex justify-center space-x-2 mb-4">
                            <TabButton icon={<FaFlag />} active={activeTab === 'info'} onClick={() => setActiveTab('info')} />
                            <TabButton icon={<FaClock />} active={activeTab === 'race'} onClick={() => setActiveTab('race')} />
                            {result.FastestLap && (
                                <TabButton icon={<FaTrophy />} active={activeTab === 'fastest'} onClick={() => setActiveTab('fastest')} />
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