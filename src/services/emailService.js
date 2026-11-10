import emailjs from '@emailjs/browser';

/* Credenciales de la cuenta de EmailJS.
   Se leen del .env de Vite (VITE_EMAILJS_TEMPLATE_ID / VITE_EMAILJS_PUBLIC_KEY)
   y quedan aquí como respaldo: si el .env falta, no se vuelve a cargar o trae un
   valor mal pegado, se usa la credencial correcta y el envío no se rompe. */
const CREDENCIALES = {
    serviceId: 'service_1gni7ur',
    templateId: 'template_7zt83t2',
    publicKey: 'iprlsAmd7EMfq8ESB'
};

function valorConfigurado(valor, respaldo, patron) {
    const limpio = typeof valor === 'string' ? valor.trim() : '';
    return patron.test(limpio) ? limpio : respaldo;
}

export const EMAILJS_CONFIG = {
    serviceId: CREDENCIALES.serviceId,
    templateId: valorConfigurado(
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        CREDENCIALES.templateId,
        /^template_[A-Za-z0-9_-]+$/
    ),
    publicKey: valorConfigurado(
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        CREDENCIALES.publicKey,
        /^[A-Za-z0-9_-]{10,}$/
    )
};

const CLAVE_CODIGO = 'ws_codigo_verificacion';

/* Formato básico de correo: algo@algo.algo, sin espacios */
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function correoValido(correo) {
    return PATRON_CORREO.test(String(correo ?? '').trim());
}

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
        expira: Date.now() + 10 * 60 * 1000 // Expira en 10 minutos
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
    if (!datos) return { error: 'No hay ninguna verificación pendiente. Inicia el proceso de nuevo.' };
    if (Date.now() > datos.expira) {
        borrarCodigoGuardado();
        return { error: 'El código expiró. Solicita uno nuevo.' };
    }
    if (String(codigoIngresado).trim() !== datos.codigo) {
        return { error: 'El código no es correcto. Revisa tu correo.' };
    }
    return { ok: true, correo: datos.correo, tipo: datos.tipo };
}

// Función principal para enviar el correo
export async function enviarCodigo({ correo, nombre, codigo, tipo }) {
    const correoLimpio = String(correo ?? '').trim();
    const nombreLimpio = String(nombre ?? '').trim();

    // Validación previa: no se llama a EmailJS si el correo no tiene formato válido
    if (!correoValido(correoLimpio)) {
        const detalle = `Correo inválido antes de enviar con EmailJS: "${correoLimpio}"`;
        console.error('[EmailJS]', detalle);
        return { error: 'El correo no tiene un formato válido' };
    }

    const errorConfig = errorConfigEmailJS();
    if (errorConfig) {
        console.error('[EmailJS]', errorConfig);
        return { error: errorConfig };
    }

    asegurarIniciado();

    const templateParams = {
        correo_destino: correoLimpio,
        nombre_usuario: nombreLimpio || correoLimpio.split('@')[0],
        codigo_verificacion: codigo,
        tipo_mensaje: tipo === 'recuperacion'
            ? 'Recuperación de contraseña'
            : 'Verificación de correo',
        mensaje: tipo === 'recuperacion'
            ? 'Usa este código para crear una nueva contraseña.'
            : 'Usa este código para confirmar tu correo electrónico.'
    };

    const MAX_INTENTOS = 3;
    let ultimoError = null;

    for (let intento = 1; intento <= MAX_INTENTOS; intento += 1) {
        try {
            await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                templateParams,
                { publicKey: EMAILJS_CONFIG.publicKey }
            );
            if (intento > 1) {
                console.log(`[EmailJS] Correo enviado en el intento ${intento}/${MAX_INTENTOS}`);
            }
            return { ok: true };
        } catch (error) {
            ultimoError = error;
            const status = error?.status ?? null;

            // Detalle exacto del error devuelto por EmailJS para depurar
            console.error(`[EmailJS] Error al enviar el correo (intento ${intento}/${MAX_INTENTOS}):`, {
                status,
                text: error?.text ?? null,
                message: error?.message ?? String(error),
                serviceId: EMAILJS_CONFIG.serviceId,
                templateId: EMAILJS_CONFIG.templateId,
                templateParams
            });

            const esErrorDeRed = !status || status === 0 || status === 408 || status === 429 || status >= 500;
            if (!esErrorDeRed || intento === MAX_INTENTOS) break;

            // Sin conexión o servicio caído: se reintenta con espera creciente
            await new Promise(resolver => setTimeout(resolver, intento * 1200));
        }
    }

    const statusFinal = ultimoError?.status ?? null;
    const textoFinal = String(ultimoError?.text ?? ultimoError?.message ?? '');

    // Sin status (o 0) significa que ni siquiera llegó la respuesta: problema de red
    if (!statusFinal || statusFinal === 0) {
        return {
            error: 'No pudimos conectar con EmailJS en este momento. Intenta de nuevo en unos minutos.'
        };
    }

    if (/non-browser|access from non-browser/i.test(textoFinal)) {
        console.error('[EmailJS] Bloqueo de EmailJS: activa "Allow access from browsers" en Account → Security.');
    }

    return {
        error: 'No pudimos enviar el correo en este momento. Intenta de nuevo en unos minutos.'
    };
}