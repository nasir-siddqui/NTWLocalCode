using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using Sigma.Utils.Attributes;
using Telia.NTW.Core.Enums;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Webbstyrning
{
    public class KöEditViewModel : BaseViewModel
    {
        public decimal CustomerId { get; set; }
        public decimal ServiceId { get; set; }

		public decimal? StyrningsId { get; set; }

		//[Required(ErrorMessage = "Styrningsalternativ är obligatoriskt")]
		[RequiredWithMessage]
        public decimal? AlternativId { get; set; }

		[DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd hh:mm}")]
		[RequiredIf("Inkopplingstyp", Comparison.IsEqualTo, Inkopplingstyp.BegärtDatum)]
        [FutureDate]
        public DateTime? BegärtDatum { get; set; }

        public Inkopplingstyp Inkopplingstyp { get; set; }
        public string Abonnemang { get; set; }

        public bool CreatingNew { get; set; }

        public SelectList StyrningsalternativList { get; set; }

	    public KöEditViewModel()
	    {
		    Inkopplingstyp = Inkopplingstyp.BegärtDatum;
	    }
    }
}