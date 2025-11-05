// Дані для MVP (можна замінити на API пізніше)
let products = [
    {id:1, name:"Сукня", description:"Стильна сукня", price:1200, image:"https://via.placeholder.com/150"},
    {id:2, name:"Кофта", description:"Тепла кофта", price:800, image:"https://via.placeholder.com/150"},
    {id:3, name:"Штани", description:"Модні штани", price:1000, image:"https://via.placeholder.com/150"}
];

let cart = [];

// Відображення продуктів
function displayProducts() {
    let productList = document.getElementById("product-list");
    productList.innerHTML = "";
    products.forEach(product => {
        let card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Ціна: ${product.price} грн</p>
            <button onclick="addToCart(${product.id})">Додати в кошик</button>
        `;
        productList.appendChild(card);
    });
}

// Додавання в кошик
function addToCart(id) {
    let product = products.find(p => p.id === id);
    cart.push(product);
    alert(`${product.name} додано в кошик!`);
}

window.onload = function() {
    displayProducts();
}
