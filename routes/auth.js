const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin, renewToken } = require('../controllers/auth');
const { validarCampos, validarJWT } = require('../middlewares');

const router = Router();


router.post('/login', [
    check('email','The email is required').isEmail(),
    check('password','The password is required').not().isEmpty(),
    validarCampos
],  login );

router.post('/google',[
    check('id_token', 'The id token is required').not().isEmpty(),
    validarCampos
], googleSignin );


router.get('/', validarJWT, renewToken);

module.exports = router;