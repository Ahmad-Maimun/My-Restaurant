// ********** Call Function **********
menuResponsive();
function menuResponsive() {
    let menuToggle = document.getElementById('menu');
    let menuList = document.getElementById('menu-list');

menuToggle.addEventListener('click', function() {
    menuList.classList.toggle('active');
});
}


specialCatagories()
randomFoods()
removeItem()
quantityHandler()
let activeFoodItems = [];
let activeCartItems = [];
cartItemCount();

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
                <a href="#" data-id="${food.id}" class="${food.isAddedToCart ? "active" : ''} cart-btn d-flex justify-content-center align-content-center text-decoration-none">
                    <i class="fa-solid fa-cart-plus"></i>
                    <span>${food.isAddedToCart ? "Added To Cart" : "Add To Cart"}</span>
                </a>
            </div>
        </div>`;
}
async function specialCatagories() {
    try {
        let response = await fetch("https://course.divinecoder.com/food-categories")
        let data = await response.json()
        document.getElementById('menu-ul').innerHTML = "";
        document.getElementById('menu-ul').innerHTML = data.map(item => `<li data-id="${item.id}" class="mb-3 mb-xl-0"><a href="#">${item.name}</a></li>`).join('');

        foodItem()
    } catch (error) {
        console.log(error);
        
    }
    
}
async function appendFoodItem(link, callback = () => {}) {
    try {
        let response = await fetch(link)
        let data = await response.json();
        document.getElementById('food-gallery').innerHTML = '';
        
        data = Array.isArray(data) ? data : data.data;

        activeFoodItems = data.map(item => {
            let checkActivity = activeCartItems.some(activeItem => activeItem.id == item.id);
            return {
                ...item,
                isAddedToCart: checkActivity, 
            }
        })

        document.getElementById('food-gallery').innerHTML = activeFoodItems.map(food => foodCart(food)).join('');
         
        callback();

        addToCartHandler()
        
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
            li.classList.add('active');
            
            appendFoodItem(`https://course.divinecoder.com/food/by-category/${categoryId}/6`, () => {
                li.classList.remove('active');
            });
        })
    
    })
}
function cartItemCount() {
    let cartCountElem = document.querySelectorAll('.cart-item-count');
    let count = activeCartItems.length;
    count = count > 9 ? count : '0' + count;
    
    Array.from(cartCountElem).forEach(element => {
        if (count > 0) {
            element.classList.remove('d-none');
        } else {
            element.classList.add('d-none');
        }
        element.textContent = count;
    })
}
function addToCartHandler() {
    let addToCartBtn = document.querySelectorAll('.cart-btn');
    Array.from(addToCartBtn).forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            let id = btn.getAttribute('data-id');
            let cartItem = activeFoodItems.find(item => {
                return item.id == id;
            })
            let checkActivity = activeCartItems.some(item => item.id == id)
            
            if (checkActivity == false) {
                activeCartItems.push({
                    image: cartItem.image,
                    name: cartItem.name,
                    price: Number(cartItem.price),
                    quantity: 1,
                    total: Number(cartItem.price),
                    id: cartItem.id
                })        
            }
            
            cartItemCount();
            appendCartItem();
            changeBtn(id)
            totalCount()
        })
    })
}
function appendCartItem() {
    let cartHtml = (food) => {
        return `<tr>
                    <td>
                        <img src="${food.image}" alt="Image">
                    </td>
                    <td>
                        <span class="table-title flex-nowrap">${food.name}</span>
                    </td>
                    <td>
                        <span class="price flex-nowrap">TK: ${food.price}</span>
                    </td>
                    <td>
                       <div class="quantity-area d-flex align-items-center">
                        <span class="Quantity d-inline-block">${food.quantity}</span>
                        <div class="plus-minus">
                            <ul class="list-unstyled d-flex m-0">
                                <li data-id="${food.id}" class="quantity-decrement d-flex justify-content-center align-items-center"><i class="fa-solid fa-minus"></i></li>
                                <li data-id="${food.id}" class="quantity-increment d-flex justify-content-center align-items-center"><i class="fa-solid fa-plus"></i></li>
                            </ul>
                        </div>
                       </div>
                    </td>
                    <td>
                        <span class="total d-block">TK: ${food.total}</span>
                    </td>
                    <td>
                        <span class="action">
                            <i data-id="${food.id}" class="delete-cart fa-solid fa-trash"></i>
                        </span>
                    </td>
                  </tr>`;
    }
    let cartItemLoop = activeCartItems.map(food => {
        return cartHtml(food);
    })
    document.getElementById('cart_item_table').innerHTML = cartItemLoop.join('');
}
function changeBtn(id) {
    let myButton = document.querySelector(`.cart-btn[data-id="${id}"]`) 
    myButton.classList.toggle('active');
    if (myButton.classList.contains('active')) {
        myButton.querySelector('span').textContent = 'Added To Cart';
    } else {
        myButton.querySelector('span').textContent = 'Add To Cart';
    }
}
function removeItem() {
    let cartTable = document.getElementById('cart_item_table');
    cartTable.addEventListener('click', function(event) {
        let checkElem = event.target;
        if (event.target.classList.contains('delete-cart')) {
            let id = event.target.getAttribute('data-id')
            activeCartItems = activeCartItems.filter(function(item) {
                return item.id != id;
            });
            appendCartItem();
            cartItemCount();
            changeBtn(id);
            totalCount();
        }
    })
}
function totalCount() {
    let count = activeCartItems.reduce((t, n) => {
        return (t + n.total);
    }, 0);
    let totalText = `Total Amount: ${count} TK`;
    document.getElementById('total-count').innerHTML = totalText;
}


function quantityHandler() {
    let cartTable = document.getElementById('cart_item_table');
    cartTable.addEventListener('click', function(event) {
        let activeTag = event.target;
        

        if (event.target.closest('.quantity-increment')) {
            let id = event.target.closest('.quantity-increment').getAttribute('data-id');
            let targetItem = activeCartItems.find(item => item.id == id);
            
            if (targetItem.quantity < 5) {
                
                targetItem = {
                    ...targetItem,
                    quantity: targetItem.quantity + 1,
                    total: targetItem.total + targetItem.price
                }
                activeCartItems = activeCartItems.map(item => {
                    if (item.id == id) {
                        return targetItem;
                    } else {
                        return item;
                    }
                })
                appendCartItem()
                totalCount()
                
            }
        } 

        if (event.target.closest('.quantity-decrement')) {
            let id = event.target.closest('.quantity-decrement').getAttribute('data-id');
            let targetItem = activeCartItems.find(item => item.id == id);
            
            if (targetItem.quantity > 1) {
                
                targetItem = {
                    ...targetItem,
                    quantity: targetItem.quantity - 1,
                    total: targetItem.total - targetItem.price
                }
                activeCartItems = activeCartItems.map(item => {
                    if (item.id == id) {
                        return targetItem;
                    } else {
                        return item;
                    }
                })
                appendCartItem()
                totalCount()
                
            }
        }
    })
}