using System.Web.Mvc;

namespace Telia.NTW.Web
{
	public class FilterConfig
	{
		public static void RegisterGlobalFilters(GlobalFilterCollection filters)
		{
			//filters.Add(new HandleErrorAttribute());
            filters.Add(new AuthorizeAttribute());
		}
	}
}
