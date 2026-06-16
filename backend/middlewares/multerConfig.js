const multer = require('multer');

const upload = multer({
    dest: 'imagens/temp',
    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const tiposPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (tiposPermitidos.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Formato de arquivo inválido.'));
        }
    }
});

module.exports = upload;