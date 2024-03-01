
var subTotalPrice = 0;
var grandTotalPrice = 0;
var shippingCharges = 50;

$(document).ready(function () {

    let dataFromLS = localStorage.products;
    let products;

    if (dataFromLS !== undefined) {
        products = JSON.parse(dataFromLS);

        let count = products.length;
        let completed = 0;

        products.forEach(function (productString) {
            let productObject = JSON.parse(productString);
            let productId = productObject.ProductID;
            let Quantity = productObject.Qty;

            getProductDetails(productId, Quantity, function () {
                completed++;
                if (completed === count) {
                    productQty(); 
                }
            });
        });
    }
    else {
        let str = `<tr><td class="text-center" colspan="4"><h4 class="text-danger">Your cart is empty.</h4></td></tr>`;
        $("#cartTable").append(str);
    }

});




//Load Product Detail
const getProductDetails = (prodID, Quantity, callback) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`/api/ProductApi/getProductByID?ProdID=` + prodID, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);
            let totalAmtRow = Quantity * data.price;
            subTotalPrice += totalAmtRow;
            grandTotalPrice = subTotalPrice + shippingCharges;
            let str = `<tr rowID="${data.ProductID}">
                                <td class="cart__product__item">
                                    <img src="${data.Pictures[0].PictureURL}" alt="">
                                    <div class="cart__product__item__title">
                                        <h6>${data.ProductName}</h6>
                                        <div class="rating">
                                            <i class="fa fa-star"></i>
                                            <i class="fa fa-star"></i>
                                            <i class="fa fa-star"></i>
                                            <i class="fa fa-star"></i>
                                            <i class="fa fa-star"></i>
                                        </div>
                                    </div>
                                </td>
                                <td class="cart__price">PKR ${formatPrice(data.price)}</td>
                                <td class="cart__quantity">
                                    <div class="pro-qty">
                                    <span class="dec qtybtn">-</span>
                                        <input type="text" id="Qty_${data.ProductID}" value="${Quantity}">
                                    <span class="inc qtybtn">+</span>
                                    </div>
                                </td>
                                <td class="cart__total">PKR ${formatPrice(totalAmtRow)}</td>
                                <td class="cart__close"><span class="icon_close" onclick="deleteRow(this)">&times;</span></td>
                            </tr>`;

            $("#cartTable").append(str);
            $("#subTotal").text("PKR " + formatPrice(subTotalPrice));
            $("#shipping").text(shippingCharges);
            $("#grandTotal").text("PKR " + formatPrice(grandTotalPrice));

            // Call the callback function if it's provided
            if (callback && typeof callback === 'function') {
                callback();
            }
        })
        .catch(error => {
            console.log('error', error);
        });
}



function productQty() {
    var proQty = $('.pro-qty');
    proQty.on('click', '.qtybtn', function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
    });
}



function updateCart() {

    clearLocalStorage();
    let count = 0;
    let products = [];
    $('#cartTable tr').each(function () {
        let prodID = $(this).attr("rowID");

        let thirdColumnData = $(this).find('td:nth-child(3)');
        let prodCount = thirdColumnData.children().find("input").val();

        let combinedValue = JSON.stringify({
            ProductID: prodID,
            Qty: prodCount
        });

        products.push(combinedValue);
        count++;
    });

    // setting the product array
    localStorage.setItem("products", JSON.stringify(products));

    // setting the cart count
    localStorage.setItem("cartCount", count);

    location.reload();
}

function deleteRow(element) {
    $(element).parent().parent().remove();
}

