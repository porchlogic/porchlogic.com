(function () {
    "use strict";

    const CART_STORAGE_KEY = "porchlogic_cart";

    function readCart() {
        try {
            const raw = sessionStorage.getItem(CART_STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed;
        } catch (e) {
            console.error("Failed to read cart from sessionStorage", e);
            return [];
        }
    }

    function writeCart(items) {
        try {
            sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items || []));
        } catch (e) {
            console.error("Failed to write cart to sessionStorage", e);
        }
    }

    function getCartItems() {
        return readCart();
    }

    function saveCartItems(items) {
        writeCart(items);
    }

    function getCartCount() {
        return readCart().reduce((sum, item) => sum + (item.quantity || 0), 0);
    }

    function addItemToCart(item) {
        const items = readCart();
        const existingIdx = items.findIndex((i) => i.id === item.id);
        const qtyToAdd = item.quantity && item.quantity > 0 ? item.quantity : 1;

        if (existingIdx >= 0) {
            items[existingIdx].quantity += qtyToAdd;
        } else {
            items.push({
                id: item.id,
                name: item.name || "",
                price: Number(item.price || 0),
                quantity: qtyToAdd,
            });
        }
        writeCart(items);
    }

    function setItemQuantity(id, qty) {
        const q = Math.max(0, Math.floor(qty || 0));
        const items = readCart();
        const idx = items.findIndex((i) => i.id === id);
        if (idx === -1) return;
        if (q === 0) {
            items.splice(idx, 1);
        } else {
            items[idx].quantity = q;
        }
        writeCart(items);
    }

    function removeItem(id) {
        const items = readCart().filter((i) => i.id !== id);
        writeCart(items);
    }

    function clearCart() {
        writeCart([]);
    }

    const api = {
        getCartItems,
        saveCartItems,
        getCartCount,
        addItemToCart,
        setItemQuantity,
        removeItem,
        clearCart,
    };

    window.ShopCart = api;

    document.addEventListener("DOMContentLoaded", function () {
        const countEls = document.querySelectorAll("[data-cart-count]");
        const count = api.getCartCount();
        countEls.forEach((el) => {
            el.textContent = String(count);
        });
    });
})();
