import axios from 'axios';

export default async function handler(req, res) {
    console.log('API route: /api/drivers called');
    try {
        const response = await axios.get('http://ergast.com/api/f1/current/drivers.json');
        console.log('API response:', response.data);
        const drivers = response.data.MRData.DriverTable.Drivers;
        console.log('Drivers data:', drivers);
        res.status(200).json(drivers);
    } catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).json({ error: 'Failed to fetch drivers', details: error.message });
    }
}
