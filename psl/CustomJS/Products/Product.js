var imageCount = 0;

$(() => {
    // dateRangePicker('#reportRange', 'This Month');
    getAllCategories();
    getAllData();
    $("#alertBox").hide();
    $(".divEditImgGroup").hide();
})
$(document).ready(function () {
    $("#btnInsert").hide();
    $("#btnUpdate").hide();

    $("#btnAddNew").click(function () {
        $("#productID").val(0);
        $("#productTitle").val('');
        $("#productDesc").val('');
        $("#productPrice").val('');
        $("#productQty").val('');
        $("#catID").val('');
        $(".dvPrdctPic").show(); 
        $("#prdctPic").val('');
        $(".divEditImgGroup").hide();
        $('#ProductsModal').modal({ backdrop: false });
        $("#ProductsModal").modal("show");
        $("#modalTitle").html("Add Products");
        $("#btnInsert").show();
        $("#btnUpdate").hide();
        getAllCategories();
    });

});


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
            
            let str = ``;
            $.each(data.categories, function (index, value) {
                if (value.isActive == "1") {
                    str += `<option value="${value.catID}">${value.catName}</option>`;
                }
            });

            $("#catID").html(str);

        })
        .catch(error => console.log('error', error));

}


const getAllData = () => {
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
                let imgLst = ``;
                $.each(data.products[index].Pictures, function (i, item) {
                    imgLst += `<img src="${item.PictureURL}" class="prdctsImgs" />`;
                });
                let status = "InActive";
                if (value.isActive == "1")
                    status = "Active";
                str = `<tr>
                            <td>${index + 1}</td>
                            <td id="PTitle_${value.ProductID}" class="ProdName">${value.ProductName}</td>
                            <td class="ProdDesc">${value.ProductDesc}</td>
                            <td>${value.catTitle}</td>
                            <td id="PPrice_${value.ProductID}">${value.price}</td>
                            <td id="PQty_${value.ProductID}">${value.Qty}</td>
                            <td>${status}</td>
                            <td>${imgLst}</td>
                            <td class="m-0 p-1 text-right align-middle">
                                <button class="btn btn-sm btn-warning" title="Edit Product" onclick='FillData("${value.ProductID}")'>
                                <i class="fa fa-edit"></i> Edit
                                </button>
                            </td>
                            </tr>`;
                $("#productTBody").append(str);
            });
            truncateText('.ProdDesc', 30, '.ProdName');
            $("#productTable").DataTable();

        })
        .catch(error => console.log('error', error));

}

let FillData = (productID) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`/api/ProductApi/getProductByID?ProdID=` + productID, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);

            $("#productID").val(data.ProductID);
            $("#productTitle").val(data.ProductName);
            $("#productDesc").val(data.ProductDesc);
            $("#catID").val(data.catID);
            $("#productPrice").val(data.price);
            $("#productQty").val(data.Qty);
            $("#isActive").val(data.isActive);

        })
        .catch(error => console.log('error', error));

    $('#ProductsModal').modal({ backdrop: false });
    $("#ProductsModal").modal("show");
    $("#modalTitle").html("Update Product");

    $(".divEditImgGroup").show();
    $(".dvPrdctPic").hide();
    $("#btnInsert").hide();
    $("#btnUpdate").show();
    var fName = `UpdateProduct(${productID})`;
    $("#btnUpdate").attr('onclick', fName);
    var imageBtn = `addPicsModal(${productID})`;
    $("#btnAddImages").attr('onclick', imageBtn);

    getProductsImages(productID);
}

