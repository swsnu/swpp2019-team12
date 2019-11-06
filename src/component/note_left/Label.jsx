import React from 'react';

export const Label = ({ title, isTitle }) => (
    <div className={`note-left-label ${isTitle ? '--title' : ''}`}>
        <div className="note-left-label__title">{title}</div>
    </div>
);

export const SubLabel = ({ title }) => (
    <div className="note-left-sublabel">
        <div className="note-left-sublabel__title">{title}</div>
    </div>
);
