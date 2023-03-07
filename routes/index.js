var fs = require('fs');
var express = require('express');
var router = express.Router();

/* GET */
router.get('/', function(req, res, next) {

  var products = null;
  var productsInCart = null;
  results = [];

  try{
    //products fil
    var rawDataProducts = fs.readFileSync('products.json');
    products = JSON.parse(rawDataProducts);
    
    //products in cart fil
    var rawDataCart = fs.readFileSync('products_in_cart.json');
    productsInCart = JSON.parse(rawDataCart);
  } catch(error){
    console.log(error);
    res.send("Error when retrieving from database");
    return;
  }

  //filtrera resultat
  results = productsInCart.filter(item => item.userId == req.session.userid);

  if(req.session.userid){
    res.render('index', {username: req.session.userid, products: products, amount: results.length})
  } else {
    res.redirect('/login');
  }

});

module.exports = router;
