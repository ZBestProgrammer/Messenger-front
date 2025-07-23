import React from 'react';
import { getUsernameFromToken } from '../utils/storage';

export default function MessageList({ messages }) {
    const myUsername = getUsernameFromToken();

    return (
        <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
            {messages.map(msg => (
                <div
                    key={msg.id}
                    style={{
                        textAlign: msg.senderUsername === myUsername ? 'right' : 'left',
                        marginBottom: 10,
                    }}
                >
                    <div
                        style={{
                            display: 'inline-block',
                            background: msg.senderUsername === myUsername ? '#dbecff' : '#f1f2f6',
                            padding: '10px 14px',
                            borderRadius: 12,
                            maxWidth: 300,
                            fontSize: 15,
                        }}
                    >
                        <div>{msg.text}</div>
                        <div style={{ fontSize: 11, marginTop: 4, color: '#999' }}>
                            {msg.sentAt?.slice(11, 16)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
