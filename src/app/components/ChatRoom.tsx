"use client"
import React, { useEffect, useState } from 'react';
import { firebaseApp, firestore } from '../../../utils/firebase';
import { getAuth, Auth } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import MessageSection from './MessageSection';

interface User {
    uid: string;
    email: string;
}

const ChatRoom: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const auth: Auth = getAuth(firebaseApp);

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
                const messagesRef = collection(firestore, 'messages'); // Importa la función collection
                await addDoc(messagesRef, {
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
        <div className="mx-4 font-bold text-xl text-center">
            {user ? (
                <div>
                    <p className="text-lg">¡Bienvenido, {user.email}!</p>
                    <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={() => auth.signOut()}>Cerrar Sesión</button>
                    <div className="mt-4">
                        <MessageSection onSendMessage={sendMessage} />
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-lg mb-4">Por favor, inicia sesión para continuar.</p>
                    <SignInForm auth={auth} onSignInSuccess={() => { }} />
                </div>
            )}
        </div>
    );
};

export default ChatRoom;