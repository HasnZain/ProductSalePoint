using psl.Models;
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
        [ValidateAntiForgeryToken]
        public DataTable GetAllDashboardData()
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            DataTable table = new DataTable();
            try
            {
                response = DB.databaseCRUD("sp_GetAdminDashboardData");
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

        #region Get All Order with status Placed

        [HttpGet]
        [ValidateAntiForgeryToken]
        public DataTable getOrdersPlaced()
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            DataTable table = new DataTable();
            try
            {
                response = DB.databaseCRUD("sp_GetOrdersPlaced");
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

        #region Get All Order with status In Progress

        [HttpGet]
        [ValidateAntiForgeryToken]
        public DataTable getOrdersInProgress()
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            DataTable table = new DataTable();
            try
            {
                response = DB.databaseCRUD("sp_GetOrdersInProcess");
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

        #region Get All Order with status Dispatched

        [HttpGet]
        [ValidateAntiForgeryToken]
        public DataTable getOrdersDispatched()
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            DataTable table = new DataTable();
            try
            {
                response = DB.databaseCRUD("sp_GetOrdersDispatched");
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

        #region Get All Order with status Delivered

        [HttpGet]
        [ValidateAntiForgeryToken]
        public DataTable getOrdersDelivered()
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            DataTable table = new DataTable();
            try
            {
                response = DB.databaseCRUD("sp_GetOrdersDelivered");
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
    }
}