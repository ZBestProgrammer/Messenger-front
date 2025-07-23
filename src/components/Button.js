import React from 'react';

export default function Button({ type = "button", disabled, children, onClick }) {
    return (
        <button
            className="form-button"
            type={type}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
