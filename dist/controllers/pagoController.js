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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarPago = exports.actualizarPago = exports.crearPago = exports.obtenerPago = exports.obtenerPagos = void 0;
const index_js_1 = require("../models/index.js");
const generarNumeroUnico_1 = __importDefault(require("../helpers/generarNumeroUnico"));
const index_1 = require("../helpers/index");
const obtenerPagos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, pageSize = 5 } = req.query;
    const query = { estado: true };
    try {
        if (page) {
            const totalResults = yield index_js_1.Pago.countDocuments(query);
            const totalPages = Math.ceil(totalResults / pageSize);
            let adjustedPage = page;
            if (adjustedPage > totalPages) {
                // Si la página solicitada es mayor que el total de páginas, ajustarla al último
                adjustedPage = totalPages;
            }
            const startIndex = (adjustedPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize - 1, totalResults - 1);
            const pagos = yield index_js_1.Pago.find(query)
                .sort('numero')
                .skip(startIndex)
                .limit(pageSize)
                .populate({ path: 'reserva', populate: [{ path: 'lote' }, { path: 'tarifa' }] });
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
                pagos,
                pagination: paginationInfo,
            });
        }
        const pagos = yield index_js_1.Pago.find(query);
        res.json(pagos);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.obtenerPagos = obtenerPagos;
const obtenerPago = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const existePago = yield index_js_1.Pago.findById(id);
        if (!existePago) {
            const error = new Error('Pago no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        res.json(existePago);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.obtenerPago = obtenerPago;
const crearPago = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { reserva, metodoPago } = req.body;
    try {
        const existeReserva = yield index_js_1.Reserva.findById(reserva)
            .populate('tarifa', '-__v -estado')
            .populate('lote', '-__v -estado');
        if (!existeReserva) {
            const error = new Error('Reserva no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        // const metodosValidos =  ['Efectivo', 'Transferencia', 'Debito', 'Credito']
        // if ( !metodosValidos.includes(metodoPago) ) {
        //     const error = new Error('Metodo de Pago no Valido')
        //     return res.status(400).json({
        //         msg: error.message
        //     })
        // }
        const codicionesValidas = ['Finalizada', 'Anulada'];
        if (!codicionesValidas.includes(existeReserva.condicion)) {
            const error = new Error(`No puede Pagarse una Reserva ${existeReserva.condicion}`);
            return res.status(400).json({
                msg: error.message
            });
        }
        if (existeReserva.condicion === 'Anulada') {
            const rolesValidos = ['ADMIN_ROLE', 'SUPER_ROLE'];
            if (!rolesValidos.includes(req.usuario.rol)) {
                const error = new Error(`${req.usuario.nombre} no es administrador - No puede hacer esto`);
                return res.status(403).json({
                    msg: error.message
                });
            }
        }
        // if ( existeReserva.condicion !== 'Finalizada' ) {
        //     const error = new Error('Solo puede pagarse una reserva finalizada')
        //     return res.status(400).json({
        //         msg: error.message
        //     })
        // }
        // Validar Correcion mal cambio de estado
        // if ( condicion === 'Pagada' && existeReserva.condicion === 'Anulada' ) {
        //     existeReserva.condicion = condicion;
        //     await existeReserva.save()
        //     return res.json(existeReserva);
        // }
        const _b = req.body, { estado } = _b, data = __rest(_b, ["estado"]);
        data.numero = (0, generarNumeroUnico_1.default)(6);
        const total = (0, index_1.calcularPrecio)(existeReserva.entrada, (_a = existeReserva.salida) !== null && _a !== void 0 ? _a : new Date(), existeReserva.tarifa.precioBase, existeReserva.tarifa.precioMinuto, existeReserva.tarifa.desdeMinuto);
        // TODO: Hacerlo en la base de datos
        if (total <= 0) {
            const error = new Error(`Total Debe ser Mayor a 0`);
            return res.status(400).json({
                msg: error.message
            });
        }
        data.total = total;
        const pago = new index_js_1.Pago(data);
        yield pago.save();
        existeReserva.condicion = 'Pagada';
        yield existeReserva.save();
        // if ( existeReserva.condicion === 'Anulada' ) {
        //     return res.status(201).json(existeReserva);
        // }
        res.status(201).json(existeReserva);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.crearPago = crearPago;
const actualizarPago = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { metodoPago, total } = req.body;
    try {
        const existePago = yield index_js_1.Pago.findById(id);
        if (!existePago) {
            const error = new Error('Pago no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        const metodosValidos = ['Efectivo', 'Transferencia', 'Debito', 'Credito'];
        if (!metodosValidos.includes(metodoPago)) {
            const error = new Error('Metodo de Pago no Valido');
            return res.status(400).json({
                msg: error.message
            });
        }
        existePago.metodoPago = metodoPago;
        existePago.total = total;
        yield existePago.save();
        res.status(201).json(existePago);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.actualizarPago = actualizarPago;
const eliminarPago = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const existePago = yield index_js_1.Pago.findById(id);
        if (!existePago) {
            const error = new Error('Pago no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        existePago.estado = false;
        yield index_js_1.Reserva.findByIdAndUpdate(existePago.reserva, { condicion: 'Anulada' });
        yield existePago.save();
        res.json({
            msg: `Pago numero ${existePago.numero} Eliminado Correctamente`
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
exports.eliminarPago = eliminarPago;
//# sourceMappingURL=pagoController.js.map