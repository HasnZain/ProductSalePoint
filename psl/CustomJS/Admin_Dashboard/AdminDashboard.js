$(() => {
    $(".loading").show();
    window.setTimeout(function () {
        getAllData();
        getAllProducts();
        getAllCategories();

        window.setTimeout(function () {
            getOrdersPlaced();
            getOrdersInProgress();
            getOrdersDispatched();
            getOrdersDelivered();
        }, 300);
    }, 1500);
})

const getAllData = () => {
    console.log("All Data");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`/api/AdminDashboardApi/getAllData`, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);
            console.log(typeof result)
            $("#noOfAdmins").text(data[0].Admins);
            $("#noOfUsers").text(data[0].Users);
            $("#noOfCategories").text(data[0].Categories);
            $("#noOfProducts").text(data[0].Products);

            $(".loading").hide();
            $(".initialDiv").hide();
            $("#dashboardSection").show();

        })
        .catch(error => console.log('error', error));

}


const getAllProducts = () => {
    console.log("All Products");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`/api/ProductApi/getAllProductsForAdmin`, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);

            let str = ``;
            $.each(data.products, function (index, value) {
                let status = "InActive";
                if (value.isActive == "1")
                    status = "Active";
                
                if (value.Qty > 5) {
                    str = `<tr>
                            <td>${index + 1}</td>
                            <td id="PTitle_${value.ProductID}">${value.ProductName}</td>
                            <td>${value.catTitle}</td>
                            <td id="PPrice_${value.ProductID}">${formatPrice(value.price)}</td >
                            <td id="PQty_${value.ProductID}">${value.Qty}</td>
                            <td>${status}</td>
                            </tr>`;
                }
                else {
                    str = `<tr style="background: #f2dede;">
                            <td>${index + 1}</td>
                            <td id="PTitle_${value.ProductID}">${value.ProductName}</td>
                            <td>${value.catTitle}</td>
                            <td id="PPrice_${value.ProductID}">${formatPrice(value.price)}</td>
                            <td id="PQty_${value.ProductID}">${value.Qty}</td>
                            <td>${status}</td>
                            </tr>`;
                }
                

                $("#productTBody").append(str);
            });

        })
        .catch(error => console.log('error', error));

}

const getAllCategories = () => {
    console.log("All Category");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`/api/CategoryApi/getAllCategories`, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);

            let str = ``; let status = "InActive";
            $.each(data.categories, function (index, value) {
                if (value.isActive == "1")
                    status = "Active";
                str = `<tr>
                            <td>${index + 1}</td>
                            <td>${value.catName}</td>
                            <td>${status}</td>
                            </tr>`;

                $("#catTable").append(str);
            });

        })
        .catch(error => console.log('error', error));

}


const getOrdersPlaced = () => {
    console.log("All Placed");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`/api/AdminDashboardApi/getOrdersPlaced`, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);

            let str = ``;
            $.each(data, function (i, item) {
                str += `<tr>
                            <td>${(i + 1)}</td>
                            <td>${item.FullName}</td>
                            <td>${item.InsertedDatetime}</td>
                            <td>PKR ${item.Shipping_Charges}</td>
                            <td>PKR ${formatPrice(item.Ord_Total)}</td>
                            <td>${item.Payment_Method}</td>
                            <td>${item.Ord_Status}</td>
                        </tr>`;
            });
            $("#ordersPlacedTBody").html(str);
            $("#ordersPlacedTable").dataTable();

        })
        .catch(error => console.log('error', error));

}


const getOrdersInProgress = () => {
    console.log("All In Progress");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`/api/AdminDashboardApi/getOrdersInProgress`, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);

            let str = ``;
            $.each(data, function (i, item) {
                str += `<tr>
                            <td>${(i + 1)}</td>
                            <td>${item.FullName}</td>
                            <td>${item.InsertedDatetime}</td>
                            <td>PKR ${item.Shipping_Charges}</td>
                            <td>PKR ${formatPrice(item.Ord_Total)}</td>
                            <td>${item.Payment_Method}</td>
                            <td>${item.Ord_Status}</td>
                        </tr>`;
            });
            $("#ordersInProgressTBody").html(str);
            $("#ordersInProgressTable").dataTable();

        })
        .catch(error => console.log('error', error));

}


const getOrdersDispatched = () => {
    console.log("All Dispatched");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`/api/AdminDashboardApi/getOrdersDispatched`, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);

            let str = ``;
            $.each(data, function (i, item) {
                str += `<tr>
                            <td>${(i + 1)}</td>
                            <td>${item.FullName}</td>
                            <td>${item.InsertedDatetime}</td>
                            <td>PKR ${item.Shipping_Charges}</td>
                            <td>PKR ${formatPrice(item.Ord_Total)}</td>
                            <td>${item.Payment_Method}</td>
                            <td>${item.Ord_Status}</td>
                        </tr>`;
            });
            $("#ordersDispatchedTBody").html(str);
            $("#ordersDispatchedTable").dataTable();

        })
        .catch(error => console.log('error', error));

}


const getOrdersDelivered = () => {
    console.log("All Delivered");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`/api/AdminDashboardApi/getOrdersDelivered`, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);

            let str = ``;
            $.each(data, function (i, item) {
                str += `<tr>
                            <td>${(i + 1)}</td>
                            <td>${item.FullName}</td>
                            <td>${item.InsertedDatetime}</td>
                            <td>PKR ${item.Shipping_Charges}</td>
                            <td>PKR ${formatPrice(item.Ord_Total)}</td>
                            <td>${item.Payment_Method}</td>
                            <td>${item.Ord_Status}</td>
                        </tr>`;
            });
            $("#ordersDeliveredTBody").html(str);
            $("#ordersDeliveredTable").dataTable();

        })
        .catch(error => console.log('error', error));

}
