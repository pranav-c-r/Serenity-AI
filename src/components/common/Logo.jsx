import React from 'react';

const Logo = ({ size = 40, className = '' }) => {
  return (
    <img 
      src="/circlelogo.png"
      alt="Serenity AI Logo"
      width={size}
      height={size}
      className={className}
    />
  );
};

export default Logo; 