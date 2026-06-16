const express = require('express');

const router = express.Router();

const {
    verificarToken
} = require('../middlewares/midleware_auth');

const {
    criarPedido,
    verPedidos,
    verPedido,
    verEntregas,
    confirmarPedido,
    finalizarPedidos,
    cancelarPedido,
    verHistorico,
    adicionarFrete,
    buscarFretes,
    editarFrete
} = require('../controllers/controllers_pedidos');

router.get('/fretes', buscarFretes);
router.get('/pendentes', verificarToken, verPedidos);
router.get('/entregas/:forma_entrega', verificarToken, verEntregas)
router.get('/historico', verificarToken, verHistorico);
router.get('/historico/:id', verificarToken, verPedido);
router.get('/pendentes/:id', verificarToken, verPedido);

router.post('/', criarPedido);
router.post('/fretes', verificarToken, adicionarFrete);

router.patch('/fretes', verificarToken, editarFrete);
router.patch('/finalizar', verificarToken, finalizarPedidos);
router.patch('/confirmar/:id', verificarToken, confirmarPedido);
router.patch('/cancelar/:id', verificarToken, cancelarPedido);

module.exports = router;