const conexao = require('../db');

async function criarPedido(req, res) {
    const pedido = req.body;
    let total = 0;
    const ids = [];
        pedido.itens.forEach(item => {
            ids.push(item.id)
    });

    const select_produtos = `
    SELECT id, valor, em_liquidacao, valor_liquidado
    FROM produtos
    WHERE id IN (?);`;

    const [produtos] = await conexao.query(select_produtos, [ids]);
    produtos.forEach(produto => {
        total += (Number(produto.em_liquidacao === 1) ? Number(produto.valor_liquidado) : Number(produto.valor))
    })
    total += pedido.frete;
    try {
        const sqlPedido = `
        INSERT INTO pedidos(nome_cliente, telefone_cliente, forma_entrega, endereco, frete, forma_pagamento, parcelas, total, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

        const [resultado] = await conexao.query(sqlPedido, [
            pedido.nomeCliente,
            pedido.telefone,
            pedido.modoEntrega,
            pedido.endereco,
            pedido.frete,
            pedido.formaPagamento,
            pedido.parcelas,
            total,
            pedido.status
        ]);

        const id_pedido = resultado.insertId;

        const sqlItens = `
        INSERT INTO pedido_itens(pedido_id, produto_id)
        VALUES (?, ?);`;

        const sqlStatus = `
        UPDATE produtos
        SET status = 'reservado'
        WHERE id = ?;`;

        for (const item of pedido.itens) {
            await conexao.query(sqlItens, [id_pedido, item.id]);
            await conexao.query(sqlStatus, [item.id]);
        };

        console.log(`[${new Date().toLocaleString('pt-BR')}] Pedido confirmado ID #${id_pedido}`);

        return res.status(201).json({
            sucesso: true,
            mensagem: "Pedido recebido com sucesso!",
            pedido_id: id_pedido,
            pedido: pedido
        });

    } catch (erro) {
        console.log(`[${new Date().toLocaleString('pt-BR')}] ${erro}`);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

async function verPedidos(req, res) {
    try {
        const sql = `
        SELECT
            pedidos.id,
            pedidos.nome_cliente,
            pedidos.telefone_cliente,
            pedidos.criado_em,
            pedidos.status
        FROM pedidos
        WHERE pedidos.status = 'pendente';
        `;

        const [resultado] = await conexao.query(sql);

        return res.status(200).json(resultado);

    } catch (erro) {
        console.log(`[${new Date().toLocaleString('pt-BR')}] ${erro}`);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

async function verPedido(req, res) {
    const id = Number(req.params.id);

    try {
        const sql = `
        SELECT
            pedidos.id AS pedido_id,
            pedidos.nome_cliente,
            pedidos.telefone_cliente,
            pedidos.criado_em,
            pedidos.total,
            pedidos.forma_pagamento,
            pedidos.forma_entrega,
            pedidos.endereco,
            pedidos.status,

            produtos.id AS produto_id,
            produtos.nome

        FROM pedidos

        JOIN pedido_itens
        ON pedidos.id = pedido_itens.pedido_id

        JOIN produtos
        ON pedido_itens.produto_id = produtos.id

        WHERE pedidos.id = ?;
        `;

        const [resultado] = await conexao.query(sql, [id]);

        return res.status(200).json(resultado);

    } catch (erro) {
        console.log(`[${new Date().toLocaleString('pt-BR')}] ${erro}`);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

async function confirmarPedido(req, res) {
    const id = req.params.id;

    try {
        const select = `
        SELECT 
            forma_entrega 
        FROM pedidos
        WHERE id = ?;`;

        const [resposta] = await conexao.query(select, [id]);

        if (resposta.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Pedido não encontrado"
            });
        };

        const forma_entrega = resposta[0].forma_entrega;

        const status = (
            forma_entrega === 'retirada'
                ? 'aguardando_retirada'
                : 'confirmado'
        );

        const update = `
        UPDATE pedidos
        SET status = ?
        WHERE id = ?;`;

        const [resultado] = await conexao.query(update, [status, id]);

        console.log(`[${new Date().toLocaleString('pt-BR')}] Pedido ID #${id} confirmado`);

        return res.status(200).json({
            sucesso: true,
            mensagem: "Pedido confirmado"
        });

    } catch (erro) {
        console.log(`[${new Date().toLocaleString('pt-BR')}] ${erro}`);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

async function cancelarPedido(req, res) {
    const id = req.params.id;

    try {
        const select = `
        SELECT
            produto_id,
            pedido_id
        FROM pedido_itens
        WHERE pedido_id = ?;`

        const updateStatus = `
        UPDATE produtos
        SET status = ?
        WHERE id = ?;`

        const [resultado_select] = await conexao.query(select, [id]);
        for (const item of resultado_select) {
            await conexao.query(updateStatus, ['disponivel', item.produto_id])
        };

        const updatePedido = `
        UPDATE pedidos
        SET status = ?
        WHERE id = ?;`;

        const [resultado] = await conexao.query(updatePedido, ['cancelado', id]);

        console.log(`[${new Date().toLocaleString('pt-BR')}] Pedido ID #${id} cancelado`);

        return res.status(200).json({
            sucesso: true,
            mensagem: "Pedido cancelado"
        });

    } catch (erro) {
        console.log(`[${new Date().toLocaleString('pt-BR')}] ${erro}`);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

async function verEntregas(req, res) {
    const forma_entrega = req.params.forma_entrega;

    try {
        const sql = `
        SELECT
            pedidos.id,
            pedidos.nome_cliente,
            pedidos.telefone_cliente
            ${(forma_entrega === 'entrega' ? ', pedidos.endereco' : '')}
        FROM pedidos
        WHERE forma_entrega = ?
        AND status = ?;`;

        const [resultado] = await conexao.query(sql, [
            forma_entrega,
            (forma_entrega === 'entrega'
                ? 'confirmado'
                : 'aguardando_retirada')
        ]);

        return res.status(200).json(resultado);

    } catch (erro) {
        console.log(`[${new Date().toLocaleString('pt-BR')}] ${erro}`);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

async function finalizarPedidos(req, res) {
    const ids = req.body.ids;

    try {
        const update_pedido = `
        UPDATE
            pedidos
        SET status = ?
        WHERE id = ?`;

        const update_produtos = `
            UPDATE produtos
            INNER JOIN pedido_itens
            ON pedido_itens.produto_id = produtos.id
            SET produtos.status = ?
            WHERE pedido_itens.pedido_id = ?`;
        
        for (const pedidoId of ids) {
            await conexao.query(update_pedido, ['finalizado', pedidoId]);
            await conexao.query(update_produtos, ['indisponivel', pedidoId])
        };

        console.log(`[${new Date().toLocaleString('pt-BR')}] Pedidos ${ids} finalizados`);

        return res.status(200).json({
            sucesso: true,
            mensagem: "Pedido finalizado com sucesso!!"
        });

    } catch (erro) {
        console.log(`[${new Date().toLocaleString('pt-BR')}] ${erro}`);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

async function verHistorico(req, res) {
    const pagina = Number(req.query.page) || 1;
    const limite = Number(req.query.limit) || 10;

    const offset = (pagina - 1) * limite;

    try {
        const sql = `
        SELECT
            pedidos.id,
            pedidos.nome_cliente,
            pedidos.criado_em,
            pedidos.status
        FROM pedidos
        
        WHERE pedidos.status = ?
        OR pedidos.status = ?
        
        ORDER BY pedidos.criado_em DESC
        
        LIMIT ? OFFSET ?;
        `;

        const [resultado] = await conexao.query(sql, [
            'finalizado',
            'cancelado',
            limite,
            offset,
        ]);

        const select_total = `
        SELECT COUNT(*) AS total
        FROM pedidos
        WHERE status IN ('finalizado', 'cancelado');`
        
        const [[{total}]] = await conexao.query(select_total);

        const totalPaginas = Math.ceil(total / limite);

        return res.status(200).json({
            pedidos: resultado,
            totalPaginas
        });

    } catch (erro) {
        console.log(`[${new Date().toLocaleString('pt-BR')}] ${erro}`);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

async function buscarFretes(req, res) {
    try {
        const select = `
        SELECT bairro, valor
        FROM fretes`;

        const [resultado] = await conexao.query(select);

        return res.status(200).json(resultado);

    } catch (erro) {
        console.log(`[${new Date().toLocaleString('pt-BR')}] ${erro}`);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

async function adicionarFrete(req, res) {
    const bairro = req.body.bairro?.trim();
    const valor = req.body.valor;

    if (!bairro || !Number.isFinite(Number(valor)) || Number(valor) < 0) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "Bairro ou valor inválido"
        });
    };

    try {
        const insert = `
        INSERT INTO fretes(bairro, valor)
        VALUES (?, ?);`;

        const [resposta] = await conexao.query(insert, [bairro, valor]);

        console.log(`[${new Date().toLocaleString('pt-BR')}] Bairro ${bairro} adicionado, valor: ${valor}`);

        return res.status(200).json({
            sucesso: true,
            mensagem: "Bairro adicionado com sucesso!"
        });

    } catch (erro){
        console.log(`[${new Date().toLocaleString('pt-BR')}] ${erro}`);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

async function editarFrete(req, res) {
    const bairro = req.body.bairro?.trim();
    const valor = req.body.valor;

    if (!bairro || !Number.isFinite(Number(valor)) || Number(valor) < 0) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "Bairro ou valor inválido"
        });
    };

    try {
        const update = `
        UPDATE fretes
        SET valor = ?
        WHERE bairro = ?;`;

        const [resultado] = await conexao.query(update, [valor, bairro]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Bairro não encontrado"
            });
        };

        console.log(`[${new Date().toLocaleString('pt-BR')}] Valor de ${bairro} alterado, novo valor: ${valor}`);

        return res.status(200).json({
            sucesso: true,
            mensagem: "Valor de frete alterado com sucesso!"
        });
    } catch (erro) {
        console.log(`[${new Date().toLocaleString('pt-BR')}] ${erro}`);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

module.exports = {
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
};