import { request, response } from "express";
import { Lote, Reserva } from "../models/index.js";

const obtenerLotes = async ( req = request, res = response ) => {
    // const { limite, desde } = req.query
    const { page, pageSize = 5 } = req.query;
    const query = { estado: true };
    try {
        if ( page ) {

            // const [ total, lotes ] = await Promise.all([
            //     Lote.countDocuments(query),
            //     Lote.find(query)
            //         .sort('numero')
            //         .skip(desde)
            //         .limit(10)

            // ])

            // return res.json({
            //     total,
            //     lotes
            // })

            const totalResults = await Lote.countDocuments(query);

            const totalPages = Math.ceil(totalResults / pageSize);

            let adjustedPage = parseInt(page);
            if (adjustedPage > totalPages) {
                // Si la página solicitada es mayor que el total de páginas, ajustarla al último
                adjustedPage = totalPages;
            }

            const startIndex = (adjustedPage  - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize - 1, totalResults - 1);
        
            const lotes = await Lote.find(query)
                .sort('numero')
                .skip(startIndex)
                .limit(parseInt(pageSize));
        
            const paginationInfo = {
                number: adjustedPage,
                total_pages: totalPages,
                has_previous: adjustedPage > 1,
                has_next: adjustedPage < totalPages,
                paginate_by: parseInt(pageSize),
                total_results: totalResults,
                start_index: startIndex + 1,
                end_index: endIndex + 1,
            };
        
            return res.json({
                lotes,
                pagination: paginationInfo,
            });
        } 

        const lotes = await Lote.find({ estado: true })
        res.json(lotes)
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
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
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
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

const buscarReserva = async ( req, res = response ) => {
    const { id } = req.params;
    try {
        const reserva = await Reserva.findOne({ lote: id, condicion: 'Iniciada' });
        res.json(reserva);
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
    eliminarLote,
    buscarReserva
}