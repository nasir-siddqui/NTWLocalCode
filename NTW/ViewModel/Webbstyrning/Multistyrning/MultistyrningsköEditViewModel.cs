using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using Sigma.Utils.Attributes;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Multistyrning
{
    public class MultistyrningsköEditViewModel : BaseViewModel
    {
		public decimal? KöVIPMultiConnectedId { get; set; }

        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd hh:mm}")]
		[RequiredIf("SåSnartSomMöjligt", Comparison.IsEqualTo, false)]
        [FutureDate]
        public DateTime? BegärtDatum { get; set; }
        public DateTime? OldBegärtDatum { get; set; }

		[RequiredWithMessage]
        public decimal? AlternativVIPMultiConnectedId { get; set; }

        public bool SåSnartSomMöjligt { get; set; }

        public IEnumerable<SelectListItem> AlternativList { get; set; }

        public MultistyrningsköEditViewModel()
        {
            SåSnartSomMöjligt = false;
        }
    }
}