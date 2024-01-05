"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const index_1 = require("../controllers/index");
const validarCamposMiddleware_1 = require("../middlewares/validarCamposMiddleware");
const index_2 = require("../helpers/index");
const index_3 = require("../middlewares/index");
const router = (0, express_1.Router)();
router.get('/', index_3.validarJWT, index_1.obtenerLotes);
router.get('/:id', [
    index_3.validarJWT,
    (0, express_validator_1.check)('id', 'No es un id valido').isMongoId(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('id').custom(index_2.existeLotePorId),
    validarCamposMiddleware_1.validarCampos
], index_1.obtenerLote);
router.post('/', [
    index_3.validarJWT,
    (0, index_3.tieneRole)('SUPER_ROLE'),
    (0, express_validator_1.check)('numero', 'El Numero es obligatorio').not().isEmpty(),
    validarCamposMiddleware_1.validarCampos,
    (0, express_validator_1.check)('numero', 'El un numero debe ser un entero, y mayor a 0').isInt({ gt: 0 }),
    validarCamposMiddleware_1.validarCampos
], index_1.crearLote);
router.put('/:id', [
    index_3.validarJWT,
    (0, index_3.tieneRole)('SUPER_ROLE'),
    (0, express_validator_1.check)('id', 'No es un id valido').isMongoId(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('id').custom(index_2.existeLotePorId),
    validarCamposMiddleware_1.validarCampos,
    (0, express_validator_1.check)('numero', 'El Numero es obligatorio').not().isEmpty(),
    validarCamposMiddleware_1.validarCampos,
    (0, express_validator_1.check)('numero', 'El un numero debe ser un entero, y mayor a 0').isInt({ gt: 0 }),
    validarCamposMiddleware_1.validarCampos
], index_1.actualizarLote);
router.delete('/:id', [
    index_3.validarJWT,
    (0, index_3.tieneRole)('SUPER_ROLE'),
    (0, express_validator_1.check)('id', 'No es un id valido').isMongoId(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('id').custom(index_2.existeLotePorId),
    validarCamposMiddleware_1.validarCampos
], index_1.eliminarLote);
router.get('/:id/reserva', [
    index_3.validarJWT,
    (0, express_validator_1.check)('id', 'No es un id valido').isMongoId(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('id').custom(index_2.existeLotePorId),
    validarCamposMiddleware_1.validarCampos
], index_1.buscarReserva);
exports.default = router;
//# sourceMappingURL=loteRoutes.js.map