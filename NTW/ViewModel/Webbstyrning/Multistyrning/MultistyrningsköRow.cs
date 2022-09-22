using System;
using Sigma.Utils.Attributes;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Multistyrning
{
    public class MultistyrningsköRow
    {
		[ExcludeFromExcel]
        public decimal KöVIPMultiConnectedId { get; set; }

        public DateTime? BegärtDatum { get; set; }
        public string Namn { get; set; }
        public DateTime? VerkställtDatum { get; set; }
    }
}