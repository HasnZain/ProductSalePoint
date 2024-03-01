using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
using psl.Repositories.AdminDashboardRepository;

namespace psl.ControllersApi
{
    public class AdminDashboardApiController : ApiController
    {
        // GET: GET ALL Products
        [HttpGet]
        public DataTable getAllData()
        {
            DataTable table = new DataTable();
            adminDashboardRepository repository = new adminDashboardRepository();
            table = repository.GetAllDashboardData();
            return table;
        }

        // GET: GET ALL Order with status Placed
        [HttpGet]
        public DataTable getOrdersPlaced()
        {
            DataTable table = new DataTable();
            adminDashboardRepository repository = new adminDashboardRepository();
            table = repository.getOrdersPlaced();
            return table;
        }

        // GET: GET ALL Order with status In Progress
        [HttpGet]
        public DataTable getOrdersInProgress()
        {
            DataTable table = new DataTable();
            adminDashboardRepository repository = new adminDashboardRepository();
            table = repository.getOrdersInProgress();
            return table;
        }

        // GET: GET ALL Order with status Dispatched
        [HttpGet]
        public DataTable getOrdersDispatched()
        {
            DataTable table = new DataTable();
            adminDashboardRepository repository = new adminDashboardRepository();
            table = repository.getOrdersDispatched();
            return table;
        }

        // GET: GET ALL Order with status Delivered
        [HttpGet]
        public DataTable getOrdersDelivered()
        {
            DataTable table = new DataTable();
            adminDashboardRepository repository = new adminDashboardRepository();
            table = repository.getOrdersDelivered();
            return table;
        }
    }
}
