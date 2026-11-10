import '../styles/pages/Chat.css';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import '../components/Navbar.jsx';

const getInitials = (nombre) => {
    if (!nombre) return '?';
    return nombre.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const getAvatarColor = (nombre) => {
    const colores = ['#ff9aa2', '#ffb7b2', '#ffdac1', '#e2f0cb', '#b5ead7', '#c7ceea', '#ff9ff3', '#feca57', '#ff6b6b', '#4ecdc4'];
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) {
        hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colores[Math.abs(hash) % colores.length];
};

export default function Chat() {
    const { usuario } = useAuth();
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [usuariosEnLinea, setUsuariosEnLinea] = useState(0);
    const chatRef = useRef(null);

    const cargarMensajes = async () => {
        try {
            const msgs = await api.obtenerMensajes();
            setMensajes(msgs);
            setUsuariosEnLinea(Math.floor(Math.random() * 15) + 5);
        } catch (e) {
            console.error("Error al cargar mensajes:", e);
        }
    };

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

    const esMensajePropio = (remitenteId) => usuario && remitenteId === usuario.id;

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

            <div className="chat-enviar">
                <div className="enviar-contenedor">
                    <input
                        className="chat-input"
                        placeholder="Escribe un mensaje..."
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEnviar()}
                    />
                    <button className="btn-enviar" onClick={handleEnviar} disabled={!usuario}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
                {!usuario && (
                    <div className="alerta-sesion">
                        <i className="fa-solid fa-circle-info"></i>
                        <span>Inicia sesión para poder enviar mensajes</span>
                    </div>
                )}
            </div>
        </section>
    );
}