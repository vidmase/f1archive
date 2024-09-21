import { convertCountry } from "@/utils/convertCountry";

export default async function handler(req, res) {
    const raceYear = req.query.results[0];
    const raceCircuit = req.query.results[1];

    try {
        const data = {};
        const raceResponse = await fetch(
            `http://ergast.com/api/f1/${raceYear}/${raceCircuit}/results.json`
        );

        if (!raceResponse.ok) {
            throw new Error(`HTTP error! status: ${raceResponse.status}`);
        }

        data["RaceData"] = await raceResponse.json();

        // Check if the race data exists and has the expected structure
        if (data.RaceData?.MRData?.RaceTable?.Races[0]) {
            const country = data.RaceData.MRData.RaceTable.Races[0].Circuit.Location.country;
            data["convertCountry"] = convertCountry[country] || country;
        } else {
            data["convertCountry"] = null;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching race results:', error);
        res.status(500).json({ error: 'Failed to fetch race results' });
    }
}
