// Overpass tiene varios espejos. Si uno falla se prueba el siguiente,
// porque los servidores publicos se saturan con frecuencia.
const SERVIDORES = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
];

// Overpass y Nominatim exigen un User-Agent identificable.
// Si no lo envian, responden 403 o 429 y bloquean la peticion.
const USER_AGENT = 'WaterSeven/1.0 (https://github.com/water-seven; proyecto educativo de acceso al agua potable)';

async function consultarOverpass(consulta) {
    for (const url of SERVIDORES) {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': USER_AGENT,
                },
                body: 'data=' + encodeURIComponent(consulta),
                signal: AbortSignal.timeout(25000),
            });

            if (!res.ok) continue;

            const datos = await res.json();
            if (Array.isArray(datos.elements)) return datos.elements;
        } catch {
            // este servidor fallo, se intenta el siguiente
        }
    }
    throw new Error('No se pudo consultar el servicio de fuentes');
}

/**
 * Busca fuentes de agua reales cerca de una ubicacion.
 * Usa Overpass API (datos abiertos de OpenStreetMap), no requiere clave.
 */
export async function buscarFuentes({ lat, lng, radio = 2000 }) {
    const consulta = `
        [out:json][timeout:20];
        node["amenity"~"^(drinking_water|water_point|watering_place)$"](around:${radio},${lat},${lng});
        out;
    `;

    const elementos = await consultarOverpass(consulta);

    return elementos
        .map(el => {
            if (typeof el.lat !== 'number' || typeof el.lon !== 'number') return null;
            const tags = el.tags || {};
            return {
                id: el.type + '-' + el.id,
                lat: el.lat,
                lng: el.lon,
                tipo: tags.amenity || 'fuente',
                nombre: tags.name || tags['name:es'] || null,
                operador: tags.operator || null,
                acceso: tags.access || 'publico',
                fee: tags.fee || 'no',
            };
        })
        .filter(Boolean);
}

/** Geocodifica una direccion o ciudad a coordenadas */
export async function geocodificar(texto) {
    const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(texto);
    const res = await fetch(url, {
        headers: {
            'Accept-Language': 'es',
            'User-Agent': USER_AGENT,
        },
        signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) throw new Error('No se pudo localizar la direccion');

    const datos = await res.json();
    if (!datos.length) throw new Error('Direccion no encontrada');

    return {
        lat: parseFloat(datos[0].lat),
        lng: parseFloat(datos[0].lon),
        nombre: datos[0].display_name,
    };
}

export const UBICACION_DEFAULT = {
    lat: 4.5709,
    lng: -74.2973,
    nombre: 'Bogota, Colombia',
};