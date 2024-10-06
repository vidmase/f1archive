import axios from 'axios';

export default async function handler(req, res) {
    const { raceId } = req.query;
    const [year, round] = raceId.split('-');

    try {
        const url = `http://ergast.com/api/f1/${year}/${round}/results.json`;
        console.log('Fetching from URL:', url);

        const response = await axios.get(url);
        const raceData = response.data.MRData.RaceTable.Races[0];

        if (!raceData) {
            return res.status(404).json({ error: 'Race data not found' });
        }

        res.status(200).json(raceData);
    } catch (error) {
        console.error('Error fetching race data:', error.message);
        res.status(500).json({ error: `Failed to fetch race data: ${error.message}` });
    }
}
