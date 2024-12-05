const cart = [];
        
        function addToCart(productName, price) {
            cart.push({ name: productName, price });
            renderCart();
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            renderCart();
        }

        function renderCart() {
            const cartItems = document.getElementById("cart-items");
            const totalElement = document.getElementById("total");
            cartItems.innerHTML = "";

            let total = 0;
            cart.forEach((item, index) => {
                const div = document.createElement("div");
                div.className = "cart-item";
                div.innerHTML = `
                    <span>${item.name}</span>
                    <span>$${item.price}</span>
                    <button type="button" class="btn btn-danger" onclick="removeFromCart(${index})">Eliminar</button>
                `;
                cartItems.appendChild(div);
                total += item.price;
            });

            totalElement.innerText = `Total: $${total}`;
        }