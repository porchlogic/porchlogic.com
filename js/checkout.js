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

async function initialize() {
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



	// // Collect public keys
	// const activationPublicKeys = [];
	// document.querySelectorAll('textarea[id^="public-key-"]').forEach(textarea => {
	// 	const key = textarea.value.trim();
	// 	if (key.length > 0) {
	// 		activationPublicKeys.push(key);
	// 	}
	// });

	// // Optional: validate number of keys matches quantity of activations
	// const cartItems = getCartItems();
	// const activationItem = cartItems.find(item => item.id === 'smb1_activation');
	// const expectedKeys = activationItem ? activationItem.quantity : 0;
	// if (activationPublicKeys.length !== expectedKeys) {
	// 	showMessage(`Please provide ${expectedKeys} public key(s) for your activations.`);
	// 	setLoading(false);
	// 	return;
	// }

	// // Get sessionId from Stripe checkout object:
	// const sessionId = checkout.session().id; // Assuming your stripe.initCheckout() exposes session() object
	// // If not available — alternatively you can have `/create-checkout-session` also return `session_id` along with clientSecret.

	// // Save public keys to backend as pending
	// await fetch(`${THIS_API_BASE}/save-pending-public-keys`, {
	// 	method: "POST",
	// 	headers: { "Content-Type": "application/json" },
	// 	body: JSON.stringify({
	// 		sessionId,
	// 		activationPublicKeys
	// 	})
	// });

	// Proceed to confirm payment
	const { error } = await checkout.confirm();

	

	if (error) {
		showMessage(error.message);
		setLoading(false);
		return;
	}

	// (normal flow will redirect to return_url)
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