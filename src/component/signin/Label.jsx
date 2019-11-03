import React from 'react';

export const Label = ({ title }) => (
    <div className="signin-input-label">
        <div className="signin-input-label__title">{title}</div>
    </div>
);

export const SubLabel = ({ title }) => (
    <div className="signin-input-sublabel">
        <div className="signin-input-sublabel__title">{title}</div>
    </div>
);
