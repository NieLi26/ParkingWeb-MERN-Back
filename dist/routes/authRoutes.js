"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const index_js_1 = require("../controllers/index.js");
const validarCamposMiddleware_js_1 = require("../middlewares/validarCamposMiddleware.js");
const index_js_2 = require("../middlewares/index.js");
const router = (0, express_1.Router)();
router.post('/login', [
    (0, express_validator_1.check)('email', 'El Correo es Obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('password', 'El Password es Obligatorio').not().isEmpty(),
    validarCamposMiddleware_js_1.validarCampos,
], index_js_1.login);
router.get('/perfil/token', index_js_2.validarJWT, index_js_1.perfil);
// router.get('/:id/reserva',[
//     check('id', 'No es un id valido').isMongoId(),
//     // TODO: Sacar la comprobacion del controlador
//     check('id').custom( existeUsuarioPorId ),
//     validarCampos
// ], buscarReserva)
exports.default = router;
//# sourceMappingURL=authRoutes.js.map