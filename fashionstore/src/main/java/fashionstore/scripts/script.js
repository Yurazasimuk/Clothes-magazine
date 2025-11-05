document.addEventListener("DOMContentLoaded", function() {

    // ------------------ Масив товарів ------------------
    let storedProducts = [
        {id: 1, name: "Сукня", description: "Стильна сукня для вечірок", price: 1200, image: "https://via.placeholder.com/150"},
        {id: 2, name: "Кофта", description: "Тепла та зручна кофта", price: 800, image: "https://via.placeholder.com/150"},
        {id: 3, name: "Штани", description: "Модні штани для будь-якого сезону", price: 1000, image: "https://via.placeholder.com/150"},
        {id: 4, name: "Куртка", description: "Модна куртка для прогулянок", price: 1500, image: "https://via.placeholder.com/150"},
        {id: 5, name: "Спідниця", description: "Яскрава спідниця для літа", price: 900, image: "https://via.placeholder.com/150"}
    ];

    // ------------------ Відображення карток товарів ------------------
    function displayProductsCard() {
        let list = document.getElementById("product-list");
        if(!list) return;
        list.innerHTML = "";
        storedProducts.forEach(p=>{
            list.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <p><b>${p.price} грн</b></p>
                <button onclick="addToCart(${p.id})">Додати у кошик</button>
            </div>`;
        });
    }

    // ------------------ Текстовий список товарів ------------------
    function displayProductsText() {
        let list = document.getElementById("product-text-list");
        if(!list) return;
        list.innerHTML = "";
        storedProducts.forEach(p=>{
            list.innerHTML += `<li>${p.name} - ${p.description} - ${p.price} грн 
            <button onclick="addToCart(${p.id})">Додати у кошик</button></li>`;
        });
    }

    // ------------------ Кошик ------------------
    window.addToCart = function(id){
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let product = storedProducts.find(p=>p.id===id);
        if(product){
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`${product.name} додано у кошик!`);
            displayCart();
        }
    }

    function displayCart(){
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let cartDiv = document.getElementById("cart-list");
        let totalDiv = document.getElementById("total");
        if(!cartDiv) return;
        cartDiv.innerHTML = "";
        let total = 0;
        cart.forEach((item,index)=>{
            cartDiv.innerHTML += `<p>${item.name} - ${item.price} грн 
            <button onclick="removeFromCart(${index})">Видалити</button></p>`;
            total += item.price;
        });
        if(totalDiv) totalDiv.innerText = "Сума: " + total + " грн";
    }

    window.removeFromCart = function(index){
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index,1);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    }

    window.checkout = function(){
        localStorage.removeItem("cart");
        displayCart();
        alert("Оплата пройшла успішно!");
    }

    // ------------------ Адмінка ------------------
    function displayAdminProducts(){
        let productsDiv = document.getElementById("admin-products");
        if(!productsDiv) return;
        productsDiv.innerHTML = "";
        storedProducts.forEach((p,i)=>{
            productsDiv.innerHTML += `<p>${p.name} - ${p.price} грн 
            <button onclick="deleteProduct(${i})">Видалити</button></p>`;
        });
    }

    window.deleteProduct = function(index){
        storedProducts.splice(index,1);
        displayAdminProducts();
        displayProductsCard();
        displayProductsText();
    }

    // ------------------ Реєстрація ------------------
    document.getElementById("register-form")?.addEventListener("submit", function(e){
        e.preventDefault();
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        if(localStorage.getItem(username)){
            document.getElementById("message").innerText = "Користувач уже існує!";
        } else {
            localStorage.setItem(username,password);
            document.getElementById("message").innerText = "Реєстрація пройшла успішно!";
        }
    });

    // ------------------ Логін ------------------
    document.getElementById("login-form")?.addEventListener("submit", function(e){
        e.preventDefault();
        let username = document.getElementById("login-username").value;
        let password = document.getElementById("login-password").value;
        let stored = localStorage.getItem(username);
        if(stored && stored === password){
            localStorage.setItem("currentUser", username);
            document.getElementById("login-message").innerText = "Успішний вхід!";
        } else {
            document.getElementById("login-message").innerText = "Невірний логін або пароль";
        }
    });

    // ------------------ Показати все ------------------
    displayProductsCard();
    displayProductsText();
    displayCart();
    displayAdminProducts();
});
