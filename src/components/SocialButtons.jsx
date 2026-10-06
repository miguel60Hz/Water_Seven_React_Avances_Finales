const PROVEEDORES = [
    { id: 'google', texto: 'Google', icono: 'fa-brands fa-google', clase: 'btn-google' },
    { id: 'facebook', texto: 'Facebook', icono: 'fa-brands fa-facebook-f', clase: 'btn-facebook' }
];

export default function SocialButtons({ onSelect, texto = 'o continúa con' }) {
    return (
        <div className="social">
            <div className="social-separador">
                <span />
                <em>{texto}</em>
                <span />
            </div>

            <div className="social-botones">
                {PROVEEDORES.map(p => (
                    <button
                        key={p.id}
                        type="button"
                        className={`btn-social ${p.clase}`}
                        onClick={() => onSelect(p.id)}
                    >
                        <i className={p.icono}></i>
                        <span>{p.texto}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}