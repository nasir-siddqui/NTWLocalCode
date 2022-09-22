using System.Collections.Generic;
using System.Collections.Immutable;
using Sigma.Utils.ActionResults;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Entities.Admin;
using Telia.NTW.Core.Helpers;
using Telia.NTW.Core.Services;
using Telia.NTW.Web.Helpers;
using Telia.NTW.Web.ViewModel.Admin;
using System.Web.Mvc;
using AutoMapper;
using Telia.NTW.Web.ViewModel.Admin.Hantera;
using System.Linq;
using System;
using System.Net.Mail;
using Telia.NTW.Web.Enums;
using System.Net;
using Telia.NTW.Core.Enums;
using Telia.NTW.Web.ViewModel.Admin.Inloggningsstatistik;
using Telia.NTW.Web.ViewModel.Admin.Loggar;
using Telia.NTW.Web.ViewModel.Admin.Meddelanden;

namespace Telia.NTW.Web.Controllers
{
	[Authorize (Roles=RoleHelper.Administratör)]
	[HandleError(ExceptionType = typeof(HttpAntiForgeryException), View = "InvalidAntiForgeryToken")]
	public partial class AdminController : BaseController
	{
		private readonly MeddelandeService meddelandeService;

		private readonly AnvändareService användarService;
		private readonly RoleHelper roleHelper;
		private readonly AdminHelper adminHelper;
        private readonly LoggService loggservice;
		private readonly CookieHelper cookieHelper;

        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(typeof(AdminController));
                
		public AdminController(MeddelandeService meddelandeService,
            AnvändareService användarService, RoleHelper roleHelper, AdminHelper adminHelper, LoggService loggservice, CookieHelper cookieHelper)
		{
			this.meddelandeService = meddelandeService;
			this.användarService = användarService;
			this.roleHelper = roleHelper;
			this.adminHelper = adminHelper;
            this.loggservice = loggservice;
			this.cookieHelper = cookieHelper;
		}

		protected new JsonResult Json(object data, JsonRequestBehavior behavior)
		{
			return new JsonNetResult
			{
				Data = data,
				JsonRequestBehavior = behavior
			};
		}

		protected new JsonResult Json(object data)
		{
			return new JsonNetResult
			{
				Data = data
			};
		}

		public virtual ActionResult InvalidAntiForgeryToken()
		{
			return RedirectToAction("CustomError403", "CustomErrors");
		}

		[HttpGet]
		public virtual ActionResult Hantera(List<string> errorMessages)
		{
			HanteraViewModel viewModel = new HanteraViewModel();
			viewModel.addErrorMessages(errorMessages);
			viewModel.HideResult = true;

			return View(viewModel);
		}

		[HttpPost]
		public virtual ActionResult Hantera(string search, List<string> errorMessages)
		{
			var viewModel = adminHelper.GetHanteraViewModel(search, errorMessages);
			return View(viewModel);
		}

		[HttpGet]
		public virtual ExcelActionResult Hantera_ExportToExcel(string search)
		{
			var data = adminHelper.GetHanteraViewModel(search);

//			var sheets = new OrderedDictionary<string, IList>
//			{
//				{"Användare", data.Användare},
//				{"Bolag", data.Bolag},
//				{"Koncerner", data.Koncerner}
//			};

			return new ExcelActionResult(data, "Användare, bolag och koncerner.xlsx");
		}

		#region Användare
        [HttpGet]
		public virtual ActionResult Hantera_Användare_Create()
        {
            log.Info("Hantera_Användare_Create");

            RedigeraAnvändareViewModel viewModel = new RedigeraAnvändareViewModel();

            viewModel.ExistingUser = false;

            log.Info("viewModel.ExistingUser = false");

            ImmutableList<CompanyInfo> bolagList = användarService.Bolag_GetList();
            viewModel.BolagSelectList = Mapper.Map<ImmutableList<CompanyInfo>, SelectList>(bolagList);

            log.Info("listor fixade");

            return (View(viewModel));
        }

