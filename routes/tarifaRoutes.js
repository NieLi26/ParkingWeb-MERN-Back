import { Router } from "express";
import { check } from "express-validator"; 
import { 
    obtenerTarifas,
    obtenerTarifa,
    crearTarifa,
    actualizarTarifa,
    eliminarTarifa
} from "../controllers/index.js";
import { validarCampos } from "../middlewares/validarCamposMiddleware.js";
import { existeTarifaPorId } from "../helpers/index.js";
import { validarJWT } from "../middlewares/index.js"

const router = Router();

router.get('/', validarJWT, obtenerTarifas)
router.get('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeTarifaPorId ),
    validarCampos
], obtenerTarifa)
router.post('/', [
    validarJWT,
    check('nombre', 'El Nombre es obligatorio').not().isEmpty(),
    check('precioBase', 'El Precio Base es obligatorio').not().isEmpty(),
    check('precioMinuto', 'El Precio por Minuto es obligatorio').not().isEmpty(),
    check('desdeMinuto', 'El Desde que Minuto es obligatorio').not().isEmpty(),
    validarCampos
], crearTarifa)
router.put('/:id', [
    validarJWT,
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
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeTarifaPorId ),
    validarCampos
], eliminarTarifa)


export default router;