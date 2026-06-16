const bcrypt = require('bcrypt');

async function gerarHash(){
    const hash = await bcrypt.hash('@a1a2a3a45X', 10);
    console.log(hash);
};

gerarHash()
