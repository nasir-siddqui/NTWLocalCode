using AutoMapper;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Sigma.Utils.ActionResults;
using Telia.NTW.Core.Entities.Staff;
using Telia.NTW.Core.Helpers;
using Telia.NTW.Core.Services;
using Telia.NTW.Web.Attributes;
using Telia.NTW.Web.ViewModel.Leverantörsinformation;
using System.Linq;
using Telia.NTW.Core.Entities;
using log4net;
using Telia.NTW.Web.Helpers;
using System.Web.Routing;

namespace Telia.NTW.Web.Controllers
{
	[Authorize (Roles = RoleHelper.Leverantörsinformation + ", " + RoleHelper.Administratör)]
	public partial class LeverantörsinformationController : BaseController
    {
		private readonly LeverantörsinformationHelper leverantörsinformationHelper;
        private readonly StaffService staffService;
	    private readonly CookieHelper cookieHelper;

        private readonly NtwEfModel db;
        
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public LeverantörsinformationController(StaffService staffService, CookieHelper cookieHelper, NtwEfModel db, LeverantörsinformationHelper leverantörsinformationHelper)
        {
            this.staffService = staffService;
	        this.cookieHelper = cookieHelper;
            this.db = db;
            this.leverantörsinformationHelper = leverantörsinformationHelper;
        }

        #region 900Nummer
        [Authorize(Roles = RoleHelper.Leverantörsinformation)]
        public virtual ActionResult Telia900Nummer()
        {
            NioHundraNummerViewModel viewModel = new NioHundraNummerViewModel();
            var customerId = cookieHelper.GetCustomerId();

            if (customerId != -1)
            {
                try
                {
                    viewModel.NioHundraNummer = leverantörsinformationHelper.GetNioHundraNummerList();
                    //                    leverantörsinformationHelper.SetNioIDList(nioHundraLista);
                }
                catch (Exception)
                {
                    viewModel.NioHundraNummer = new List<NioHundraNummerRow>();
                }
            }

            return View(viewModel);
        }

        [HttpGet]
        [Authorize(Roles = RoleHelper.Leverantörsinformation)]
        [LevInfo900CheckAccess("nioId")]
        public virtual ActionResult NioHundraNummer_Edit(decimal nioId, string accessNo, List<string> errorMessages)
        {
            StaffNioHundraNrEdit nummer = staffService.NioHundraNummer_Get(nioId).Single();

            NioHundraNummerRow viewModel = Mapper.Map<StaffNioHundraNrEdit, NioHundraNummerRow>(nummer);

            viewModel.AccessId = nioId;
            viewModel.Nummer = accessNo;
            viewModel.Kundtjänstnummer = nummer.ContentProviderTfn;
            viewModel.addErrorMessages(errorMessages);

            return View(viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = RoleHelper.Leverantörsinformation)]
        [LevInfo900CheckAccess("AccessId")]
        public virtual ActionResult NioHundraNummer_Edit(NioHundraNummerRow viewModel)
        {
            // Bolaget finns inte
            if (staffService.Innehållsleverantörer_Get_List().SingleOrDefault(m => m.CompanyId == viewModel.Organisationsnummer) == null)
            {
                return View(viewModel);
            }

            List<string> errorMessages = new List<string>();

            if (viewModel.Kundtjänstnummer.StartsWith("0900") || viewModel.Kundtjänstnummer.StartsWith("0939") || viewModel.Kundtjänstnummer.StartsWith("0944"))
            {
                errorMessages.Add("Otillåtet kundtjänstnummer, ett kundtjänstnummer får inte börja med följande nummer: 0900, 0939 eller 0944.");

                var routeValues = new RouteValueDictionary();
                routeValues.Add("nioId", viewModel.AccessId);

                return RedirectToAction("NioHundraNummer_Edit", GeneralHelper.GetRouteList(errorMessages, "errorMessages", routeValues));
            }

            decimal contentProviderId = staffService.Innehållsleverantörer_Get_List().SingleOrDefault(m => m.CompanyId == viewModel.Organisationsnummer).ContentProviderId;
            staffService.NioHundraNummer_Edit(viewModel.AccessId, contentProviderId, viewModel.Tjänst, viewModel.Kundtjänstnummer, CookieHelper.GetOriginalUsername());
            return RedirectToAction("Telia900Nummer");
        }

        [HttpGet]
        [Authorize(Roles = RoleHelper.Leverantörsinformation)]
        public virtual ExcelActionResult NioHundraNummer_ExportToExcel()
        {
            var nioHundraList = leverantörsinformationHelper.GetNioHundraNummerList();
            return new ExcelActionResult(nioHundraList, "Telia 900 nummer");
        }

        #endregion

		#region Innehållsleverantör

