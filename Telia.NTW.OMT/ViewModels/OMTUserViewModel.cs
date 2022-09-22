using System.ComponentModel.DataAnnotations;
using Sigma.Utils.Attributes;

namespace Telia.NTW.OMT.ViewModels
{
	public class OMTUserViewModel
	{
		public int? UserId { get; set; }

		[RequiredWithMessage]
		public string AnvändarID { get; set; }

		// Används inte för närvarande
		public string Username { get; set; }

		[OrgNr]
		[RequiredWithMessage]
		public string Organisationsnummer { get; set; }

		[Text]
		[StringLengthWithMessage(50)]
		[RequiredWithMessage]
		public string Namn { get; set; }

		[Email]
		[StringLengthWithMessage(50)]
		[RequiredWithMessage]
		public string Email { get; set; }

		[PhoneNumber]
		[StringLengthWithMessage(30)]
		[RequiredWithMessage]
		public string Telefon { get; set; }

		[Display(Name = "Analys")]
		public bool UserAnalys { get; set; }
		[Display(Name = "Webbstyrning Läs")]
		public bool UserWebbstyrningLäs { get; set; }
		[Display(Name = "Webbstyrning Skriv")]
		public bool UserWebbstyrningSkriv { get; set; }
		[Display(Name = "Multistyrning")]
		public bool UserMultistyrning { get; set; }
		[Display(Name = "Leverantörsinformation")]
		public bool UserLeverantörsinformation { get; set; }
	}
}