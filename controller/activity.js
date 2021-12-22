module.exports = {
    getActivityPage : (req, res) => {
        res.status(200).render("activity", {"session" : (req.session.auth ? req.session : undefined)});
    },
}