//CRUD Operations...

function addProductToDB(newProduct){

    $.ajax({
        type: 'POST',
        url: '/product/new',
        data: newProduct,
        success: response => {
            console.log(response);
        },
        error: response => {
            console.log(response);
        }
    })
}

function getProductFromDB(){
    let product = [];
    $.ajax({
        type:'GET',
        url: '/products/all',
        async: false,
        success: response => {
            product = JSON.parse(response)
            // console.log(product[0]._id);
        },
        error: response => {
            console.log(response);
        }
    })
    return product;
}

function updateProductToDB(productId, productQty){

    $.ajax({
        type: 'PUT',
        url: '/product/update/'+productId+'/'+productQty,
        data: productId,
        success: response => {
            console.log(response);
        },
        error: response => {
            console.log(response);
        }
    })
}


function deleteProductFromDB(productId){
    $.ajax({
        type: 'DELETE',
        url: '/product/'+productId,
        data: productId,
        success: response => {
            console.log(response);
        },
        error: response => {
            console.log(response);
        }
    })
}