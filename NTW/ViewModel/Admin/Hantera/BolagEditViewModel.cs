using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using Sigma.Utils.Helpers;

namespace Telia.NTW.Web.ViewModel.Admin.Hantera
{
	public class BolagEditViewModel : BaseViewModel
	{
		public const string BolagAlreadyExistsErrorMsg = "Bolag med angivet OrgNr existerar redan";

		public int? CompanyId { get; set; }

		[Display (Name = "Organisationsnummer*")]
		[RegularExpression(ValidationHelper.OrgNrValidation, ErrorMessage = ValidationHelper.OrgNrValidationErrorMessage)]
		[Required(ErrorMessage = "Organisationsnummer är obligatoriskt")]
		public string OrgNr { get; set; }

		[RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
		[Display(Name = "Bolagsnamn*")]
		[Required(ErrorMessage = "Bolagsnamn är obligatoriskt")]
		[StringLength(70, ErrorMessage = "Maxlängd för Bolagsnamn är 70 tecken")]
		public string Bolagsnamn { get; set; }

		[Display (Name = "Koncern")]
		public int? GroupId { get; set; }

		[RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
		[StringLength(50, ErrorMessage = "Maxlängd för Land är 50 tecken")]
		public string Land { get; set; }

		[Display (Name = "Analys")]
		public bool AnalysActive { get; set; }

		[RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
		[Display (Name = "Kontaktperson")]
		public int? AnalysContactUserId { get; set; }

		[Display(Name = "Webstyrning")]
		public bool WebstyrningActive { get; set; }

		[Display(Name = "Kontaktperson")]
		public int? WebstyrningContactUserId { get; set; }

		[Display(Name = "Utökad Multistyrning")]
		public bool WebstyrningMultistyrningActive { get; set; }

		[RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
		[Display(Name = "Nyckel")]
		[StringLength(200, ErrorMessage = "Maxlängd för Nyckel är 200 tecken")]
		public string WebstyrningNyckel { get; set; }

		[Display(Name = "Leverantörsinformation")]
		public bool LevinfoActive { get; set; }

		[Display(Name = "Kontaktperson")]
		public int? LevinfoContactUserId { get; set; }

        public bool OrgNrExists { get; set; }
        public bool EditMode { get; set; }

		public List<NummerListRowModel> nummerList { get; set; }

		public SelectList KoncernSelectList { get; set; }
		public SelectList ContactSelectList { get; set; }
	}
}