using AutoMapper;
using System.Web.Mvc;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Services;
using Telia.NTW.Web.ViewModel;

namespace Telia.NTW.Web.Filters
{
	public class QuickHelpFilter : ActionFilterAttribute
	{
		private readonly QuickHelpService quickHelpService;

		public QuickHelpFilter(
			QuickHelpService quickHelpService
			)
		{
			this.quickHelpService = quickHelpService;
		}

		public override void OnActionExecuted(ActionExecutedContext filterContext)
		{
			var controller = filterContext.RouteData.Values["controller"].ToString();
			var action = filterContext.RouteData.Values["action"].ToString();
			var quickHelp = quickHelpService.Get(controller, action);

			var viewModel = Mapper.Map<QuickHelp, QuickHelpViewModel>(quickHelp);

			var model = (BaseViewModel)filterContext.Controller.ViewData.Model;
			if (model == null)
				return;

			if (viewModel == null)
				viewModel = new QuickHelpViewModel();

			model.QuickHelp = viewModel;
		}
	}
}