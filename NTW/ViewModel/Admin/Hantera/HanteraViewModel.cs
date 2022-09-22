using System.Collections.Generic;

namespace Telia.NTW.Web.ViewModel.Admin.Hantera
{
	public class HanteraViewModel : BaseViewModel
	{
		public List<AnvändareRow> Användare { get; set; }
        public List<BolagListRow> Bolag { get; set; }
		public List<Koncern> Koncerner { get; set; }

		public bool HideResult { get; set; }
		public string Search { get; set; }
	}
}