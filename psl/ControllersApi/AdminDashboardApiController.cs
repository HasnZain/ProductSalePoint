using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
using psl.Repositories.AdminDashboardRepository;
using psl.Models;
using psl.Models.AdminDashboard;
using psl.Models.Order;

namespace psl.ControllersApi
{
    public class AdminDashboardApiController : ApiController
    {
        // GET: GET ALL Products
        [HttpGet]
        public dashboardModel getAllData()
        {
            adminDashboardRepository repository = new adminDashboardRepository();
            return repository.GetAllDashboardData();
        }

        // GET: GET ALL Orders with status Placed
        [HttpGet]
        public List<orderModel> getOrdersPlaced()
        {
            adminDashboardRepository repository = new adminDashboardRepository();
            return repository.getOrdersPlaced();
        }

        // GET: GET ALL Orders with status In Progress
        [HttpGet]
        public List<orderModel> getOrdersInProgress()
        {
            adminDashboardRepository repository = new adminDashboardRepository();
            return repository.getOrdersInProgress();
        }

        // GET: GET ALL Orders with status Dispatched
        [HttpGet]
        public List<orderModel> getOrdersDispatched()
        {
            adminDashboardRepository repository = new adminDashboardRepository();
            return repository.getOrdersDispatched();
        }

        // GET: GET ALL Orders with status Delivered
        [HttpGet]
        public List<orderModel> getOrdersDelivered()
        {
            adminDashboardRepository repository = new adminDashboardRepository();
            return repository.getOrdersDelivered();
        }

    }
}
