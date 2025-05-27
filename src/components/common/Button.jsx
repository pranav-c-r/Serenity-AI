import React from 'react';
import './Button.scss';

const Button = ({ children, type = 'button', disabled = false, onClick, ...props }) => {
  return (
    <button
      type={type}
      className={`custom-button ${disabled ? 'disabled' : ''}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;