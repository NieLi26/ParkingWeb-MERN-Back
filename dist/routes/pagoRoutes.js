"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const index_1 = require("../controllers/index");
const validarCamposMiddleware_1 = require("../middlewares/validarCamposMiddleware");
const index_2 = require("../helpers/index");
const index_3 = require("../middlewares/index");
const router = (0, express_1.Router)();
router.get('/', [
    index_3.validarJWT,
    (0, index_3.tieneRole)('ADMIN_ROLE', 'SUPER_ROLE'),
], index_1.obtenerPagos);
router.get('/:id', [
    index_3.validarJWT,
    (0, index_3.tieneRole)('ADMIN_ROLE', 'SUPER_ROLE'),
    (0, express_validator_1.check)('id', 'No es un id valido').isMongoId(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('id').custom(index_2.existePagoPorId),
    validarCamposMiddleware_1.validarCampos
], index_1.obtenerPago);
router.post('/', [
    index_3.validarJWT,
    (0, express_validator_1.check)('reserva', 'El Nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('metodoPago', 'No es un Metodo de Pago Valido').isIn(['Efectivo', 'Transferencia', 'Debito', 'Credito']),
    validarCamposMiddleware_1.validarCampos
], index_1.crearPago);
router.put('/:id', [
    index_3.validarJWT,
    (0, index_3.tieneRole)('ADMIN_ROLE', 'SUPER_ROLE'),
    (0, express_validator_1.check)('id', 'No es un id valido').isMongoId(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('id').custom(index_2.existePagoPorId),
    validarCamposMiddleware_1.validarCampos,
    (0, express_validator_1.check)('total', 'El total es obligatorio').not().isEmpty(),
    validarCamposMiddleware_1.validarCampos,
    (0, express_validator_1.check)('total', 'El Valor debe ser un numero, y mayor a 0').isInt({ gt: 0 }),
    (0, express_validator_1.check)('metodoPago', 'El metodo de pago es obligatorio').not().isEmpty(),
    validarCamposMiddleware_1.validarCampos,
    (0, express_validator_1.check)('metodoPago', 'No es un Metodo de Pago Valido').isIn(['Efectivo', 'Transferencia', 'Debito', 'Credito']),
    validarCamposMiddleware_1.validarCampos
], index_1.actualizarPago);
router.delete('/:id', [
    index_3.validarJWT,
    (0, index_3.tieneRole)('ADMIN_ROLE', 'SUPER_ROLE'),
    (0, express_validator_1.check)('id', 'No es un id valido').isMongoId(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('id').custom(index_2.existePagoPorId),
    validarCamposMiddleware_1.validarCampos
], index_1.eliminarPago);
exports.default = router;
//# sourceMappingURL=pagoRoutes.js.map