let InsertProduct = () => {

    if (!checkInput($('#productTitle').val())) {
        $("#errTitle").show();
        window.setTimeout(function () {
            $("#errTitle").hide();
        }, 2000);
        return false;
    }

    if (!checkInput($('#productDesc').val())) {
        $("#errDesc").show();
        window.setTimeout(function () {
            $("#errDesc").hide();
        }, 2000);
        return false;
    }

    if (!checkInput($('#productPrice').val())) {
        $("#errPrice").show();
        window.setTimeout(function () {
            $("#errPrice").hide();
        }, 2000);
        return false;
    }

    if (!checkInput($('#productQty').val())) {
        $("#errQty").show();
        window.setTimeout(function () {
            $("#errQty").hide();
        }, 2000);
        return false;
    }

    if (!checkInput($('#prdctPic').val())) {
        $("#errPic").show();
        window.setTimeout(function () {
            $("#errPic").hide();
        }, 2000);
        return false;
    }

    const attachments = document.querySelector('#prdctPic');
    if (attachments !== null && attachments.files.length > 5) {
        $("#errPic").html("Maximum 5 images are allowed to upload.");
        $("#errPic").show();
        window.setTimeout(function () {
            $("#errPic").hide();
        }, 2000);
        return false;
    }

    InsertUpdateCall(0, $('#productTitle').val(), $('#productDesc').val(), $('#catID').val(), $('#productPrice').val(), $('#productQty').val(), $('#isActive').val());

}

let UpdateProduct = (productID) => {

    if (!checkInput($('#productTitle').val())) {
        $("#errTitle").show();
        window.setTimeout(function () {
            $("#errTitle").hide();
        }, 2000);
        return false;
    }

    if (!checkInput($('#productDesc').val())) {
        $("#errDesc").show();
        window.setTimeout(function () {
            $("#errDesc").hide();
        }, 2000);
        return false;
    }

    if (!checkInput($('#productPrice').val())) {
        $("#errPrice").show();
        window.setTimeout(function () {
            $("#errPrice").hide();
        }, 2000);
        return false;
    }

    if (!checkInput($('#productQty').val())) {
        $("#errQty").show();
        window.setTimeout(function () {
            $("#errQty").hide();
        }, 2000);
        return false;
    }

    InsertUpdateCall(productID, $('#productTitle').val(), $('#productDesc').val(), $('#catID').val(), $('#productPrice').val(), $('#productQty').val(), $('#isActive').val());

}

let InsertUpdateCall = (productID, productTitle, productDesc, catID, productPrice, productQty, isActive) => {
    const attachments = document.querySelector('#prdctPic');

    const data = new FormData();
    data.append('PrdctID', productID);
    data.append('PrdctTitle', productTitle);
    data.append('PrdctDesc', productDesc);
    data.append('CatID', catID);
    data.append('PrdctPrice', productPrice);
    data.append('PrdctQty', productQty);
    data.append('IsActive', isActive);
    data.append('type', (productID > 0) ? "Update" : "Insert");
    if (attachments !== null)
        for (let i = 0; i < attachments.files.length; ++i) {
            data.append(`Attachments[${i}]`, attachments.files[i]);
        }

    const endpiont = '/api/ProductApi/InsertUpdateProduct';
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
            $("#ProductsModal").modal("hide");
            location.reload();
        }, 2000);
    }
};

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


//Load Product Pictures on edit button
const getProductsImages = (prodID) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("/api/ProductApi/GetProdPictures?prodID=" + prodID, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);
            let Lst = "";
            imageCount = 0;
            $.each(data, function (i, item) {
                imageCount = (i + 1);
                Lst += `<div class="parentDiv parentDiv_${item.PicID}"><button type="button" class="btnRemove" onclick="deleteProdsPicturesModal(${item.PicID}, ${prodID})">&times;</button><img src="${item.URL}" class="previewImg" /></div>`;
            });

            $("#divEditImgGroup").html(Lst);
        })
        .catch(error => console.log('error', error));

}

