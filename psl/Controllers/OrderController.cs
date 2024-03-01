using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace psl.Controllers
{
    [Authorize]
    public class OrderController : Controller
    {
        // GET: Order
        public ActionResult Index()
        {
            return View();
        }

        // GET: Order History
        public ActionResult OrderHistory()
        {
            return View();
        }

        // GET: Order Tracking
        public ActionResult OrderTracking()
        {
            return View();
        }
    }
}