
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const user = require('../models/user');

const generarJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid }

        jwt.sign( payload, process.env.SECRET_KEY, {
           expiresIn: '4h' 
        }, (err, token) => {
            if ( err ) {
                console.log(err);
                reject( 'I cannot generate the token' )
            }else{
                resolve( token )
            }
        })
    })
}

const checkJWT = async ( token = '' ) => {

    try {
        
        if(token.length < 10){
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById( uid );

        if( user ){
            if( user.state){
                return user;
            }else{
                return null;
            }
        }else{
            return null;
        }

        


    } catch (error) {
        return null
    }

}



module.exports = {
    generarJWT,
    checkJWT
}