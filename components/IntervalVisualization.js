import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const IntervalVisualization = ({ raceId }) => {
    const [intervalData, setIntervalData] = useState(null);

    useEffect(() => {
        const fetchIntervalData = async () => {
            try {
                const response = await fetch(`https://api.openf1.org/v1/intervals?session_key=${raceId}`);
                const data = await response.json();
                setIntervalData(data);
            } catch (error) {
                console.error('Error fetching interval data:', error);
            }
        };

        if (raceId) {
            fetchIntervalData();
        }
    }, [raceId]);

    if (!intervalData) return <div>Loading interval data...</div>;

    const chartData = {
        labels: intervalData.map(d => d.date_time),
        datasets: [
            {
                label: 'Interval to Leader',
                data: intervalData.map(d => d.interval_to_leader),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Interval to Position Ahead',
                data: intervalData.map(d => d.interval_to_position_ahead),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Race Intervals',
            },
        },
    };

    return <Line options={options} data={chartData} />;
};

export default IntervalVisualization;
