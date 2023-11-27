import { request, response } from "express";
import { Reserva, Lote, Tarifa, Pago } from "../models/index.js";

const obtenerReservas = async ( req, res = response ) => {

    try {
        const reservas = await Reserva.find({ estado: true })
        res.json(reservas)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error.message
        })
    }

}

const obtenerReserva = async ( req, res = response ) => {
    const { id } = req.params;

    try {
        const existeReserva = await Reserva.findById( id );
        if (!existeReserva) {
            const error = new Error('Reserva no existe')
            return res.status(404).json({
                msg: error.message
            })
        }
        res.json(existeReserva)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error.message
        })
    }

}

const crearReserva = async ( req, res = response ) => {
    let { lote, tarifa, patente } = req.body;

    try {
        // Validar Lote
        const existeLote = await Lote.findById(lote);
        if ( !existeLote ) {
            const error = new Error('Lote no existe');
            return res.status(404).json({
                msg: error.message
            });
        };

        if ( existeLote.condicion !== 'Disponible' ) {
            const error = new Error(`El Lote ${existeLote.numero}, no esta disponible`);
            return res.status(403).json({
                msg: error.message
            });
        };
        // Validar Tarifa
        const existeTarifa = await Tarifa.findById(tarifa);
        if ( !existeTarifa ) {
            const error = new Error('Tarifa no existe');
            return res.status(404).json({
                msg: error.message
            });
        };

        // Validar Licencia
        // TODO: patente deberia usar una expresion regular para evitar el uso o no de signos especiales(guiones, especios, etc)
        patente = patente.toUpperCase();
        const existePatenteEnUso = await Reserva.findOne({ patente });
        if ( existePatenteEnUso ) {
            const error = new Error(`La Patente ${patente}, esta en uso`);
            return res.status(403).json({
                msg: error.message
            });
        }

        const { estado, entrada, salida, condicion, ...data } = req.body;
        data.patente = patente;
        const reserva = new Reserva(data);
        await reserva.save()
        
        // Modificar estado de lote
        existeLote.condicion = 'Ocupado';
        existeLote.save();

        res.status(201).json(reserva);

    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }
}

// Revisar bien antes de usar
const actualizarReserva = async ( req, res = response ) => {
    const { id } = req.params;
    const { lote, tarifa, patente } = req.body;

    try {

        const existeReserva = await Reserva.findById( id );
        if (!existeReserva) {
            const error = new Error('Reserva no existe')
            return res.status(404).json({
                msg: error.message
            })
        }

        // Validar Lote
        const existeLote = await Lote.findById(lote);
        if ( !existeLote ) {
            const error = new Error('Lote no existe');
            return res.status(404).json({
                msg: error.message
            });
        };

        if ( existeLote.condicion !== 'Disponible' && id !== existeReserva._id.toString() ) {
            const error = new Error(`El Lote ${existeLote.numero}, no esta disponible`);
            return res.status(403).json({
                msg: error.message
            });
        };
        // Validar Tarifa
        const existeTarifa = await Tarifa.findById(tarifa);
        if ( !existeTarifa ) {
            const error = new Error('Tarifa no existe');
            return res.status(404).json({
                msg: error.message
            });
        };

        // Validar Licencia
        // TODO: patente deberia usar una expresion regular para evitar el uso o no de signos especiales(guiones, especios, etc)
        const patente = patente.toUpperCase();
        const existePatenteEnUso = await Reserva.findOne({ patente });
        if ( existePatenteEnUso && id !== existeReserva._id.toString() ) {
            const error = new Error(`La Patente ${patente}, esta en uso`);
            return res.status(403).json({
                msg: error.message
            });
        }

        const { estado, entrada, salida, condicion, ...data } = req.body;

        const reserva = await Reserva.findByIdAndUpdate(id, { ...data, patente }, { new: true });
        res.status(201).json(reserva);

    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }
}

const eliminarReserva = async ( req, res = response ) => {
    const { id } = req.params;

    try {
        const existeReserva = await Reserva.findById( id );
        if (!existeReserva) {
            const error = new Error('Reserva no existe')
            return res.status(404).json({
                msg: error.message
            })
        }

        const codicionesValidas = ['Finalizada', 'Anulada', 'Pagada']

        if ( !codicionesValidas.includes(existeReserva.condicion) ) {
            const error = new Error(`Solo se puede eliminar reserva con alguno de los siguientes estados, ${codicionesValidas}`)
            return res.status(400).json({
                msg: error.message
            })
        }

        existeReserva.estado = false;
        await existeReserva.save();

        // Cambiar estado  Pago
        if ( existeReserva.condicion === 'Pagada' ) {
           await Pago.findOneAndUpdate( { reserva: existeReserva._id }, { estado: false } );
        }

        // await Reserva.findByIdAndUpdate( id, { estado: false }, { new: true } );

        res.json({
            msg: `Reserva Eliminada Correctamente`
        })
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }

}

const cambiarCondicion = async ( req, res = response ) => {
    const { id } = req.params;
    const { condicion, observacion } = req.body
    try {
        const existeReserva = await Reserva.findById( id );
        if (!existeReserva) {
            const error = new Error('Reserva no existe')
            return res.status(404).json({
                msg: error.message
            })
        }

        if ( existeReserva.condicion !== 'Iniciada' ) {
            const error = new Error('La reserva debe estar Iniciada')
            return res.status(400).json({
                msg: error.message
            })
        }

        const codicionesValidas = ['Finalizada', 'Anulada']

        if ( !codicionesValidas.includes(condicion) ) {
            const error = new Error('Condicion no Valida')
            return res.status(400).json({
                msg: error.message
            })
        }

        if ( condicion === 'Anulada' && !observacion ) {
            const error = new Error('Debe Ingresar Observacion')
            return res.status(400).json({
                msg: error.message
            })
        }

        existeReserva.observacion = observacion || existeReserva.observacion;
        existeReserva.salida = Date.now();
        existeReserva.condicion = condicion;
        await existeReserva.save();
        // Liberar Lote
        await Lote.findByIdAndUpdate(existeReserva.lote, { condicion: 'Disponible' })

        res.json(existeReserva);

    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }
}


export {
    obtenerReservas,
    obtenerReserva,
    crearReserva,
    actualizarReserva,
    eliminarReserva,
    cambiarCondicion
}