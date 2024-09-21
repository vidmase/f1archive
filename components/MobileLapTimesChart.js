import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MobileLapTimesChart = ({ lapTimes }) => {
    const [selectedDrivers, setSelectedDrivers] = useState(Object.keys(lapTimes).slice(0, 3));

    const toggleDriver = (driver) => {
        if (selectedDrivers.includes(driver)) {
            setSelectedDrivers(selectedDrivers.filter(d => d !== driver));
        } else {
            setSelectedDrivers([...selectedDrivers, driver]);
        }
    };

    const data = {
        labels: Array.from({ length: Object.values(lapTimes)[0].length }, (_, i) => i + 1),
        datasets: selectedDrivers.map(driver => ({
            label: driver,
            data: lapTimes[driver],
            borderColor: getRandomColor(),
            fill: false,
        })),
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: (context) => `Lap ${context[0].label}`,
                    label: (context) => {
                        const driver = context.dataset.label;
                        const lapTime = context.parsed.y.toFixed(3);
                        return `${driver}: ${lapTime}s`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Lap Number',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Lap Time (seconds)',
                },
                ticks: {
                    callback: (value) => value.toFixed(1),
                },
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
    };

    return (
        <div className="w-full">
            <div className="h-64 mb-4">
                <Line data={data} options={options} />
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
                {Object.keys(lapTimes).map(driver => (
                    <button
                        key={driver}
                        onClick={() => toggleDriver(driver)}
                        className={`px-2 py-1 rounded ${selectedDrivers.includes(driver) ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'
                            }`}
                    >
                        {driver}
                    </button>
                ))}
            </div>
        </div>
    );
};

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default MobileLapTimesChart;
