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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_js_1 = require("../models/index.js");
const checkAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const { uid } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
            // leer el usuario que corresponde al uid
            const usuario = yield index_js_1.Usuario.findById(uid);
            // SI el usuario no existe
            if (!usuario) {
                const error = new Error('Token no valido - usuario no existe en DB');
                return res.status(401).json({ msg: error.message });
            }
            // verificar si el uid tiene estado true
            if (!usuario.estado) {
                const error = new Error('Token no valido - usuario no habilitado');
                return res.status(401).json({ msg: error.message });
            }
            // req.usuario = await Usuario.findById(uid).select('-password -confirmado -confirmado -token -createdAt -updatedAt -__v');
            req.usuario = usuario;
            // console.log(req.usuario);
            next();
        }
        catch (error) {
            console.log(error);
            const err = new Error('Error Inesperado, intente nuevamente');
            return res.status(500).json({
                msg: err.message
            });
        }
    }
    if (!token) {
        const error = new Error('No Hay Token en la Peticion en cehckauth');
        return res.status(401).json({ msg: error.message });
    }
    // next();
});
exports.default = checkAuth;
//# sourceMappingURL=checkAuthMiddleware.js.map