"use client"
import React, { useEffect, useState } from 'react';
import { database } from '../utils/firebase';
import {
    ref,
    push,
    onValue,
    off,
    DataSnapshot,
    serverTimestamp,
    get,
} from 'firebase/database'; // Añadido get

const ChatRoom: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');

    const sendMessage = async () => {
        try {
            if (inputMessage.trim() === '') return;

            const user = firebase.auth().currentUser;
            if (user) {
                await push(ref(database, 'messages'), {
                    text: inputMessage,
                    user: user.displayName,
                    timestamp: serverTimestamp(),
                });
                setInputMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        const messagesRef = ref(database, 'messages');

        const handleSnapshot = (snapshot: DataSnapshot) => {
            const messagesData: { [key: string]: { text: string; user: string } } = snapshot.val();
            if (messagesData) {
                const newMessages = Object.values(messagesData).map(
                    (message) => `${message.user}: ${message.text}`
                );
                setMessages(newMessages);
            } else {
                setMessages([]);
            }
        };

        onValue(messagesRef, handleSnapshot);

        return () => {
            off(messagesRef, 'value', handleSnapshot);
        };
    }, []);

    return (
        <div>
            <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
        </div>
    );
};

export default ChatRoom;