// Load HTML fragment into an element by ID
// function loadHTML(elementId, file) {
// 	fetch(file)
// 		.then((response) => response.text())
// 		.then((data) => {
// 			document.getElementById(elementId).innerHTML = data;
// 		})
// 		.catch((err) => console.error(`Error loading ${file}:`, err));
// }


const API_BASE = 'https://api.porchlogic.com';


function loadHTML(elementId, file) {
	return new Promise((resolve, reject) => {
		const el = document.getElementById(elementId);
		if (!el) {
			console.warn(`Skipping module ${file}: #${elementId} not found`);
			return resolve(); // Not an error — just skip
		}

		fetch(file)
			.then((response) => response.text())
			.then((data) => {
				el.innerHTML = data;
				resolve();
			})
			.catch((err) => {
				console.error(`Error loading ${file}:`, err);
				reject(err);
			});
	});
}


// Toggle product card expansion
function toggleCard(card) {
	const isExpanded = card.classList.contains("expanded");
	document.querySelectorAll(".product-card").forEach((c) =>
		c.classList.remove("expanded")
	);
	if (!isExpanded) card.classList.add("expanded");
}

// Load log updates from markdown files listed in updates.json
function loadLogUpdates() {
	fetch("log/updates.json")
		.then((response) => response.json())
		.then((data) => {
			const container = document.getElementById("log-updates");
			data.updates.forEach((mdFile, index) => {
				fetch(`log/${mdFile}`)
					.then((resp) => resp.text())
					.then((mdContent) => {
						const htmlContent = marked.parse(mdContent);
						const logEntry = document.createElement("div");
						logEntry.className = "log-entry";

						const header = document.createElement("div");
						header.className = "log-entry-header";
						header.innerHTML = `<span>Update ${index + 1}</span><i class="fa fa-chevron-right toggle-icon"></i>`;

						const content = document.createElement("div");
						content.className = "log-entry-content";
						content.innerHTML = htmlContent;

						logEntry.appendChild(header);
						logEntry.appendChild(content);

						header.addEventListener("click", () => {
                            const isExpanded = logEntry.classList.contains("expanded");
                            document.querySelectorAll(".log-entry").forEach((entry) => {
                                entry.classList.remove("expanded");
                            });
                            if (!isExpanded) {
                                logEntry.classList.add("expanded");
                            }
                        });
                        

						container.appendChild(logEntry);
					})
					.catch((err) =>
						console.error(`Error loading markdown file ${mdFile}:`, err)
					);
			});
		})
		.catch((err) => console.error("Error loading updates.json:", err));
}

// Load SVG markup from JSON and inject into corresponding elements
function loadSVGData() {
	fetch("data/svgData.json")
		.then((response) => response.json())
		.then((data) => {
			document.getElementById("discord-svg").innerHTML = data.discord;
			document.getElementById("shop-svg").innerHTML = data.shop;
			document.getElementById("youtube-svg").innerHTML = data.youtube;
			document.getElementById("instagram-svg").innerHTML = data.instagram;
			document.getElementById("reddit-svg").innerHTML = data.reddit;
		})
		.catch((err) => console.error("Error loading SVG data:", err));
}

document.addEventListener("DOMContentLoaded", () => {
	const containers = document.querySelectorAll(".markdown-content");

	containers.forEach(async (el) => {
		const fileName = el.dataset.src;
		if (!fileName) {
			console.warn("Missing data-src on .markdown-content element — skipping.");
			return;
		}

		// Optional: show a temporary loading state
		el.innerHTML = `<p>Loading...</p>`;

		try {
			const res = await fetch(`/markdown/${fileName}`);
			if (!res.ok) throw new Error(`Failed to load markdown/${fileName}`);

			const markdown = await res.text();
			el.innerHTML = marked.parse(markdown);
		} catch (err) {
			console.error(`Error loading markdown for ${fileName}:`, err);
			el.innerHTML = `<p style="color:red;">Error loading content.</p>`;
		}
	});
});


// Initialize the page by loading dynamic content and attaching events
// function initPage() {
// 	loadHTML("header", "/header.html");
// 	loadHTML("footer", "/footer.html");
// 	loadHTML("social-buttons", "/social-buttons.html");

// 	// Attach newsletter logic once loaded
// 	setTimeout(() => {
// 		const form = document.getElementById("newsletter-form");
// 		if (form) {
// 			form.addEventListener("submit", async function (e) {
// 				e.preventDefault();

// 				const email = document.getElementById("newsletter-email").value;
// 				const status = document.getElementById("newsletter-status");

// 				try {
// 					const res = await fetch('/newsletter-signup', {
// 						method: 'POST',
// 						headers: { 'Content-Type': 'application/json' },
// 						body: JSON.stringify({ email })
// 					});

// 					const result = await res.json();
// 					status.textContent = result.message || "Success!";
// 				} catch (err) {
// 					status.textContent = "Something went wrong.";
// 					console.error(err);
// 				}
// 			});
// 		}
// 	}, 300); // Wait a little for loadHTML to finish
// }

async function initPage() {
	await loadHTML("header", "/header.html");
	await loadHTML("footer", "/footer.html");
	await loadHTML("social-buttons", "/social-buttons.html");

	await loadHTML("newsletter-container", "/newsletter-signup.html")
		.then(() => {
			const form = document.getElementById("newsletter-form");
			if (!form) return;

			form.addEventListener("submit", async function (e) {
				e.preventDefault();

				const email = document.getElementById("newsletter-email").value;
				const status = document.getElementById("newsletter-status");

				try {
					const res = await fetch(`${API_BASE}/newsletter-signup`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ email })
					});

					const result = await res.json();
					status.textContent = result.message || "Success!";
				} catch (err) {
					status.textContent = "Something went wrong.";
					console.error(err);
				}
			});
		});
}
