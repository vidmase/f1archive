import axios from 'axios';

export default async function handler(req, res) {
  const { driverId } = req.query;

  if (!driverId) {
    return res.status(400).json({ error: 'driverId is required' });
  }

  try {
    const response = await axios.get(
      `http://ergast.com/api/f1/drivers/${driverId}/results/1.json?limit=1000`
    );

    const wins = response.data.MRData.RaceTable.Races.length;
    res.status(200).json({ driverId, wins });
  } catch (error) {
    console.error('Error fetching driver wins:', error);
    res
      .status(500)
      .json({ error: 'Failed to fetch driver wins', details: error.message });
  }
}
