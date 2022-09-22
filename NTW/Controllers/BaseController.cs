using System.Web.Mvc;

namespace Telia.NTW.Web.Controllers
{
	public partial class BaseController : Controller
	{
		public virtual new RedirectToRouteResult RedirectToAction(string action, string controller)
		{
			return base.RedirectToAction(action, controller);
		}
	}
}