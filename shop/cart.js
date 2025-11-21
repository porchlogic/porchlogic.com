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
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += item.quantity || 1;
    } else {
        cartItems.push({ ...item, quantity: item.quantity || 1 });
    }

    saveCartItems(cartItems);
    updateCartIconCount();
}

// Remove an item from the cart
function removeItemFromCart(itemId) {
    let cartItems = getCartItems();
    cartItems = cartItems.filter(item => item.id !== itemId);
    saveCartItems(cartItems);
    updateCartIconCount();

    if (document.getElementById('cart-items-container')) {
        renderCartItems();
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
    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        const totalEl = document.getElementById('cart-total');
        if (totalEl) totalEl.textContent = '$0.00';

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
        listItem.setAttribute('data-cart-item-id', item.id);

        listItem.innerHTML = `
			<span>${item.name}</span>
			<span>Qty: ${item.quantity}</span>
			<span>$${(item.price * item.quantity).toFixed(2)}</span>
			<button class="button remove-item" data-item-id="${item.id}">Remove</button>
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

// Popup helpers

function showCartPopup(message) {
    const cartPopup = document.getElementById('cart-popup');
    const popupMessage = document.getElementById('popup-message');
    if (cartPopup && popupMessage) {
        popupMessage.textContent = message;
        cartPopup.classList.add('visible');
    }
}

function hideCartPopup() {
    const cartPopup = document.getElementById('cart-popup');
    if (cartPopup) {
        cartPopup.classList.remove('visible');
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartIconCount();

    if (document.getElementById('cart-items-container')) {
        renderCartItems();
    }
});
