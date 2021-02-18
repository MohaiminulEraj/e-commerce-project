let products = getProductFromDB();
let cartItems = [];
let itemCount = 0;
let temp= -5;
let getIndex = -5;

// if(window.localStorage.getItem('products')){
//     products = JSON.parse(window.localStorage.getItem('products'));
// }

if(window.localStorage.getItem('productsInCart')){
    cartItems = JSON.parse(localStorage.getItem("productsInCart"));
}

// console.log(cartItems);
if(products.length == 0){
    $('#empty').show();
}
displayProduct();
function displayProduct(){
    if(products.length > 0){
        $('#empty').hide();
        for(let i = 0; i<products.length; i++){
            let productList = '<li class="col-lg-3 col-md-4 col-sm-6 mb-5">'+
                                '<div class="card">'+
                                    '<img class="card-img-top" src="'+ products[i].url+'" height="250">'+
                                    '<div class="card-body">'+
                                        '<h5 class="card-title">'+ products[i].name + '</h5>'+
                                        '<h6 class="card-price">$'+ products[i].price + '</h6>'+
                                        '<input id="numOfCart'+i+'" style="margin-bottom: 10px; width: 100%;" type="number" value="1">'+
                                        '<button onclick="addToCart('+i+')" type="submit" class="btn btn-primary">Add to Cart</button>'+
                                        
                                        '<button type="button" style="float: right;" id="productDetails'+i+'" class="btn btn-danger" data-toggle="modal" data-target="#extraLargeModal">Details</button>'+
                                    '</div>'+
                                '</div>'+
                            '</li>'
        
        $("#list").append(productList)
        getIndex = i;
        }
        
    }
}

$('#addNewProduct').click(function(){
    let productId = products.length;
    let name = $('#productName').val();
    let description = $('#productDescription').val();
    let url = $('#productPhoto').val();
    let quantity = $('#productQuantity').val();
    let price = $('#productPrice').val();
    let inCart = 0;
    if(name && description && url && quantity && price){
        let newProduct = {'productId':productId, name:name, description: description, url: url, quantity: parseInt(quantity), price: parseInt(price), inCart: inCart};
        // products.push(newProduct);
        // window.localStorage.setItem('products', JSON.stringify(products));
        addProductToDB(newProduct);
    }
})

for(let i=0; i<products.length; i++){
    $('#productDetails'+i).click(function(){
        $('#title').html(products[i].name)
        if(products[i].quantity>0){
            $('#check-stock').html("In Stock, only " + products[i].quantity +" left");
        }else{
            $('#check-stock').html("Out of Stock");
        }
        document.getElementById("productImg").src = products[i].url;
        $('#productDes').html(products[i].description);
        $('#priceOfProduct').html('$'+products[i].price);
        temp = i;
    })

}


function addToCart(i){
    let totalCost = JSON.parse(localStorage.getItem("totalCost"));
    let numOfCart = $('#numOfCart'+i).val();
    numOfCart = parseInt(numOfCart);
    if(numOfCart > 0){
        if(products[i].quantity >= numOfCart){
            products[i].quantity -= numOfCart;
            products[i].inCart += numOfCart;
            cartNumber(products[i] , numOfCart);
            totalCost += (products[i].price * numOfCart);
            // window.localStorage.setItem("products", JSON.stringify(products));
            updateProductToDB(products[i]._id, products[i].quantity);
            window.localStorage.setItem("totalCost", JSON.stringify(totalCost));
            location.replace("/");
        }
        else if( products[i].quantity <= 0){
            alert("Sorry! This product is no longer available in the stock")
        }
        else{
            alert("Sorry! Only "+ products[i].quantity + " of this product available in the stock")
        }
    }
    else{
        alert("Number has to be greater than 0")
        
    }
}


function onLoadCartNumber(){
    let productNumber = localStorage.getItem('cartNumber');
    if(productNumber){
        $('.cartNum').html(productNumber);
    }
}

function cartNumber(product, numOfCart){
    let productNumber = localStorage.getItem('cartNumber');
    productNumber = parseInt(productNumber);
    if(productNumber){
        localStorage.setItem('cartNumber', JSON.stringify(productNumber + numOfCart));
        $('.cartNum').html(productNumber + numOfCart);
    }
    else {
        localStorage.setItem('cartNumber', JSON.stringify(numOfCart));
        $('.cartNum').html(numOfCart);
    }
    setItems(product, numOfCart);
}

