var fs = require('fs');
var express = require('express');
const { json } = require('express');
var router = express.Router();
const crypto = require("crypto");

/* GET */
router.get('/', function(req, res, next) {

  var products = null;

  try{
    var rawDataProducts = fs.readFileSync('products.json');
    products = JSON.parse(rawDataProducts);
  } catch(error){
    console.log(error);
    res.send("Error when retrieving from database");
    return;
  }

  if(req.session.userid){
    res.render('admin', {username: req.session.userid, products: products})
  } else {
    res.redirect('/login');
  }

});

/* POST */
router.post('/', function(req, res, next) {
    
  //variabler
    var products = null;
    var img = req.body.add_img;
    var title = req.body.add_title;
    var price = req.body.add_price;
    const id = crypto.randomUUID();

    //läs in filen
    try {
        var rawData = fs.readFileSync('products.json');
        products = JSON.parse(rawData);
    } catch (err) {
        res.json({ message: 'Error when retrieving from database' })
        return;
    }

    //produkten
    var product = {
        id: id,
        img: img,
        title: title,
        price: price
    };

    //spara till filen
    products.push(product);
    let dataToSave = JSON.stringify(products);
    fs.writeFileSync("products.json", dataToSave);

    res.redirect('/admin')
  });

/* POST REMOVE */
router.post('/remove', function(req, res, next) {
  //kolla om produkten finns
    if (!req.body) {
      res.json({ message: 'Error: invalid product' })
    }
  
    var product = req.body;
    var products = null;
  
    //läs in filen
    try {
      var rawData = fs.readFileSync('products.json');
      products = JSON.parse(rawData);
    } catch (err) {
      res.json({ message: 'Error when retrieving from database' })
      return;
    }

    // hitta produktens index genom dess id
    var id = product.id;
    var index = products.findIndex(function(item, i){
      return item.id === id;
    })
    
    //ta bort produkt
    products.splice(index, 1);

    //spara
    let dataToSave = JSON.stringify(products);
    fs.writeFileSync('products.json', dataToSave);
  
    res.json({ message: 'Success' })
  });

module.exports = router;