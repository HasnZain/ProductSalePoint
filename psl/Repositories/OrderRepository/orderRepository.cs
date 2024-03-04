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
        public List<orderModel> getAllUserOrders(string userID)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            List<orderModel> orders = new List<orderModel>();
            try
            {
                response = DB.databaseCRUD("sp_GetUserOrders", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@UserID",Value=Convert.ToString(userID)}
                });
                if (response.Result)
                {
                    if (response.DataResult.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow row in response.DataResult.Tables[0].Rows)
                        {
                            orderModel model = new orderModel()
                            {
                                Ord_ID = Convert.ToInt32(row["OrderID"]),
                                UserID = Convert.ToString(row["UserID"]),
                                FullName = Convert.ToString(row["FullName"]),
                                Country = Convert.ToString(row["Country"]),
                                City = Convert.ToString(row["City"]),
                                Address = Convert.ToString(row["Address"]),
                                ZipCode = Convert.ToString(row["ZipCode"]),
                                Email = Convert.ToString(row["Email"]),
                                PhoneNo = Convert.ToString(row["PhoneNo"]),
                                GrandTotal = Convert.ToDecimal(row["Ord_Total"]),
                                ShippingCharges = Convert.ToDecimal(row["Shipping_Charges"]),
                                Method = Convert.ToString(row["Payment_Method"]),
                                Status = Convert.ToString(row["Ord_Status"]),
                                returningDate = Convert.ToString(row["InsertedDatetime"])
                            };
                            orders.Add(model);
                        }
                    }
                }
            }
            catch (Exception)
            {
            }
            return orders;
        }

        #endregion

        #region Get Order By ID

        [HttpGet]
        public orderModel GetOrderByID(string userID, int OrderID)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            orderModel model = new orderModel();
            try
            {
                response = DB.databaseCRUD("sp_GetUserOrdersbyID", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@UserID",Value=Convert.ToString(userID)},
                    new SqlParameter() {ParameterName="@OrderID",Value=Convert.ToInt32(OrderID)}
                });
                if (response.Result)
                {
                    if (response.DataResult.Tables[0].Rows.Count > 0)
                    {
                        DataRow row = response.DataResult.Tables[0].Rows[0];
                        model.Ord_ID = Convert.ToInt32(row["OrderID"]);
                        model.UserID = Convert.ToString(row["UserID"]);
                        model.FullName = Convert.ToString(row["FullName"]);
                        model.Country = Convert.ToString(row["Country"]);
                        model.City = Convert.ToString(row["City"]);
                        model.Address = Convert.ToString(row["Address"]);
                        model.ZipCode = Convert.ToString(row["ZipCode"]);
                        model.Email = Convert.ToString(row["Email"]);
                        model.PhoneNo = Convert.ToString(row["PhoneNo"]);
                        model.GrandTotal = Convert.ToDecimal(row["Ord_Total"]);
                        model.ShippingCharges = Convert.ToDecimal(row["Shipping_Charges"]);
                        model.Method = Convert.ToString(row["Payment_Method"]);
                        model.Status = Convert.ToString(row["Ord_Status"]);
                        model.returningDate = Convert.ToString(row["InsertedDatetime"]);
                    }
                }
            }
            catch (Exception)
            {
            }
            return model;
        }

        #endregion

        #region Get All Orders For Admin

        [HttpGet]
        public List<orderModel> getAllOrders()
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            List<orderModel> orders = new List<orderModel>();
            try
            {
                response = DB.databaseCRUD("sp_GetAllOrders");
                if (response.Result)
                {
                    if (response.DataResult.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow row in response.DataResult.Tables[0].Rows)
                        {
                            orderModel model = new orderModel()
                            {
                                Ord_ID = Convert.ToInt32(row["OrderID"]),
                                UserID = Convert.ToString(row["UserID"]),
                                FullName = Convert.ToString(row["FullName"]),
                                Country = Convert.ToString(row["Country"]),
                                City = Convert.ToString(row["City"]),
                                Address = Convert.ToString(row["Address"]),
                                ZipCode = Convert.ToString(row["ZipCode"]),
                                Email = Convert.ToString(row["Email"]),
                                PhoneNo = Convert.ToString(row["PhoneNo"]),
                                GrandTotal = Convert.ToDecimal(row["Ord_Total"]),
                                ShippingCharges = Convert.ToDecimal(row["Shipping_Charges"]),
                                Method = Convert.ToString(row["Payment_Method"]),
                                Status = Convert.ToString(row["Ord_Status"]),
                                returningDate = Convert.ToString(row["InsertedDatetime"])
                            };
                            orders.Add(model);
                        }
                    }
                }
            }
            catch (Exception)
            {
                
            }
            return orders;
        }

        #endregion

        #region Get All Order Items For Admin

        [HttpGet]
        public List<orderItemsModel> getOrderItemDetails(int orderID)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            List<orderItemsModel> orderItems = new List<orderItemsModel>();
            try
            {
                response = DB.databaseCRUD("sp_GetAllOrderItems", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@OrderID",Value=Convert.ToInt32(orderID)}
                });
                if (response.Result)
                {
                    if (response.DataResult.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow row in response.DataResult.Tables[0].Rows)
                        {
                            orderItemsModel model = new orderItemsModel()
                            {
                                itemID = Convert.ToInt32(row["ItemID"]),
                                orderID = Convert.ToInt32(row["OrderID"]),
                                productID = Convert.ToInt32(row["ProductID"]),
                                productTitle = Convert.ToString(row["ProductTitle"]),
                                productDesc = Convert.ToString(row["ProdDescription"]),
                                categoryID = Convert.ToInt32(row["CategoryID"]),
                                categoryTitle = Convert.ToString(row["CatTitle"]),
                                productPrice = Convert.ToDecimal(row["ItemPrice"]),
                                Quantity = Convert.ToInt32(row["ItemQty"]),
                                itemTotal = Convert.ToDecimal(row["ItemTotal"])
                            };
                            orderItems.Add(model);
                        }
                    }
                }
            }
            catch (Exception)
            {
            }
            return orderItems;
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