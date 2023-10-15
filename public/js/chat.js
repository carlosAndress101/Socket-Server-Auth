

const url = (window.location.hostname.includes('localhost'))
                    ? 'http://localhost:4321/api/auth/'
                    : 'https://hookcoffee.zeabur.app/api/auth/';


let user = null;
let socket = null;


//referencias HTML
const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const btnLogout = document.querySelector("#btnLogout");

const validarJWT = async () => {

    const token = localStorage.getItem('token') || '';

    if(token.length <= 10){
        window.location = 'index.html';
        throw new Error("no token on the server");
    }

    const res = await fetch( url, {
        headers: { 'x-token': token },
    });

    const {user: userDB, token:tokenDB} = await res.json();
    localStorage.setItem('token',tokenDB);
    user = userDB;

    document.title = user.name;

    await conectarSocket();
}


const conectarSocket = async () => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });


    socket.on('connect', ()=> {
        console.log("Socket online")
    });

    socket.on('disconnect', ()=> {
        console.log("Socket offline")
    });

    socket.on('recibir-mensajes', dibujarMensajes)

    socket.on('usuarios-activos', dibujarUsuarios)

    socket.on('mensaje-privado', (payload)=> {
        console.log("Privado:", payload);
    })
}


const dibujarUsuarios = ( users = [] ) => {
    let usersHtml = '';
    users.forEach(user => {

        usersHtml += `
            <li>
                <p>
                    <h5 class="userName"> ${user.name}</h5>
                    <span>${user.uid}</span>
                </p>
            </li>
        `;
    });
    ulUsuarios.innerHTML = usersHtml;

}
const dibujarMensajes = ( mensajes = [] ) => {
    let mensajesHtml = '';
    mensajes.forEach(({ name, mensaje }) => {

        mensajesHtml += `
            <li>
                <p>
                    <span class="userMensaje"> ${name}</span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;
    });
    ulMensajes.innerHTML = mensajesHtml;

}
txtMensaje.addEventListener('keyup', ({keyCode}) => {
    
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if(keyCode !== 13){ return; }

    if(mensaje.length === 0){ return;}

    socket.emit('enviar-mensaje', {mensaje, uid});

    txtMensaje.value = '';
})


btnLogout.addEventListener('click', () => {

    localStorage.removeItem('token');
    window.location = 'index.html'
})


const main = async () => {
    await validarJWT();
}


main();
