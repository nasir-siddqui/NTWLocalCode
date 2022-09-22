using System.Collections;
using System.Collections.Immutable;
using AutoMapper;
using log4net;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Math;
using Sigma.Utils.ActionResults;
using Sigma.Utils.Entities;
using Telia.NTW.Core.Entities.Staff;
using Telia.NTW.Core.Helpers;
using Telia.NTW.Core.Services;
using Telia.NTW.Web.Helpers;
using Telia.NTW.Web.ViewModel;
using Telia.NTW.Web.ViewModel.Webbstyrning.Webbstyrning;
using Telia.NTW.Core.Entities;

namespace Telia.NTW.Web.Controllers
{
	[Authorize(Roles = "Webbstyrning, Administratör")]
	public partial class WebbstyrningController : BaseController
    {
        private readonly StaffService _staffService;
        private readonly SecurityService _securityService;
        private readonly WebbstyrningHelper _webbstyrningHelper;
		private readonly MultistyrningHelper _multistyrningHelper;
		private readonly CookieHelper _cookieHelper;

        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public WebbstyrningController(StaffService staffService, SecurityService securityService, WebbstyrningHelper webbstyrningHelper, MultistyrningHelper multistyrningHelper, CookieHelper cookieHelper)
        {
            this._staffService = staffService;
            this._securityService = securityService;
            this._webbstyrningHelper = webbstyrningHelper;
	        this._multistyrningHelper = multistyrningHelper;
	        this._cookieHelper = cookieHelper;
        }

        protected new JsonResult Json(object data, JsonRequestBehavior behavior)
        {
            return new JsonNetResult
            {
                Data = data,
                JsonRequestBehavior = behavior
            };
        }

        #region Webbstyrning
        [Authorize(Roles = RoleHelper.Webbstyrning)]
		[HttpGet]
		public virtual ActionResult Index()
        {
            WebbstyrningViewModel viewModel = new WebbstyrningViewModel();

            viewModel.CustomerId = _cookieHelper.GetCustomerId();

            if (viewModel.CustomerId != -1)
            {
                try
                {
	                List<StaffSelectServiceRow> abonnemangsLista =
		                _webbstyrningHelper.FillWebbstyrningViewModel(viewModel);

                    // Session
                    _webbstyrningHelper.SetServiceIdList(abonnemangsLista);

                    CompanyInfo company = _securityService.GetCompanyForUser(User.Identity.Name);
                    viewModel.Bolagsnyckel = company.PhoneKey;
                }
                catch (Exception)
                {
                    // List is created in constructor and error is logged in core project
                }
            }

            return View(viewModel);
        }

		[HttpGet]
		[Authorize (Roles = RoleHelper.Webbstyrning)]
		public virtual ExcelActionResult Index_ExportToExcel()
		{
			WebbstyrningViewModel viewModel = new WebbstyrningViewModel();
			_webbstyrningHelper.FillWebbstyrningViewModel(viewModel);

			return new ExcelActionResult(viewModel.Abonnemang, "Abonnemang.xlsx");
		}

        [Authorize(Roles = RoleHelper.Webbstyrning)]
		[HttpGet]
		public virtual ActionResult Abonnemang(decimal serviceId, string abonnemang, List<string> errorMessages)
        {
            // Session
            if (!(_webbstyrningHelper.CheckIfServiceIdExists(serviceId)))
            {
                return RedirectToAction("CustomError403", "CustomErrors");
            }

            AbonnemangViewModel abonnemangViewModel = new AbonnemangViewModel();
            abonnemangViewModel.addErrorMessages(errorMessages);
            _webbstyrningHelper.FillAbonnemangViewModel(abonnemangViewModel, serviceId, abonnemang);

	        return View(abonnemangViewModel);

        }

