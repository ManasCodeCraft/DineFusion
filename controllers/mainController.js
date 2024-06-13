const path = require('path');

module.exports.mainpage = async function(req, res) {
    res.render('pages/home');
}

module.exports.menupage = async function(req, res) {
    res.render('pages/menu');
}

module.exports.editmenu = async function(req, res) {
    res.render('pages/editablemenu');
}

module.exports.managestaff = async function(req, res) {
    res.render('pages/staff');
}

module.exports.userFeedback = async function(req, res) {
    res.render('pages/userFeedback');
}

module.exports.GetFeedbackPage = async function(req, res) {
    res.render('pages/FeedbackPage');
}

module.exports.feedbackthanks = async function(req, res) {
    res.render('pages/feedbackThanks');
}

module.exports.getPaymentPage = async function(req, res) {
    res.render('pages/card');
}
