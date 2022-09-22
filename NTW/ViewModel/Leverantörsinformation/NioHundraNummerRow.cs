using System.ComponentModel.DataAnnotations;
using Sigma.Utils.Attributes;
using Sigma.Utils.Helpers;

namespace Telia.NTW.Web.ViewModel.Leverantörsinformation
{
    public class NioHundraNummerRow : BaseViewModel
    {
		[ExcludeFromExcel]
        public decimal AccessId { get; set; }
        public string Nummer { get; set; }

        [ExcludeFromExcel]
		[RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        [Required(ErrorMessage = "Bolagsnamn är obligatoriskt")]
        [StringLength(30, ErrorMessage = "Maxlängd för Bolagsnamn är 30 tecken")]
        public string Bolagsnamn { get; set; }

		[ExcludeFromExcel]
        public decimal ContentProviderId { get; set; }

        public string Tjänst { get; set; }

		[RegularExpression(ValidationHelper.OrgNrValidation, ErrorMessage = ValidationHelper.OrgNrValidationErrorMessage)]
        public string Organisationsnummer { get; set; }

        [ExcludeFromExcel]
		[RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        public string Kundtjänstnummer { get; set; }
    }
}