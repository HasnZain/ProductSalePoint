
$(() => {
    // dateRangePicker('#reportRange', 'This Month');
    getAllData();
    $("#btnUpdate").hide();
    $("#alertBox").hide();
    $(".dvCatPicEdit").hide();
})
//$(document).ready(function () {
//    $("#adminTable").dataTable();
//});
//let clearData = () => {
//    $("#adsTableIndexTbody").empty();
//}


const getAllData = () => {
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
                let imgLst = ``;
                $.each(data.categories[index].Pictures, function (i, item) {
                    imgLst += `<img src="${item.PictureURL}" class="catsImgs" />`;
                });
                if (value.isActive == "1")
                    status = "Active";
                str += `<tr>
                            <td>${index + 1}</td>
                            <td>${value.catName}</td>
                            <td>${status}</td>
                            <td>${imgLst}</td>
                            <td class="m-0 p-1 text-right align-middle">
                                <button class="btn btn-sm btn-warning" title="View" onclick='FillData("${value.catID}","${value.catName}","${value.isActive}","${value.Pictures[0].PictureURL}")'>
                                <i class="fa fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger" title="Delete" onclick='alertDelete(${value.catID})'>
                                Delete
                                </button>
                            </td>
                            </tr>`;
            });

            $("#catTable").html(str);

        })
        .catch(error => console.log('error', error));

}

let FillData = (catID, catTitle, catStatus, picURL) => {
    $("#catID").val(catID);
    $("#catTitle").val(catTitle);
    $("#isActive").val(catStatus); 
    $("#btnInsert").hide();
    $(".dvCatPic").hide();
    $(".dvCatPicEdit").show();
    $("#catPictureEdit").attr('src', picURL);
    $("#btnUpdate").show();
    var fName = `UpdateCategory(${catID})`;
    $("#btnUpdate").attr('onclick', fName)
}

let InsertCategory = () => {

    if (!checkInput($('#catTitle').val())) {
        $("#errTitle").show();
        window.setTimeout(function () {
            $("#errTitle").hide();
        }, 2000);
        return false;
    }

    if (!checkInput($('#catPic').val())) {
        $("#errPic").show();
        window.setTimeout(function () {
            $("#errPic").hide();
        }, 2000);
        return false;
    }

    InsertUpdateCall(0, $('#catTitle').val(), $('#isActive').val());

}

let UpdateCategory = (catID) => {

    if (!checkInput($('#catTitle').val())) {
        $("#errTitle").show();
        window.setTimeout(function () {
            $("#errTitle").hide();
        }, 2000);
        return false;
    }

    InsertUpdateCall(catID, $('#catTitle').val(), $('#isActive').val());

}

let InsertUpdateCall = (catID, catTitle, isActive) => {
    const attachments = document.querySelector('#catPic');

    const data = new FormData();
    data.append('CatID', catID);
    data.append('CatTitle', catTitle);
    data.append('IsActive', isActive);
    data.append('type', (catID > 0) ? "Update" : "Insert");
    if (attachments !== null)
        for (let i = 0; i < attachments.files.length; ++i) {
            data.append(`Attachments[${i}]`, attachments.files[i]);
        }

    const endpiont = '/api/CategoryApi/InsertUpdateCategory';
    const options = {
        method: 'POST',
        body: data,
    };
    UploadAttachments(endpiont, options);
}

const UploadAttachments = async (endpiont, options) => {
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
            getAllData();
            refreshAll();
        }, 500);
    }
};



function refreshAll() {
    $("#catID").val(0);
    $("#catTitle").val('');
    $("#catPic").val('');
    $("#isActive").val(1);
}


function alertDelete(categoryID) {

    $('#deleteModal').modal({ backdrop: false });
    $("#deleteModal").modal("show");
    $("#modalBody").html(`<section>
                    <div class="form-group">
                        <h5>Are you sure you want to delete this category?</h5>
                        <div class="col-md-12">
                            <input type="button" value="Delete" class="btn btn-danger btnDlt" onclick="deleteCategory(${categoryID})" />
                            <input type="button" value="Close" class="btn btn-secondary btnDlt" data-dismiss="modal" />
                        </div>
                    </div>
                </section>`);

}

let deleteCategory = (catID) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("/api/CategoryApi/DeleteCategory?catID=" + catID, requestOptions)
        .then(response => response.text())
        .then(result => {
            var response = $.parseJSON(result);
            if (response.Result != 'False') {
                getAllData();
                refreshAll();
                $("#deleteModal").modal("hide");
            }
        })
        .catch(error => console.log('error', error));

}