		[Authorize(Roles = RoleHelper.Webbstyrning)]
		[HttpGet]
		public virtual ExcelActionResult Abonnemang_ExportToExcel(decimal serviceId, string abonnemang)
		{
			AbonnemangViewModel abonnemangViewModel = new AbonnemangViewModel();
			_webbstyrningHelper.FillAbonnemangViewModel(abonnemangViewModel, serviceId, abonnemang);
			
			OrderedDictionary<string, IList> data = new OrderedDictionary<string, IList>();
			data.Add("Styrningskö", abonnemangViewModel.Styrningskö);
			data.Add("Styrningsalternativ", abonnemangViewModel.Styrningsalternativ);
			data.Add("Svarsställen", abonnemangViewModel.Svarsställen);
			data.Add("Historik", abonnemangViewModel.Historik);
			if (User.IsInRole(RoleHelper.Administratör))
			{
				data.Add("Logg", abonnemangViewModel.Logg);
			}

			return new ExcelActionResult(data, abonnemang + ".xlsx");
		}
        #endregion

        #region Kö
        [HttpGet]
        [Authorize(Roles = RoleHelper.WebbstyrningWrite)]
		public virtual ActionResult Kö_Create(string abonnemang, decimal serviceId)
        {
            // Session
            if (!(_webbstyrningHelper.CheckIfServiceIdExists(serviceId)))
            {
                return RedirectToAction("CustomError403", "CustomErrors");
            }

            KöEditViewModel viewModel = new KöEditViewModel
            {
                CreatingNew = true,
                ServiceId = serviceId,
                Abonnemang = abonnemang,
                CustomerId = _cookieHelper.GetCustomerId()
            };

            List<StaffListAlternativesRow> styrningsalternativ = _staffService.Webstyrning_Alternativ_GetList(viewModel.ServiceId);
            viewModel.StyrningsalternativList = new SelectList(styrningsalternativ, "Id", "Alternativnamn");

            return View(viewModel);
        }

        [HttpPost]
		[ValidateAntiForgeryToken]
        [Authorize(Roles = RoleHelper.WebbstyrningWrite)]
		public virtual ActionResult Kö_Create(KöEditViewModel viewModel)
        {
            if (!(_webbstyrningHelper.CheckIfServiceIdExists(viewModel.ServiceId)))
            {
                return RedirectToAction("CustomError403", "CustomErrors");
            }

            if (!ModelState.IsValid)
            {
                List<StaffListAlternativesRow> styrningsalternativ = _staffService.Webstyrning_Alternativ_GetList(viewModel.ServiceId);
                viewModel.StyrningsalternativList = new SelectList(styrningsalternativ, "Id", "Alternativnamn");
            	return View(viewModel);
            }

            viewModel.CustomerId = _cookieHelper.GetCustomerId();
            _staffService.Webbstyrning_Kö_Save(viewModel.ServiceId, viewModel.StyrningsId, viewModel.AlternativId.Value, viewModel.BegärtDatum, CookieHelper.GetUserDisplayName(), viewModel.Inkopplingstyp);

            return RedirectToAction("Abonnemang", new
            {
                serviceId = viewModel.ServiceId,
                abonnemang = viewModel.Abonnemang
            });
        }

        [HttpGet]
        [Authorize(Roles = RoleHelper.WebbstyrningWrite)]
		public virtual ActionResult Kö_Edit(string abonnemang, decimal serviceId, DateTime begärtDatum, decimal alternativId)
        {
            // Session
            if (!(_webbstyrningHelper.CheckIfServiceIdExists(serviceId)))
            {
                return RedirectToAction("CustomError403", "CustomErrors");
            }

            KöEditViewModel viewModel = new KöEditViewModel
            {
                CreatingNew = false,
                ServiceId = serviceId,
                Abonnemang = abonnemang,
                AlternativId = alternativId,
                CustomerId = _cookieHelper.GetCustomerId()
            };

            List<StaffListAlternativesRow> styrningsalternativ = _staffService.Webstyrning_Alternativ_GetList(viewModel.ServiceId);
            viewModel.StyrningsalternativList = new SelectList(styrningsalternativ, "Id", "Alternativnamn");

            //TODO: Populate datepicker with the date value below
            // Time works
            viewModel.BegärtDatum = begärtDatum;

            return View(viewModel);
        }

