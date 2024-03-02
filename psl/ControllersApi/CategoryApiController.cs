using psl.Repositories.CategoryRepository;
using psl.Models;
using psl.Models.Categories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;

namespace psl.ControllersApi
{
    public class CategoryApiController : ApiController
    {
        // POST: INSERT and UPDATE Category
        [HttpPost]
        public Response InsertUpdateCategory()
        {
            try
            {
                categoryRepository repository = new categoryRepository();
                var userId = "";
                if (User.Identity.IsAuthenticated)
                {
                    userId = User.Identity.GetUserId();
                }
                categoryModel model = new categoryModel()
                {
                    catID = Convert.ToInt32(HttpContext.Current.Request.Form["CatID"]),
                    catName = Convert.ToString(HttpContext.Current.Request.Form["CatTitle"]),
                    isActive = Convert.ToInt32(HttpContext.Current.Request.Form["IsActive"]),
                    InsertedBy = Convert.ToString(userId),
                    type = Convert.ToString(HttpContext.Current.Request.Form["type"])
                };
                return repository.Insert_Update_Categories(model);
            }
            catch (Exception ex)
            {
                Response res = new Response();
                res.Result = "False";
                if(ex.Message == "Maximum request length exceeded.")
                    res.Message = "File Size is too big. Compress and reupload.";
                else
                    res.Message = ex.Message;
                return res;
            }
        }

        // GET: GET ALL Category
        [HttpGet]
        public categoryModel getAllCategories()
        {
            categoryRepository repository = new categoryRepository();
            categoryModel model = repository.GetCategories();
            return model;
        }

        // POST: Delete Category
        [HttpPost]
        public Response DeleteCategory(int catID)
        {
            categoryRepository repository = new categoryRepository();
            return repository.DeleteCategory(catID);
        }

    }
}