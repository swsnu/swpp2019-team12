import React from 'react';

export const Label = ({ title }) => {
    return (
        <div className="leftbar-label">
            <div className="leftbar-label__title">{title}</div>
            <div className="leftbar-label__line" />
        </div>
    );
};

export const SubLabel = ({ title }) => {
    return (
        <div className="leftbar-sublabel">
            <div className="leftbar-sublabel__title">{title}</div>
            <div className="leftbar-sublabel__line" />
        </div>
    );
};
