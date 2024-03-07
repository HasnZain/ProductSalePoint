using psl.Models;
using psl.Models.Products;
using psl.Models.Reports;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace psl.Repositories.ReportingRepository
{
    public class reportingRepository
    {
        public Response Results { get; set; }
        public reportingRepository()
        {
            Results = new Response();
        }


        #region Get Product By categoryID

        [HttpPost]
        [ValidateAntiForgeryToken]
        public List<productModel> GetProductsByCategory(int catID)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            List<productModel> products = new List<productModel>();
            try
            {
                response = DB.databaseCRUD("sp_GetProductsbycategoryID", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@CategoryID",Value=Convert.ToInt32(catID)},
                });
                if (response.Result)
                {
                    var table = response.DataResult.Tables[0];
                    foreach (DataRow row in table.Rows)
                    {
                        productModel model = new productModel()
                        {
                            ProductID = Convert.ToInt32(row["ProductID"]),
                            ProductName = row["ProductTitle"].ToString()
                        };
                        products.Add(model);
                    }
                }
            }
            catch (Exception ex)
            {

            }
            return products;
        }

        #endregion


        #region Get All Reports Data

        [HttpPost]
        [ValidateAntiForgeryToken]
        public List<reportModel> GetAllReportsData(int catID, int prodID, string startDate, string endDate)
        {
            DBHelper DB = new DBHelper();
            DBResponse response = new DBResponse();
            List<reportModel> lst = new List<reportModel>();
            try
            {
                response = DB.databaseCRUD("sp_GetAllReportsData", new List<SqlParameter>()
                {
                    new SqlParameter() {ParameterName="@productID",Value=Convert.ToInt32(prodID)},
                    new SqlParameter() {ParameterName="@categryID",Value=Convert.ToInt32(catID)},
                    new SqlParameter() {ParameterName="@From",Value=Convert.ToDateTime(startDate)},
                    new SqlParameter() {ParameterName="@To",Value=Convert.ToDateTime(endDate)},
                });
                if (response.Result)
                {
                    var table = response.DataResult.Tables[0];
                    foreach (DataRow row in table.Rows)
                    {
                        reportModel model = new reportModel()
                        {
                            orderNumber = Convert.ToInt32(row["OrderID"]),
                            customerName = row["FullName"].ToString(),
                            productTitle = row["ProductTitle"].ToString(),
                            categoryTitle = row["CatTitle"].ToString(),
                            productQty = Convert.ToInt32(row["ItemQty"])
                        };
                        lst.Add(model);
                    }
                }
            }
            catch (Exception ex)
            {

            }
            return lst;
        }

        #endregion

    }
}