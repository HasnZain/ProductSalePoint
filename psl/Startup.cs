using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(psl.Startup))]
namespace psl
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
