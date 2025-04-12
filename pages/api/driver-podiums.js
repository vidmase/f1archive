import axios from 'axios';

export default async function handler(req, res) {
  const { driverId } = req.query;

  if (!driverId) {
    return res.status(400).json({ error: 'driverId is required' });
  }

  try {
    const response = await axios.get(
      `http://ergast.com/api/f1/drivers/${driverId}/results.json?limit=1000`
    );

    const podiums = response.data.MRData.RaceTable.Races.filter(
      (race) =>
        race.Results && race.Results.length > 0 && race.Results[0].position <= 3
    ).length;

    res.status(200).json({ driverId, podiums });
  } catch (error) {
    console.error('Error fetching driver podiums:', error);
    res
      .status(500)
      .json({ error: 'Failed to fetch driver podiums', details: error.message });
  }
}
