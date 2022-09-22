using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using Sigma.Utils.Helpers;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Multistyrning
{
    public class MultistyrningsalternativViewModel : BaseViewModel
    {
        [Display(Name = "Namn")]
		[RegularExpression(ValidationHelper.TextValidation, ErrorMessage = ValidationHelper.TextValidationErrorMessage)]
        [Required (ErrorMessage = "Namn är obligatoriskt")]
		[StringLength (50, ErrorMessage = "Maxlängd för Namn är 50 tecken")]
        public string MultistyrningsAlternativ { get; set; }

        public decimal CustomerId { get; set; }

        [Display(Name = "Abonnemang")]
        public string Abonnemang { get; set; }

        public decimal MultistyrningsId { get; set; }

        public decimal ServiceIdAbonnemang { get; set; }

        public decimal ServiceIdStyrning { get; set; }

        public string[] Styrningar { get; set; }

        public string[] StyrningarNamn { get; set; }

        public List<KeyValuePair<decimal, string>> AbonnemangLista { get; set; }
        public List<KeyValuePair<decimal, IEnumerable<SelectListItem>>> Multistyrningar { get; set; }
        //public List<MultistyrningsalternativRow> MultistyrningsalternativRow { get; set; }
    }
}