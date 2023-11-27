import mongoose from "mongoose";

const reservaSchema = mongoose.Schema({
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    lote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lote',
        required: true
    },
    tarifa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tarifa',
        required: true
    },
    patente: {
        type: String,
        required: true,
        trim: true
    },
    entrada: {
        type: Date,
        default: Date.now(),
        require: true
    },
    salida: {
        type: Date
    },
    condicion: {
        type: String,
        required: true,
        default: 'Iniciada',
        enum: ['Iniciada', 'Finalizada', 'Pagada', 'Anulada']
    },
    observacion: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

reservaSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    return data
}

const Reserva = mongoose.model('Reserva', reservaSchema);

export default Reserva;