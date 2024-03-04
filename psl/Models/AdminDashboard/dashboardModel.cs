using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace psl.Models.AdminDashboard
{
    public class dashboardModel
    {
        public int adminsCount { get; set; }
        public int usersCount { get; set; }
        public int categoryCount { get; set; }
        public int productCount { get; set; }
    }
}