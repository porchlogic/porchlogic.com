<!-- combine-files:
cart.html
js/cart.js
js/checkout.js
-->

---


# Code Bundle
> Generated 2025-10-14T13:01:43.778Z

### cart.html
**Path:** `cart.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Shopping Cart - Porch Logic</title>
    <link rel="stylesheet" href="styles_new.css" />
    <link rel="stylesheet" href="styles/base.css" />
    <link rel="stylesheet" href="styles/cart.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- <script src="https://js.stripe.com/v3/"></script> -->
    <script src="https://js.stripe.com/basil/stripe.js"></script>
    <style>
        .item-error-message {
            color: #f66;
            font-size: 0.9em;
            margin-top: 6px;
        }
    </style>
</head>
<body>
    <div id="header"></div>

    <div class="main">
        <h1>Your Shopping Cart</h1>
        <div id="cart-items-container">
            <!-- Cart items will be rendered here by js/cart.js -->
        </div>
        <div class="cart-summary">
            <h3>Total: <span id="cart-total">$0.00</span></h3>
        </div>

        <div class="payment-section">
            <h2>Payment Information</h2>
            <h3 class="warning text-glow--yellow-subtle">
				<!-- <em>⚠ test mode, no transactions will be processed</em><br>
                <em>Get in touch if you are in PDX!</em> -->
			</h3>
            <!-- <form id="payment-form">
                <div id="card-element"></div>
                <button id="submit" class="buy-button">Pay Now</button>
                <div id="payment-message"></div>
            </form> -->

            <form id="payment-form">
                <h4>Email</h4>
                <label>

                    <input type="text" id="email" placeholder="you@example.com"
                  /></label>

                  <label style="display: flex; align-items: center; gap: 0.5em; margin-top: 0.5em; color: cornflowerblue;">
                    <input type="checkbox" id="subscribe-checkbox" style="transform: scale(1.5);" />
                    Subscribe to updates from Porch Logic
                    </label>

                    <br>

                <!-- <h4>Billing Address</h4>
                <div id="billing-address-element">
                </div> -->
                <h4>Shipping Address</h4>
                <div id="shipping-address-element">
                  <!--Stripe.js injects the Address Element-->
                </div>
                <h4>Payment</h4>
                <div id="payment-element">
                  <!--Stripe.js injects the Payment Element-->
                </div>

                <!-- <label for="public-key">Your SMB1 Device Public Key:</label>
                <textarea id="public-key" rows="8" placeholder="Paste your public key here" style="width: 100%;"></textarea>
                <p style="font-size: 0.9em; color: #888;">You can find this in your SMB1 device config page.</p> -->

                <button id="submit">
                  <div class="spinner hidden" id="spinner"></div>
                  <span id="button-text">Pay now</span>
                </button>
                <div id="payment-message" class="hidden"></div>
            </form>

        </div>
    </div>

    <div id="footer"></div>

    <script src="js/main.js"></script>
    <script src="js/cart.js"></script>
    <script src="js/checkout.js"></script>
    <script>
        // Initialize the page elements like header and footer
        initPage();

        // Initialize Stripe Elements when the page is ready
        document.addEventListener('DOMContentLoaded', () => {
            // Ensure cart items are rendered before initializing Stripe
            renderCartItems();
            // Only initialize Stripe if there are items in the cart
            // if (getCartItems().length > 0) {
            //     initializeStripeElements(); // Call the function from js/cart.js
            // }
        });
    </script>
</body>
</html>
```

### cart.js
**Path:** `js/cart.js`

```javascript
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
function renderCartItems(errorItemId = null, errorMessage = '') {
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
        listItem.setAttribute('data-cart-item-id', item.id);
        listItem.innerHTML = `
            <span>${item.name}</span>
            <span>Qty: ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
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
// function renderCartItems() {
// 	const cartItemsContainer = document.getElementById('cart-items-container');
// 	if (!cartItemsContainer) return;

// 	const cartItems = getCartItems();
// 	cartItemsContainer.innerHTML = ''; // Clear current items

// 	if (cartItems.length === 0) {
// 		cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
// 		document.getElementById('cart-total').textContent = '$0.00';
// 		// Disable payment form if cart is empty
// 		const paymentForm = document.getElementById('payment-form');
// 		if (paymentForm) {
// 			paymentForm.style.display = 'none';
// 		}
// 		return;
// 	}

// 	const itemList = document.createElement('ul');
// 	itemList.className = 'cart-item-list';

