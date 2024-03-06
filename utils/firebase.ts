import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';  // Asegúrate de tener esta importación
import 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyBsup5FQJtDkkJC7NgVVHEEPq1SguNPwyg",
    authDomain: "videochat-e8d88.firebaseapp.com",
    projectId: "videochat-e8d88",
    storageBucket: "videochat-e8d88.appspot.com",
    messagingSenderId: "120284757304",
    appId: "1:120284757304:web:94f4b4e3c5d272ac03d5cd"
};

// Verifica si Firebase ya está inicializado antes de hacerlo nuevamente
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
// Utiliza getDatabase para obtener la instancia de la base de datos

export { firebaseApp, firestore };
export default firebaseApp;