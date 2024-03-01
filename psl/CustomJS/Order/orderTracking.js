
$(document).ready(function () {

    var ordID = getParameterByName('ordID');
    $("#orderTrackInput").val(ordID);

    $("#btnOrderTrack").click(function () {
        if (!checkInput($("#orderTrackInput").val())) {
            $(".errText").show();
            window.setTimeout(function () {
                $(".errText").hide();
            }, 1000);
            return false;
        }
        else {
            $(".dvTrackingContainer").hide();
            let orderID = $("#orderTrackInput").val();
            getOrdersByID(orderID);
            window.setTimeout(function () {
                getOrderItemsDtl(orderID);
            }, 300);
        }
    });

});

// Function to retrieve query string parameter value by name
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


const getOrdersByID = (orderID) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`/api/OrderApi/getOrdersByID?orderID=` + orderID, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);
            console.log(data);
            if (data.length == 0) {
                $(".errText").show();
                $(".errText").html("You are not the authorized person for this order id.");
                window.setTimeout(function () {
                    $(".errText").hide();
                }, 2000);
                return false;
            }

            $("#fullName").val(data[0].FullName);
            $("#email").val(data[0].Email);
            $("#phoneNo").val(data[0].PhoneNo);
            $("#country").val(data[0].Country);
            $("#city").val(data[0].City);
            $("#zipCode").val(data[0].ZipCode);
            $("#address").val(data[0].Address);
            $("#orderDateTime").val(data[0].InsertedDatetime);
            $("#orderStatus").val(data[0].Ord_Status);
            $("#totalAmt").val(data[0].Ord_Total);
            $("#paymentMethod").val(data[0].Payment_Method);
            $("#shipping").val(data[0].Shipping_Charges);

            $(".loader").show();
            window.setTimeout(function () {
                $(".loader").hide();
                $(".dvTrackingContainer").show();
            }, 300);

        })
        .catch(error => console.log('error', error));

}

const getOrderItemsDtl = (orderID) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`/api/OrderApi/getOrderItems?orderID=` + orderID, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);
            console.log(data);

            let str = ``, footStr = ``, subTotal = 0;
            $.each(data, function (i, item) {
                subTotal += item.ItemTotal;
                str += `<tr>
                            <td>${(i + 1)}</td>
                            <td class="ProdName">${item.ProductTitle}</td>
                            <td class="ProdDesc">${item.ProdDescription}</td>
                            <td>${item.CatTitle}</td>
                            <td>${item.ItemPrice}</td>
                            <td>${item.ItemQty}</td>
                            <td>${formatPrice(item.ItemTotal)}</td>
                        </tr>`;
            });
            $("#itemDetailTBody").html(str);
            truncateText('.ProdDesc', 30, '.ProdName');
            const shippingCharges = $("#shipping").val();
            const GrandTotal = $("#totalAmt").val();
            footStr = `<tr>
                            <td colspan="5" class="text-right"><strong>Sub Total</strong></td>
                            <td colspan="2" class="text-right"><strong>PKR ${formatPrice(subTotal)}</strong></td>
                        </tr>
                        <tr>
                            <td colspan="5" class="text-right"><strong>Shipping Charges</strong></td>
                            <td colspan="2" class="text-right"><strong>PKR ${formatPrice(shippingCharges)}</strong></td>
                        </tr>
                        <tr>
                            <td colspan="5" class="text-right"><strong>Grand Total</strong></td>
                            <td colspan="2" class="text-right"><strong>PKR ${formatPrice(GrandTotal)}</strong></td>
                        </tr>`;
            $("#itemDetailTFoot").html(footStr);

        })
        .catch(error => console.log('error', error));

}



// to truncate the product description 
function truncateText(element, maxLength, title) {
    $(element).each(function () {
        var text = $(this).text();
        var textTitle = $(this).closest('tr').find(title).text();

        if (text.length > maxLength) {
            var truncatedText = text.substring(0, maxLength) + "...";
            $(this).text(truncatedText);

            // Add "See more" link and popover with unique identifiers
            var uniqueId = 'popover_' + Math.floor(Math.random() * 100000);
            $(this).append('<a class="seeMoreText" href="#" data-toggle="popover" data-content="' + text + '" data-title="' + textTitle + '" data-unique-id="' + uniqueId + '">See more</a>');

            // Initialize popover for this specific "See more" link
            $('[data-unique-id="' + uniqueId + '"]').popover({
                trigger: 'click',
                placement: 'right',
                html: true,
                content: function () {
                    return '<div class="popover-text">' + $(this).data('content') + '</div>';
                },
                title: function () {
                    return '<div class="popover-title">' + $(this).data('title') + '</div>';
                }
            });
        }
    });
}

