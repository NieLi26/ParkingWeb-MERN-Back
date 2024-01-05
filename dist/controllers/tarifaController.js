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
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarTarifa = exports.actualizarTarifa = exports.crearTarifa = exports.obtenerTarifa = exports.obtenerTarifas = void 0;
const index_1 = require("../models/index");
const obtenerTarifas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, pageSize = 5 } = req.query;
    const query = { estado: true };
    try {
        if (page) {
            const totalResults = yield index_1.Tarifa.countDocuments(query);
            const totalPages = Math.ceil(totalResults / pageSize);
            let adjustedPage = page;
            if (adjustedPage > totalPages) {
                // Si la página solicitada es mayor que el total de páginas, ajustarla al último
                adjustedPage = totalPages;
            }
            const startIndex = (adjustedPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize - 1, totalResults - 1);
            const tarifas = yield index_1.Tarifa.find(query)
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
                tarifas,
                pagination: paginationInfo,
            });
        }
        const tarifas = yield index_1.Tarifa.find(query);
        res.json(tarifas);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.obtenerTarifas = obtenerTarifas;
const obtenerTarifa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const existeTarifa = yield index_1.Tarifa.findById(id);
        if (!existeTarifa) {
            const error = new Error('Tarifa no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        res.json(existeTarifa);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.obtenerTarifa = obtenerTarifa;
const crearTarifa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { nombre, precioBase, precioMinuto, desdeMinuto } = req.body;
    try {
        nombre = nombre.toLowerCase();
        const existeNombre = yield index_1.Tarifa.findOne({ nombre });
        if (existeNombre) {
            const error = new Error(`La Tarifa con el nombre ${nombre}, ya existe`);
            return res.status(400).json({
                msg: error.message
            });
        }
        const existeCondiciones = yield index_1.Tarifa.findOne({ precioBase, precioMinuto, desdeMinuto });
        if (existeCondiciones) {
            const error = new Error('Ya Existe una tarifa con las mismas condiciones');
            return res.status(400).json({
                msg: error.message
            });
        }
        const data = {
            nombre,
            precioBase,
            precioMinuto,
            desdeMinuto,
        };
        const tarifa = new index_1.Tarifa(data);
        yield tarifa.save();
        res.status(201).json(tarifa);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.crearTarifa = crearTarifa;
const actualizarTarifa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let { nombre, precioBase, precioMinuto, desdeMinuto } = req.body;
    try {
        const existeTarifa = yield index_1.Tarifa.findById(id);
        if (!existeTarifa) {
            const error = new Error('Tarifa no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        nombre = nombre.toLowerCase();
        const existeNombre = yield index_1.Tarifa.findOne({ nombre });
        if (existeNombre && id !== existeNombre._id.toString()) {
            const error = new Error(`La Tarifa con el nombre ${nombre}, ya existe`);
            return res.status(400).json({
                msg: error.message
            });
        }
        const existeCondiciones = yield index_1.Tarifa.findOne({ precioBase, precioMinuto, desdeMinuto });
        if (existeCondiciones && id !== existeCondiciones._id.toString()) {
            const error = new Error('Ya Existe una tarifa con las mismas condiciones');
            return res.status(400).json({
                msg: error.message
            });
        }
        const data = {
            nombre,
            precioBase,
            precioMinuto,
            desdeMinuto,
        };
        const tarifa = yield index_1.Tarifa.findByIdAndUpdate(id, data, { new: true });
        res.status(201).json(tarifa);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.actualizarTarifa = actualizarTarifa;
const eliminarTarifa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password = '' } = req.body;
    const { id } = req.params;
    try {
        const validPassword = yield req.usuario.comprobarPassword(password);
        if (!validPassword) {
            const error = new Error('Credenciales incorrectas');
            return res.status(403).json({ msg: error.message });
        }
        const existeTarifa = yield index_1.Tarifa.findById(id);
        if (!existeTarifa) {
            const error = new Error('Tarifa no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        const tarifa = yield index_1.Tarifa.findByIdAndUpdate(id, { estado: false }, { new: true });
        res.json({
            msg: `Tarifa ${tarifa === null || tarifa === void 0 ? void 0 : tarifa.nombre} Eliminada Correctamente`
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
exports.eliminarTarifa = eliminarTarifa;
//# sourceMappingURL=tarifaController.js.map