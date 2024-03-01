using psl.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using psl.Models.Categories;
using System.Web.Mvc;
using System.Data;
using System.IO;

namespace psl.Repositories.CategoryRepository
{
    public class categoryRepository
    {
        public Response Results { get; set; }
        public categoryRepository()
        {
            Results = new Response();
        }

        #region Insert & Update Category

        [HttpPost]
        [ValidateAntiForgeryToken]
        public Response Insert_Update_Categories(categoryModel category)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            List<string> paths = new List<string>();
            try
            {
                // check if file exists or not
                HttpFileCollection Attachments = HttpContext.Current.Request.Files;
                if (category.type == "Insert")
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
                response = DB.databaseCRUD("sp_InsertUpdateCategories", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@ID",Value=Convert.ToInt32(category.catID)},
                    new SqlParameter() {ParameterName="@Title",Value=Convert.ToString(category.catName)},
                    new SqlParameter() {ParameterName="@UserID",Value=Convert.ToString(category.InsertedBy)},
                    new SqlParameter() {ParameterName="@IsActive",Value=Convert.ToInt32(category.isActive)}
                });
                if (response.Result)
                {
                    if (category.type == "Insert")
                    {
                        int catID = Convert.ToInt32(response.DataResult.Tables[0].Rows[0][0]);
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

                            bool pic = AddAttachmentsInDb(paths, catID, category.InsertedBy);
                            if (!pic)
                            {
                                Results.Message = Convert.ToString("File is not added in the DataBase.");
                                Results.Result = Convert.ToString(false);
                                return Results;
                            }
                        }
                    }
                    if (category.catID > 0)
                    {
                        Results.Message = Convert.ToString("Category is Updated");
                    }
                    else
                    {
                        Results.Message = Convert.ToString("Category is Inserted");
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

        #region Get All Category

        [HttpGet]
        public categoryModel GetCategories()
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            categoryModel model = new categoryModel();
            try
            {
                response = DB.databaseCRUD("sp_GetCategories");
                if (response.Result)
                {
                    var table = response.DataResult.Tables[0];
                    foreach(DataRow row in table.Rows)
                    {
                        categoryModel category = new categoryModel()
                        {
                            catID = Convert.ToInt32(row["CatID"]),
                            catName = row["CatTitle"].ToString(),
                            isActive = Convert.ToInt32(row["IsActive"]),
                            Pictures = new List<categoryPictures>()
                        };
                        categoryPictures pic = new categoryPictures()
                        {
                            PictureURL = row["URL"].ToString()
                        };
                        category.Pictures.Add(pic);
                        model.categories.Add(category);
                    }
                }
            }
            catch (Exception ex)
            {
                categoryModel model1 = new categoryModel();
                return model1;
            }
            return model;
        }

        #endregion

        #region Insert Category Images

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
            string path = "~/Uploads/CategoryPictures/";

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
                return "/Uploads/CategoryPictures/" + newFileName;
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
                    DBResponse response = db.databaseCRUD("sp_InsertCategoryImages", new List<SqlParameter>
                    {
                        new SqlParameter { ParameterName = "@FilePath", Value = path },
                        new SqlParameter { ParameterName = "@CatID", Value = ID },
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

        #region Delete Category

        [HttpPost]
        public Response DeleteCategory(int categoryID)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            DBResponse response1 = new DBResponse();
            DataTable table = new DataTable();
            try
            {
                response = DB.databaseCRUD("sp_GetCategoryPictures", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@catID",Value=categoryID }
                });
                if (response.Result)
                {
                    table = response.DataResult.Tables[0];
                    foreach (DataRow row in table.Rows)
                    {
                        var ImageURL = row["URL"].ToString();
                        string physicalPath = Path.Combine(HttpContext.Current.Server.MapPath("~" + ImageURL));
                        if (File.Exists(physicalPath))
                        {
                            File.Delete(physicalPath);
                        }
                    }
                }
                response1 = DB.databaseCRUD("sp_DeleteCategory", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@catID",Value=categoryID }
                });
                if (response1.Result)
                {
                    Results.Message = Convert.ToString("Category Deleted");
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


    }
}