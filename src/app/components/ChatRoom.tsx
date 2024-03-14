"use client"
import React, { useEffect, useState } from 'react';
import { firebaseApp, firestore } from '../../../utils/firebase';
import { getAuth, Auth } from 'firebase/auth';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import MessageSection from './MessageSection'; // Asegúrate de importar MessageSection

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

    const handleSignInSuccess = () => {
        setUser({
            uid: auth.currentUser?.uid || '',
            email: auth.currentUser?.email || '',
        });
    };

    const sendMessage = async (text: string) => {
        try {
            if (text.trim() === '') return;

            const currentUser = auth.currentUser;
            if (currentUser) {
                // Aquí puedes usar Firestore para almacenar el mensaje
                // Asegúrate de adaptar esto a tu estructura de datos
                const messagesRef = collection(firestore, 'messages');
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
        <div>
            {user ? (
                <div>
                    <p>Bienvenido, {user.email}!</p>
                    <button onClick={() => auth.signOut()}>Cerrar Sesión</button>
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