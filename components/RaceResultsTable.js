import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";

const RaceResultsTable = ({ results }) => {
    if (!results || results.length === 0) {
        return <div>No race results available.</div>;
    }

    return (
        <div className="overflow-x-auto animate-fade-in">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-800">
                        <TableHead className="text-white">Pos.</TableHead>
                        <TableHead className="text-white">No.</TableHead>
                        <TableHead className="text-white">Name</TableHead>
                        <TableHead className="text-white">Team</TableHead>
                        <TableHead className="text-white">Grid</TableHead>
                        <TableHead className="text-white">Laps</TableHead>
                        <TableHead className="text-white">Fastest Lap</TableHead>
                        <TableHead className="text-white">Time/Status</TableHead>
                        <TableHead className="text-white">Points</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {results.map((result, index) => (
                        <TableRow
                            key={result.position}
                            className="border-b border-gray-700 animate-text-focus-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <TableCell className="text-white">{result.position}</TableCell>
                            <TableCell className="text-white">{result.Driver.permanentNumber || 'N/A'}</TableCell>
                            <TableCell className="text-white">{`${result.Driver.givenName} ${result.Driver.familyName}`}</TableCell>
                            <TableCell className="text-white">{result.Constructor.name}</TableCell>
                            <TableCell className="text-white">{result.grid}</TableCell>
                            <TableCell className="text-white">{result.laps}</TableCell>
                            <TableCell className="text-white">{result.FastestLap ? result.FastestLap.Time.time : 'N/A'}</TableCell>
                            <TableCell className="text-white">{result.Time ? result.Time.time : result.status}</TableCell>
                            <TableCell className="text-white">{result.points}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default RaceResultsTable;