function setItems(product , numOfCart){

    let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
    if(cartItems){
        if(cartItems[product._id] == undefined) {
            cartItems = {
                ...cartItems,
                [product._id]: product
            }
        }
        // if(cartItems[product.productId].quantity>0){
        //     cartItems[product.productId].quantity -= numOfCart;
        // }
        // cartItems[product.productId].inCart += numOfCart;
    }
    else {
        // product.inCart = numOfCart;
        cartItems = {
            [product._id]: product
        }
    }
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

$('#removeProduct').click(function(){
    let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
    let cartNumber = JSON.parse(localStorage.getItem('cartNumber'));
    let cartCost = localStorage.getItem('totalCost');
    if(temp>-1){
        // products.splice(temp, 1);
        if(cartItems){
            cartNumber -= cartItems[temp].inCart;
            cartCost -= (cartItems[temp].price * cartItems[temp].inCart);
            delete cartItems[temp];
        }else{
            cartNumber = 0;
            cartCost = 0;
        }
        
        // let totalCost = JSON.parse(localStorage.getItem("totalCost"));
        // window.localStorage.setItem("products", JSON.stringify(products));
        console.log(products[temp]._id);
        if(products[temp+1]){
            products[temp+1].productId=products[temp].productId;
            // updateProductToDB(products[temp+1]._id, products[temp+1]);
        }
        deleteProductFromDB(products[temp]._id);
        window.localStorage.setItem('productsInCart', JSON.stringify(cartItems));
        window.localStorage.setItem("totalCost", JSON.stringify(cartCost));
        window.localStorage.setItem("cartNumber", JSON.stringify(cartNumber));
        location.replace("/");
    }
})


function totalCost(product, numOfCart){
    let cartCost = localStorage.getItem('totalCost');
    product.price = parseInt(product.price)
    if(cartCost){
        cartCost = parseInt(cartCost);
        localStorage.setItem("totalCost", JSON.stringify(cartCost +=  numOfCart * product.price))
    }
    else{
        localStorage.setItem("totalCost", JSON.stringify(numOfCart * product.price))
    }
}

function displayCart(){
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let cartCost = window.localStorage.getItem('totalCost');

    cartItems = Object.values(cartItems);
    // for(let i=0; i<products.length; i++){
    //     if(products[i].inCart>0){
    //         let productsinTheList = `<ul class="cart-row list-unstyled">
    //         <li class="cart-item cart-column">
    //             <img class="cart-item-image" src="${products[i].url}" width="100" height="100">
    //             <span class="cart-item-title">${products[i].name}</span>
    //         </li>
    //         <span class="cart-available cart-column">${products[i].quantity} item left</span>
    //         <span class="cart-price cart-column">${products[i].price}</span>
    //         <li class="cart-quantity cart-column">
    //             <input id="numOfUpdatedCart${products[i].productId}" class="cart-quantity-input" type="number" value="${cartItems[i].inCart}">
    //             <button onclick="updateFromCart(${products[i].productId})" id="updateIcon" type="submit" class="btn btn-info updateIcon" data-original-title="Update"><i class="fas fa-sync-alt btn-info"></i></button>
    //             <button onclick="removeFromCart(${products[i].productId})" class="btn btn-danger" type="button">REMOVE</button>
    //             </li>
    //         </ul>`
    //         $("#cartList").append(productsinTheList)
    //     }
    // }
            // //------------------------------------------------------
        // Object.values(cartItems).map(item => {
            for(let i=0; i<cartItems.length; i++){
                var item = cartItems[i];
            let productsinTheList = `<ul class="cart-row list-unstyled">
        <li class="cart-item cart-column">
            <img class="cart-item-image" src="${item.url}" width="100" height="100">
            <span class="cart-item-title">${item.name}</span>
        </li>
        <span class="cart-available cart-column">${item.quantity} item left</span>
        <span class="cart-price cart-column">${item.price}</span>
        <li class="cart-quantity cart-column">
            <input id="numOfUpdatedCart${item.productId}" class="cart-quantity-input" type="number" value="${item.inCart}">
            <button onclick="updateFromCart(${i})" id="updateIcon" type="submit" class="btn btn-info updateIcon" data-original-title="Update"><i class="fas fa-sync-alt btn-info"></i></button>
            <button onclick="removeFromCart(${i})" class="btn btn-danger" type="button">REMOVE</button>
            </li>
        </ul>`
        $("#cartList").append(productsinTheList)
        }

    $('.cart-total-price').html('$'+cartCost);

    
}
// let cartItems = JSON.parse(localStorage.getItem("productsInCart"));

function removeFromCart(index){
    cartItems = Object.values(cartItems);

    // console.log(products[index]);
    // cartItems[index]._id=products[index];
    // console.log(cartItems[index].name);
    console.log(cartItems[index])
    let cartNumber = parseInt(JSON.parse(localStorage.getItem("cartNumber")));
    cartNumber -= cartItems[index].inCart;
    let totalCost = JSON.parse(localStorage.getItem("totalCost"));
    totalCost -= (cartItems[index].price * cartItems[index].inCart);
    // cartNumber -= products[index].inCart;
    // cartItems[index].inCart = 0;
    // var totalCost = 
    products[index].quantity += cartItems[index].inCart;

    // delete cartItems[index];
    cartItems.splice(cartItems, 1)
    window.localStorage.setItem("totalCost", JSON.stringify(totalCost));
    window.localStorage.setItem("cartNumber", JSON.stringify(cartNumber));
    window.localStorage.setItem("productsInCart", JSON.stringify(cartItems));
    updateProductToDB(products[index]._id, products[index].quantity);

    // window.localStorage.setItem("products", JSON.stringify(products));
    location.replace("/shoppingCart");
}



function updateFromCart(index){
    cartItems = Object.values(cartItems);
    console.log(cartItems);
    let cartNumber = JSON.parse(localStorage.getItem("cartNumber"));
    let totalCost = JSON.parse(localStorage.getItem("totalCost"));
    let numOfCart = $('#numOfUpdatedCart'+index).val();

    if(numOfCart>cartItems[index].quantity && cartItems[index].quantity - (numOfCart - cartItems[index].inCart) < 0){
        alert("Sorry! Only "+ cartItems[index].quantity + " of this product available in the stock");
    }
    else if(numOfCart > 0 && cartItems[index].quantity >= 0){
            if(numOfCart>cartItems[index].inCart){
                let cart = numOfCart - cartItems[index].inCart;
                cartItems[index].inCart += cart;
                products[index].inCart += cart;
                cartItems[index].quantity -= cart;
                products[index].quantity -= cart;
                totalCost += (cartItems[index].price * cart);
                cartNumber += cart;
            }
            else if(numOfCart<cartItems[index].inCart && cartItems[index].quantity >= 0){
                let cart = cartItems[index].inCart - numOfCart;
                cartItems[index].inCart -= cart;
                products[index].inCart -= cart;
                cartItems[index].quantity += cart;
                products[index].quantity += cart;
                totalCost -= (cartItems[index].price * cart);
                cartNumber -= cart;
            }
            window.localStorage.setItem("productsInCart", JSON.stringify(cartItems));
            // window.localStorage.setItem("products", JSON.stringify(products));
            updateProductToDB(products[index]._id, products[index].quantity);
            window.localStorage.setItem("totalCost", JSON.stringify(totalCost));
            window.localStorage.setItem("cartNumber", JSON.stringify(cartNumber));
            location.replace("/shoppingCart");
        }
        else{
            alert("Number has to be greater than 0");
        }
}





$('#increaseQuantity').click(function(){
    if(temp>-1){
        let cartItems = JSON.parse(localStorage.getItem("productsInCart"));
        let newQuantity = $('#increaseVal').val();
        newQuantity = parseInt(newQuantity);
        if(newQuantity>0){
                    products[temp].quantity += newQuantity;
                    // if(cartItems){
                    //     cartItems[temp].quantity += newQuantity;
                    //     window.localStorage.setItem("productsInCart", JSON.stringify(cartItems));
                    // }
            // window.localStorage.setItem("products", JSON.stringify(products));
            updateProductToDB(products[temp]._id, products[temp].quantity);
            location.replace("/")
            }

        else{
            alert("Number has to be greater than 0");
        }
    }
})



$('#purchasebtn').click(function(){
    alert("Thank you for purchasing from us");
    for(let i=0; i<products.length; i++){
        products[i].inCart = 0;
        // updateProductToDB(products[i]._id, products[i].quantity);
    }
    let totalCost = JSON.parse(localStorage.getItem('totalCost'));
    totalCost = 0;
    // localStorage.setItem("products", JSON.stringify(products));
    localStorage.removeItem('productsInCart');
    localStorage.removeItem('cartNumber');
    localStorage.setItem('totalCost', JSON.stringify(totalCost));
    location.replace("/shoppingCart");
})


onLoadCartNumber();
displayCart();