        [HttpPost]
		[ValidateAntiForgeryToken]
        [Authorize(Roles = RoleHelper.WebbstyrningWrite)]
		public virtual ActionResult Kö_Edit(KöEditViewModel viewModel, decimal styrningsId)
        {
            // Session
            if (!(_webbstyrningHelper.CheckIfServiceIdExists(viewModel.ServiceId)))
            {
                return RedirectToAction("CustomError403", "CustomErrors");
            }

            if (!ModelState.IsValid)
            {
                List<StaffListAlternativesRow> styrningsalternativ = _staffService.Webstyrning_Alternativ_GetList(viewModel.ServiceId);
                viewModel.StyrningsalternativList = new SelectList(styrningsalternativ, "Id", "Alternativnamn");
                return View(viewModel);
            }

            viewModel.CustomerId = _cookieHelper.GetCustomerId();
			_staffService.Webbstyrning_Kö_Save(viewModel.ServiceId, viewModel.StyrningsId, viewModel.AlternativId.Value, viewModel.BegärtDatum, CookieHelper.GetUserDisplayName(), viewModel.Inkopplingstyp);

            return RedirectToAction("Abonnemang", new
            {
                serviceId = viewModel.ServiceId,
                abonnemang = viewModel.Abonnemang
            });
        }

        [Authorize(Roles = RoleHelper.WebbstyrningWrite)]
		public virtual ActionResult Kö_Delete(string id, string id2, string id3, string id4, string id5)
        {
            decimal serviceId = Convert.ToDecimal(id);
            decimal styrningsId = Convert.ToDecimal(id2);
            decimal alternativId = Convert.ToDecimal(id3);
            string abonnemang = id4;
            DateTime begärtDatum = Convert.ToDateTime(id5);

            // Session
            if (!(_webbstyrningHelper.CheckIfServiceIdExists(serviceId)))
            {
                return RedirectToAction("CustomError403", "CustomErrors");
            }

            List<string> errorMessages = new List<string>();

            // Om begärtDatum < DateTime.Now meddelande
            // Bekräfta borttagning
            if (begärtDatum > DateTime.Now)
            {
                DateTime? emptyDate = null;
                _staffService.Webstyrning_Kö_Delete(serviceId, styrningsId, alternativId, CookieHelper.GetUserDisplayName());
            }
            else
            {
                errorMessages.Add(string.Format("Du kan inte ta bort en styrning som har ett datum som är tidigare än {0}.", DateTime.Now));
            }

            var routeValues = GeneralHelper.GetRouteList(errorMessages, "errorMessages");
            routeValues.Add("serviceId", serviceId);
            routeValues.Add("abonnemang", abonnemang);

            return RedirectToAction("Abonnemang", routeValues);
        }
        #endregion

        #region Alterantiv
        [Authorize(Roles = RoleHelper.Webbstyrning)]
		public virtual ActionResult Alternativ_View(
            decimal connectLinkId,
            int lopnummer,
            string alternativnummer,
            string namn,
            string index,
            string status,
            string abonnemang,
            decimal serviceId)
        {
            var viewModel = new StyrningsalternativViewModel
            {
                abonnemang = abonnemang,
                serviceId = serviceId,
                connectLinkId = connectLinkId,
                lopnummer = lopnummer,
                alternativnummer = alternativnummer,
                namn = namn,
                index = index,
                status = status
            };

            var staffTree = _staffService.Webstyrning_Alternativ_GetTree(connectLinkId, true);
            viewModel.tree = Mapper.Map<ImmutableList<StaffRedirectRow>, List<SAGeografiskDistribution>>(staffTree);

            return View(viewModel);
        }

