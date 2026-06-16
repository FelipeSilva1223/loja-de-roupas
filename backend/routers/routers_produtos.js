const express = require('express');

const router = express.Router();

const upload = require('../middlewares/multerConfig');

const {
    verificarToken
} = require('../middlewares/midleware_auth');

const {
    listarProdutos,
    listarProdutosAdmin,
    detalhesProduto,
    apagarProduto,
    liquidarProduto,
    adicionarProduto,
    editarLiquidacao
} = require('../controllers/controllers_produtos');

router.get('/', listarProdutos);
router.get('/admin', verificarToken, listarProdutosAdmin);
router.get('/:id', detalhesProduto);

router.delete('/:id', verificarToken, apagarProduto);

router.patch('/liquidar/:id', verificarToken, liquidarProduto);
router.patch('/valor-liquidacao/:id', verificarToken, editarLiquidacao);

router.post('/', verificarToken,  upload.array('imagens', 5), adicionarProduto);

module.exports = router;