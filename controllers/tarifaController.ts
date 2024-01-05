import { Request, Response } from "express";
import { Tarifa } from "../models/index";

interface QueryParams {
    pageSize?: number,
    page?: number,
    q?: string;
    limite?: number;
    orden?: string;
}

interface RequestUsuario extends Request {
    usuario: {
        comprobarPassword: Function
    };
}

const obtenerTarifas = async ( req: Request, res: Response ) => {

    const { page, pageSize = 5 }: QueryParams = req.query;
    const query = { estado: true };
    try {
        if ( page ) {
            const totalResults = await Tarifa.countDocuments(query);

            const totalPages = Math.ceil(totalResults / pageSize);

            let adjustedPage = page;
            if (adjustedPage > totalPages) {
                // Si la página solicitada es mayor que el total de páginas, ajustarla al último
                adjustedPage = totalPages;
            }

            const startIndex = (adjustedPage  - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize - 1, totalResults - 1);
        
            const tarifas = await Tarifa.find(query)
                .sort('-createdAt')
                .skip(startIndex)
                .limit(pageSize);
        
        
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
                tarifas,
                pagination: paginationInfo,
            });
        } 

        const tarifas = await Tarifa.find(query)
        res.json(tarifas)
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }

}

const obtenerTarifa = async ( req: Request, res: Response ) => {
    const { id } = req.params;

    try {
        const existeTarifa = await Tarifa.findById( id );
        if (!existeTarifa) {
            const error = new Error('Tarifa no existe')
            return res.status(404).json({
                msg: error.message
            })
        }
        res.json(existeTarifa)
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }

}

const crearTarifa = async ( req: Request, res: Response ) => {
    let { nombre, precioBase, precioMinuto, desdeMinuto } = req.body;

    try {
        nombre = nombre.toLowerCase()
        const existeNombre = await Tarifa.findOne({ nombre });
        if ( existeNombre ) {
            const error = new Error(`La Tarifa con el nombre ${nombre}, ya existe`);
            return res.status(400).json({
                msg: error.message
            });
        }

        const existeCondiciones = await Tarifa.findOne({ precioBase, precioMinuto, desdeMinuto });
        if ( existeCondiciones ) {
            const error = new Error('Ya Existe una tarifa con las mismas condiciones');
            return res.status(400).json({
                msg: error.message
            });
        }

        const data = {
            nombre,
            precioBase,
            precioMinuto,
            desdeMinuto,
        }
        const tarifa = new Tarifa(data);
        await tarifa.save()
        res.status(201).json(tarifa);

    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }
}

const actualizarTarifa = async ( req: Request, res: Response ) => {
    const { id } = req.params;
    let { nombre, precioBase, precioMinuto, desdeMinuto } = req.body;
    
    try {

        const existeTarifa = await Tarifa.findById( id );
        if (!existeTarifa) {
            const error = new Error('Tarifa no existe')
            return res.status(404).json({
                msg: error.message
            })
        }

        nombre = nombre.toLowerCase()
        const existeNombre = await Tarifa.findOne({ nombre });
        if ( existeNombre && id !== existeNombre._id.toString() ) {
            const error = new Error(`La Tarifa con el nombre ${nombre}, ya existe`);
            return res.status(400).json({
                msg: error.message
            });
        }

        const existeCondiciones = await Tarifa.findOne({ precioBase, precioMinuto, desdeMinuto });

        if ( existeCondiciones && id !== existeCondiciones._id.toString()  ) {
            const error = new Error('Ya Existe una tarifa con las mismas condiciones');
            return res.status(400).json({
                msg: error.message
            });
        }

        const data = {
            nombre,
            precioBase,
            precioMinuto,
            desdeMinuto,
        }

        const tarifa = await Tarifa.findByIdAndUpdate( id, data, { new: true } )

        res.status(201).json(tarifa);
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }
}

const eliminarTarifa = async ( req: RequestUsuario, res: Response ) => {
    const { password = '' } = req.body;
    const { id } = req.params;

    try {
        const validPassword = await req.usuario.comprobarPassword( password );
        if ( !validPassword  ) {
            const error = new Error('Credenciales incorrectas')
            return res.status(403).json({msg: error.message});
        }

        const existeTarifa = await Tarifa.findById( id );
        if (!existeTarifa) {
            const error = new Error('Tarifa no existe')
            return res.status(404).json({
                msg: error.message
            })
        }

        const tarifa = await Tarifa.findByIdAndUpdate( id, { estado: false }, { new: true } );

        res.json({
            msg: `Tarifa ${tarifa?.nombre} Eliminada Correctamente`
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
    obtenerTarifas,
    obtenerTarifa,
    crearTarifa,
    actualizarTarifa,
    eliminarTarifa
}