using System.Web.Mvc;
using Telia.NTW.Core.Services;
using Telia.NTW.Web.Controllers;
using Telia.NTW.Web.Helpers;

namespace Telia.NTW.Web.Attributes
{
	public abstract class CheckDirectObjectAccessAttribute : ActionFilterAttribute
	{
		public CookieHelper CookieHelper { get; set; }
		public StaffService StaffService { get; set; }
		protected decimal CustomerId;
		private readonly string parameterName;

		protected CheckDirectObjectAccessAttribute(string parameterName)
		{
			this.parameterName = parameterName;
		}

		public override void OnActionExecuting(ActionExecutingContext filterContext)
		{
			CustomerId = CookieHelper.GetCustomerId();
			decimal id = GetId(filterContext);
			if (id == -1 || !IsValid(id))
			{
				RedirectTo403(filterContext);
			}
		}

		private decimal GetId(ActionExecutingContext filterContext)
		{
			var idStr = filterContext.HttpContext.Request.Params[parameterName];
			if (idStr != null)
			{
				int commaIndex = idStr.IndexOf(',');
				if (commaIndex < 0)
					return decimal.Parse(idStr);
				else
				{
					idStr = idStr.Substring(0, commaIndex);
					return decimal.Parse(idStr);
				}
			}
			else
			{
				return -1;
			}
		}

		private void RedirectTo403(ActionExecutingContext filterContext)
		{
			var controller = (BaseController)filterContext.Controller;
			filterContext.Result = controller.RedirectToAction("CustomError403", "CustomErrors");
		}

		protected abstract bool IsValid(decimal id);
	}
}