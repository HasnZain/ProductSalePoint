using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace psl.Models.Categories
{
    public class categoryModel
    {
        [Key]
        public int catID { get; set; }
        public string catName { get; set; }
        public int isActive { get; set; }
        public string InsertedBy { get; set; }
        public DateTime InsertedDateTime { get; set; }
        public List<categoryPictures> Pictures { get; set; }
        public List<categoryModel> categories { get; set; }

        public categoryModel()
        {
            categories = new List<categoryModel>();
        }

        public string type { get; set; }
    }
}