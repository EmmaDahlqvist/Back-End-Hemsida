const fs = require('fs');
var express = require('express');
const { runInNewContext } = require('vm');
var router = express.Router();

/* GET */
router.get('/', function(req, res, next) {
    res.render('login');
});

/* POST */
router.post('/', function(req, res, next){
    
    var users = null;
    
    try {
        var rawData = fs.readFileSync('users.json');
        users = JSON.parse(rawData);
    } catch (err) {
        res.send('Error when retrieving from database');
        return;
    }
    
    //gå igenom alla users
    for (const user of users) {
        var userNameIsEqual = user.username == req.body.username;
        var passwordIsEqual = user.password == req.body.password;

        if (userNameIsEqual && passwordIsEqual) {

            req.session.userid = user.username;
            req.session.authority = user.authority;
            
            if(user.authority == "member"){
                res.redirect("/");
                return;
            } else if(user.authority == "admin") {
                res.redirect("/admin");
                return;
            }
        }
        
    }

    //ingen user hittades
    res.render("login", {errorMsg: "Fel användarnamn eller lösenord!"});
});

module.exports = router;