"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const index_1 = require("../controllers/index");
const validarCamposMiddleware_1 = require("../middlewares/validarCamposMiddleware");
const index_2 = require("../helpers/index");
const index_3 = require("../middlewares/index");
const router = (0, express_1.Router)();
router.get('/', index_3.validarJWT, index_1.obtenerReservas);
router.get('/:id', [
    index_3.validarJWT,
    (0, express_validator_1.check)('id', 'No es un id valido').isMongoId(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('id').custom(index_2.existeReservaPorId),
    validarCamposMiddleware_1.validarCampos
], index_1.obtenerReserva);
router.post('/', [
    index_3.validarJWT,
    (0, express_validator_1.check)('lote', 'El Lote es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('tarifa', 'La Tarifa es obligatoria').not().isEmpty(),
    (0, express_validator_1.check)('patente', 'La Patente es obligatoria').not().isEmpty(),
    validarCamposMiddleware_1.validarCampos
], index_1.crearReserva);
router.put('/condicion/:id', [
    index_3.validarJWT,
    (0, express_validator_1.check)('id', 'No es un id valido').isMongoId(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('id').custom(index_2.existeReservaPorId),
    validarCamposMiddleware_1.validarCampos,
    (0, express_validator_1.check)('condicion', 'La Condicion es obligatoria').not().isEmpty(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('condicion', 'No es una condicion valida').isIn(['Finalizada', 'Anulada']),
    validarCamposMiddleware_1.validarCampos
], index_1.cambiarCondicion);
router.delete('/:id', [
    index_3.validarJWT,
    (0, index_3.tieneRole)('ADMIN_ROLE', 'SUPER_ROLE'),
    (0, express_validator_1.check)('id', 'No es un id valido').isMongoId(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('id').custom(index_2.existeReservaPorId),
    validarCamposMiddleware_1.validarCampos
], index_1.eliminarReserva);
router.get('/buscar/patente', index_1.buscarReservaPatente);
exports.default = router;
//# sourceMappingURL=reservaRoutes.js.map