import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from '../styles/ChatWindow.module.css';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import { getUsernameFromToken } from '../utils/storage';
import useChatSocket from '../hooks/useChatSocket';

export default function ChatWindow({ chat }) {
    const [messages, setMessages] = useState([]);
    const username = getUsernameFromToken();
    const messagesEndRef = useRef(null);

    // 🔄 Загружаем историю при монтировании
    useEffect(() => {
        if (!chat?.chatId) return;

        fetch('http://localhost:8080/api/getMessages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({ chatId: chat.chatId }),
        })
            .then(res => res.json())
            .then(data => {
                setMessages(data);
            })
            .catch(error => {
                console.error('❌ Ошибка загрузки истории:', error);
            });
    }, [chat.chatId]);

    const handleIncoming = useCallback((msg) => {
        if (
            (msg.senderUsername === chat.username && msg.recipientUsername === username) ||
            (msg.senderUsername === username && msg.recipientUsername === chat.username)
        ) {
            setMessages((prev) => [...prev, msg]);
        }
    }, [chat.username, username]);

    const { connected, client } = useChatSocket(handleIncoming);

    const handleSend = (text) => {
        if (!client || !client.connected) return;

        const newMessage = {
            chatId: chat.chatId,
            senderUsername: username,
            recipientUsername: chat.username,
            text,
            sentAt: new Date().toISOString(),
        };

        client.send('/app/chat', {}, JSON.stringify(newMessage));
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className={styles.window}>
            <div className={styles.header}>
                {chat.firstName} {chat.lastName} (@{chat.username})
                {connected ? (
                    <span style={{ color: 'green', fontSize: 12, marginLeft: 8 }}>🟢 Онлайн</span>
                ) : (
                    <span style={{ color: 'gray', fontSize: 12, marginLeft: 8 }}>🔌 Оффлайн</span>
                )}
            </div>
            <MessageList messages={messages} />
            <div ref={messagesEndRef} />
            <MessageInput onSend={handleSend} />
        </div>
    );
}