        [HttpPost]
		[ValidateAntiForgeryToken]
		public virtual ActionResult Hantera_Användare_Create(RedigeraAnvändareViewModel viewModel)
        {
            if (!ModelState.IsValid)
            {
                ImmutableList<CompanyInfo> bolagList = användarService.Bolag_GetList();
                viewModel.BolagSelectList = Mapper.Map<ImmutableList<CompanyInfo>, SelectList>(bolagList);

                return (View(viewModel));
            }

            var model = Mapper.Map<RedigeraAnvändareViewModel, AdministreraAnvändare>(viewModel);

            if (användarService.CheckIfUserExists(model.AnvändarID)) // Användaren finns redan
            {
                ImmutableList<CompanyInfo> bolagList = användarService.Bolag_GetList();
                viewModel.BolagSelectList = Mapper.Map<ImmutableList<CompanyInfo>, SelectList>(bolagList);
				viewModel.addErrorMessage(RedigeraAnvändareViewModel.AnvändareAlreadyExistsErrorMsg);

                return (View(viewModel));
            }

            användarService.Användare_Create(model, CookieHelper.GetOriginalUsername());

            if (viewModel.Mailmottagare)
                SendConfermationMail(viewModel.Email);

            return RedirectToAction("Hantera");
        }

		[HttpGet]
		public virtual ActionResult Hantera_Användare_Edit(int userId)
		{
			RedigeraAnvändareViewModel viewModel = new RedigeraAnvändareViewModel();

            viewModel.ExistingUser = true;

            User user = användarService.GetAnvändare(userId);

			viewModel.AnvändarID = user.LoginName;
			viewModel.Bolagsnamn = user.Company.CompanyName;
			viewModel.Email = user.Email;
			//viewModel.Lösenord = user.Password;
			viewModel.Namn = user.Name;
			viewModel.Notering = user.Note;
            viewModel.CompanyId = user.Company.CompanyId;
            viewModel.UserCompanyId = user.Company.CompanyId;
            viewModel.SenastInloggad = user.LogonDate;
			viewModel.SenastÄndrad = user.ChangedDate;
			viewModel.Skapad = user.CreationDate;
			viewModel.Telefon = user.TelNo;
            viewModel.OrgNr = user.Company.OrgNr;
            viewModel.UserID = user.UserID;

            try
            {
                viewModel.Användartyper = (Användartyper)Enum.Parse(typeof(Användartyper), user.Roles.Single(m => m.Name == "Kund" || m.Name == "Administratör" || m.Name == "Säljare").Name);
            }
            catch (Exception)
            { 
            }

            viewModel.AnalysActive = user.Roles.Contains(roleHelper.AnalysRole);
            viewModel.WebbstyrningLäsActive = user.Roles.Contains(roleHelper.WebbstyrningRole);
            viewModel.WebbstyrningSkrivActive = user.Roles.Contains(roleHelper.WebbstyrningWriteRole);
            viewModel.WebbstyrningMultistyrning = user.Roles.Contains(roleHelper.WebbstyrningMultistyrningRole);
            viewModel.LeverantörsinformationActive = user.Roles.Contains(roleHelper.LeverantörsinformationRole);

            ImmutableList<CompanyInfo> bolagList = användarService.Bolag_GetList();
            viewModel.BolagSelectList = Mapper.Map<ImmutableList<CompanyInfo>, SelectList>(bolagList);

            if (user.Company.OrgNr == "999999-9999")
            {
                viewModel.AdminOrSalesOrg = true;
            }
            else
            {
                viewModel.AdminOrSalesOrg = false;
            }

			return View(viewModel);
		}

		[HttpPost]
		[ValidateAntiForgeryToken]
		public virtual ActionResult Hantera_Användare_Edit(RedigeraAnvändareViewModel viewModel)
		{
            if (!ModelState.IsValid)
            {
                ImmutableList<CompanyInfo> bolagList = användarService.Bolag_GetList();
                viewModel.BolagSelectList = Mapper.Map<ImmutableList<CompanyInfo>, SelectList>(bolagList);

                return (View(viewModel));
            }

            var model = Mapper.Map<RedigeraAnvändareViewModel, AdministreraAnvändare>(viewModel);

            användarService.Användare_Edit(model, CookieHelper.GetOriginalUsername());

            // TODO: Kolla om nedanstående funkar
            //if (viewModel.Mailmottagare)
            //    SendConfermationMail(viewModel.Email);

            return RedirectToAction("Hantera");
		}

