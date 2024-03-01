
$(() => {
    // dateRangePicker('#reportRange', 'This Month');
    getAllProducts();
})

const getAllProducts = () => {
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
            let str = ``;
            let filters = ``;
            let addedCategories = {}; // Object to store added categories

            $.each(data.products, function (index, value) {
                if (index < 12) {
                    if (value.isActive == "1") {
                        let catName = value.catTitle.toLowerCase();
                        if (catName.indexOf(' ') !== -1) {
                            catName = catName.replace(/\s+/g, '_');
                        }
                        let soldOut = ``;
                        if (value.Qty < 0) {
                            soldOut = `<div class="label stockout">out of stock</div>`;
                        }
                        str = `
                            <div class="col-lg-3 col-md-4 col-sm-6 mix ${catName}">
                                <div class="product__item">
                                    <div class="product__item__pic set-bg" style="background-image: url(${value.Pictures[0].PictureURL})">
                                        ${soldOut}
                                        <ul class="product__hover">
                                            <li><a onclick="showDetails(${value.ProductID})"><i class="fa-solid fa-up-right-and-down-left-from-center"></i></a></li>
                                            <li><a onclick="AddToCart(${value.ProductID})"><i class="fa-solid fa-cart-arrow-down"></i></a></li>
                                        </ul>
                                    </div>
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
                                    </div>
                                </div>
                            </div>`;
                        // Add category to filters only if it's not already added
                        if (!addedCategories[catName]) {
                            filters += `<li data-filter=".${catName}">${value.catTitle}</li>`;
                            addedCategories[catName] = true; // Mark category as added
                        }
                        $(".property__gallery").append(str);
                    }
                }
            });

            // Append filters outside the loop
            $(".filter__controls").append(filters);


        })
        .catch(error => console.log('error', error));

}



$(window).on('load', function () {

    //$('.filter__controls li').on('click', function () {
    //    $('.filter__controls li').removeClass('active');
    //    $(this).addClass('active');
    //});

    $('body').on('click', '.filter__controls li', function () {
        $('.filter__controls li').removeClass('active');
        $(this).addClass('active');
    })

    if ($('.property__gallery').length > 0) {
        var containerEl = document.querySelector('.property__gallery');
        var mixer = mixitup(containerEl);
    }

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
                                                <a class="cart-btn" onclick="AddToCartDetail(${data.ProductID})"><i class="fa-solid fa-bag-shopping"></i> Add to cart</a>
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
                Lst += `<img src="${item.URL}" class="adsImgs dtlImg" id="Pic_${item.PicID}" onclick="showSelectedImg(this)" />`;
            });
            $("#divDetailsImg").html(Lst);
            let firstImg = $("#Pic_" + data[0].PicID);
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
