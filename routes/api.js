const fs = require('fs');
var express = require('express');
var router = express.Router();

router.get('/cart', function(req, res, next) {
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
  res.json(result)
});

router.get('/cart/clear', function(req, res, next) {
  var userId = req.session.userid
  var result = []

  try {
    var rawData = fs.readFileSync('products_in_cart.json');
    productsInCart = JSON.parse(rawData);
  } catch (err) {
    res.json({ message: 'Error when retrieving from database' })
    return;
  }

  //spara bara de som inte tillhör usern
  result = productsInCart.filter(item => item.userId != userId);
  let dataToSave = JSON.stringify(result);

  fs.writeFileSync('products_in_cart.json', dataToSave);

  res.json({ message: 'Success' })
});

module.exports = router;