// 	cartItems.forEach(item => {
// 		if (item.id === 'smb1_activation') {
// 			// Render each activation on a separate line
// 			for (let i = 0; i < item.quantity; i++) {
// 				const listItem = document.createElement('li');
// 				listItem.className = 'cart-item';
// 				listItem.innerHTML = `
//                     <div>
//                         <span>${item.name} #${i + 1}</span>
//                         <span>$${item.price.toFixed(2)}</span>
//                         <button class="remove-item" data-item-id="${item.id}">Remove</button>
//                     </div>
//                     <div class="activation-public-key" style="margin-top: 10px;">
//                         <label for="public-key-${i}">Public Key for Activation #${i + 1}:</label>
//                         <textarea id="public-key-${i}" rows="6" placeholder="Paste public key here" style="width: 100%;"></textarea>
//                     </div>
//                 `;
// 				itemList.appendChild(listItem);
// 			}
// 		} else {
// 			// Normal item
// 			const listItem = document.createElement('li');
// 			listItem.className = 'cart-item';
// 			listItem.innerHTML = `
// 				<span>${item.name}</span>
// 				<span>Qty: ${item.quantity}</span>
// 				<span>$${(item.price * item.quantity).toFixed(2)}</span>
// 				<button class="remove-item" data-item-id="${item.id}">Remove</button>
// 			`;
// 			itemList.appendChild(listItem);
// 		}
// 	});

// 	cartItemsContainer.appendChild(itemList);
// 	updateCartTotal();

// 	// Add event listeners to remove buttons
// 	cartItemsContainer.querySelectorAll('.remove-item').forEach(button => {
// 		button.addEventListener('click', (event) => {
// 			const itemId = event.target.dataset.itemId;
// 			removeItemFromCart(itemId);
// 		});
// 	});

// 	// Show payment form if hidden
// 	const paymentForm = document.getElementById('payment-form');
// 	if (paymentForm) {
// 		paymentForm.style.display = 'block';
// 	}
// }


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
                price: 32.00 // Price as a number
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
                price: 32.00 // Price as a number
            };
            addItemToCart(smb1HostItem);
            showCartPopup(`${smb1HostItem.name} added to cart!`);
        });
    }

    const buySmb1ActivationButton = document.getElementById('buy-smb1-activation');
    if (buySmb1ActivationButton) {
        buySmb1ActivationButton.addEventListener('click', () => {
            // Define the item details for SMB1 Host
            const smb1ActivationItem = {
                id: 'smb1_activation', // Unique ID for the item
                name: 'SMB1 _Activate',
                price: 15.00 // Price as a number
            };
            addItemToCart(smb1ActivationItem);
            showCartPopup(`${smb1ActivationItem.name} added to cart!`);
        });
    }

    const buyTestProductButton = document.getElementById('buy-test-product');
    if (buyTestProductButton) {
        buyTestProductButton.addEventListener('click', () => {
            const TestProductItem = {
                id: 'Test Product', // Unique ID for the item
                name: 'Test Product',
                price: 0.50 // Price as a number
            };
            addItemToCart(TestProductItem);
            showCartPopup(`${TestProductItem.name} added to cart!`);
        });
    }
});



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
```

### checkout.js
**Path:** `js/checkout.js`

```javascript
// This is your test publishable API key.
const stripe = Stripe("pk_live_51J3mlbABTHjSuIhXgQq9s0XUfm1Fgnao9DnO29jF1hf4LpKh129cDDOpwiQRptEx7QlkcrnpHTfa3OQX30wHI4mB00NgdoLrSr");

// const stripe = Stripe("pk_test_51J3mlbABTHjSuIhXEk8OMPk7CGOzeecUuo0Kr5B5vUa9vnHddxWrB4UqO3fGLM1WyXkexXJALAxNYXvRdwxiGYbN00BbssH1nY");
const THIS_API_BASE = 'https://api.porchlogic.com';
let checkout;
initialize();

const validateEmail = async (email) => {
	const updateResult = await checkout.updateEmail(email);
	const isValid = updateResult.type !== "error";
	
	return { isValid, message: !isValid ? updateResult.error.message : null };
};

document.querySelector("#payment-form").addEventListener("submit", handleSubmit);

// Fetches a Checkout Session and captures the client secret
//test
async function initialize_old() {
	const cartItems = getCartItems(); // from sessionStorage
	// const publicKey = document.getElementById("public-key")?.value || "";

	const promise = fetch(`${THIS_API_BASE}/create-checkout-session`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ cartItems })
	})
	.then((r) => r.json())
	.then((r) => r.clientSecret);

	
	const appearance = {
		theme: 'night',
	};
	
	checkout = await stripe.initCheckout({
		fetchClientSecret: () => promise,
		elementsOptions: { appearance },
	});
	
	document.querySelector("#button-text").textContent = `Pay ${
		checkout.session().total.total.amount
	} now`;
	
	const emailInput = document.getElementById("email");
	const emailErrors = document.getElementById("email-errors");
	
	emailInput.addEventListener("input", () => {
		// Clear any validation errors
		emailErrors.textContent = "";
	});
	
	emailInput.addEventListener("blur", async () => {
		const newEmail = emailInput.value;
		if (!newEmail) {
			return;
		}
		
		const { isValid, message } = await validateEmail(newEmail);
		if (!isValid) {
			emailErrors.textContent = message;
		}
	});
	
	const paymentElement = checkout.createPaymentElement();
	paymentElement.mount("#payment-element");
	//   const billingAddressElement = checkout.createBillingAddressElement();
	//   billingAddressElement.mount("#billing-address-element");
	const shippingAddressElement = checkout.createShippingAddressElement();
	shippingAddressElement.mount("#shipping-address-element");
}

