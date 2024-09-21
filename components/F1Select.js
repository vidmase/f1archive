import React from "react";

const F1Select = ({ id, options, setValue, isDisabled }) => {
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="w-full max-w-xs">
      <select
        id={id}
        onChange={handleChange}
        className="block w-full bg-red-600 text-white border border-red-700 rounded-md py-2 px-3 leading-tight focus:outline-none focus:border-red-500"
        disabled={isDisabled}
      >
        <option value="">{id}</option>
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
