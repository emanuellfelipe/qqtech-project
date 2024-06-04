import React from 'react';

const Button = ({ text }) => {
    return (
        <div className="button">
            <div className="text-container">
                <div className="button-text">{text}</div>
            </div>
        </div>
    );
};

export default Button;
