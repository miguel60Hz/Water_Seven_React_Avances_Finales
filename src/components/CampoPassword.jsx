import { useState } from 'react';

export default function CampoPassword({
    id,
    label,
    placeholder,
    value,
    onChange,
    error,
    autoComplete,
    required = true
}) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="campo">
            {label && <label htmlFor={id}>{label}</label>}

            <div className={`campo-password${error ? ' con-error' : ''}`}>
                <input
                    id={id}
                    type={visible ? 'text' : 'password'}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    required={required}
                />
                <button
                    type="button"
                    className="ver-password"
                    onClick={() => setVisible(v => !v)}
                    aria-label={visible ? 'Ocultar contraseña' : 'Ver contraseña'}
                    title={visible ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                    <i className={`fa-solid ${visible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
            </div>

            {error && <span className="campo-error">{error}</span>}
        </div>
    );
}