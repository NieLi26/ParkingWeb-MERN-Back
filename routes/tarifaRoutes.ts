import { Router } from "express";
import { check } from "express-validator"; 
import { 
    obtenerTarifas,
    obtenerTarifa,
    crearTarifa,
    actualizarTarifa,
    eliminarTarifa
} from "../controllers/index";
import { validarCampos } from "../middlewares/validarCamposMiddleware";
import { existeTarifaPorId } from "../helpers/index";
import { validarJWT, tieneRole } from "../middlewares/index"

const router = Router();

router.get('/', [
    validarJWT
], obtenerTarifas)
router.get('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'SUPER_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeTarifaPorId ),
    validarCampos
], obtenerTarifa)
router.post('/', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'SUPER_ROLE'),
    check('nombre', 'El Nombre es obligatorio').not().isEmpty(),
    check('precioBase', 'El Precio Base es obligatorio').not().isEmpty(),
    check('precioMinuto', 'El Precio por Minuto es obligatorio').not().isEmpty(),
    check('desdeMinuto', 'El Desde que Minuto es obligatorio').not().isEmpty(),
    validarCampos
], crearTarifa)
router.put('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'SUPER_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeTarifaPorId ),
    validarCampos,
    check('nombre', 'El Nombre es obligatorio').not().isEmpty(),
    check('precioBase', 'El Precio Base es obligatorio').not().isEmpty(),
    check('precioMinuto', 'El Precio por Minuto es obligatorio').not().isEmpty(),
    check('desdeMinuto', 'El Desde que Minuto es obligatorio').not().isEmpty(),
    validarCampos
], actualizarTarifa)
router.post('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'SUPER_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeTarifaPorId ),
    validarCampos,
    check('password', 'La Contraseña es Obligatoria').not().isEmpty(),
    validarCampos
], eliminarTarifa)


export default router;