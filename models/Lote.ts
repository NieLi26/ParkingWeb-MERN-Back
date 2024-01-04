import mongoose from "mongoose";

const loteSchema = new mongoose.Schema({
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    numero: {
        type: Number,
        required: true
    },
    condicion: {
        type: String,
        required: true,
        default: 'Disponible',
        enum: ['Disponible', 'Ocupado', 'Reservado', 'Mantenimiento']
    }
}, {
    timestamps: true
});

loteSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    return data
}

const Lote = mongoose.model('Lote', loteSchema);

export default Lote;