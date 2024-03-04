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

            $("#noOfAdmins").text(data.adminsCount);
            $("#noOfUsers").text(data.usersCount);
            $("#noOfCategories").text(data.categoryCount);
            $("#noOfProducts").text(data.productCount);

            $(".loading").hide();
            $(".initialDiv").hide();
            $("#dashboardSection").show();

        })
        .catch(error => console.log('error', error));

}


const getAllProducts = () => {
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
                            <td>${item.returningDate}</td>
                            <td>PKR ${item.ShippingCharges}</td>
                            <td>PKR ${formatPrice(item.GrandTotal)}</td>
                            <td>${item.Method}</td>
                            <td>${item.Status}</td>
                        </tr>`;
            });
            $("#ordersPlacedTBody").html(str);
            $("#ordersPlacedTable").dataTable();

        })
        .catch(error => console.log('error', error));

}


const getOrdersInProgress = () => {
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
                            <td>${item.returningDate}</td>
                            <td>PKR ${item.ShippingCharges}</td>
                            <td>PKR ${formatPrice(item.GrandTotal)}</td>
                            <td>${item.Method}</td>
                            <td>${item.Status}</td>
                        </tr>`;
            });
            $("#ordersInProgressTBody").html(str);
            $("#ordersInProgressTable").dataTable();

        })
        .catch(error => console.log('error', error));

}


const getOrdersDispatched = () => {
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
                            <td>${item.returningDate}</td>
                            <td>PKR ${item.ShippingCharges}</td>
                            <td>PKR ${formatPrice(item.GrandTotal)}</td>
                            <td>${item.Method}</td>
                            <td>${item.Status}</td>
                        </tr>`;
            });
            $("#ordersDispatchedTBody").html(str);
            $("#ordersDispatchedTable").dataTable();

        })
        .catch(error => console.log('error', error));

}


const getOrdersDelivered = () => {
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
                            <td>${item.returningDate}</td>
                            <td>PKR ${item.ShippingCharges}</td>
                            <td>PKR ${formatPrice(item.GrandTotal)}</td>
                            <td>${item.Method}</td>
                            <td>${item.Status}</td>
                        </tr>`;
            });
            $("#ordersDeliveredTBody").html(str);
            $("#ordersDeliveredTable").dataTable();

        })
        .catch(error => console.log('error', error));

}
