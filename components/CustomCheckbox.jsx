import React from "react";

const CustomCheckbox = ({ checked, onChange, disabled }) => {
    return (
        <label className="container">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
            />
            <div className="checkmark"></div>
        </label>
    );
};

export default CustomCheckbox;
