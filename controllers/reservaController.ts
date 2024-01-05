import { query, Request, Response } from "express";
import { Reserva, Lote, Tarifa, Pago } from "../models/index.js";
import { calcularPrecio, calcularTiempo } from "../helpers/index.js";

interface QueryParams {
    pageSize?: number,
    page?: number,
    q?: string;
    limite?: number;
    orden?: string;
}


const obtenerReservas = async ( req: Request, res: Response ) => {
    const { page, pageSize = 5 }: QueryParams = req.query;
    const query = { estado: true };
    
    try {
        if ( page ) {
            const totalResults = await Reserva.countDocuments(query);

            const totalPages = Math.ceil(totalResults / pageSize);

            let adjustedPage = page;
            if (adjustedPage > totalPages) {
                // Si la página solicitada es mayor que el total de páginas, ajustarla al último
                adjustedPage = totalPages;
            }

            const startIndex = (adjustedPage  - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize - 1, totalResults - 1);
        
            const reservas = await Reserva.find(query)
                .sort('-createdAt')
                .skip(startIndex)
                .limit(pageSize)
                .populate([
                    { path: 'lote', select: '-estado -__v'},
                    { path: 'tarifa', select: '-estado -__v'}
                ])
        
        
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
                reservas,
                pagination: paginationInfo,
            });
        } 

        const reservas = await Reserva.find(query)
            .populate([
                { path: 'lote', select: '-estado -__v'},
                { path: 'tarifa', select: '-estado -__v'}
            ])

        res.json(reservas)
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }

}

const obtenerReserva = async ( req: Request, res: Response ) => {
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
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }

}

const crearReserva = async ( req: Request, res: Response ) => {
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
        const existePatenteEnUso = await Reserva.findOne({
            patente,
            $or: [
              { condicion: 'Finalizada' },
              { condicion: 'Iniciada' }
            ]
          });
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
        await existeLote.save();

        reserva.lote = existeLote

        res.status(201).json(reserva);

    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }
}

interface RequestBody {
    patente: string;
    tarifa: number;
    lote: number;
}

// Revisar bien antes de usar
const actualizarReserva = async ( req: Request, res: Response ) => {
    const { id } = req.params;
    let { lote, tarifa, patente }: RequestBody = req.body;

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
        patente = patente.toUpperCase();
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

const eliminarReserva = async ( req: Request, res: Response ) => {
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

interface RequestUsuario extends Request {
    usuario: {
        rol: string,
        nombre: string
    };
}

const cambiarCondicion = async ( req: RequestUsuario, res: Response ) => {
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

        const codicionesValidas = ['Finalizada', 'Anulada']

        if ( !codicionesValidas.includes(condicion) ) {
            const error = new Error('Condicion no Valida')
            return res.status(400).json({
                msg: error.message
            })
        }

        if ( condicion === 'Finalizada' && existeReserva.condicion !== 'Iniciada' ) {
            const error = new Error('La reserva debe estar Iniciada')
            return res.status(400).json({
                msg: error.message
            })
        }

        if ( condicion === 'Anulada' ) {
            const rolesValidos = ['ADMIN_ROLE', 'SUPER_ROLE']
            if ( !rolesValidos.includes(req.usuario.rol) ) {
                const error = new Error(`${req.usuario.nombre} no es administrador - No puede hacer esto`)
                return res.status(403).json({
                    msg: error.message
                })
            }

            if ( existeReserva.condicion !== 'Finalizada' ) {
                const error = new Error('La reserva debe estar Finalizada')
                return res.status(400).json({
                    msg: error.message
                })
            }

            if ( !observacion ) {
                const error = new Error('Debe Ingresar Observacion')
                return res.status(400).json({
                    msg: error.message
                })
            }
        }

        // if ( condicion === 'Anulada' && existeReserva.condicion !== 'Finalizada' ) {
        //     const error = new Error('La reserva debe estar Finalizada')
        //     return res.status(400).json({
        //         msg: error.message
        //     })
        // }

        // if ( condicion === 'Anulada' && !observacion ) {
        //     const error = new Error('Debe Ingresar Observacion')
        //     return res.status(400).json({
        //         msg: error.message
        //     })
        // }

        existeReserva.observacion = observacion || existeReserva.observacion;
        existeReserva.salida = new Date()
        // existeReserva.salida = Date.now();
        // existeReserva.salida = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"});
        existeReserva.condicion = condicion;
        await existeReserva.save();
        // Liberar Lote
        const lote = await Lote.findByIdAndUpdate(existeReserva.lote, { condicion: 'Disponible' }, { new: true })
        existeReserva.lote = lote;
        res.json(existeReserva);

    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }
}

const buscarReservaPatente = async ( req: Request, res: Response ) => {
    const { q = '', limite = 0, orden = '' }:QueryParams = req.query;

    try {
        const regex = new RegExp(q, 'i');
        const reservas = await Reserva.find({ patente: regex, condicion: 'Finalizada', estado: true })
            .populate([
                { path: 'lote', select: '-estado -__v'},
                { path: 'tarifa', select: '-estado -__v'}
            ])
            .select('-__v -estado')
            .sort({ createdAt: orden === 'desc' ? -1 : 1 })
            .limit(limite)

        const reservaMasPrecio = reservas.map( reserva => (
            {
                ...reserva.toObject(),
                tiempoTotal: calcularTiempo(reserva.entrada, reserva.salida ?? new Date()),
                precioTotal: calcularPrecio(
                    reserva.entrada, reserva.salida ?? new Date(), reserva.tarifa.precioBase,
                    reserva.tarifa.precioMinuto, reserva.tarifa.desdeMinuto
                )
            }
        ))

        // if ( condicion ) {
        //     const condicionesValidas = ['Iniciada', 'Finalizada', 'Pagada', 'Anulada']
        //     if (!condicionesValidas.includes(condicion)) {
        //         const error = new Error('Condicion no Valida')
        //         return res.status(400).json({
        //             msg: error.message
        //         })
        //     }
        // reservas = await reservas.find({ condicion: condicion })
        res.json(reservaMasPrecio)
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
    cambiarCondicion,
    buscarReservaPatente
}