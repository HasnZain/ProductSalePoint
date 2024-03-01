using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace psl.Models.Products
{
    public class ProductPictures
    {
        [Key]
        public int PictureID { get; set; }
        public string PictureURL { get; set; }
        public int ProductID { get; set; }
        public Boolean isActive { get; set; }
    }
}