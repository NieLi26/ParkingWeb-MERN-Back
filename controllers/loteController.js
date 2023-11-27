import { request, response } from "express";
import { Lote } from "../models/index.js";

const obtenerLotes = async ( req = request, res = response ) => {

    try {
        const lotes = await Lote.find({ estado: true })
        res.json(lotes)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error.message
        })
    }

}

const obtenerLote = async ( req, res = response ) => {
    const { id } = req.params;

    try {
        const existeLote = await Lote.findById( id );
        if (!existeLote) {
            const error = new Error('Lote no existe')
            return res.status(404).json({
                msg: error.message
            })
        }
        res.json(existeLote)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error.message
        })
    }

}

const crearLote = async ( req, res = response ) => {
    const { numero } = req.body;

    try {
        const existeNumero = await Lote.findOne({ numero });
        if ( existeNumero ) {
            const error = new Error(`El Lote ${existeNumero.numero}, ya existe`)
            return res.status(400).json({
                msg: error.message
            });
        }

        const lote = new Lote({ numero });
        await lote.save()
        res.status(201).json(lote);

    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }
}

const actualizarLote = async ( req, res = response ) => {
    const { id } = req.params;
    const { numero } = req.body;

    try {
        const existeLote = await Lote.findById( id );
        if (!existeLote) {
            const error = new Error('Lote no existe')
            return res.status(404).json({
                msg: error.message
            })
        }

        const existeNumero = await Lote.findOne({ numero });

        if ( existeNumero && id !== existeNumero._id.toString() ) {
            const error = new Error(`El Lote ${existeNumero.numero}, ya existe`)
            return res.status(400).json({
                msg: error.message
            });
        }

        const { estado, ...data } = req.body;

        const lote = await Lote.findByIdAndUpdate( id, data, { new: true } );
        res.status(201).json(lote)
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }
}

const eliminarLote = async ( req, res = response ) => {
    const { id } = req.params;

    try {
        const existeLote = await Lote.findById( id );
        if (!existeLote) {
            const error = new Error('Lote no existe')
            return res.status(404).json({
                msg: error.message
            })
        }

        const lote = await Lote.findByIdAndUpdate( id, { estado: false }, { new: true } );

        res.json({
            msg: `Lote ${lote.numero} Eliminado Correctamente`
        })
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }

}

export {
    obtenerLotes,
    obtenerLote,
    crearLote,
    actualizarLote,
    eliminarLote
}