        [HttpGet]
        [Authorize(Roles = RoleHelper.Administratör)]
		public virtual ActionResult Alternativ_Edit(
            decimal connectLinkId,
            int lopnummer,
            string alternativnummer,
            string namn,
            string index,
            string status,
            string abonnemang,
            decimal serviceId)
        {
            var viewModel = new StyrningsalternativEditViewModel
            {
                abonnemang = abonnemang,
                serviceId = serviceId,
                connectLinkId = connectLinkId,
                lopnummer = lopnummer,
                alternativnummer = alternativnummer,
                namn = namn,
                index = index,
                status = status
            };

            var styrningsalternativForCopy = _staffService.Webbstyrning_Alternativ_GetAll(_cookieHelper.GetCustomerId());
            viewModel.styrningsalternativForCopy = new SelectList(styrningsalternativForCopy, "Id", "DisplayValue");

            return View(viewModel);
        }

        [HttpGet]
        [Authorize(Roles = RoleHelper.Administratör)]
		public virtual JsonResult Alternativ_Data(decimal? connectLinkId, bool original)
        {

            // Ursprungsdata kommer med direkt från listan över styrningsalterantiv
            // StaffSelectAlternatives styrningsalternativ = staffService.Webbstyrning_Alternativ_Get(connectLinkId);

            StyrningsalternativViewModel styrningsalternativViewModel = new StyrningsalternativViewModel();
            if (connectLinkId == null)
            {
                styrningsalternativViewModel.tree = new List<SAGeografiskDistribution>();
            }
            else
            {
                ImmutableList<StaffRedirectRow> tree = _staffService.Webstyrning_Alternativ_GetTree(connectLinkId.Value, original);
                styrningsalternativViewModel.tree = Mapper.Map<ImmutableList<StaffRedirectRow>, List<SAGeografiskDistribution>>(tree);
            }


            return Json(styrningsalternativViewModel, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authorize(Roles = RoleHelper.Administratör)]
		public virtual JsonResult Alternativ_Data(StyrningsalternativViewModel styrningsalternativ)
        {
			try
			{
				// Session
				if (!(_webbstyrningHelper.CheckIfServiceIdExists(styrningsalternativ.serviceId)))
				{
					//decimal serviceId, decimal customerId, string abonnemang
					string errorRedirect = Url.Action("CustomError403", "CustomErrors");
					return Json(new
					{
						path = errorRedirect
					});
				}

                _staffService.BeginTransaction();

                int? löpnummer = styrningsalternativ.lopnummer;
                if (löpnummer == null)
                {
                    löpnummer = _webbstyrningHelper.getNextLöpnummer(styrningsalternativ.serviceId);
                }

                decimal connectLinkId = _staffService.Webbstyrning_Alternativ_SaveDetails(styrningsalternativ.connectLinkId, styrningsalternativ.serviceId,
                    styrningsalternativ.namn, styrningsalternativ.alternativnummer, styrningsalternativ.index,
                    löpnummer, CookieHelper.GetOriginalUsername());

                _staffService.Webbstyrning_Alternativ_DeleteTree(connectLinkId);

                List<StaffRedirectRow> staffTree = Mapper.Map<List<SAGeografiskDistribution>, List<StaffRedirectRow>>(styrningsalternativ.tree);
                foreach (StaffRedirectRow staffRedirectRow in staffTree)
                {
                    _staffService.Webbstyrning_Alternativ_SaveTreeRow(staffRedirectRow, connectLinkId);
                }

                _staffService.Commit();

                //decimal serviceId, decimal customerId, string abonnemang
                string redirectAction = Url.Action("Abonnemang", new
                {
                    serviceId = styrningsalternativ.serviceId,
                    abonnemang = styrningsalternativ.abonnemang
                });
                return Json(new
                {
                    path = redirectAction,
                    connectLinkId = connectLinkId
                });
            }
            catch (Exception e)
            {
				log.Error("Failed to save styrningsalternativ", e);
                _staffService.Rollback();
                throw e;
            }
        }

        [HttpGet]
        [Authorize(Roles = RoleHelper.Administratör)]
		public virtual ActionResult Alternativ_Create(decimal serviceId, string abonnemang)
        {
            // Session
            if (!(_webbstyrningHelper.CheckIfServiceIdExists(serviceId)))
            {
                return RedirectToAction("CustomError403", "CustomErrors");
            }

            var styrningsalternativEditViewModel = new StyrningsalternativEditViewModel
            {
                abonnemang = abonnemang,
                serviceId = serviceId
            };

            var styrningsalternativForCopy = _staffService.Webbstyrning_Alternativ_GetAll(_cookieHelper.GetCustomerId());
            styrningsalternativEditViewModel.styrningsalternativForCopy = new SelectList(styrningsalternativForCopy, "Id", "DisplayValue");

            return View(styrningsalternativEditViewModel);
        }

        [HttpPost]
        [Authorize(Roles = RoleHelper.Administratör)]
        public void Alternativ_Confirm(decimal connectLinkId)
        {
            _staffService.Webbstyrning_Alternativ_Confirm(connectLinkId);
        }

        [HttpGet]
        [Authorize(Roles = RoleHelper.Administratör)]
		public virtual ActionResult Alternativ_Delete(int id, string id2, string id3, string id4)
        {
            // Session
            if (!(_webbstyrningHelper.CheckIfServiceIdExists(Convert.ToDecimal(id3))))
            {
                return RedirectToAction("CustomError403", "CustomErrors");
            }

            List<string> errorMessages = new List<string>();

            string styrningsStatus = id2;
            const string status = "Aktiv";
            if (styrningsStatus != status)
            {
                _staffService.Webstyrning_Alternativ_Delete(Convert.ToDecimal(id));
            }
            else
            {
                errorMessages.Add("Du kan inte ta bort en aktiv styrning.");
            }


            var routeValues = GeneralHelper.GetRouteList(errorMessages, "errorMessages");
            routeValues.Add("serviceId", id3);
            routeValues.Add("abonnemang", id4);

            return RedirectToAction("Abonnemang", routeValues);
        }
        #endregion

		#region Misc
        [Authorize(Roles = RoleHelper.Administratör)]
		public virtual ActionResult EjVerkställdaStyrningar()
        {
            WebbstyrningViewModel viewModel = new WebbstyrningViewModel();

            List<StaffEjVerkställdaStyrningar> ejVerkställdaLista = _staffService.Webstyrning_EjVerställda_GetList();
            viewModel.EjVerkställdaStyrningar = Mapper.Map<List<StaffEjVerkställdaStyrningar>, List<EjVerkställdaStyrningar>>(ejVerkställdaLista);

            CompanyInfo company = _securityService.GetCompanyForUser(User.Identity.Name);
            viewModel.Bolagsnyckel = company.PhoneKey;

            return View(viewModel);
        }
        #endregion

	    public ActionResult FlexibeltSvarsställe()
	    {
	        var model = new FlexibeltSvarsställeEditViewModel();
	        model.AktivtSvarsställe = "08-6473820";
	        model.NyttSvarsställe = "08-123456";
            model.DatumFörNyttSvarsställe = new DateTime(2015, 10, 12, 12, 30, 00);
	        return View(model);
	    }

	    public ActionResult VisaAbonnemang()
	    {
	        return View(new FlexibeltSvarsställeEditViewModel());
	    }

//        #region Excelexport
//        public void ExporteraTillExcel(decimal serviceId)
//        {
//            using (ExcelPackage pck = new ExcelPackage())
//            {
//                ExcelWorksheet ws = pck.Workbook.Worksheets.Add("Telia Excel-export");
//                ws.Name = "Rapport"; //Setting Sheet's name
//                ws.Cells.Style.Font.Size = 11; //Default font size for whole sheet
//                ws.Cells.Style.Font.Name = "Calibri"; //Default Font name for whole sheet
//                ws.View.ShowGridLines = false;
//
//                ExcelBild_Add(ws, 0, 0, Server.MapPath("~/Media/logo2x.png"));
//
//                ws.Cells["A1"].Value = string.Format("Inloggad som {0}", CookieHelper.GetOrgUsername(Request.Cookies[FormsAuthentication.FormsCookieName]));
//                ws.Cells["A1"].Style.Font.Bold = true;
//                ws.Cells["A1"].Style.Font.Size = 14; //Default font size for whole sheet
//                //ws.Cells[(rowNumber + 3), 1, (rowNumber + 3), 2].Merge = true; //Merge columns start and end range
//                ws.Cells[1, 1, 1, 2].Merge = true;
//
//                var fill = ws.Cells["A2:C2"].Style.Fill;
//                fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
//                fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
//
//                ExcelData_Add(serviceId, ws);
//
//                ws.Column(1).Width = 20;
//                ws.Row(1).Height = 60;
//                ws.Column(2).AutoFit();
//                ws.Column(3).AutoFit();
//
//                ExporteraExcelFil(pck);
//            }
//        }
//
//        private void ExcelData_Add(decimal serviceId, ExcelWorksheet ws)
//        {
//            ws.Cells["A2"].Value = "Begärt datum";
//            ws.Cells["B2"].Value = "Benämning";
//            ws.Cells["C2"].Value = "Verkställt datum";
//            ws.Cells["A2:C2"].Style.Font.Bold = true;
//
//            int rowNumber = 2;
//
//            List<StaffStyrningsköRow> staffStyrningskö = staffService.Webstyrning_Kö_GetList(serviceId);
//            List<StyrningsköRow> styrningsKö = Mapper.Map<List<StaffStyrningsköRow>, List<StyrningsköRow>>(staffStyrningskö);
//
//            //Färglägg varannan rad
//            foreach (var styrning in styrningsKö)
//            {
//                rowNumber++;
//
//                if (rowNumber % 2 != 0)
//                {
//                    var fillOdds = ws.Cells["A" + rowNumber + ":" + "C" + rowNumber].Style.Fill;
//                    fillOdds.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
//                    fillOdds.BackgroundColor.SetColor(System.Drawing.Color.MediumPurple);
//                }
//
//                var begartDatum = Convert.ToDateTime(styrning.BegärtDatum);
//                var verkstalltDatum = Convert.ToDateTime(styrning.VerkställtDatum);
//
//                if (styrning.BegärtDatum != null)
//                {
//                    ws.Cells["A" + rowNumber].Value = begartDatum.ToString("yyyy-MM-dd HH:mm");
//                    ws.Cells["B" + rowNumber].Value = styrning.Benämning;
//                }
//                if (styrning.VerkställtDatum != null)
//                {
//                    ws.Cells["C" + rowNumber].Value = verkstalltDatum.ToString("yyyy-MM-dd HH:mm");
//                }
//            }
//
//            ws.Cells["A" + (rowNumber + 3)].Value = string.Format("Copyright © {0} TeliaSonera Sverige AB", DateTime.Now.Year);
//            ws.Cells["A2" + (rowNumber + 3)].Style.Font.Size = 14;
//            ws.Cells["A2" + (rowNumber + 3)].Style.Font.Bold = true;
//            ws.Cells[(rowNumber + 3), 1, (rowNumber + 3), 2].Merge = true; //Merge columns start and end range
//        }
//
//        private void ExcelBild_Add(ExcelWorksheet ws, int columnIndex, int rowIndex, string filePath)
//        {
//            //How to Add a Image using EP Plus
//            System.Drawing.Bitmap image = new System.Drawing.Bitmap(filePath);
//
//
//            OfficeOpenXml.Drawing.ExcelPicture picture = null;
//            if (image != null)
//            {
//                picture = ws.Drawings.AddPicture("pic" + rowIndex.ToString() + columnIndex.ToString(), image);
//                picture.From.Column = columnIndex;
//                picture.From.Row = rowIndex;
//                picture.SetSize(33);
//                //picture.SetSize(118, 11);
//                picture.SetPosition(3, 20);
//            }
//        }
//
//        private void ExporteraExcelFil(ExcelPackage pck)
//        {
//            var filename = "TeliaExport" + DateTime.Now.ToString("yyyy-MM-dd") + ".xlsx";
//            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
//            Response.AddHeader("content-disposition", "attachment;  filename=" + filename);
//            Response.BinaryWrite(pck.GetAsByteArray());
//        }
//        #endregion
    }
}