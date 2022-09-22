using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Telia.NTW.Web.Enums;

namespace Telia.NTW.Web.ViewModel.Admin.Meddelanden
{
	public class MeddelandeViewModel : BaseViewModel
	{
        public MeddelandeViewModel()
        {
            From = DateTime.Now;
            To = DateTime.Now;
        }

		public int Id { get; set; }
		//[Required]
		[Display(Name = "Typ")]
		public MeddelandeType Type { get; set; }

        [Required(ErrorMessage = "Fältet är obligatoriskt")]
        //[RegularExpression(InputValidationTime, ErrorMessage = InputValidationTimeErrorMessage)]
		[Display(Name = "Från")]
		public DateTime From { get; set; }

        [Required(ErrorMessage = "Fältet är obligatoriskt")]
		[Display(Name = "Till")]
		//[IsDateTimeAfter("From")]
		public DateTime To { get; set; }

        [Required(ErrorMessage = "Fältet är obligatoriskt")]
		[Display(Name="Meddelande")]
		public string Text { get; set; }

		[Display(Name = "Visa för roller")]
		public List<string> VisibleForRoles { get; set; }

        [Display(Name = "Analys")]
        public bool AnalysActive { get; set; }
        [Display(Name = "Webbstyrning")]
        public bool WebbstyrningActive { get; set; }
        [Display(Name = "Webbstyrning multistyrning")]
        public bool WebbstyrningMultistyrning { get; set; }
        [Display(Name = "Leverantörsinformation")]
        public bool LeverantörsinformationActive { get; set; }
        [Display(Name = "Admin")]
        public bool AdminActive { get; set; }
	}
}