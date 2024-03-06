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
            <button onClick={handleSignUp}>Registrarse</button>
        </div>
    );
};

export default SignUpForm;