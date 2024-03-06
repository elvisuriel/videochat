"use client"
// components/ChatRoom.tsx
import React, { useEffect, useState } from 'react';
import {
    firebaseApp,
} from '../utils/firebase';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    Auth,
} from 'firebase/auth';
import {
    getDatabase,
    ref as databaseRef,
    push as databasePush,
    onValue as databaseOnValue,
    off as databaseOff,
    DataSnapshot,
    serverTimestamp,
} from 'firebase/database';

interface User {
    email: string;
}

const ChatRoom: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const auth: Auth = getAuth(firebaseApp);
    const database = getDatabase(firebaseApp);

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user ? { email: user.email || '' } : null);
        });

        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        const messagesRef = databaseRef(database, 'messages');

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

        databaseOnValue(messagesRef, handleSnapshot);

        return () => {
            databaseOff(messagesRef, 'value', handleSnapshot);
        };
    }, [database]);

    const sendMessage = async () => {
        try {
            if (inputMessage.trim() === '') return;

            const currentUser = auth.currentUser;
            if (currentUser) {
                await databasePush(databaseRef(database, 'messages'), {
                    text: inputMessage,
                    user: currentUser.email,
                    timestamp: serverTimestamp(),
                });
                setInputMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            {user ? (
                <div>
                    <p>Bienvenido, {user.email}!</p>
                    <button onClick={handleSignOut}>Cerrar Sesión</button>
                </div>
            ) : (
                <div>
                    <input
                        type="email"
                        placeholder="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleSignIn}>Iniciar Sesión</button>
                    <button onClick={handleSignUp}>Registrarse</button>
                </div>
            )}
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