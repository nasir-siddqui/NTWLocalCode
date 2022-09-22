using System.Web.Mvc;
using Telia.NTW.Core.Services;

namespace Telia.NTW.Web.Controllers
{
	public partial class QuickHelpController : BaseController
    {
		private readonly QuickHelpService QuickHelpService;

		public QuickHelpController(QuickHelpService quickHelpService)
		{
			this.QuickHelpService = quickHelpService;
		}

		public virtual ActionResult FAQ(string id)
        {
			var json = QuickHelpService.Get(id).Content;

			return this.Content(json, "application/json");
        }

		public virtual ActionResult Guide(string id)
		{
			var json = QuickHelpService.Get(id).Content;

			return this.Content(json, "application/json");
		}
    }
}