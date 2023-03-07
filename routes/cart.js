const fs = require('fs');
var express = require('express');
var router = express.Router();

/* GET */
router.get('/', function(req, res, next) {

  var userId = req.session.userid
  var result = []

  try {
    var rawData = fs.readFileSync('products_in_cart.json');
    productsInCart = JSON.parse(rawData);
  } catch (err) {
    res.json({ message: 'Error when retrieving from database' })
    return;
  }

  result = productsInCart.filter(item => item.userId == userId);

  //inloggad
  if(req.session.userid) {
    res.render('cart', { result: result });
  } else {
    res.redirect("/login")
  }
});

/* POST - remove */
router.post('/removeProduct', function(req, res, next) {
  //kolla produkten existerar
  if (!req.body) {
    res.json({ message: 'Error: invalid product' })
  }

  var product = req.body;
  var products_in_cart = null;

  try {
    var rawData = fs.readFileSync('products_in_cart.json');
    products_in_cart = JSON.parse(rawData);
  } catch (err) {
    res.json({ message: 'Error when retrieving from database' })
    return;
  }

  //hitta produktens index genom dess id
  var id = product.id;
  var index = products_in_cart.findIndex(function(item, i){
    return item.id === id;
  })

  //ta bort & spara
  products_in_cart.splice(index, 1);
  let dataToSave = JSON.stringify(products_in_cart);
  fs.writeFileSync("products_in_cart.json", dataToSave);
  res.json({ message: 'Success' })

});

/* POST - add */
router.post('/addProduct', function(req, res, next) {
  //kolla produkten existerar
  if (!req.body) {
    res.json({ message: 'Error: invalid product' })
  }

  var productsInCart = null
  var product = req.body;
  //lägg till userid i produkten
  product.userId = req.session.userid

  //läs in kundvagns fil
  try {
    var rawData = fs.readFileSync('products_in_cart.json');
    productsInCart = JSON.parse(rawData);
  } catch (err) {
    res.json({ message: 'Error when retrieving from database' })
    return;
  }

  //lägg till produkten & spara
  productsInCart.push(product);
  let dataToSave = JSON.stringify(productsInCart);
  fs.writeFileSync('products_in_cart.json', dataToSave);

  res.json({ message: 'Success' })
});

module.exports = router;