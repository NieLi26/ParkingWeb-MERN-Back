"use strict";
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
const mongoose_1 = __importDefault(require("mongoose"));
const pagoSchema = new mongoose_1.default.Schema({
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    reserva: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Reserva',
        required: true
    },
    numero: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        default: 0,
        required: true
    },
    metodoPago: {
        type: String,
        required: true,
        enum: ['Efectivo', 'Transferencia', 'Debito', 'Credito']
    }
}, {
    timestamps: true
});
pagoSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v, estado } = _a, data = __rest(_a, ["__v", "estado"]);
    return data;
};
const Pago = mongoose_1.default.model('Pago', pagoSchema);
exports.default = Pago;
//# sourceMappingURL=Pago.js.map