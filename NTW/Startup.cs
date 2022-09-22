using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Telia.NTW.Web.Startup))]
namespace Telia.NTW.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // TODO: ta bort owin-referenser via NuGet
        }
    }
}
