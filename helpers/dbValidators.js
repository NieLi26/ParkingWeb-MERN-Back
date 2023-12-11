import { Tarifa, Reserva, Lote, Pago, Usuario } from "../models/index.js";

const existeTarifaPorId = async ( id ) => {
    // Verificar si la categoria existe
    const existeTarifa = await Tarifa.findById(id);
    if ( !existeTarifa ) {
        const error = new Error(`El id ${id} no existe`)
        throw error
    }
}

const existeReservaPorId = async ( id ) => {
    // Verificar si la reserva existe
    const existeReserva = await Reserva.findById(id);
    if ( !existeReserva ) {
        const error = new Error(`El id ${id} no existe`)
        throw error
    }
}

const existeLotePorId = async ( id ) => {
    // Verificar si la lote existe
    const existeLote = await Lote.findById(id);
    if ( !existeLote ) {
        const error = new Error(`El id ${id} no existe`)
        throw error
    }
}

const existePagoPorId = async ( id ) => {
    // Verificar si la pago existe
    const existePago = await Pago.findById(id);
    if ( !existePago ) {
        const error = new Error(`El id ${id} no existe`)
        throw error
    }
}

const existeUsuarioPorId = async ( id ) => {
    // Verificar si el Usuario existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        const error = new Error(`El id ${id} no existe`)
        throw error
    }
}

const emailOcupado = async ( email = '' ) => {
    // Verificar si el email existe
    const existeEmail = await Usuario.findOne({ email })
    if ( existeEmail ) {
        const error = new Error(`El correo ${email} ya esta registrado en la BD`)
        throw error
    }
}

// const esRoleValido = async (rol = '') => {
//     const existeRol = await Role.findOne({ rol });
//     if ( !existeRol ) {
//         throw new Error(`EL rol ${rol} no esta registrado en la BD`)
//     }
// }

export {
    existeTarifaPorId,
    existeReservaPorId,
    existeLotePorId,
    existePagoPorId,
    existeUsuarioPorId,
    emailOcupado
}