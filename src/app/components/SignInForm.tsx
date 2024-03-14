import React, { useState } from 'react';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface SignInFormProps {
    auth: Auth;
    onSignInSuccess: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ auth, onSignInSuccess }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isSignInMode, setIsSignInMode] = useState<boolean>(true);

    const handleSignIn = async () => {
        try {
            if (isSignInMode) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            onSignInSuccess();
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    return (
        <div className="relative flex justify-center items-center h-screen">
            <div className="absolute bg-cover bg-center inset-0" style={{ backgroundImage: "url('assets/chatt.jpg')" }}></div>
            <div className="z-10 max-w-lg p-10 border border-gray-700 bg-white text-gray-900 rounded shadow-md bg-opacity-50">
                <input
                    className="w-full mb-4 px-3 py-2 border border-gray-700 rounded"
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
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-4"
                    onClick={handleSignIn}
                >
                    {isSignInMode ? 'Iniciar Sesión' : 'Registrarse'}
                </button>
                <p className="text-center text-blue-500 cursor-pointer" onClick={() => setIsSignInMode(!isSignInMode)}>
                    {isSignInMode ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión aquí'}
                </p>
            </div>
        </div>
    );
};

export default SignInForm;
