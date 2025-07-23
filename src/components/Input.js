import React from 'react';

export default function Input({ type = "text", value, placeholder, onChange }) {
    return (
        <input
            className="form-input"
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            autoComplete="off"
        />
    );
}