        [Authorize(Roles = RoleHelper.Leverantörsinformation + ", " + RoleHelper.Administratör)]
        public virtual ActionResult Innehållsleverantörer()
        {
            var viewModel = new InnehållsleverantörViewModel();

            List<StaffInnehållslev> innehållslevLista = staffService.Innehållsleverantörer_Get_List();
            viewModel.Innehållsleverantörer = Mapper.Map<List<StaffInnehållslev>, List<InnehållsleverantörRow>>(innehållslevLista);


            return View(viewModel);
        }

        [HttpGet]
		[Authorize(Roles = RoleHelper.Leverantörsinformation + ", " + RoleHelper.Administratör)]
		public virtual ActionResult Innehållsleverantör_Edit(string orgNr, decimal id, List<string> errorMessages)
        {
            StaffInnehållslevEditCreate leveratör = staffService.Innehållsleverantör_Get(id).Single();

            InnehållsleverantörViewModel viewModel = Mapper.Map<StaffInnehållslevEditCreate, InnehållsleverantörViewModel>(leveratör);
            if (errorMessages != null)
                viewModel.addErrorMessages(errorMessages);
            
            // Kontrollera om fiktivt org nr eller ej
            // Tilldela värde till rätt textbox
            viewModel.OrgNr = orgNr;

            if (orgNr.Length > 9)
            {
                var fiktivt = db.FictiveOrgNr.FirstOrDefault(m => m.FictiveOrgNr1 == orgNr);

                if (fiktivt != null)
                    viewModel.UtländsktOrgNr = fiktivt.ForeignOrgNr;
            }

            viewModel.ContentProviderId = id;
            viewModel.IsEditForm = true;
            
            return View(viewModel);
        }

        [HttpPost]
		[ValidateAntiForgeryToken]
		[Authorize(Roles = RoleHelper.Leverantörsinformation + ", " + RoleHelper.Administratör)]
		public virtual ActionResult Innehållsleverantör_Edit(InnehållsleverantörViewModel viewModel, decimal id)
        {
            viewModel.IsEditForm = true;
			staffService.Innehållsleverantör_Edit(id, viewModel.Bolagsnamn, leverantörsinformationHelper.removeHyphen(viewModel.OrgNr), viewModel.CoAdress, viewModel.Adress, viewModel.PostNr, viewModel.Ort, viewModel.Land, viewModel.Epost, viewModel.Webadress, viewModel.VATNR, CookieHelper.GetUserDisplayName());
            return RedirectToAction("Innehållsleverantörer");
        }

        [HttpGet]
		[Authorize(Roles = RoleHelper.Leverantörsinformation + ", " + RoleHelper.Administratör)]
		public virtual ActionResult Innehållsleverantör_Create()
        {
            InnehållsleverantörViewModel viewModel = new InnehållsleverantörViewModel();
            // Om false så vill vi inte visa labels för skapad osv.
            viewModel.IsEditForm = false;
            return View(viewModel);
        }

        [HttpPost]
		[ValidateAntiForgeryToken]
		[Authorize(Roles = RoleHelper.Leverantörsinformation + ", " + RoleHelper.Administratör)]
        public virtual ActionResult Innehållsleverantör_Create(InnehållsleverantörViewModel viewModel)
        {
            if (viewModel.OrgNrTyp)
            {
                // Om utländsk organisationsnummer är angett så vill vi ta bort required från OrgNr 
                ModelState.Remove("OrgNr");
            }
            else
            {
                // Annars vill vi ta bort reuired från utländskt org nr
                ModelState.Remove("UtländsktOrgNr");
            }
            if (!ModelState.IsValid)
            {
                
                return (View(viewModel));
            }
            
            if (viewModel.OrgNrTyp)
            {
                // Utländsk organisationsnummer
                var senasteFiktivaOrgNr = db.FictiveOrgNr.OrderByDescending(i => i.Counter).First();

                var fiktivtOrgNr = db.FictiveOrgNr.Add(new FictiveOrgNr());
                fiktivtOrgNr.Counter = senasteFiktivaOrgNr.Counter + 1;
                fiktivtOrgNr.ForeignOrgNr = viewModel.UtländsktOrgNr;
                fiktivtOrgNr.SkapadDatum = DateTime.Now;

                string strBuilder = senasteFiktivaOrgNr.Counter.ToString("D5");
                string strOrgNr = string.Format("0092{0}", strBuilder);
                int kontrollsiffra = KontrollSiffra_Calculate(strOrgNr);
                strOrgNr += kontrollsiffra.ToString();

                fiktivtOrgNr.FictiveOrgNr1 = strOrgNr;
                viewModel.OrgNr = fiktivtOrgNr.FictiveOrgNr1;
                viewModel.IsEditForm = false;

                try
                {
                    db.SaveChanges();
                }
                catch (Exception ex)
                {
                  
                    log.Error("Failed to create user.", ex);
                }

            }

			staffService.Innehållsleverantör_Edit(0, viewModel.Bolagsnamn, leverantörsinformationHelper.removeHyphen(viewModel.OrgNr), viewModel.CoAdress, viewModel.Adress, viewModel.PostNr, viewModel.Ort, viewModel.Land, viewModel.Epost, viewModel.Webadress, viewModel.VATNR, CookieHelper.GetUserDisplayName());

            return RedirectToAction("Innehållsleverantörer");
        }

