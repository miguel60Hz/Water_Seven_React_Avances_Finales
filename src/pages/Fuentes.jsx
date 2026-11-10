import '../styles/pages/Fuentes.css';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { buscarFuentes, geocodificar, UBICACION_DEFAULT } from '../services/fuentesService';

const ICONO = L.divIcon({
    className: 'fuente-marker',
    html: '<span><i class="fa-solid fa-droplet"></i></span>',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
});

const ICONO_USER = L.divIcon({
    className: 'user-marker',
    html: '<span><i class="fa-solid fa-location-dot"></i></span>',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
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
    water_tap: 'Grifo de agua',
    water_well: 'Pozo de agua',
    spring: 'Manantial',
    fountain: 'Fuente ornamental',
};

export default function Fuentes() {
    const [pos, setPos] = useState(UBICACION_DEFAULT);
    const [busqueda, setBusqueda] = useState('');
    const [fuentes, setFuentes] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
<<<<<<< HEAD
    const [radio, setRadio] = useState(3000);
=======
    const [radio, setRadio] = useState(3000); // 3km por defecto
>>>>>>> a4ac441eb6a0159af851a0ddbf2fdada00ff8a4b
    const [ubicacionInicial, setUbicacionInicial] = useState(false);

    const cargar = async (centro = pos, r = radio) => {
        setCargando(true);
        setError('');
        try {
            const resultado = await buscarFuentes({ lat: centro.lat, lng: centro.lng, radio: r });
            setFuentes(resultado);
            if (!resultado.length) setError(`No se encontraron fuentes en ${Math.round(r/1000)}km a la redonda.`);
<<<<<<< HEAD
        } catch (e) {
            setError('No se pudo consultar el servicio. Revisa tu conexión.');
            console.error('Error al cargar fuentes:', e);
=======
        } catch {
            setError('No se pudo consultar el servicio. Revisa tu conexión.');
>>>>>>> a4ac441eb6a0159af851a0ddbf2fdada00ff8a4b
        } finally {
            setCargando(false);
        }
    };

<<<<<<< HEAD
    // Auto-ubicación al cargar la página
    useEffect(() => {
        if (!ubicacionInicial) {
            if (navigator.geolocation) {
                setCargando(true);
                const timeoutId = setTimeout(() => {
                    setUbicacionInicial(true);
                    setError('La geolocalización tardó demasiado. Puedes buscar manualmente o hacer clic en "Mi ubicación".');
                    setCargando(false);
                }, 12000);
                navigator.geolocation.getCurrentPosition(
                    async (posActual) => {
                        clearTimeout(timeoutId);
                        const centro = { 
                            lat: posActual.coords.latitude, 
                            lng: posActual.coords.longitude, 
                            nombre: 'Tu ubicación' 
                        };
                        setPos(centro);
                        setUbicacionInicial(true);
                        await cargar(centro, 3000);
                    },
                    () => {
                        clearTimeout(timeoutId);
                        setUbicacionInicial(true);
                        setError('No se pudo obtener tu ubicación. Puedes buscar manualmente o hacer clic en "Mi ubicación".');
                        setCargando(false);
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            } else {
                setUbicacionInicial(true);
                setError('Tu navegador no soporta geolocalización. Puedes buscar manualmente.');
            }
=======
    // Auto-ubicación al cargar la página - SE EJECUTA AUTOMÁTICAMENTE
    useEffect(() => {
        if (!ubicacionInicial && navigator.geolocation) {
            setCargando(true);
            navigator.geolocation.getCurrentPosition(
                async (posActual) => {
                    const centro = { 
                        lat: posActual.coords.latitude, 
                        lng: posActual.coords.longitude, 
                        nombre: 'Tu ubicación' 
                    };
                    setPos(centro);
                    setUbicacionInicial(true);
                    await cargar(centro, 3000); // Buscar en 3km automáticamente
                },
                (err) => {
                    setUbicacionInicial(true);
                    setError('No se pudo obtener tu ubicación automáticamente. Puedes buscar manualmente o hacer clic en "Mi ubicación".');
                    setCargando(false);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
>>>>>>> a4ac441eb6a0159af851a0ddbf2fdada00ff8a4b
        }
    }, [ubicacionInicial]);

    const usarMiUbicacion = () => {
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

    const cambiarRadio = (e) => {
        const nuevo = Number(e.target.value);
        setRadio(nuevo);
        cargar(pos, nuevo);
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

                    <button className="btn-primary" onClick={() => cargar(pos, 3000)} disabled={cargando}>
                        <i className="fa-solid fa-droplet"></i>
                        Buscar en 3km
                    </button>

                    <label className="radio-control">
                        Radio: {radio >= 1000 ? `${(radio / 1000).toFixed(1)} km` : `${radio} m`}
                        <input type="range" min="500" max="8000" step="500" value={radio} onChange={cambiarRadio} />
                    </label>
                </div>
            </div>

            {error && <div className="info-msg">{error}</div>}

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
                        <Popup>Tu ubicación</Popup>
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
                    Fuentes encontradas en {Math.round(radio/1000)}km
                    {!cargando && fuentes.length > 0 && <span className="contador">{fuentes.length}</span>}
                </h2>

                {cargando ? (
                    <div className="cargando"><i className="fa-solid fa-spinner fa-spin"></i> Consultando OpenStreetMap...</div>
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