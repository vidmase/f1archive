export default async function handler(req, res) {
  const raceYear = req.query.year;

  try {
    const response = await fetch(`http://ergast.com/api/f1/${raceYear}.json`);
    const data = await response.json();

    const circuits = data.MRData.RaceTable.Races.map((race) => ({
      label: race.raceName,
      value: race.round,
      circuitId: race.Circuit.circuitId,
      circuitName: race.Circuit.circuitName,
      locality: race.Circuit.Location.locality,
      country: race.Circuit.Location.country,
    }));

    res.status(200).json(circuits);
  } catch (error) {
    console.error('Error fetching circuits:', error);
    res.status(500).json({ error: 'Error fetching circuits' });
  }
}

// Fetch circuits corresponding to selected year
// const fetchRespectiveCircuits = async () => {
//   if (selectedYear !== "Choose a Year" && selectedYear !== null) {
//     await fetch(`http://ergast.com/api/f1/${selectedYear}.json`)
//       .then((response) => {
//         return response.json();
//       })
//       .then((data) => {
//         let circuits = [];
//         data.MRData.RaceTable.Races.map((element) => {
//           let obj = {};
//           obj["label"] = element.raceName;
//           obj["value"] = element.round;

//           circuits.push(obj);
//         });
//         setCiruitOptions(circuits);
//       });
//   } else {
//     setCiruitOptions([]);
//   }
// };
