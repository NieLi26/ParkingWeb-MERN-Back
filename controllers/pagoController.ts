import { Request, Response } from "express";
import { Pago, Reserva } from "../models/index.js";
import generarNumeroUnico from "../helpers/generarNumeroUnico";
import { calcularPrecio } from "../helpers/index";

interface QueryParams {
    pageSize?: number,
    page?: number
}

const obtenerPagos = async ( req: Request , res: Response ) => {
    const { page, pageSize = 5 }: QueryParams = req.query;
    const query = { estado: true };

    try {
        if ( page ) {
            const totalResults = await Pago.countDocuments(query);

            const totalPages = Math.ceil(totalResults / pageSize);

            let adjustedPage = page;
            if (adjustedPage > totalPages) {
                // Si la página solicitada es mayor que el total de páginas, ajustarla al último
                adjustedPage = totalPages;
            }

            const startIndex = (adjustedPage  - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize - 1, totalResults - 1);
        
            const pagos = await Pago.find(query)
                .sort('numero')
                .skip(startIndex)
                .limit(pageSize)
                .populate({ path: 'reserva', populate: [{ path: 'lote' }, { path: 'tarifa' }]})
        
        
        
            const paginationInfo = {
                number: adjustedPage,
                total_pages: totalPages,
                has_previous: adjustedPage > 1,
                has_next: adjustedPage < totalPages,
                paginate_by: pageSize,
                total_results: totalResults,
                start_index: startIndex + 1,
                end_index: endIndex + 1,
            };
        
            return res.json({
                pagos,
                pagination: paginationInfo,
            });
        } 

        const pagos = await Pago.find(query)
        res.json(pagos)
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        })
    }

}

const obtenerPago = async ( req: Request, res: Response ) => {
    const { id } = req.params;

    try {
        const existePago = await Pago.findById( id );
        if (!existePago) {
            const error = new Error('Pago no existe')
            return res.status(404).json({
                msg: error.message
            })
        }
        res.json(existePago)
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        })
    }

}

interface RequestUsuario extends Request {
    usuario: {
        rol: string,
        nombre: string
    };
}

const crearPago = async ( req: RequestUsuario, res: Response ) => {
    const { reserva, metodoPago } = req.body;

    try {
        const existeReserva = await Reserva.findById( reserva )
        .populate('tarifa', '-__v -estado')
        .populate('lote', '-__v -estado')

        if (!existeReserva) {
            const error = new Error('Reserva no existe')
            return res.status(404).json({
                msg: error.message
            })
        }

        // const metodosValidos =  ['Efectivo', 'Transferencia', 'Debito', 'Credito']

        // if ( !metodosValidos.includes(metodoPago) ) {
        //     const error = new Error('Metodo de Pago no Valido')
        //     return res.status(400).json({
        //         msg: error.message
        //     })
        // }

        const codicionesValidas = ['Finalizada', 'Anulada']
        if ( !codicionesValidas.includes(existeReserva.condicion) ) {
            const error = new Error(`No puede Pagarse una Reserva ${existeReserva.condicion}`)
            return res.status(400).json({
                msg: error.message
            })
        }

        if ( existeReserva.condicion === 'Anulada' ) {
            const rolesValidos = ['ADMIN_ROLE', 'SUPER_ROLE']
            if ( !rolesValidos.includes(req.usuario.rol) ) {
                const error = new Error(`${req.usuario.nombre} no es administrador - No puede hacer esto`)
                return res.status(403).json({
                    msg: error.message
                })
            }
        }

        // if ( existeReserva.condicion !== 'Finalizada' ) {
        //     const error = new Error('Solo puede pagarse una reserva finalizada')
        //     return res.status(400).json({
        //         msg: error.message
        //     })
        // }


        
        // Validar Correcion mal cambio de estado
        // if ( condicion === 'Pagada' && existeReserva.condicion === 'Anulada' ) {
        //     existeReserva.condicion = condicion;
        //     await existeReserva.save()
        //     return res.json(existeReserva);
        // }
        
        const { estado, ...data } = req.body;
        data.numero = generarNumeroUnico(6);
        const total = calcularPrecio(
            existeReserva.entrada, existeReserva.salida ?? new Date(), existeReserva.tarifa.precioBase,
            existeReserva.tarifa.precioMinuto, existeReserva.tarifa.desdeMinuto
        );
        // TODO: Hacerlo en la base de datos
        if ( total <= 0 ) {
            const error = new Error(`Total Debe ser Mayor a 0`)
            return res.status(400).json({
                msg: error.message
            })
        }
        data.total = total
        const pago = new Pago(data);
        await pago.save()

        existeReserva.condicion = 'Pagada';
        await existeReserva.save()
        
        // if ( existeReserva.condicion === 'Anulada' ) {
        //     return res.status(201).json(existeReserva);
        // }
        res.status(201).json(existeReserva);

    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }
}

const actualizarPago = async ( req: Request, res: Response ) => {
    const { id } = req.params;
    const { metodoPago , total } = req.body;

    try {
        const existePago = await Pago.findById( id );
        if (!existePago) {
            const error = new Error('Pago no existe')
            return res.status(404).json({
                msg: error.message
            })
        }

        const metodosValidos =  ['Efectivo', 'Transferencia', 'Debito', 'Credito']

        if ( !metodosValidos.includes(metodoPago) ) {
            const error = new Error('Metodo de Pago no Valido')
            return res.status(400).json({
                msg: error.message
            })
        }

        existePago.metodoPago = metodoPago;
        existePago.total = total;
        await existePago.save();
        res.status(201).json(existePago);

    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }
}

const eliminarPago = async ( req: Request, res: Response ) => {
    const { id } = req.params;

    try {
        const existePago = await Pago.findById( id );
        if (!existePago) {
            const error = new Error('Pago no existe')
            return res.status(404).json({
                msg: error.message
            })
        }

        existePago.estado = false;
        await Reserva.findByIdAndUpdate(existePago.reserva, { condicion : 'Anulada' });
        await existePago.save();

        res.json({
            msg: `Pago numero ${existePago.numero} Eliminado Correctamente`
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
    obtenerPagos,
    obtenerPago,
    crearPago,
    actualizarPago,
    eliminarPago
}