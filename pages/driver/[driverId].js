import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';

export default function DriverStats() {
    const router = useRouter();
    const { driverId } = router.query;
    const [driverData, setDriverData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (driverId) {
            fetchDriverData();
        }
    }, [driverId]);

    const fetchDriverData = async () => {
        try {
            const response = await axios.get(`/api/driverStats/${driverId}`);
            setDriverData(response.data);
        } catch (error) {
            console.error('Error fetching driver data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!driverData) return <div>No data available</div>;

    return (
        <div>
            <Navbar />
            <h1>{driverData.givenName} {driverData.familyName}</h1>
            {/* Display other driver stats here */}
        </div>
    );
}
