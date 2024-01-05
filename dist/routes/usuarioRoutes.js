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
], index_1.obtenerUsuarios);
router.get('/:id', [
    index_3.validarJWT,
    (0, index_3.tieneRole)('ADMIN_ROLE', 'SUPER_ROLE'),
    (0, express_validator_1.check)('id', 'No es un id valido').isMongoId(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('id').custom(index_2.existeUsuarioPorId),
    validarCamposMiddleware_1.validarCampos
], index_1.obtenerUsuario);
router.post('/', [
    index_3.validarJWT,
    (0, index_3.tieneRole)('ADMIN_ROLE', 'SUPER_ROLE'),
    (0, express_validator_1.check)('email', 'El Correo es Obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('password', 'El Password debe ser de mas de 6 letras').isLength({ min: 6 }),
    (0, express_validator_1.check)('nombre', 'El Nombre es Obligatorio').not().isEmpty(),
    // TODO: Sacar la comprobacion del controlador
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'OPERADOR_ROLE']),
    validarCamposMiddleware_1.validarCampos,
    (0, express_validator_1.check)('email', 'El correo no es valido').isEmail(),
    validarCamposMiddleware_1.validarCampos,
    (0, express_validator_1.check)('email').custom(index_2.emailOcupado),
    validarCamposMiddleware_1.validarCampos
], index_1.crearUsuario);
router.put('/:id', [
    index_3.validarJWT,
    (0, index_3.tieneRole)('ADMIN_ROLE', 'SUPER_ROLE'),
    (0, express_validator_1.check)('id', 'No es un id valido').isMongoId(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('id').custom(index_2.existeUsuarioPorId),
    validarCamposMiddleware_1.validarCampos,
    (0, express_validator_1.check)('email', 'El Correo es Obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('nombre', 'El Nombre es Obligatorio').not().isEmpty(),
    // TODO: Sacar la comprobacion del controlador
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'OPERADOR_ROLE']),
    validarCamposMiddleware_1.validarCampos,
    (0, express_validator_1.check)('email', 'El correo no es valido').isEmail(),
    validarCamposMiddleware_1.validarCampos,
], index_1.actualizarUsuario);
router.post('/:id', [
    index_3.validarJWT,
    (0, index_3.tieneRole)('ADMIN_ROLE', 'SUPER_ROLE'),
    (0, express_validator_1.check)('id', 'No es un id valido').isMongoId(),
    validarCamposMiddleware_1.validarCampos,
    // TODO: Sacar la comprobacion del controlador
    (0, express_validator_1.check)('id').custom(index_2.existeUsuarioPorId),
    validarCamposMiddleware_1.validarCampos,
    (0, express_validator_1.check)('password', 'La Contraseña es Obligatoria').not().isEmpty(),
    validarCamposMiddleware_1.validarCampos
], index_1.eliminarUsuario);
// router.post('/login', [
//     check('email', 'El Correo es Obligatorio').not().isEmpty(),
//     check('password', 'El Password es Obligatorio').not().isEmpty(),
//     validarCampos,
// ], login);
// router.get('/perfil/token', validarJWT, perfil);
// router.get('/:id/reserva',[
//     check('id', 'No es un id valido').isMongoId(),
//     // TODO: Sacar la comprobacion del controlador
//     check('id').custom( existeUsuarioPorId ),
//     validarCampos
// ], buscarReserva)
exports.default = router;
//# sourceMappingURL=usuarioRoutes.js.map