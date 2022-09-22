using System;
using Sigma.Utils.Attributes;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Webbstyrning
{
    public class StyrningsköRow
    {
		[ExcludeFromExcel]
		public decimal AlternativId { get; set; }

		[ExcludeFromExcel]
		public decimal StyrningsId { get; set; }

        public DateTime? BegärtDatum { get; set; }
        public string Benämning { get; set; }
        public DateTime? VerkställtDatum { get; set; }
        public bool DelAvMultistyrning { get; set; }
    }
}