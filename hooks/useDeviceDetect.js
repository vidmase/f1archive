import { useState, useEffect } from 'react';

export function useDeviceDetect() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Check on mount
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
}
