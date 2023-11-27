import { request, response } from "express";
import { Tarifa } from "../models/index.js";

const obtenerTarifas = async ( req, res = response ) => {

    try {
        const tarifas = await Tarifa.find({ estado: true })
        res.json(tarifas)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error.message
        })
    }

}

const obtenerTarifa = async ( req, res = response ) => {
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
        res.status(500).json({
            msg: error.message
        })
    }

}

const crearTarifa = async ( req, res = response ) => {
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

const actualizarTarifa = async ( req, res = response ) => {
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

const eliminarTarifa = async ( req, res = response ) => {
    const { id } = req.params;

    try {
        const existeTarifa = await Tarifa.findById( id );
        if (!existeTarifa) {
            const error = new Error('Tarifa no existe')
            return res.status(404).json({
                msg: error.message
            })
        }

        const tarifa = await Tarifa.findByIdAndUpdate( id, { estado: false }, { new: true } );

        res.json({
            msg: `Tarifa ${tarifa.nombre} Eliminada Correctamente`
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