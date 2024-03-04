using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace psl.Models.Order
{
    public class orderModel
    {
        [Key]
        public int Ord_ID { get; set; }
        public string UserID { get; set; }
        public string FullName { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string ZipCode { get; set; }
        public string PhoneNo { get; set; }
        public string Email { get; set; }
        public decimal GrandTotal { get; set; }
        public decimal ShippingCharges { get; set; }
        public string Method { get; set; }
        public string Status { get; set; }
        public string returningDate { get; set; }
        public string ItemJSONDetails { get; set; }

        public List<orderItemsModel> ItemDetail { get; set; }

        public orderModel()
        {
            ItemDetail = new List<orderItemsModel>();
        }

    }
}