import React from "react";

// Changed prop name from setValue to onChange
const F1Select = ({ id, options, onChange, isDisabled, value, label }) => { 
  const handleChange = (e) => {
    // Call the passed onChange handler
    if (onChange) {
      onChange(e);
    } 
  };

  return (
    <div className="w-full max-w-xs">
      {label && <label htmlFor={id || label} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
      <select
        id={id || label}
        value={value} // Ensure the select value is controlled
        onChange={handleChange}
        className="block w-full bg-red-600 text-white border border-red-700 rounded-md py-2 px-3 leading-tight focus:outline-none focus:border-red-500"
        disabled={isDisabled}
      >
        <option value="">Select {label || 'Option'}</option>
        {Array.isArray(options) && options.map((element) => (
          <option
            key={element.value}
            value={element.value}
          >
            {element.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default F1Select;
