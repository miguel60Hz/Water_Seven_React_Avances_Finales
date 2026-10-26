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
            setUsuariosEnLinea(Math.floor(Math.random() * 15) + 5);
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

    const esMensajePropio = (remitenteId) => usuario && remitenteId === usuario.id;

    return (
        <section className="page">
            <div className="chat-header">
                <div className="header-contenido">
                    <div className="estado-conexion">
                        <span className="punto-en-linea"></span>
                        <span>{usuariosEnLinea} en línea</span>
                    </div>
                    <h1>Chat de Comunidad</h1>
                    <p className="chat-subtitle">
                        Conversa con otros miembros de Water Seven sobre fuentes de agua,
                        alertas y cuidados del recurso hídrico.
                    </p>
                </div>
            </div>

            <div className="chat-card">
                <div className="chat-bienvenida">
                    <div className="bienvenida-texto">
                        <i className="fa-regular fa-handshake"></i>
                        <span>¡Bienvenido al chat de la comunidad!</span>
                    </div>
                </div>

                <div className="chat-mensajes-area" ref={chatRef}>
                    {mensajes.length === 0 ? (
                        <div className="chat-vacio">
                            <div className="vacio-icono">
                                <i className="fa-regular fa-comments"></i>
                            </div>
                            <h3>Sin conversaciones aún</h3>
                            <p>Inicia tú la conversación y conecta con la comunidad Water Seven.</p>
                        </div>
                    ) : (
                        <div className="chat-mensajes">
                            {mensajes.map(m => {
                                const propio = esMensajePropio(m.remitente_id);
                                const iniciales = getInitials(m.remitente_nombre);
                                const colorAvatar = getAvatarColor(m.remitente_nombre || '');
                                const fecha = new Date(m.fecha_creacion || m.fecha_publicacion || Date.now());
                                const hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                return (
                                    <div key={m.id} className={`chat-mensaje ${propio ? 'mensaje-propio' : 'mensaje-otro'}`}>
                                        {!propio && (
                                            <div className="mensaje-avatar" style={{ backgroundColor: colorAvatar }}>
                                                {iniciales}
                                            </div>
                                        )}
                                        <div className="mensaje-burbuja">
                                            {!propio && (
                                                <span className="mensaje-nombre">{m.remitente_nombre || 'Anónimo'}</span>
                                            )}
                                            <span className="mensaje-texto">{m.contenido}</span>
                                            <span className="mensaje-hora">{hora}</span>
                                        </div>
                                        {propio && (
                                            <div className="mensaje-avatar" style={{ backgroundColor: '#3dadae' }}>
                                                {iniciales}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
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