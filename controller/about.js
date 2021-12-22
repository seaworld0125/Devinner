module.exports = {
    getAboutPage : (req, res) => {
        res.status(200).render('about');
    },
}