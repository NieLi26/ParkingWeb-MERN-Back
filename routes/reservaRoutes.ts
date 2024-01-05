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
} from "../controllers/index";
import { validarCampos } from "../middlewares/validarCamposMiddleware";
import { existeReservaPorId } from "../helpers/index";
import { validarJWT, tieneRole } from "../middlewares/index"

const router = Router();

router.get('/', validarJWT, obtenerReservas)
router.get('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeReservaPorId ),
    validarCampos
], obtenerReserva)
router.post('/', [
    validarJWT,
    check('lote', 'El Lote es obligatorio').not().isEmpty(),
    check('tarifa', 'La Tarifa es obligatoria').not().isEmpty(),
    check('patente', 'La Patente es obligatoria').not().isEmpty(),
    validarCampos
] ,crearReserva)
router.put('/condicion/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeReservaPorId ),
    validarCampos,
    check('condicion', 'La Condicion es obligatoria').not().isEmpty(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('condicion', 'No es una condicion valida').isIn(['Finalizada', 'Anulada']),
    validarCampos
], cambiarCondicion)
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'SUPER_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeReservaPorId ),
    validarCampos
], eliminarReserva)
router.get('/buscar/patente', buscarReservaPatente)


export default router;