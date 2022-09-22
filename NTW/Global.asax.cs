using System.Web;
using log4net;
using System;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Telia.NTW.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
		private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
	    public const string LiveSessionsCount = "LiveSessionsCount";

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

			// add custom filters
			log4net.Config.XmlConfigurator.Configure();

            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

			// init AutoFac
			DicConfig.RegisterDic();

			// init AutoMapper
			MapConfig.RegisterMap();

            // Jquery validation unobtrusive valid() fails on
            // implicitly added validation for non nullable data types.
            // This is because ValidationErrorMessage does not exist for these. (Incompatiblity issue?)
            DataAnnotationsModelValidatorProvider.AddImplicitRequiredAttributeForValueTypes = false;

			// Initialize the sessions counter.
			Application[LiveSessionsCount] = 0;
        }

        protected void Application_BeginRequest(Object sender, EventArgs e)
        {
            // This has to be called here because it alters current thread.
            // The thread used in Application_Start is not the same that renders the pages.
            DefaultsConfig.SetDefaultDateTimeFormat();
        }

		protected void Application_Error(Object sender, EventArgs e)
		{
			Exception ex = Server.GetLastError().GetBaseException();

			// Disable logging of HttpExceptions.
			// The production log is full of rows similar to this one:
			// "System.Web.HttpException (0x80004005): The controller for path '/lol.html' was not found or does not implement IController."
			if(ex.GetType() != typeof(HttpException))
				log.Error("App_Error", ex);
		}

	    protected void Session_Start(Object sender, EventArgs e)
	    {
			Application[LiveSessionsCount] = ((int)Application[LiveSessionsCount]) + 1;
	    }

		protected void Session_End(Object sender, EventArgs e)
	    {
			Application[LiveSessionsCount] = ((int)Application[LiveSessionsCount]) - 1;
	    }
    }
}
