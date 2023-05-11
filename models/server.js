const express = require('express');
const cors = require('cors');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT || '3000';
        this.usuariosPath = '/api/usuarios';

        //Midlewares
        this.middlewares();
        //rutas de la app
        this.routes()
    }

    middlewares() {
        //Cors
        this.app.use(cors())

        //Parseo y lectura del body
        this.app.use(express.json());

        //Directorio publico estatico
        this.app.use(express.static('public'))
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port)
    }
}

module.exports = Server;