async function initialize() {
	const cartItems = getCartItems(); // from sessionStorage
	// const publicKey = document.getElementById("public-key")?.value || "";

	const promise = fetch(`${THIS_API_BASE}/create-checkout-session`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ cartItems })
	})
	.then((r) => r.json())
	// .then((r) => {
	// 	console.log("Checkout session response:", r);
	// 	return r.clientSecret;
	// });
	.then((r) => {
		if (r.error === "InventoryError") {
			showInventoryError(r.itemId, r.message);
			throw new Error("Inventory error");
		}
		return r.clientSecret;
	});
	
	

	
	const appearance = {
		theme: 'night',
	};
	
	// checkout = await stripe.initCheckout({
	// 	fetchClientSecret: () => promise,
	// 	elementsOptions: { appearance },
	// });
	checkout = await stripe.initCheckout({
		fetchClientSecret: async () => {
			const res = await promise;
			if (typeof res !== "string") {
				console.error("🚫 Missing or invalid clientSecret:", res);
				throw new Error("Checkout session creation failed");
			}
			return res;
		},
		elementsOptions: { appearance }
	});

	
	document.querySelector("#button-text").textContent = `Pay ${
		checkout.session().total.total.amount
	} now`;
	
	const emailInput = document.getElementById("email");
	const emailErrors = document.getElementById("email-errors");
	
	emailInput.addEventListener("input", () => {
		// Clear any validation errors
		emailErrors.textContent = "";
	});
	
	emailInput.addEventListener("blur", async () => {
		const newEmail = emailInput.value;
		if (!newEmail) {
			return;
		}
		
		const { isValid, message } = await validateEmail(newEmail);
		if (!isValid) {
			emailErrors.textContent = message;
		}
	});
	
	const paymentElement = checkout.createPaymentElement();
	paymentElement.mount("#payment-element");
	//   const billingAddressElement = checkout.createBillingAddressElement();
	//   billingAddressElement.mount("#billing-address-element");
	const shippingAddressElement = checkout.createShippingAddressElement();
	shippingAddressElement.mount("#shipping-address-element");
}

async function handleSubmit(e) {
	e.preventDefault();
	setLoading(true);

	const email = document.getElementById("email").value;
	const { isValid, message } = await validateEmail(email);
	if (!isValid) {
		showMessage(message);
		setLoading(false);
		return;
	}

	const subscribe = document.getElementById("subscribe-checkbox").checked;
	if (subscribe) {
		try {
			await fetch(`${THIS_API_BASE}/newsletter-signup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email })
			});
		} catch (err) {
			console.warn("Newsletter signup failed:", err);
		}
	}





	// Proceed to confirm payment
	const { error } = await checkout.confirm();

	

	if (error) {
		showMessage(error.message);
		setLoading(false);
		return;
	}

	// (normal flow will redirect to return_url)
}

function showInventoryError(itemId, message) {
	const itemRow = document.querySelector(`[data-cart-item-id="${itemId}"]`);
	if (itemRow) {
		const msg = document.createElement("div");
		msg.className = "item-error-message";
		msg.textContent = message;
		itemRow.appendChild(msg);
	}

	// Disable the checkout form
	const submitBtn = document.querySelector("#submit");
	if (submitBtn) submitBtn.disabled = true;

	const spinner = document.querySelector("#spinner");
	if (spinner) spinner.classList.add("hidden");

	const btnText = document.querySelector("#button-text");
	if (btnText) {
		btnText.classList.remove("hidden");
		btnText.textContent = "Fix issues above";
	}
}


// ------- UI helpers -------

function showMessage(messageText) {
	const messageContainer = document.querySelector("#payment-message");
	
	messageContainer.classList.remove("hidden");
	messageContainer.textContent = messageText;
	
	setTimeout(function () {
		messageContainer.classList.add("hidden");
		messageContainer.textContent = "";
	}, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
	if (isLoading) {
		// Disable the button and show a spinner
		document.querySelector("#submit").disabled = true;
		document.querySelector("#spinner").classList.remove("hidden");
		document.querySelector("#button-text").classList.add("hidden");
	} else {
		document.querySelector("#submit").disabled = false;
		document.querySelector("#spinner").classList.add("hidden");
		document.querySelector("#button-text").classList.remove("hidden");
	}
}
```
