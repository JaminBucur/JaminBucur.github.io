window.addEventListener('load', function() {
    var deals = Array.from(document.querySelectorAll('.deal'));
    if (deals.length > 0) {
        var currentDeal = 0;
        var intervalId = setInterval(function() { changeDeal(1); }, 7000);

        deals[currentDeal].classList.add('active');

        window.changeDeal = function(direction) {
            deals[currentDeal].classList.remove('active');
            deals[currentDeal].classList.add('leaving');
            currentDeal = (currentDeal + direction + deals.length) % deals.length;
            setTimeout(() => {
                deals.forEach((deal, index) => {
                    if (index !== currentDeal) {
                        deal.classList.remove('leaving');
                    }
                });
                deals[currentDeal].classList.add('active');
            }, 2000);
            clearInterval(intervalId);
            intervalId = setInterval(function() { changeDeal(1); }, 7000);
        }
    }
});

window.addEventListener('load', function() {
    let subtotal = 0;
    let tax = 0;
    let deliveryFee = 15;

    function calculateTax(subtotal) {
        return subtotal * 0.0675;
    }

    function updateQuantity(button, change) {
        const parentDiv = button.parentElement;
        const price = parseFloat(parentDiv.querySelector('p').innerText.slice(1));
        const quantityElement = parentDiv.querySelector('.quantity');
        let quantity = parseInt(quantityElement.innerText);
        quantity += change;
        if (quantity < 0) return; 
        quantityElement.innerText = quantity;
        updateTotal(price * change);
    }

    function updateTotal(priceChange) {
        subtotal += priceChange;
        const taxAmount = calculateTax(subtotal);
        const total = subtotal + taxAmount + deliveryFee;
        document.getElementById('subtotal').innerText = "Subtotal: $" + subtotal.toFixed(2);
        document.getElementById('tax').innerText = "Tax: $" + taxAmount.toFixed(2);
        document.getElementById('total').innerText = "Total: $" + total.toFixed(2);
    }

    var addButtons = Array.from(document.querySelectorAll('.add'));
    var removeButtons = Array.from(document.querySelectorAll('.remove'));

    addButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            updateQuantity(button, 1);
        });
    });

    removeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            updateQuantity(button, -1);
        });
    });

    document.getElementById('subtotal').innerText = "Subtotal: $" + subtotal.toFixed(2);
    document.getElementById('tax').innerText = "Tax: $" + tax.toFixed(2);
    document.getElementById('delivery').innerText = "Delivery Fee: $" + deliveryFee.toFixed(2);
    document.getElementById('total').innerText = "Total: $" + (subtotal + tax + deliveryFee).toFixed(2);
});