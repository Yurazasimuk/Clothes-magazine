const productsData = [
    { id: 1, name: "Black Trench Coat", category: "Clothing", price: 3200, oldPrice: 4500, rating: 5,
      image: "https://i.pinimg.com/736x/f6/d6/9c/f6d69c9a335555af19c14ce2404e55bd.jpg",
      description: "High-quality product from MERO collection." },

    { id: 2, name: "Leather Boots", category: "Shoes", price: 2800, oldPrice: null, rating: 4,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=500&auto=format&fit=crop\n",
      description: "Durable real-leather boots." },

    { id: 3, name: "Summer Dress", category: "Clothing", price: 1200, oldPrice: 1600, rating: 5,
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=500&auto=format&fit=crop",
      description: "Light and stylish dress for warm seasons." },

    { id: 4, name: "Urban Sneakers", category: "Shoes", price: 2400, oldPrice: 3000, rating: 4,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop",
      description: "Daily wear sneakers for everyone." },

    { id: 5, name: "Denim Jacket", category: "Clothing", price: 1800, oldPrice: null, rating: 5,
      image: "https://images.unsplash.com/photo-1523205565295-f8e91625443b?q=80&w=500&auto=format&fit=crop",
      description: "Classic denim jacket for men." },

    { id: 6, name: "White Tee", category: "Clothing", price: 600, oldPrice: 900, rating: 4,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500&auto=format&fit=crop",
      description: "Basic comfortable white t-shirt." },

    { id: 7, name: "Classic Leather Bag", category: "Accessories", price: 1500, oldPrice: 2000, rating: 5,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500&auto=format&fit=crop",
      description: "Stylish genuine leather bag." },

    { id: 8, name: "Black Sunglasses", category: "Accessories", price: 800, oldPrice: null, rating: 4,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500&auto=format&fit=crop",
      description: "Premium UV-protective sunglasses." },

    { id: 9, name: "Silver Watch", category: "Accessories", price: 4500, oldPrice: 5000, rating: 5,
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=500&auto=format&fit=crop",
      description: "Elegant stainless steel watch." }
];


document.addEventListener("DOMContentLoaded", () => {
    updateBadge();

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    const product = productsData.find(p => p.id === id);

    if (!product) {
        document.getElementById("productPage").innerHTML =
            "<h2 style='padding:40px;'>Product not found</h2>";
        return;
    }

    renderProduct(product);
    loadReviews(id);
    initReviewSystem(id);
});


function renderProduct(p) {
    const container = document.getElementById("productPage");

    container.innerHTML = `
        <div class="details-image">
            <img src="${p.image}" alt="${p.name}">
        </div>

        <div class="details-info">
            <div class="details-breadcrumb">
                Home / ${p.category.toUpperCase()} / ${p.name.toUpperCase()}
            </div>

            <h1 class="details-title">${p.name}</h1>

            <div class="details-price-block">
                <span class="details-price-new">${p.price} UAH</span>
                ${p.oldPrice ? `<span class="details-price-old">${p.oldPrice} UAH</span>` : ""}
            </div>

            <p class="details-description">${p.description}</p>

            <div class="details-sizes">
                <p>SELECT SIZE</p>
                <div class="size-selector">
                    <button class="size-btn">S</button>
                    <button class="size-btn active">M</button>
                    <button class="size-btn">L</button>
                    <button class="size-btn">XL</button>
                </div>
            </div>

            <div class="add-to-cart-wrapper">
                <button id="addToCartBtn" class="btn-add-cart">ADD TO CART</button>
            </div>
        </div>
    `;

    initSizeSelector();


    document.getElementById("addToCartBtn").addEventListener("click", () => {
        addToCart(p.id);
    });
}


function initSizeSelector() {
    const buttons = document.querySelectorAll(".size-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });
}


function addToCart(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;

    const active = document.querySelector(".size-btn.active");
    const selectedSize = active ? active.innerText : "M";

    const cart = JSON.parse(localStorage.getItem("cart")) || [];


    cart.push({
        ...product,
        selectedSize: selectedSize
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    updateBadge();

    alert(`${product.name} added to cart (size: ${selectedSize})`);
}


function updateBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const badge = document.getElementById("cartBadge");

    if (badge) {
        badge.innerText = cart.length;
        badge.classList.toggle("show", cart.length > 0);
    }
}


function loadReviews(productId) {
    const reviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
    const list = document.getElementById("reviewsList");
    const count = document.getElementById("reviewCount");

    list.innerHTML = "";
    count.innerText = reviews.length + " Reviews";

    reviews.forEach(r => {
        list.innerHTML += `
            <div class="review-card">
                <div class="review-top">
                    <span class="review-user">${r.user}</span>
                    <span class="review-date">${r.date}</span>
                </div>
                <div class="rating">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div>
                <div class="review-text">${r.text}</div>
            </div>
        `;
    });
}

function initReviewSystem(productId) {
    let selectedStars = 0;

    document.querySelectorAll(".star-btn").forEach(star => {
        star.addEventListener("click", () => {
            selectedStars = parseInt(star.dataset.star);

            document.querySelectorAll(".star-btn").forEach(s => s.classList.remove("active"));

            for (let i = 0; i < selectedStars; i++) {
                document.querySelectorAll(".star-btn")[i].classList.add("active");
            }
        });
    });

    document.getElementById("submitReview").addEventListener("click", () => {
        const text = document.getElementById("reviewText").value.trim();

        if (!selectedStars || text === "") {
            alert("Please leave a review and select stars.");
            return;
        }

        const review = {
            user: "User",
            stars: selectedStars,
            text: text,
            date: new Date().toLocaleDateString()
        };

        const reviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
        reviews.push(review);
        localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));

        loadReviews(productId);
        document.getElementById("reviewText").value = "";
    });
}
