import React from 'react';

export const Label = ({ title }) => (
    <div className="workspace-leftbar-label">
        <div className="workspace-leftbar-label__title">{title}</div>
        <div className="workspace-leftbar-label__line" />
    </div>
);

export const SubLabel = ({ title }) => (
    <div className="workspace-leftbar-sublabel">
        <div className="workspace-leftbar-sublabel__title">{title}</div>
        <div className="workspace-leftbar-sublabel__line" />
    </div>
);
