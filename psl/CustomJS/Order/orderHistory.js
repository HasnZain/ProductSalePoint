$(() => {
    getAllOrders();
})

const getAllOrders = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`/api/OrderApi/getAllUserOrders`, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);

            let str = ``;
            if (data.length == 0) {
                str += `<tr>
                            <td colspan="5" class="text-center">No order history</td>
                        </tr>`;
            }
            else {
                $.each(data, function (i, item) {
                    let colorGrp = "";
                    if (item.Status == "In Process") {
                        colorGrp = "bg-info";
                    }
                    else if (item.Status == "Dispatched") {
                        colorGrp = "bg-warning";
                    }
                    else if (item.Status == "Delivered") {
                        colorGrp = "bg-success";
                    }
                    str += `<tr>
                            <td>${item.Ord_ID}</td>
                            <td>${item.returningDate}</td>
                            <td>${formatPrice(item.GrandTotal)}</td>
                            <td class="${colorGrp}">${item.Status}</td>
                            <td><a href="/Order/OrderTracking?ordID=${item.Ord_ID}" class="btn btn-warning btn-sm">Track Order</a></td>
                        </tr>`;
                });
            }

            $("#orderHistoryTable").html(str);

        })
        .catch(error => console.log('error', error));

}
