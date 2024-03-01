using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using psl.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace psl.Controllers
{
    [Authorize]
    public class CartController : Controller
    {
        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }
        // GET: Cart
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult CheckOut()
        {
            var userId = User.Identity.GetUserId();
            var userinfo = UserManager.Users.Where(x => x.Id == userId).FirstOrDefault();
            ManageUserProfile profile = new ManageUserProfile()
            {
                userID = userinfo.Id,
                FullName = userinfo.FullName,
                UserName = userinfo.UserName,
                Email = userinfo.Email,
                PhoneNumber = userinfo.PhoneNumber
            };

            return View(profile);
        }
    }
}