		public virtual ActionResult Hantera_User_Delete(int id)
        {
            DeleteAnvändareResult koppling = användarService.Användare_Delete(id, CookieHelper.GetOriginalUsername());

            List<string> errorMessages = new List<string>();
            switch (koppling)
            {
                case DeleteAnvändareResult.AnalysContact:
                    errorMessages.Add("Användaren kunde inte tas bort p.g.a denne är kontaktperson för analys. Du måste ta bort kopplingen innan du kan ta bort användaren.");
                    break;
                case DeleteAnvändareResult.LevInfoContact:
                    errorMessages.Add("Användaren kunde inte tas bort p.g.a denne är kontaktperson för leverantörsinformation. Du måste ta bort kopplingen innan du kan ta bort användaren.");
                    break;
                case DeleteAnvändareResult.WebstyrningContact:
                    errorMessages.Add("Användaren kunde inte tas bort p.g.a denne är kontaktperson för webbstyrning. Du måste ta bort kopplingen innan du kan ta bort användaren.");
                    break;
                case DeleteAnvändareResult.Error:
                    errorMessages.Add("Misslyckades med att ta bort användaren, var god försök igen.");
                    break;
            }

            return RedirectToAction("Hantera", GeneralHelper.GetRouteList(errorMessages, "errorMessages"));

        }

        private void SendConfermationMail(string emailTo)
        {
            // TODO : Fixa telias uppgifter
            const string username = "";
            const string password = "";
            const string smptserver = "";
            const string from = "";
            const string recipient = "";
            string body = string.Format("Hej och välkommen till Telia Nummertjänster webb!\nNu är din behörighet till någon av våra webbtjänster, Telia Analys, Telia Direktstyrning och Leverantörsinfo, klar att använda.\nGäller även vid ändring och borttag av någon av tjänsterna.\nTjänsterna når Du via www.telia.se.\nEfter inloggning till Mina Sidor På Arbetet väljer Du Service och Support/Nummertjänster och därefter länken Till Nummertjänster.\n\n Är Du osäker på hur tjänsten fungerar finns hjälp i applikationen som du hittar om du klickar på knappen med frågetecken på i respektive sidas övre, högra hörn.\n\n Vid frågor eller vid behov av supporthjälp går det bra att skicka e-post till vår supportgrupp genom att klicka på kuvertet i applikationens övre högre hörn.\n\n\n Med vänlig hälsning\nSupport Nummertjänster\nTeliaSonera Sverige AB \n*OBS! Detta mail är genererat automatiskt*");
            SmtpClient client = new SmtpClient();
            NetworkCredential credentials = new NetworkCredential(username, password, smptserver);
            
            MailMessage message = new MailMessage();
            MailAddress fromAddress = new MailAddress(from);

            // setup up the host, increase the timeout to 5 minutes
            client.Host = smptserver;
            client.UseDefaultCredentials = false;
            client.Credentials = credentials;
            client.Timeout = (60 * 5 * 1000);

            message.From = fromAddress;
            message.Subject = "Telia Nummertjänster Support"; // TODO: Kolla upp vilken subject vi ska använda
            message.IsBodyHtml = true;
            message.Body = body.Replace("\n", "<br>");
            message.To.Add(recipient);

            try
            {
                client.Send(message);
            }
            catch (Exception ex)
            {
                //Error
                //Console.WriteLine(ex.Message);
                Response.Write(ex.Message);
            }
        }

        [HttpPost]
		public virtual ActionResult Get_OrgNr(string orgNrId)
        {
            var bolag = användarService.Bolag_GetList().Single(m => m.CompanyId == Convert.ToInt32(orgNrId));

            return Json(new { orgNamn = bolag.CompanyName, orgNr = bolag.OrgNr, companyId = bolag.CompanyId });
        }
		#endregion

		#region Bolag

		[HttpGet]
		public virtual ActionResult Hantera_Bolag_Create()
		{
            BolagEditViewModel bolagEditViewModel = new BolagEditViewModel();
			adminHelper.BolagInitDropdowns(bolagEditViewModel);

            bolagEditViewModel.OrgNrExists = false;
            bolagEditViewModel.EditMode = false;

			return View(bolagEditViewModel);
		}

