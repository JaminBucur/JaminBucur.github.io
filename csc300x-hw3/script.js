function showDescription(dish) {
  var descriptionDiv = document.getElementById('dish-description');

  if (dish == 'dish1') {
    var description = '<h2>Orange Chicken</h2>' + 'Crispy fried chicken nuggets coated in a tangy and sweet orange sauce, a signature dish at Panda Express. This dish combines the crunchiness of the fried chicken with the zesty flavors of the orange glaze, creating a delightful culinary experience that is loved by many customers at Panda Express.';
  }
  else if (dish == 'dish2') {
    var description = '<h2>Terayaki Chicken</h2>' + 'Juicy chicken pieces marinated in a savory teriyaki sauce and grilled to perfection, a popular choice at Panda Express. The tender chicken absorbs the rich flavors of the teriyaki marinade, resulting in a dish that is both satisfying and flavorful, making it a top pick for those visiting Panda Express.';
  }
  else if (dish == 'dish3') {
    var description = '<h2>Honey Sesame Chicken Breast</h2>' + 'Tender chicken breast strips glazed with a delightful honey sesame sauce, offering a sweet and savory flavor profile at Panda Express. The glazed chicken breast is topped with sesame seeds and mixed with sweet peppers. A delicious combo that is sure to satisfy your taste buds.';
  }
  else if (dish == 'dish4') {
    var description = '<h2>Spicy Chicken Sandwich Deluxe</h2>' + 'A juicy chicken breast that is fried and marinated with spicy seasonings, served on a toasted buttered bun with two pickles, lettuce, tomato, and Pepper Jack Cheese. A flavorful option for those who enjoy a little heat with their meal.';
  }
  else if (dish == 'dish5') {
    var description = '<h2>Cobb Salad</h2>' + 'A fresh bed of mixed greens topped with crumbled bacon, shredded cheese, roasted corn kernels, sliced hard-boiled eggs, and grape tomatoes. Topped with chopped and fried nuggets and your choice of dressing. A healthy and satisfying meal option.';
  }
  else if (dish == 'dish6') {
    var description = '<h2>Grilled Club Sandwich</h2>' + 'Features a boneless chicken breast, marinated and grilled for a tender and juicy taste, served on a toasted multigrain bun with Colby-Jack cheese, applewood smoked bacon, and green leaf lettuce. A delicious and hearty choice for sandwich lovers.';
  }
  else if (dish == 'dish7') {
    var description = '<h2> Grilled Chicken Sub</h2>' + 'A tender grilled chicken sub served on freshly baked bread. Topped with your choice of crisp vegetables and condiments. A healthy and satisfying option for any meal.';
  }
  else if (dish == 'dish8') {
    var description = '<h2> Steak and Cheese Sub</h2>' + 'Juicy steak slices with melted cheese, served hot on a toasted sub roll. Garnished with onions, peppers, and a selection of sauces. A hearty and flavorful choice for steak lovers.';
  }
  else if (dish == 'dish9') {
    var description = '<h2> Subway Wraps</h2>' + 'Light and refreshing wraps filled with a variety of meats, cheeses, and vegetables. Wrapped in a soft tortilla and customized to your liking. Perfect for a quick, on-the-go meal.';
  }
  descriptionDiv.innerHTML = description;
  descriptionDiv.style.display = 'inline';
}

const gallery = document.querySelectorAll('img');

for (let index = 0; index < gallery.length; index++) {
  const element = gallery[index];
  element.addEventListener('click', expand);

}

function expand(event) {
  const smallImage = event.currentTarget;
  const bigImage = document.querySelector(".big");

  if (bigImage) {
    bigImage.classList.remove('big');
    bigImage.classList.add('small');
  }

  smallImage.classList.remove('small');
  smallImage.classList.add('big');
}

let mealPlan = [];
let totalCost = 0;

let addButtons = document.getElementsByClassName('add-button');

for (let i = 0; i < addButtons.length; i++) {
  addButtons[i].addEventListener('click', function () {
    addToMealPlan(this.parentElement);
  });
}

let removeButtons = document.getElementsByClassName('remove-button');

for (let i = 0; i < removeButtons.length; i++) {
  removeButtons[i].addEventListener('click', function () {
    removeFromMealPlan(this.parentElement);
  });
}


function addToMealPlan(dishElement) {
  const dishDetails = dishElement.querySelector('p').textContent.split(' - $');
  const dishName = dishDetails[0];
  const dishPrice = parseFloat(dishDetails[1]);
  mealPlan.push({ name: dishName, price: dishPrice });
  totalCost += dishPrice;
  document.getElementById('total-cost').textContent = totalCost.toFixed(2);
  displayMealPlan();
}

function removeFromMealPlan(dishElement) {
  const dishDetails = dishElement.querySelector('p').textContent.split(' - $');
  const dishName = dishDetails[0];
  const dishPrice = parseFloat(dishDetails[1]);
  const dishIndex = mealPlan.findIndex(dish => dish.name === dishName && dish.price === dishPrice);
  if (dishIndex > -1) {
    mealPlan.splice(dishIndex, 1);
    totalCost -= dishPrice;
    document.getElementById('total-cost').textContent = totalCost.toFixed(2);
  }
  displayMealPlan();
}

function displayMealPlan() {
  const mealPlanElement = document.getElementById('selected-dishes');
  mealPlanElement.innerHTML = '';
  for (let i = 0; i < mealPlan.length; i++) {
    const dish = mealPlan[i];
    mealPlanElement.innerHTML += `<p>${dish.name} - $${dish.price.toFixed(2)}</p>`;
  }
}
