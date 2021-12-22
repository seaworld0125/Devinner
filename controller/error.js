module.exports = {
    getErrorPage : (req, res) => {
        res.status(req.params.err).render('error', {'error' : req.params.err});
    },
}