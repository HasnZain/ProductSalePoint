using psl.Models;
using psl.Models.Products;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace psl.Repositories.ProductRepository
{
    public class productRepository
    {
        public Response Results { get; set; }
        public productRepository()
        {
            Results = new Response();
        }

        #region Insert & Update Products

        [HttpPost]
        [ValidateAntiForgeryToken]
        public Response Insert_Update_Products(productModel product)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            List<string> paths = new List<string>();
            try
            {
                // check if file exists or not
                HttpFileCollection Attachments = HttpContext.Current.Request.Files;
                if (product.type == "Insert")
                {
                    if (Attachments.Count > 0)
                    {
                        for (int i = 0; i < Attachments.Count; ++i)
                        {
                            string extension = Path.GetExtension(Attachments[i].FileName);
                            if (!extenstioncheck(extension))
                            {
                                Results.Message = Convert.ToString("Only images are allowed to upload.");
                                Results.Result = Convert.ToString(false);
                                return Results;
                            }
                        }
                    }
                    else
                    {
                        Results.Message = Convert.ToString("Please select atleast one file to upload.");
                        Results.Result = Convert.ToString(false);
                        return Results;
                    }
                }
                response = DB.databaseCRUD("sp_InsertUpdateProducts", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@ID",Value=Convert.ToInt32(product.ProductID)},
                    new SqlParameter() {ParameterName="@Title",Value=Convert.ToString(product.ProductName)},
                    new SqlParameter() {ParameterName="@Desc",Value=Convert.ToString(product.ProductDesc)},
                    new SqlParameter() {ParameterName="@catID",Value=Convert.ToInt32(product.catID)},
                    new SqlParameter() {ParameterName="@price",Value=Convert.ToDecimal(product.price)},
                    new SqlParameter() {ParameterName="@Qty",Value=Convert.ToInt32(product.Qty)},
                    new SqlParameter() {ParameterName="@UserID",Value=Convert.ToString(product.InsertedBy)},
                    new SqlParameter() {ParameterName="@IsActive",Value=Convert.ToInt32(product.isActive)}
                });
                if (response.Result)
                {
                    if (product.type == "Insert")
                    {
                        int ProducID = Convert.ToInt32(response.DataResult.Tables[0].Rows[0][0]);
                        if (Attachments.Count > 0)
                        {
                            for (int i = 0; i < Attachments.Count; ++i)
                            {
                                string path = UploadAttachments(Attachments[i]);
                                if (path == "false")
                                {
                                    Results.Message = Convert.ToString("File is not added in the folder.");
                                    Results.Result = Convert.ToString(false);
                                    return Results;
                                }
                                paths.Add(path);
                            }

                            bool pic = AddAttachmentsInDb(paths, ProducID, product.InsertedBy);
                            if (!pic)
                            {
                                Results.Message = Convert.ToString("File is not added in the DataBase.");
                                Results.Result = Convert.ToString(false);
                                return Results;
                            }
                        }
                    }

                    if (product.catID > 0)
                    {
                        Results.Message = Convert.ToString("Product is Updated");
                    }
                    else
                    {
                        Results.Message = Convert.ToString("Product is Inserted");
                    }
                    Results.Result = Convert.ToString(true);
                }
            }
            catch (Exception ex)
            {
                Results.Message = ex.Message;
            }
            return Results;
        }

        #endregion

        #region Get All Products For Admin

        [HttpPost]
        [ValidateAntiForgeryToken]
        public productModel GetProductsForAdmin()
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            productModel model = new productModel();
            try
            {
                response = DB.databaseCRUD("sp_GetProductsForAdmin");
                if (response.Result)
                {
                    var table = response.DataResult.Tables[0];
                    foreach (DataRow row in table.Rows)
                    {
                        productModel product = new productModel()
                        {
                            ProductID = Convert.ToInt32(row["ProductID"]),
                            ProductName = row["ProductTitle"].ToString(),
                            ProductDesc = row["ProdDescription"].ToString(),
                            catID = Convert.ToInt32(row["CategoryID"]),
                            catTitle = row["CatTitle"].ToString(),
                            price = Convert.ToDecimal(row["Price"]),
                            Qty = Convert.ToInt32(row["Quantity"]),
                            isActive = Convert.ToInt32(row["IsActive"]),
                            Pictures = new List<ProductPictures>()
                        };
                        ProductPictures pic = new ProductPictures()
                        {
                            PictureURL = row["PicURL"].ToString()
                        };
                        product.Pictures.Add(pic);
                        model.products.Add(product);
                    }
                }
            }
            catch (Exception ex)
            {
                productModel model1 = new productModel();
                return model1;
            }
            return model;
        }

        #endregion

        #region Get All Products

        [HttpPost]
        [ValidateAntiForgeryToken]
        public productModel GetProducts(getProductsData data)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            productModel model = new productModel();
            try
            {
                response = DB.databaseCRUD("sp_GetProducts", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@catID",Value=Convert.ToInt32(data.categoryID)},
                    new SqlParameter() {ParameterName="@priceFrom",Value=Convert.ToDecimal(data.priceFrom)},
                    new SqlParameter() {ParameterName="@priceTo",Value=Convert.ToDecimal(data.priceTo)}
                });
                if (response.Result)
                {
                    var table = response.DataResult.Tables[0];
                    foreach (DataRow row in table.Rows)
                    {
                        productModel product = new productModel()
                        {
                            ProductID = Convert.ToInt32(row["ProductID"]),
                            ProductName = row["ProductTitle"].ToString(),
                            ProductDesc = row["ProdDescription"].ToString(),
                            catID = Convert.ToInt32(row["CategoryID"]),
                            catTitle = row["CatTitle"].ToString(),
                            price = Convert.ToDecimal(row["Price"]),
                            Qty = Convert.ToInt32(row["Quantity"]),
                            isActive = Convert.ToInt32(row["IsActive"]),
                            Pictures = new List<ProductPictures>()
                        };
                        ProductPictures pic = new ProductPictures()
                        {
                            PictureURL = row["PicURL"].ToString()
                        };
                        product.Pictures.Add(pic);
                        model.products.Add(product);
                    }
                }
            }
            catch (Exception ex)
            {
                productModel model1 = new productModel();
                return model1;
            }
            return model;
        }

        #endregion

        #region Get Product By ID

        [HttpPost]
        [ValidateAntiForgeryToken]
        public productModel GetProductByID(int ProductID)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            productModel model = new productModel();
            try
            {
                response = DB.databaseCRUD("sp_GetProductbyID", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@ProductID",Value=Convert.ToInt32(ProductID)},
                });
                if (response.Result)
                {
                    var table = response.DataResult.Tables[0];
                    foreach (DataRow row in table.Rows)
                    {
                        model.ProductID = Convert.ToInt32(row["ProductID"]);
                        model.ProductName = row["ProductTitle"].ToString();
                        model.ProductDesc = row["ProdDescription"].ToString();
                        model.catID = Convert.ToInt32(row["CategoryID"]);
                        model.catTitle = row["catTitle"].ToString();
                        model.price = Convert.ToDecimal(row["Price"]);
                        model.Qty = Convert.ToInt32(row["Quantity"]);
                        model.isActive = Convert.ToInt32(row["IsActive"]);
                        model.Pictures = new List<ProductPictures>();

                        ProductPictures pic = new ProductPictures()
                        {
                            PictureURL = row["PicURL"].ToString()
                        };
                        model.Pictures.Add(pic);
                    }

                }
            }
            catch (Exception ex)
            {
                productModel model1 = new productModel();
                return model1;
            }
            return model;
        }

        #endregion

        #region Get Products Pictures
        public DataTable GetProdPictures(int prodID)
        {
            DBHelper DB = new DBHelper();
            DataTable table = new DataTable();
            DBResponse response = new DBResponse();
            try
            {
                response = DB.databaseCRUD("sp_GetProductPictures", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@ProdID",Value=prodID}
                });
                if (response.Result)
                {
                    table = response.DataResult.Tables[0];
                }
            }
            catch (Exception ex)
            {
            }
            return table;
        }
        #endregion

        #region Delete Product Picture
        public Response DeleteProdPicture(int pictureID)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            try
            {
                response = DB.databaseCRUD("sp_DeleteProductPicture", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@PicID",Value=Convert.ToInt32(pictureID) }
                }
                );
                if (response.Result)
                {
                    var ImageURL = response.DataResult.Tables[0].Rows[0][0].ToString();
                    string physicalPath = Path.Combine(HttpContext.Current.Server.MapPath("~" + ImageURL));
                    if (File.Exists(physicalPath))
                    {
                        File.Delete(physicalPath);
                    }

                    Results.Message = Convert.ToString("Picture Deleted");
                    Results.Result = Convert.ToString(true);
                }
            }
            catch (Exception ex)
            {
                return new Response();
            }
            return Results;
        }

        #endregion

        #region Add Images Against Products

        public Response UpdateProdsImages(int productID, string UserID)
        {
            List<string> paths = new List<string>();
            try
            {
                HttpFileCollection Attachments = HttpContext.Current.Request.Files;
                if (Attachments.Count > 0)
                {
                    for (int i = 0; i < Attachments.Count; ++i)
                    {
                        string extension = Path.GetExtension(Attachments[i].FileName);
                        if (extenstioncheck(extension))
                        {
                            string path = UploadAttachments(Attachments[i]);
                            paths.Add(path);
                        }
                        else
                        {
                            Results.Message = Convert.ToString("Only images are allowed to upload.");
                            Results.Result = Convert.ToString(false);
                            return Results;
                        }
                    }

                    AddAttachmentsInDb(paths, productID, UserID);
                }

                Results.Message = Convert.ToString("Product Images is Inserted");
                Results.Result = Convert.ToString(true);

            }
            catch (Exception ex)
            {
                return new Response();
            }
            return Results;
        }

        #endregion

        #region Get All Products With Low Stock

        [HttpPost]
        [ValidateAntiForgeryToken]
        public productModel GetLowStockProducts()
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            productModel model = new productModel();
            try
            {
                response = DB.databaseCRUD("sp_GetLowStockProducts");
                if (response.Result)
                {
                    var table = response.DataResult.Tables[0];
                    foreach (DataRow row in table.Rows)
                    {
                        productModel category = new productModel()
                        {
                            ProductID = Convert.ToInt32(row["ProductID"]),
                            ProductName = row["ProductTitle"].ToString(),
                            ProductDesc = row["ProdDescription"].ToString(),
                            catID = Convert.ToInt32(row["CategoryID"]),
                            catTitle = row["CatTitle"].ToString(),
                            price = Convert.ToDecimal(row["Price"]),
                            Qty = Convert.ToInt32(row["Quantity"]),
                            isActive = Convert.ToInt32(row["IsActive"])
                        };
                        model.products.Add(category);
                    }
                }
            }
            catch (Exception ex)
            {
                productModel model1 = new productModel();
                return model1;
            }
            return model;
        }

        #endregion

        #region Adjust Stock Against Product

        [HttpPost]
        [ValidateAntiForgeryToken]
        public Response AdjustStockProduct(AdjustStock product)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            try
            {
                response = DB.databaseCRUD("sp_AdjustProductStock", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@PrdctID",Value=Convert.ToInt32(product.ProductID)},
                    new SqlParameter() {ParameterName="@catID",Value=Convert.ToInt32(product.CategoryID)},
                    new SqlParameter() {ParameterName="@Qty",Value=Convert.ToInt32(product.ProductQty)},
                    new SqlParameter() {ParameterName="@UserID",Value=Convert.ToString(product.InsertedBy)},
                    new SqlParameter() {ParameterName="@Remarks",Value=Convert.ToString(product.Remarks)}
                });
                if (response.Result)
                {
                    Results.Message = Convert.ToString("Product is Updated");
                    Results.Result = Convert.ToString(true);
                }
            }
            catch (Exception ex)
            {
                Results.Message = ex.Message;
            }
            return Results;
        }

        #endregion

        #region Insert Products Images

        public bool extenstioncheck(string extention)
        {
            if (extention.ToLower() == ".bmp" || extention.ToLower() == ".jpg" || extention.ToLower() == ".gif" || extention.ToLower() == ".png"
                || extention.ToLower() == ".tiff" || extention.ToLower() == ".jpeg" || extention.ToLower() == ".tif")
            {
                return true;
            }
            return false;
        }

        public string UploadAttachments(HttpPostedFile attachment)
        {
            string path = "~/Uploads/ProductPictures/";

            bool dir = Directory.Exists(HttpContext.Current.Server.MapPath(path));
            if (!dir)
            {
                Directory.CreateDirectory(HttpContext.Current.Server.MapPath(path));
            }

            bool newDir = Directory.Exists(HttpContext.Current.Server.MapPath(path));
            if (!newDir)
            {
                return "false";
            }

            if (attachment.ContentLength > 0)
            {
                var fileName = Path.GetFileName(attachment.FileName);
                var newFileName = DateTime.Now.ToString("yyyyMMddHHmmssFFF") + "_" + Path.GetFileName(fileName);
                var filePath = Path.Combine(HttpContext.Current.Server.MapPath(string.Format("{0}/{1}", path, newFileName)));
                attachment.SaveAs(filePath);
                return "/Uploads/ProductPictures/" + newFileName;
            }

            return null;
        }

        public bool AddAttachmentsInDb(IEnumerable<string> paths, int ID, string UserID)
        {
            try
            {
                foreach (var path in paths)
                {
                    DBHelper db = new DBHelper();
                    DBResponse response = db.databaseCRUD("sp_InsertProductImages", new List<SqlParameter>
                    {
                        new SqlParameter { ParameterName = "@FilePath", Value = path },
                        new SqlParameter { ParameterName = "@ProductID", Value = ID },
                        new SqlParameter { ParameterName = "@UserID", Value = UserID }
                    });
                }
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        #endregion

    }
}