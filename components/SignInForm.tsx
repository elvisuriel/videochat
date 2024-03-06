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
        </div>
    );
};

export default SignInForm;