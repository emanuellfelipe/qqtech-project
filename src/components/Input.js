import React from 'react';
import '/src/styles/input.css'; 

const InputLabel = ({ id, label, type, placeholder, invalid }) => {
  const inputClass = `form-input ${invalid ? 'invalid' : ''}`;

  return (
    <div id="formulario">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        className={inputClass}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputLabel;
