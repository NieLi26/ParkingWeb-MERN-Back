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
exports.buscarReservaPatente = exports.cambiarCondicion = exports.eliminarReserva = exports.actualizarReserva = exports.crearReserva = exports.obtenerReserva = exports.obtenerReservas = void 0;
const index_js_1 = require("../models/index.js");
const index_js_2 = require("../helpers/index.js");
const obtenerReservas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, pageSize = 5 } = req.query;
    const query = { estado: true };
    try {
        if (page) {
            const totalResults = yield index_js_1.Reserva.countDocuments(query);
            const totalPages = Math.ceil(totalResults / pageSize);
            let adjustedPage = page;
            if (adjustedPage > totalPages) {
                // Si la página solicitada es mayor que el total de páginas, ajustarla al último
                adjustedPage = totalPages;
            }
            const startIndex = (adjustedPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize - 1, totalResults - 1);
            const reservas = yield index_js_1.Reserva.find(query)
                .sort('-createdAt')
                .skip(startIndex)
                .limit(pageSize)
                .populate([
                { path: 'lote', select: '-estado -__v' },
                { path: 'tarifa', select: '-estado -__v' }
            ]);
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
                reservas,
                pagination: paginationInfo,
            });
        }
        const reservas = yield index_js_1.Reserva.find(query)
            .populate([
            { path: 'lote', select: '-estado -__v' },
            { path: 'tarifa', select: '-estado -__v' }
        ]);
        res.json(reservas);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.obtenerReservas = obtenerReservas;
