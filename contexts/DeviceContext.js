import React, { createContext, useContext } from 'react';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

const DeviceContext = createContext();

export function DeviceProvider({ children }) {
    const isMobile = useDeviceDetect();

    return (
        <DeviceContext.Provider value={{ isMobile }}>
            {children}
        </DeviceContext.Provider>
    );
}

export function useDevice() {
    return useContext(DeviceContext);
}