function deleteProdsPicturesModal (PicID, ProdID) {
    $('#AdPicsModal').modal({ backdrop: false });
    $('#AdPicsModal').modal('show');
    $('#picModalTitle').html("Warning");
    $('#picModalBody').empty();
    let str = `<h5>Are you sure you want to delete this image ?</h5>
                <button id="btnYesDel" class="btn btn-danger pull-right" onclick="deletePicturesEntry(${PicID}, ${ProdID})"><i class="fa fa-check"></i> Yes</button>
               <button id="btnNoDel" class="btn btn-secondary pull-right" data-dismiss="modal"><i class="fa fa-times"></i> No</button>`;
    $('#picModalBody').html(str);
}


let deletePicturesEntry = (PicID, ProdID) => {
    var divImg = $(".parentDiv_" + PicID);
    divImg.remove();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("/api/ProductApi/DeleteProdPicture?picID=" + PicID, requestOptions)
        .then(response => response.text())
        .then(result => {
            var response = $.parseJSON(result);
            if (response.Result != 'False') {
                getProductsImages(ProdID);
                $('#AdPicsModal').modal('hide');
                getAllData();
            }
        })
        .catch(error => console.log('error', error));

}






let addPicsModal = (ProdID) => {
    $('#AdPicsModal').modal({ backdrop: false });
    $('#AdPicsModal').modal('show');
    $('#picModalTitle').html("Add Images");
    $('#picModalBody').empty();
    let str = `<div class="form-group">
                    <label for="lblAdsImage">Attachments</label>
                    <input type="file" name="prdctPic2" id="prdctPic2" class="form-control" multiple accept=".bmp, .jpg, .gif, .png, .tiff, .jpeg, .tif" />
                </div>
                <div id="alertBoxWarning" class="alert alert-warning" style="display:none;">
                    <strong>Warning!</strong> Please select atleast one file!
                </div>
                <div id="alertBoxPass" class="alert alert-success" style="display:none;">
                    <strong>Success!</strong> Images Entered!
                </div>
                <div id="alertBoxFail" class="alert alert-danger" style="display:none;">
                </div>
                <button type="submit" class="btn btn-primary pull-right" id="btnpicModal" onclick="updateProdPicsEntry(${ProdID})"><i class="fa-solid fa-floppy-disk"></i> Save</button>`;
    $('#picModalBody').html(str);
}

let updateProdPicsEntry = (ProdID) => {
    // Check images selected and add them in the global variable imageCount
    const attachments = document.querySelector('#prdctPic2');
    let selectedImages = attachments.files.length;
    let checkImageCount = imageCount + selectedImages;

    if (attachments !== null && checkImageCount > 5) {
        showAlerts("Warning", "Maximum 5 images are allowed to upload.");
        return false;
    }

    if (!checkInput($('#prdctPic2').val())) {
        showAlerts("Warning", "");
        return false;
    }

    UpdateProdImagesCall(ProdID);
}

let UpdateProdImagesCall = (ProdID) => {
    const attachments = document.querySelector('#prdctPic2');
    const data = new FormData();
    data.append('ProdID', ProdID);
    for (let i = 0; i < attachments.files.length; ++i) {
        data.append(`Attachments[${i}]`, attachments.files[i]);
    }

    const endpiont = '/api/ProductApi/UpdateProdsImages';
    const options = {
        method: 'POST',
        body: data,
    };
    UploadProdAttachments(endpiont, options, ProdID);
}

const UploadProdAttachments = async (endpiont, options, ProdID) => {
    const rawResponse = await fetch(endpiont, options);
    const response = await rawResponse.json();
    if (response.Result == 'False') {
        showAlerts("Fail", response.Message);
    } else {
        showAlerts("Pass", "");
        getProductsImages(ProdID);
    }
};


let showAlerts = (type, Message) => {
    if ($.trim(Message) !== "") {
        $("#alertBox" + type).html(Message);
    }
    $("#picModalBody").css('height', '250px');
    $("#alertBox" + type).show();
    window.setTimeout(function () {
        $("#alertBox" + type).hide();
        $("#picModalBody").css('height', '150px');
        if (type === "Pass") {
            $('#AdPicsModal').modal('hide');
        }
    }, 2000);
}