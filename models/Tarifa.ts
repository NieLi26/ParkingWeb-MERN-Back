import mongoose from "mongoose";

const tarifaSchema = new mongoose.Schema({
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    nombre: {
        type: String,
        trim: true,
        required: true
    },
    precioBase: {
        type: Number,
        default: 0,
        required: true
    },
    precioMinuto: {
        type: Number,
        default: 0,
        required: true
    },
    desdeMinuto: {
        type: Number,
        default: 0,
        required: true
    }
}, {
    timestamps: true
});

tarifaSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    return data
}

const Tarifa = mongoose.model('Tarifa', tarifaSchema);

export default Tarifa;