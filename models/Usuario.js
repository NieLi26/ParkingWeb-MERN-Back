import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = mongoose.Schema({
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    rol: {
        type: String,
        required: true,
        default: 'OPERADOR_ROLE',
        enum: ['ADMIN_ROLE', 'OPERADOR_ROLE']
    }
}, {
    timestamps: true,
})

usuarioSchema.methods.toJSON = function () {
    const { __v, estado, password, ...data } = this.toObject();
    return data
}

usuarioSchema.pre('save', async function(next) {
    if ( !this.isModified('password') ) {
        next();
    }

    // Hashear Contraseña al crear usuario
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// Para comprobar si la contraseña hasheada es la misma
usuarioSchema.methods.comprobarPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;