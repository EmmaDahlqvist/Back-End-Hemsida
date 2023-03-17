const { raw } = require("express");
var express = require("express");
var router = express.Router();
var fs = require("fs");

/* GET */
router.get("/", function (req, res, next) {
  var users = null;
  try {
    var rawData = fs.readFileSync("users.json");
    users = JSON.parse(rawData);
  } catch (error) {
    res.send("Error when retrieving from database");
    return;
  }

  for (const user of users) {
    if (user.username === req.session.userid) {
      res.render("profile", user);
      return;
    }
  }
  res.redirect("/login");
});

/* POST */
router.post("/", function (req, res, next) {
  var users = null;
  var theUser;
  const takenUsernames = [];
  const takenMailAdress = [];

  try {
    var rawData = fs.readFileSync("users.json");
    users = JSON.parse(rawData);
  } catch (err) {
    res.send("Error");
    return;
  }

  for (const user of users) {
    //spara rätt användare
    if (user.username == req.session.userid) {
      theUser = user;
    } else {
      //lägg till alla andra användarnamn & mail i lista
      takenUsernames.push(user.username);
      takenMailAdress.push(user.mail);
    }
  }

  //rätt lösenord
  if (theUser.password == req.body.old_password) {
    var productsInCart = null;
    var results = [];
    try {
      var rawData = fs.readFileSync("products_in_cart.json");
      productsInCart = JSON.parse(rawData);
    } catch (error) {
      res.send("Error when retrieving from database");
    }

    //uppdatera IDt på produkten till nya username
    results = productsInCart.filter(
      (item) => item.userId == req.session.userid
    );

    for (var product of productsInCart) {
      if (results.includes(product)) {
        //byt userId
        product.userId = req.body.new_username;
      }
    }

    //stämmer med confirm password rutan
    if (req.body.new_password == req.body.confirm_password) {
      if (!takenUsernames.includes(req.body.new_username)) {
        if (!takenMailAdress.includes(req.body.new_mail)) {
          req.session.userid = req.body.new_username;
          theUser.username = req.body.new_username;
          theUser.mail = req.body.new_mail;
          theUser.password = req.body.new_password;

          //uppdatera products in cart med nytt userid
          fs.writeFileSync(
            "products_in_cart.json",
            JSON.stringify(productsInCart)
          );

          // uppdatera filen med ny info
          fs.writeFileSync("users.json", JSON.stringify(users));
          res.render(
            "profile",
            Object.assign(theUser, { confirmMsg: "Information uppdaterad!" })
          );
        } else {
          res.render(
            "profile",
            Object.assign(theUser, {
              errorMsg: "Denna mailadress tillhör någon annan!",
            })
          );
        }
      } else {
        res.render(
          "profile",
          Object.assign(theUser, {
            errorMsg: "Detta användarnamn tillhör någon annan!",
          })
        );
      }
    } else {
      res.render(
        "profile",
        Object.assign(theUser, { errorMsg: "Lösenorden stämmer inte överens!" })
      );
    }
  } else {
    res.render(
      "profile",
      Object.assign(theUser, { errorMsg: "Det gamla lösenordet var fel!" })
    );
  }
});

module.exports = router;
