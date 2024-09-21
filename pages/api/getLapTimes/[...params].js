export default async function handler(req, res) {
    const [year, round] = req.query.params;

    try {
        const response = await fetch(`http://ergast.com/api/f1/${year}/${round}/laps.json?limit=2000`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        res.status(200).json({ LapTimes: data.MRData.RaceTable.Races[0].Laps });
    } catch (error) {
        console.error('Error fetching lap times:', error);
        res.status(500).json({ error: 'Failed to fetch lap times' });
    }
}
