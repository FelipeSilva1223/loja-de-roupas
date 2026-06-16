const conexao = require('../db');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


async function login(req, res) {
    const {email, senha, lembrar} = req.body;

    const sql = `
    SELECT * FROM usuarios
    WHERE email = ?;`

    const [resultado] = await conexao.query(sql, [email]);
    if (resultado.length === 0){
        return res.status(400).json({mensagem: "Usuário não encontrado"})
    };

    const usuario = resultado[0];

    const senhaCorreta = await bcrypt.compare(
        senha, usuario.senha_hash
    );

    if (!senhaCorreta) {
        return res.status(401).json({mensagem: "Senha incorreta"})
    };

    const token = jwt.sign({
        id: usuario.id,
        hierarquia: usuario.hierarquia
    },
    process.env.JWT_SECRET, 
    {
        expiresIn: lembrar ? '30d' : '12h'
    });
    res.json({
        sucesso: true,
        token: token,
        usuario: {
            id: usuario.id,
            hierarquia: usuario.hierarquia,
            nome: usuario.nome
        }
    });
};

module.exports = {login}