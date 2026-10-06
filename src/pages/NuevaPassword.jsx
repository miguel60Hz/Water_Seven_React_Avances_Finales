import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import CampoPassword from '../components/CampoPassword';

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

export default function NuevaPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const correo = (location.state && location.state.correo) || '';

    const [password, setPassword] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [error, setError] = useState('');
    const [listo, setListo] = useState(false);
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!correo) {
            navigate('/login', { replace: true });
            return;
        }

        const faltantes = revisarPassword(password);
        if (faltantes.length > 0) {
            setError(`Tu contraseña necesita: ${faltantes.join(', ')}`);
            return;
        }
        if (password !== confirmar) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setCargando(true);
        try {
            const res = await api.actualizarPassword(correo, password);
            if (res.error) {
                setError(res.error);
                return;
            }
            setListo(true);
        } catch {
            setError('Error de conexión con el servidor');
        } finally {
            setCargando(false);
        }
    };

    if (listo) {
        return (
            <div className="auth-background">
                <div className="form-container">
                    <div className="form-emblema ok">
                        <i className="fa-solid fa-circle-check"></i>
                    </div>
                    <h2>Contraseña actualizada</h2>
                    <p className="sub">Ya puedes iniciar sesión con tu nueva contraseña</p>

                    <button type="button" onClick={() => navigate('/login')}>
                        Ir a iniciar sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-background">
            <div className="form-container">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-emblema">
                        <i className="fa-solid fa-lock-open"></i>
                    </div>

                    <h2>Nueva contraseña</h2>
                    <p className="sub">Elige una contraseña segura para <strong>{correo}</strong></p>

                    <CampoPassword
                        id="password"
                        label="Nueva contraseña"
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />

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

                    <button type="submit" disabled={cargando}>
                        {cargando ? 'Guardando...' : 'Guardar contraseña'}
                    </button>

                    <Link to="/login" className="enlace-centrado">
                        <i className="fa-solid fa-arrow-left"></i> Volver
                    </Link>
                </form>
            </div>
        </div>
    );
}