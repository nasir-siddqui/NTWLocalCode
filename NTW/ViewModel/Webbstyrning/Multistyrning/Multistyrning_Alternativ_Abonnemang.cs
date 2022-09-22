using System.Collections.Generic;
using System.Web.Mvc;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Multistyrning
{
	public class Multistyrning_Alternativ_Abonnemang
	{
		public decimal VIPMultiConnectedLinkId { get; set; }

		public decimal ServiceId { get; set; }
		public string Abonnemang { get; set; }
		
		public decimal? ConnectLinkId { get; set; }
		public List<SelectListItem> StyrningsalternativList { get; set; }

		[AdditionalMetadata("OnValue", "Kopplat")]
		[AdditionalMetadata("OffValue", "Okoppl.")]
		public bool Kopplat { get; set; }

		public Multistyrning_Alternativ_Abonnemang()
		{
			Kopplat = false;
		}
	}
}