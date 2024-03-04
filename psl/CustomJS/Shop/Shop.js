
$(() => {
    // dateRangePicker('#reportRange', 'This Month');
    getAllProducts(0, 0, 0);
    getMaxPrice();
})

$(document).ready(function () {
    priceRange();
    getAllCategories();

});

const getMaxPrice = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`/api/ProductApi/getAllProducts`, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);
            let maxNum = '';

            $.each(data.products, function (index, value) {
                if (value.isActive == "1") {
                    if (value.price > maxNum)
                        maxNum = value.price;
                }
            });

            $(".input-max").val(maxNum);
            $(".range-max").attr('max', maxNum);
            $(".range-max").attr('value', maxNum);
            $(".range-min").attr('max', maxNum);

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
            let filters = ``;
            let addedCategories = {};

            $.each(data.categories, function (index, value) {
                if (value.isActive == "1") {
                    if (!addedCategories[value.catName]) {
                        filters += `<li><a class="filterLIS" data-filter="${value.catID}">${value.catName}</a></li>`;
                        addedCategories[value.catName] = true; // Mark category as added
                    }
                }
            });

            // Append filters outside the loop
            $(".filter__controls").append(filters);

        })
        .catch(error => console.log('error', error));

}

const getAllProducts = (catID, priceFrom, priceTo) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    const apiUrl = `/api/ProductApi/getAllProducts?catID=${catID}&priceFrom=${priceFrom}&priceTo=${priceTo}`;
    fetch(apiUrl, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result);
            let str = ``;

            const itemsPerPage = 9; // Number of items to display per page
            const totalItems = data.products.length;
            let totalPages = Math.ceil(totalItems / itemsPerPage);
            let currentPage = 1; // Initialize current page number

            // Function to display items for the current page
            function displayItems(page) {
                $(".property__gallery").empty(); // Clear existing items
                let startIndex = (page - 1) * itemsPerPage; // Calculate starting index
                let endIndex = startIndex + itemsPerPage; // Calculate ending index

                $.each(data.products, function (index, value) {
                    if (index >= startIndex && index < endIndex) { // Check if item is within current page range
                        if (value.isActive == "1") {
                            let catName = value.catTitle.toLowerCase();
                            if (catName.indexOf(' ') !== -1) {
                                catName = catName.replace(/\s+/g, '_');
                            }
                            let soldOut = ``;
                            if (value.Qty <= 0) {
                                soldOut = `<div class="label stockout">out of stock</div>`;
                            }
                            str = `
                                <div class="col-lg-4 col-md-4 col-sm-6 mix ${catName}">
                                    <div class="product__item">
                                        <div class="product__item__pic set-bg" style="background-image: url(${value.Pictures[0].PictureURL})">
                                        </div>
                                        ${soldOut}
                                        <div class="product__item__text">
                                            <h6><a onclick="showDetails(${value.ProductID})">${value.ProductName}</a></h6>
                                            <div class="rating">
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                            </div>
                                            <div class="product__price">PKR ${formatPrice(value.price)}</div>
                                            <div class="product__cart"><button class="btn btn-sm btn-success" onclick="AddToCart(${value.ProductID})">Add To Cart</button></div>
                                        </div>
                                    </div>
                                </div>`;
                            $(".property__gallery").append(str);
                        }
                    }
                });
            }

            // Initial display of items
            displayItems(currentPage);

            // Function to generate page number buttons
            function generatePageNumbers() {
                $(".page-numbers").empty(); // Clear existing page numbers
                for (let i = 1; i <= totalPages; i++) {
                    if (i === currentPage) {
                        $(".page-numbers").append(`<button class="page-number current btn btn-primary" data-page="${i}" disabled>${i}</button>`);
                    } else {
                        $(".page-numbers").append(`<button class="page-number btn btn-primary" data-page="${i}">${i}</button>`);
                    }
                }
            }

            // Generate page number buttons
            generatePageNumbers();

            // Event listener for page number buttons
            $(document).on("click", ".page-number:not(.current)", function () {
                currentPage = parseInt($(this).data("page"));
                displayItems(currentPage); // Display items for the selected page
                generatePageNumbers(); // Regenerate page numbers with updated current page
                updatePaginationState();
                scrollToTop();
            });

            // Event listener for pagination buttons
            $(".pagination-btn").on("click", function () {
                let direction = $(this).data("direction");
                if (direction === "next" && currentPage < totalPages) {
                    currentPage++;
                } else if (direction === "prev" && currentPage > 1) {
                    currentPage--;
                }
                displayItems(currentPage); // Display items for the new page
                generatePageNumbers(); // Regenerate page numbers with updated current page
                updatePaginationState();
                scrollToTop();
            });

            // Function to update pagination state (disable/enable buttons)
            function updatePaginationState() {
                $(".pagination-btn[data-direction='prev']").prop("disabled", currentPage === 1);
                $(".pagination-btn[data-direction='next']").prop("disabled", currentPage === totalPages);
            }

            // Function to scroll to the top of the property__gallery div
            function scrollToTop() {
                $("body, html").scrollTop(0);
            }

            // Initialize pagination state
            updatePaginationState();
        })
        .catch(error => console.log('error', error));
}



