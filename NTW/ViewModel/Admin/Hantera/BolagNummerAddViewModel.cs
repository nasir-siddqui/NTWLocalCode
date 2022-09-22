using System.ComponentModel.DataAnnotations;
using Sigma.Utils.Helpers;

namespace Telia.NTW.Web.ViewModel.Admin.Hantera
{
	public class BolagNummerAddViewModel : BaseViewModel
	{
		public int CompanyId { get; set; }
		public string Bolagsnamn { get; set; }
		[RegularExpression(ValidationHelper.PhoneNumberValidation, ErrorMessage = ValidationHelper.PhoneNumberValidationErrorMessage)]
        [Display(Name = "Nummer (exempelvis 08xxxxxxxx)")]
        public string Nummer { get; set; }
        public bool NumberExists { get; set; }
        public bool AcceptMoveNumber { get; set; }
        public string ExistsOnCurrentCompany { get; set; }
	}
}