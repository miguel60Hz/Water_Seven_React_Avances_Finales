import emailjs from '@emailjs/browser';

export const EMAILJS_CONFIG = {
    serviceId: 'service_1gni7ur',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
};

const CLAVE_CODIGO = 'ws_codigo_verificacion';

let iniciado = false;

export function emailJSConfigurado() {
    return Boolean(EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.publicKey);
}

export function errorConfigEmailJS() {
    if (!EMAILJS_CONFIG.serviceId) {
        return 'Falta el Service ID de EmailJS.';
    }
    if (!EMAILJS_CONFIG.templateId) {
        return 'Falta el Template ID. Agrega VITE_EMAILJS_TEMPLATE_ID en el archivo .env';
    }
    if (!EMAILJS_CONFIG.publicKey) {
        return 'Falta la Public Key. Agrega VITE_EMAILJS_PUBLIC_KEY en el archivo .env';
    }
    return null;
}

function asegurarIniciado() {
    if (iniciado) return;
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    iniciado = true;
}

export function generarCodigo() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

export function guardarCodigo(correo, codigo, tipo) {
    sessionStorage.setItem(CLAVE_CODIGO, JSON.stringify({
        correo,
        codigo,
        tipo,
        expira: Date.now() + 10 * 60 * 1000
    }));
}

export function leerCodigoGuardado() {
    try {
        const datos = sessionStorage.getItem(CLAVE_CODIGO);
        return datos ? JSON.parse(datos) : null;
    } catch {
        return null;
    }
}

export function borrarCodigoGuardado() {
    sessionStorage.removeItem(CLAVE_CODIGO);
}

export function verificarCodigo(codigoIngresado) {
    const datos = leerCodigoGuardado();
    if (!datos) return { error: 'No hay ninguna verificacion pendiente. Inicia el proceso de nuevo.' };
    if (Date.now() > datos.expira) {
        borrarCodigoGuardado();
        return { error: 'El codigo expiro. Solicita uno nuevo.' };
    }
    if (String(codigoIngresado).trim() !== datos.codigo) {
        return { error: 'El codigo no es correcto. Revisa tu correo.' };
    }
    return { ok: true, correo: datos.correo, tipo: datos.tipo };
}

export async function enviarCodigo({ correo, nombre, codigo, tipo }) {
    const errorConfig = errorConfigEmailJS();
    if (errorConfig) return { error: errorConfig };

    asegurarIniciado();

    try {
        await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
            nombre_usuario: nombre || correo.split('@')[0],
            correo_destino: correo,
            codigo_verificacion: codigo,
            tipo_mensaje: tipo === 'recuperacion'
                ? 'Recuperacion de contrasena'
                : 'Verificacion de correo',
            mensaje: tipo === 'recuperacion'
                ? 'Usa este codigo para crear una nueva contrasena.'
                : 'Usa este codigo para confirmar tu correo electronico.'
        });
        return { ok: true };
    } catch {
        return { error: 'No se pudo enviar el correo. Revisa que la plantilla de EmailJS tenga los campos correo_destino, nombre_usuario, codigo_verificacion, tipo_mensaje y mensaje.' };
    }
}