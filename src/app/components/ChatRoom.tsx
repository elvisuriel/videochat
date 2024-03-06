"use client"
// components/ChatRoom.tsx
// components/ChatRoom.tsx
import React, { useEffect, useState } from 'react';
import { firebaseApp } from '../../../utils/firebase';
import { getAuth, Auth } from 'firebase/auth';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import {
    getDatabase,
    ref as databaseRef,
    push as databasePush,
    serverTimestamp,
} from 'firebase/database';

interface User {
    uid: string;
    email: string;
}

const ChatRoom: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const auth: Auth = getAuth(firebaseApp);
    const database = getDatabase(firebaseApp);

    const handleSignInSuccess = () => {
        setUser({
            uid: auth.currentUser?.uid || '',
            email: auth.currentUser?.email || '',
        });
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user ? { uid: user.uid, email: user.email || '' } : null);
        });

        return () => unsubscribe();
    }, [auth]);

    const sendMessage = async (text: string) => {
        try {
            if (text.trim() === '') return;

            const currentUser = auth.currentUser;
            if (currentUser) {
                await databasePush(databaseRef(database, 'messages'), {
                    text: text,
                    user: currentUser.email,
                    timestamp: serverTimestamp(),
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white text-gray-900 rounded shadow-md">
            {user ? (
                <div>
                    <p className="text-xl mb-4">Bienvenido, {user.email}!</p>
                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded"
                        onClick={() => auth.signOut()}
                    >
                        Cerrar Sesión
                    </button>
                    <div>
                        {/* Componente para mostrar y enviar mensajes */}
                        <MessageSection onSendMessage={sendMessage} />
                    </div>
                </div>
            ) : (
                <div>
                    {/* Formulario de inicio de sesión */}
                    <SignInForm auth={auth} onSignInSuccess={handleSignInSuccess} />

                    {/* Formulario de registro */}
                    <SignUpForm auth={auth} />
                </div>
            )}
        </div>
    );
};

export default ChatRoom;

interface MessageSectionProps {
    onSendMessage: (text: string) => void;
}

const MessageSection: React.FC<MessageSectionProps> = ({ onSendMessage }) => {
    const [inputMessage, setInputMessage] = useState<string>('');

    const handleSendMessage = () => {
        onSendMessage(inputMessage);
        setInputMessage('');
    };

    return (
        <div className="mt-4">
            <div className="max-h-60 overflow-y-scroll mb-4">
                {/* Mostrar mensajes */}
            </div>
            <div className="flex">
                <input
                    className="w-full px-3 py-2 border border-gray-300 rounded mr-2"
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={handleSendMessage}
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};
