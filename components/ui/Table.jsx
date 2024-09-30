import React from 'react';

export const Table = ({ children, className, ...props }) => (
    <table className={`w-full border-collapse ${className}`} {...props}>
        {children}
    </table>
);

export const TableHeader = ({ children, ...props }) => (
    <thead {...props}>{children}</thead>
);

export const TableBody = ({ children, ...props }) => (
    <tbody {...props}>{children}</tbody>
);

export const TableRow = ({ children, className, ...props }) => (
    <tr className={`${className} hover:bg-gray-700 transition-colors`} {...props}>
        {children}
    </tr>
);

export const TableHead = ({ children, className, ...props }) => (
    <th className={`p-2 text-left ${className}`} {...props}>
        {children}
    </th>
);

export const TableCell = ({ children, className, ...props }) => (
    <td className={`p-2 ${className}`} {...props}>
        {children}
    </td>
);
