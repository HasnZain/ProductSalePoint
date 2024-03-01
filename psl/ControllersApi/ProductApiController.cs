using Microsoft.AspNet.Identity;
using psl.Models;
using psl.Models.Products;
using psl.Repositories.ProductRepository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Data;
using System.Web.Http;

namespace psl.ControllersApi
{
    public class ProductApiController : ApiController
    {
        // POST: INSERT and UPDATE Product
        [HttpPost]
        public Response InsertUpdateProduct()
        {
            try
            {
                productRepository repository = new productRepository();
                var userId = "";
                if (User.Identity.IsAuthenticated)
                {
                    userId = User.Identity.GetUserId();
                }
                productModel model = new productModel()
                {
                    ProductID = Convert.ToInt32(HttpContext.Current.Request.Form["PrdctID"]),
                    ProductName = Convert.ToString(HttpContext.Current.Request.Form["PrdctTitle"]),
                    ProductDesc = Convert.ToString(HttpContext.Current.Request.Form["PrdctDesc"]),
                    catID = Convert.ToInt32(HttpContext.Current.Request.Form["CatID"]),
                    price = Convert.ToDecimal(HttpContext.Current.Request.Form["PrdctPrice"]),
                    Qty = Convert.ToInt32(HttpContext.Current.Request.Form["PrdctQty"]),
                    isActive = Convert.ToInt32(HttpContext.Current.Request.Form["IsActive"]),
                    InsertedBy = Convert.ToString(userId),
                    type = Convert.ToString(HttpContext.Current.Request.Form["type"])
                };
                return repository.Insert_Update_Products(model);
            }
            catch (Exception ex)
            {
                Response res = new Response();
                res.Result = "False";
                if (ex.Message == "Maximum request length exceeded.")
                    res.Message = "File Size is too big. Compress and reupload.";
                else
                    res.Message = ex.Message;
                return res;
            }
        }

        // GET: GET ALL Products For Admin
        [HttpGet]
        public productModel getAllProductsForAdmin()
        {
            productRepository repository = new productRepository();
            productModel model = repository.GetProductsForAdmin();
            return model;
        }

        // GET: GET ALL Products
        [HttpGet]
        public productModel getAllProducts(int catID = 0, decimal priceFrom = 0, decimal priceTo = 0)
        {
            productRepository repository = new productRepository();
            getProductsData dataModel = new getProductsData()
            {
                categoryID = catID,
                priceFrom = priceFrom,
                priceTo = priceTo
            };
            productModel model = repository.GetProducts(dataModel);
            return model;
        }

        // GET: GET Product by ID
        [HttpGet]
        public productModel getProductByID(int ProdID)
        {
            productRepository repository = new productRepository();
            productModel model = repository.GetProductByID(ProdID);
            return model;
        }

        // GET: GET Product Pictures on ProductID
        [HttpGet]
        public DataTable GetProdPictures(int prodID)
        {
            productRepository repository = new productRepository();
            DataTable table = new DataTable();
            table = repository.GetProdPictures(prodID);
            return table;
        }

        // DELETE: Delete Product Image
        [HttpPost]
        public Response DeleteProdPicture(int picID)
        {
            productRepository repository = new productRepository();
            return repository.DeleteProdPicture(picID);

        }

        // POST: Add Images against products
        [HttpPost]
        public Response UpdateProdsImages()
        {
            productRepository repository = new productRepository();
            var userId = "";
            if (User.Identity.IsAuthenticated)
            {
                userId = User.Identity.GetUserId();
            }
            int prodID = Convert.ToInt32(HttpContext.Current.Request.Form["ProdID"]);
            return repository.UpdateProdsImages(prodID, userId);
        }

        // GET: GET ALL Products with Low Stock
        [HttpGet]
        public productModel getLowStockProducts()
        {
            productRepository repository = new productRepository();
            productModel model = repository.GetLowStockProducts();
            return model;
        }

        // POST: Adjust Stock against Product
        [HttpPost]
        public Response AdjustStock()
        {
            productRepository repository = new productRepository();
            var userId = "";
            if (User.Identity.IsAuthenticated)
            {
                userId = User.Identity.GetUserId();
            }
            AdjustStock model = new AdjustStock()
            {
                ProductID = Convert.ToInt32(HttpContext.Current.Request.Form["PrdctID"]),
                CategoryID = Convert.ToInt32(HttpContext.Current.Request.Form["CatID"]),
                ProductQty = Convert.ToInt32(HttpContext.Current.Request.Form["PrdctQty"]),
                InsertedBy = Convert.ToString(userId),
                Remarks = Convert.ToString(HttpContext.Current.Request.Form["Remarks"]),
            };
            return repository.AdjustStockProduct(model);
        }

    }
}
