const { Socket } = require('socket.io');
const { checkJWT } = require('../helpers');
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();

const socketController = async (socket = new Socket(), io) => {

    const user = await checkJWT(socket.handshake.headers['x-token']);
    if( !user ){ return socket.disconnect() }


    //Agregar el usuario conectado.
    chatMensajes.conectarUsuario(user)
    io.emit('usuarios-activos', chatMensajes.usuariosArr );

    //limpiar cuando alguien se desconecta.
    socket.on('disconnect', ()=> {
        chatMensajes.desconectarUsuario(user.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr );
    })

    //conectarlo a una sala especial
    socket.join( user.id );

    socket.on('enviar-mensaje', ({mensaje, uid}) => {

        if( uid ){
            //mensaje privado.
            socket.to( uid ).emit('mensaje-privado', { de: user.name, mensaje})
        } else{
            chatMensajes.enviarMensaje(user.id, user.name, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10)
        }
    })
}


module.exports = {
    socketController
}