import React from 'react';

const PixelButton = ({ children, onClick, secondary = false, className = '', disabled = false, style = {} }) => {
    return (
        <button
            className={`pixel-btn ${secondary ? 'secondary' : ''} ${className}`}
            onClick={onClick}
            disabled={disabled}
            style={{ ...style, opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
        >
            {children}
        </button>
    );
};

export default PixelButton;
