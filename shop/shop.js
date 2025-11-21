(function () {
    "use strict";

    function formatMoney(amount) {
        return "$" + amount.toFixed(2);
    }

    function rebuildCartUI() {
        const items = window.ShopCart.getCartItems();
        const emptyEl = document.getElementById("cart-empty");
        const filledEl = document.getElementById("cart-filled");
        const tbody = document.getElementById("cart-items");
        const totalEl = document.getElementById("cart-total");
        const checkoutBtn = document.getElementById("checkout-button");
        const countEls = document.querySelectorAll("[data-cart-count]");

        const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        countEls.forEach((el) => (el.textContent = String(count)));

        if (!items.length) {
            if (emptyEl) emptyEl.hidden = false;
            if (filledEl) filledEl.hidden = true;
            if (checkoutBtn) checkoutBtn.disabled = true;
            if (totalEl) totalEl.textContent = "$0.00";
            if (tbody) tbody.innerHTML = "";
            return;
        }

        if (emptyEl) emptyEl.hidden = true;
        if (filledEl) filledEl.hidden = false;
        if (checkoutBtn) checkoutBtn.disabled = false;

        if (tbody) {
            tbody.innerHTML = "";
            let total = 0;
            items.forEach((item) => {
                const price = Number(item.price || 0);
                const qty = item.quantity || 0;
                const subtotal = price * qty;
                total += subtotal;

                const tr = document.createElement("tr");

                const tdName = document.createElement("td");
                tdName.textContent = item.name || item.id;

                const tdQty = document.createElement("td");
                tdQty.className = "pl-cart-num";
                const qtyInput = document.createElement("input");
                qtyInput.type = "number";
                qtyInput.min = "1";
                qtyInput.value = String(qty);
                qtyInput.style.width = "3rem";
                qtyInput.addEventListener("change", () => {
                    const q = Math.max(1, Math.floor(Number(qtyInput.value) || 1));
                    window.ShopCart.setItemQuantity(item.id, q);
                    rebuildCartUI();
                });
                tdQty.appendChild(qtyInput);

                const tdPrice = document.createElement("td");
                tdPrice.className = "pl-cart-num";
                tdPrice.textContent = formatMoney(price);

                const tdSubtotal = document.createElement("td");
                tdSubtotal.className = "pl-cart-num";
                tdSubtotal.textContent = formatMoney(subtotal);

                const tdRemove = document.createElement("td");
                const btnRemove = document.createElement("button");
                btnRemove.className = "pl-remove-btn";
                btnRemove.type = "button";
                btnRemove.textContent = "Remove";
                btnRemove.addEventListener("click", () => {
                    window.ShopCart.removeItem(item.id);
                    rebuildCartUI();
                });
                tdRemove.appendChild(btnRemove);

                tr.appendChild(tdName);
                tr.appendChild(tdQty);
                tr.appendChild(tdPrice);
                tr.appendChild(tdSubtotal);
                tr.appendChild(tdRemove);

                tbody.appendChild(tr);
            });
            if (totalEl) totalEl.textContent = formatMoney(total);
        }
    }

    function wireAddToCartButtons() {
        const buttons = document.querySelectorAll("[data-add-to-cart]");
        buttons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-product-id");
                const name = btn.getAttribute("data-product-name");
                const price = Number(btn.getAttribute("data-product-price") || "0");

                let qty = 1;
                if (id === "m8_plate_1") {
                    const input = document.getElementById("m8-qty");
                    if (input) {
                        const val = Number(input.value || "1");
                        qty = Math.max(1, Math.floor(val || 1));
                    }
                }

                window.ShopCart.addItemToCart({
                    id,
                    name,
                    price,
                    quantity: qty,
                });

                rebuildCartUI();
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        wireAddToCartButtons();
        rebuildCartUI();
    });
})();
