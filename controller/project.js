module.exports = {
    getProjectPage : (req, res) => {
        res.status(200).render("project", {"session" : (req.session.auth ? req.session : undefined)});
    },
}