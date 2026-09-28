import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';


export default function Registro() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { usuario } = useAuth();
    const navigate = useNavigate();

    if (usuario) return <Navigate to="/" />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.registro(nombre, correo, password);
            if (res.error) {
                setError(res.error);
            } else {
                alert(res.mensaje);
                navigate('/login');
            }
        } catch {
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <div className="auth-background">
            <form className="form-container" onSubmit={handleSubmit}>
                <h2>Crear cuenta</h2>
                <p className="sub">Únete a la comunidad Water Seven</p>

                <input
                    type="text"
                    placeholder="Nombre completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <div className="error-msg">{error}</div>}

                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
}
