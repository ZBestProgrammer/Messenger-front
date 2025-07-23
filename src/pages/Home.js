import React, { useEffect, useState } from 'react';
import ChatList from '../components/ChatList';
import UserSearchBar from '../components/UserSearchBar';
import ChatWindow from '../components/ChatWindow';
import axios from 'axios';
import { getToken } from '../utils/storage';

export default function Home() {
    const [chatList, setChatList] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8080/api/getChats', {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }).then((res) => {
            setChatList(res.data);
        });
    }, []);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '10px' }}>
                <UserSearchBar onChatCreated={(newChat) => setChatList([...chatList, newChat])} />
                <ChatList chats={chatList} onSelect={(chat) => setSelectedChat(chat)} />
            </div>
            <div style={{ flex: 1, padding: '10px' }}>
                {selectedChat ? (
                    <ChatWindow chat={selectedChat} />
                ) : (
                    <div>Выберите чат слева</div>
                )}
            </div>
        </div>
    );
}
