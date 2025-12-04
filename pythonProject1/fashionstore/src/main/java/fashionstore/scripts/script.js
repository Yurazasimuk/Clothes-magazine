const productsData = [
  {
    "id": 1,
    "name": "Black Trench Coat",
    "category": "clothing",
    "price": 3200,
    "oldPrice": 4500,
    "rating": 5,
    "isNew": true,
    "image": "https://i.pinimg.com/736x/f6/d6/9c/f6d69c9a335555af19c14ce2404e55bd.jpg"
  },
  {
    "id": 2,
    "name": "Leather Boots",
    "category": "shoes",
    "price": 2800,
    "oldPrice": null,
    "rating": 4,
    "isNew": false,
    "image": "https://images.unsplash.com/photo-1608256246200-53e635b5b69f?q=80&w=500&auto=format&fit=crop"
  },
  {
    "id": 3,
    "name": "Summer Dress",
    "category": "clothing",
    "price": 1200,
    "oldPrice": 1600,
    "rating": 5,
    "isNew": true,
    "image": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=500&auto=format&fit=crop"
  },
  {
    "id": 4,
    "name": "Urban Sneakers",
    "category": "shoes",
    "price": 2400,
    "oldPrice": 3000,
    "rating": 4,
    "isNew": false,
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop"
  },
  {
    "id": 5,
    "name": "Denim Jacket",
    "category": "clothing",
    "price": 1800,
    "oldPrice": null,
    "rating": 5,
    "isNew": false,
    "image": "https://images.unsplash.com/photo-1523205565295-f8e91625443b?q=80&w=500&auto=format&fit=crop"
  }
];

document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('productsContainer');

    if (container) {

        render(productsData);


        const filterBtn = document.getElementById('applyFilterBtn');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => {
                const cat = document.getElementById('categoryFilter').value;
                const price = document.getElementById('priceFilter').value;

                const filtered = productsData.filter(p => {
                    return (cat === 'all' || p.category === cat) &&
                           (!price || p.price <= price);
                });
                render(filtered);
            });
        }
    }


    function render(list) {
        if (!container) return;
        container.innerHTML = '';

        if (list.length === 0) {
            container.innerHTML = '<p style="text-align:center; width:100%;">No products found.</p>';
            return;
        }

        list.forEach(p => {
            let stars = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);

            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="card-image">
                    ${p.isNew ? '<span class="badge-new">NEW</span>' : ''}
                    <span class="btn-fav">♡</span>
                    <img src="${p.image}" alt="${p.name}">
                </div>
                <div class="card-info">
                    <div class="rating">${stars}</div>
                    <p style="font-size: 12px; color:#888; margin:0;">Collection</p>
                    <h3>${p.name}</h3>
                    <div class="sizes">
                        <span>S</span> • <span>M</span> • <span>L</span>
                    </div>
                    <div class="prices">
                        <div class="price-block">
                            <span class="price-new">${p.price} UAH</span>
                            ${p.oldPrice ? `<span class="price-old">${p.oldPrice} UAH</span>` : ''}
                        </div>
                        <button class="btn-detail" onclick="window.addToCart(${p.id})">In detail</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }


    const cartContainer = document.getElementById('cartContainer');
    if (cartContainer) {
        renderCartPage();
    }


    const regForm = document.getElementById('registerForm');
    if(regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Account created! Please login.');
            window.location.href = 'login.html';
        });
    }
});


window.addToCart = function(id) {
    console.log("Attempting to add product ID:", id);


    const product = productsData.find(p => p.id === id);
    if (!product) {
        console.error("Product not found!");
        alert("Error: Product not found.");
        return;
    }


    const activeSizeBtn = document.querySelector(".size-btn.active");
    const selectedSize = activeSizeBtn ? activeSizeBtn.innerText : "M";


    let cart = JSON.parse(localStorage.getItem('cart')) || [];


    cart.push({
        ...product,
        selectedSize: selectedSize
    });


    localStorage.setItem('cart', JSON.stringify(cart));

    console.log("Cart updated:", cart);
    alert(`${product.name} added to bag (size: ${selectedSize})`);
}



window.renderCartPage = function() {
    const container = document.getElementById('cartContainer');
    const totalEl = document.getElementById('cartTotal');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Your bag is empty.</p>';
        if(totalEl) totalEl.innerText = '0';
        return;
    }

    container.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div style="display:flex; align-items:center;">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-info">
                    <h4>${item.name}</h4>
                    <p>Size: M</p>
                    <p style="font-weight:bold; margin-top:5px;">${item.price} UAH</p>
                </div>
            </div>
            <button onclick="window.removeFromCart(${index})" style="color: #cc0000; font-size: 12px; font-weight: 600; border:none; background:none; cursor:pointer;">REMOVE</button>
        `;
        container.appendChild(itemDiv);
    });

    if(totalEl) totalEl.innerText = total;
}


window.removeFromCart = function(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartPage();
}


window.clearCart = function() {
    localStorage.removeItem('cart');
    renderCartPage();
}


window.checkout = function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Your bag is empty!");
        return;
    }
    alert("Order placed successfully!");
    clearCart();
}



window.openProduct = function(id) {
    window.location.href = `product.html?id=${id}`;
}
