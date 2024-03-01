namespace psl.Migrations
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using psl.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<psl.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(psl.Models.ApplicationDbContext context)
        {
            var aspnetRole = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            var aspnetUser = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));

            if (!aspnetRole.RoleExists("Admin"))
            {
                var adminRole = new IdentityRole("Admin");
                aspnetRole.Create(adminRole);
            }

            if (!aspnetRole.RoleExists("User"))
            {
                var userRole = new IdentityRole("User");
                aspnetRole.Create(userRole);
            }

            var user = aspnetUser.FindByEmail("admin@admin.com");
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = "Admin",
                    FullName = "Admin User",
                    Email = "admin@admin.com",
                };
                aspnetUser.Create(user, "Abc@12345");
            }

            if (!aspnetUser.IsInRole(user.Id, "Admin"))
            {
                aspnetUser.AddToRole(user.Id, "Admin");
            }

            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data.
        }
    }
}
