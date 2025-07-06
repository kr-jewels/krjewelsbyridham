// 📦 KR Jewels - Shared Inventory Script (localStorage version)

// Get the current cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("eagleCart") || "[]");
}

// Save the cart to localStorage
function saveCart(cart) {
  localStorage.setItem("eagleCart", JSON.stringify(cart));
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
  localStorage.removeItem("eagleCart");
}

// Display cart in table (for billing page)
function displayCartTable(tableId) {
  const cart = getCart();
  const table = document.getElementById(tableId);
  let totalPrice = 0;

  table.innerHTML = ""; // Clear previous rows

  cart.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-2">${item.productCode}</td>
      <td class="p-2">₹${item.sellingPrice.toFixed(2)}</td>
      <td class="p-2">${item.status}</td>
    `;
    table.appendChild(row);
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
      window.location.href = "manageinventoryindex.html"; // Redirect back to home
    } else {
      console.error(result);
      alert("Submission failed: " + result.error);
    }
  } catch (err) {
    console.error(err);
    alert("Network error. Check your internet or backend.");
  }
}

// For debugging in console
function printCart() {
  console.log("Current Cart:", getCart());
}
