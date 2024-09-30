import React from 'react';
import classNames from 'classnames';

export const Select = ({ children, className, ...props }) => {
    return (
        <select className={classNames("p-2 rounded bg-gray-800 text-white", className)} {...props}>
            {children}
        </select>
    );
};