		[HttpPost]
		[ValidateAntiForgeryToken]
		public virtual ActionResult Hantera_Bolag_Create(BolagEditViewModel bolagEditViewModel)
		{
			CompanyInfo bolag = Mapper.Map<BolagEditViewModel, CompanyInfo>(bolagEditViewModel);

			bolag.Roles = adminHelper.BolagGetRolesFromViewModel(bolagEditViewModel);
            bolagEditViewModel.EditMode = false;

            if (!användarService.Bolag_GetList().Any(m => m.OrgNr == bolagEditViewModel.OrgNr))
            {
                // Detta org nr finns inte > Skapa nytt
                användarService.Bolag_Create(bolag, CookieHelper.GetOriginalUsername());

                bolagEditViewModel.OrgNrExists = true;
            }
            else
            {
                // Detta org nr finns redan
                adminHelper.BolagInitDropdowns(bolagEditViewModel);
				bolagEditViewModel.addErrorMessage(BolagEditViewModel.BolagAlreadyExistsErrorMsg);

                bolagEditViewModel.OrgNrExists = false;

                return View(bolagEditViewModel);

            }
			
			return RedirectToAction("Hantera");
		}

		[HttpGet]
		public virtual ActionResult Hantera_Bolag_Edit(int companyId)
		{
			CompanyInfo bolag = användarService.Bolag_Get(companyId);

			BolagEditViewModel bolagEditViewModel = Mapper.Map<CompanyInfo, BolagEditViewModel>(bolag);
			adminHelper.BolagAddRolesToViewModel(bolagEditViewModel, bolag);

			adminHelper.BolagInitDropdowns(bolagEditViewModel);

            bolagEditViewModel.OrgNrExists = true;
            bolagEditViewModel.EditMode = true;

			return View(bolagEditViewModel);
		}

		[HttpPost]
		[ValidateAntiForgeryToken]
		public virtual ActionResult Hantera_Bolag_Edit(BolagEditViewModel bolagEditViewModel)
		{
			CompanyInfo bolag = Mapper.Map<BolagEditViewModel, CompanyInfo>(bolagEditViewModel);

			bolag.Roles = adminHelper.BolagGetRolesFromViewModel(bolagEditViewModel);
            bolagEditViewModel.EditMode = true;

			användarService.Bolag_Edit(bolag, CookieHelper.GetOriginalUsername());
			return RedirectToAction("Hantera");
		}

		[HttpGet]
		public virtual JsonResult Hantera_Bolag_Contact(int? userId)
		{
			if (userId == null)
			{
				return Json(new Contact(), JsonRequestBehavior.AllowGet);
			}
			else
			{
				User contact = användarService.GetAnvändare(userId.Value);
				return Json(Mapper.Map<User, Contact>(contact), JsonRequestBehavior.AllowGet);
			}
		}

		[HttpGet]
		public virtual ActionResult Hantera_Bolag_Nummer_Edit(int advanceExtId, int companyId, string bolagsnamn)
		{
			var viewModel = new NummerEditViewModel
			{
				AdvanceExtId = advanceExtId,
				CompanyId = companyId,
				Bolagsnamn = bolagsnamn
			};

			return View(viewModel);
		}

		[HttpGet]
		public virtual JsonResult Hantera_Bolag_Nummer_Edit_Data(int advanceExtId)
		{
			var bolagNummerGetResult = användarService.Bolag_Nummer_Get(advanceExtId);
			NummerEditModel nummerEditModel = Mapper.Map<BolagNummer, NummerEditModel>(bolagNummerGetResult);

			var viewLevels = new List<KeyValuePair<int, string>>();
			viewLevels.Add(new KeyValuePair<int, string>(NummerHelper.TimeDataOnly, "Bara tidsdata"));
			viewLevels.Add(new KeyValuePair<int, string>(NummerHelper.TimeAndGeoData, "Tidsdata och geografisk data"));
			nummerEditModel.viewLevels = viewLevels;

			return Json(nummerEditModel, JsonRequestBehavior.AllowGet);
		}

		[HttpPost]
		public virtual JsonResult Hantera_Bolag_Nummer_Edit_Data(NummerEditModel nummerEditModel)
		{
			BolagNummer bolagNummer = Mapper.Map<NummerEditModel, BolagNummer>(nummerEditModel);
			användarService.Bolag_Nummer_Edit(bolagNummer, CookieHelper.GetOriginalUsername());

			string redirectAction = Url.Action("Hantera_Bolag_Edit", new {nummerEditModel.companyId});
			return Json(new { path = redirectAction });
		}

