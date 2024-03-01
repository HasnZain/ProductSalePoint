// Setting the value of cartCount on loading page
$(() => {
    let count = localStorage.getItem("cartCount");
    if (count == null) {
        $("#cartCount").text(0);
    }
    else {
        $("#cartCount").text(count);
    }
})

// On click of AddToCart button
function AddToCart(ProdID) {
    // setting the cart count
    let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;
    cartCount++;
    $("#cartCount").text(cartCount);

    localStorage.setItem("cartCount", cartCount);
    // setting the product array
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let combinedValue = JSON.stringify({
        ProductID: ProdID,
        Qty: 1
    });
    products.push(combinedValue);

    localStorage.setItem("products", JSON.stringify(products));

    $(".loader").show();
    window.setTimeout(function () {
        $(".loader").hide();

        $(".successMessage").show();
        window.setTimeout(function () {
            $(".successMessage").hide();
        }, 2000);

    }, 1000);
}

// On click of AddToCart Detail button
function AddToCartDetail(ProdID) {
    // setting the cart count
    let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;
    cartCount++;
    $("#cartCount").text(cartCount);

    localStorage.setItem("cartCount", cartCount);
    // setting the product array
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let prodCount = $("#prodQtyInput_" + ProdID).val();
    let combinedValue = JSON.stringify({
        ProductID: ProdID,
        Qty: prodCount
    });

    products.push(combinedValue);

    localStorage.setItem("products", JSON.stringify(products));

    $(".successMessageDtl").show();
    window.setTimeout(function () {
        $(".successMessageDtl").hide();
    }, 2000);
}


// For formatting Product Price
function formatPrice(price) {
    price = Math.ceil(price);
    let parts = price.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}


// For clearing Local Storage
function clearLocalStorage() {
    localStorage.clear();
}


// For validation of Inputs
let checkInput = (str) => {
    str = str.trim();
    if (str != "")
        return true;
    else
        return false;
}


// For validation of Email
function validateEmail(email) {
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}