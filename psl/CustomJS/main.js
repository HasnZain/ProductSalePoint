﻿// Setting the value of cartCount on loading page
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
    // setting the product array
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let cartCount = 0;

    // Count the number of unique products
    let uniqueProductIDs = new Set();
    for (let i = 0; i < products.length; i++) {
        let product = JSON.parse(products[i]);
        uniqueProductIDs.add(product.ProductID);
    }
    cartCount = uniqueProductIDs.size;

    // Increment cartCount if the product being added is not already in the cart
    let existingProductIndex = products.findIndex(product => JSON.parse(product).ProductID === ProdID);
    if (existingProductIndex === -1) {
        cartCount++;
    }

    $("#cartCount").text(cartCount);
    localStorage.setItem("cartCount", cartCount);

    // Check if the product already exists in the cart
    if (existingProductIndex !== -1) {
        let existingProduct = JSON.parse(products[existingProductIndex]);
        existingProduct.Qty++;
        products[existingProductIndex] = JSON.stringify(existingProduct);
    } else {
        // If the product doesn't exist, add it to the cart
        let combinedValue = JSON.stringify({
            ProductID: ProdID,
            Qty: 1
        });
        products.push(combinedValue);
    }

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
    // setting the product array
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let prodCount = $("#prodQtyInput_" + ProdID).val();

    // Check if the product is already in the cart
    let existingProductIndex = products.findIndex(product => JSON.parse(product).ProductID === ProdID);

    // If the product exists, update its quantity
    if (existingProductIndex !== -1) {
        let existingProduct = JSON.parse(products[existingProductIndex]);
        existingProduct.Qty += parseInt(prodCount);
        products[existingProductIndex] = JSON.stringify(existingProduct);
    } else {
        // If the product doesn't exist, add it to the cart
        let combinedValue = JSON.stringify({
            ProductID: ProdID,
            Qty: parseInt(prodCount)
        });
        products.push(combinedValue);
    }

    // Count the number of unique products
    let uniqueProductIDs = new Set();
    for (let i = 0; i < products.length; i++) {
        let product = JSON.parse(products[i]);
        uniqueProductIDs.add(product.ProductID);
    }
    let cartCount = uniqueProductIDs.size;

    $("#cartCount").text(cartCount);
    localStorage.setItem("cartCount", cartCount);

    // Update the products in localStorage
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