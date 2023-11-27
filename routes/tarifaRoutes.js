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


const router = Router();

router.get('/', obtenerTarifas)
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeTarifaPorId ),
    validarCampos
], obtenerTarifa)
router.post('/', [
    check('nombre', 'El Nombre es obligatorio').not().isEmpty(),
    check('precioBase', 'El Precio Base es obligatorio').not().isEmpty(),
    check('precioMinuto', 'El Precio por Minuto es obligatorio').not().isEmpty(),
    check('desdeMinuto', 'El Desde que Minuto es obligatorio').not().isEmpty(),
    validarCampos
], crearTarifa)
router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeTarifaPorId ),
    check('nombre', 'El Nombre es obligatorio').not().isEmpty(),
    check('precioBase', 'El Precio Base es obligatorio').not().isEmpty(),
    check('precioMinuto', 'El Precio por Minuto es obligatorio').not().isEmpty(),
    check('desdeMinuto', 'El Desde que Minuto es obligatorio').not().isEmpty(),
    validarCampos
], actualizarTarifa)
router.delete('/:id', 
    check('id', 'No es un id valido').isMongoId(),
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeTarifaPorId ),
    validarCampos
, eliminarTarifa)


export default router;