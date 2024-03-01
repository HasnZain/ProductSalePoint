using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace psl.Models.Categories
{
    public class categoryPictures
    {
        [Key]
        public int PictureID { get; set; }
        public string PictureURL { get; set; }
        public int CategoryID { get; set; }
        public Boolean isActive { get; set; }
    }
}