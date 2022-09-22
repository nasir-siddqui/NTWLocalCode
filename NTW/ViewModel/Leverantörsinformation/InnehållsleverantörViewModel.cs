using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Sigma.Utils.Helpers;

namespace Telia.NTW.Web.ViewModel.Leverantörsinformation
{
    public class InnehållsleverantörViewModel : BaseViewModel
    {
        public string CompanyId { get; set; }

        [RegularExpression(ValidationHelper.OrgNrValidation, ErrorMessage = ValidationHelper.OrgNrValidationErrorMessage)]
        [Required(ErrorMessage = "Org Nr är obligatoriskt")]
        [Display(Name = "Org Nr:*")]
        public string OrgNr { get; set; }

        [RegularExpression(ValidationHelper.OrgNrValidation, ErrorMessage = ValidationHelper.OrgNrValidationErrorMessage)]
        [Required(ErrorMessage = "Utländskt org nr är obligatoriskt")]
        public string UtländsktOrgNr { get; set; }

        [RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        [Display(Name = "Utländskt org Nr:*")]
        public bool OrgNrTyp { get; set; }

        [RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        [Required(ErrorMessage = "Bolagsnamn är obligatoriskt")]
        [StringLength(30, ErrorMessage = "Maxlängd för Bolagsnamn är 30 tecken")]
        [Display(Name = "Bolagsnamn:*")]
        public string Bolagsnamn { get; set; }

        [RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        [StringLength(55, ErrorMessage = "Maxlängd för c/o är 55 tecken")]
        [Display(Name = "c/o:")]
        public string CoAdress { get; set; }

        [RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        [StringLength(55, ErrorMessage = "Maxlängd för Adress är 55 tecken")]
        [Display(Name = "Adress:")]
        public string Adress { get; set; }

        [RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        [StringLength(10, ErrorMessage = "Maxlängd för PostNr är 10 tecken")]
        [Display(Name = "PostNr:")]
        public string PostNr { get; set; }

        [RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        [Required(ErrorMessage = "Ort är obligatoriskt")]
        [StringLength(30, ErrorMessage = "Maxlängd för Ort är 30 tecken")]
        [Display(Name = "Ort:*")]
        public string Ort { get; set; }

        [RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        [StringLength(20, ErrorMessage = "Maxlängd för Land är 20 tecken")]
        [Display(Name = "Land:")]
        public string Land { get; set; }

        [RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        [StringLength(30, ErrorMessage = "Maxlängd för E-post är 30 tecken")]
        [Display(Name = "E-post:")]
        public string Epost { get; set; }

        [RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        [StringLength(80, ErrorMessage = "Maxlängd för Webadress är 80 tecken")]
        [Display(Name = "Webadress:")]
        public string Webadress { get; set; }

        [RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        [Required]
        [StringLength(15, ErrorMessage = "Maxlängd för VAT-Nr är 15 tecken")]
        [Display(Name = "VAT-nr:*")]
        public string VATNR { get; set; }

        public decimal ContentProviderId { get; set; }

        public decimal AccessId { get; set; }
        public string AccessNo { get; set; }

        public DateTime GiltigFrom { get; set; }

        public DateTime SenasteUppdaterad { get; set; }

        public bool IsEditForm { get; set; }

        public List<InnehållsleverantörRow> Innehållsleverantörer { get; set; }
    }
}