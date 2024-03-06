import React, { useState } from 'react';
import { Auth, signInWithEmailAndPassword } from 'firebase/auth';

interface SignInFormProps {
    auth: Auth;
    onSignInSuccess: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ auth, onSignInSuccess }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onSignInSuccess();
        } catch (error) {
            console.error('Error signing in:', error);
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
                onClick={handleSignIn}
            >
                Iniciar Sesión
            </button>
        </div>
    );
};

export default SignInForm;
