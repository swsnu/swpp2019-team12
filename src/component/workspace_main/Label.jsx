import React from 'react';

export const Label = ({ title }) => (
    <div className="workspace-main-label">
        <div className="workspace-main-label__title">{title}</div>
    </div>
);

export const SubLabel = ({ title }) => (
    <div className="workspace-main-sublabel">
        <div className="workspace-main-sublabel__title">{title}</div>
    </div>
);
