import { Router } from "express";
import { check } from "express-validator";
import { 
    obtenerReservas, 
    obtenerReserva, 
    crearReserva, 
    actualizarReserva, 
    eliminarReserva,
    cambiarCondicion,
    buscarReservaPatente
} from "../controllers/index.js";
import { validarCampos } from "../middlewares/validarCamposMiddleware.js";
import { existeReservaPorId } from "../helpers/index.js";

const router = Router();

router.get('/', obtenerReservas)
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeReservaPorId ),
    validarCampos
], obtenerReserva)
router.post('/', [
    check('lote', 'El Lote es obligatorio').not().isEmpty(),
    check('tarifa', 'La Tarifa es obligatoria').not().isEmpty(),
    check('patente', 'La Patente es obligatoria').not().isEmpty(),
    validarCampos
] ,crearReserva)
router.put('/condicion/:id', [
    check('id', 'No es un id valido').isMongoId(),
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeReservaPorId ),
    check('condicion', 'La Condicion ex obligatoria').not().isEmpty(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('condicion', 'No es una condicion valida').isIn(['Finalizada', 'Anulada']),
    validarCampos
], cambiarCondicion)
router.delete('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeReservaPorId ),
    validarCampos
], eliminarReserva)
router.get('/buscar/patente', buscarReservaPatente)


export default router;