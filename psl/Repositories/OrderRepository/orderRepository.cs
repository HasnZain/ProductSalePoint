using psl.Models;
using psl.Models.Order;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace psl.Repositories.OrderRepository
{
    public class orderRepository
    {
        public Response Results { get; set; }
        public orderRepository()
        {
            Results = new Response();
        }


        #region Insert Orders

        [HttpPost]
        [ValidateAntiForgeryToken]
        public Response Insert_Orders(orderModel order)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            try
            {
                response = DB.databaseCRUD("sp_InsertOrders", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@userID",Value=Convert.ToString(order.UserID)},
                    new SqlParameter() {ParameterName="@Name",Value=Convert.ToString(order.FullName)},
                    new SqlParameter() {ParameterName="@country",Value=Convert.ToString(order.Country)},
                    new SqlParameter() {ParameterName="@city",Value=Convert.ToString(order.City)},
                    new SqlParameter() {ParameterName="@address",Value=Convert.ToString(order.Address)},
                    new SqlParameter() {ParameterName="@code",Value=Convert.ToString(order.ZipCode)},
                    new SqlParameter() {ParameterName="@phone",Value=Convert.ToString(order.PhoneNo)},
                    new SqlParameter() {ParameterName="@email",Value=Convert.ToString(order.Email)},
                    new SqlParameter() {ParameterName="@total",Value=Convert.ToDecimal(order.GrandTotal)},
                    new SqlParameter() {ParameterName="@shipping",Value=Convert.ToDecimal(order.ShippingCharges)},
                    new SqlParameter() {ParameterName="@method",Value=Convert.ToString(order.Method)},
                    new SqlParameter() {ParameterName="@items",Value=Convert.ToString(order.ItemJSONDetails)}
                });
                if (response.Result)
                {
                    Results.Message = Convert.ToString("Your order is successfully completed!");
                    Results.Result = Convert.ToString(true);
                }
            }
            catch (Exception ex)
            {
                Results.Message = ex.Message;
            }
            return Results;
        }

        #endregion

        #region Get All Orders Against A User

        [HttpGet]
        [ValidateAntiForgeryToken]
        public DataTable getAllUserOrders(string userID)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            DataTable table = new DataTable();
            try
            {
                response = DB.databaseCRUD("sp_GetUserOrders", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@UserID",Value=Convert.ToString(userID)}
                });
                if (response.Result)
                {
                    table = response.DataResult.Tables[0];
                }
            }
            catch (Exception ex)
            {
                table.Rows[0][0] = ex.Message;
            }
            return table;
        }

        #endregion

        #region Get Order By ID

        [HttpGet]
        [ValidateAntiForgeryToken]
        public DataTable GetOrderByID(string userID, int OrderID)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            DataTable table = new DataTable();
            try
            {
                response = DB.databaseCRUD("sp_GetUserOrdersbyID", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@UserID",Value=Convert.ToString(userID)},
                    new SqlParameter() {ParameterName="@OrderID",Value=Convert.ToInt32(OrderID)}
                });
                if (response.Result)
                {
                    table = response.DataResult.Tables[0];
                }
            }
            catch (Exception ex)
            {
                table.Rows[0][0] = ex.Message;
            }
            return table;
        }

        #endregion

        #region Get All Orders For Admin

        [HttpGet]
        [ValidateAntiForgeryToken]
        public DataTable getAllOrders()
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            DataTable table = new DataTable();
            try
            {
                response = DB.databaseCRUD("sp_GetAllOrders");
                if (response.Result)
                {
                    table = response.DataResult.Tables[0];
                }
            }
            catch (Exception ex)
            {
                table.Rows[0][0] = ex.Message;
            }
            return table;
        }

        #endregion

        #region Get All Orders For Admin

        [HttpGet]
        [ValidateAntiForgeryToken]
        public DataTable getOrderItemDetails(int orderID)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            DataTable table = new DataTable();
            try
            {
                response = DB.databaseCRUD("sp_GetAllOrderItems", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@OrderID",Value=Convert.ToInt32(orderID)}
                });
                if (response.Result)
                {
                    table = response.DataResult.Tables[0];
                }
            }
            catch (Exception ex)
            {
                table.Rows[0][0] = ex.Message;
            }
            return table;
        }

        #endregion

        #region Update Order Status
        public Response UpdateOrderStatus(int orderID, string orderStatus)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            try
            {
                response = DB.databaseCRUD("sp_UpdateOrderStatus", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@orderID",Value=Convert.ToInt32(orderID) },
                    new SqlParameter() {ParameterName="@status",Value=Convert.ToString(orderStatus) }
                }
                );
                if (response.Result)
                {
                    Results.Message = Convert.ToString("Order is Updated");
                    Results.Result = Convert.ToString(true);
                }
            }
            catch (Exception ex)
            {
                return new Response();
            }
            return Results;
        }

        #endregion

    }
}