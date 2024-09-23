import React from 'react';

const Table = ({ children, ...props }) => (
    <table className="w-full border-collapse" {...props}>
        {children}
    </table>
);

const TableHeader = ({ children, ...props }) => (
    <thead {...props}>{children}</thead>
);

const TableBody = ({ children, ...props }) => (
    <tbody {...props}>{children}</tbody>
);

const TableRow = ({ children, className, ...props }) => (
    <tr className={`${className} hover:bg-gray-700 transition-colors`} {...props}>
        {children}
    </tr>
);

const TableHead = ({ children, className, ...props }) => (
    <th className={`p-2 text-left ${className}`} {...props}>
        {children}
    </th>
);

const TableCell = ({ children, className, ...props }) => (
    <td className={`p-2 ${className}`} {...props}>
        {children}
    </td>
);

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
