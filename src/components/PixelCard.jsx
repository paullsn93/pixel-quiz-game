import React from 'react';

const PixelCard = ({ children, className = '', style = {} }) => {
    return (
        <div className={`pixel-card ${className}`} style={style}>
            {children}
        </div>
    );
};

export default PixelCard;
