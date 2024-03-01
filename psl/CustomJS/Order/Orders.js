$(() => {
    getAllOrders();
    $("#alertBox").hide();
})

const getAllOrders = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`/api/OrderApi/getAllOrders`, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);

            let str = ``;
            $.each(data, function (i, item) {
                let colorGrp = "";
                if (item.Ord_Status == "In Process") {
                    colorGrp = "bg-info";
                }
                else if (item.Ord_Status == "Dispatched") {
                    colorGrp = "bg-warning";
                }
                else if (item.Ord_Status == "Delivered") {
                    colorGrp = "bg-success";
                }
                str += `<tr>
                            <td>${item.OrderID}</td>
                            <td>${item.FullName}</td>
                            <td id="date_${item.OrderID}">${item.InsertedDatetime}</td>
                            <td>PKR ${item.Shipping_Charges}</td>
                            <td id="amt_${item.OrderID}" amt="${item.Ord_Total}">PKR ${formatPrice(item.Ord_Total)}</td>
                            <td>${item.Payment_Method}</td>
                            <td class="${colorGrp}" id="status_${item.OrderID}">${item.Ord_Status}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="showDetails(${item.OrderID})"><i class="fa-solid fa-eye"></i> Details</button>
                                <button class="btn btn-sm btn-warning" onclick="updateDetails(${item.OrderID})"><i class="fa-solid fa-pen-to-square"></i> Change Status</button>
                            </td>
                        </tr>`;
            });
            $("#ordersTableBody").html(str);
            $("#ordersTable").dataTable();

        })
        .catch(error => console.log('error', error));

}

function showDetails(orderID) {
    getOrdersByID(orderID);
    window.setTimeout(function () {
        getOrderItemsDtl(orderID);
    }, 500);
}

function updateDetails(orderID) {

    let orderDate = $("#date_" + orderID).text();
    let orderAmt = $("#amt_" + orderID).attr('amt');
    let orderStatus = $("#status_" + orderID).text();
    $('#OrderModal').modal({ backdrop: false });
    $("#OrderModal").modal("show");
    $("#modalTitle").html("Update Order Status");
    $("#modalBody").html(`
                <section>
<div class="col-md-12">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="orderID">Order ID</label>
                                    <input type="text" name="orderID" id="orderID" class="form-control" value="${orderID}" readonly />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="orderDate">Order Date</label>
                                    <input type="text" name="orderDate" id="orderDate" class="form-control" value="${orderDate}" readonly />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="orderAmt">Order Amount</label>
                                    <input type="text" name="orderAmt" id="orderAmt" class="form-control" value="${orderAmt}" readonly />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="orderStatus">Order Status</label>
                                    <select id="statusDD" class="form-control">
                                        <option value="Placed">Placed</option>
                                        <option value="In Process">In Process</option>
                                        <option value="Dispatched">Dispatched</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <div class="alert" id="alertBox" role="alert">
                                    </div>
                                </div>
                            </div>
                        </div>
                </section>`);
    $("#modalFooter").html(`<button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">&times; Close</button><button type="button" class="btn btn-primary btn-sm" onclick="updateOrderStatus(${orderID})">Update</button>`);

    $("#statusDD").val(orderStatus);

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

            let str = `<div class="col-md-12">
                    <h4>Customer Information</h4>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" value="${data[0].FullName}" class="form-control" readonly />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="text" value="${data[0].Email}" class="form-control" readonly />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="text" value="${data[0].PhoneNo}" class="form-control" readonly />
                        </div>
                    </div>
                </div>
                <div class="col-md-12">
                    <h4>Shipping Information</h4>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Country</label>
                            <input type="text" value="${data[0].Country}" class="form-control" readonly />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>City</label>
                            <input type="text" value="${data[0].City}" class="form-control" readonly />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Zip Code</label>
                            <input type="text" value="${data[0].ZipCode}" class="form-control" readonly />
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="form-group">
                            <label>Address</label>
                            <input type="text" value="${data[0].Address}" class="form-control" readonly />
                        </div>
                    </div>
                </div>
                <div class="col-md-12">
                    <h4>Order Information</h4>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Order DateTime</label>
                            <input type="text" value="${data[0].InsertedDatetime}" class="form-control" readonly />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Order Status</label>
                            <input type="text" value="${data[0].Ord_Status}" class="form-control" readonly />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Order Amount</label>
                            <input type="text" id="totalAmt" value="${data[0].Ord_Total}" class="form-control" readonly />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Payment Method</label>
                            <input type="text" value="${data[0].Payment_Method}" class="form-control" readonly />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>Shipping Charges</label>
                            <input type="text" id="shipping" value="${data[0].Shipping_Charges}" class="form-control" readonly />
                        </div>
                    </div>
                </div>
                <div class="col-md-12">
                    <table class="table table-condensed table-striped table-bordered">
                        <thead class="bg-info">
                            <tr>
                                <th colspan="7" class="text-center">Item Details</th>
                            </tr>
                            <tr>
                                <th style="width: 5%;">Sr#</th>
                                <th style="width: 15%;">Title</th>
                                <th style="width: 20%;">Description</th>
                                <th style="width: 15%;">Category</th>
                                <th style="width: 10%;">Price</th>
                                <th style="width: 10%;">Quantity</th>
                                <th style="width: 10%;">Total</th>
                            </tr>
                        </thead>
                        <tbody id="itemDetailTBody"></tbody>
                        <tfoot id="itemDetailTFoot" class="bg-success"></tfoot>
                    </table>
                </div>`;

            $('#OrderModal').modal({ backdrop: false });
            $("#OrderModal").modal("show");
            $("#modalTitle").html("Order Details");
            $("#modalBody").html(str);
            $("#modalFooter").html(`<button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">&times; Close</button>`);

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



let updateOrderStatus = (orderID) => {
    var status = $("#statusDD").val();
    const data = new FormData();
    data.append('OrderID', orderID);
    data.append('OrderStatus', status);

    const endpiont = '/api/OrderApi/UpdateOrderStatus';
    const options = {
        method: 'POST',
        body: data,
    };

    UpdateOrder(endpiont, options);
}


const UpdateOrder = async (endpiont, options) => {
    const rawResponse = await fetch(endpiont, options);
    const response = await rawResponse.json();
    if (response.Result == 'False') {
        $("#alertBox").addClass("alert-danger");
        $("#alertBox").html(response.Message);
        $("#alertBox").show();
        window.setTimeout(function () {
            $("#alertBox").hide();
        }, 2000);
    } else {
        $("#alertBox").addClass("alert-success");
        $("#alertBox").html(response.Message);
        $("#alertBox").show();
        window.setTimeout(function () {
            $("#alertBox").hide();
            $("#OrderModal").modal("hide");
            getAllOrders();
        }, 2000);
    }
};