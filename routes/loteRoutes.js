import { Router } from "express";
import { check } from "express-validator"; 
import { 
    obtenerLotes, 
    obtenerLote, 
    crearLote, 
    actualizarLote, 
    eliminarLote
} from "../controllers/index.js";
import { validarCampos } from "../middlewares/validarCamposMiddleware.js";
import { existeLotePorId } from "../helpers/index.js";

const router = Router();

router.get('/', obtenerLotes)
router.get('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeLotePorId ),
    validarCampos
], obtenerLote)
router.post('/', [
    check('numero', 'El Numero es obligatorio').not().isEmpty(),
    validarCampos,
    check('numero', 'El un numero debe ser un entero, y mayor a 0').isInt({ gt: 0 }),
    validarCampos
], crearLote)
router.put('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeLotePorId ),
    check('numero', 'El Numero es obligatorio').not().isEmpty(),
    validarCampos,
    check('numero', 'El un numero debe ser un entero, y mayor a 0').isInt({ gt: 0 }),
    validarCampos
], actualizarLote)
router.delete('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    // TODO: Sacar la comprobacion del controlador
    check('id').custom( existeLotePorId ),
], eliminarLote)


export default router;