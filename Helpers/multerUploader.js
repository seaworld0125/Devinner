const multer = require('multer');
const path   = require('path');

const upload = multer({ 
    limits: { fileSize: 5 * 1024 * 1024 },
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/../public/img/upload');
        },
        filename: function (req, file, cb) {
            cb(null, new Date().valueOf() + path.extname(file.originalname));
        }
    }),
});

module.exports = upload;