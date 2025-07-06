// 📦 KR Jewels - Shared Inventory Script

// Get the current cart from sessionStorage
function getCart() {
  return JSON.parse(sessionStorage.getItem("cart") || "[]");
}

// Save the cart to sessionStorage
function saveCart(cart) {
  sessionStorage.setItem("cart", JSON.stringify(cart));
}

// Add an item to the cart
function addItemToCart(productCode, sellingPrice, status) {
  const cart = getCart();
  cart.push({
    productCode,
    sellingPrice: parseFloat(sellingPrice),
    status
  });
  saveCart(cart);
}

// Clear cart (after bill submission)
function clearCart() {
  sessionStorage.removeItem("cart");
}

// Display cart in table (for billing page)
function displayCartTable(tableId) {
  const cart = getCart();
  const table = document.getElementById(tableId);
  let totalPrice = 0;

  cart.forEach((item, index) => {
    const row = table.insertRow();
    row.innerHTML = `
      <td>${item.productCode}</td>
      <td>₹${item.sellingPrice.toFixed(2)}</td>
      <td>${item.status}</td>
    `;
    totalPrice += item.sellingPrice;
  });

  document.getElementById("totalItems").innerText = cart.length;
  document.getElementById("totalPrice").innerText = `₹${totalPrice.toFixed(2)}`;
}

// Send bill to Google Sheets backend
async function submitBill(backendURL, customerName, customerContact) {
  const cart = getCart();

  if (cart.length === 0) {
    alert("Cart is empty. Add items first.");
    return;
  }

  const payload = {
    origin: window.location.origin,
    customerName,
    customerContact,
    data: cart
  };

  try {
    const response = await fetch(backendURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("Bill submitted successfully!");
      clearCart();
      window.location.href = "manageinventoryindex.html"; // Redirect back to start
    } else {
      console.error(result);
      alert("Submission failed: " + result.error);
    }
  } catch (err) {
    console.error(err);
    alert("Network error. Check your internet or backend.");
  }
}

// For debugging
function printCart() {
  console.log("Current Cart:", getCart());
}
