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
exports.buscarReserva = exports.eliminarLote = exports.actualizarLote = exports.crearLote = exports.obtenerLote = exports.obtenerLotes = void 0;
const index_1 = require("../models/index");
const obtenerLotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { limite, desde } = req.query
    const { page, pageSize = 5 } = req.query;
    const query = { estado: true };
    try {
        if (page) {
            const totalResults = yield index_1.Lote.countDocuments(query);
            const totalPages = Math.ceil(totalResults / pageSize);
            let adjustedPage = page;
            if (adjustedPage > totalPages) {
                // Si la página solicitada es mayor que el total de páginas, ajustarla al último
                adjustedPage = totalPages;
            }
            const startIndex = (adjustedPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize - 1, totalResults - 1);
            const lotes = yield index_1.Lote.find(query)
                .sort('numero')
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
                lotes,
                pagination: paginationInfo,
            });
        }
        const lotes = yield index_1.Lote.find({ estado: true });
        res.json(lotes);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.obtenerLotes = obtenerLotes;
const obtenerLote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const existeLote = yield index_1.Lote.findById(id);
        if (!existeLote) {
            const error = new Error('Lote no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        res.json(existeLote);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.obtenerLote = obtenerLote;
const crearLote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { numero } = req.body;
    try {
        const existeNumero = yield index_1.Lote.findOne({ numero });
        if (existeNumero) {
            const error = new Error(`El Lote ${existeNumero.numero}, ya existe`);
            return res.status(400).json({
                msg: error.message
            });
        }
        const lote = new index_1.Lote({ numero });
        yield lote.save();
        res.status(201).json(lote);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.crearLote = crearLote;
const actualizarLote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { numero } = req.body;
    try {
        const existeLote = yield index_1.Lote.findById(id);
        if (!existeLote) {
            const error = new Error('Lote no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        const existeNumero = yield index_1.Lote.findOne({ numero });
        if (existeNumero && id !== existeNumero._id.toString()) {
            const error = new Error(`El Lote ${existeNumero.numero}, ya existe`);
            return res.status(400).json({
                msg: error.message
            });
        }
        const _a = req.body, { estado } = _a, data = __rest(_a, ["estado"]);
        const lote = yield index_1.Lote.findByIdAndUpdate(id, data, { new: true });
        res.status(201).json(lote);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.actualizarLote = actualizarLote;
const eliminarLote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const existeLote = yield index_1.Lote.findById(id);
        if (!existeLote) {
            const error = new Error('Lote no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        const lote = yield index_1.Lote.findByIdAndUpdate(id, { estado: false }, { new: true });
        res.json({
            msg: `Lote ${lote === null || lote === void 0 ? void 0 : lote.numero} Eliminado Correctamente`
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
exports.eliminarLote = eliminarLote;
const buscarReserva = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const reserva = yield index_1.Reserva.findOne({ lote: id, condicion: 'Iniciada' });
        res.json(reserva);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.buscarReserva = buscarReserva;
//# sourceMappingURL=loteController.js.map