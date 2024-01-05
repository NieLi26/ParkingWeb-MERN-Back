import express, { Application } from 'express';
import cors from 'cors';
import { 
    loteRoutes, 
    pagoRoutes, 
    reservaRoutes, 
    tarifaRoutes,
    usuarioRoutes,
    authRoutes
} from '../routes/index'
import dbConnection from './db';

interface Paths {
    lotes: string;
    tarifas: string;
    reservas: string;
    pagos: string;
    usuarios: string;
    auth: string;
}

class Server {

    private app: Application;
    private port: string;
    private paths: Paths = {
        lotes: '/api/lotes',
        tarifas: '/api/tarifas',
        reservas: '/api/reservas',
        pagos: '/api/pagos',
        usuarios: '/api/usuarios',
        auth: '/api/auth',
    };

    constructor () {
        this.app = express();
        this.port = process.env.PORT || '8080';
        
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
            origin: function (origin: any , callback: Function) {
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
        this.app.use(this.paths.auth, authRoutes)
    }

    listen () {
        this.app.listen(this.port, () => {
            console.log('hola desde el puerto:', this.port);
        })
    }
}

export default Server