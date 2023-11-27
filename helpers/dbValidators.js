import { Tarifa, Reserva, Lote, Pago } from "../models/index.js";

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

export {
    existeTarifaPorId,
    existeReservaPorId,
    existeLotePorId,
    existePagoPorId
}