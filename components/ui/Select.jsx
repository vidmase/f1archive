import React from 'react';

const Select = ({ children, className, ...props }) => (
    <select className={`p-2 rounded ${className}`} {...props}>
        {children}
    </select>
);

export default Select;
