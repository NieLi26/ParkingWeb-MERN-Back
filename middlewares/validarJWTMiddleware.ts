import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index';

const validarJWT = async ( req: Request, res: Response, next: Function ) => {
    let token: string = '';
    
    if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const { uid } = jwt.verify(token, process.env.JWT_SECRET || '');

            // leer el usuario que corresponde al uid
            const usuario = await Usuario.findById(uid)

            // SI el usuario no existe
            if ( !usuario ) {
                const error = new Error('Token no valido - usuario no existe en DB')
                return res.status(401).json({ msg: error.message })
            }

            // verificar si el uid tiene estado true
            if ( !usuario.estado ) {
                const error = new Error('Token no valido - usuario no habilitado')
                return res.status(401).json({ msg: error.message })
            }

            // req.usuario = await Usuario.findById(uid).select('-password -confirmado -confirmado -token -createdAt -updatedAt -__v');
            req.usuario = usuario;
            // console.log(req.usuario);
            next();
        } catch (error) {
            console.log(error);
            const err = new Error('Token Expirado')
            return res.status(500).json({
                msg: err.message
            }) 
        }
    }
    
    if ( !token ) {
        const error = new Error('No Hay Token en la Peticion jwt');
        return res.status(401).json({ msg: error.message })
    }

    // next();
}


export {
    validarJWT
}