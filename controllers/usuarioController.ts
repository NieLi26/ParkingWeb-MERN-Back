import { Request, Response } from "express";
import { Usuario } from "../models/index.js";
import { generarJWT } from "../helpers/index.js";

interface QueryParams {
    pageSize?: number,
    page?: number,
    q?: string;
    limite?: number;
    orden?: string;
}

interface UsuarioObject {
    nombre: string;
    comprobarPassword: Function;
}

interface RequestUsuario extends Request {
    usuario: UsuarioObject;
}

const obtenerUsuarios = async ( req: Request, res: Response ) => {
    const { page, pageSize = 5 }: QueryParams = req.query;
    const query = { estado: true, rol: { $ne: 'SUPER_ROLE' } };
    try {
        if ( page ) {
            const totalResults = await Usuario.countDocuments(query);

            const totalPages = Math.ceil(totalResults / pageSize);

            let adjustedPage = page;
            if (adjustedPage > totalPages) {
                // Si la página solicitada es mayor que el total de páginas, ajustarla al último
                adjustedPage = totalPages;
            }

            const startIndex = (adjustedPage  - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize - 1, totalResults - 1);
        
            const usuarios = await Usuario.find(query)
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
                usuarios,
                pagination: paginationInfo,
            });
        } 

        const usuarios = await Usuario.find(query)
        res.json(usuarios)
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }
}

const obtenerUsuario = async ( req: Request, res: Response ) => {
    const { id } = req.params;

    try {
        const existeUsuario = await Usuario.findById( id );
        if (!existeUsuario) {
            const error = new Error('Usuario no existe')
            return res.status(404).json({
                msg: error.message
            })
        }
        res.json(existeUsuario)
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }

}

const crearUsuario = async ( req: Request, res: Response ) => {
    let { nombre, email, password, rol } = req.body;

    try {
        // Comprobar existencia de usuario por correo
        const  existeCorreo = await Usuario.findOne({email: email.toLowerCase()});

        if ( existeCorreo ) {
            const error = new Error('Correo ya registrado');
            return res.status(400).json({ msg: error.message })
        }

        const usuario = new Usuario({ nombre, email, password, rol });
    
        // Guardar la DB
        await usuario.save();
    
        res.json(usuario)
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }

}

const actualizarUsuario = async ( req: RequestUsuario | Request, res: Response ) => {
    const { id } = req.params;
    let { password, estado, rol, ...resto } = req.body;

    try {

        const existeUsuario = await Usuario.findById( id );
        if (!existeUsuario) {
            const error = new Error('Usuario no existe')
            return res.status(404).json({
                msg: error.message
            })
        }

        if ( existeUsuario.rol === 'SUPER_ROLE' ) {
            const error = new Error(`${req.usuario.nombre} - No puede hacer esto`)
            return res.status(403).json({
                msg: error.message
            })
        }

        // Comprobar existencia de usuario por correo
        const  existeCorreo = await Usuario.findOne({email: resto.email.toLowerCase()});

        if ( existeCorreo && existeCorreo._id.toString() !== id ) {
            const error = new Error('Correo ya registrado');
            return res.status(400).json({ msg: error.message })
        }

        resto.email = resto.email.toLowerCase()

        const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });
    
        res.json(usuario)
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }

}

const eliminarUsuario = async ( req: RequestUsuario | Request, res: Response ) => {
    const { password = '' } = req.body;
    const { id } = req.params;

    try {
        const validPassword = await req.usuario.comprobarPassword( password );
        if ( !validPassword  ) {
            const error = new Error('Credenciales incorrectas')
            return res.status(403).json({msg: error.message});
        }

        const existeUsuario = await Usuario.findById( id );
        if (!existeUsuario) {
            const error = new Error('Usuario no existe')
            return res.status(404).json({
                msg: error.message
            })
        }

        if ( existeUsuario.rol === 'SUPER_ROLE' ) {
            const error = new Error(`${req.usuario.nombre} - No puede hacer esto`)
            return res.status(403).json({
                msg: error.message
            })
        }

        
        if ( existeUsuario.rol === 'ADMIN_ROLE' ) {
            if ( req.usuario.rol !== 'SUPER_ROLE' ) {
                const error = new Error(`${req.usuario.nombre} - No puede hacer esto`)
                return res.status(403).json({
                    msg: error.message
                })
            }
        }

        const usuario = await Usuario.findByIdAndUpdate( id, { estado: false }, { new: true } );

        res.json({
            msg: `Usuario ${usuario.nombre} Eliminado Correctamente`
        })
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }

}

const login = async ( req: Request, res: Response ) => {
    const { email, password } = req.body;

    try {
        const existeUsuario = await Usuario.findOne( { email } );
        if (!existeUsuario) {
            const error = new Error('Credenciales incorrectas')
            return res.status(404).json({msg: error.message});
        }

        // si el usuario esta activo
        if ( !existeUsuario.estado ) {
            const error = new Error('Tu Cuenta no se Encuentra Activa')
            return res.status(403).json({msg: error.message});
        }

        // Verificar la contrasena
        const validPassword = await existeUsuario.comprobarPassword( password );
        if ( !validPassword  ) {
            const error = new Error('Credenciales incorrectas')
            return res.status(403).json({msg: error.message});
        }

        // generar el JWT
        const token = await generarJWT( existeUsuario.id );

        res.json({
            ...existeUsuario.toJSON(),
            token
        });
        
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }
}

// const comprobarToken = async (req, res) => {
//     const { token } = req.params;

//     const  tokenValido = await Usuario.findOne({ token });

//     if ( tokenValido ) {
//         res.json({ msg: 'Token valido y el usuario existe' })
//     } else {
//         const error = new Error('Token no valido');
//         return res.status(404).json({ msg: error.message });
//     }
// }

// const nuevoPassword = async (req, res) => {
//     const { token } = req.params;
//     const { password } = req.body;

//     const  usuario = await Usuario.findOne({ token });

//     if ( usuario ) {
//         usuario.password = password;
//         usuario.token = '';
//         try {
//             await usuario.save();
//             res.json({ msg: 'Password Modificado Correctamente' })
//         } catch (error) {
//             console.log(error);
//         }
//     } else {
//         const error = new Error('Token no valido');
//         return res.status(404).json({ msg: error.message });
//     }
// };

const perfil = async ( req: RequestUsuario | Request, res: Response ) => {
    const { usuario } = req;
    res.json(usuario)
}

// const refreshToken = async (req, res) => {
//     const refreshToken = req.body.refreshToken;

//     // Verify the refresh token
//     if (refreshToken === validRefreshToken) {
//         // Generate a new access token
//         const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
//         res.json({ accessToken });
//     } else {
//         res.status(401).json({ message: "Invalid refresh token" });
//     }
// }

export {
    obtenerUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    login,
    perfil
}