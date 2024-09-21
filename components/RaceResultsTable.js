import { useState, useEffect } from 'react';

const RaceResultsTable = ({ data }) => {
    const [screenWidth, setScreenWidth] = useState(0);
    const minScreenSize = 875;

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="w-full mt-3">
            <table className="w-full text-center border-spacing-2">
                <thead>
                    <tr className="border-b-2 border-neutral-600 mb-2">
                        <th className="pb-2" width="10px">Pos.</th>
                        {screenWidth > minScreenSize && <th className="pb-2">Car Num.</th>}
                        <th className="pb-2" width="300px">Name</th>
                        <th className="pb-2 mb-2">Team</th>
                        <th className="pb-2" width="150px">Time / Status</th>
                        {screenWidth > minScreenSize && <th className="pb-2">Quali</th>}
                        {screenWidth > minScreenSize && <th className="pb-2">+/-</th>}
                        {screenWidth > minScreenSize && <th className="pb-2">Points</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.RaceData.MRData.RaceTable.Races[0].Results.map((finish) => (
                        <tr key={finish.position} height="50px">
                            <td className="text-center">{finish.positionText}</td>
                            {screenWidth > minScreenSize && <td className="text-center" width="100px">{finish.number}</td>}
                            <td>{finish.Driver.givenName} {finish.Driver.familyName}</td>
                            <td>{finish.Constructor.name}</td>
                            <td className="text-center">{finish.Time ? finish.Time.time : finish.status}</td>
                            {screenWidth > minScreenSize && <td>{finish.grid}</td>}
                            {screenWidth > minScreenSize && (
                                <td>
                                    {finish.positionText === "R"
                                        ? "-"
                                        : finish.grid - finish.position > 0
                                            ? "+" + (finish.grid - finish.position)
                                            : finish.grid - finish.position}
                                </td>
                            )}
                            {screenWidth > minScreenSize && <td>{finish.points > 0 ? "+" + finish.points : "-"}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RaceResultsTable;
