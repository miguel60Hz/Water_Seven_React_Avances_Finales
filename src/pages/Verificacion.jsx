import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
    verificarCodigo,
    borrarCodigoGuardado,
    leerCodigoGuardado,
    enviarCodigo,
    generarCodigo,
    guardarCodigo
} from '../services/emailService';

export default function Verificacion() {
    const location = useLocation();
    const navigate = useNavigate();

    const datosGuardados = leerCodigoGuardado();
    const correo = (location.state && location.state.correo) || (datosGuardados && datosGuardados.correo) || '';
    const tipo = (location.state && location.state.tipo) || (datosGuardados && datosGuardados.tipo) || 'verificacion';

    const [digitos, setDigitos] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [reenviando, setReenviando] = useState(false);
    const [aviso, setAviso] = useState('');

    useEffect(() => {
        if (!datosGuardados) {
            navigate('/login', { replace: true });
        }
    }, [datosGuardados, navigate]);

    if (!datosGuardados) return null;

    const esRecuperacion = tipo === 'recuperacion';

    const ponerDigito = (index, valor) => {
        const limpio = valor.replace(/\D/g, '');
        setError('');

        if (limpio.length > 1) {
            const nuevos = limpio.slice(0, 6 - index).split('');
            setDigitos(prev => {
                const copia = [...prev];
                nuevos.forEach((d, i) => { copia[index + i] = d; });
                return copia;
            });
            return;
        }

        setDigitos(prev => {
            const copia = [...prev];
            copia[index] = limpio;
            return copia;
        });
    };

    const handleChange = (index) => (e) => {
        ponerDigito(index, e.target.value);
        if (e.target.value && index < 5) {
            document.getElementById(`digito-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (index) => (e) => {
        if (e.key === 'Backspace' && !digitos[index] && index > 0) {
            document.getElementById(`digito-${index - 1}`)?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const texto = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!texto) return;
        setDigitos(texto.split('').concat(['', '', '', '', '', '']).slice(0, 6));
        document.getElementById(`digito-${Math.min(texto.length, 5)}`)?.focus();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const codigo = digitos.join('');
        if (codigo.length !== 6) {
            setError('Ingresa los 6 dígitos del código');
            return;
        }

        const resultado = verificarCodigo(codigo);
        if (resultado.error) {
            setError(resultado.error);
            setDigitos(['', '', '', '', '', '']);
            return;
        }

borrarCodigoGuardado();

    if (esRecuperacion) {
            navigate('/nueva-password', { state: { correo: resultado.correo } });
        } else {
            navigate('/login', { replace: true });
        }
    };

    const handleReenviar = async () => {
        setAviso('');
        setError('');
        setReenviando(true);
        try {
            const codigo = generarCodigo();
            guardarCodigo(correo, codigo, tipo);
            const res = await enviarCodigo({ correo, nombre: '', codigo, tipo });
            setAviso(res.error || 'Te enviamos un código nuevo. Revisa tu correo.');
        } catch {
            setError('No se pudo reenviar el código');
        } finally {
            setReenviando(false);
        }
    };

    return (
        <div className="auth-background">
            <div className="form-container">
                <div className="form-emblema">
                    <i className="fa-regular fa-envelope-open-text"></i>
                </div>

                <h2>{esRecuperacion ? 'Verifica tu correo' : 'Verifica tu correo'}</h2>
                <p className="sub">
                    Enviamos un código de 6 dígitos a <strong>{correo}</strong>
                </p>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="codigo-caja" onPaste={handlePaste}>
                        {digitos.map((d, i) => (
                            <input
                                key={i}
                                id={`digito-${i}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={d}
                                onChange={handleChange(i)}
                                onKeyDown={handleKeyDown(i)}
                                aria-label={`Dígito ${i + 1}`}
                            />
                        ))}
                    </div>

                    {error && <div className="error-msg">{error}</div>}
                    {aviso && <div className="aviso-msg">{aviso}</div>}

                    <button type="submit">
                        {esRecuperacion ? 'Verificar y continuar' : 'Verificar correo'}
                    </button>

                    <button
                        type="button"
                        className="enlace-centrado"
                        onClick={handleReenviar}
                        disabled={reenviando}
                    >
                        {reenviando ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
                    </button>
                </form>

                <Link to="/login" className="enlace-centrado">
                    <i className="fa-solid fa-arrow-left"></i> Volver
                </Link>
            </div>
        </div>
    );
}