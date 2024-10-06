import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function LapTimeComparison({ raceData, selectedDrivers }) {
    const [lapTimes, setLapTimes] = useState({});
    const [fastestLaps, setFastestLaps] = useState([]);
    const [averageLapTimes, setAverageLapTimes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (raceData && raceData.season && raceData.round) {
            fetchLapTimes();
        }
    }, [raceData, selectedDrivers]);

    const fetchLapTimes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://ergast.com/api/f1/${raceData.season}/${raceData.round}/laps.json?limit=2000`);
            const laps = response.data.MRData.RaceTable.Races[0]?.Laps || [];

            const lapTimesData = {};
            laps.forEach(lap => {
                lap.Timings.forEach(timing => {
                    if (!lapTimesData[timing.driverId]) {
                        lapTimesData[timing.driverId] = [];
                    }
                    lapTimesData[timing.driverId].push({
                        lap: parseInt(lap.number),
                        time: timing.time
                    });
                });
            });

            setLapTimes(lapTimesData);
            updateChartData(lapTimesData);
            calculateFastestLaps(lapTimesData);
            calculateAverageLapTimes(lapTimesData);
        } catch (error) {
            console.error('Error fetching lap times:', error);
            setError('Failed to fetch lap times data');
        }
        setLoading(false);
    };

    const updateChartData = (data) => {
        const chartData = {
            labels: Array.from({ length: Math.max(...Object.values(data).map(laps => laps.length)) }, (_, i) => i + 1),
            datasets: selectedDrivers.map((driver, index) => ({
                label: `${driver.givenName} ${driver.familyName}`,
                data: (data[driver.driverId] || []).map(lap => convertLapTimeToSeconds(lap.time)),
                borderColor: getColor(index),
                backgroundColor: getColor(index, 0.2),
                fill: false,
            }))
        };

        setChartData(chartData);
    };

    const calculateFastestLaps = (data) => {
        const fastest = selectedDrivers.map(driver => {
            const driverLaps = data[driver.driverId] || [];
            const fastestLap = driverLaps.reduce((min, lap) =>
                convertLapTimeToSeconds(lap.time) < convertLapTimeToSeconds(min.time) ? lap : min
                , driverLaps[0]);
            return { driver, fastestLap };
        });
        setFastestLaps(fastest.sort((a, b) =>
            convertLapTimeToSeconds(a.fastestLap.time) - convertLapTimeToSeconds(b.fastestLap.time)
        ));
    };

    const calculateAverageLapTimes = (data) => {
        const averages = selectedDrivers.map(driver => {
            const driverLaps = data[driver.driverId] || [];
            const sum = driverLaps.reduce((acc, lap) => acc + convertLapTimeToSeconds(lap.time), 0);
            return { driver, averageTime: sum / driverLaps.length };
        });
        setAverageLapTimes(averages.sort((a, b) => a.averageTime - b.averageTime));
    };

    const convertLapTimeToSeconds = (lapTime) => {
        const [minutes, seconds] = lapTime.split(':');
        return parseFloat(minutes) * 60 + parseFloat(seconds);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = (seconds % 60).toFixed(3);
        return `${minutes}:${remainingSeconds.padStart(6, '0')}`;
    };

    const getColor = (index, alpha = 1) => {
        const colors = ['rgba(255, 99, 132, ALPHA)', 'rgba(54, 162, 235, ALPHA)', 'rgba(255, 206, 86, ALPHA)', 'rgba(75, 192, 192, ALPHA)', 'rgba(153, 102, 255, ALPHA)'];
        return colors[index % colors.length].replace('ALPHA', alpha);
    };

    if (loading) {
        return <div className="text-white">Loading lap times...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg"
        >
            <h2 className="text-3xl font-bold mb-6 text-white">Lap Time Comparison</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {selectedDrivers.map((driver, index) => (
                    <motion.div
                        key={driver.driverId}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gray-700 p-4 rounded-lg shadow"
                    >
                        <div className="flex items-center mb-2">
                            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: getColor(index) }}></div>
                            <span className="text-white font-semibold text-lg">{`${driver.givenName} ${driver.familyName}`}</span>
                        </div>
                        <div className="text-gray-300 text-sm">
                            <p>Fastest Lap: {fastestLaps.find(fl => fl.driver.driverId === driver.driverId)?.fastestLap.time || 'N/A'}</p>
                            <p>Average Lap Time: {formatTime(averageLapTimes.find(alt => alt.driver.driverId === driver.driverId)?.averageTime || 0)}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {chartData && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-8"
                >
                    <h3 className="text-2xl font-bold mb-4 text-white">Lap Times Progression</h3>
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: { color: 'white' }
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => `${context.dataset.label}: ${formatTime(context.parsed.y)}`
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    title: { display: true, text: 'Lap Number', color: 'white' },
                                    ticks: { color: 'white' }
                                },
                                y: {
                                    title: { display: true, text: 'Lap Time (seconds)', color: 'white' },
                                    ticks: { color: 'white', callback: (value) => formatTime(value) }
                                }
                            }
                        }}
                    />
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <h3 className="text-2xl font-bold mb-4 text-white">Fastest Laps Comparison</h3>
                <Bar
                    data={{
                        labels: fastestLaps.map(fl => `${fl.driver.givenName} ${fl.driver.familyName}`),
                        datasets: [{
                            label: 'Fastest Lap Time',
                            data: fastestLaps.map(fl => convertLapTimeToSeconds(fl.fastestLap.time)),
                            backgroundColor: fastestLaps.map((_, index) => getColor(index, 0.7)),
                        }]
                    }}
                    options={{
                        indexAxis: 'y',
                        responsive: true,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: (context) => `Fastest Lap: ${formatTime(context.parsed.x)}`
                                }
                            }
                        },
                        scales: {
                            x: {
                                title: { display: true, text: 'Lap Time (seconds)', color: 'white' },
                                ticks: { color: 'white', callback: (value) => formatTime(value) }
                            },
                            y: {
                                ticks: { color: 'white' }
                            }
                        }
                    }}
                />
            </motion.div>
        </motion.div>
    );
}

export default LapTimeComparison;