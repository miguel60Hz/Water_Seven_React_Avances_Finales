import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import '../components/Navbar.jsx';

export default function Comunidad() {
    const { usuario } = useAuth();
    const [publicaciones, setPublicaciones] = useState([]);
    const [nuevoPost, setNuevoPost] = useState('');
    const [tipoPost, setTipoPost] = useState('general');
    const [comentariosInputs, setComentariosInputs] = useState({});

    useEffect(() => {
        cargarPublicaciones();
    }, []);

    const cargarPublicaciones = async () => {
        try {
            const pubs = await api.obtenerPublicaciones();
            setPublicaciones(pubs);
        } catch (e) {
            console.error("Error al cargar publicaciones:", e);
        }
    };

    const handlePublicar = async () => {
        if (!usuario) { alert("Debes iniciar sesión para publicar"); return; }
        if (nuevoPost.trim() === "") return;

        try {
            await api.crearPublicacion(usuario.id, nuevoPost.trim(), tipoPost);
            setNuevoPost('');
            await cargarPublicaciones();
        } catch (e) {
            alert(e.message);
        }
    };

    const handleComentar = async (publicacionId) => {
        const texto = (comentariosInputs[publicacionId] || '').trim();
        if (!texto) return;

        try {
            await api.crearComentario(publicacionId, usuario.id, texto);
            setComentariosInputs(prev => ({ ...prev, [publicacionId]: '' }));
            await cargarPublicaciones();
        } catch (e) {
            alert(e.message);
        }
    };

    const getEstadisticas = () => {
        const miembros = new Set();
        let alertas = 0;
        let fuentes = 0;
        publicaciones.forEach(p => {
            if (p.usuario_nombre) miembros.add(p.usuario_nombre);
            if (p.tipo === 'alerta') alertas++;
            if (p.tipo === 'reporte') fuentes++;
        });
        return { miembros: miembros.size, alertas, fuentes };
    };

    const stats = getEstadisticas();

    const getEtiqueta = (tipo) => {
        switch (tipo) {
            case 'alerta': return { clase: 'roja', texto: 'Alerta' };
            case 'reporte': return { clase: 'azul', texto: 'Nueva fuente' };
            case 'consejo': return { clase: 'azul', texto: 'Consejo' };
            default: return { clase: 'azul', texto: 'General' };
        }
    };

    return (
        <div className="comunidad">
            <div className="feed">
                <h2>Comunidad</h2>
                <p className="sub">Reportes y alertas de la comunidad para cuidar nuestro recurso más importante</p>

                <div className="publicar">
                    <div className="avatar"></div>
                    <input
                        type="text"
                        placeholder="¿Qué está pasando en tu comunidad?"
                        value={nuevoPost}
                        onChange={(e) => setNuevoPost(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePublicar()}
                    />
                    <select value={tipoPost} onChange={(e) => setTipoPost(e.target.value)}>
                        <option value="general">General</option>
                        <option value="reporte">Nueva fuente</option>
                        <option value="alerta">Alerta</option>
                        <option value="consejo">Consejo</option>
                    </select>
                    <button className="btn-publicar" onClick={handlePublicar}>Publicar</button>
                </div>

                {publicaciones.length === 0 ? (
                    <p className="empty-state">No hay publicaciones aún. ¡Sé el primero!</p>
                ) : (
                    publicaciones.map(p => {
                        const clase = p.tipo === 'alerta' ? 'roja' : 'azul';
                        const icono = p.tipo === 'alerta' ? '!' : p.tipo === 'reporte' ? '*' : p.tipo === 'consejo' ? '~' : '#';
                        const etiqueta = getEtiqueta(p.tipo);

                        return (
                            <div key={p.id} className={`card ${clase}`}>
                                <div className="icono">{icono}</div>
                                <div className="contenido">
                                    <div className="top">
                                        <span className="nombre">{p.usuario_nombre || 'Anónimo'}</span>
                                        <span className="tiempo">{p.fecha_publicacion}</span>
                                        <span className={`etiqueta ${etiqueta.clase}`}>{etiqueta.texto}</span>
                                    </div>
                                    <p>{p.contenido}</p>

                                    {p.comentarios && p.comentarios.length > 0 && (
                                        <div className="comentarios-lista">
                                            {p.comentarios.map(c => (
                                                <p key={c.id}><strong>{c.usuario_nombre}:</strong> {c.contenido}</p>
                                            ))}
                                        </div>
                                    )}

                                    {usuario && (
                                        <div className="comentario-input">
                                            <input
                                                type="text"
                                                placeholder="Escribe un comentario..."
                                                value={comentariosInputs[p.id] || ''}
                                                onChange={(e) => setComentariosInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                                                onKeyDown={(e) => e.key === 'Enter' && handleComentar(p.id)}
                                            />
                                            <button onClick={() => handleComentar(p.id)}>Enviar</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="sidebar">
                <div className="box">
                    <h3>Tipos de reporte</h3>
                    <p>Nueva fuente</p>
                    <p>Agua contaminada</p>
                </div>

                <div className="box">
                    <h3>Estadísticas de la comunidad</h3>
                    <p>{stats.miembros} Miembros</p>
                    <p>{stats.fuentes} Fuentes</p>
                    <p>{stats.alertas} Alertas</p>
                </div>

                <div className="box verde">
                    <h3>Consejo del día</h3>
                    <p>Cuida el agua hoy para tener un mejor mañana</p>
                </div>
            </div>
        </div>
    );
}
