
const miFormulario = document.querySelector('form')

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:4321/api/auth/'
    : 'https://hookcoffee.zeabur.app/api/auth/';




miFormulario.addEventListener('submit', event => {
    event.preventDefault();
    const formData = {};


    for(let elem of miFormulario.elements ){
        if(elem.name.length > 0){
            formData[elem.name] = elem.value;
        }
    }

    fetch(`${url}login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( formData )
    })
    .then( res => res.json() )
    .then( ({msg, token}) => {

        if(msg){
            return console.error(msg)
        }
        
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    
    } )
    .catch( console.log );
})