function priceRange() {
    const rangeInput = document.querySelectorAll(".range-input input"),
        priceInput = document.querySelectorAll(".price-input input"),
        progress = document.querySelector(".slider .progress");
    let priceGap = 1000;

    priceInput.forEach(input => {
        input.addEventListener("input", e => {
            let minVal = parseInt(priceInput[0].value),
                maxVal = parseInt(priceInput[1].value);

            if ((maxVal - minVal >= priceGap) && maxVal <= maxVal) {
                if (e.target.className === "input-min") {
                    rangeInput[0].value = minVal;
                    progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
                }
                else {
                    rangeInput[1].value = maxVal;
                    progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
                }
            }
        });
    });
    rangeInput.forEach(input => {
        input.addEventListener("input", e => {
            let minVal = parseInt(rangeInput[0].value),
                maxVal = parseInt(rangeInput[1].value);

            if (maxVal - minVal < priceGap) {
                if (e.target.className === "range-min") 
                    rangeInput[0].value = maxVal - priceGap;
                else 
                    rangeInput[1].value = minVal + priceGap;
            }
            else {
                priceInput[0].value = minVal;
                priceInput[1].value = maxVal;
                progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
                progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
            }
        });
    });

}

$(".filter__controls").on("click", ".filterLIS", function () {
    debugger
    $(".filter__controls").children().find(".filterLIS").removeClass("active");
    $(this).addClass("active");
    let catID = $(".filter__controls").children().find(".active").data("filter");
    let priceFrom = $(".input-min").val();
    let priceTo = $(".input-max").val();
    getAllProducts(catID, priceFrom, priceTo);
});

$("#btnFilter").click(function () {
    debugger;
    let catID = $(".filter__controls").children().find(".active").data("filter");
    let priceFrom = $(".input-min").val();
    let priceTo = $(".input-max").val();
    getAllProducts(catID, priceFrom, priceTo);
});



function showDetails(ProdID) {
    getProductDetails(ProdID).then(function () {
        getProductsImages(ProdID);
    });
}


//Load Product Detail
const getProductDetails = (prodID) => {
    return new Promise((resolve, reject) => {
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

                let soldOut = ``;
                if (data.Qty <= 0) {
                    soldOut = `<div class="label stockout" id="labelStockOut" >out of stock</div>`;
                }

                let str = `<div class="row">
                                <div class="col-md-12">
                                    <div class="col-md-6">
                                        <div class="col-md-12 dvSelectedImg">
                                            <img src="" id="detailActiveImg" />
                                        </div>
                                        <div class="col-md-12 divDetailsImg" id="divDetailsImg">
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        ${soldOut}
                                        <div class="product__details__text">
                                            <h3>${data.ProductName} <span>Category: ${data.catTitle}</span></h3>
                                            <div class="rating">
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <span>( 138 reviews )</span>
                                            </div>
                                            <div class="product__details__price">PKR ${formatPrice(data.price)}</div>
                                            <p>${data.ProductDesc}</p>
                                            <div class="product__details__button">
                                                <div class="quantity">
                                                    <span>Quantity:</span>
                                                    <div class="pro-qty">
                                                        <input type="text" id="prodQtyInput_${data.ProductID}" value="1">
                                                    </div>
                                                </div>
                                                <a class="cart-btn" onclick="AddToCartDetail(${data.ProductID})"><i class="fa-solid fa-bag-shopping"></i>&nbsp; Add to cart</a>
                                            </div>
                                            <div class="alert alert-success successMessageDtl" role="alert"><strong>Successfully Added To Cart</strong></div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;

                $("#detailsModalBody").html(str);
                resolve(); // Resolve the promise when details are fetched and HTML is updated
                productQty();
            })
            .catch(error => {
                console.log('error', error);
                reject(error); // Reject the promise if there is an error
            });
    });
}


//Load Product Pictures
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
                Lst += `<img src="${item.PictureURL}" class="adsImgs dtlImg" id="Pic_${item.PictureID}" onclick="showSelectedImg(this)" />`;
            });
            $("#divDetailsImg").html(Lst);
            let firstImg = $("#Pic_" + data[0].PictureID);
            showSelectedImg(firstImg);
        })
        .catch(error => console.log('error', error));

    $("#ShopProductModal").modal("show");
}


function productQty() {
    var proQty = $('.pro-qty');
    proQty.prepend('<span class="dec qtybtn">-</span>');
    proQty.append('<span class="inc qtybtn">+</span>');
    proQty.on('click', '.qtybtn', function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
    });
}

function showSelectedImg(element) {
    $(".dtlImg").removeClass('activeImg');
    var imgUrl = $(element).attr('src');
    $('#detailActiveImg').attr('src', imgUrl);
    $(element).addClass('activeImg');
}
