import { mockDB } from '../data/mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {

    async login(correo, password) {
        await delay(300);
        const usuario = mockDB.usuarios.find(u => u.correo === correo);
        if (!usuario) return { error: "Correo no registrado" };
        if (usuario.password !== password) return { error: "Contraseña incorrecta" };
        const { password: _, ...usuarioSinPass } = usuario;
        return { usuario: usuarioSinPass };
    },

    async registro(nombre, correo, password) {
        await delay(300);
        const existe = mockDB.usuarios.find(u => u.correo === correo);
        if (existe) return { error: "El correo ya está registrado" };
        const id = mockDB.getNextUserId();
        const nuevoUsuario = { id, nombre, correo, password, fecha_registro: new Date().toISOString().split('T')[0] };
        mockDB.usuarios.push(nuevoUsuario);
        return { mensaje: "Cuenta creada exitosamente" };
    },

    async correoExiste(correo) {
        await delay(200);
        return Boolean(mockDB.usuarios.find(u => u.correo === correo));
    },

    async actualizarPassword(correo, password) {
        await delay(300);
        const usuario = mockDB.usuarios.find(u => u.correo === correo);
        if (!usuario) return { error: "El correo no está registrado" };
        usuario.password = password;
        return { mensaje: "Contraseña actualizada correctamente" };
    },

    async buscarUsuarioPorCorreo(correo) {
        await delay(200);
        const usuario = mockDB.usuarios.find(u => u.correo === correo);
        if (!usuario) return null;
        const { password: _, ...usuarioSinPass } = usuario;
        return usuarioSinPass;
    },

    async obtenerPublicaciones() {
        await delay(200);
        return [...mockDB.publicaciones].reverse();
    },

    async crearPublicacion(usuario_id, contenido, tipo) {
        await delay(200);
        const usuario = mockDB.usuarios.find(u => u.id === usuario_id);
        const id = mockDB.getNextPostId();
        const nueva = {
            id,
            usuario_id,
            usuario_nombre: usuario ? usuario.nombre : "Anónimo",
            contenido,
            tipo,
            fecha_publicacion: new Date().toLocaleString('es-ES'),
            comentarios: []
        };
        mockDB.publicaciones.push(nueva);
        return nueva;
    },

    async crearComentario(publicacion_id, usuario_id, contenido) {
        await delay(200);
        const publicacion = mockDB.publicaciones.find(p => p.id === publicacion_id);
        if (!publicacion) return { error: "Publicación no encontrada" };
        const usuario = mockDB.usuarios.find(u => u.id === usuario_id);
        const id = mockDB.getNextCommentId();
        const comentario = {
            id,
            usuario_nombre: usuario ? usuario.nombre : "Anónimo",
            contenido
        };
        publicacion.comentarios.push(comentario);
        return comentario;
    },

    async obtenerMensajes() {
        await delay(200);
        return [...mockDB.mensajes];
    },

    async enviarMensaje(remitente_id, contenido) {
        await delay(200);
        const usuario = mockDB.usuarios.find(u => u.id === remitente_id);
        const id = mockDB.getNextMessageId();
        const mensaje = {
            id,
            remitente_id,
            remitente_nombre: usuario ? usuario.nombre : "Anónimo",
            contenido,
            fecha: new Date().toLocaleString('es-ES')
        };
        mockDB.mensajes.push(mensaje);
        return mensaje;
    }
};
