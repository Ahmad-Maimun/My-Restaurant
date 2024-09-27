// ********** Call Function **********
menuResponsive()

function menuResponsive() {
    let menuToggle = document.getElementById('menu-toggle');
    let menuList = document.getElementById('menu-list');
    
    menuToggle.addEventListener('click', function() {
        menuList.classList.toggle('active');
    });
}
// Special Menu
specialCatagories()
randomFoods()
function foodCart(food) {
    return `<div class="col-lg-4 col-md-6">
            <div class="food-cart">
                <div class="img position-relative">
                    <img class="img-fluid w-100" src="${food.image}" alt="Food Image">
                <div class="overly position-absolute">
                    <span>Price: ${food.price}/=</span>
                    <i class="fa-solid fa-star"></i>
                    <span>${food.rating} (${food.rating_count})</span>
                </div>
                </div>
                <div class="cart-text">
                    <h4>${food.name}</h4>
                    <ul class="list-unstyled d-flex flex-wrap">
                        <li>4 chicken legs</li>
                        <li>Chili sauce</li>
                        <li>Soft Drinks</li>
                        <li>4 chicken legs</li>
                        <li>Chili sauce</li>
                        <li>Soft Drinks</li>
                    </ul>
                </div>
                <a href="#" class="cart-btn d-flex justify-content-center align-content-center text-decoration-none">
                    <i class="fa-solid fa-cart-plus"></i>
                    <span>Add to cart</span>
                </a>
            </div>
        </div>`;
}
async function specialCatagories() {
    try {
        let response = await fetch("https://course.divinecoder.com/food-categories")
        let data = await response.json()
        document.getElementById('menu-ul').innerHTML = "";

        data.forEach((item) => {
            document.getElementById('menu-ul').innerHTML += `<li data-id="${item.id}" class="mb-3 mb-lg-0"><a href="#">${item.name}</a></li>`;
        })
        foodItem()
    } catch (error) {

    }
    
}
async function appendFoodItem(link) {
    try {
        let response = await fetch(link)
        let data = await response.json();
        document.getElementById('food-gallery').innerHTML = '';
        
        data = Array.isArray(data) ? data : data.data;
        
        let finalOutput = data.map(food => {
            document.getElementById('food-gallery').innerHTML += foodCart(food);
        })
        
    } catch (error) {
        console.log(error);
    }
}
function randomFoods() {
    appendFoodItem("https://course.divinecoder.com/food/random/6");
}
function foodItem() {
    let lis = document.querySelectorAll('#menu-ul li');
    let finalList = Array.from(lis).map(li => {
        
        li.addEventListener('click', function(event) {
            event.preventDefault();
            let categoryId = li.getAttribute('data-id')
            
            appendFoodItem(`https://course.divinecoder.com/food/by-category/${categoryId}/6`);
        })
        
    })
}