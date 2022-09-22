using AutoMapper;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Telia.NTW.Core.Services;
using Telia.NTW.Web.Helpers;
using Telia.NTW.Web.ViewModel;


namespace Telia.NTW.Web.Filters
{
	public class MeddelandeFilter : ActionFilterAttribute
	{
		private readonly MeddelandeService meddelandeService;
        private readonly SecurityService securityService;

		public MeddelandeFilter(
			MeddelandeService meddelandeService,
            SecurityService securityService
			) {
			this.meddelandeService = meddelandeService;
            this.securityService = securityService;
		}

		public override void OnActionExecuted(ActionExecutedContext filterContext) {
            //string[] userRoles = securityService.GetRolesForUser(CookieHelper.GetOrgLoginName(filterContext.RequestContext.HttpContext.Request.Cookies[FormsAuthentication.FormsCookieName]));
			string[] roles = ((RolePrincipal) HttpContext.Current.User).GetRoles();
			var meddelanden = meddelandeService.GetActive(roles);

			var meddelandeList = Mapper.Map<Core.Entities.MeddelandenActive, MeddelandenModel>(meddelanden);

			var model = (BaseViewModel)filterContext.Controller.ViewData.Model;
			if (model == null)
				return;

			model.MeddelandeList.InfoMessages.AddRange(meddelandeList.InfoMessages);
			model.MeddelandeList.PanicMessages.AddRange(meddelandeList.PanicMessages);
		}
	}
}