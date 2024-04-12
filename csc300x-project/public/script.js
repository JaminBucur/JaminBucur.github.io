// For the feautered deals on index
window.addEventListener('load', function () {
    var deals = Array.from(document.querySelectorAll('.deal'));
    if (deals.length > 0) {
        var currentDeal = 0;
        var intervalId = setInterval(function () { changeDeal(1); }, 7000);

        deals[currentDeal].classList.add('active');

        window.changeDeal = function (direction) {
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
            intervalId = setInterval(function () { changeDeal(1); }, 7000);
        }
    }
});

// Handles file for the bulk upload page
function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        const productsData = event.target.result;
        document.getElementById('products').value = productsData;
        document.getElementById('submitButton').disabled = false;
    };
    reader.readAsText(file);
}

// For the edit product images
var currentIndex = 0;
var images = document.getElementsByClassName("product-image");

function showImage(index) {
    for (var i = 0; i < images.length; i++) {
        if (i === index) {
            images[i].style.display = "block";
        } else {
            images[i].style.display = "none";
        }
    }
    currentIndex = index;
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}

function previousImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
}

// For the collapsible Ingredients and Directions in recipes
function initializeCollapsible() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    initializeCollapsible();
});

// For category and sort selection on products
document.addEventListener('DOMContentLoaded', function() {
    var sortSelect = document.getElementById('sortSelect');
    var categorySelect = document.getElementById('categorySelect');

    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            this.form.submit();
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            this.form.submit();
        });
    }
});