import express from 'express';
import cors from 'cors';
import { 
    loteRoutes, 
    pagoRoutes, 
    reservaRoutes, 
    tarifaRoutes,
    usuarioRoutes
} from '../routes/index.js'
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
            usuarios: '/api/usuarios',
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
        const whitelist = [process.env.FRONTEND_URL]
        const corsOptions = {
            origin: function (origin, callback) {
                if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
                } else {
                callback(new Error('Not allowed by CORS'))
                }
            }
        }
        // this.app.use( cors() );
        this.app.use( cors(corsOptions) );
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
        this.app.use(this.paths.usuarios, usuarioRoutes)
    }

    listen () {
        this.app.listen(this.port, () => {
            console.log('hola desde el puert:', this.port);
        })
    }

}

export default Server