const jwt = require('jsonwebtoken');

const generarJWT = ( uuid = '') => {
    console.log(uuid)
    return new Promise((resolve, reject) => {
        const payload = { uuid };
        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if(err) {
                console.log(err);
                reject('No se pudo generar el token')
            }
            resolve(token)
        })
    })
};

module.exports = {
    generarJWT
};