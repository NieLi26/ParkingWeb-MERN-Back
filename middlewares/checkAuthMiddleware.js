import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

const checkAuth = async (req, res, next) => {
    let token;

    if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const { uid } = jwt.verify(token, process.env.JWT_SECRET);

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
            const err = new Error('Error Inesperado, intente nuevamente')
            return res.status(500).json({
                msg: err.message
            }) 
        }
    }
    
    if ( !token ) {
        const error = new Error('No Hay Token en la Peticion en cehckauth');
        return res.status(401).json({ msg: error.message })
    }

    // next();
}

export default checkAuth