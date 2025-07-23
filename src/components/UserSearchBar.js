import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/storage';

export default function UserSearchBar({ onChatCreated }) {
    const [username, setUsername] = useState('');
    const [foundUser, setFoundUser] = useState(null);
    const [error, setError] = useState('');

    const searchUser = () => {
        axios.post('http://192.168.88.39:8080/api/findUserByUsername', { username }, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then(res => {
                setFoundUser(res.data);
                setError('');
            })
            .catch(() => {
                setFoundUser(null);
                setError('Пользователь не найден');
            });
    };

    const createChat = () => {
        const currentUser = JSON.parse(atob(getToken().split('.')[1])).sub;
        axios.post('http://192.168.88.39:8080/api/createNewChat', {
            user1: currentUser,
            user2: foundUser.username
        }, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then(() => {
                alert('Чат создан');
                onChatCreated({ username: foundUser.username, firstName: foundUser.firstName, lastName: foundUser.lastName });
                setUsername('');
                setFoundUser(null);
            })
            .catch(() => alert('Такой чат уже существует'));
    };

    return (
        <div style={{ marginBottom: '10px' }}>
            <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Поиск по username"
                style={{ width: '100%', padding: '8px' }}
            />
            <button onClick={searchUser} style={{ marginTop: '5px' }}>Найти</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {foundUser && (
                <div>
                    <p>{foundUser.firstName} {foundUser.lastName}</p>
                    <button onClick={createChat}>Начать чат</button>
                </div>
            )}
        </div>
    );
}
