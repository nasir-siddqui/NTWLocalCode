using System.Web.Security;
using System;
using System.Linq;
using System.Web.Mvc;
using Telia.NTW.Core.Entities;
using Telia.NTW.Web.Selectors;
using Telia.NTW.Web.ViewModel.Analys;
using Telia.NTW.Web.ActionResults;
using Telia.NTW.Web.Helpers;

namespace Telia.NTW.Web.Controllers
{
    [Authorize(Roles = "Analys")]
	public partial class AnalysController : BaseController
	{
        private readonly AnalysHelper analysHelper;
        private const string Tidsdata = "Tidsdata";
        private const string Ursprungsdata = "Ursprungsdata";
        private const string Rådata = "Rådata";

        public AnalysController(AnalysHelper analysHelper)
		{
            this.analysHelper = analysHelper;
		}

		[HttpGet]
		public virtual ActionResult Index()
		{
           
			var analysViewModel = new AnalysViewModel
			{
                FilterViewModel = analysHelper.populateFilterViewModel(CookieHelper.GetUserDetails()),
				DataViewModel = new AnalysDataViewModel(Enumerable.Empty<AnalysCube>(),
														   Enumerable.Empty<AnalysSamtal>())
														   {
															   HideResult = true
														   }
			};
			return View(analysViewModel);
		}

		[HttpPost]
		[AcceptParameter(Name = "button", Value = "Sök")]
		public virtual ActionResult Index(AnalysFilterViewModel filterViewModel)
		{
            var viewModel = analysHelper.GetViewModel(filterViewModel, CookieHelper.GetUserDetails());
			return View(viewModel);
		}

		[ActionName("Index")]
		[HttpPost]
        [AcceptParameter(Name = "button", Value = "Exportera rådata")]
		public virtual ActionResult Export(AnalysFilterViewModel filterViewModel)
		{
            var viewModel = analysHelper.GetViewModel(filterViewModel, CookieHelper.GetUserDetails());
            if (viewModel.ErrorModel)
                return View(viewModel);
            else
            {
                var filename = String.Format("Samtal_{0}.csv", DateTime.Now.ToShortDateString());
                return new CsvActionResult<AnalysSamtal>(viewModel.DataViewModel.SamtalList, filename);
            }
		}

		[HttpGet]
		public virtual ActionResult SvarstallenAndUpptagningsomraden(int id, DateTime? frånDatum, DateTime? tillDatum)
		{
            var userDetails = CookieHelper.GetUserDetails();

            var svarställenCheckboxList = analysHelper.GetSvarsställeList(id,frånDatum,tillDatum, userDetails);
            var upptagningsområdeCheckboxList = analysHelper.GetUpptagningsområdeList(id, frånDatum, tillDatum, userDetails);
            var disabledFilterTypeList = analysHelper.GetDisabledFilterTyper(userDetails, analysHelper.GetAbonnemang(id,userDetails));
			var filterViewModel = new AnalysFilterViewModel
			{
                SvarsstalleList = svarställenCheckboxList,
				UpptagningsomradeList = upptagningsområdeCheckboxList,
                DisabledFilterTypeList = disabledFilterTypeList
			};

            return PartialView("_Svarstallen_Upptagningsomraden", filterViewModel);
		}


        //TODO: Excelexport
        // Fixa design
        // Fixa så att loggan kommer med
        [ActionName("Index")]
        [HttpPost]
        [AcceptParameter(Name = "button", Value = "Exportera till Excel")]
		public virtual ActionResult ExportExcel(AnalysFilterViewModel filterViewModel)
        {
            var viewModel = analysHelper.GetViewModel(filterViewModel, CookieHelper.GetUserDetails());
            if (viewModel.ErrorModel)
                return View(viewModel);
            else
            {
                var filename = "TeliaExport" + DateTime.Now.ToString("yyyy-MM-dd") + ".xlsx";
                return new AnalysExcelActionResult(viewModel, filename, CookieHelper.GetUserDisplayName(), filterViewModel.FilterTyp.ToString());
            }
        }

	}
    
}