		[HttpGet]
		public virtual ActionResult Hantera_Bolag_Nummer_Add(int companyId, string bolagsnamn)
		{
			var viewModel = new BolagNummerAddViewModel
			{
				CompanyId = companyId,
				Bolagsnamn = bolagsnamn
			};

			return View(viewModel);
		}

		[HttpPost]
		[ValidateAntiForgeryToken]
		public virtual ActionResult Hantera_Bolag_Nummer_Add(BolagNummerAddViewModel viewModel)
		{
            if(viewModel.Nummer.Contains("-"))
            {
                viewModel.Nummer = viewModel.Nummer.Replace("-", "");
            }
            // Kolla om numret existerar
            if (användarService.Bolag_Nummer_ExistsOnAnyCompany(viewModel.Nummer))
            {
                // Flytta ett existerande nummer
                if (viewModel.AcceptMoveNumber)
                {
                    användarService.Bolag_Nummer_Change(viewModel.Nummer, viewModel.CompanyId, CookieHelper.GetOriginalUsername());
                }
                else
                {
                    viewModel.AcceptMoveNumber = true;
                    viewModel.ExistsOnCurrentCompany = användarService.Bolag_Nummer_ExistingCompany(viewModel.Nummer);
                    viewModel.NumberExists = true;
                    return View(viewModel);
                }
               
            }
            else
            {
                // Numret är inte tidigare knutet till ett bolag
                
            }

            int advanceExtId = användarService.Bolag_Nummer_Add(viewModel.Nummer, viewModel.CompanyId, CookieHelper.GetOriginalUsername());
			return RedirectToAction("Hantera_Bolag_Nummer_Edit", new {advanceExtId, companyId = viewModel.CompanyId, bolagsnamn = viewModel.Bolagsnamn});
		}

		[HttpGet]
		public virtual ActionResult Hantera_Bolag_Nummer_Delete(int id, int id2)
		{
			användarService.Bolag_Nummer_Delete(id, CookieHelper.GetOriginalUsername());
			return RedirectToAction("Hantera_Bolag_Edit", new {companyId = id2});
		}

        [HttpGet]
		public virtual ActionResult Hantera_Bolag_Delete(int id)
		{
			bool success = användarService.Bolag_Delete(id, CookieHelper.GetOriginalUsername());

			List<string> errorMessages = new List<string>();
			if (!success)
			{
				errorMessages.Add("Bolag togs inte bort p.g.a. att det finns användare anslutna till bolaget. Ta först bort användarna om du vill ta bort bolaget.");
			}

			return RedirectToAction("Hantera", GeneralHelper.GetRouteList(errorMessages, "errorMessages"));
		}

        [HttpGet]
		public virtual ActionResult Hantera_Bolag_Inloggning()
		{
            HanteraViewModel viewModel = new HanteraViewModel();
			viewModel.HideResult = true;

            return View(viewModel);
		}

		[HttpPost]
		public virtual ActionResult Hantera_Bolag_Inloggning(string search)
		{
			HanteraViewModel viewModel = new HanteraViewModel();
			viewModel.HideResult = false;
			viewModel.Search = search;

			ImmutableList<CompanyInfo> bolagList = användarService.Bolag_GetList(search);
			viewModel.Bolag = Mapper.Map<ImmutableList<CompanyInfo>, List<BolagListRow>>(bolagList);

			return View(viewModel);
		}

		public virtual ActionResult Hantera_Bolag_LoggaIn(int companyId)
        {
			cookieHelper.LoginCompany(companyId);

            return RedirectToAction("Index", "Home");
        }
		#endregion

		#region Koncern
        [HttpGet]
		public virtual ActionResult Hantera_Koncern_Create()
        {
            Koncern viewModel = new Koncern();

            return View(viewModel);
        }

        [HttpPost]
		[ValidateAntiForgeryToken]
		public virtual ActionResult Hantera_Koncern_Create(Koncern viewModel)
        {
            if (!ModelState.IsValid)
            {
                return (View(viewModel));
            }

            var model = Mapper.Map<Koncern, GroupInfo>(viewModel);

            if (användarService.CheckIfGroupExists(model.GroupName)) // Koncernen finns redan
            {
                viewModel.addErrorMessage(Koncern.KoncernAlreadyExistsErrorMsg);
                return (View(viewModel));
            }

            användarService.Koncern_Create(model, CookieHelper.GetOriginalUsername());

            return RedirectToAction("Hantera");
        }

