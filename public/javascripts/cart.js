// Example POST method implementation:
async function postData(data = {}, url) {

  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function getCart() {
  const response = await fetch("/api/cart");
  return response.json(); // parses JSON response into native JavaScript objects
}

async function clearCart() {
  await fetch("/api/cart/clear");
  document.location.reload()
}

function fetchCart() {
  getCart()
    .then((data) => {
      var cartElement = document.getElementById("cart");

      cartElement.textContent = `Kundvagn (${data.length})`
    });
}


function addToCart(data) {
  console.log(data);
  var url = "/cart/addProduct";
  postData(data, url)
    .then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
    });

  fetchCart();
}

function removeFromCart(data) {
  url = "/cart/removeProduct"
  postData(data, url)
    .then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
    });
  location.reload();
}