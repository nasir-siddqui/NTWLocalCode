using System.ComponentModel.DataAnnotations;
using Sigma.Utils.Helpers;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Webbstyrning
{
	public class StyrningsalternativBaseViewModel : BaseViewModel
	{
		public string abonnemang { get; set; }

		public decimal serviceId { get; set; }

		public decimal? connectLinkId { get; set; }

		[RegularExpression(ValidationHelper.PhoneNumberValidation, ErrorMessage = ValidationHelper.NumberValidationErrorMessage)]
		[Display (Name = "Löpnummer")]
		public int? lopnummer { get; set; }

		[RegularExpression(ValidationHelper.PhoneNumberValidation, ErrorMessage = ValidationHelper.NumberValidationErrorMessage)]
		[Display (Name = "Alternativnummer")]
		public string alternativnummer { get; set; }

		[Display (Name = "Styrning")]
		public string namn { get; set; }

		[RegularExpression(ValidationHelper.PhoneNumberValidation, ErrorMessage = ValidationHelper.NumberValidationErrorMessage)]
		[Display (Name = "Index")]
		public string index { get; set; }

		public string status { get; set; }

		[Display (Name = "Kopiera: ")]
		public int chosenStyrningsalternativForCopy { get; set; }
	}
}