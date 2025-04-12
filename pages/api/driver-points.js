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

    const races = response.data.MRData.RaceTable.Races;
    let totalPoints = 0;

    races.forEach((race) => {
      if (race.Results && race.Results.length > 0) {
        totalPoints += parseFloat(race.Results[0].points);
      }
    });

    res.status(200).json({ driverId, totalPoints });
  } catch (error) {
    console.error('Error fetching driver total points:', error);
    res
      .status(500)
      .json({ error: 'Failed to fetch driver total points', details: error.message });
  }
}
