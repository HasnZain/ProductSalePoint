
$(() => {
    dateRangePicker('#reportRange', 'This Month');
    getAllCategories();
    getReportsData();
    //getReportsData();
})


$(document).ready(function () {

    $("#reportRange").change(function () {
        getReportsData();
    });

    $("#ddCategories").change(function () {
        let catID = $(this).val();
        getProductsByCategory(catID);
    });

    $("#ddProducts").change(function () {
        getReportsData();
    });

});

const getReportsData = () => {
    let startDate = $('#reportRange').val().split('-')[0] + " 00:00:00";
    let EndDate = $('#reportRange').val().split('-')[1] + " 23:59:59";
    let productID = $("#ddProducts").val();
    let categoryID = $("#ddCategories").val();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`/api/ReportingApi/getAllReportsData?startdate=${startDate}&enddate=${EndDate}&prodID=${productID}&catID=${categoryID}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);
            console.log(data);

            let str = ``;
            if (data.length == 0) {
                str = `<tr><td colspan="6" class="text-center">No data available in the table</td></tr>`;
            }
            else {
                $.each(data, function (index, value) {
                    str += `<tr>
                            <td>${(index + 1)}</td>
                            <td>${value.orderNumber}</td>
                            <td>${value.customerName}</td>
                            <td>${value.productTitle}</td>
                            <td>${value.categoryTitle}</td>
                            <td>${value.productQty}</td>
                        </tr>`;
                });
            }

            $("#reportTBody").html(str);

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

            let str = `<option value="0">Select any category</option>`;
            $.each(data.categories, function (index, value) {
                if (value.isActive == "1") {
                    str += `<option value="${value.catID}">${value.catName}</option>`;
                }
            });

            $("#ddCategories").html(str);

        })
        .catch(error => console.log('error', error));

}

const getProductsByCategory = (categoryID) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`/api/ReportingApi/getProductsByCategory?catID=` + categoryID, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);

            let str = `<option value="0">Select any product</option>`;
            $.each(data, function (index, value) {
                str += `<option value="${value.ProductID}">${value.ProductName}</option>`;
            });

            $("#ddProducts").html(str);
            $("#ddProducts").trigger('change');

        })
        .catch(error => console.log('error', error));

}
