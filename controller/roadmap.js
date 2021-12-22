module.exports = {
    getRoadmapPage : (req, res) => {
        res.status(200).render("roadmap", {"session" : (req.session.auth ? req.session : undefined)});
    },
    getCardPage : (req, res) => {
        let url = req.url;
        res.status(200).render('roadmap/' + url.substr(1, url.length-1));
    },
}