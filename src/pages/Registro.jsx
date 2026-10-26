import '../styles/pages/Registro.css';
import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { enviarCodigo, generarCodigo, guardarCodigo } from '../services/emailService';
import CampoPassword from '../components/CampoPassword';
import SocialButtons from '../components/SocialButtons';

const REGLAS = {
    largo: value => value.length >= 8,
    mayuscula: value => /[A-Z]/.test(value),
    minuscula: value => /[a-z]/.test(value),
    numero: value => /[0-9]/.test(value)
};

function revisarPassword(value) {
    const errores = [];
    if (!REGLAS.largo(value)) errores.push('mínimo 8 caracteres');
    if (!REGLAS.mayuscula(value)) errores.push('una mayúscula');
    if (!REGLAS.minuscula(value)) errores.push('una minúscula');
    if (!REGLAS.numero(value)) errores.push('un número');
    return errores;
}

export default function Registro() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [error, setError] = useState('');
    const [aviso, setAviso] = useState('');
    const [cargando, setCargando] = useState(false);
    const { usuario } = useAuth();
    const navigate = useNavigate();

    if (usuario) return <Navigate to="/" />;

    const fortaleza = password ? revisarPassword(password) : [];
    const solida = fortaleza.length === 0;

    const socialPendiente = (proveedor) => {
        setError('');
        setAviso(`El acceso con ${proveedor} requiere configurar OAuth en el panel del proyecto.`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setAviso('');

        if (nombre.trim().length < 3) {
            setError('Escribe tu nombre completo');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
            setError('El correo no tiene un formato válido');
            return;
        }
        if (!solida) {
            setError(`Tu contraseña necesita: ${fortaleza.join(', ')}`);
            return;
        }
        if (password !== confirmar) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setCargando(true);
        try {
            const res = await api.registro(nombre.trim(), correo.trim(), password);
            if (res.error) {
                setError(res.error);
                return;
            }

            const codigo = generarCodigo();
            guardarCodigo(correo.trim(), codigo, 'verificacion');

            const envio = await enviarCodigo({
                correo: correo.trim(),
                nombre: nombre.trim(),
                codigo,
                tipo: 'verificacion'
            });

            if (envio.error) {
                setError(envio.error);
                return;
            }

            navigate('/verificacion', { state: { correo: correo.trim(), tipo: 'verificacion' } });
        } catch {
            setError('Error de conexión con el servidor');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="auth-background">
            <div className="form-container">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-emblema">
                        <i className="fa-solid fa-user-plus"></i>
                    </div>

                    <h2>Crear cuenta</h2>
                    <p className="sub">Únete a la comunidad de Water Seven</p>

                    <div className="campo">
                        <label htmlFor="nombre">Nombre completo</label>
                        <div className="campo-input">
                            <i className="fa-regular fa-user"></i>
                            <input
                                id="nombre"
                                type="text"
                                placeholder="Tu nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                autoComplete="name"
                                required
                            />
                        </div>
                    </div>

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
                        label="Contraseña"
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />

                    {password && (
                        <ul className="reglas-password">
                            <li className={REGLAS.largo(password) ? 'ok' : ''}>
                                <i className={`fa-solid ${REGLAS.largo(password) ? 'fa-circle-check' : 'fa-circle'}`}></i>
                                Mínimo 8 caracteres
                            </li>
                            <li className={REGLAS.mayuscula(password) ? 'ok' : ''}>
                                <i className={`fa-solid ${REGLAS.mayuscula(password) ? 'fa-circle-check' : 'fa-circle'}`}></i>
                                Una letra mayúscula
                            </li>
                            <li className={REGLAS.minuscula(password) ? 'ok' : ''}>
                                <i className={`fa-solid ${REGLAS.minuscula(password) ? 'fa-circle-check' : 'fa-circle'}`}></i>
                                Una letra minúscula
                            </li>
                            <li className={REGLAS.numero(password) ? 'ok' : ''}>
                                <i className={`fa-solid ${REGLAS.numero(password) ? 'fa-circle-check' : 'fa-circle'}`}></i>
                                Un número
                            </li>
                        </ul>
                    )}

                    <CampoPassword
                        id="confirmar"
                        label="Validar contraseña"
                        placeholder="Repite tu contraseña"
                        value={confirmar}
                        onChange={(e) => setConfirmar(e.target.value)}
                        error={confirmar && password !== confirmar ? 'Las contraseñas no coinciden' : ''}
                        autoComplete="new-password"
                    />

                    {error && <div className="error-msg">{error}</div>}
                    {aviso && <div className="aviso-msg">{aviso}</div>}

                    <button type="submit" disabled={cargando}>
                        {cargando ? 'Creando cuenta...' : 'Registrarse'}
                    </button>

                    <p className="form-pie">
                        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                    </p>

                    <div className="divisor-social">
                        <span>O CONTINÚA CON</span>
                    </div>

                    <SocialButtons onSelect={socialPendiente} />

                    <div className="form-beneficios">
                        <h3>¿Por qué unirte a Water Seven?</h3>
                        <ul>
                            <li><i className="fa-solid fa-map-marked-alt"></i> Localiza fuentes de agua potable cerca de ti</li>
                            <li><i className="fa-solid fa-book-open"></i> Guías de purificación de agua</li>
                            <li><i className="fa-solid fa-comments"></i> Chat con comunidades para compartir alertas</li>
                        </ul>
                    </div>
                </form>
            </div>
        </div>
    );
}