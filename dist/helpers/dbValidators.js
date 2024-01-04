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
exports.emailOcupado = exports.existeUsuarioPorId = exports.existePagoPorId = exports.existeLotePorId = exports.existeReservaPorId = exports.existeTarifaPorId = void 0;
const index_js_1 = require("../models/index.js");
const existeTarifaPorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar si la tarifa existe
    const existeTarifa = yield index_js_1.Tarifa.findById(id);
    if (!existeTarifa) {
        const error = new Error(`El id ${id} no existe`);
        throw error;
    }
});
exports.existeTarifaPorId = existeTarifaPorId;
const existeReservaPorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar si la reserva existe
    const existeReserva = yield index_js_1.Reserva.findById(id);
    if (!existeReserva) {
        const error = new Error(`El id ${id} no existe`);
        throw error;
    }
});
exports.existeReservaPorId = existeReservaPorId;
const existeLotePorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar si la lote existe
    const existeLote = yield index_js_1.Lote.findById(id);
    if (!existeLote) {
        const error = new Error(`El id ${id} no existe`);
        throw error;
    }
});
exports.existeLotePorId = existeLotePorId;
const existePagoPorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar si la pago existe
    const existePago = yield index_js_1.Pago.findById(id);
    if (!existePago) {
        const error = new Error(`El id ${id} no existe`);
        throw error;
    }
});
exports.existePagoPorId = existePagoPorId;
const existeUsuarioPorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar si el Usuario existe
    const existeUsuario = yield index_js_1.Usuario.findById(id);
    if (!existeUsuario) {
        const error = new Error(`El id ${id} no existe`);
        throw error;
    }
});
exports.existeUsuarioPorId = existeUsuarioPorId;
const emailOcupado = (email = '') => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar si el email existe
    const existeEmail = yield index_js_1.Usuario.findOne({ email });
    if (existeEmail) {
        const error = new Error(`El correo ${email} ya esta registrado en la BD`);
        throw error;
    }
});
exports.emailOcupado = emailOcupado;
//# sourceMappingURL=dbValidators.js.map