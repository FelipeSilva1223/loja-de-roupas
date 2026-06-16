const express = require('express');

const cors = require('cors');

const path = require('path');

const conexao = require('./db');

const app = express();

const routers_produtos = require('./routers/routers_produtos');

const routers_pedidos = require('./routers/routers_pedidos');

const routers_auth = require('./routers/routers_auth')

app.use(express.static(path.join(__dirname, '../')));

app.use(cors());

app.use(express.json());

app.use('/estoque', routers_produtos);

app.use('/pedidos', routers_pedidos);

app.use('/', routers_auth);

app.use('/imagens', express.static(path.join(__dirname, 'imagens')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em PORT: ${PORT}`);
});