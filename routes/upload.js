const express    = require('express');
const router     = express.Router();
const controller = require('../controller/upload');

const upload = require('../Helpers/multerUploader');

router.post('/img', upload.single('file'), controller.uploadImage);

router.get('/project', controller.uploadProjectPage);

router.post('/project', upload.single('file'), controller.uploadProject);

module.exports = router;