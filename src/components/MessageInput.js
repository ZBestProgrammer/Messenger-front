import React, { useState } from 'react';

export default function MessageInput({ onSend }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (trimmed) {
            onSend(trimmed);
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', padding: '10px', gap: '10px' }}>
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                type="text"
                placeholder="Написать сообщение..."
                style={{
                    flex: 1,
                    padding: '10px 14px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                }}
            />
            <button
                type="submit"
                style={{
                    background: '#467aff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontWeight: 600,
                    cursor: 'pointer',
                }}
            >
                ➤
            </button>
        </form>
    );
}
