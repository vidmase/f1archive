import React from 'react';

const RaceStatistics = ({ statistics }) => {
    return (
        <div className="bg-white bg-opacity-10 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-white">Race Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <p className="text-gray-300">Fastest Lap:</p>
                    <p className="text-white font-bold">{statistics.fastestLap.time} (Lap {statistics.fastestLap.lap})</p>
                    <p className="text-gray-400">by {statistics.fastestLap.driver}</p>
                </div>
                <div>
                    <p className="text-gray-300">Total Pit Stops:</p>
                    <p className="text-white font-bold">{statistics.totalPitStops}</p>
                </div>
                <div>
                    <p className="text-gray-300">Average Pit Stop Time:</p>
                    <p className="text-white font-bold">{statistics.averagePitStopTime} seconds</p>
                </div>
            </div>
        </div>
    );
};

export default RaceStatistics;
