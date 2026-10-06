import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { enviarCodigo, generarCodigo, guardarCodigo } from '../services/emailService';
import CampoPassword from '../components/CampoPassword';
import SocialButtons from '../components/SocialButtons';

export default function Login() {
    const [modo, setModo] = useState('login');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [aviso, setAviso] = useState('');
    const [cargando, setCargando] = useState(false);
    const { usuario, login } = useAuth();
    const navigate = useNavigate();

    if (usuario) return <Navigate to="/" />;

    const socialPendiente = (proveedor) => {
        setError('');
        setAviso(`El acceso con ${proveedor} requiere configurar OAuth en el panel del proyecto.`);
    };

    const validarCorreo = () => {
        if (!correo.trim()) return 'Escribe tu correo electrónico';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) return 'El correo no tiene un formato válido';
        return '';
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!correo.trim() || !password) {
            setError('Completa tu correo y tu contraseña');
            return;
        }

        setCargando(true);
        try {
            const res = await api.login(correo.trim(), password);
            if (res.error) {
                setError(res.error);
            } else {
                login(res.usuario);
                navigate('/');
            }
        } catch {
            setError('Error de conexión con el servidor');
        } finally {
            setCargando(false);
        }
    };

    const handleRecuperacion = async (e) => {
        e.preventDefault();
        setError('');
        setAviso('');

        const errorCorreo = validarCorreo();
        if (errorCorreo) {
            setError(errorCorreo);
            return;
        }

        setCargando(true);
        try {
            const existe = await api.correoExiste(correo.trim());
            if (!existe) {
                setError('Ese correo no está registrado en Water Seven');
                return;
            }

            const usuarioEncontrado = await api.buscarUsuarioPorCorreo(correo.trim());
            const codigo = generarCodigo();
            guardarCodigo(correo.trim(), codigo, 'recuperacion');

            const res = await enviarCodigo({
                correo: correo.trim(),
                nombre: usuarioEncontrado ? usuarioEncontrado.nombre : '',
                codigo,
                tipo: 'recuperacion'
            });

            if (res.error) {
                setError(res.error);
                return;
            }

            navigate('/verificacion', { state: { correo: correo.trim(), tipo: 'recuperacion' } });
        } catch {
            setError('Error de conexión con el servidor');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="auth-background">
            <div className="form-container">
                {modo === 'login' ? (
                    <form onSubmit={handleLogin} noValidate>
                        <div className="form-emblema">
                            <i className="fa-solid fa-droplet"></i>
                        </div>

                        <h2>Iniciar sesión</h2>
                        <p className="sub">Accede a tu cuenta de Water Seven</p>

                        <div className="campo">
                            <label htmlFor="correo">Correo electrónico</label>
                            <div className="campo-input">
                                <i className="fa-regular fa-envelope"></i>
                                <input
                                    id="correo"
                                    type="email"
                                    placeholder="tucorreo@gmail.com"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <CampoPassword
                            id="password"
                            placeholder="Tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />

                        <div className="form-enlaces">
                            <button
                                type="button"
                                className="enlace-plano"
                                onClick={() => { setModo('recuperacion'); setError(''); }}
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        {error && <div className="error-msg">{error}</div>}
                        {aviso && <div className="aviso-msg">{aviso}</div>}

                        <button type="submit" disabled={cargando}>
                            {cargando ? 'Entrando...' : 'Entrar'}
                        </button>

                        <p className="form-pie">
                            ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
                        </p>

                        <SocialButtons onSelect={socialPendiente} />
                    </form>
                ) : (
                    <form onSubmit={handleRecuperacion} noValidate>
                        <div className="form-emblema">
                            <i className="fa-solid fa-key"></i>
                        </div>

                        <h2>Recuperar contraseña</h2>
                        <p className="sub">
                            Escribe tu correo y te enviamos un código de verificación a tu Gmail
                        </p>

                        <div className="campo">
                            <label htmlFor="correo-recuperacion">Correo electrónico</label>
                            <div className="campo-input">
                                <i className="fa-regular fa-envelope"></i>
                                <input
                                    id="correo-recuperacion"
                                    type="email"
                                    placeholder="tucorreo@gmail.com"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        {error && <div className="error-msg">{error}</div>}

                        <button type="submit" disabled={cargando}>
                            {cargando ? 'Enviando código...' : 'Enviar código'}
                        </button>

                        <button
                            type="button"
                            className="enlace-centrado"
                            onClick={() => { setModo('login'); setError(''); }}
                        >
                            <i className="fa-solid fa-arrow-left"></i> Volver a iniciar sesión
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}