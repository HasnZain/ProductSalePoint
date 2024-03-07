using psl.Models.Products;
using psl.Models.Reports;
using psl.Repositories.ReportingRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace psl.ControllersApi
{
    public class ReportingApiController : ApiController
    {

        // GET: GET Products by categoryID
        [HttpGet]
        public List<productModel> getProductsByCategory(int catID)
        {
            reportingRepository repository = new reportingRepository();
            List<productModel> model = repository.GetProductsByCategory(catID);
            return model;
        }

        // GET: GET All Reporting Data
        [HttpGet]
        public List<reportModel> getAllReportsData(string startDate = "", string endDate = "", int prodID = 0, int catID = 0)
        {
            reportingRepository repository = new reportingRepository();
            List<reportModel> model = repository.GetAllReportsData(catID, prodID, startDate, endDate);
            return model;
        }
    }
}
