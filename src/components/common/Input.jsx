import React from 'react';
import './Input.scss';

const Input = ({ label, type = 'text', name, value, onChange, required = false, ...props }) => {
  return (
    <div className="input-group">
      <label htmlFor={name}>{label}{required && <span className="required">*</span>}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
    </div>
  );
};

export default Input;