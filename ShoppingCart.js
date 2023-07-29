// Initialize the cart in localStorage if it doesn't exist
if (!localStorage.getItem("productsInCart")) {
  localStorage.setItem("productsInCart", JSON.stringify({}));
}

let product = [
  {
    name: "suit1",
    tag: "suit1",
    price: 50,
    inCart: 0,
    quantity: 0,
  },
  {
    name: "suit2",
    tag: "suit2",
    price: 60,
    inCart: 0,
    quantity: 0,
  },
  {
    name: "suit3",
    tag: "suit3",
    price: 70,
    inCart: 0,
    quantity: 0,
  },
  {
    name: "suit4",
    tag: "suit4",
    price: 80,
    inCart: 0,
    quantity: 0,
  },
  {
    name: "suit5",
    tag: "suit5",
    price: 90,
    inCart: 0,
    quantity: 0,
  },
  {
    name: "suit6",
    tag: "suit6",
    price: 100,
    inCart: 0,
    quantity: 0,
  },
  {
    name: "suit7",
    tag: "suit7",
    price: 140,
    inCart: 0,
    quantity: 0,
  },
  {
    name: "suit8",
    tag: "suit8",
    price: 300,
    inCart: 0,
    quantity: 0,
  },
];

function createProductCards(products) {
  let productsContainer = document.querySelector(".products-container");

  if (!productsContainer) {
    console.error("Products container not found.");
    return;
  }

  products.forEach(product => {
    let card = document.createElement("div");
    card.classList.add("card", "col-md-4", "my-4");
    card.innerHTML = `
      <img src="${product.tag}.png" class="card-img-top" alt="${product.name}">
      <div class="card-body">
        <h5 class="card-title">${product.name}</h5>
        <p class="card-text">Price: £${product.price.toFixed(2)}</p>
        <button class="btn btn-primary add-cart" data-tag="${product.tag}">Add to Cart</button>
      </div>
    `;

    productsContainer.appendChild(card);
  });
}

// Call the createProductCards function with the 'product' array when the page loads
createProductCards(product);

// Event delegation for "Add to Cart" buttons
document.querySelector(".products-container").addEventListener("click", (event) => {
  if (event.target.classList.contains("add-cart")) {
    let tag = event.target.getAttribute("data-tag");
    let selectedProduct = product.find(p => p.tag === tag);
    cartNumbers(selectedProduct);
    totalCost(selectedProduct);
  }
});

function onloadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");
  if (productNumbers) {
    document.querySelector("#cart-span").textContent = productNumbers;
  }
}

function cartNumbers(product) {
  let productNumbers = localStorage.getItem("cartNumbers");
  productNumbers = parseInt(productNumbers);
  if (productNumbers) {
    localStorage.setItem("cartNumbers", productNumbers + 1);
    document.querySelector("#cart-span").textContent = productNumbers + 1;
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector("#cart-span").textContent = 1;
  }
  setItems(product);
  displayCart();
}

