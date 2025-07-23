import { useEffect, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { getToken, getUsernameFromToken } from '../utils/storage';

let globalClient = null;
let globalSubscription = null;
let globalUsername = null;
let globalListeners = new Set();
let isSubscribed = false;

export default function useChatSocket(onMessage) {
    const [connected, setConnected] = useState(false);
    const username = getUsernameFromToken();

    const onMessageCallback = useCallback((msg) => {
        if (typeof onMessage === 'function') {
            onMessage(msg);
        }
    }, [onMessage]);

    useEffect(() => {
        if (!username) return;

        if (globalUsername !== username) {
            unsubscribeFromTopic();
            disconnectSocket();
            globalUsername = username;
            globalListeners.clear();
            isSubscribed = false;
        }

        // Добавляем обработчик
        globalListeners.add(onMessageCallback);

        if (globalClient && globalClient.connected) {
            setConnected(true);

            if (!isSubscribed) {
                subscribeToTopic(username);
            }

        } else {
            const socket = new SockJS('http://localhost:8080/ws');
            const client = Stomp.over(socket);
            globalClient = client;

            client.connect(
                { Authorization: `Bearer ${getToken()}` },
                () => {
                    setConnected(true);
                    subscribeToTopic(username);
                },
                (error) => {
                    console.error('❌ Ошибка подключения WS:', error);
                    setConnected(false);
                }
            );
        }

        return () => {
            globalListeners.delete(onMessageCallback);

            if (globalListeners.size === 0) {
                unsubscribeFromTopic();
                disconnectSocket();
                isSubscribed = false;
                globalUsername = null;
            }
        };
    }, [username, onMessageCallback]);

    return {
        connected,
        client: globalClient,
        isSubscribed,
    };
}

function subscribeToTopic(username) {
    if (!globalClient || !globalClient.connected) return;
    if (isSubscribed) {
        console.log('⚠️ Уже подписан — повторная подписка не нужна');
        return;
    }

    globalSubscription = globalClient.subscribe(
        `/user/${username}/queue/messages`,
        (message) => {
            let parsed;
            try {
                parsed = JSON.parse(message.body);
            } catch {
                parsed = { text: message.body };
            }
            globalListeners.forEach((listener) => listener(parsed));
        }
    );

    isSubscribed = true;
    console.log(`✅ Подписка создана /user/${username}/queue/messages`);
}

function unsubscribeFromTopic() {
    if (globalSubscription) {
        globalSubscription.unsubscribe();
        globalSubscription = null;
        isSubscribed = false;
        console.log('🔻 Подписка отменена');
    }
}

function disconnectSocket() {
    if (globalClient && globalClient.connected) {
        globalClient.disconnect(() => {
            console.log('🔌 WebSocket отключен');
        });
        globalClient = null;
    }
}
