using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Telia.NTW.Web.ViewModel.CustomErrors;

namespace Telia.NTW.Web.Controllers
{
    [AllowAnonymous]
	public partial class CustomErrorsController : BaseController
    {
		public virtual ActionResult CustomError401()
        {
            CustomErrorsViewModel viewModel = new CustomErrorsViewModel();

            return View("Error_401", viewModel);
        }

		public virtual ActionResult CustomError403()
        {
            CustomErrorsViewModel viewModel = new CustomErrorsViewModel();

            return View("Error_403", viewModel);
        }

		public virtual ActionResult CustomError404()
        {
            CustomErrorsViewModel viewModel = new CustomErrorsViewModel();

            return View("Error_404", viewModel);
        }

		public virtual ActionResult CustomError500()
        {
            CustomErrorsViewModel viewModel = new CustomErrorsViewModel();

            return View("Error_500", viewModel);
        }
    }
}