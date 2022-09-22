using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Sigma.Utils.Helpers;
using Telia.NTW.Web.Enums;
using System.Web.Mvc;
using Telia.NTW.Core.Entities;

namespace Telia.NTW.Web.ViewModel.Admin.Hantera
{
    public class RedigeraAnvändareViewModel : BaseViewModel
    {
		public const string AnvändareAlreadyExistsErrorMsg = "Användare med angivet AnvändarID existerar redan";

        [Display(Name = "Skapad:")]
        public DateTime? Skapad { get; set; }

		[Display (Name = "Senast ändrad:")]
        public DateTime? SenastÄndrad { get; set; }

        [Display(Name = "Senast inloggad:")]
        public DateTime? SenastInloggad { get; set; }

        public int UserID { get; set; }

		[RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        [Required]
        [Display(Name = "AnvändarID*")]
		[StringLength (50, ErrorMessage = "Maxlängd för AnvändarID är 50 tecken")]
        public string AnvändarID { get; set; }

		[RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        [Required]
        [Display(Name = "Namn*")]
		[StringLength (50, ErrorMessage = "Maxlängd för Namn är 50 tecken")]
        public string Namn { get; set; }

        public string Bolagsnamn { get; set; }

        public string OrgNr { get; set; }

		[RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        [Required]
        [Display(Name = "Telefon*")]
		[StringLength (30, ErrorMessage = "Maxlängd för Telefon är 30 tecken")]
        public string Telefon { get; set; }

		[RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        [Required]
        [Display(Name = "Email*")]
		[StringLength (50, ErrorMessage = "Maxlängd för Email är 50 tecken")]
        public string Email { get; set; }

		[StringLength (255, ErrorMessage = "Maxlängd för Notering är 255 tecken")]
        public string Notering { get; set; }

        [Display(Name = "Användartyp")]
        public Användartyper Användartyper { get; set; }

        [Display(Name = "Analys")]
        public bool AnalysActive { get; set; }
        [Display(Name = "Webbstyrning")]
        public bool WebbstyrningLäsActive { get; set; }
        [Display(Name = "Webbstyrning skriv")]
        public bool WebbstyrningSkrivActive { get; set; }
        [Display(Name = "Webbstyrning multistyrning")]
        public bool WebbstyrningMultistyrning { get; set; }
        [Display(Name = "Leverantörsinformation")]
        public bool LeverantörsinformationActive { get; set; }
        [Display(Name = "Mailmottagare (checka för denna om du vill skicka en bekräftelse till användaren)")]
        public bool Mailmottagare { get; set; }
        public int CompanyId { get; set; }
        public int UserCompanyId { get; set; }

        public bool AdminOrSalesOrg { get; set; }

        public ICollection<Role> Roles { get; set; }

        public SelectList BolagSelectList { get; set; }

        public bool ExistingUser { get; set; }
    }
}