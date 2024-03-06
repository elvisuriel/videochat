// components/MessageSection.tsx
import React, { useState, useEffect } from 'react';
import {
    collection,
    onSnapshot,
    addDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestore } from '../../../utils/firebase';

interface MessageSectionProps {
    onSendMessage: (text: string) => void;
}

interface Message {
    text: string;
    user: string;
    timestamp: string;
}

const MessageSection: React.FC<MessageSectionProps> = ({ onSendMessage }) => {
    const [inputMessage, setInputMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const auth = getAuth();

    const messagesCollection = collection(firestore, 'messages');

    useEffect(() => {
        const unsubscribe = onSnapshot(messagesCollection, (snapshot) => {
            const messagesData = snapshot.docs.map((doc) => doc.data() as Message);
            setMessages(messagesData);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleSendMessage = async () => {
        try {
            const text = inputMessage.trim();
            if (text === '') return;

            const currentUser = auth.currentUser;
            if (currentUser) {
                const newMessage: Message = {
                    text,
                    user: currentUser.email || '',
                    timestamp: serverTimestamp(),
                };

                await addDoc(messagesCollection, newMessage);
                setInputMessage('');
                onSendMessage(text);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="message-section border p-4 mx-4 my-8 max-w-md">
            <div className="message-list max-h-48 overflow-y-auto">
                {messages.map((message, index) => (
                    <div key={index} className="message mb-2">
                        <strong>{message.user}:</strong> {message.text}
                    </div>
                ))}
            </div>
            <div className="input-section flex mt-4">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 p-2 border border-gray-300 rounded"
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default MessageSection;
