using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace psl.Models.Products
{
    public class productModel
    {
        [Key]
        public int ProductID { get; set; }

        [Required]
        [Display(Name = "Product Name")]
        public string ProductName { get; set; }

        public string ProductDesc { get; set; }

        [Required]
        [Display(Name = "Category Name")]
        public int catID { get; set; }

        public string catTitle { get; set; }

        [Required]
        [Display(Name = "Product Price")]
        public decimal price { get; set; }

        [Required]
        [Display(Name = "Product Quantity")]
        public int Qty { get; set; }

        [Required]
        [Display(Name = "Product Status")]
        public int isActive { get; set; }

        public string InsertedBy { get; set; }

        public DateTime InsertedDateTime { get; set; }

        public List<productModel> products { get; set; }

        public string type { get; set; }

        public List<ProductPictures> Pictures { get; set; }

        public productModel()
        {
            products = new List<productModel>();
        }

    }

    public class AdjustStock
    {
        [Key]
        public int StockID { get; set; }
        public int ProductID { get; set; }
        public int CategoryID { get; set; }
        public int ProductQty { get; set; }
        public string Remarks { get; set; }
        public string InsertedBy { get; set; }
        public DateTime InsertedDateTime { get; set; }
    }

    public class getProductsData
    {
        public int categoryID { get; set; }
        public decimal priceFrom { get; set; }
        public decimal priceTo { get; set; }
    }

}