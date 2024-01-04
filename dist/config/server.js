"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
class Server {
    constructor() {
        this.paths = {
            lotes: '/api/lotes',
            tarifas: '/api/tarifas',
            reservas: '/api/reservas',
            pagos: '/api/pagos',
            usuarios: '/api/usuarios',
            auth: '/api/auth',
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '8080';
    }
    conectarDB() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.default)();
        });
    }
    middlewares() {
        // CORS
        // const whitelist = [process.env.FRONTEND_URL]
        // const corsOptions = {
        //     origin: function (origin: any , callback: Function) {
        //         if (whitelist.indexOf(origin) !== -1) {
        //             callback(null, true)
        //         } else {
        //             callback(new Error('Not allowed by CORS'))
        //         }
        //     }
        // }
        this.app.use((0, cors_1.default)());
        // this.app.use( cors(corsOptions) );
        // Lectura y parseo del body
        this.app.use(express_1.default.json());
        // DIR Publico
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        this.app.use(this.paths.lotes, loteRoutes);
        this.app.use(this.paths.tarifas, tarifaRoutes);
        this.app.use(this.paths.reservas, reservaRoutes);
        this.app.use(this.paths.pagos, pagoRoutes);
        this.app.use(this.paths.usuarios, usuarioRoutes);
        this.app.use(this.paths.auth, authRoutes);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('hola desde el puerto:', this.port);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map