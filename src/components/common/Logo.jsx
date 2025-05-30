import React from 'react';

const Logo = ({ size = 40, className = '' }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
    >
      <circle cx="50" cy="50" r="45" fill="#6C63FF"/>
      <path d="M30,40 Q50,20 70,40 Q80,50 70,60 Q50,80 30,60 Q20,50 30,40" fill="white"/>
      <circle cx="40" cy="45" r="5" fill="#333"/>
      <circle cx="60" cy="45" r="5" fill="#333"/>
      <path d="M40,65 Q50,75 60,65" stroke="#333" strokeWidth="3" fill="none"/>
    </svg>
  );
};

export default Logo; 