let nextUserId = 4;
let nextPostId = 4;
let nextCommentId = 4;
let nextMessageId = 4;

const usuarios = [
    { id: 1, nombre: "Maria Lopez", correo: "maria@email.com", password: "123456", fecha_registro: "2024-01-15" },
    { id: 2, nombre: "Carlos Garcia", correo: "carlos@email.com", password: "123456", fecha_registro: "2024-02-10" },
    { id: 3, nombre: "Ana Martinez", correo: "ana@email.com", password: "123456", fecha_registro: "2024-03-05" },
];

const publicaciones = [
    {
        id: 1,
        usuario_id: 1,
        usuario_nombre: "Maria Lopez",
        contenido: "Encontré una nueva fuente de agua potable en la zona norte de la ciudad. El agua es cristalina y parece segura para consumo.",
        tipo: "reporte",
        fecha_publicacion: "2024-06-15 10:30",
        comentarios: [
            { id: 1, usuario_nombre: "Carlos Garcia", contenido: "Excelente noticia, gracias por compartirlo Maria!" }
        ]
    },
    {
        id: 2,
        usuario_id: 2,
        usuario_nombre: "Carlos Garcia",
        contenido: "ALERTA: Se detectó contaminación en el río principal. Eviten consumir agua de esa fuente hasta nuevo aviso.",
        tipo: "alerta",
        fecha_publicacion: "2024-06-14 15:45",
        comentarios: [
            { id: 2, usuario_nombre: "Ana Martinez", contenido: "Gracias por la alerta Carlos, lo difundiré." }
        ]
    },
    {
        id: 3,
        usuario_id: 3,
        usuario_nombre: "Ana Martinez",
        contenido: "Consejo: Para purificar agua en emergencia, hiérvanla durante al menos 1 minuto. A altitudes superiores a 2000m, hiérvanla 3 minutos.",
        tipo: "consejo",
        fecha_publicacion: "2024-06-13 09:00",
        comentarios: []
    }
];

const mensajes = [
    { id: 1, remitente_id: 1, remitente_nombre: "Maria Lopez", contenido: "Hola a todos, ¿cómo están?", fecha: "2024-06-15 08:00" },
    { id: 2, remitente_id: 2, remitente_nombre: "Carlos Garcia", contenido: "Bien, preparando el informe del agua.", fecha: "2024-06-15 08:05" },
    { id: 3, remitente_id: 3, remitente_nombre: "Ana Martinez", contenido: "Yo también bien, revisando las muestras de ayer.", fecha: "2024-06-15 08:10" },
];

export const mockDB = {
    usuarios,
    publicaciones,
    mensajes,
    getNextUserId: () => nextUserId++,
    getNextPostId: () => nextPostId++,
    getNextCommentId: () => nextCommentId++,
    getNextMessageId: () => nextMessageId++,
};
