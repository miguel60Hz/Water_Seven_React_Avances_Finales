import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ENLACES = [
    { to: '/', texto: 'Inicio', icono: 'fa-house' },
    { to: '/fuentes', texto: 'Encontrar agua', icono: 'fa-droplet' },
    { to: '/comunidad', texto: 'Comunidad', icono: 'fa-users' },
    { to: '/chat', texto: 'Chat', icono: 'fa-comments' },
];

export default function Navbar() {
    const { usuario, logout } = useAuth();
    const [menuAbierto, setMenuAbierto] = useState(false);

    const cerrarMenu = () => setMenuAbierto(false);

    useEffect(() => {
        document.body.classList.toggle('menu-abierto', menuAbierto);
        return () => document.body.classList.remove('menu-abierto');
    }, [menuAbierto]);

    useEffect(() => {
        if (!menuAbierto) return undefined;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setMenuAbierto(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [menuAbierto]);

    return (
        <>
            <header className="navbar">
                <div className="logo">
                    <img src="/imagenes/logo.png" alt="Water Seven" />
                    <div><h1>Water Seven</h1></div>
                </div>

                <nav className="nav-desktop">
                    {ENLACES.map(e => (
                        <span key={e.to} className="badge">
                            <Link to={e.to}>{e.texto}</Link>
                        </span>
                    ))}
                </nav>

                <div className="auth">
                    {usuario ? (
                        <div className="user-info">
                            <span className="user-name">{usuario.nombre}</span>
                            <button className="btn-outline" onClick={logout}>Cerrar sesión</button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login"><button className="btn-outline">Iniciar sesión</button></Link>
                            <Link to="/registro"><button className="btn-primary">Registrarse</button></Link>
                        </>
                    )}
                </div>

                <button
                    className="nav-toggle"
                    onClick={() => setMenuAbierto(v => !v)}
                    aria-expanded={menuAbierto}
                    aria-label="Abrir menú de navegación"
                >
                    <span /><span /><span />
                </button>
            </header>

            <div
                className={`overlay${menuAbierto ? ' visible' : ''}`}
                onClick={cerrarMenu}
            />

            <aside className={`drawer${menuAbierto ? ' abierto' : ''}`}>
                <div className="drawer-head">
                    <h2>Menú</h2>
                    <button className="drawer-close" onClick={cerrarMenu} aria-label="Cerrar menú">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <nav className="drawer-nav">
                    {ENLACES.map(e => (
                        <Link key={e.to} to={e.to} onClick={cerrarMenu} className="drawer-link">
                            <i className={`fa-solid ${e.icono}`}></i>
                            <span>{e.texto}</span>
                        </Link>
                    ))}
                </nav>

                <div className="drawer-foot">
                    {usuario ? (
                        <>
                            <div className="drawer-user">
                                <i className="fa-solid fa-user"></i>
                                <span>{usuario.nombre}</span>
                            </div>
                            <button className="btn-outline full" onClick={logout}>Cerrar sesión</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-outline full" onClick={cerrarMenu}>
                                Iniciar sesión
                            </Link>
                            <Link to="/registro" className="btn-primary full" onClick={cerrarMenu}>
                                Crear cuenta
                            </Link>
                        </>
                    )}
                </div>
            </aside>
        </>
    );
}