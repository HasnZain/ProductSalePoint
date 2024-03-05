
var subTotalPrice = 0;
var grandTotalPrice = 0;
var shippingCharges = 50;

$(document).ready(function () {
    $("#alertBox").hide();

    let dataFromLS = localStorage.products;
    let products;

    if (dataFromLS !== undefined) {

        if (dataFromLS === "[]") {
            $(".checkout__form").hide();
            $("#alertBox").addClass("alert-danger");
            $("#alertBox").html("Your Cart is Empty.");
            $("#alertBox").show();
        } else {
            products = JSON.parse(dataFromLS);
            if (products.length === 0) {
                $(".checkout__form").hide();
                $("#alertBox").addClass("alert-danger");
                $("#alertBox").html("Your Cart is Empty.");
                $("#alertBox").show();
            } else {

                products.forEach(function (productString) {
                    let productObject = JSON.parse(productString);
                    let productId = productObject.ProductID;
                    let Quantity = productObject.Qty;

                    getProductDetails(productId, Quantity)
                });

            }
        }
    }
    else {
        $(".checkout__form").hide();
        $("#alertBox").addClass("alert-danger");
        $("#alertBox").html("Your Cart is Empty.");
        $("#alertBox").show();
    }

   


    $('#cash-on-delivery, #easypaisa-jazzcash').change(function () {
        var $this = $(this);
        var $otherCheckbox = $('#cash-on-delivery, #easypaisa-jazzcash').not($this);

        // If both checkboxes are unchecked or the one being clicked is already checked
        if (!$this.is(":checked") || $otherCheckbox.is(":checked")) {
            // Uncheck the other checkbox and check the one being clicked
            $otherCheckbox.prop("checked", false);
            $this.prop("checked", true);
        } else {
            // If the one being clicked is the only checked one, do nothing
        }

        // Output status for debugging
        console.log($this.attr('id') + " is " + ($this.is(":checked") ? "checked" : "unchecked"));
        console.log($otherCheckbox.attr('id') + " is " + ($otherCheckbox.is(":checked") ? "checked" : "unchecked"));
    });


});



//Load Product Detail
const getProductDetails = (prodID, Quantity) => {
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
            let str = `<li itemID="${data.ProductID}" itemPrice="${data.price}" itemQty="${Quantity}" itemTotal="${totalAmtRow}"><strong>${data.ProductName}</strong></br><small> x ${Quantity}</small><span>PKR ${formatPrice(totalAmtRow)}</span></li>`;

            $("#cart_List").append(str);
            $("#subTotal").text("PKR " + formatPrice(subTotalPrice));
            $("#shipping").text(shippingCharges);
            $("#grandTotal").text("PKR " + formatPrice(grandTotalPrice));
            $('#grandTotal').attr("total", grandTotalPrice)

        })
        .catch(error => {
            console.log('error', error);
        });
}



function verifyData() {

    if (!checkInput($('#fullName').val())) {
        $("#errFullName").show();
        window.setTimeout(function () {
            $("#errFullName").hide();
        }, 2000);
        return false;
    }

    if (!checkInput($('#country').val())) {
        $("#errCountry").show();
        window.setTimeout(function () {
            $("#errCountry").hide();
        }, 2000);
        return false;
    }

    if (!checkInput($('#city').val())) {
        $("#errCity").show();
        window.setTimeout(function () {
            $("#errCity").hide();
        }, 2000);
        return false;
    }

    if (!checkInput($('#address').val())) {
        $("#errAddress").show();
        window.setTimeout(function () {
            $("#errAddress").hide();
        }, 2000);
        return false;
    }

    if (!checkInput($('#code').val())) {
        $("#errCode").show();
        window.setTimeout(function () {
            $("#errCode").hide();
        }, 2000);
        return false;
    }

    if (!checkInput($('#number').val())) {
        $("#errNumber").show();
        $("#errNumber").html("Phone Number is missing");
        window.setTimeout(function () {
            $("#errNumber").hide();
        }, 2000);
        return false;
    }

    if ($('#number').val().length < 11 || $('#number').val().length > 11) {
        $("#errNumber").show();
        $("#errNumber").html("Phone number is not in correct format");
        window.setTimeout(function () {
            $("#errNumber").hide();
        }, 2000);
        return false;
    }

    if (!checkInput($('#email').val())) {
        $("#errEmail").show();
        $("#errEmail").html("Email is missing");
        window.setTimeout(function () {
            $("#errEmail").hide();
        }, 2000);
        return false;
    } else {
        if (!validateEmail($('#email').val())) {
            $("#errEmail").show();
            $("#errEmail").html("Email is not in correct format");
            window.setTimeout(function () {
                $("#errEmail").hide();
            }, 2000);
            return false;
        }
    }

    if (!$('#cash-on-delivery').is(":checked") && !$('#easypaisa-jazzcash').is(":checked")) {
        $("#errMethod").show();
        $("#errMethod").html("Payment Method not selected");
        window.setTimeout(function () {
            $("#errMethod").hide();
        }, 2000);
        return false;
    }

    // let proDuctID = $("#cart_List li:nth-child(2)").attr("itemID")
    let total = $('#grandTotal').attr("total");
    let shipping = $("#shipping").text();

    InsertOrderCall($('#fullName').val(), $('#country').val(), $('#city').val(), $('#address').val(), $('#code').val(), $('#number').val(), $('#email').val(), total, shipping)
}

function InsertOrderCall(name, country, city, address, code, number, email, total, shipping) {
    let method = "", itemsArray = [];
    if ($('#easypaisa-jazzcash').is(":checked")) {
        method = "Easypaisa/Jazzcash";
    }
    else {
        method = "Cash On Delivery";
    }

    // Iterate through <li> and get data
    $('#cart_List li:not(:first)').each(function () {
        let itemID = $(this).attr('itemID');
        let itemQty = $(this).attr('itemQty');
        let itemTotal = $(this).attr('itemTotal');
        let itemPrice = $(this).attr('itemPrice');

        let itemObj = {
            "itemID": itemID,
            "itemQty": itemQty,
            "itemTotal": itemTotal,
            "itemPrice": itemPrice
        };

        itemsArray.push(itemObj);
    });

    // Convert the itemsArray to JSON format
    var jsonData = JSON.stringify(itemsArray);

    const data = new FormData();
    data.append('Name', name);
    data.append('Country', country);
    data.append('City', city);
    data.append('Address', address);
    data.append('Zip', code);
    data.append('Number', number);
    data.append('Email', email);
    data.append('Total', total);
    data.append('Shipping', shipping);
    data.append('Method', method);
    data.append('ItemJson', jsonData);

    const endpiont = '/api/OrderApi/InsertOrder';
    const options = {
        method: 'POST',
        body: data,
    };
    InsertOrderData(endpiont, options);
}

const InsertOrderData = async (endpiont, options) => {
    const rawResponse = await fetch(endpiont, options);
    const response = await rawResponse.json();
    if (response.Result == 'Fail') {
        $("#alertBox").addClass("alert-danger");
        $("#alertBox").html(response.Message);
        $("#alertBox").show();
        window.setTimeout(function () {
            $("#alertBox").hide();
        }, 2000);
    } else {
        $(".checkout__form").hide();
        clearLocalStorage();
        $("#alertBox").addClass("alert-success");
        $("#alertBox").html(response.Message);
        $("#alertBox").show();
        window.setTimeout(function () {
            $("#alertBox").hide();
            window.location.href = "/Order/OrderHistory";
        }, 2000);
    }
};