function setItems(product) {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  if (cartItems != null) {
    if (cartItems[product.tag] == undefined) {
      product.inCart = 1;
      cartItems = {
        ...cartItems,
        [product.tag]: product,
      };
    } else {
      cartItems[product.tag].inCart += 1;
    }
  } else {
    product.inCart = 1;
    cartItems = {
      [product.tag]: product,
    };
  }
  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalCost(product) {
  let cartCost = localStorage.getItem("totalCost");
  if (cartCost) {
    cartCost = parseFloat(cartCost);
    localStorage.setItem("totalCost", cartCost + product.price);
  } else {
    localStorage.setItem("totalCost", product.price);
  }
}

function displayCart() {
  let cartItems = JSON.parse(localStorage.getItem("productsInCart"));
  let cartItemsContainer = document.querySelector(".cart-items");
  let totalCost = 0; // Initialize total cost variable
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = "";
    Object.values(cartItems).forEach((item) => {
      let subtotal = item.price * item.inCart;
      let html = `
        <tr>
          <td>
            <div class="cart-info">
              <img src="${item.tag}.png" class="cart-img">
              <div class="info">
                <h3 class="product-title">${item.name}</h3>
                <small class="price">Price: £${item.price.toFixed(2)}</small>
                <br>
                <button class="btn btn-danger remove-btn" data-tag="${item.tag}">Remove</button>
              </div>
            </div>
          </td>
          <td>
            <input class="quantity" type="number" value="${item.inCart}" min="1" data-tag="${item.tag}">
            <button class="btn btn-info update-btn" data-tag="${item.tag}">Update</button>
          </td>
        </tr>
      `;
      cartItemsContainer.insertAdjacentHTML("beforeend", html);
      // Add event listener to quantity input
      let quantityInput = cartItemsContainer.querySelector(`.quantity[data-tag="${item.tag}"]`);
      quantityInput.addEventListener("change", (event) => {
        let newQuantity = event.target.value;
        updateCart(item.tag, newQuantity);
      });
      // Add event listener to remove button
      let removeButton = cartItemsContainer.querySelector(`.remove-btn[data-tag="${item.tag}"]`);
      removeButton.addEventListener("click", (event) => {
        removeItem(item);
      });
      totalCost += subtotal; // Accumulate subtotal for overall cost
    });
    // Update total cost
    let totalCostContainer = document.querySelector(".cart-total-price");
    if (totalCostContainer) {
      totalCostContainer.textContent = `£${totalCost.toFixed(2)}`;
    }
  }
}

let purchaseButton = document.querySelector('.purchase-btn');
purchaseButton.addEventListener("click", purchase);

function purchase() {
  alert("Thank You For Your Purchase");
  // Clear the cart
  localStorage.removeItem("productsInCart");
  localStorage.removeItem("totalCost");
  localStorage.removeItem("cartNumbers");
  // Refresh the page to reflect the cleared cart
  location.reload();
}

function removeItem(item) {
  let cartItems = JSON.parse(localStorage.getItem("productsInCart"));
  if (cartItems && cartItems[item.tag]) {
    // Update total cost
    let totalCost = localStorage.getItem("totalCost");
    if (totalCost) {
      totalCost = parseFloat(totalCost);
      totalCost -= item.price * item.inCart;
      localStorage.setItem("totalCost", totalCost);
    }
    // Remove item from cart
    delete cartItems[item.tag];
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
    // Update cart
    let cartNumbers = localStorage.getItem("cartNumbers");
    cartNumbers = cartNumbers ? parseInt(cartNumbers) - item.inCart : 0;
    localStorage.setItem("cartNumbers", cartNumbers);
    document.querySelector("#cart-span").textContent = cartNumbers;
    // Display updated cart
    displayCart();
  }
}

function updateCart(tag, quantity) {
  let cartItems = JSON.parse(localStorage.getItem("productsInCart"));
  let product = cartItems[tag];
  let newQuantity = parseInt(quantity);
  let price = product.price;
  let cartCost = parseFloat(localStorage.getItem("totalCost"));
  // Update cart item quantity
  product.inCart = newQuantity;
  // Update cart item subtotal
  let subtotal = price * newQuantity;
  let subtotalElement = document.querySelector(`.subtotal[data-tag="${tag}"]`);
  if (subtotalElement) {
    subtotalElement.textContent = `£${subtotal.toFixed(2)}`;
  }
  // Update total cost
  let oldSubtotal = price * (newQuantity - 1);
  let subtotalDifference = subtotal - oldSubtotal;
  cartCost += subtotalDifference;
  localStorage.setItem("totalCost", cartCost.toFixed(2));
  // Update localStorage
  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
  displayCart();
}

// Call the displayCart and onloadCartNumbers functions on page load
displayCart();
onloadCartNumbers();
