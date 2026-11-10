import '../styles/pages/Fuentes.css';
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { buscarFuentes, geocodificar, UBICACION_DEFAULT } from '../services/fuentesService';

const ICONO = L.divIcon({
    className: 'fuente-marker',
    html: '<span><i class="fa-solid fa-droplet"></i></span>',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
});

const ICONO_USER = L.divIcon({
    className: 'user-marker',
    html: '<span><i class="fa-solid fa-location-dot"></i></span>',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
});

function Centrar({ pos }) {
    const map = useMap();
    useEffect(() => {
        if (pos) map.flyTo([pos.lat, pos.lng], 14, { duration: 1.2 });
    }, [pos, map]);
    return null;
}

const etiquetas = {
    drinking_water: 'Fuente de agua potable',
    water_point: 'Punto de agua',
    watering_place: 'Bebedero',
    water_tower: 'Tanque de agua',
};

const formatoRadio = (r) => (r >= 1000 ? `${(r / 1000).toFixed(1)} km` : `${r} m`);

export default function Fuentes() {
    const [pos, setPos] = useState(UBICACION_DEFAULT);
    const [busqueda, setBusqueda] = useState('');
    const [fuentes, setFuentes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [nota, setNota] = useState('');
    const [radio, setRadio] = useState(3000); // 3km por defecto

    const cargar = async (centro = pos, r = radio) => {
        setCargando(true);
        setError('');
        try {
            const resultado = await buscarFuentes({ lat: centro.lat, lng: centro.lng, radio: r });
            setFuentes(resultado);
            if (!resultado.length) setError(`No se encontraron fuentes en ${formatoRadio(r)} a la redonda.`);
        } catch {
            setError('El servicio de fuentes de agua no está disponible en este momento. Intenta de nuevo en unos segundos.');
        } finally {
            setCargando(false);
        }
    };

    // Auto-ubicacion al cargar la pagina - SE EJECUTA AUTOMATICAMENTE
    // El ref evita que StrictMode dispare dos peticiones de geolocalizacion.
    const inicioRef = useRef(false);

    useEffect(() => {
        if (inicioRef.current) return undefined;
        inicioRef.current = true;

        const buscarPorDefecto = (mensaje) => {
            if (mensaje) setNota(mensaje);
            // Sin ubicacion igual se consulta: la pagina nunca queda vacia.
            cargar(UBICACION_DEFAULT, 3000);
        };

        if (!navigator.geolocation) {
            buscarPorDefecto('Tu navegador no permite la geolocalización. Mostramos fuentes cerca de Bogotá.');
            return undefined;
        }

        navigator.geolocation.getCurrentPosition(
            async (posActual) => {
                const centro = {
                    lat: posActual.coords.latitude,
                    lng: posActual.coords.longitude,
                    nombre: 'Tu ubicación'
                };
                setPos(centro);
                await cargar(centro, 3000); // Buscar en 3km automaticamente
            },
            () => {
                buscarPorDefecto('No se pudo obtener tu ubicación. Mostramos fuentes cerca de Bogotá.');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
        return undefined;
    }, []);

    const usarMiUbicacion = () => {
        setNota('');
        if (!navigator.geolocation) {
            setError('Tu navegador no soporta geolocalización');
            return;
        }
        setCargando(true);
        navigator.geolocation.getCurrentPosition(
            async (posActual) => {
                const centro = { 
                    lat: posActual.coords.latitude, 
                    lng: posActual.coords.longitude, 
                    nombre: 'Tu ubicación' 
                };
                setPos(centro);
                await cargar(centro, radio);
            },
            () => {
                setError('No se pudo obtener tu ubicación. Activa el GPS.');
                setCargando(false);
            }
        );
    };

    const buscarDireccion = async (e) => {
        e.preventDefault();
        if (!busqueda.trim()) return;
        setNota('');
        setCargando(true);
        setError('');
        try {
            const centro = await geocodificar(busqueda.trim());
            setPos(centro);
            await cargar(centro, radio);
        } catch (err) {
            setError(err.message);
            setCargando(false);
        }
    };

    // El deslizador dispara un evento por cada paso: sin espera, arrastrarlo
    // lanzaria una consulta a OpenStreetMap tras otra.
    const radioTimer = useRef(null);

    useEffect(() => () => {
        if (radioTimer.current) clearTimeout(radioTimer.current);
    }, []);

    const cambiarRadio = (e) => {
        const nuevo = Number(e.target.value);
        const centroActual = pos;
        setRadio(nuevo);

        if (radioTimer.current) clearTimeout(radioTimer.current);
        radioTimer.current = setTimeout(() => {
            radioTimer.current = null;
            cargar(centroActual, nuevo);
        }, 700);
    };

    return (
        <section className="page fuentes-page">
            <header className="fuentes-head">
                <h1>Encontrar agua cerca de ti</h1>
                <p>Fuentes de agua potable registradas en OpenStreetMap, actualizadas por la comunidad</p>
            </header>

            <div className="fuentes-buscador">
                <form onSubmit={buscarDireccion} className="buscador-form">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        placeholder="Busca una dirección, barrio o ciudad"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <button type="submit" className="btn-primary">Buscar</button>
                </form>

                <div className="buscador-acciones">
                    <button className="btn-outline" onClick={usarMiUbicacion} disabled={cargando}>
                        <i className="fa-solid fa-location-crosshairs"></i>
                        Mi ubicación
                    </button>

                    <button className="btn-primary" onClick={() => cargar(pos, radio)} disabled={cargando}>
                        <i className="fa-solid fa-droplet"></i>
                        Buscar en {formatoRadio(radio)}
                    </button>

                    <label className="radio-control">
                        Radio: {formatoRadio(radio)}
                        <input type="range" min="500" max="8000" step="500" value={radio} onChange={cambiarRadio} />
                    </label>
                </div>
            </div>

            {nota && <div className="info-msg">{nota}</div>}

            <div className="mapa-wrap">
                <MapContainer center={[pos.lat, pos.lng]} zoom={13} className="mapa" scrollWheelZoom>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Centrar pos={pos} />

                    <Circle
                        center={[pos.lat, pos.lng]}
                        radius={radio}
                        pathOptions={{ color: '#5ec4c5', fillColor: '#5ec4c5', fillOpacity: 0.08, weight: 2 }}
                    />

                    <Marker position={[pos.lat, pos.lng]} icon={ICONO_USER}>
                        <Popup>{pos.nombre || 'Tu ubicación'}</Popup>
                    </Marker>

                    {fuentes.map(f => (
                        <Marker key={f.id} position={[f.lat, f.lng]} icon={ICONO}>
                            <Popup>
                                <strong>{etiquetas[f.tipo] || 'Fuente de agua'}</strong>
                                {f.nombre && <><br />{f.nombre}</>}
                                {f.operador && <><br />Operado por: {f.operador}</>}
                                <br /><small>Acceso: {f.acceso} · Costo: {f.fee}</small>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            <div className="fuentes-panel">
                <h2>
                    Fuentes encontradas en {formatoRadio(radio)}
                    {!cargando && fuentes.length > 0 && <span className="contador">{fuentes.length}</span>}
                </h2>

                {cargando ? (
                    <div className="cargando"><i className="fa-solid fa-spinner fa-spin"></i> Consultando OpenStreetMap...</div>
                ) : error ? (
                    <div className="empty-state">
                        <i className="fa-solid fa-map-location-dot"></i>
                        <p>{error}</p>
                    </div>
                ) : fuentes.length === 0 ? (
                    <div className="empty-state">
                        <i className="fa-solid fa-map-location-dot"></i>
                        <p>No se encontraron fuentes en este radio. Intenta ampliar la búsqueda.</p>
                    </div>
                ) : (
                    <ul className="fuentes-lista">
                        {fuentes.map(f => (
                            <li key={f.id} className="fuente-item">
                                <i className="fa-solid fa-droplet"></i>
                                <div>
                                    <strong>{etiquetas[f.tipo] || 'Fuente de agua'}</strong>
                                    {f.nombre && <p>{f.nombre}</p>}
                                    <span className="fuente-meta">
                                        Acceso: {f.acceso} · Costo: {f.fee}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}