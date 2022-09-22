using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Sigma.Utils.ActionResults;
using Telia.NTW.Core.Helpers;
using Telia.NTW.Core.Services;
using Telia.NTW.Web.Attributes;
using Telia.NTW.Web.Helpers;
using Telia.NTW.Web.ViewModel.Webbstyrning.Multistyrning;

namespace Telia.NTW.Web.Controllers
{
	[Authorize (Roles = RoleHelper.WebbstyrningMultistyrning)]
	public partial class MultistyrningController : BaseController
    {
	    private readonly StaffService staffService;
	    private readonly CookieHelper cookieHelper;
	    private readonly MultistyrningHelper multistyrningHelper;

	    public MultistyrningController(StaffService staffService, CookieHelper cookieHelper, MultistyrningHelper multistyrningHelper)
	    {
		    this.staffService = staffService;
		    this.cookieHelper = cookieHelper;
		    this.multistyrningHelper = multistyrningHelper;
	    }

		public virtual ActionResult Index(List<string> errorMessages)
		{
			var multistyrningViewModel = multistyrningHelper.GetMultistyrningViewModel();

			multistyrningViewModel.addErrorMessages(errorMessages);

			return View(multistyrningViewModel);
		}

		public virtual ExcelActionResult Index_ExportToExcel()
		{
			var multistyrningViewModel = multistyrningHelper.GetMultistyrningViewModel();
			return new ExcelActionResult(multistyrningViewModel, "Multistyrning");
		}

		#region Kö
		[HttpGet]
		public virtual ActionResult Kö_Create(List<string> errorMessages)
		{
			MultistyrningsköEditViewModel viewModel = new MultistyrningsköEditViewModel();

			viewModel.addErrorMessages(errorMessages);

			viewModel.AlternativList = multistyrningHelper.FillMultistyrningsalternativSelectList(cookieHelper.GetCustomerId());

			return View(viewModel);
		}

		[HttpPost]
		[ValidateAntiForgeryToken]
		public virtual ActionResult Kö_Create(MultistyrningsköEditViewModel viewModel)
		{
			if (!ModelState.IsValid)
			{
				viewModel.AlternativList = multistyrningHelper.FillMultistyrningsalternativSelectList(cookieHelper.GetCustomerId());
				return View(viewModel);
			}

			List<string> errorMessages = new List<string>();

			if (!(multistyrningHelper.CheckIfMultistyrningContainsRows(viewModel.AlternativVIPMultiConnectedId.Value)))
			{
				errorMessages.Add(string.Format("Multistyrningsalternativet innehåller inga styrningar och kan därför inte schemaläggas."));

				var routeValues = GeneralHelper.GetRouteList(errorMessages, "errorMessages");

				return RedirectToAction("Kö_Create", routeValues);
			}

			DateTime? begärtDatum = multistyrningHelper.GetBegärtDatum(viewModel);
			staffService.Multistyrning_Kö_Create(viewModel.AlternativVIPMultiConnectedId.Value, begärtDatum, CookieHelper.GetUserDisplayName(), viewModel.SåSnartSomMöjligt);

			return RedirectToAction("Index");
		}

		[HttpGet]
		[MultistyrningKöCheckAccess("KöVIPMultiConnectedId")]
		public virtual ActionResult Kö_Edit(MultistyrningsköRow multistyrningsköRow)
		{
			var viewModel = new MultistyrningsköEditViewModel
			{
				KöVIPMultiConnectedId = multistyrningsköRow.KöVIPMultiConnectedId,
				AlternativVIPMultiConnectedId = (int) multistyrningsköRow.KöVIPMultiConnectedId,
				SåSnartSomMöjligt = false,
				AlternativList = multistyrningHelper.FillMultistyrningsalternativSelectList(cookieHelper.GetCustomerId())
			};

			if (multistyrningsköRow.BegärtDatum != null)
			{
				viewModel.BegärtDatum = multistyrningsköRow.BegärtDatum;
				viewModel.OldBegärtDatum = multistyrningsköRow.BegärtDatum;

			}

			return View(viewModel);
		}

		[HttpPost]
		[MultistyrningKöCheckAccess("KöVIPMultiConnectedId")]
		public virtual ActionResult Kö_Edit(MultistyrningsköEditViewModel viewModel)
		{
			if (!ModelState.IsValid)
			{
				viewModel.AlternativList = multistyrningHelper.FillMultistyrningsalternativSelectList(cookieHelper.GetCustomerId());
				return View(viewModel);
			}

			DateTime? begärtDatum = multistyrningHelper.GetBegärtDatum(viewModel);
			staffService.Multistyrning_Kö_Edit(viewModel.AlternativVIPMultiConnectedId.Value, begärtDatum, viewModel.OldBegärtDatum, CookieHelper.GetUserDisplayName(), viewModel.SåSnartSomMöjligt);

			return RedirectToAction("Index");
		}

