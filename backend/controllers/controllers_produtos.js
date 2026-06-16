const conexao = require('../db');
const path = require('path');
const fs = require('fs');

async function listarProdutos(req, res) {
    try {
        const sql = `
        SELECT
            p.id,
            p.nome,
            p.valor,
            p.em_liquidacao,
            p.valor_liquidado,
            pi.img_path
        FROM produtos p
        LEFT JOIN produto_imagens pi
        ON pi.id = (
            SELECT MIN(id)
            FROM produto_imagens
            WHERE produto_id = p.id
        )
        WHERE p.status = 'disponivel';
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

async function listarProdutosAdmin(req, res) {
    try {
        const select_todos = `
            SELECT
                produtos.id,
                produtos.nome,
                produtos.valor,
                produtos.detalhes,
                produtos.em_liquidacao,
                produtos.valor_liquidado,
                produtos.status,
                produto_imagens.img_path

            FROM produtos

            LEFT JOIN produto_imagens
            ON produtos.id = produto_imagens.produto_id 
            WHERE produtos.status <> 'indisponivel';
        `;

        const [resultado] = await conexao.query(select_todos);

        const lista_itens = [];

        resultado.forEach(item => {
            let produto = lista_itens.find(produto => produto.id === item.id);

            if (!produto) {
                produto = {
                    id: item.id,
                    nome: item.nome,
                    valor: item.valor,
                    detalhes: item.detalhes,
                    em_liquidacao: item.em_liquidacao,
                    valor_liquidado: item.valor_liquidado,
                    status: item.status,
                    imagens: []
                };

                lista_itens.push(produto);
            }

            if (item.img_path) {
                produto.imagens.push(item.img_path);
            };
        });

        return res.status(200).json(lista_itens);

    } catch (erro) {
        console.log(`[${new Date().toLocaleString('pt-BR')}] ${erro}`);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

async function detalhesProduto(req, res) {
    const id = Number(req.params.id);

    try {
        const sql = `
        SELECT
            produtos.id,
            produtos.nome,
            produtos.valor,
            produtos.detalhes,
            produtos.em_liquidacao,
            produtos.valor_liquidado,
            produtos.status,
            produto_imagens.img_path
        FROM produtos
        JOIN produto_imagens
        ON produtos.id = produto_imagens.produto_id
        WHERE produtos.id = ?;
        `;

        const [resultado] = await conexao.query(sql, [id]);
        if (resultado.length === 0) {
            return res.status(404).json({
                sucesso: false, 
                mensagem: "Produto não encontrado"});
        };

        const produto = {
            id: resultado[0].id,
            nome: resultado[0].nome,
            valor: resultado[0].valor,
            detalhes: resultado[0].detalhes,
            em_liquidacao: resultado[0].em_liquidacao,
            valor_liquidado: resultado[0].valor_liquidado,
            status: resultado[0].status,
            imagens: resultado.map(item => item.img_path)
        };

        return res.status(200).json(produto);

    } catch (erro) {
        console.log(`[${new Date().toLocaleString('pt-BR')}] ${erro}`);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

async function apagarProduto(req, res) {
    const { id } = req.params;

    try {
        const sqlDelete = `
            DELETE FROM produtos
            WHERE id = ?;
        `;

        const [resultado] = await conexao.query(sqlDelete, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado"});
        };

        const pasta_produto = path.join(__dirname, '..', 'imagens', 'produtos', String(id));

        if (fs.existsSync(pasta_produto)) {
            fs.rmSync(pasta_produto, { recursive: true, force: true });
        }

        console.log(`[${new Date().toLocaleString('pt-BR')}] Produto ID ${id} apagado`);

        return res.status(200).json({
            sucesso: true,
            mensagem: "Produto apagado com sucesso"
        });

    } catch (erro) {
        console.log(`[${new Date().toLocaleString('pt-BR')}] ${erro}`);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

async function liquidarProduto(req, res) {
    const id = Number(req.params.id);
    const bool = req.body.bool_liquidacao;

    try {
        const sql = `
        UPDATE produtos
        SET em_liquidacao = ?
        WHERE id = ?;`;

        const [resultado] = await conexao.query(sql, [bool, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado"});
        };

        console.log(`[${new Date().toLocaleString('pt-BR')}] Produto ID #${id} status liquidado alterado`);

        return res.status(200).json({
            sucesso: true,
            mensagem: "Produto liquidado com sucesso!"
        });

    } catch (erro) {
        console.log(`[${new Date().toLocaleString('pt-BR')}] ${erro}`);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

async function adicionarProduto(req, res) {
    const valor = Number(req.body.valor);
    const nome = req.body.nome?.trim();
    const detalhes = req.body.detalhes;
    const imagens = req.files;

    if (!imagens || imagens.length === 0) {
        return res.status (400).json({
            sucesso: false,
            mensagem: "Nehuma imagem enviada"});
    };

    if (!Number.isFinite(valor) || valor < 0) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "Valor inválido"
        });
    };
    
    if (!nome || nome.length < 2 || nome.length > 100){
        return res.status(400).json({
            sucesso: false,
            mensagem: "Nome inválido"
        });
    };

    try {
        const sqlProduto = `
        INSERT INTO produtos (nome, valor, detalhes, em_liquidacao, valor_liquidado, status)
        VALUES (?, ?, ?, ?, ?, ?)`;

        const [resultado] = await conexao.query(sqlProduto, [
            nome,
            valor,
            detalhes,
            0,
            0,
            "disponivel"
        ]);

        const produto_id = resultado.insertId;

        const pasta_produto = path.join(__dirname, '..', 'imagens', 'produtos', String(produto_id));
        fs.mkdirSync(pasta_produto, { recursive: true });

        const sqlProdImagens = `
        INSERT INTO produto_imagens(img_path, produto_id)
        VALUES (?, ?);`;

        for (const imagem of imagens) {
            const formato_img = path.extname(imagem.originalname);

            const novo_path = path.join(pasta_produto, imagem.filename + formato_img);
            fs.renameSync(imagem.path, novo_path);

            const db_path = `/imagens/produtos/${produto_id}/${imagem.filename}${formato_img}`;

            await conexao.query(sqlProdImagens, [db_path, produto_id]);
        };

        console.log(`[${new Date().toLocaleString('pt-BR')}] Produto ${nome} adicionado`);

        return res.status(201).json({
            sucesso: true,
            mensagem: `Produto ${nome} adicionado com sucesso!`
        });

    } catch (erro) {
        console.log(`[${new Date().toLocaleString('pt-BR')}] ${erro}`);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

async function editarLiquidacao(req, res) {
    const id = Number(req.params.id);
    const valor = Number(req.body.valor);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "ID inválido"
        });
    };

    if (!Number.isFinite(valor) || valor < 0) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "Valor inválido"
        });
    };
    try {
        const update = `
        UPDATE produtos
        SET valor_liquidado = ?
        WHERE id = ?;`

        const [resultado] = await conexao.query(update, [valor, id]);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado"
            });
        };

        console.log(`[${new Date().toLocaleString('pt-BR')}] Valor liquidado do produto ID #${id} mudado para ${valor}`);

        return res.status(200).json({
            sucesso: true,
            mensagem: "Valor alterado com sucesso!"
        });

    } catch (erro) {
        console.log(erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno"
        });
    };
};

module.exports = {
    listarProdutos,
    listarProdutosAdmin,
    detalhesProduto,
    apagarProduto,
    liquidarProduto,
    adicionarProduto,
    editarLiquidacao
};