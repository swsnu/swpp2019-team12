import React from 'react';

export const Label = ({ title }) => (
    <div className="signup-input-label">
        <div className="signup-input-label__title">{title}</div>
    </div>
);

export const SubLabel = ({ title }) => (
    <div className="signup-input-sublabel">
        <div className="signup-input-sublabel__title">{title}</div>
    </div>
);
