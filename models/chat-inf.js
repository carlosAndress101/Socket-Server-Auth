

class Mensaje{
    constructor(uid, name, mensaje){
        this.uid = uid;
        this.name = name;
        this.mensaje = mensaje;
    }
} 


class ChatMensajes{

    constructor(){
        this.mensajes = [];
        this.usuarios = {};
    }


    get ultimos10(){
        this.mensajes = this.mensajes.splice(0, 10);
        return this.mensajes;
    }

    get usuariosArr(){
        return Object.values( this.usuarios ); // [{},{},{}]
    }

    enviarMensaje(uid, name, mensaje){
        this.mensajes.unshift(
            new Mensaje(uid, name, mensaje)
        );
    }

    conectarUsuario( usuario ){
        this.usuarios[usuario.id] = usuario
    }

    desconectarUsuario( id ){
        delete this.usuarios[id];
    }


}



module.exports = ChatMensajes;