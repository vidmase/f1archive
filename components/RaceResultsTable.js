const RaceResultsTable = ({ results }) => {
    if (!results || results.length === 0) {
        return <div>No race results available.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
                <thead>
                    <tr className="bg-gray-800">
                        <th className="p-1">Pos.</th>
                        <th className="p-1">Name</th>
                        <th className="p-1">Team</th>
                        <th className="p-1">Time/Status</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result) => (
                        <tr key={result.position} className="border-b border-gray-700">
                            <td className="p-1">{result.position}</td>
                            <td className="p-1">{`${result.Driver.givenName} ${result.Driver.familyName}`}</td>
                            <td className="p-1">{result.Constructor.name}</td>
                            <td className="p-1">{result.Time ? result.Time.time : result.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RaceResultsTable;
