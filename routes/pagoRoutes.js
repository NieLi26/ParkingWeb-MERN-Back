import { Router } from "express";
import { check } from "express-validator"; 
import { 
    obtenerPagos, 
    obtenerPago, 
    crearPago, 
    actualizarPago, 
    eliminarPago
} from "../controllers/index.js";
import { validarCampos } from "../middlewares/validarCamposMiddleware.js";
import { existePagoPorId } from "../helpers/index.js";

const router = Router();

router.get('/', obtenerPagos)
router.get('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existePagoPorId ),
    validarCampos
], obtenerPago)
router.post('/',[
    check('reserva', 'El Nombre es obligatorio').not().isEmpty(),
    check('metodoPago', 'No es un Metodo de Pago Valido').isIn(['Efectivo', 'Transferencia', 'Debito', 'Credito']),
    validarCampos
], crearPago)
router.put('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existePagoPorId ),
    check('total', 'El total es obligatorio').not().isEmpty(),
    validarCampos,
    check('total', 'El Valor debe ser un numero, y mayor a 0').isInt({ gt: 0 }),
    check('metodoPago', 'El metodo de pago es obligatorio').not().isEmpty(),
    validarCampos,
    check('metodoPago', 'No es un Metodo de Pago Valido').isIn(['Efectivo', 'Transferencia', 'Debito', 'Credito']),
    validarCampos
],actualizarPago)
router.delete('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existePagoPorId ),
    validarCampos
], eliminarPago)

export default router;