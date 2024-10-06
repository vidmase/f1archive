import React from 'react';

const GradientProgressBar = ({ value }) => {
    // Ensure value is between 0 and 100
    const clampedValue = Math.min(100, Math.max(0, value));

    // Calculate colors based on progress
    const redComponent = Math.max(0, 255 - (clampedValue * 5.1)); // Decreases as progress increases
    const greenComponent = clampedValue < 50 ? clampedValue * 5.1 : 255; // Increases, maxes out at 50%
    const blueComponent = 0; // Keep blue at 0 for vibrant colors

    const gradientColor = `rgb(${redComponent}, ${greenComponent}, ${blueComponent})`;

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
                className="h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{
                    width: `${clampedValue}%`,
                    background: `linear-gradient(to right, red, ${gradientColor})`,
                }}
            ></div>
        </div>
    );
};

export default GradientProgressBar;
