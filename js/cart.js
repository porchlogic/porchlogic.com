// Cart data will be stored in Session Storage
const CART_STORAGE_KEY = 'porchlogic_cart';

// Get cart items from Session Storage
function getCartItems() {
    const cartItemsString = sessionStorage.getItem(CART_STORAGE_KEY);
    return cartItemsString ? JSON.parse(cartItemsString) : [];
}

// Save cart items to Session Storage
function saveCartItems(cartItems) {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

// Add an item to the cart
function addItemToCart(item) {
    const cartItems = getCartItems();
    // Check if item already exists in cart and update quantity if needed
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += item.quantity || 1;
    } else {
        cartItems.push({ ...item, quantity: item.quantity || 1 });
    }
    saveCartItems(cartItems);
    updateCartIconCount();
}

// Remove an item from the cart (optional for basic flow)
function removeItemFromCart(itemId) {
    let cartItems = getCartItems();
    cartItems = cartItems.filter(item => item.id !== itemId);
    saveCartItems(cartItems);
    updateCartIconCount();
    // Re-render cart if on cart page
    if (document.getElementById('cart-items-container')) {
        renderCartItems();
        window.location.reload();
    }
}

// Update the cart item count displayed in the header
function updateCartIconCount() {
    const cartItems = getCartItems();
    const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);
    const cartCountSpan = document.querySelector('.cart-count');
    if (cartCountSpan) {
        cartCountSpan.textContent = totalItems;
    }
}

// Render cart items on the cart page
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (!cartItemsContainer) return;

    const cartItems = getCartItems();
    cartItemsContainer.innerHTML = ''; // Clear current items

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('cart-total').textContent = '$0.00';
        // Disable payment form if cart is empty
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.style.display = 'none';
        }
        return;
    }

    const itemList = document.createElement('ul');
    itemList.className = 'cart-item-list';

    cartItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'cart-item';
        listItem.innerHTML = `
            <span>${item.name}</span>
            <span>Quantity: ${item.quantity}</span>
            <span>Price: $${(item.price * item.quantity).toFixed(2)}</span>
            <button class="remove-item" data-item-id="${item.id}">Remove</button>
        `;
        itemList.appendChild(listItem);
    });

    cartItemsContainer.appendChild(itemList);
    updateCartTotal();

    // Add event listeners to remove buttons
    cartItemsContainer.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (event) => {
            const itemId = event.target.dataset.itemId;
            removeItemFromCart(itemId);
        });
    });

    // Show payment form if hidden
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.style.display = 'block';
    }
}

// Calculate and display the cart total
function updateCartTotal() {
    const cartItems = getCartItems();
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTotalElement = document.getElementById('cart-total');
    if (cartTotalElement) {
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartIconCount();
    // If on the cart page, render the items
    if (document.getElementById('cart-items-container')) {
        renderCartItems();
        // Stripe Elements initialization will go here later
    }
});

// Add event listeners to "Add to Cart" buttons on index.html
// This assumes this script is loaded on index.html
document.addEventListener('DOMContentLoaded', () => {
    const buySmb1DefaultButton = document.getElementById('buy-smb1-default');
    if (buySmb1DefaultButton) {
        buySmb1DefaultButton.addEventListener('click', () => {
            // Define the item details for SMB1 Default
            const smb1DefaultItem = {
                id: 'smb1_default', // Unique ID for the item
                name: 'SMB1 _Device',
                price: 42.00 // Price as a number
            };
            addItemToCart(smb1DefaultItem);
            showCartPopup(`${smb1DefaultItem.name} added to cart!`);
        });
    }

    const buySmb1HostButton = document.getElementById('buy-smb1-host');
    if (buySmb1HostButton) {
        buySmb1HostButton.addEventListener('click', () => {
            // Define the item details for SMB1 Host
            const smb1HostItem = {
                id: 'smb1_host', // Unique ID for the item
                name: 'SMB1 _Host',
                price: 42.00 // Price as a number
            };
            addItemToCart(smb1HostItem);
            showCartPopup(`${smb1HostItem.name} added to cart!`);
        });
    }
});

// Placeholder for Stripe Elements initialization and payment handling on cart.html
// This part will be implemented when creating cart.html
// async function initializeStripeElements() {
//     const stripe = Stripe("pk_live_51J3mlbABTHjSuIhXgQq9s0XUfm1Fgnao9DnO29jF1hf4LpKh129cDDOpwiQRptEx7QlkcrnpHTfa3OQX30wHI4mB00NgdoLrSr");
//     const API_BASE = 'http://143.110.159.39:4242';

//     // Fetch the cart total and convert to cents
//     const cartItems = getCartItems();
//     const totalInCents = Math.round(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 100);

//     try {
//         const response = await fetch(`${API_BASE}/create-payment-intent`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ amount: totalInCents }),
//         });

//         const { clientSecret } = await response.json();

//         const elements = stripe.elements({ clientSecret });
//         const cardElement = elements.create('card');
//         cardElement.mount('#card-element');

//         const form = document.getElementById('payment-form');
//         form.addEventListener('submit', async (event) => {
//             event.preventDefault();

//             const { error } = await stripe.confirmCardPayment(clientSecret, {
//                 payment_method: {
//                     card: cardElement,
//                 },
//             });

//             const paymentMessage = document.getElementById('payment-message');
//             if (error) {
//                 paymentMessage.textContent = error.message;
//             } else {
//                 // Payment succeeded. You can redirect to a success page.
//                 paymentMessage.textContent = 'Payment successful!';
//                 // Clear the cart after successful payment
//                 saveCartItems([]);
//                 updateCartIconCount();
//                 // Redirect to success page
//                 window.location.href = '/stripe/success.html';
//             }
//         });

//     } catch (error) {
//         console.error('Error initializing Stripe Elements:', error);
//         const paymentMessage = document.getElementById('payment-message');
//         paymentMessage.textContent = 'Error loading payment form.';
//     }
// }

// Show the cart popup
function showCartPopup(message) {
    const cartPopup = document.getElementById('cart-popup');
    const popupMessage = document.getElementById('popup-message');
    if (cartPopup && popupMessage) {
        popupMessage.textContent = message;
        cartPopup.classList.add('visible');
        // Automatically hide after a few seconds
        // setTimeout(hideCartPopup, 5000); // Hide after 5 seconds
    }
}

// Hide the cart popup
function hideCartPopup() {
    const cartPopup = document.getElementById('cart-popup');
    if (cartPopup) {
        cartPopup.classList.remove('visible');
    }
}