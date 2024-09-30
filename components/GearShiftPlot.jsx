import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

// Dynamically import Plot component with SSR disabled
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const GearShiftPlot = () => {
    const [telemetryData, setTelemetryData] = useState(null);

    useEffect(() => {
        // Fetch telemetry data from API or mock data
        axios.get('/telemetry.json')  // Fetch the mock data
            .then((response) => {
                setTelemetryData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching telemetry data:', error);
            });
    }, []);

    if (!telemetryData) return <div>Loading...</div>;

    // Extract necessary fields for plotting
    const { x, y, gear } = telemetryData;

    // Define the plot layout and data
    const plotData = [
        {
            x,
            y,
            mode: 'markers',
            marker: {
                color: gear, // Gear data to color-code the plot
                colorscale: 'Viridis',
                size: 5,
                colorbar: {
                    title: 'Gear',
                },
            },
            type: 'scatter',
        },
    ];

    const layout = {
        title: 'Gear Shifts on Track',
        xaxis: { title: 'X Coordinate' },
        yaxis: { title: 'Y Coordinate' },
        showlegend: false,
    };

    return <Plot data={plotData} layout={layout} />;
};

export default GearShiftPlot;
