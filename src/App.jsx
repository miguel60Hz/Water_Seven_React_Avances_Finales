import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Comunidad from './pages/Comunidad';
import Chat from './pages/Chat';
import Fuentes from './pages/Fuentes';
import Verificacion from './pages/Verificacion';
import NuevaPassword from './pages/NuevaPassword';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css';
import './responsive.css';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/comunidad" element={<Comunidad />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/fuentes" element={<Fuentes />} />
                    <Route path="/verificacion" element={<Verificacion />} />
                    <Route path="/nueva-password" element={<NuevaPassword />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
