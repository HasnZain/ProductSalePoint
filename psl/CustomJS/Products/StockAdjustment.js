
$(() => {
    getAllProducts();
    $("#alertBox").hide();
})

const getAllProducts = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`/api/ProductApi/getLowStockProducts`, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);
            
            if (data.products.length == 0) {
                $("#productTBody").html(`<tr><td class="text-center" colspan="6"><h5>No Products Found.</h5></td></tr>`);
            }
            else {

                let str = ``;
                $.each(data.products, function (index, value) {
                    str = `<tr>
                            <td>${index + 1}</td>
                            <td id="PTitle_${value.ProductID}" class="ProdName">${value.ProductName}</td>
                            <td class="ProdDesc">${value.ProductDesc}</td>
                            <td id="PCat_${value.ProductID}">${value.catTitle}</td>
                            <td id="PQty_${value.ProductID}">${value.Qty}</td>
                            <td class="m-0 p-1 text-right align-middle">
                                <button class="btn btn-sm btn-warning" title="Edit Product" onclick='FillData("${value.ProductID}", "${value.catID}")'>
                                <i class="fa fa-edit"></i> Edit
                                </button>
                            </td>
                            </tr>`;

                    $("#productTBody").append(str);
                });
                truncateText('.ProdDesc', 30, '.ProdName');
                $("#productTable").DataTable();

            }

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


let FillData = (productID, categoryID) => {
    $("#productID").val(productID);
    let title = $("#PTitle_" + productID).text();
    let category = $("#PCat_" + productID).text();
    let quantity = $("#PQty_" + productID).text();
    $("#productTitle").val(title);
    $("#catName").val(category);
    $("#cStock").val(quantity);

    $('#ProductsModal').modal({ backdrop: false });
    $("#ProductsModal").modal("show");

    var fName = `UpdateProduct(${productID}, ${categoryID})`;
    $("#btnUpdate").attr('onclick', fName)
}

let UpdateProduct = (productID, categoryID) => {

    if (!checkInput($('#productQty').val())) {
        $("#errQty").show();
        window.setTimeout(function () {
            $("#errQty").hide();
        }, 2000);
        return false;
    }

    if (!checkInput($('#rmks').val())) {
        $("#errRmks").show();
        window.setTimeout(function () {
            $("#errRmks").hide();
        }, 2000);
        return false;
    }

    InsertUpdateCall(productID, categoryID, $('#productQty').val(), $('#rmks').val());

}


let InsertUpdateCall = (productID, categoryID, productQty, remarks) => {

    const data = new FormData();
    data.append('PrdctID', productID);
    data.append('CatID', categoryID);
    data.append('PrdctQty', productQty);
    data.append('Remarks', remarks);

    const endpiont = '/api/ProductApi/AdjustStock';
    const options = {
        method: 'POST',
        body: data,
    };
    InsertUpdateData(endpiont, options);
}

const InsertUpdateData = async (endpiont, options) => {
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
        console.log(response);
        $("#alertBox").addClass("alert-success");
        $("#alertBox").html(response.Message);
        $("#alertBox").show();
        window.setTimeout(function () {
            $("#alertBox").hide();
            location.reload();
        }, 2000);
    }
};
