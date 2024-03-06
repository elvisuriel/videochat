// components/SignUpForm.tsx
import React, { useState } from 'react';
import { Auth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

interface SignUpFormProps {
    auth: Auth;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ auth }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSignUp = async () => {
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            // Almacena información adicional en Firestore
            const firestore = getFirestore(auth.app);
            const userRef = collection(firestore, 'users');
            await addDoc(userRef, {
                uid: user.uid,
                email: user.email,
            });
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    return (
        <div className="max-w-sm mx-auto p-6 bg-white text-gray-900 rounded shadow-md">
            <input
                className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded"
                onClick={handleSignUp}
            >
                Registrarse
            </button>
        </div>
    );
};

export default SignUpForm;
