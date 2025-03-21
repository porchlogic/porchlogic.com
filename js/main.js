// Load HTML fragment into an element by ID
function loadHTML(elementId, file) {
	fetch(file)
		.then((response) => response.text())
		.then((data) => {
			document.getElementById(elementId).innerHTML = data;
		})
		.catch((err) => console.error(`Error loading ${file}:`, err));
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

// Initialize the page by loading dynamic content and attaching events
function initPage() {
	loadHTML("header", "header.html");
	loadHTML("footer", "footer.html");
	loadLogUpdates();
	loadSVGData();

	// Scroll to shop section when shop button is clicked
	const shopLink = document.getElementById("shop-link");
	const shopSection = document.getElementById("shop");
	shopLink.addEventListener("click", () => {
		shopSection.scrollIntoView({ behavior: "smooth", block: "end" });
	});
}
