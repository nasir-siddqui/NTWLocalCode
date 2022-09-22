using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using Sigma.Utils.Helpers;
using Telia.NTW.Web.Enums;
using Telia.NTW.Core.Entities;
using Telia.NTW.Web.ViewModel.Shared.EditorTemplateModels;

namespace Telia.NTW.Web.ViewModel.Analys
{
	public class AnalysFilterViewModel : BaseViewModel
	{
		[Display(Name = "Abonnemang")]
		public int SelectedAbonnemangId { get; set; }
		public IEnumerable<SelectListItem> AbonnemangItems { get; set; }
		public AnalysAbonnemang abonnemang { get; set; }
		public IEnumerable<CheckboxModel> UpptagningsomradeList { get; set; }
		public IEnumerable<CheckboxModel> SvarsstalleList { get; set; }
		[Display(Name = "Från")]
		public DateTime? FrånDatum { get; set; }
		[Display(Name = "Till")]
		[RegularExpression(ValidationHelper.ShortDateTimeValidation, ErrorMessage = ValidationHelper.ShortDateTimeValidationErrorMessage)]
		public DateTime? TillDatum { get; set; }
		public FilterTyp FilterTyp { get; set; }
        public IEnumerable<FilterTyp> DisabledFilterTypeList { get; set; }
        public bool SvarsstalleAlla { get; set; }
        public bool UpptagningsomradeAlla { get; set; }
	}
}