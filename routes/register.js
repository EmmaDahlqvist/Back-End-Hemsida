var fs = require('fs');
var express = require('express');
const { runInNewContext } = require('vm');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('register', { title: "Registering"});
});

router.post('/', function(req, res, next) {
    
    const userFile = 'users.json';
    var users = null;

    try{
        var rawData = fs.readFileSync(userFile);
        users = JSON.parse(rawData);
    } catch(err){
        res.send("Error when retrieving data from database");
        return;
    }

    //kolla om användarnamn eller mail är upptagen
    for(const user of users){
        if(user.username == req.body.username){
            res.render('register', {errorMsg:'Användarnamnet är upptaget, vänligen välj ett annat!'});
            res.end();
            return;
        }
        if(user.mail == req.body.mail){
            res.render('register', {errorMsg:'Denna mailadress är upptagen, vänligen välj en annan eller logga in!'});
            res.end();
            return;
        }
    }

    //kolla så att detta fällt är ifyllt
    if(req.body.confirmpassword){
        if(req.body.confirmpassword == req.body.password) {
            var newUser = {
                mail: req.body.mail,
                username: req.body.username,
                password: req.body.password,
                authority: 'member'
            }
    
            //lägg till i listan
            users.push(newUser);
            let newData = JSON.stringify(users);
    
            fs.writeFileSync(userFile, newData);
            
            //skicka till index
    
            req.session.userid = req.body.username;
            req.session.authority = 'member';
    
            res.redirect('/');
        } else {
            res.render('register', {errorMsg:'Lösenorden stämmer inte överens!'})
        }
    } else {
        res.render('register', {errorMsg:'Fyll i alla fält!'})
    }

})

module.exports = router;