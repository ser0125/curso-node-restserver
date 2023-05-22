const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/api/auth';
        this.usuariosPath = '/api/usuarios';

        //Conectar base de datos
        this.conectarDB();

        //Midlewares
        this.middlewares();
        
        //rutas de la app
        this.routes()
    }

    async conectarDB() {
        await dbConnection();
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
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port)
    }
}

module.exports = Server;