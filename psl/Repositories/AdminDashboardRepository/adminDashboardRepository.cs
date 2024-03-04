using psl.Models;
using psl.Models.AdminDashboard;
using psl.Models.Order;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace psl.Repositories.AdminDashboardRepository
{
    public class adminDashboardRepository
    {
        public Response Results { get; set; }
        public adminDashboardRepository()
        {
            Results = new Response();
        }

        #region Get All Dashboard Data

        [HttpGet]
        public dashboardModel GetAllDashboardData()
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            dashboardModel model = new dashboardModel();
            try
            {
                response = DB.databaseCRUD("sp_GetAdminDashboardData");
                if (response.Result)
                {
                    if (response.DataResult.Tables[0].Rows.Count > 0)
                    {
                        DataRow row = response.DataResult.Tables[0].Rows[0];
                        model.adminsCount = Convert.ToInt32(row.ItemArray[0]);
                        model.usersCount = Convert.ToInt32(row.ItemArray[1]);
                        model.productCount = Convert.ToInt32(row.ItemArray[2]);
                        model.categoryCount = Convert.ToInt32(row.ItemArray[3]);
                    }
                }
            }
            catch (Exception)
            {
            }
            return model;
        }

        #endregion

        #region Get All Order with status Placed

        [HttpGet]
        public List<orderModel> getOrdersPlaced()
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            List<orderModel> orders = new List<orderModel>();
            try
            {
                response = DB.databaseCRUD("sp_GetOrdersPlaced");
                if (response.Result)
                {
                    if(response.DataResult.Tables[0].Rows.Count > 0)
                    {
                        foreach(DataRow row in response.DataResult.Tables[0].Rows)
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

        #region Get All Order with status In Progress

        [HttpGet]
        public List<orderModel> getOrdersInProgress()
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            List<orderModel> orders = new List<orderModel>();
            try
            {
                response = DB.databaseCRUD("sp_GetOrdersInProcess");
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

        #region Get All Order with status Dispatched

        [HttpGet]
        public List<orderModel> getOrdersDispatched()
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            List<orderModel> orders = new List<orderModel>();
            try
            {
                response = DB.databaseCRUD("sp_GetOrdersDispatched");
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

        #region Get All Order with status Delivered

        [HttpGet]
        public List<orderModel> getOrdersDelivered()
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            List<orderModel> orders = new List<orderModel>();
            try
            {
                response = DB.databaseCRUD("sp_GetOrdersDelivered");
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
    }
}