import { Router } from "express";
import { check } from "express-validator"; 
import { 
    login,
    perfil
} from "../controllers/index";
import { validarCampos } from "../middlewares/validarCamposMiddleware";
import { validarJWT, tieneRole } from "../middlewares/index"

const router = Router();

router.post('/login', [
    check('email', 'El Correo es Obligatorio').not().isEmpty(),
    check('password', 'El Password es Obligatorio').not().isEmpty(),
    validarCampos,
], login);

router.get('/perfil/token', validarJWT, perfil);

// router.get('/:id/reserva',[
//     check('id', 'No es un id valido').isMongoId(),
//     // TODO: Sacar la comprobacion del controlador
//     check('id').custom( existeUsuarioPorId ),
//     validarCampos
// ], buscarReserva)


export default router;
