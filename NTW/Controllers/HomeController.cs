using System.Web.Mvc;
using Telia.NTW.Web.ViewModel.Home;
using Telia.NTW.Web.ViewModel.Shared;

namespace Telia.NTW.Web.Controllers
{
	public partial class HomeController : BaseController
    {
        // GET: Home
		public virtual ActionResult Index()
        {
			var viewModel = new HomeViewModel {
						 HasSubMenu = false
			};

            return View(viewModel);
        }

		[HttpGet]
		public virtual PartialViewResult GetDeleteConfirm(string controllerName, string deleteAction, string entityName, string id, string id2, string id3, string id4, string id5)
		{
			var deleteConfirmModel = new DeleteConfirmViewModel
			{
				ControllerName = controllerName,
				DeleteAction = deleteAction,
				EntityName = entityName,
				Id = id,
				Id2 = id2,
                Id3 = id3,
                Id4 = id4,
                Id5 = id5
			};

			return PartialView("_DeleteConfirm", deleteConfirmModel);
		}
    }
}