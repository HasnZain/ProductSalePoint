using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using psl.Models;

namespace psl.Controllers
{
    [Authorize]
    public class ManageController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        private RoleManager<IdentityRole> _roleManager;
        ApplicationDbContext context = new ApplicationDbContext();

        public ManageController()
        {
        }

        public ManageController(ApplicationUserManager userManager, ApplicationSignInManager signInManager, RoleManager<IdentityRole> roleManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
            _roleManager = roleManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set 
            { 
                _signInManager = value; 
            }
        }

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

        #region Change Profile Information

        //
        // GET: /Manage/Index
        public async Task<ActionResult> Index()
        {
            var userId = User.Identity.GetUserId();
            var userinfo = UserManager.Users.Where(x => x.Id == userId).FirstOrDefault();

            var model = new ManageUserProfile
            {
                FullName = userinfo.FullName,
                PhoneNumber = userinfo.PhoneNumber,
                UserName = userinfo.UserName,
                Email = userinfo.Email
            };
            return View(model);
        }

        //
        // POST: /Manage/Index
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Index(ManageUserProfile model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var UserDtls = await UserManager.FindByIdAsync(User.Identity.GetUserId());
            UserDtls.FullName = model.FullName;
            UserDtls.Email = model.Email;
            UserDtls.UserName = model.UserName;
            UserDtls.PhoneNumber = model.PhoneNumber;

            var result = await UserManager.UpdateAsync(UserDtls);
            if (result.Succeeded)
            {
                ViewBag.SuccessMessage = "Your Profile is updated successfully.";
                return View(model);
            }
            AddErrors(result);
            return View(model);
        }

        #endregion

        #region  Change Password Region

        //
        // GET: /Manage/ChangePassword
        public ActionResult ChangePassword()
        {
            return View();
        }

        //
        // POST: /Manage/ChangePassword
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword, model.NewPassword);
            if (result.Succeeded)
            {
                var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
                if (user != null)
                {
                    await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                }

                ViewBag.SuccessMessage = "Password is updated successfully";
                return View(model);
            }

            AddErrors(result);
            return View(model);
        }

        #endregion

        #region Set Password Region

        //
        // GET: /Manage/SetPassword
        public ActionResult SetPassword()
        {
            return View();
        }

        //
        // POST: /Manage/SetPassword
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SetPassword(SetPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);
                if (result.Succeeded)
                {
                    var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
                    if (user != null)
                    {
                        await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                    }
                    return RedirectToAction("Index", new { Message = ManageMessageId.SetPasswordSuccess });
                }
                AddErrors(result);
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        #endregion

        #region Manage Admins Profiles

        //
        // GET: /Manage/ManageAdmins
        public ActionResult ManageAdmins()
        {
            _roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            var roleChk = _roleManager.FindByName("Admin");
            var users = UserManager.Users.Where(x => x.Roles.Any(m => m.RoleId == roleChk.Id)).ToList();
            UserProfiles profiles = new UserProfiles();
            foreach (var userinfo in users)
            {
                var model = new ManageUserProfile
                {
                    userID = userinfo.Id,
                    FullName = userinfo.FullName,
                    PhoneNumber = userinfo.PhoneNumber,
                    UserName = userinfo.UserName,
                    Email = userinfo.Email
                };
                profiles.TotalAdmins.Add(model);
            }

            return View(profiles);
        }

        //
        // POST: /Manage/ManageAdmins
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ManageAdmins(ManageUserProfile model)
        {
            UserProfiles profiles = new UserProfiles();

            var UserDtls = await UserManager.FindByIdAsync(model.userID);
            UserDtls.FullName = model.FullName;
            UserDtls.Email = model.Email;
            UserDtls.UserName = model.UserName;
            UserDtls.PhoneNumber = model.PhoneNumber;

            var result = await UserManager.UpdateAsync(UserDtls);
            if (result.Succeeded)
            {
                _roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
                var roleChk = _roleManager.FindByName("Admin");
                var users = UserManager.Users.Where(x => x.Roles.Any(m => m.RoleId == roleChk.Id)).ToList();
                foreach (var userinfo in users)
                {
                    var model1 = new ManageUserProfile
                    {
                        userID = userinfo.Id,
                        FullName = userinfo.FullName,
                        PhoneNumber = userinfo.PhoneNumber,
                        UserName = userinfo.UserName,
                        Email = userinfo.Email
                    };
                    profiles.TotalAdmins.Add(model1);
                }
                return View(profiles);
            }
            AddErrors(result);
            return View(profiles);
        }

        #endregion

        #region Add new Admins

        //
        // GET: /Manage/AddNewAdmins
        public ActionResult AddNewAdmins()
        {
            return View();
        }

        //
        // POST: /Manage/AddNewAdmins
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> AddNewAdmins(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser { UserName = model.UserName, FullName = model.FullName, Email = model.Email };
                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await UserManager.AddToRoleAsync(user.Id, "Admin");
                    return RedirectToAction("ManageAdmins", "Manage");
                }
                AddErrors(result);
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        #endregion

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }

#region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private bool HasPassword()
        {
            var user = UserManager.FindById(User.Identity.GetUserId());
            if (user != null)
            {
                return user.PasswordHash != null;
            }
            return false;
        }

        private bool HasPhoneNumber()
        {
            var user = UserManager.FindById(User.Identity.GetUserId());
            if (user != null)
            {
                return user.PhoneNumber != null;
            }
            return false;
        }

        public enum ManageMessageId
        {
            AddPhoneSuccess,
            ChangePasswordSuccess,
            SetTwoFactorSuccess,
            SetPasswordSuccess,
            RemoveLoginSuccess,
            RemovePhoneSuccess,
            Error
        }

#endregion
    }
}