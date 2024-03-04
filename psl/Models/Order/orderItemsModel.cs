using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace psl.Models.Order
{
    public class orderItemsModel
    {
        [Key]
        public int itemID { get; set; }
        public int orderID { get; set; }
        public int productID { get; set; }
        public string productTitle { get; set; }
        public string productDesc { get; set; }
        public int categoryID { get; set; }
        public string categoryTitle { get; set; }
        public decimal productPrice { get; set; }
        public int Quantity { get; set; }
        public decimal itemTotal { get; set; }
    }
}