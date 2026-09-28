import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import '../components/Navbar.jsx';

export default function Login() {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { usuario, login } = useAuth();
    const navigate = useNavigate();

    if (usuario) return <Navigate to="/" />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.login(correo, password);
            if (res.error) {
                setError(res.error);
            } else {
                login(res.usuario);
                navigate('/');
            }
        } catch {
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <div className="auth-background">
            <form className="form-container" onSubmit={handleSubmit}>
                <h2>Iniciar sesión</h2>
                <p className="sub">Accede a tu cuenta de Water Seven</p>

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

                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}
