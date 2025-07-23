import React from 'react';

export default function ChatList({ chats, onSelect }) {
    return (
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {chats.map(chat => (
                <li
                    key={chat.chatId}
                    onClick={() => onSelect(chat)}
                    style={{ padding: '10px', borderBottom: '1px solid #ccc', cursor: 'pointer' }}
                >
                    <strong>{chat.firstName} {chat.lastName}</strong> <br />
                    @{chat.username}
                </li>
            ))}
        </ul>
    );
}
