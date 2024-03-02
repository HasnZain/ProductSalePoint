using Microsoft.AspNet.Identity;
using psl.Models;
using psl.Models.Order;
using psl.Repositories.OrderRepository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace psl.ControllersApi
{
    public class OrderApiController : ApiController
    {
        // POST: INSERT Orders
        [HttpPost]
        public Response InsertOrder()
        {
            try
            {
                orderRepository repository = new orderRepository();
                var userId = "";
                if (User.Identity.IsAuthenticated)
                {
                    userId = User.Identity.GetUserId();
                }
                orderModel model = new orderModel()
                {
                    UserID = Convert.ToString(userId),
                    FullName = Convert.ToString(HttpContext.Current.Request.Form["Name"]),
                    Country = Convert.ToString(HttpContext.Current.Request.Form["Country"]),
                    City = Convert.ToString(HttpContext.Current.Request.Form["City"]),
                    Address = Convert.ToString(HttpContext.Current.Request.Form["Address"]),
                    ZipCode = Convert.ToString(HttpContext.Current.Request.Form["Zip"]),
                    PhoneNo = Convert.ToString(HttpContext.Current.Request.Form["Number"]),
                    Email = Convert.ToString(HttpContext.Current.Request.Form["Email"]),
                    GrandTotal = Convert.ToDecimal(HttpContext.Current.Request.Form["Total"]),
                    ShippingCharges = Convert.ToDecimal(HttpContext.Current.Request.Form["Shipping"]),
                    Method = Convert.ToString(HttpContext.Current.Request.Form["Method"]),
                    ItemJSONDetails = Convert.ToString(HttpContext.Current.Request.Form["ItemJson"])
                };
                return repository.Insert_Orders(model);
            }
            catch (Exception ex)
            {
                Response res = new Response();
                res.Result = "False";
                res.Message = ex.Message;
                return res;
            }
        }

        // GET: GET ALL Orders Against a User
        [HttpGet]
        public DataTable getAllUserOrders()
        {
            DataTable table = new DataTable();
            var userId = "";
            if (User.Identity.IsAuthenticated)
            {
                userId = User.Identity.GetUserId();
            }
            orderRepository repository = new orderRepository();
            table = repository.getAllUserOrders(userId);
            return table;
        }

        // GET: GET Order by ID
        [HttpGet]
        public DataTable getOrdersByID(int orderID)
        {
            DataTable table = new DataTable();
            var userId = "";
            if (User.Identity.IsAuthenticated)
            {
                userId = User.Identity.GetUserId();
            }
            orderRepository repository = new orderRepository();
            table = repository.GetOrderByID(userId, orderID);
            return table;
        }

        // GET: GET ALL Order Details Against Admin
        [HttpGet]
        public DataTable getAllOrders()
        {
            DataTable table = new DataTable();
            orderRepository repository = new orderRepository();
            table = repository.getAllOrders();
            return table;
        }

        // GET: GET Order Item Details by Order ID
        [HttpGet]
        public DataTable getOrderItems(int orderID)
        {
            DataTable table = new DataTable();
            orderRepository repository = new orderRepository();
            table = repository.getOrderItemDetails(orderID);
            return table;
        }

        // POST: Update Order Status
        [HttpPost]
        public Response UpdateOrderStatus()
        {
            orderRepository repository = new orderRepository();
            int orderID = Convert.ToInt32(HttpContext.Current.Request.Form["OrderID"]);
            string orderStatus = Convert.ToString(HttpContext.Current.Request.Form["OrderStatus"]);
            return repository.UpdateOrderStatus(orderID, orderStatus);
        }

    }
}
