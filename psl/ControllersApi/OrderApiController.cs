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
        public List<orderModel> getAllUserOrders()
        {
            var userId = "";
            if (User.Identity.IsAuthenticated)
            {
                userId = User.Identity.GetUserId();
            }
            orderRepository repository = new orderRepository();
            return repository.getAllUserOrders(userId);
        }

        // GET: GET Order by ID
        [HttpGet]
        public orderModel getOrdersByID(int orderID)
        {
            var userId = "";
            if (User.Identity.IsAuthenticated)
            {
                userId = User.Identity.GetUserId();
            }
            orderRepository repository = new orderRepository();
            return repository.GetOrderByID(userId, orderID);
        }

        // GET: GET ALL Order Details Against Admin
        [HttpGet]
        public List<orderModel> getAllOrders()
        {
            orderRepository repository = new orderRepository();
            return repository.getAllOrders();
        }

        // GET: GET Order Item Details by Order ID
        [HttpGet]
        public List<orderItemsModel> getOrderItems(int orderID)
        {
            orderRepository repository = new orderRepository();
            return repository.getOrderItemDetails(orderID);
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
