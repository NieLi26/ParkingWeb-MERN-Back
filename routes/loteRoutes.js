import { Router } from "express";
import { check } from "express-validator"; 
import { 
    obtenerLotes, 
    obtenerLote, 
    crearLote, 
    actualizarLote, 
    eliminarLote,
    buscarReserva
} from "../controllers/index.js";
import { validarCampos } from "../middlewares/validarCamposMiddleware.js";
import { existeLotePorId } from "../helpers/index.js";
import { validarJWT, tieneRole } from "../middlewares/index.js"

const router = Router();

router.get('/', validarJWT, obtenerLotes)
router.get('/:id',[
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeLotePorId ),
    validarCampos
], obtenerLote)

router.post('/', [
    validarJWT,
    tieneRole('SUPER_ROLE'),
    check('numero', 'El Numero es obligatorio').not().isEmpty(),
    validarCampos,
    check('numero', 'El un numero debe ser un entero, y mayor a 0').isInt({ gt: 0 }),
    validarCampos
], crearLote)

router.put('/:id',[
    validarJWT,
    tieneRole('SUPER_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeLotePorId ),
    validarCampos,
    check('numero', 'El Numero es obligatorio').not().isEmpty(),
    validarCampos,
    check('numero', 'El un numero debe ser un entero, y mayor a 0').isInt({ gt: 0 }),
    validarCampos
], actualizarLote)

router.delete('/:id',[
    validarJWT,
    tieneRole('SUPER_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeLotePorId ),
    validarCampos
], eliminarLote)

router.get('/:id/reserva',[
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeLotePorId ),
    validarCampos
], buscarReserva)


export default router;
