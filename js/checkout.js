// This is your test publishable API key.
const stripe = Stripe("pk_live_51J3mlbABTHjSuIhXgQq9s0XUfm1Fgnao9DnO29jF1hf4LpKh129cDDOpwiQRptEx7QlkcrnpHTfa3OQX30wHI4mB00NgdoLrSr");
const THIS_API_BASE = 'https://api.porchlogic.com';
let checkout;
initialize();

const validateEmail = async (email) => {
	const updateResult = await checkout.updateEmail(email);
	const isValid = updateResult.type !== "error";
	
	return { isValid, message: !isValid ? updateResult.error.message : null };
};

document
.querySelector("#payment-form")
.addEventListener("submit", handleSubmit);

// Fetches a Checkout Session and captures the client secret

async function initialize() {
	const cartItems = getCartItems(); // from sessionStorage
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
	// const appearance = {
	// 	theme: 'none',
	// 	variables: {
	// 		colorBackground: '#1a1a1d',
	// 		colorPrimaryText: 'var(--text-primary)',
	// 		colorSecondaryText: 'var(--text-secondary)',
	// 		colorText: 'var(--text-primary)',
	// 		colorBorder: '#333',
	// 		colorDanger: 'var(--neonRed)',
	// 		borderRadius: '4px',
	// 		spacingUnit: '6px',
	// 		fontSizeBase: '16px',
	// 	},
	// 	rules: {
	// 		'.Input, .Input:focus': {
	// 			backgroundColor: '#1a1a1d',
	// 			borderColor: '#333',
	// 			color: 'var(--text-primary)',
	// 		},
	// 		'.Label': {
	// 			color: 'var(--text-secondary)',
	// 			fontSize: '14px',
	// 		},
	// 		'.Error': {
	// 			color: 'var(--neonRed)',
	// 		}
	// 	}
	// };
	
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
	
	const { error } = await checkout.confirm();
	
	// This point will only be reached if there is an immediate error when
	// confirming the payment. Otherwise, your customer will be redirected to
	// your `return_url`. For some payment methods like iDEAL, your customer will
	// be redirected to an intermediate site first to authorize the payment, then
	// redirected to the `return_url`.
	showMessage(error.message);
	
	setLoading(false);
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