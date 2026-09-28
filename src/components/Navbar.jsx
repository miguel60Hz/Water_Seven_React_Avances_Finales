import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { usuario, logout } = useAuth();

    return (
        <header className="navbar">
            <div className="logo">
                <img src="/imagenes/logo.png" alt="Water Seven" />
                <div><h1>Water Seven</h1></div>
            </div>

            <nav>
                <span className="badge"><Link to="/">Inicio</Link></span>
                <span className="badge"><Link to="/comunidad">Comunidad</Link></span>
                <span className="badge"><Link to="/chat">Chat</Link></span>
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
        </header>
    );
}
