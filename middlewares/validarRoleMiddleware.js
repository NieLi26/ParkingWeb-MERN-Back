import { response } from "express";


const esAdminRole = ( req, res = response, next ) => {

    if ( !req.usuario ) {
        const error = new Error('Se quiere verificar el role sin validar el token')
        return res.status(500).json({ msg: error.message })
    }

    const { rol, nombre } = req.usuario;

    if ( rol !== 'ADMIN_ROLE' ) {
        const error = new Error(`${nombre} no es administrador - No puede hacer esto`)
        return res.status(401).json({ msg: error.message });
    }

    next();
}

const tieneRole = ( ...roles ) => {
    return (req, res = response, next) => {
        if ( !req.usuario ) {
            const error = new Error('Se quiere verificar el role sin validar el token')
            return res.status(500).json({ msg: error.message })
        }

        if ( !roles.includes( req.usuario.rol ) ) {
            const error = new Error(`El Servicio requiere uno de estos roles ${roles}`)
            return res.status(401).json({ msg: error.message })
        }
        next();
    }
} 

export {
    esAdminRole,
    tieneRole
}