        [HttpGet]
		public virtual ActionResult Hantera_Koncern_Edit(int groupId)
        {
            Koncern viewModel = new Koncern();

            var koncern = användarService.Koncern_Get(groupId);

            viewModel.Koncernnamn = koncern.GroupName;
            viewModel.GroupId = koncern.GroupId;
            viewModel.KoncernId = koncern.GroupCode;

            return View(viewModel);
        }

        [HttpPost]
		[ValidateAntiForgeryToken]
		public virtual ActionResult Hantera_Koncern_Edit(Koncern viewModel)
        {
            var model = Mapper.Map<Koncern, GroupInfo>(viewModel);
            användarService.Koncern_Edit(model, CookieHelper.GetOriginalUsername());

            return RedirectToAction("Hantera");
        }

		public virtual ActionResult Hantera_Koncern_Delete(int id)
        {
            användarService.Koncern_Delete(id, CookieHelper.GetOriginalUsername());

            return RedirectToAction("Hantera");

        }
		#endregion

		#region Meddelande
		[Authorize(Roles="Administratör")]
		public virtual ActionResult Meddelande()
		{
			var viewModel = Mapper.Map<MeddelandeContainer, MeddelandenViewModel>(meddelandeService.GetAll());
			return View(viewModel);
		}

        [HttpGet]
		public virtual ActionResult SkapaMeddelande()
		{
			return View(new MeddelandeViewModel());
		}

        [HttpPost]
		[ValidateAntiForgeryToken]
		public virtual ActionResult SkapaMeddelande(MeddelandeViewModel viewModel)
        {
            #region validering
            if (viewModel.From.Second > 0)
            {
                ModelState.AddModelError("FrånDatumValidation2", "Felaktigt format");
            }
            if (viewModel.To.Second > 0)
            {
                ModelState.AddModelError("TillDatumValidation2", "Felaktigt format");
            }
            if (viewModel.From < DateTime.Now.AddMinutes(-1))
            {
                ModelState.AddModelError("FrånDatumValidation1", "Välj ett senare datum än dagens datum och tid");
            }
            if (viewModel.To < DateTime.Now.AddMinutes(-1))
            {
                ModelState.AddModelError("TillDatumValidation1", "Välj ett senare datum än dagens datum och tid");
            }
            #endregion

            if (!ModelState.IsValid)
			{
				return View(viewModel);
			}

			var model = Mapper.Map<Meddelandes>(viewModel);
			meddelandeService.CreateMessage(model);
			return RedirectToAction("Meddelande");
		}

        [HttpGet]
		public virtual ActionResult RedigeraMeddelande(int id)
		{
			var viewModel = Mapper.Map<MeddelandeViewModel>(meddelandeService.Get(id));
			return View(viewModel);
		}

        [HttpPost]
		[ValidateAntiForgeryToken]
		public virtual ActionResult RedigeraMeddelande(MeddelandeViewModel viewModel)
		{
            #region validering
            if (viewModel.From.Second > 0)
            {
                ModelState.AddModelError("FrånDatumValidation2", "Felaktigt format");
            }
            if (viewModel.To.Second > 0)
            {
                ModelState.AddModelError("TillDatumValidation2", "Felaktigt format");
            }
            if (viewModel.From < DateTime.Now.AddMinutes(-1))
            {
                ModelState.AddModelError("FrånDatumValidation1", "Välj ett senare datum än dagens datum och tid");
            }
            if (viewModel.To < DateTime.Now.AddMinutes(-1))
            {
                ModelState.AddModelError("TillDatumValidation1", "Välj ett senare datum än dagens datum och tid");
            }
            #endregion

			if (!ModelState.IsValid)
			{
				return View(viewModel);
			}

			var model = Mapper.Map<Meddelandes>(viewModel);
			meddelandeService.UpdateMeddelande(model);
			return RedirectToAction("Meddelande");
		}

		public virtual ActionResult TaBortMeddelande(int id)
		{
			meddelandeService.DeleteMeddelande(id);
			return RedirectToAction("Meddelande");
		}
		#endregion

