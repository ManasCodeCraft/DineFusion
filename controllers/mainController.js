const path = require('path');

module.exports.mainpage = async function(req,res){
    res.sendFile(path.resolve(path.join(__dirname,'../public/home.html')))
}

module.exports.menupage = async function(req,res){
    res.sendFile(path.resolve(path.join(__dirname,'../public/menu.html')))
}

module.exports.editmenu = async function (req, res){
    res.sendFile(path.resolve(path.join(__dirname,'../public/editablemenu.html')))
}

module.exports.managestaff = async function (req, res){
    res.sendFile(path.resolve(path.join(__dirname,'../public/staff.html')))
}

module.exports.userFeedback = async function (req, res){
    res.sendFile(path.resolve(path.join(__dirname,'../public/userFeedback.html')))
}

module.exports.GetFeedbackPage = async function (req, res){
    res.sendFile(path.resolve(path.join(__dirname,'../public/FeedbackPage.html')))
}

module.exports.feedbackthanks = async function (req,res){
    res.sendFile(path.resolve(path.join(__dirname,'../public/feedbackThanks.html')))
}

module.exports.getPaymentPage = async function (req,res){
    res.sendFile(path.resolve(path.join(__dirname,'../public/card.html')))
}
