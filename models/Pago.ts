import mongoose from "mongoose";

const pagoSchema = new mongoose.Schema({
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    reserva: {
        type: mongoose.Schema.Types.ObjectId,
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
    const { __v, estado, ...data } = this.toObject();
    return data
}

const Pago = mongoose.model('Pago', pagoSchema);

export default Pago;