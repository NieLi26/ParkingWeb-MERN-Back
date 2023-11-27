import express from 'express';
import cors from 'cors';
import { loteRoutes, pagoRoutes, reservaRoutes, tarifaRoutes } from '../routes/index.js'
import dbConnection from './db.js';

class Server {
    constructor () {
        this.app = express();
        this.port = process.env.PORT || 8080;
        this.paths = {
            lotes: '/api/lotes',
            tarifas: '/api/tarifas',
            reservas: '/api/reservas',
            pagos: '/api/pagos',
        }

        this.conectarDB();

        this.middlewares();

        this.routes();
    }

    async conectarDB () {
        await dbConnection();
    }

    middlewares () {
        // CORS
        this.app.use( cors() );
        // Lectura y parseo del body
        this.app.use( express.json() );
        // DIR Publico
        this.app.use( express.static('public') );
    }

    routes () {
        this.app.use(this.paths.lotes, loteRoutes)
        this.app.use(this.paths.tarifas, tarifaRoutes)
        this.app.use(this.paths.reservas, reservaRoutes)
        this.app.use(this.paths.pagos, pagoRoutes)
    }

    listen () {
        this.app.listen(this.port, () => {
            console.log('hola desde el puert:', this.port);
        })
    }

}

export default Server