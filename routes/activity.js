const express       = require('express');
const router        = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render("activity", {"session" : (req.session.auth ? req.session : undefined)});
});
  
module.exports = router;