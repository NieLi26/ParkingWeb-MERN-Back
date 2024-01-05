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
    index_3.validarJWT
], index_1.obtenerTarifas);
router.get('/:id', [
    index_3.validarJWT,
    (0, index_3.tieneRole)('ADMIN_ROLE', 'SUPER_ROLE'),
    (0, express_validator_1.check)('id', 'No es un id valido').isMongoId(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('id').custom(index_2.existeTarifaPorId),
    validarCamposMiddleware_1.validarCampos
], index_1.obtenerTarifa);
router.post('/', [
    index_3.validarJWT,
    (0, index_3.tieneRole)('ADMIN_ROLE', 'SUPER_ROLE'),
    (0, express_validator_1.check)('nombre', 'El Nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('precioBase', 'El Precio Base es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('precioMinuto', 'El Precio por Minuto es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('desdeMinuto', 'El Desde que Minuto es obligatorio').not().isEmpty(),
    validarCamposMiddleware_1.validarCampos
], index_1.crearTarifa);
router.put('/:id', [
    index_3.validarJWT,
    (0, index_3.tieneRole)('ADMIN_ROLE', 'SUPER_ROLE'),
    (0, express_validator_1.check)('id', 'No es un id valido').isMongoId(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('id').custom(index_2.existeTarifaPorId),
    validarCamposMiddleware_1.validarCampos,
    (0, express_validator_1.check)('nombre', 'El Nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('precioBase', 'El Precio Base es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('precioMinuto', 'El Precio por Minuto es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('desdeMinuto', 'El Desde que Minuto es obligatorio').not().isEmpty(),
    validarCamposMiddleware_1.validarCampos
], index_1.actualizarTarifa);
router.post('/:id', [
    index_3.validarJWT,
    (0, index_3.tieneRole)('ADMIN_ROLE', 'SUPER_ROLE'),
    (0, express_validator_1.check)('id', 'No es un id valido').isMongoId(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('id').custom(index_2.existeTarifaPorId),
    validarCamposMiddleware_1.validarCampos,
    (0, express_validator_1.check)('password', 'La Contraseña es Obligatoria').not().isEmpty(),
    validarCamposMiddleware_1.validarCampos
], index_1.eliminarTarifa);
exports.default = router;
//# sourceMappingURL=tarifaRoutes.js.map