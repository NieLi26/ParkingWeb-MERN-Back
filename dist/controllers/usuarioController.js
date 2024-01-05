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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.perfil = exports.login = exports.eliminarUsuario = exports.actualizarUsuario = exports.crearUsuario = exports.obtenerUsuario = exports.obtenerUsuarios = void 0;
const index_js_1 = require("../models/index.js");
const index_js_2 = require("../helpers/index.js");
const obtenerUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, pageSize = 5 } = req.query;
    const query = { estado: true, rol: { $ne: 'SUPER_ROLE' } };
    try {
        if (page) {
            const totalResults = yield index_js_1.Usuario.countDocuments(query);
            const totalPages = Math.ceil(totalResults / pageSize);
            let adjustedPage = page;
            if (adjustedPage > totalPages) {
                // Si la página solicitada es mayor que el total de páginas, ajustarla al último
                adjustedPage = totalPages;
            }
            const startIndex = (adjustedPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize - 1, totalResults - 1);
            const usuarios = yield index_js_1.Usuario.find(query)
                .sort('-createdAt')
                .skip(startIndex)
                .limit(pageSize);
            const paginationInfo = {
                number: adjustedPage,
                total_pages: totalPages,
                has_previous: adjustedPage > 1,
                has_next: adjustedPage < totalPages,
                paginate_by: pageSize,
                total_results: totalResults,
                start_index: startIndex + 1,
                end_index: endIndex + 1,
            };
            return res.json({
                usuarios,
                pagination: paginationInfo,
            });
        }
        const usuarios = yield index_js_1.Usuario.find(query);
        res.json(usuarios);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.obtenerUsuarios = obtenerUsuarios;
const obtenerUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const existeUsuario = yield index_js_1.Usuario.findById(id);
        if (!existeUsuario) {
            const error = new Error('Usuario no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        res.json(existeUsuario);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.obtenerUsuario = obtenerUsuario;
const crearUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { nombre, email, password, rol } = req.body;
    try {
        // Comprobar existencia de usuario por correo
        const existeCorreo = yield index_js_1.Usuario.findOne({ email: email.toLowerCase() });
        if (existeCorreo) {
            const error = new Error('Correo ya registrado');
            return res.status(400).json({ msg: error.message });
        }
        const usuario = new index_js_1.Usuario({ nombre, email, password, rol });
        // Guardar la DB
        yield usuario.save();
        res.json(usuario);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.crearUsuario = crearUsuario;
const actualizarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let _a = req.body, { password, estado, rol } = _a, resto = __rest(_a, ["password", "estado", "rol"]);
    try {
        const existeUsuario = yield index_js_1.Usuario.findById(id);
        if (!existeUsuario) {
            const error = new Error('Usuario no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        if (existeUsuario.rol === 'SUPER_ROLE') {
            const error = new Error(`${req.usuario.nombre} - No puede hacer esto`);
            return res.status(403).json({
                msg: error.message
            });
        }
        // Comprobar existencia de usuario por correo
        const existeCorreo = yield index_js_1.Usuario.findOne({ email: resto.email.toLowerCase() });
        if (existeCorreo && existeCorreo._id.toString() !== id) {
            const error = new Error('Correo ya registrado');
            return res.status(400).json({ msg: error.message });
        }
        resto.email = resto.email.toLowerCase();
        const usuario = yield index_js_1.Usuario.findByIdAndUpdate(id, resto, { new: true });
        res.json(usuario);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.actualizarUsuario = actualizarUsuario;
const eliminarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password = '' } = req.body;
    const { id } = req.params;
    try {
        const validPassword = yield req.usuario.comprobarPassword(password);
        if (!validPassword) {
            const error = new Error('Credenciales incorrectas');
            return res.status(403).json({ msg: error.message });
        }
        const existeUsuario = yield index_js_1.Usuario.findById(id);
        if (!existeUsuario) {
            const error = new Error('Usuario no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        if (existeUsuario.rol === 'SUPER_ROLE') {
            const error = new Error(`${req.usuario.nombre} - No puede hacer esto`);
            return res.status(403).json({
                msg: error.message
            });
        }
        if (existeUsuario.rol === 'ADMIN_ROLE') {
            if (req.usuario.rol !== 'SUPER_ROLE') {
                const error = new Error(`${req.usuario.nombre} - No puede hacer esto`);
                return res.status(403).json({
                    msg: error.message
                });
            }
        }
        const usuario = yield index_js_1.Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });
        res.json({
            msg: `Usuario ${usuario.nombre} Eliminado Correctamente`
        });
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.eliminarUsuario = eliminarUsuario;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const existeUsuario = yield index_js_1.Usuario.findOne({ email });
        if (!existeUsuario) {
            const error = new Error('Credenciales incorrectas');
            return res.status(404).json({ msg: error.message });
        }
        // si el usuario esta activo
        if (!existeUsuario.estado) {
            const error = new Error('Tu Cuenta no se Encuentra Activa');
            return res.status(403).json({ msg: error.message });
        }
        // Verificar la contrasena
        const validPassword = yield existeUsuario.comprobarPassword(password);
        if (!validPassword) {
            const error = new Error('Credenciales incorrectas');
            return res.status(403).json({ msg: error.message });
        }
        // generar el JWT
        const token = yield (0, index_js_2.generarJWT)(existeUsuario.id);
        res.json(Object.assign(Object.assign({}, existeUsuario.toJSON()), { token }));
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.login = login;
// const comprobarToken = async (req, res) => {
//     const { token } = req.params;
//     const  tokenValido = await Usuario.findOne({ token });
//     if ( tokenValido ) {
//         res.json({ msg: 'Token valido y el usuario existe' })
//     } else {
//         const error = new Error('Token no valido');
//         return res.status(404).json({ msg: error.message });
//     }
// }
// const nuevoPassword = async (req, res) => {
//     const { token } = req.params;
//     const { password } = req.body;
//     const  usuario = await Usuario.findOne({ token });
//     if ( usuario ) {
//         usuario.password = password;
//         usuario.token = '';
//         try {
//             await usuario.save();
//             res.json({ msg: 'Password Modificado Correctamente' })
//         } catch (error) {
//             console.log(error);
//         }
//     } else {
//         const error = new Error('Token no valido');
//         return res.status(404).json({ msg: error.message });
//     }
// };
const perfil = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario } = req;
    res.json(usuario);
});
exports.perfil = perfil;
//# sourceMappingURL=usuarioController.js.map