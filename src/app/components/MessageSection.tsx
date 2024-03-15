import React, { useState, useEffect, useRef } from 'react';
import {
    collection,
    onSnapshot,
    addDoc,
    serverTimestamp,
    deleteDoc,
    doc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestore } from '../../../utils/firebase';

interface MessageSectionProps {
    onSendMessage: (text: string) => void;
}

interface Message {
    id: string;
    text: string;
    user: string;
    timestamp: any;
}

const MessageSection: React.FC<MessageSectionProps> = ({ onSendMessage }) => {
    const [inputMessage, setInputMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [usersOnline, setUsersOnline] = useState<string[]>([]);
    const [showClearButton, setShowClearButton] = useState<boolean>(false);
    const auth = getAuth();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const messagesCollection = collection(firestore, 'messages');

    useEffect(() => {
        const unsubscribeMessages = onSnapshot(messagesCollection, (snapshot) => {
            const newMessagesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Message));
            setMessages(newMessagesData);
            scrollToBottom();
        });

        const unsubscribeUsersOnline = onSnapshot(collection(firestore, 'usersOnline'), (snapshot) => {
            const usersOnlineData = snapshot.docs.map((doc) => doc.id);
            setUsersOnline(usersOnlineData);
        });

        return () => {
            unsubscribeMessages();
            unsubscribeUsersOnline();
        };
    }, []);

    const handleSendMessage = async () => {
        try {
            const text = inputMessage.trim();
            if (text === '') return;

            const currentUser = auth.currentUser;
            if (currentUser) {
                const newMessage: Message = {
                    id: '',
                    text,
                    user: currentUser.email || '',
                    timestamp: serverTimestamp(),
                };

                await addDoc(messagesCollection, newMessage);
                setInputMessage('');
                onSendMessage(text);
                setShowClearButton(true);
                scrollToBottom();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleClearChat = async () => {
        try {
            await Promise.all(messages.map(async (message) => {
                await deleteDoc(doc(messagesCollection, message.id));
            }));
            setMessages([]); // Limpiar el estado de mensajes después de eliminar todos los mensajes
            setShowClearButton(false);
        } catch (error) {
            console.error('Error clearing chat:', error);
        }
    };

    return (
        <div className="message-section border p-4 mx-4 my-8 max-w-md ">
            <div className="message-list max-h-48 overflow-y-auto">
                {messages.map((message) => (
                    <div key={message.id} className="message mb-2">
                        <strong>{message.user}:</strong> {message.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="user-list mb-4">
                <h2>Usuarios en línea:</h2>
                <ul>
                    {usersOnline.map((user, index) => (
                        <li key={index}>{user}</li>
                    ))}
                </ul>
            </div>
            <div className="input-section flex flex-col mt-4">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 p-2 border border-gray-300 rounded text-black"
                />
                <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer mt-2 md:mt-0"
                >
                    Enviar
                </button>
            </div>
            {showClearButton && (
                <button
                    onClick={handleClearChat}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
                >
                    Vaciar Chat
                </button>
            )}
        </div>
    );
};

export default MessageSection;
