using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace psl.Models.Reports
{
    public class reportModel
    {
        public int orderNumber { get; set; }
        public string customerName { get; set; }
        public string productTitle { get; set; }
        public string categoryTitle { get; set; }
        public int productQty { get; set; }
    }
}