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

async function initialize() {
	const cartItems = getCartItems(); // from sessionStorage
	// const publicKey = document.getElementById("public-key")?.value || "";

	const promise = fetch(`${THIS_API_BASE}/create-checkout-session`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ cartItems })
	})
	.then((r) => r.json())
	.then((r) => {
		console.log("Checkout session response:", r);
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
	  const billingAddressElement = checkout.createBillingAddressElement();
	  billingAddressElement.mount("#billing-address-element");
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