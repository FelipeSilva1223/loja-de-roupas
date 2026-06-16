const express = require('express');

const router = express.Router();

const {
    login
} = require('../controllers/controllers_auth');
const { verificarToken } = require('../middlewares/midleware_auth');

router.post('/login', login);

router.get('/validar-token', verificarToken, (req, res) => {
    return res.sendStatus(200);
})

module.exports = router;