		#region Misc
		public virtual ActionResult Användarstatistik()
		{
			InloggningsstatistikViewModel användarstatistikViewModel = new InloggningsstatistikViewModel();

			List<User> användareList = användarService.GetLastThirtyDaysUsers();
			List<InloggningsstatistikRow> användareStatistikList = Mapper.Map<List<User>, List<InloggningsstatistikRow>>(användareList);

			användarstatistikViewModel.SenasteTjugoMinList = new List<InloggningsstatistikRow>();
			användarstatistikViewModel.UnderDagenList = new List<InloggningsstatistikRow>();
			användarstatistikViewModel.SenasteMånadenList = new List<InloggningsstatistikRow>();

			//användare.Union(användareViewModel.SenasteTjugoMinList);
			//användare.Union(användareViewModel.UnderDagenList);
			//användare.Union(användareViewModel.SenasteMånadenList);

			foreach (InloggningsstatistikRow användareInfo in användareStatistikList)
			{
				TimeSpan ts = DateTime.Now - användareInfo.SenastInloggad.Value;

				// Senaste 20 min
				if (ts.Days < 1 && ts.Hours < 1 && ts.Minutes < 20)
				{
					användarstatistikViewModel.SenasteTjugoMinList.Add(användareInfo);
				}
				// Senaste 24h
				else if (ts.Days < 1)
				{
					användarstatistikViewModel.UnderDagenList.Add(användareInfo);
				}
				// Senaste 30 dagarna
				else if (ts.Days < 30)
				{
					användarstatistikViewModel.SenasteMånadenList.Add(användareInfo);
				}
			}

			användarstatistikViewModel.LiveSessionsCount = (int)HttpContext.ApplicationInstance.Application[MvcApplication.LiveSessionsCount];

			return View(användarstatistikViewModel);
		}

        [HttpGet]
		public virtual ActionResult Loggar()
        {
            LoggarViewModel viewModel = new LoggarViewModel();

            viewModel.LoadTables = false;

            viewModel.StartDate = DateTime.Now.AddDays(-7);
            viewModel.EndDate = DateTime.Now;

            return View(viewModel);
        }
        
        [HttpPost]
		public virtual ActionResult Loggar(LoggarViewModel viewModel)
        {
            DateTime start = viewModel.StartDate;
            DateTime end = viewModel.EndDate;

            #region validering av datepicker
            // Difference in days, hours, and minutes.
            TimeSpan ts = end - start;
            // Difference in days.
            if (ts.Days > 60)
            {
                end = start.AddMonths(2);
                viewModel.EndDate = end;
            }

            if (start > end)
            {
                ModelState.AddModelError("FrånDatumValidation1", "Startdatum måste vara mindre än slutdatumet");
            }
            if (end < start)
            {
                ModelState.AddModelError("TillDatumValidation1", "Slutdatum måste vara större än slutdatumet");
            }
            if (start.ToString() == "0001-01-01 00:00")
            {
                ModelState.AddModelError("FrånDatumValidation2", "Felaktigt format");
            }
            if (end.ToString() == "0001-01-01 00:00")
            {
                ModelState.AddModelError("TillDatumValidation2", "Felaktigt format");
            }
            #endregion

            viewModel.LoadTables = true;

            #region hämta data till tabellerna
            // Systemlogg
            var systemlogList = loggservice.GetSystemlogList(start, end);
            viewModel.SystemloggList =
                        Mapper.Map<List<SystemLog>, List<SystemloggRow>>(systemlogList);

            // Adminlogg
            var adminlogList = loggservice.GetAdminlogList(start, end);
            viewModel.AdminLoggList =
                        Mapper.Map<List<SupportLog>, List<AdminloggRow>>(adminlogList);
            
            // STAFFlogg
            var stafflogList = loggservice.GetSTAFFlogList(start, end);
            viewModel.StaffloggList =
                        Mapper.Map<List<STAFFlog>, List<StaffloggRow>>(stafflogList);

             // Servicelogg
            var serviceloggList = loggservice.GetServicelogList(start, end);
            viewModel.Servicelogg =
                        Mapper.Map<List<ServiceLog>, List<ServiceloggRow>>(serviceloggList);
            
            // Processlogg
            var processloggList = loggservice.GetProcessLogList(start, end);
            viewModel.Processlogs =
                        Mapper.Map<List<ProcessLog>, List<ProcessloggRow>>(processloggList);
            #endregion
            
            return View(viewModel);
        }
		#endregion
	}
}