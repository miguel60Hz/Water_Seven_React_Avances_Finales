import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import '../components/Navbar.jsx';
export default function Chat() {
    const { usuario } = useAuth();
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const chatRef = useRef(null);

    useEffect(() => {
        cargarMensajes();
        const interval = setInterval(cargarMensajes, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [mensajes]);

    const cargarMensajes = async () => {
        try {
            const msgs = await api.obtenerMensajes();
            setMensajes(msgs);
        } catch (e) {
            console.error("Error al cargar mensajes:", e);
        }
    };

    const handleEnviar = async () => {
        if (!usuario) { alert("Debes iniciar sesión para chatear"); return; }
        if (nuevoMensaje.trim() === "") return;

        try {
            await api.enviarMensaje(usuario.id, nuevoMensaje.trim());
            setNuevoMensaje('');
            await cargarMensajes();
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <section className="page">
            <h1>Chat</h1>

            <div className="chat-box" ref={chatRef}>
                {mensajes.map(m => (
                    <p key={m.id}>
                        <strong>{m.remitente_nombre || 'Anónimo'}:</strong> {m.contenido}
                    </p>
                ))}
            </div>

            <div className="chat-controls">
                <input
                    className="chat-input"
                    placeholder="Mensaje..."
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEnviar()}
                />
                <button className="btn-enviar" onClick={handleEnviar}>Enviar</button>
            </div>
        </section>
    );
}
