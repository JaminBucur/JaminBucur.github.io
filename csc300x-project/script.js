var deals = Array.from(document.querySelectorAll('.deal'));
var currentDeal = 0;
var intervalId = setInterval(changeDeal, 7000, 1);

deals[currentDeal].classList.add('active');

function changeDeal(direction) {
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
    intervalId = setInterval(changeDeal, 7000, 1);
}

function previewImage(event) {
    const preview = document.getElementById('product-image-preview');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
    }
}
