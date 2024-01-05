import { Router } from "express";
import { check } from "express-validator"; 
import { 
    obtenerUsuarios, 
    obtenerUsuario, 
    crearUsuario, 
    actualizarUsuario, 
    eliminarUsuario,
    login,
    perfil
} from "../controllers/index";
import { validarCampos } from "../middlewares/validarCamposMiddleware";
import { existeUsuarioPorId, emailOcupado } from "../helpers/index";
import { validarJWT, tieneRole } from "../middlewares/index"

const router = Router();

router.get('/', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'SUPER_ROLE'),
], obtenerUsuarios);

router.get('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE', 'SUPER_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], obtenerUsuario);

router.post('/', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'SUPER_ROLE'),
    check('email', 'El Correo es Obligatorio').not().isEmpty(),
    check('password', 'El Password debe ser de mas de 6 letras').isLength({min: 6}),
    check('nombre', 'El Nombre es Obligatorio').not().isEmpty(),
    // TODO: Sacar la comprobacion del controlador
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'OPERADOR_ROLE']),
    validarCampos,
    check('email', 'El correo no es valido').isEmail(),
    validarCampos,
    check('email').custom( emailOcupado ),
    validarCampos
], crearUsuario)

router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE', 'SUPER_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeUsuarioPorId ),
    validarCampos,
    check('email', 'El Correo es Obligatorio').not().isEmpty(),
    check('nombre', 'El Nombre es Obligatorio').not().isEmpty(),
    // TODO: Sacar la comprobacion del controlador
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'OPERADOR_ROLE']),
    validarCampos,
    check('email', 'El correo no es valido').isEmail(),
    validarCampos,
], actualizarUsuario)

router.post('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE', 'SUPER_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeUsuarioPorId ),
    validarCampos,
    check('password', 'La Contraseña es Obligatoria').not().isEmpty(),
    validarCampos
], eliminarUsuario)

// router.post('/login', [
//     check('email', 'El Correo es Obligatorio').not().isEmpty(),
//     check('password', 'El Password es Obligatorio').not().isEmpty(),
//     validarCampos,
// ], login);

// router.get('/perfil/token', validarJWT, perfil);

// router.get('/:id/reserva',[
//     check('id', 'No es un id valido').isMongoId(),
//     // TODO: Sacar la comprobacion del controlador
//     check('id').custom( existeUsuarioPorId ),
//     validarCampos
// ], buscarReserva)


export default router;
