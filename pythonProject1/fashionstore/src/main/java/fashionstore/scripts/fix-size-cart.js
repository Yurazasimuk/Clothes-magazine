document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.querySelector(".btn-add-cart");

    if (!addBtn) return;

    addBtn.addEventListener("click", () => {
        const active = document.querySelector(".size-btn.active");
        const size = active ? active.innerText : "M";


        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get("id"));


        const products = JSON.parse(localStorage.getItem("productsData")) || [];

        const product =
            (typeof productsData !== "undefined" ? productsData.find(p => p.id === id) : null) ||
            products.find(p => p.id === id);

        if (!product) return;

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart.push({
            ...product,
            size: size
        });

        localStorage.setItem("cart", JSON.stringify(cart));

        alert(product.name + " added (size: " + size + ")");


        const badge = document.getElementById("cartBadge");
        if (badge) {
            badge.innerText = cart.length;
            badge.classList.add("show");
        }
    });
});