		[HttpGet]
		[MultistyrningKöCheckAccess("id")]
		public virtual ActionResult Kö_Delete(int id, string id2)
		{
			decimal vIPMultiConnectedId = id;

			DateTime begärtDatum = Convert.ToDateTime(id2);

			List<string> errorMessages = new List<string>();

			if (begärtDatum > DateTime.Now)
			{
				staffService.Multistyrning_Kö_Delete(vIPMultiConnectedId, begärtDatum, CookieHelper.GetUserDisplayName());
			}
			else
			{
				errorMessages.Add(string.Format("Du kan inte ta bort en styrning som har ett datum som är tidigare än {0}.", DateTime.Now));
			}

			var routeValues = GeneralHelper.GetRouteList(errorMessages, "errorMessages");

			return RedirectToAction("Index", routeValues);
		}
		#endregion

		#region Alternativ
		[HttpGet]
		public virtual ActionResult Alternativ_Create()
		{
			var viewModel = new Multistyrning_Alternativ_FormViewModel();

			multistyrningHelper.Multistyrning_Alternativ_FillLists(viewModel);
			viewModel.abonnemangList = viewModel.abonnemangList.OrderBy(abonnemang => abonnemang.Abonnemang).ToList();

			return View(viewModel);
		}


		[HttpPost]
		public virtual ActionResult Alternativ_Create(Multistyrning_Alternativ_FormViewModel viewModel)
		{
			if (!ModelState.IsValid)
			{
				multistyrningHelper.Multistyrning_Alternativ_FillLists(viewModel);
				return View(viewModel);
			}

			// Save multistyrning name
			var customerId = cookieHelper.GetCustomerId();
			var vipMultiConnectedId = staffService.Multistyrning_Alternativ_Create(viewModel.Namn, customerId, CookieHelper.GetOriginalUsername());

			// Get connected abonnemang list
			var connectedAbonnemangList = viewModel.abonnemangList.Where(i => i.Kopplat);

			// Save connected abonnemang
			foreach (var connectedAbonnemang in connectedAbonnemangList)
			{
				staffService.Multistyrning_Alternativ_SaveStyrningsalternativ(0, vipMultiConnectedId, connectedAbonnemang.ServiceId, connectedAbonnemang.ConnectLinkId, CookieHelper.GetOriginalUsername());
			}

			return RedirectToAction("Index");
		}

		[HttpGet]
		[MultistyrningAlternativCheckAccess("id")]
		public virtual ActionResult Alternativ_Edit(decimal id, string namn)
		{
			// Set view model values from get values
			Multistyrning_Alternativ_FormViewModel viewModel = new Multistyrning_Alternativ_FormViewModel();
			viewModel.VIPMultiConnectedId = id;
			viewModel.Namn = namn;

			multistyrningHelper.Multistyrning_Alternativ_FillLists(viewModel);
			multistyrningHelper.Multistyrning_Alternativ_GetKoppladeAbonnemang(viewModel);

			return View(viewModel);
		}

		[HttpPost]
		[MultistyrningAlternativCheckAccess("VIPMultiConnectedId")]
		public virtual ActionResult Alternativ_Edit(Multistyrning_Alternativ_FormViewModel viewModel)
		{
			if (!ModelState.IsValid)
			{
				multistyrningHelper.Multistyrning_Alternativ_FillLists(viewModel);
				return View(viewModel);
			}

			multistyrningHelper.Multistyrning_Alternativ_Save(viewModel);

			return RedirectToAction("Index");
		}

		[HttpGet]
		[MultistyrningAlternativCheckAccess("id")]
		public virtual ActionResult Alternativ_Delete(int id)
		{
			List<string> errorMessages = new List<string>();

			var obj = staffService.Multistyrning_Kö_GetList(cookieHelper.GetCustomerId()).SingleOrDefault(m => m.VIPMultiConnectedId == id);

			// om obj är null så finns det ingen aktiv koppling och multistyrningsalternativet kan raderas
			if (obj == null)
			{
				staffService.Mulstistyrning_Alternativ_Delete(Convert.ToDecimal(id), CookieHelper.GetUserDisplayName());
			}
			else
			{
				errorMessages.Add("Multistyrningsalternativet är schemalagt och kan därför inte tas bort.");
			}

			var routeValues = GeneralHelper.GetRouteList(errorMessages, "errorMessages");

			return RedirectToAction("Index", routeValues);
		}
		#endregion
    }
}