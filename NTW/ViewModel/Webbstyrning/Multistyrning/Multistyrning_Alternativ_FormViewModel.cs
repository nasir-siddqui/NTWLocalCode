using System.Collections.Generic;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Multistyrning
{
	public class Multistyrning_Alternativ_FormViewModel : BaseViewModel
	{
		public decimal VIPMultiConnectedId { get; set; }
		public string Namn { get; set; }

		public List<Multistyrning_Alternativ_Abonnemang> abonnemangList { get; set; }
	}
}