        [Authorize(Roles = RoleHelper.Administratör + ", " + RoleHelper.Leverantörsinformation)]
        public virtual ActionResult Innehållsleverantör_Inactivate(string id)
        {
            List<string> errorMessages = new List<string>();

            StaffInnehållslevEditCreate leveratör = staffService.Innehållsleverantör_Get(Convert.ToDecimal(id)).Single();

            string result = staffService.Innehållsleverantör_Inactivate(Convert.ToDecimal(id));

            if (result == "OK")
            {
                return RedirectToAction("Index");
            }
            else if (result == "Innehållsleverantören har kopplingar till aktiva accesser, går ej att inaktivera!")
            {
                errorMessages.Add("Innehållsleverantören har kopplingar till aktiva accesser, du kan därför inte avsluta denna innehållsleverantör.");

                var routeValues = new RouteValueDictionary();
                routeValues.Add("id", id);
                routeValues.Add("orgNr", leveratör.CompanyId);

                return RedirectToAction("Innehållsleverantör_Edit", GeneralHelper.GetRouteList(errorMessages, "errorMessages", routeValues));
            }

            return RedirectToAction("Innehållsleverantör_Edit", new { id, orgNr = leveratör.CompanyId });
        }
		
        #endregion

        private int KontrollSiffra_Calculate(string orgnr)
        {
            int totalSiffra = 0;
            string kontrollSiffra; //Sätter kontrollsiffra till string så att jag ska kunna köra en substring på den 

            int raknaKontrollSiffra = 0;

            //Kontroll av kontrollsiffran enligt 21algoritm 
            for (int i = 0; i <= 8; i++)
            {   //Deklarerar valSiffra
                int valSiffra;


                //hämtar ut en siffra ur personnumret. Från första siffran till sista.
                valSiffra = Convert.ToInt32(orgnr.ToString().Substring(i, 1)); //Gör om första tecknet till en siffra

                /*If-villkor kollar om i är jämnt eller inte (pga algoritmen)
                 *Var och varannat tal i personnumret ska multipliceras med 2 och 1.
                 */
                if (i % 2 == 0)
                {
                    //Om i är ett jämnt nummer, ska det multipliceras med 2.
                    valSiffra = valSiffra * 2;

                    // Om talet är två-siffrigt efter multiplikation sker detta:
                    if (valSiffra >= 10)
                    {
                        int valSiffra1;
                        int valSiffra2;
                        String sub = Convert.ToString(valSiffra);
                        valSiffra1 = Convert.ToInt32(sub.Substring(0, 1)); //tar ut första siffran i talet
                        valSiffra2 = Convert.ToInt32(sub.Substring(1, 1)); //tar ut andra siffran i talet
                        valSiffra = valSiffra1 + valSiffra2; //De två siffrorna läggs ihop
                    }

                }
                else
                {
                    // Händer inget, då algoritmen säger att varannat tal ska multipliceras med 1

                }
                //Allt läggs ihop i en klumpsumma.        
                totalSiffra = totalSiffra + valSiffra;

                //Sätter kontrollsiffra = totalsiffra och string
                kontrollSiffra = totalSiffra.ToString();
                //Tar sista värdet från kontrollsiffra
                kontrollSiffra = kontrollSiffra.Substring(kontrollSiffra.Length - 1, 1);
                //Konverterar den till int för att kunna göra metoden nedan
                raknaKontrollSiffra = Convert.ToInt32(kontrollSiffra);
                //Tar min kontrollsiffra -10 och får ut min kontrollsiffra till --> raknaKontrollSiffra
                raknaKontrollSiffra = 10 - raknaKontrollSiffra;
            }

            return raknaKontrollSiffra;
        }

        [HttpPost]
		[Authorize (Roles = RoleHelper.Leverantörsinformation)]
		public virtual ActionResult Get_OrgNr(string orgNr)
        {
            orgNr = orgNr.Replace("-", "");

            var bolag = staffService.Innehållsleverantörer_Get_List().SingleOrDefault(m => m.CompanyId == orgNr);

            if (bolag == null)
                return Json(new { orgNamn = "Innehållsleverantör ej upplagd", contentProviderTfn = "Innehållsleverantör ej upplagd" });
            else
                return Json(new { orgNamn = bolag.Name, contentProviderTfn = bolag.ContentProviderTfn, orgNr });
        }

    }
}