const obtenerReserva = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const existeReserva = yield index_js_1.Reserva.findById(id);
        if (!existeReserva) {
            const error = new Error('Reserva no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        res.json(existeReserva);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.obtenerReserva = obtenerReserva;
const crearReserva = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { lote, tarifa, patente } = req.body;
    try {
        // Validar Lote
        const existeLote = yield index_js_1.Lote.findById(lote);
        if (!existeLote) {
            const error = new Error('Lote no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        ;
        if (existeLote.condicion !== 'Disponible') {
            const error = new Error(`El Lote ${existeLote.numero}, no esta disponible`);
            return res.status(403).json({
                msg: error.message
            });
        }
        ;
        // Validar Tarifa
        const existeTarifa = yield index_js_1.Tarifa.findById(tarifa);
        if (!existeTarifa) {
            const error = new Error('Tarifa no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        ;
        // Validar Licencia
        // TODO: patente deberia usar una expresion regular para evitar el uso o no de signos especiales(guiones, especios, etc)
        patente = patente.toUpperCase();
        const existePatenteEnUso = yield index_js_1.Reserva.findOne({
            patente,
            $or: [
                { condicion: 'Finalizada' },
                { condicion: 'Iniciada' }
            ]
        });
        if (existePatenteEnUso) {
            const error = new Error(`La Patente ${patente}, esta en uso`);
            return res.status(403).json({
                msg: error.message
            });
        }
        const _a = req.body, { estado, entrada, salida, condicion } = _a, data = __rest(_a, ["estado", "entrada", "salida", "condicion"]);
        data.patente = patente;
        const reserva = new index_js_1.Reserva(data);
        yield reserva.save();
        // Modificar estado de lote
        existeLote.condicion = 'Ocupado';
        yield existeLote.save();
        reserva.lote = existeLote;
        res.status(201).json(reserva);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.crearReserva = crearReserva;
// Revisar bien antes de usar
const actualizarReserva = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let { lote, tarifa, patente } = req.body;
    try {
        const existeReserva = yield index_js_1.Reserva.findById(id);
        if (!existeReserva) {
            const error = new Error('Reserva no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        // Validar Lote
        const existeLote = yield index_js_1.Lote.findById(lote);
        if (!existeLote) {
            const error = new Error('Lote no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        ;
        if (existeLote.condicion !== 'Disponible' && id !== existeReserva._id.toString()) {
            const error = new Error(`El Lote ${existeLote.numero}, no esta disponible`);
            return res.status(403).json({
                msg: error.message
            });
        }
        ;
        // Validar Tarifa
        const existeTarifa = yield index_js_1.Tarifa.findById(tarifa);
        if (!existeTarifa) {
            const error = new Error('Tarifa no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        ;
        // Validar Licencia
        // TODO: patente deberia usar una expresion regular para evitar el uso o no de signos especiales(guiones, especios, etc)
        patente = patente.toUpperCase();
        const existePatenteEnUso = yield index_js_1.Reserva.findOne({ patente });
        if (existePatenteEnUso && id !== existeReserva._id.toString()) {
            const error = new Error(`La Patente ${patente}, esta en uso`);
            return res.status(403).json({
                msg: error.message
            });
        }
        const _b = req.body, { estado, entrada, salida, condicion } = _b, data = __rest(_b, ["estado", "entrada", "salida", "condicion"]);
        const reserva = yield index_js_1.Reserva.findByIdAndUpdate(id, Object.assign(Object.assign({}, data), { patente }), { new: true });
        res.status(201).json(reserva);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.actualizarReserva = actualizarReserva;
const eliminarReserva = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const existeReserva = yield index_js_1.Reserva.findById(id);
        if (!existeReserva) {
            const error = new Error('Reserva no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        const codicionesValidas = ['Finalizada', 'Anulada', 'Pagada'];
        if (!codicionesValidas.includes(existeReserva.condicion)) {
            const error = new Error(`Solo se puede eliminar reserva con alguno de los siguientes estados, ${codicionesValidas}`);
            return res.status(400).json({
                msg: error.message
            });
        }
        existeReserva.estado = false;
        yield existeReserva.save();
        // Cambiar estado  Pago
        if (existeReserva.condicion === 'Pagada') {
            yield index_js_1.Pago.findOneAndUpdate({ reserva: existeReserva._id }, { estado: false });
        }
        // await Reserva.findByIdAndUpdate( id, { estado: false }, { new: true } );
        res.json({
            msg: `Reserva Eliminada Correctamente`
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
exports.eliminarReserva = eliminarReserva;
const cambiarCondicion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { condicion, observacion } = req.body;
    try {
        const existeReserva = yield index_js_1.Reserva.findById(id);
        if (!existeReserva) {
            const error = new Error('Reserva no existe');
            return res.status(404).json({
                msg: error.message
            });
        }
        const codicionesValidas = ['Finalizada', 'Anulada'];
        if (!codicionesValidas.includes(condicion)) {
            const error = new Error('Condicion no Valida');
            return res.status(400).json({
                msg: error.message
            });
        }
        if (condicion === 'Finalizada' && existeReserva.condicion !== 'Iniciada') {
            const error = new Error('La reserva debe estar Iniciada');
            return res.status(400).json({
                msg: error.message
            });
        }
        if (condicion === 'Anulada') {
            const rolesValidos = ['ADMIN_ROLE', 'SUPER_ROLE'];
            if (!rolesValidos.includes(req.usuario.rol)) {
                const error = new Error(`${req.usuario.nombre} no es administrador - No puede hacer esto`);
                return res.status(403).json({
                    msg: error.message
                });
            }
            if (existeReserva.condicion !== 'Finalizada') {
                const error = new Error('La reserva debe estar Finalizada');
                return res.status(400).json({
                    msg: error.message
                });
            }
            if (!observacion) {
                const error = new Error('Debe Ingresar Observacion');
                return res.status(400).json({
                    msg: error.message
                });
            }
        }
        // if ( condicion === 'Anulada' && existeReserva.condicion !== 'Finalizada' ) {
        //     const error = new Error('La reserva debe estar Finalizada')
        //     return res.status(400).json({
        //         msg: error.message
        //     })
        // }
        // if ( condicion === 'Anulada' && !observacion ) {
        //     const error = new Error('Debe Ingresar Observacion')
        //     return res.status(400).json({
        //         msg: error.message
        //     })
        // }
        existeReserva.observacion = observacion || existeReserva.observacion;
        existeReserva.salida = new Date();
        // existeReserva.salida = Date.now();
        // existeReserva.salida = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"});
        existeReserva.condicion = condicion;
        yield existeReserva.save();
        // Liberar Lote
        const lote = yield index_js_1.Lote.findByIdAndUpdate(existeReserva.lote, { condicion: 'Disponible' }, { new: true });
        existeReserva.lote = lote;
        res.json(existeReserva);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.cambiarCondicion = cambiarCondicion;
const buscarReservaPatente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q = '', limite = 0, orden = '' } = req.query;
    try {
        const regex = new RegExp(q, 'i');
        const reservas = yield index_js_1.Reserva.find({ patente: regex, condicion: 'Finalizada', estado: true })
            .populate([
            { path: 'lote', select: '-estado -__v' },
            { path: 'tarifa', select: '-estado -__v' }
        ])
            .select('-__v -estado')
            .sort({ createdAt: orden === 'desc' ? -1 : 1 })
            .limit(limite);
        const reservaMasPrecio = reservas.map(reserva => {
            var _a, _b;
            return (Object.assign(Object.assign({}, reserva.toObject()), { tiempoTotal: (0, index_js_2.calcularTiempo)(reserva.entrada, (_a = reserva.salida) !== null && _a !== void 0 ? _a : new Date()), precioTotal: (0, index_js_2.calcularPrecio)(reserva.entrada, (_b = reserva.salida) !== null && _b !== void 0 ? _b : new Date(), reserva.tarifa.precioBase, reserva.tarifa.precioMinuto, reserva.tarifa.desdeMinuto) }));
        });
        // if ( condicion ) {
        //     const condicionesValidas = ['Iniciada', 'Finalizada', 'Pagada', 'Anulada']
        //     if (!condicionesValidas.includes(condicion)) {
        //         const error = new Error('Condicion no Valida')
        //         return res.status(400).json({
        //             msg: error.message
        //         })
        //     }
        // reservas = await reservas.find({ condicion: condicion })
        res.json(reservaMasPrecio);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente');
        res.status(500).json({
            msg: err.message
        });
    }
});
exports.buscarReservaPatente = buscarReservaPatente;
//# sourceMappingURL=reservaController.js.map