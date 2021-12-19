const express       = require('express');
const router        = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render("roadmap", {"session" : (req.session.auth ? req.session : undefined)});
});
  
router.get('*', (req, res) => {
    let url = req.url;
    res.render('roadmap/' + url.substr(1, url.length-1));
});

module.exports = router;